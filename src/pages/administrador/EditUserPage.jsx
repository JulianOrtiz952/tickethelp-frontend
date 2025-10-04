// pages/users/EditUserPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getUserByDocument,
    updateUser,
    deleteOrSuggestDeactivate,
    reactivateUser,
    listUsers,
    mapUserToRow,
} from "../../api/user2";
import ConfirmDialog from "../../components/ConfirmDialog";
import MessageDialog from "../../components/MessageDialog";

export default function EditUserPage() {
    const { document } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [user, setUser] = useState(null); // crudo backend
    const row = useMemo(() => (user ? mapUserToRow(user) : null), [user]);

    const [fullName, setFullName] = useState(""); // “Juan Carlos Pérez”
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [role, setRole] = useState("CLIENT");
    const [active, setActive] = useState(true);
    const docShown = (user?.document && String(user.document).trim()) || document || "-";
    // Modales
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [msg, setMsg] = useState({ open: false, title: "", message: "", variant: "info" });

    const [createdShown, setCreatedShown] = useState("-");
    useEffect(() => {
        const s = user?.date_joined
            ? user.date_joined.slice(0, 10).split("-").reverse().join("/")
            : "-";
        setCreatedShown(s);

        // Fallback opcional: si quedó "-" intentamos buscar en la lista global
        (async () => {
            if (s !== "-") return;
            try {
                const all = await listUsers(); // necesita el import
                const match = Array.isArray(all) && all.find(u =>
                    (u.document && String(u.document) === String(document)) ||
                    (user?.email && String(u.email).toLowerCase() === String(user.email).toLowerCase())
                );
                if (match?.date_joined) {
                    setCreatedShown(match.date_joined.slice(0, 10).split("-").reverse().join("/"));
                }
            } catch {/* si falla, lo dejamos en "-" */ }
        })();
    }, [user, document]);
    // Cargar datos
    useEffect(() => {
        (async () => {
            try {
                if (!document) throw new Error("Documento no provisto en la URL");
                setLoading(true);
                const data = await getUserByDocument(document);
                if (!data) throw new Error("Usuario no encontrado");

                setUser(data);

                setEmail(data.email || "");
                setNumber(data.number || "");
                setRole((data.role || "CLIENT").toUpperCase());
                setActive(Boolean(data.is_active));

                const n = [data.first_name, data.last_name].filter(Boolean).join(" ");
                setFullName(n);
            } catch (err) {
                setMsg({
                    open: true,
                    title: "Error",
                    message: "No se pudo cargar el usuario.",
                    variant: "error",
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [document]);

    const createdDate = useMemo(() => {
        if (!user?.date_joined) return "-";
        return user.date_joined.slice(0, 10).split("-").reverse().join("/");
    }, [user]);

    // Guardar cambios básicos
    async function handleSave() {
        try {
            setSaving(true);

            const [first_name = "", last_name = ""] = splitFullName(fullName);

            // Sanitiza
            const payload = {
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: String(email || "").trim(),
                number: String(number || "").replace(/\s+/g, ""),
                role: String(role || "CLIENT").toUpperCase().trim(),
                is_active: Boolean(active),
            };

            await updateUser(document, payload);

            setMsg({
                open: true,
                title: "Guardado",
                message: "Los cambios fueron guardados correctamente.",
                variant: "success",
            });

            // Refresca
            const fresh = await getUserByDocument(document);
            setUser(fresh);
            setTimeout(() => navigate(-1), 400);
        } catch (err) {
            const dictMsg = fieldErrorToText(err);
            setMsg({
                open: true,
                title: "No se pudo guardar",
                message: dictMsg || err?.message || err?.detail || "Intenta de nuevo.",
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    }

    // Desactivar / Reactivar
    async function handleDeactivate() {
        try {
            const res = await deleteOrSuggestDeactivate(document);
            setActive(false);
            setMsg({ open: true, title: "Usuario desactivado", message: res?.message || "El usuario fue desactivado.", variant: "success" });
        } catch (err) {
            setMsg({ open: true, title: "No se pudo desactivar", message: err?.message || "Intenta de nuevo.", variant: "error" });
        }
    }


    async function handleReactivate() {
        try {
            await reactivateUser(document);
            setActive(true);
            setMsg({ open: true, title: "Usuario reactivado", message: "El usuario fue reactivado.", variant: "success" });
        } catch (err) {
            setMsg({ open: true, title: "No se pudo reactivar", message: err?.message || "Intenta de nuevo.", variant: "error" });
        }
    }


    if (loading) {
        return (
            <div className="p-6">
                <div className="rounded-xl border bg-white p-6">Cargando...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <div className="rounded-xl border bg-white p-6">Usuario no encontrado.</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header / Card info (estilo maqueta 2) */}
            <div className="bg-white rounded-xl border p-5 mb-6">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl">👤</div>
                        <button className="mt-2 text-xs rounded-lg border px-2 py-1 text-gray-700 hover:bg-gray-50">
                            Cambiar foto
                        </button>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">Información del Usuario</h2>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                            <div><span className="font-medium">ID:</span> <span className="ml-1">{docShown}</span></div>
                            <div><span className="font-medium">Fecha de registro:</span> <span className="ml-1">{createdShown}</span></div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Estado:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                    {active ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario de edición */}
            <div className="bg-white rounded-xl border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nombre completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Juan Carlos Pérez"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                        />
                    </div>

                    {/* Número de Documento (visible y deshabilitado) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                        + <input
                            value={docShown}
                            disabled
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="juan.perez@email.com"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono</label>
                        <input
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="+57 300 123 4567"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                        />
                    </div>

                    {/* Tipo de Documento (sólo UI) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                        <input
                            value="Cédula de Ciudadanía"
                            disabled
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                        />
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol de Usuario</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                        >
                            <option value="ADMIN">Administrador</option>
                            <option value="TECH">Técnico</option>
                            <option value="CLIENT">Cliente</option>
                        </select>
                    </div>
                </div>

                {/* Configuración de cuenta */}
                <hr className="my-6 border-gray-200" />
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Configuración de Cuenta</h3>
                    <div className="mt-4 flex items-center gap-3">
                        <input
                            id="activo"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                        />
                        <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                        onClick={() => window.history.back()}
                    >
                        Cancelar
                    </button>

                    <div className="flex gap-3">
                        {active ? (
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                onClick={() => setConfirmOpen(true)}
                            >
                                Eliminar Usuario
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                onClick={handleReactivate}
                            >
                                Reactivar Usuario
                            </button>
                        )}
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {saving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm y mensajes */}
            <ConfirmDialog
                open={confirmOpen}
                title="Desactivar usuario"
                message={`¿Seguro que deseas desactivar al usuario ${user.document}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    setConfirmOpen(false);
                    await handleDeactivate();
                }}
            />

            <MessageDialog
                open={msg.open}
                title={msg.title}
                message={msg.message}
                variant={msg.variant}
                onClose={() => setMsg((m) => ({ ...m, open: false }))}
            />
        </div>
    );
}

/** Util: partir "Nombre Completo" en first_name / last_name */
function splitFullName(full) {
    const s = String(full || "").trim().split(/\s+/);
    if (s.length <= 1) return [s[0] || "", ""];
    const first = s.slice(0, -1).join(" ");
    const last = s.slice(-1).join(" ");
    return [first, last];
}

/** Extrae mensaje útil de un dict de errores del backend */
function fieldErrorToText(err) {
    if (err && typeof err === "object") {
        const keys = Object.keys(err).filter((k) => !["status", "url"].includes(k));
        if (keys.length) {
            const v = err[keys[0]];
            return Array.isArray(v) ? v[0] : (typeof v === "string" ? v : null);
        }
    }
    return null;
}
