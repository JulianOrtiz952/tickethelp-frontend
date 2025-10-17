import { useState } from "react";
import { Link } from "react-router-dom";
import BrandTicket from "../../components/BrandTicket";
import TextField from "../../components/forms/TextField";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim()) return;
        setSent(true); // UI únicamente
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
            <div className="w-full max-w-md">
                <div className="relative bg-white border rounded-2xl shadow-sm px-6 pb-6 pt-12">
                    <div className="flex justify-center">
                        <BrandTicket />
                    </div>

                    <h1 className="text-center text-2xl font-semibold text-gray-800">Recuperar Contraseña</h1>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            placeholder="tu@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            icon={<span>✉️</span>}
                        />

                        {sent && (
                            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                Si el correo existe, te enviaremos un enlace de recuperación.
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
                            Enviar Enlace de Recuperación
                        </button>

                        <div className="text-center">
                            <Link to="/auth/login" className="text-sm text-[#1F5E89] hover:underline">
                                ← Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
