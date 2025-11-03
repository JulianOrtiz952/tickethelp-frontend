"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../AuthContext";
import { api } from "../../api/client";

export default function TicketsAsignados() {
  const { user, isAuthed } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tomamos el mejor identificador disponible del técnico
  const techIdentifier = useMemo(() => {
    if (!user) return null;
    return {
      document: user.document || user?.documento || null,
      id: user.id || user?.user_id || null,
      email: user.email || null,
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthed) {
      setError("No hay usuario autenticado.");
      setLoading(false);
      return;
    }
    if (!user) return;

    fetchTickets().catch((e) => {
      console.error("[TicketsAsignados] error:", e);
      setError(e?.message || "Error al cargar tickets");
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, user?.id, user?.document, user?.email]);

  async function fetchTickets() {
    setLoading(true);
    setError("");

    // Construimos querystring según backend:
    // prioridad: documento -> id -> email
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

    const path = `/api/tickets/consulta/?${qs.toString()}`;

    const data = await api(path, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    setTickets(Array.isArray(data) ? data : (data?.results || []));
    setLoading(false);
  }

  const getEstadoColor = (estadoNombre) => {
    const colores = {
      "En Progreso": "bg-yellow-100 text-yellow-800",
      Pendiente: "bg-orange-100 text-orange-800",
      Completado: "bg-green-100 text-green-800",
      Cerrado: "bg-gray-100 text-gray-800",
    };
    return colores[estadoNombre] || "bg-blue-100 text-blue-800";
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B6CB0]"></div>
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tickets asignados</h1>
        <p className="text-gray-600 mt-1">
          Gestión y visualización de los tickets asignados a tu usuario.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No tienes tickets asignados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Boleto #{String(ticket.id).padStart(3, "0")}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        ticket.estado?.nombre
                      )}`}
                    >
                      {ticket.estado?.nombre || "Sin estado"}
                    </span>
                    {ticket.fecha && (
                      <span className="text-sm text-gray-500">
                        Creado: {formatearFecha(ticket.fecha)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Título:</span>
                    </p>
                    <p className="text-gray-900">{ticket.titulo}</p>
                  </div>
                </div>

                <button
                  className="bg-[#17A2B8] hover:bg-[#138496] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Abrir ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
