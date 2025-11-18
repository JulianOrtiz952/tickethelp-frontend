"use client";

import { useEffect, useState } from "react";
import clienteApi from "../../api/clienteApi";

export default function TicketTimelineModal({ ticketId, onClose }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ticketId) return;

        const fetchTimeline = async () => {
            try {
                const response = await clienteApi.get(`/tickets/${ticketId}/timeline/`);
                setTimeline(response.data.timeline || []);
            } catch (error) {
                console.error("Error cargando la trazabilidad:", error);
                setTimeline([]);
            } finally {
                setLoading(false); // ← ESTA ES LA CLAVE
            }
        };

        setLoading(true); // reinicia cuando cambia el ticket
        fetchTimeline();
    }, [ticketId]);

    if (!ticketId) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[95%] max-w-3xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold text-center mb-6">
                    Progreso del Ticket
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-10 w-10 border-b-2 border-teal-600 rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {timeline.length === 0 ? (
                            <p className="text-center text-gray-600">Sin información disponible.</p>
                        ) : (
                            timeline.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center">
                                        <div className="h-4 w-4 bg-teal-600 rounded-full"></div>
                                        {index !== timeline.length - 1 && (
                                            <div className="w-1 bg-teal-300 h-full"></div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-800">{item.estado}</p>
                                        <p className="text-gray-600 text-sm">{item.descripcion}</p>
                                        <p className="text-gray-500 text-xs">
                                            {new Date(item.fecha).toLocaleString("es-ES")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
