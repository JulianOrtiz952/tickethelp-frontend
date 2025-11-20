// src/pages/ChangeHistoryPage.jsx
import React, { useMemo, useState } from "react";
import { useChangeHistory } from "../hooks/useChangeHistory";
import { useAuth } from "../pages/auth/AuthContext";

// Iniciales


// Avatar EXACTO estilo Topbar
export function getUserAvatar(item) {

  if (item?.realizado_por_seed) {
    // Si es URL completa, usarla
    if (item.realizado_por_seed.startsWith("http")) {
      return item.realizado_por_seed;
    }

    // Si es una seed → generar avatar Dicebear
    return `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
      item.realizado_por_seed
    )}&size=128`;
  }

  // Fallback usando documento/email/nombre
  const seed =
    item?.realizado_por_documento ||
    item?.realizado_por_email ||
    item?.realizado_por_nombre ||
    "ticket-help";

  return `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(seed)}&size=128`;
}







export default function ChangeHistoryPage() {
  const { items, loading, error, notFound, hasSearched, reload } = useChangeHistory();


  const { user } = useAuth();

  const [searchTicket, setSearchTicket] = useState("");

  const fmt = useMemo(
    () => new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }),
    []
  );

  // Buscar por ticket ID (enter)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTicket) return;

    reload({
      ticket: searchTicket,
      user_document: user?.document,
    });
  };

  // Botón "Consultar"
  const handleConsultar = () => {
    if (!searchTicket) return;

    reload({
      ticket: searchTicket,
      user_document: user?.document,
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Historial de cambios
          </h1>
          <p className="text-gray-500 mt-1">
            Historial completo de cambios y modificaciones del ticket
          </p>
        </div>

        <button
          type="button"
          onClick={handleConsultar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>

          <span>Consultar</span>
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border">
        {/* Barra de búsqueda */}
        <form
          onSubmit={handleSearch}
          className="px-4 pt-4 pb-3 mb-0 flex flex-col sm:flex-row gap-3 items-stretch border-b"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ingresar ID del Ticket..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </form>

        {/* Título */}
        <div className="px-4 py-3 border-b bg-slate-50 text-sm font-medium text-gray-700">
          Historial del Ticket
        </div>

        {/* Tabla */}
        <table className="w-full table-fixed">
          <thead className="text-gray-500 text-xs uppercase tracking-wide">
            <tr className="[&>th]:py-3 [&>th]:px-4">
              <th className="text-left w-3/12">Usuario</th>
              <th className="text-left w-4/12">Acción</th>
              <th className="text-left w-2/12">Estado Anterior</th>
              <th className="text-left w-2/12">Fecha</th>
            </tr>
          </thead>

     <tbody>
    {/* No se ha buscado aún */}
    {!hasSearched && (
        <tr>
            <td colSpan={4} className="py-4 px-4 text-gray-500 text-sm">
                Ingrese un ID de ticket para consultar el historial.
            </td>
        </tr>
    )}

    {/* Cargando */}
    {loading && (
        <tr>
            <td colSpan={4} className="py-4 px-4 text-gray-500 text-sm">
                Cargando historial…
            </td>
        </tr>
    )}

    {/* Ticket no existe */}
    {!loading && hasSearched && notFound && (
        <tr>
            <td colSpan={4} className="py-4 px-4 text-red-600 text-sm">
                ❌ El ticket no existe.
            </td>
        </tr>
    )}

  {/* Error genérico */}
{!loading && error === "generic" && (
  <tr>
    <td colSpan={4} className="py-4 px-4 text-red-600 text-sm">
      ⚠ Ocurrió un error al consultar el historial.
    </td>
  </tr>
)}

    {/* Ticket sin historial */}
    {!loading && hasSearched && !error && !notFound && items.length === 0 && (
        <tr>
            <td colSpan={4} className="py-4 px-4 text-gray-500 text-sm">
                Este ticket no tiene historial registrado.
            </td>
        </tr>
    )}
    {/* Sesión expirada */}
{!loading && error === "unauthorized" && (
  <tr>
    <td colSpan={4} className="py-4 px-4 text-red-600 text-sm">
      ⚠ Sesión expirada o token inválido. Inicie sesión nuevamente.
    </td>
  </tr>
)}

    {/* Render de items */}
    {!loading && !error && !notFound && items.length > 0 &&
        items.map((item) => {
            const nombreUsuario = item.realizado_por_nombre || "Usuario desconocido";
            const documentoUsuario = item.realizado_por_documento || "—";
            const fecha = item.fecha ? fmt.format(new Date(item.fecha)) : "—";

            return (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                    src={item.realizado_por_imagen || getUserAvatar(item)}
                                    alt={nombreUsuario}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-900">
                                    {nombreUsuario}
                                </span>
                                <div className="text-xs text-gray-500">{documentoUsuario}</div>
                            </div>
                        </div>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                        {item.accion}
                    </td>

                    <td className="py-3 px-4 text-sm">
                        {item.estado_anterior || "—"}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                        {fecha}
                    </td>
                </tr>
            );
        })
    }
</tbody>

        </table>
      </div>
    </div>
  );
}
