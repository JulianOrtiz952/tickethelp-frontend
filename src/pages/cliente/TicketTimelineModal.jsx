"use client";

import { useEffect, useState } from "react";
import clienteApi from "../../api/clienteApi";
import { Check, FlaskConical, Home, CircleAlert, Search, Wrench } from "lucide-react";

export default function TicketTimelineModal({ ticketId, onClose }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentEstado, setCurrentEstado] = useState(null);

    // Definir los 5 estados en orden con sus iconos específicos
    const estados = [
        { id: 1, nombre: "Abierto", icon: CircleAlert },
        { id: 2, nombre: "Diagnóstico", icon: Search },
        { id: 3, nombre: "En reparación", icon: Wrench },
        { id: 4, nombre: "En pruebas", icon: FlaskConical },
        { id: 5, nombre: "Finalizado", icon: Home },
    ];

    // Función para normalizar el nombre del estado
    const normalizeEstado = (estado) => {
        if (!estado) return null;
        const estadoLower = estado.toLowerCase().trim();
        
        if (estadoLower.includes("abierto")) return "Abierto";
        if (estadoLower.includes("diagnóstico") || estadoLower.includes("diagnostico")) return "Diagnóstico";
        if (estadoLower.includes("reparación") || estadoLower.includes("reparacion")) return "En reparación";
        if (estadoLower.includes("pruebas")) return "En pruebas";
        if (estadoLower.includes("finalizado")) return "Finalizado";
        
        return estado;
    };

    // Función para obtener el índice del estado actual
    const getEstadoIndex = (estadoNombre) => {
        const normalized = normalizeEstado(estadoNombre);
        return estados.findIndex(e => e.nombre === normalized);
    };

    // Función para determinar el estado de cada etapa
    const getStageStatus = (stageIndex, currentIndex) => {
        if (currentIndex === -1) return "future"; // Si no hay estado actual, todos son futuros
        
        if (stageIndex < currentIndex) return "completed";
        if (stageIndex === currentIndex) return "current";
        return "future";
    };

    // Función para ordenar el timeline: más reciente arriba (mayor estado_id arriba, menor abajo)
    const sortTimeline = (timelineData) => {
        return [...timelineData].sort((a, b) => {
            // Primero ordenar por fecha y hora (más reciente primero)
            const dateA = new Date(`${a.fecha} ${a.hora}`);
            const dateB = new Date(`${b.fecha} ${b.hora}`);
            
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            
            // Si tienen la misma fecha/hora, ordenar por estado_id descendente (mayor arriba)
            return b.estado_id - a.estado_id;
        });
    };

    // Función para formatear la fecha en español
    const formatFecha = (fecha) => {
        const meses = [
            "ene", "feb", "mar", "abr", "may", "jun",
            "jul", "ago", "sep", "oct", "nov", "dic"
        ];
        
        const [year, month, day] = fecha.split("-");
        const monthIndex = parseInt(month) - 1;
        return `${day} ${meses[monthIndex]} ${year}`;
    };

    useEffect(() => {
        if (!ticketId) return;

        const fetchTimeline = async () => {
            try {
                const response = await clienteApi.get(`/client/tickets/${ticketId}/timeline/`);
                const timelineData = response.data.timeline || [];
                setTimeline(timelineData);
                
                // Obtener el estado actual (el más reciente del timeline ordenado)
                if (timelineData.length > 0) {
                    const sorted = sortTimeline(timelineData);
                    const mostRecentEstado = sorted[0].estado;
                    setCurrentEstado(normalizeEstado(mostRecentEstado));
                } else if (response.data.estado_actual) {
                    // Si no hay timeline pero hay estado_actual en la respuesta
                    setCurrentEstado(normalizeEstado(response.data.estado_actual));
                } else {
                    setCurrentEstado(null);
                }
            } catch (error) {
                console.error("Error cargando la trazabilidad:", error);
                setTimeline([]);
                setCurrentEstado(null);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchTimeline();
    }, [ticketId]);

    if (!ticketId) return null;

    const currentIndex = getEstadoIndex(currentEstado);

    const sortedTimeline = sortTimeline(timeline);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl relative max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center z-10"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold text-center mb-8">
                    Progreso del Ticket
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-10 w-10 border-b-2 border-teal-600 rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-8 overflow-y-auto flex-1 pr-2">
                        {/* Barra de progreso horizontal */}
                        <div className="relative py-4">
                            <div className="flex items-center justify-between relative">
                                {/* Línea de conexión de fondo (gris) - desde el centro del primer círculo hasta el centro del último */}
                                <div 
                                    className="absolute top-6 h-0.5 bg-gray-200 z-0"
                                    style={{ 
                                        left: '6%',
                                        right: '6%'
                                    }}
                                ></div>
                                
                                {/* Línea de progreso completado (verde) - desde inicio hasta el último estado completado */}
                                {currentIndex > 0 && (
                                    <div 
                                        className="absolute top-6 h-0.5 bg-green-500 z-10 transition-all duration-300"
                                        style={{ 
                                            left: '6%',
                                            width: `${((currentIndex - 1) / (estados.length - 1)) * 88}%` 
                                        }}
                                    ></div>
                                )}
                                
                                {/* Línea de progreso actual (azul) - desde el último estado completado hasta el estado actual */}
                                {currentIndex > 0 && currentIndex < estados.length - 1 && (
                                    <div 
                                        className="absolute top-6 h-0.5 bg-blue-500 z-10 transition-all duration-300"
                                        style={{ 
                                            left: `${6 + ((currentIndex - 1) / (estados.length - 1)) * 88}%`,
                                            width: `${(1 / (estados.length - 1)) * 88}%` 
                                        }}
                                    ></div>
                                )}

                                {/* Etapas */}
                                {estados.map((estado, index) => {
                                    const status = getStageStatus(index, currentIndex);
                                    const isCompleted = status === "completed";
                                    const isCurrent = status === "current";
                                    const isFuture = status === "future";

                                    // Solo los estados completados (verde) muestran Check, los demás muestran su icono específico
                                    const IconComponent = isCompleted ? Check : estado.icon;
                                    
                                    return (
                                        <div key={estado.id} className="flex flex-col items-center relative z-20 flex-1">
                                            {/* Círculo de la etapa */}
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    isCompleted
                                                        ? "bg-green-500"
                                                        : isCurrent
                                                        ? "bg-blue-500"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <IconComponent 
                                                    className={`w-6 h-6 ${
                                                        isCompleted || isCurrent
                                                            ? "text-white"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            
                                            {/* Etiqueta de la etapa */}
                                            <div className="mt-3 text-center">
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isCurrent
                                                            ? "text-blue-600"
                                                            : isCompleted
                                                            ? "text-green-600"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {estado.nombre}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mensaje del estado actual */}
                        {currentEstado && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                                <p className="text-gray-700 text-sm">
                                    El ticket se encuentra actualmente en la fase de <span className="font-semibold text-blue-600">{currentEstado}</span>.
                                </p>
                            </div>
                        )}

                        {/* Línea de tiempo vertical */}
                        {sortedTimeline.length > 0 && (
                            <div className="relative">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Historial de cambios
                                </h3>
                                <div className="relative pl-8">
                                    {/* Línea vertical de conexión */}
                                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                    
                                    {sortedTimeline.map((item, index) => {
                                        const normalizedEstado = normalizeEstado(item.estado);
                                        const estadoInfo = estados.find(e => e.nombre === normalizedEstado) || estados[0];
                                        const IconComponent = estadoInfo.icon;
                                        
                                        return (
                                            <div key={index} className="relative mb-6 last:mb-0">
                                                {/* Círculo del punto en la línea */}
                                                <div className="absolute left-0 top-1.5 transform -translate-x-1/2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-sm">
                                                        <IconComponent className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                
                                                {/* Contenido del evento */}
                                                <div className="ml-6 pb-2">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800">
                                                                Pasó al estado <span className="font-semibold text-blue-600">{item.estado}</span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-xs text-gray-600">
                                                                {formatFecha(item.fecha)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.hora}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {timeline.length === 0 && !loading && (
                            <p className="text-center text-gray-600">Sin información disponible.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
