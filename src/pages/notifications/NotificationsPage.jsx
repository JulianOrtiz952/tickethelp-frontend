import React, { useMemo, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDetailModal from "./NotificationDetailModal";

const fullName = (u) =>
    [u?.first_name, u?.last_name].filter(Boolean).join(" ") || u?.email || "—";

// En tu backend, "leída" se marca con LEIDA.
// Añadimos alternativas por si llega como número/código.
const isRead = (estado) =>
    estado === "LEIDA" || estado === "READ" || estado === 3;

export default function NotificationsPage() {
    const { items, loading, error, reload, markRead, get } = useNotifications();
    const [selected, setSelected] = useState(null);

    const fmt = useMemo(
        () => new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }),
        []
    );

    const openDetail = async (n) => {
        try {
            if (!isRead(n.estado)) {
                await markRead(n.id);
                reload(); // refresca la lista silenciosamente
            }
            // intenta traer el detalle (usa tu hook.get -> fetchNotificationDetail)
            let detail = n;
            try {
                detail = await get(n.id);
            } catch {
                /* si falla, mostramos el item base */
            }
            setSelected(detail);
        } catch {
            // opcional: podrías mostrar un toast si tienes provider
            // console.error("No se pudo abrir el detalle");
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
                                // DESTINATARIO: usa `usuario` o el primer `destinatarios`
                                const destinatario =
                                    (n.usuario && fullName(n.usuario)) ||
                                    (Array.isArray(n.destinatarios) &&
                                        n.destinatarios[0] &&
                                        fullName(n.destinatarios[0])) ||
                                    "—";

                                // MENSAJE: `mensaje` ó `titulo` ó nombre del tipo
                                const mensaje = n.mensaje || n.titulo || n.tipo_nombre || "—";

                                // FECHA: `fecha_creacion` (ó `fecha_envio`)
                                const fechaISO = n.fecha_creacion || n.fecha_envio;
                                const fecha = fechaISO ? fmt.format(new Date(fechaISO)) : "—";

                                const unread = !isRead(n.estado);

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
                                                {unread && (
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
