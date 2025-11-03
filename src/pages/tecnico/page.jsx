"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, CircleAlert, Search, Wrench, FlaskConical, CheckCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";     
import { api } from "../../api/client";       

// ---------------- UI de estados (igual a admin) ----------------
const ESTADO_CONFIG = {
  1: { label: "Abierto",        color: "bg-red-100 text-red-800",     icon: CircleAlert },
  2: { label: "En diagnóstico", color: "bg-orange-100 text-orange-800", icon: Search },
  3: { label: "En reparación",  color: "bg-yellow-100 text-yellow-800", icon: Wrench },
  4: { label: "En pruebas",     color: "bg-blue-100 text-blue-800",   icon: FlaskConical },
  5: { label: "Finalizado",     color: "bg-green-100 text-green-800", icon: CheckCircle },
};

// Si el backend manda el estado como string/objeto, normalizamos aquí.
const NAME_TO_ID = {
  "abierto": 1,
  "en diagnóstico": 2,
  "en diagnostico": 2,
  "en reparación": 3,
  "en reparacion": 3,
  "en pruebas": 4,
  "finalizado": 5,
};

function resolveEstadoId(ticket) {
  const e = ticket?.estado;
  if (typeof e === "number") return e;
  if (e?.id) return e.id;
  if (e?.nombre) {
    const id = NAME_TO_ID[e.nombre.toLowerCase()];
    return id ?? 1;
  }
  if (typeof e === "string") {
    const id = NAME_TO_ID[e.toLowerCase()];
    return id ?? 1;
  }
  return 1;
}

function formatTicketNumber(ticket) {
  const year = new Date(ticket.creado_en || ticket.fecha).getFullYear();
  const paddedId = String(ticket.id).padStart(3, "0");
  return `#TK-${year}-${paddedId}`;
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function readJwtPayload() {
  try {
    const token = sessionStorage.getItem("access") || localStorage.getItem("access");
    if (!token) return {};
    const [, b64] = token.split(".");
    if (!b64) return {};
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
}

export default function TicketsTecnicoPage() {
  const { user, isAuthed } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Identificador del técnico (documento → id → email), combinando contexto + JWT
  const techIdentifier = useMemo(() => {
    const p = readJwtPayload();
    const document =
      user?.document || user?.documento || user?.cedula || user?.profile?.documento ||
      p?.document || p?.documento || null;

    const id =
      user?.id || user?.user_id || user?.pk ||
      p?.user_id || p?.id || p?.pk || null;

    const email = user?.email || p?.email || null;
    return { document, id, email };
  }, [user]);

  useEffect(() => {
    if (!isAuthed) {
      setError("No hay usuario autenticado.");
      setLoading(false);
      return;
    }
    fetchTickets().catch((e) => {
      console.error("[TicketsTecnico] error:", e);
      setError(e?.message || "Error al cargar tickets");
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, techIdentifier?.id, techIdentifier?.document, techIdentifier?.email]);

  async function fetchTickets() {
    setLoading(true);
    setError("");

    const qs = new URLSearchParams();
    if (techIdentifier.document) {
      qs.set("user_document", techIdentifier.document); 
    } else if (techIdentifier.id) {
      qs.set("assigned_to", techIdentifier.id);         
    } else if (techIdentifier.email) {
      qs.set("email", techIdentifier.email);
    } else {
      throw new Error("No se encontró un identificador del técnico (documento, id o email).");
    }

    const data = await api(`/api/tickets/consulta/?${qs.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    setTickets(Array.isArray(data) ? data : (data?.results || data?.tickets || []));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error al cargar los tickets</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => fetchTickets()}
          className="mt-3 px-3 py-1.5 rounded-md text-white"
          style={{ backgroundColor: "#4494AD" }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visualizar Tickets</h1>
        <div className="text-sm text-gray-500">Total: {tickets.length} tickets</div>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-6xl">
        {tickets.map((ticket) => {
          const estadoId = resolveEstadoId(ticket);
          const estadoCfg = ESTADO_CONFIG[estadoId] || ESTADO_CONFIG[1];
          const EstadoIcon = estadoCfg.icon;

          return (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Encabezado: número, estado, fecha */}
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

                {/* Acción del técnico (sin foto) */}
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                  
                >
                  <Plus className="w-4 h-4" />
                  Abrir ticket
                </button>
              </div>

              {/* Contenido: Información del Ticket (igual a admin) */}
              <div className="grid grid-cols-1">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Información del Ticket</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Título:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {ticket.titulo || "—"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Descripción:</span>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {ticket.descripcion || "—"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Equipo:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {ticket.equipo || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* En la vista del técnico NO mostramos "Técnico asignado" ni avatar */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
