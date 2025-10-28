// src/components/ModalNotificacion.jsx
import React, { useEffect } from "react";

export default function ModalNotificacion({
    open,
    onClose,
    title = "Ticket creado exitosamente",
    message = "",
    autoCloseMs = 0, // 0 = no autocierre
    position = "top-right", // Posición configurable
}) {
    useEffect(() => {
        if (!open || !autoCloseMs) return;
        const id = setTimeout(onClose, autoCloseMs);
        return () => clearTimeout(id);
    }, [open, autoCloseMs, onClose]);

    if (!open) return null;

    const positionClasses = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
    };

    return (
        <div
            aria-live="assertive"
            className={`fixed z-50 flex items-start justify-end p-4 ${positionClasses[position]}`}
        >
            <div
                className={[
                    "relative w-full max-w-sm",
                    "rounded-xl bg-white shadow-lg border border-gray-200",
                    "p-4 sm:p-5",
                    "animate-[slideIn_.2s_ease-out]",
                    "flex items-center gap-4",
                ].join(" ")}
            >
                {/* Ícono circular */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E5A86] shrink-0">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        aria-hidden="true"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 12l4 4 8-8" />
                    </svg>
                </div>

                {/* Texto */}
                <div className="text-gray-700 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                        {title}
                    </h3>
                    {message ? (
                        <p className="mt-1 text-sm text-gray-600">{message}</p>
                    ) : null}
                </div>

                {/* Botón de cierre */}
                <button
                    onClick={onClose}
                    aria-label="Cerrar notificación"
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
