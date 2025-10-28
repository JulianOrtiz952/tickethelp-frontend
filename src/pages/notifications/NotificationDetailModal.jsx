import React, { useEffect, useMemo, useState } from "react";
import { fetchNotificationDetail } from "../../api/notificationsService";

const fullName = (u) =>
    [u?.first_name, u?.last_name].filter(Boolean).join(" ") || u?.email || "—";

export default function NotificationDetailModal({ notification, onClose }) {
    const [detail, setDetail] = useState(notification);
    const [loading, setLoading] = useState(false);

    const fmt = useMemo(
        () => new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }),
        []
    );

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            try {
                const d = await fetchNotificationDetail(notification.id);
                if (active) setDetail(d);
            } catch {
                /* si falla, mostramos lo que ya tenemos */
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [notification.id]);

    const fechaISO = detail?.fecha_creacion || detail?.fecha_envio;
    const fecha = fechaISO ? fmt.format(new Date(fechaISO)) : "—";

    const usuarioPrincipal =
        (detail?.usuario && fullName(detail.usuario)) ||
        (detail?.destinatarios?.[0] && fullName(detail.destinatarios[0])) ||
        "—";

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Detalle de Notificación</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <p className="text-gray-500">Cargando…</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="border rounded-xl p-3 bg-gray-50">
                                    {detail?.mensaje || detail?.titulo || detail?.tipo_nombre || "—"}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <section className="rounded-xl border p-4 bg-blue-50">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span>👤</span> Datos del Usuario
                                    </h3>
                                    <p><span className="text-gray-500">Nombre: </span>{usuarioPrincipal}</p>
                                    <p><span className="text-gray-500">Correo: </span>{detail?.usuario?.email || "—"}</p>
                                    <p><span className="text-gray-500">Fecha: </span>{fecha}</p>
                                </section>

                                <section className="rounded-xl border p-4 bg-purple-50">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span>📌</span> Estado y Técnicos
                                    </h3>
                                    <p><span className="text-gray-500">Estado: </span>{detail?.estado || "—"}</p>
                                    <p><span className="text-gray-500">Tipo: </span>{detail?.tipo_nombre || detail?.tipo_codigo || "—"}</p>
                                    <p><span className="text-gray-500">Técnico nuevo: </span>{detail?.new_technician_info?.nombre || "—"}</p>
                                    <p><span className="text-gray-500">Técnico previo: </span>{detail?.old_technician_info?.nombre || "—"}</p>
                                </section>
                            </div>

                            {detail?.meta?.link && (
                                <a className="inline-flex mt-4 text-sky-700 underline" href={detail.meta.link}>
                                    Ir al ticket
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
