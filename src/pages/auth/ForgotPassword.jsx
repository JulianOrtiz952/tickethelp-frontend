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
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `
          linear-gradient(135deg, rgba(160,225,245,0.6), rgba(255,255,255,0.6)),
          url('/fondo.jpg')
        `,
                backgroundBlendMode: "overlay",
            }}
        >
            <div className="relative w-full max-w-md">
                {/* Logo flotante */}
                <div className="absolute -top-26 left-1/2 -translate-x-1/2 z-10">
                    <img
                        src="/logo_ticket-help.svg"
                        alt="TicketHelp Logo"
                        className="h-46 w-38 object-contain drop-shadow"
                        draggable="false"
                    />
                </div>

                {/* Tarjeta */}
                <div className="bg-white border rounded-2xl shadow-sm px-6 pb-6 pt-14">
                    <h1 className="text-center text-2xl font-semibold text-gray-800">Recuperar Contraseña</h1>
                    <p className="text-center text-sm text-gray-500 mt-1">Te enviaremos un enlace para restablecerla</p>

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
                            className="w-full rounded-lg py-2.5 font-medium text-white bg-[#4494AD] hover:bg-[#377b91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5E89] transition-colors"
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
