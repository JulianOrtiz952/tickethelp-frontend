import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/forms/TextField";
import PasswordField from "../../components/forms/PasswordField";
import { useAuth } from "./AuthContext";

export default function Login() {
    const nav = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Ingresa tu email y contraseña.");
            return;
        }
        setError("");
        try {
            await login({ email, password, remember });
            nav("/admin/tickets");
        } catch (err) {
            const msg =
                err?.detail ||
                err?.message ||
                err?.response?.data?.detail ||
                "Credenciales inválidas";
            setError(String(msg));
        }
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
                <div className="absolute -top-26 left-1/2 -translate-x-1/2 z-10">
                    <img
                        src="/logo_ticket-help.svg"
                        alt="TicketHelp Logo"
                        className="h-46 w-38 object-contain drop-shadow"
                        draggable="false"
                    />
                </div>

                <div className="bg-white border rounded-2xl shadow-sm px-6 pb-6 pt-14">
                    <h1 className="text-center text-2xl font-semibold text-gray-800">Iniciar Sesión</h1>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Ingresa tus credenciales para acceder
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <PasswordField
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span className="text-gray-600">Recordarme</span>
                            </label>
                            <Link to="/auth/forgot" className="text-[#1F5E89] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-lg py-2.5 font-medium text-white"
                            style={{ backgroundColor: "#4494AD" }}
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
