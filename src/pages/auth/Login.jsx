import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/forms/TextField";
import PasswordField from "../../components/forms/PasswordField";
import { useAuth } from "./AuthContext";

export default function Login() {
    const nav = useNavigate();
    const loc = useLocation();
    const { loading, user, login } = useAuth();

    // Ruta destino por defecto (solo admin por ahora)
    const DEFAULT_HOME = "/admin/tickets/gestionar";

    // Si venía desde una ruta protegida, vuelve ahí tras login
    const from = loc.state?.from?.pathname || null;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Si ya hay sesión activa → redirige
    useEffect(() => {
        if (!loading && user?.role) {
            nav(DEFAULT_HOME, { replace: true });
        }
    }, [loading, user, nav]);

    // Validaciones cliente (campos vacíos / formato)
    const emailError = useMemo(() => {
        if (!email.trim()) return "Obligatorio";
        const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
        return ok ? "" : "Correo inválido";
    }, [email]);

    const passwordError = useMemo(() => {
        if (!password.trim()) return "Obligatorio";
        if (password.length < 8) return "Mínimo 8 caracteres";
        return "";
    }, [password]);

    const formValid = !emailError && !passwordError;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formValid) {
            setError("Corrige los errores del formulario.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const { user: loggedUser, mustChange } = await login({
                email: email.trim(),
                password,
                remember,
            });

            if (mustChange) {
                nav("/cambiar-contraseña", {
                    replace: true,
                    state: { firstTime: true, msg: "Por favor, cambie la contraseña" },
                });
                return;
            }

            // Redirige al destino original o al panel admin
            const home = from || DEFAULT_HOME;
            nav(home, { replace: true });
        } catch (err) {
            const status = err?.status;
            if (status >= 500) {
                setError("Error en el servidor. Intenta más tarde.");
            } else if (
                status === 403 &&
                /inactiv/i.test(err?.data?.detail || err?.detail || "")
            ) {
                setError("Cuenta inactiva");
            } else if (status === 401 || status === 400 || status === 404) {
                setError("Credenciales inválidas");
            } else {
                setError(
                    err?.data?.detail ||
                    err?.detail ||
                    err?.message ||
                    "Error al iniciar sesión"
                );
            }
        } finally {
            setSubmitting(false);
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
                    <h1 className="text-center text-2xl font-semibold text-gray-800">
                        Iniciar Sesión
                    </h1>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Ingresa tus credenciales para acceder
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Email"
                            name="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            error={emailError || undefined}
                        />
                        <PasswordField
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordError || undefined}
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
                            <Link
                                to="/auth/forgot"
                                className="text-[#1F5E89] hover:underline"
                            >
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
                            disabled={!formValid || submitting}
                            className={`w-full rounded-lg py-2.5 font-medium text-white transition
                ${!formValid || submitting
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:opacity-90"
                                }`}
                            style={{ backgroundColor: "#4494AD" }}
                        >
                            {submitting ? "Iniciando..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
