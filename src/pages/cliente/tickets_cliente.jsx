"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import clienteApi from "../../api/clienteApi";
import TicketTimelineModal from "./TicketTimelineModal";
import { AttachmentsGalleryModal } from "../../components/tickets/visualizar_tickets/AttachmentsGalleryModal";
import { api } from "../../api/client";
import { CircleAlert, Search, Wrench, FlaskConical, CheckCircle, Ban, AlertTriangle, Image as ImageIcon } from "lucide-react";
import ModalNotificacion from "../../components/ModalNotificacion";

// Configuración de estados (igual que en page.jsx del técnico)
const ESTADO_CONFIG = {
  1: { label: "Abierto", color: "bg-red-100 text-red-800", icon: CircleAlert },
  2: { label: "En diagnóstico", color: "bg-orange-100 text-orange-800", icon: Search },
  3: { label: "En reparación", color: "bg-yellow-100 text-yellow-800", icon: Wrench },
  4: { label: "Pruebas", color: "bg-blue-100 text-blue-800", icon: FlaskConical },
  5: { label: "Finalizado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  6: { label: "Cancelado", color: "bg-gray-100 text-gray-800", icon: Ban },
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
  cancelado: 6,
};

export default function TicketsCliente() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTicketId, setGalleryTicketId] = useState(null);

  // Cancel states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [notif, setNotif] = useState({ open: false, title: "", message: "" });

  const handleCancelClick = (ticket) => {
    setTicketToCancel(ticket);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!ticketToCancel) return;
    setIsCanceling(true);
    try {
      await clienteApi.put(`/tickets/cancel/${ticketToCancel.id}/?user_document=${user.document}`);
      setNotif({ open: true, title: "Éxito", message: "El ticket ha sido cancelado definitivamente." });
      setCancelModalOpen(false);
      // Refresh tickets
      const response = await clienteApi.get(`/tickets/consulta/?user_document=${user.document}`);
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "No se pudo cancelar el ticket.";
      setNotif({ open: true, title: "Error", message: msg });
      setCancelModalOpen(false);
    } finally {
      setIsCanceling(false);
      setTicketToCancel(null);
    }
  };

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

    const interval = setInterval(() => {
      fetchTickets();
    }, 30000);

    return () => clearInterval(interval);
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

                  <div className="flex flex-col sm:flex-row gap-2">
                    {estadoId < 3 && (
                      <button
                        onClick={() => handleCancelClick(ticket)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        Cancelar Ticket
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        setShowModal(true);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Ver progreso del ticket
                    </button>
                    <button
                      onClick={() => {
                        setGalleryTicketId(ticket.id);
                        setGalleryOpen(true);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ver Adjuntos
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
      )}
      {showModal && (
        <TicketTimelineModal
          ticketId={selectedTicketId}
          onClose={() => setShowModal(false)}
        />
      )}

      <AttachmentsGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        ticketId={galleryTicketId}
      />

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && ticketToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden min-h-[50px]">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                ¿Cancelar Ticket?
              </h3>
              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                ¿Estás seguro que deseas cancelar el ticket <span className="font-semibold text-gray-800">{formatTicketNumber(ticketToCancel)}</span>? 
                Esta acción no se puede deshacer.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  disabled={isCanceling}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  No, mantener ticket
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={isCanceling}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isCanceling ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Sí, cancelar ticket"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalNotificacion
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        title={notif.title}
        message={notif.message}
        autoCloseMs={3500}
        position="top-right"
      />
    </div>
  );
}
