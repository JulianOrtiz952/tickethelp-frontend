import React, { useEffect, useState } from "react";
import { fetchNotificationDetail } from "../../api/notificationsService";

export default function NotificationDetailModal({ notification, onClose }) {
    const [detail, setDetail] = useState(notification);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const d = await fetchNotificationDetail(notification.id);
                setDetail(d);
            } catch (_) { }
            setLoading(false);
        })();
    }, [notification.id]);

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
                                <div className="border rounded-xl p-3 bg-gray-50">{detail.mensaje ?? detail.message}</div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <section className="rounded-xl border p-4 bg-blue-50">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span>👤</span> Datos del Cliente
                                    </h3>
                                    <p><span className="text-gray-500">Nombre: </span>{detail.cliente_nombre ?? detail.usuario_nombre ?? "—"}</p>
                                    <p><span className="text-gray-500">Documento: </span>{detail.cliente_documento ?? "—"}</p>
                                    <p><span className="text-gray-500">Teléfono: </span>{detail.cliente_telefono ?? "—"}</p>
                                    <p><span className="text-gray-500">Correo: </span>{detail.cliente_correo ?? "—"}</p>
                                </section>

                                <section className="rounded-xl border p-4 bg-purple-50">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span>📌</span> Estado actual
                                    </h3>
                                    <p><span className="text-gray-500">Estado: </span>{detail.estado_nombre ?? detail.estado ?? "—"}</p>
                                    <p><span className="text-gray-500">Técnico asignado: </span>{detail.tecnico_nombre ?? "—"}</p>
                                    <p><span className="text-gray-500">Actualización: </span>{new Date(detail.fecha_creacion ?? detail.created_at).toLocaleString()}</p>
                                </section>
                            </div>

                            {detail.meta?.link && (
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
