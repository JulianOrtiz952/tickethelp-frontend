import React, { useMemo, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useToast } from "../../components/ToastProvider";
import NotificationDetailModal from "./NotificationDetailModal";

export default function NotificationsPage() {


    const [filters, setFilters] = useState({ tipo: "", leidas: "", estado: "" });
    const { items, loading, error, reload, markRead } = useNotifications();
    const [selected, setSelected] = useState(null);
    const toast = useToast();

    const onOpen = (n) => setSelected(n);
    const onClose = () => setSelected(null);

    const applyFilters = (e) => {
        e.preventDefault();
        reload(filters);
    };

    const handleMarkRead = async (n) => {
        await markRead(n.id);
        toast.push({ title: "Notificación marcada como leída" });
        reload(filters);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Notificaciones Recientes</h1>

            <form onSubmit={applyFilters} className="mb-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-sm text-gray-600">Tipo</label>
                    <input className="border rounded p-2" value={filters.tipo}
                        onChange={(e) => setFilters((f) => ({ ...f, tipo: e.target.value }))} placeholder="código tipo" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Leídas</label>
                    <select className="border rounded p-2" value={filters.leidas}
                        onChange={(e) => setFilters((f) => ({ ...f, leidas: e.target.value }))}>
                        <option value="">Todas</option>
                        <option value="true">Solo leídas</option>
                        <option value="false">Solo no leídas</option>
                    </select>
                </div>
                <button className="bg-sky-700 text-white rounded px-4 py-2" type="submit">Aplicar</button>
            </form>

            <div className="bg-white rounded-xl shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500 border-b">
                            <th className="p-3">Destinatario</th>
                            <th className="p-3">Mensaje</th>
                            <th className="p-3">Fecha</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td className="p-3 text-gray-500" colSpan={4}>Cargando…</td></tr>
                        )}
                        {error && (
                            <tr><td className="p-3 text-red-600" colSpan={4}>Error al cargar</td></tr>
                        )}
                        {!loading && items.length === 0 && (
                            <tr><td className="p-3 text-gray-500" colSpan={4}>Sin notificaciones</td></tr>
                        )}
                        {items.map((n) => (
                            <tr key={n.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{n.usuario_nombre ?? n.usuario?.full_name ?? "—"}</td>
                                <td className="p-3">{n.titulo ?? n.title ?? n.message}</td>
                                <td className="p-3">{new Date(n.fecha_creacion ?? n.created_at).toLocaleString()}</td>
                                <td className="p-3 flex gap-2">
                                    {!n.es_leida && (
                                        <button className="text-sky-700 underline" onClick={() => handleMarkRead(n)}>
                                            Marcar leída
                                        </button>
                                    )}
                                    <button className="text-sky-700 underline" onClick={() => onOpen(n)}>
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <NotificationDetailModal notification={selected} onClose={onClose} />
            )}
        </div>
    );
}
