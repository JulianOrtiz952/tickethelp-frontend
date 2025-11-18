"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import clienteApi from "../../api/clienteApi";
import TicketTimelineModal from "./TicketTimelineModal";

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

  // Función para obtener el color del estado basado en el nombre
  const getEstadoColor = (estadoNombre) => {
    if (!estadoNombre) return "bg-gray-100 text-gray-800";

    const nombreLower = estadoNombre.toLowerCase();
    const colores = {
      "abierto": "bg-red-100 text-red-800",
      "en diagnóstico": "bg-teal-100 text-teal-800",
      "en diagnostico": "bg-teal-100 text-teal-800",
      "en reparación": "bg-yellow-100 text-yellow-800",
      "en reparacion": "bg-yellow-100 text-yellow-800",
      "en pruebas": "bg-teal-100 text-teal-800",
      "pruebas": "bg-teal-100 text-teal-800",
      "finalizado": "bg-green-100 text-green-800",
    };

    return colores[nombreLower] || "bg-blue-100 text-blue-800";
  };

  // Función para obtener el nombre del estado del ticket
  const getEstadoNombre = (ticket) => {
    // Si el estado es un objeto con nombre
    if (ticket.estado?.nombre) {
      return ticket.estado.nombre;
    }
    // Si el estado es un objeto con label
    if (ticket.estado?.label) {
      return ticket.estado.label;
    }
    // Si el estado es un número, mapearlo a nombre
    if (typeof ticket.estado === "number" || typeof ticket.estado_id === "number") {
      const estadoId = ticket.estado || ticket.estado_id;
      const estadoMap = {
        1: "Abierto",
        2: "En diagnóstico",
        3: "En reparación",
        4: "En pruebas",
        5: "Finalizado",
      };
      return estadoMap[estadoId] || "Sin estado";
    }
    // Si el estado es un string
    if (typeof ticket.estado === "string") {
      return ticket.estado;
    }
    return "Sin estado";
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
        <p className="text-gray-600 mt-1">Aquí puedes ver tus tickets.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No has creado ningún ticket.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const estadoNombre = getEstadoNombre(ticket);
            const estadoColor = getEstadoColor(estadoNombre);

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
                        className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${estadoColor}`}
                      >
                        {estadoNombre}
                      </span>
                      {(ticket.fecha || ticket.creado_en) && (
                        <span className="text-gray-600 text-xs sm:text-sm">
                          Creado: {formatearFecha(ticket.fecha || ticket.creado_en)}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      Información del ticket
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <span className="text-gray-600 text-xs sm:text-sm">Titulo:</span>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                          {ticket.titulo || "Sin título"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600 text-xs sm:text-sm">Descripción:</span>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                          {ticket.descripcion || "Sin descripción"}
                        </p>
                      </div>

                      {ticket.equipo && (
                        <div>
                          <span className="text-gray-600 text-xs sm:text-sm">Equipo:</span>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">
                            {ticket.equipo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
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
