"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import clienteApi from "../../api/clienteApi";
import TicketTimelineModal from "./TicketTimelineModal";
import { CircleAlert, Search, Wrench, FlaskConical, CheckCircle } from "lucide-react";

// Configuración de estados (igual que en page.jsx del técnico)
const ESTADO_CONFIG = {
  1: { label: "Abierto", color: "bg-red-100 text-red-800", icon: CircleAlert },
  2: { label: "En diagnóstico", color: "bg-orange-100 text-orange-800", icon: Search },
  3: { label: "En reparación", color: "bg-yellow-100 text-yellow-800", icon: Wrench },
  4: { label: "Pruebas", color: "bg-blue-100 text-blue-800", icon: FlaskConical },
  5: { label: "Finalizado", color: "bg-green-100 text-green-800", icon: CheckCircle },
};

// Normalizador por nombre → id
const NAME_TO_ID = {
  abierto: 1,
  "en diagnóstico": 2,
  "en diagnostico": 2,
  "en reparación": 3,
  "en reparacion": 3,
  pruebas: 4,
  "en pruebas": 4,
  finalizado: 5,
};

export default function TicketsCliente() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Función para formatear el número del ticket
  const formatTicketNumber = (ticket) => {
    const date = new Date(ticket.creado_en || ticket.fecha || Date.now());
    const year = date.getFullYear();
    const paddedId = String(ticket.id ?? "").padStart(3, "0");
    return `#TK-${year}-${paddedId}`;
  };

  // Función para resolver el ID del estado
  const resolveEstadoId = (ticket) => {
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
  };

  useEffect(() => {
    if (!user) {
      console.log("⚠ No hay usuario aún...");
      return;
    }

    const fetchTickets = async () => {
      try {
        console.log("Usuario en tickets_cliente:", user);

        const response = await clienteApi.get(
          `/tickets/consulta/?user_document=${user.document}`
        );

        console.log("✔ Tickets:", response.data);
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("❌ Error al traer los tickets del cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B6CB0]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Tickets</h1>
        <div className="text-sm text-gray-500">Total: {tickets.length} tickets</div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No has creado ningún ticket.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 max-w-6xl">
          {tickets.map((ticket) => {
            const estadoId = resolveEstadoId(ticket);
            const estadoCfg = ESTADO_CONFIG[estadoId] || ESTADO_CONFIG[1];
            const EstadoIcon = estadoCfg.icon;

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
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
                          Creado: {formatearFecha(ticket.creado_en || ticket.fecha)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setShowModal(true);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver progreso del ticket
                  </button>

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
      )}
      {showModal && (
        <TicketTimelineModal
          ticketId={selectedTicketId}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}
