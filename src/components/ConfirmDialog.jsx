export default function ConfirmDialog({ open, title = "Confirmar", message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-2 rounded-lg border" onClick={onCancel}>Cancelar</button>
                    <button className="px-3 py-2 rounded-lg bg-red-600 text-white" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}