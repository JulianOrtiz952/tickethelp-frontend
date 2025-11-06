"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { CircleAlert, Search, Wrench, FlaskConical, CheckCircle, ChevronDown, Loader2 } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { api } from "../../api/client"

// ------------------------- Config de estados -------------------------
const ESTADO_CONFIG = {
  1: { label: "Abierto",        color: "bg-red-100 text-red-800",    icon: CircleAlert },
  2: { label: "En diagnóstico", color: "bg-orange-100 text-orange-800", icon: Search },
  3: { label: "En reparación",  color: "bg-yellow-100 text-yellow-800", icon: Wrench },
  4: { label: "Pruebas",        color: "bg-blue-100 text-blue-800",  icon: FlaskConical },
  5: { label: "Finalizado",     color: "bg-green-100 text-green-800", icon: CheckCircle }, // por si llega desde el backend
}

// Normalizador por nombre → id (por si backend manda string)
const NAME_TO_ID = {
  abierto: 1,
  "en diagnóstico": 2,
  "en diagnostico": 2,
  "en reparación": 3,
  "en reparacion": 3,
  pruebas: 4,
  finalizado: 5,
}

// Orden/flujo activo para el técnico (sin saltos ni aprobaciones)
const ACTIVE_STATES = [1, 2, 3, 4] // Sin 5 (Finalizado)

// ------------------------- Helpers -------------------------
function resolveEstadoId(ticket) {
  const e = ticket?.estado
  if (typeof e === "number") return e
  if (e?.id) return e.id
  if (e?.nombre) {
    const id = NAME_TO_ID[e.nombre.toLowerCase()]
    return id ?? 1
  }
  if (typeof e === "string") {
    const id = NAME_TO_ID[e.toLowerCase()]
    return id ?? 1
  }
  return 1
}

function nextStateFrom(currentId) {
  const idx = ACTIVE_STATES.indexOf(currentId)
  return ACTIVE_STATES[idx + 1] ?? null // null si ya no hay siguiente
}

function formatTicketNumber(ticket) {
  const date = new Date(ticket.creado_en || ticket.fecha || Date.now())
  const year = date.getFullYear()
  const paddedId = String(ticket.id ?? "").padStart(3, "0")
  return `#TK-${year}-${paddedId}`
}

function formatDate(d) {
  try {
    const date = new Date(d)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return "—"
  }
}

function readJwtPayload() {
  try {
    const token = sessionStorage.getItem("access") || localStorage.getItem("access")
    if (!token) return {}
    const [, b64] = token.split(".")
    if (!b64) return {}
    return JSON.parse(atob(b64))
  } catch {
    return {}
  }
}

// Función para validar si un estado es "terminal" (no permite más cambios)
function isTerminalState(stateId) {
  return stateId === 5 // 5 es "Finalizado"
}

// ------------------------- Modal simple -------------------------
function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ------------------------- Página del técnico -------------------------
export default function TicketsTecnicoPage() {
  const { user, isAuthed } = useAuth()

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTicket, setModalTicket] = useState(null)
  const [toState, setToState] = useState(null)
  const [saving, setSaving] = useState(false)

  // 🔁 clave de refresco para re-consultar después de cambios
  const [refreshKey, setRefreshKey] = useState(0)

  // Identificadores del técnico para querystring
  const techIdentifier = useMemo(() => {
    const p = readJwtPayload()
    const document =
      user?.document ||
      user?.documento ||
      user?.cedula ||
      user?.profile?.documento ||
      p?.document ||
      p?.documento ||
      null

    const id = user?.id || user?.user_id || user?.pk || p?.user_id || p?.id || p?.pk || null

    const email = user?.email || p?.email || null
    return { document, id, email }
  }, [user])

  // fetchTickets estable con useCallback
  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError("")

    const qs = new URLSearchParams()
    if (techIdentifier.document) {
      qs.set("user_document", techIdentifier.document)
    } else if (techIdentifier.id) {
      qs.set("assigned_to", techIdentifier.id)
    } else if (techIdentifier.email) {
      qs.set("email", techIdentifier.email)
    } else {
      setLoading(false)
      throw new Error("No se encontró un identificador del técnico (documento, id o email).")
    }

    const data = await api(`/api/tickets/consulta/?${qs.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    setTickets(Array.isArray(data) ? data : data?.results || data?.tickets || [])
    setLoading(false)
  }, [techIdentifier.document, techIdentifier.id, techIdentifier.email])

  // Carga inicial + recargas controladas por refreshKey
  useEffect(() => {
    if (!isAuthed) {
      setError("No hay usuario autenticado.")
      setLoading(false)
      return
    }
    fetchTickets().catch((e) => {
      console.error("[TicketsTecnico] error:", e)
      setError(e?.message || "Error al cargar tickets")
      setLoading(false)
    })
  }, [isAuthed, fetchTickets, refreshKey])

  function openChangeState(ticket) {
    const currentId = resolveEstadoId(ticket)
    if (isTerminalState(currentId)) return

    const ns = nextStateFrom(currentId)
    if (!ns) return
    setModalTicket(ticket)
    setToState(ns)
    setModalOpen(true)
  }

  async function submitChangeState() {
    if (!modalTicket || !toState) return
    setSaving(true)

    const path = `/api/tickets/change-state/${modalTicket.id}/` // ← sin QS

    try {
      // Nota: algunos backends responden 204 sin cuerpo
      const res = await api(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ to_state: toState }),
      })

      // Si el back devolvió el estado, lo tomamos; si no, forzamos sincronización
      const confirmedId = res?.estado?.id ?? res?.state ?? null

      if (confirmedId != null) {
        // update local mínimo para feedback instantáneo
        setTickets((prev) =>
          prev.map((t) =>
            t.id === modalTicket.id ? { ...t, estado: { ...(t.estado || {}), id: confirmedId } } : t
          )
        )
      }

      // 🔁 SIEMPRE re-consultamos para quedar 100% alineados con BD
      setRefreshKey((k) => k + 1)

      setModalOpen(false)
      setModalTicket(null)
      setToState(null)
    } catch (e) {
      console.error("[change-state] error:", e)
      setError(e?.message || "No fue posible cambiar el estado.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando tickets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="mt-3 px-3 py-1.5 rounded-md text-white"
          style={{ backgroundColor: "#4494AD" }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visualizar Tickets</h1>
        <div className="text-sm text-gray-500">Total: {tickets.length} tickets</div>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-6xl">
        {tickets.map((ticket) => {
          const estadoId = resolveEstadoId(ticket)
          const estadoCfg = ESTADO_CONFIG[estadoId] || ESTADO_CONFIG[1]
          const EstadoIcon = estadoCfg.icon
          const nextState = nextStateFrom(estadoId)
          const canAdvance = !isTerminalState(estadoId) && !!nextState

          return (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Encabezado */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    {formatTicketNumber(ticket)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span
                      className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${estadoCfg.color}`}
                    >
                      <EstadoIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {estadoCfg.label}
                    </span>
                    {(ticket.creado_en || ticket.fecha) && (
                      <span className="text-gray-600 text-xs sm:text-sm">
                        Creado: {formatDate(ticket.creado_en || ticket.fecha)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones del técnico */}
                <div className="flex gap-2">
                  <button
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      canAdvance
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => canAdvance && openChangeState(ticket)}
                    disabled={!canAdvance}
                    title={isTerminalState(estadoId) ? "Este ticket está finalizado y no puede cambiar de estado" : ""}
                  >
                    <ChevronDown className="w-4 h-4" />
                    Cambiar estado
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Información del Ticket</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Título:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{ticket.titulo || "—"}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Descripción:</span>
                      <p className="text-gray-800 text-sm sm:text-base">{ticket.descripcion || "—"}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Equipo:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{ticket.equipo || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: muestra ÚNICAMENTE el siguiente estado */}
      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={modalTicket ? `Cambiar estado de ${formatTicketNumber(modalTicket)}` : "Cambiar estado"}
      >
        {!!modalTicket && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nuevo estado</label>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                {ESTADO_CONFIG[toState]?.label ?? "—"}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg text-sm border"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60"
                onClick={submitChangeState}
                disabled={saving || !toState}
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Guardando…
                  </span>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
