"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

export default function TicketsAsignados() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const endpoint = "https://tickethelp-backend.onrender.com/api/tickets/consulta/?user_document=10049888"

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data && Array.isArray(data.tickets)) {
        setTickets(data.tickets)
      } else {
        setTickets([])
      }
    } catch (err) {
      let errorMessage = "Error desconocido"
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "La solicitud tardó demasiado. El servidor puede estar lento."
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "No se pudo conectar al servidor. Verifica tu conexión."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado) => {
    const colores = {
      1: "bg-red-100 text-red-800 border border-red-200", // Abierto
      2: "bg-yellow-100 text-yellow-800 border border-yellow-200", // En progreso
      3: "bg-blue-100 text-blue-800 border border-blue-200", // Pendiente
      4: "bg-green-100 text-green-800 border border-green-200", // Cerrado
    }
    return colores[estado] || "bg-gray-100 text-gray-800 border border-gray-200"
  }

  const getEstadoNombre = (estado) => {
    const nombres = {
      1: "Abierto",
      2: "En Progreso",
      3: "Pendiente",
      4: "Cerrado",
    }
    return nombres[estado] || "Sin estado"
  }

  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <p className="font-semibold text-lg">Error al cargar los tickets</p>
        <p className="text-sm mt-2">{error}</p>
        <button
          onClick={fetchTickets}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visualizar Tickets</h1>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{tickets.length} tickets</span>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No tienes tickets asignados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">#TK-2025-{ticket.id.toString().padStart(3, "0")}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(ticket.estado)}`}>
                    {getEstadoNombre(ticket.estado)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">Creado: {formatearFecha(ticket.creado_en)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Información del Ticket</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Título:</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.titulo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Descripción:</p>
                      <p className="text-sm text-gray-700">{ticket.descripcion || "Sin descripción"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Equipo:</p>
                      <p className="text-sm text-gray-700">{ticket.equipo || "No especificado"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Técnico Asignado</h4>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                      {ticket.tecnico?.charAt(0) || "T"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Técnico #{ticket.tecnico}</p>
                      <p className="text-xs text-gray-500">Técnico</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-600">Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Gestionar técnico
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
