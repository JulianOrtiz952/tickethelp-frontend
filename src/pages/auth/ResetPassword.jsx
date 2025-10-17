import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BrandTicket from "../../components/BrandTicket";
import PasswordField from "../../components/forms/PasswordField";

export default function ResetPassword() {
    const [params] = useSearchParams(); // token vendrá por URL cuando conectes el backend
    const token = params.get("token");
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (p1.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
        if (p1 !== p2) return setError("Las contraseñas no coinciden.");
        setError("");
        setOk(true); // solo UI
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
            <div className="w-full max-w-md">
                <div className="relative bg-white border rounded-2xl shadow-sm px-6 pb-6 pt-12">
                    <div className="flex justify-center">
                        <BrandTicket />
                    </div>

                    <h1 className="text-center text-2xl font-semibold text-gray-800">Ingresa tu nueva contraseña</h1>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <PasswordField
                            label="Nueva Contraseña"
                            name="new-password"
                            autoComplete="new-password"
                            value={p1}
                            onChange={(e) => setP1(e.target.value)}
                        />
                        <PasswordField
                            label="Verifica Contraseña"
                            name="verify-password"
                            autoComplete="new-password"
                            value={p2}
                            onChange={(e) => setP2(e.target.value)}
                        />

                        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
                        {ok && (
                            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                ¡Listo! Tu contraseña fue actualizada (demo UI).
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-lg py-2.5 font-medium text-white"
                            style={{ backgroundColor: "#0d9488" }}
                            onMouseDown={(e) => e.currentTarget.style.backgroundColor = "#0f766e"}
                            onMouseUp={(e) => e.currentTarget.style.backgroundColor = "#0d9488"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0d9488"}
                        >
                            Confirmar
                        </button>
                        {token && <p className="text-[11px] text-gray-400 text-center mt-1">token: {token.slice(0, 8)}••• (solo para pruebas)</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
