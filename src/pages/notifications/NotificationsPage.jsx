import React, { useMemo, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useToast } from "../../components/ToastProvider";
import NotificationDetailModal from "./NotificationDetailModal";

export default function NotificationsPage() {
    const { items, loading, error, reload, markRead, getDetail } = useNotifications();
    const [selected, setSelected] = useState(null);
    const toast = useToast();

    // formateador de fecha como en la maqueta
    const fmt = useMemo(
        () =>
            new Intl.DateTimeFormat("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
        []
    );

    const openDetail = async (n) => {
        try {
            // marca leída si aún no lo está
            if (!n.es_leida) {
                await markRead(n.id);
                // actualiza la lista silenciosamente; evita parpadeo
                reload();
            }

            // si tu hook expone getDetail, úsalo; si no, abre con el propio item
            let detail = n;
            if (typeof getDetail === "function") {
                detail = await getDetail(n.id);
            }
            setSelected(detail);
        } catch {
            toast.push({ title: "No se pudo abrir el detalle", type: "error" });
        }
    };

    const closeDetail = () => setSelected(null);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-6">
                Notificaciones Recientes
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border">
                <table className="w-full table-fixed">
                    <thead className="text-gray-500 text-sm">
                        <tr className="[&>th]:py-3 [&>th]:px-4 border-b">
                            <th className="text-left w-5/12">DESTINATARIO</th>
                            <th className="text-left w-5/12">MENSAJE</th>
                            <th className="text-left w-2/12">FECHA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td className="py-4 px-4 text-gray-500" colSpan={3}>
                                    Cargando…
                                </td>
                            </tr>
                        )}

                        {error && (
                            <tr>
                                <td className="py-4 px-4 text-red-600" colSpan={3}>
                                    Error al cargar notificaciones
                                </td>
                            </tr>
                        )}

                        {!loading && !error && items.length === 0 && (
                            <tr>
                                <td className="py-4 px-4 text-gray-500" colSpan={3}>
                                    No hay notificaciones
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !error &&
                            items.map((n) => {
                                const destinatario =
                                    n.usuario_nombre ??
                                    n.usuario?.full_name ??
                                    n.destinatario_label ??
                                    "—";

                                const mensaje = n.titulo ?? n.title ?? n.message ?? "—";
                                const fecha = fmt.format(
                                    new Date(n.fecha_creacion ?? n.created_at)
                                );

                                return (
                                    <tr
                                        key={n.id}
                                        tabIndex={0}
                                        onClick={() => openDetail(n)}
                                        onKeyDown={(e) =>
                                            (e.key === "Enter" || e.key === " ") && openDetail(n)
                                        }
                                        className={[
                                            "cursor-pointer select-none",
                                            "transition-colors",
                                            "hover:bg-gray-50 focus:bg-gray-50",
                                            "border-b last:border-b-0",
                                        ].join(" ")}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {!n.es_leida && (
                                                    <span
                                                        className="inline-block h-2 w-2 rounded-full bg-sky-600"
                                                        aria-label="no leída"
                                                    />
                                                )}
                                                <span className="truncate">{destinatario}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="block truncate">{mensaje}</span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{fecha}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {selected && (
                <NotificationDetailModal notification={selected} onClose={closeDetail} />
            )}
        </div>
    );
}
