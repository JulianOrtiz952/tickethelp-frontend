// src/pages/ChangeHistoryPage.jsx
import React, { useMemo, useState } from "react";
import { useChangeHistory } from "../hooks/useChangeHistory";

const fullName = (u) =>
    [u?.first_name, u?.last_name].filter(Boolean).join(" ") ||
    u?.nombre ||
    u?.email ||
    "—";

const getInitials = (u) => {
    const name =
        [u?.first_name, u?.last_name].filter(Boolean).join(" ") ||
        u?.nombre ||
        u?.email ||
        "";
    const parts = name.trim().split(" ");
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const estadoBadgeClasses = (estado) => {
    const e = (estado || "").toString().toLowerCase();
    if (e === "activo" || e === "active") {
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (e === "inactivo" || e === "inactive") {
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
};

export default function ChangeHistoryPage() {
    const { items, loading, error, reload } = useChangeHistory();

    const [searchTicket, setSearchTicket] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    const fmt = useMemo(
        () => new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }),
        []
    );

    const handleSearch = (e) => {
        e.preventDefault();
        reload({
            ticket: searchTicket || undefined,
            estado: estadoFilter || undefined,
        });
    };

    const handleConsultar = () => {
        reload({
            ticket: searchTicket || undefined,
            estado: estadoFilter || undefined,
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
                        Historial completo de cambios y modificaciones
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleConsultar}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                >
                    {/* Lupa blanca, estilo Heroicons */}
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

            {/* Card principal: buscador + lista */}
            <div className="bg-white rounded-2xl shadow-sm border">
                {/* Barra de búsqueda + filtros */}
                <form
                    onSubmit={handleSearch}
                    className="px-4 pt-4 pb-3 mb-0 flex flex-col sm:flex-row gap-3 items-stretch border-b"
                >
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar Ticket..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            value={searchTicket}
                            onChange={(e) => setSearchTicket(e.target.value)}
                        />
                        {/* Icono de búsqueda alineado dentro del input */}
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

                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 4.5h18L15 10.75v4.75l-6 3v-7.75L3 4.5z"
                            />
                        </svg>
                        <span>Aplicar Filtros</span>
                    </button>

                </form>

                {/* Título de la lista, como en el diseño */}
                <div className="px-4 py-3 border-b bg-slate-50 text-sm font-medium text-gray-700">
                    Lista de Tickets
                </div>

                {/* Tabla */}
                <table className="w-full table-fixed">
                    <thead className="text-gray-500 text-xs uppercase tracking-wide">
                        <tr className="[&>th]:py-3 [&>th]:px-4">
                            <th className="text-left w-3/12">Usuario</th>
                            <th className="text-left w-3/12">Correo</th>
                            <th className="text-left w-2/12"># ID Ticket</th>
                            <th className="text-left w-2/12">Estado</th>
                            <th className="text-left w-2/12">Última modificación</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="py-4 px-4 text-gray-500 text-sm">
                                    Cargando historial…
                                </td>
                            </tr>
                        )}

                        {error && !loading && (
                            <tr>
                                <td colSpan={5} className="py-4 px-4 text-red-600 text-sm">
                                    Error al cargar el historial de cambios
                                </td>
                            </tr>
                        )}

                        {!loading && !error && items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 px-4 text-gray-500 text-sm">
                                    No hay cambios registrados
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !error &&
                            items.map((item) => {
                                const usuario = item.usuario || item.user;
                                const nombre = fullName(usuario);
                                const correo =
                                    usuario?.email || item.correo || item.email || "—";

                                const ticketId =
                                    item.ticket_id ||
                                    item.ticket ||
                                    item.ticket_number ||
                                    "—";

                                const estado = item.estado || item.status || "—";

                                const fechaRaw =
                                    item.ultima_modificacion ||
                                    item.fecha_actualizacion ||
                                    item.updated_at ||
                                    item.fecha ||
                                    null;
                                const fecha = fechaRaw
                                    ? fmt.format(new Date(fechaRaw))
                                    : "—";

                                return (
                                    <tr
                                        key={item.id}
                                        className="border-t last:border-b-0 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* USUARIO */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                                                    {getInitials(usuario)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                    {nombre}
                                                </span>
                                            </div>
                                        </td>

                                        {/* CORREO */}
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700 truncate block">
                                                {correo}
                                            </span>
                                        </td>

                                        {/* ID TICKET */}
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-900">
                                                #{ticketId}
                                            </span>
                                        </td>

                                        {/* ESTADO */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border font-medium ${estadoBadgeClasses(
                                                    estado
                                                )}`}
                                            >
                                                {estado}
                                            </span>
                                        </td>

                                        {/* ÚLTIMA MODIFICACIÓN */}
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700">{fecha}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
