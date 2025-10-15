// components/MessageDialog.jsx
export default function MessageDialog({
    open,
    title,
    message,
    variant = "info", // "success" | "error" | "info"
    onClose,
}) {
    if (!open) return null;

    const styles = {
        success: "bg-green-50 text-green-800 border-green-200",
        error: "bg-red-50 text-red-800 border-red-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
    }[variant];

    const icon = {
        success: "✅",
        error: "⚠️",
        info: "ℹ️",
    }[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className={`w-[92%] max-w-md rounded-xl border shadow-lg ${styles}`}>
                <div className="p-5">
                    <div className="flex items-start gap-3">
                        <div className="text-xl leading-none">{icon}</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            {message && <p className="mt-1 text-sm">{message}</p>}
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-lg bg-white/70 px-4 py-2 text-sm hover:bg-white"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
