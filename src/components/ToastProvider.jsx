// src/components/ToastProvider.jsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

let idSeq = 1;

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const push = useCallback((payload) => {
        const id = idSeq++;
        const t = { id, duration: 4500, type: "success", ...payload };
        setToasts((prev) => [...prev, t]);
        if (t.duration > 0) setTimeout(() => remove(id), t.duration);
    }, [remove]);

    const value = useMemo(() => ({ push, remove }), [push, remove]);

    return (
        <ToastCtx.Provider value={value}>
            {children}

            <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-full flex-col gap-3">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="alert"
                        className="rounded-2xl shadow-lg border bg-white p-4 flex items-start gap-3"
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2e6f91] text-white text-xl">
                            ✓
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{t.title}</p>
                            {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
                        </div>
                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => remove(t.id)}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}
