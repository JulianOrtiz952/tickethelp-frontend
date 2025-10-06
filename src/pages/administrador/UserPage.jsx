import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUser,
    getUserByDocument,
    deleteOrSuggestDeactivate,
    listUsers,
    mapUserToRow,
} from "../../api/user2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import MessageDialog from "../../components/MessageDialog";

/* ---------- Badges ---------- */
function RoleBadge({ role }) {
    const label = role === "ADMIN" ? "Administrador" : role === "TECH" ? "Técnico" : "Cliente";
    return <span className="px-2 py-1 rounded-full text-xs border bg-gray-50">{label}</span>;
}
function StateBadge({ active }) {
    const label = active ? "Activo" : "Inactivo";
    const cls = active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
    return <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>{label}</span>;
}

/* ---------- Validación ---------- */
const schema = yup.object({
    document: yup.string().required("Documento requerido"),
    number: yup.string().matches(/^\d{7,15}$/, "Solo dígitos (7 a 15)").required("Número requerido"),
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellido requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    role: yup.string().oneOf(["CLIENT", "ADMIN", "TECH"], "Rol inválido").required("Rol requerido"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("Contraseña requerida"),
});

export default function UsersPage() {
    const navigate = useNavigate();
    const [documento, setDocumento] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetRow, setTargetRow] = useState(null);

    const [msg, setMsg] = useState({ open: false, title: "", message: "", variant: "info" });

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    /* ---------- Cargar lista inicial ---------- */
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await listUsers();
                const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
                // avatar
                setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U" })));
                setError("");
            } catch (err) {
                setError("No se pudo cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ---------- Buscar por documento ---------- */
    async function buscar(e) {
        e?.preventDefault?.();
        setError("");
        if (!documento.trim()) {
            // si limpian el input, recarga todos
            try {
                setLoading(true);
                const list = await listUsers();
                const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
                setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U" })));
            } catch {
                setRows([]);
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            setLoading(true);
            const userRow = await getUserByDocument(documento.trim(), { normalize: true });
            if (!userRow) {
                setError("No existe un usuario con ese documento.");
                setRows([]);
            } else {
                setRows([{ ...userRow, avatar: userRow.nombre?.slice(0, 1) || "U" }]);
            }
            setPage(1);
        } catch {
            setRows([]);
            setError("Error al consultar el usuario. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    /* ---------- Crear ---------- */
    async function handleCreate(data) {
        try {
            // Sanitiza antes de enviar
            const payload = {
                document: String(data.document || "").trim(),
                email: String(data.email || "").trim(),
                number: String(data.number || "").replace(/\s+/g, ""),
                role: String(data.role || "").toUpperCase().trim(),
                first_name: String(data.first_name || "").trim(),
                last_name: String(data.last_name || "").trim(),
                password: String(data.password || ""),
            };

            const res = await createUser(payload);

            // Modal éxito
            setMsg({
                open: true,
                title: "Usuario creado",
                message: res?.message || "Usuario creado exitosamente.",
                variant: "success",
            });

            setShowForm(false);
            reset();

            // Refrescar tabla
            if (documento.trim()) {
                await buscar(); // respeta la búsqueda activa
            } else {
                setLoading(true);
                const list = await listUsers();
                const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
                setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U" })));
                setLoading(false);
            }
        } catch (err) {
            // Normaliza mensajes del backend
            if (err?.code === "EMAIL_DUPLICATE") {
                setMsg({ open: true, title: "Correo duplicado", message: "correo ya registrado", variant: "error" });
                return;
            }
            if (err?.code === "VALIDATION_ERROR") {
                setMsg({ open: true, title: "Validación", message: "Error en los campos. Verifica los datos.", variant: "error" });
                return;
            }
            const dictMsg = (() => {
                if (err && typeof err === "object") {
                    const keys = Object.keys(err).filter((k) => !["status", "url"].includes(k));
                    if (keys.length) {
                        const v = err[keys[0]];
                        return Array.isArray(v) ? v[0] : (typeof v === "string" ? v : null);
                    }
                }
                return null;
            })();
            setMsg({
                open: true,
                title: "Error al crear",
                message: dictMsg || err?.message || err?.detail || "Error al crear usuario. Intenta de nuevo.",
                variant: "error",
            });
        }
    }

    /* ---------- Desactivar (en vez de eliminar) ---------- */
    async function handleDeleteConfirmed() {
        if (!targetRow) return;
        try {
            const res = await deleteOrSuggestDeactivate(targetRow.document);
            setRows((prev) =>
                prev.map((r) => (r.document === targetRow.document ? { ...r, activo: false } : r))
            );
            setTargetRow(null);
            setConfirmOpen(false);

            setMsg({
                open: true,
                title: "Usuario desactivado",
                message: res?.message || "El usuario fue desactivado.",
                variant: "success",
            });
        } catch {
            setMsg({
                open: true,
                title: "No se pudo desactivar",
                message: "Intenta de nuevo.",
                variant: "error",
            });
        }
    }

    /* ---------- Render ---------- */
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Gestión de Usuarios</h1>
                    <p className="text-sm text-gray-600">
                        Administra usuarios, roles y permisos del sistema
                    </p>
                </div>

                {!showForm && (
                    <button
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700"
                        onClick={() => setShowForm(true)}
                    >
                        + Nuevo Usuario
                    </button>
                )}
            </div>

            {showForm ? (
                /* ======= FORMULARIO ======= */
                <section className="max-w-4xl mx-auto">
                    <nav className="text-sm text-gray-500 mb-3">
                        <span className="cursor-default">Usuarios</span>
                        <span className="mx-2">›</span>
                        <span className="text-gray-700 font-medium">Agregar Usuario</span>
                    </nav>

                    <div className="bg-white rounded-xl shadow-sm border">
                        <div className="px-6 pt-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Agregar Nuevo Usuario</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Complete la información para crear un nuevo usuario en el sistema
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(handleCreate)} className="px-6 pb-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario *</label>
                                    <select
                                        {...register("role")}
                                        defaultValue=""
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Seleccionar tipo de usuario</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="TECH">Técnico</option>
                                        <option value="CLIENT">Cliente</option>
                                    </select>
                                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario *</label>
                                    <input
                                        {...register("first_name")}
                                        placeholder="Ingrese el nombre"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                                    <input
                                        {...register("last_name")}
                                        placeholder="Ingrese el apellido"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento *</label>
                                    <select
                                        defaultValue=""
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Seleccionar tipo</option>
                                        <option value="CC">Cédula</option>
                                        <option value="PP">Pasaporte</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento *</label>
                                    <input
                                        {...register("document")}
                                        placeholder="Ingrese el número de documento"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.document && <p className="mt-1 text-xs text-red-600">{errors.document.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono *</label>
                                    <input
                                        {...register("number")}
                                        placeholder="+57 300 123 4567"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.number && <p className="mt-1 text-xs text-red-600">{errors.number.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                                    <input
                                        {...register("password")}
                                        type="password"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                                </div>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span>＋</span> Crear Usuario
                                    </button>


                                </div>

                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); reset(); }}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            ) : (
                /* ======= LISTA / TABLA ======= */
                <>
                    <form onSubmit={buscar} className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                            <input
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                                placeholder="Buscar por documento..."
                                className="pl-10 pr-3 py-2 border rounded-lg w-full"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50">
                            Aplicar
                        </button>
                    </form>

                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b font-semibold text-gray-700">Lista de Usuarios</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-sm text-gray-600">
                                        <th className="p-4">USUARIO</th>
                                        <th className="p-4">CORREO</th>
                                        <th className="p-4">ROL</th>
                                        <th className="p-4">ESTADO</th>
                                        <th className="p-4">FECHA CREACIÓN</th>
                                        <th className="p-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr>
                                            <td className="p-4 text-center" colSpan={6}>Cargando...</td>
                                        </tr>
                                    )}
                                    {!loading && rows.length === 0 && (
                                        <tr>
                                            <td className="p-4 text-center" colSpan={6}>Sin resultados</td>
                                        </tr>
                                    )}
                                    {rows.map((u) => (
                                        <tr key={u.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-sm">{u.avatar}</span>
                                                    </div>
                                                    <span>{u.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{u.correo}</td>
                                            <td className="p-4"><RoleBadge role={u.rol} /></td>
                                            <td className="p-4"><StateBadge active={u.activo} /></td>
                                            <td className="p-4">{u.fecha}</td>
                                            <td className="p-4 flex gap-2">
                                                <button
                                                    title="Editar"
                                                    className="px-2 py-1 border rounded hover:bg-gray-50"
                                                    onClick={() => navigate(`/admin/usuarios/${u.document}`)}
                                                >
                                                    ✏️
                                                </button>

                                                <button title="Ver (pendiente)" className="px-2 py-1 border rounded hover:bg-gray-50" disabled>👁️</button>
                                                <button
                                                    title="Desactivar"
                                                    className="px-2 py-1 border rounded hover:bg-gray-50"
                                                    onClick={() => { setTargetRow(u); setConfirmOpen(true); }}
                                                >🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between p-4 text-sm text-gray-600">
                            <span>
                                Mostrando {rows.length} de {total} {total === 1 ? "usuario" : "usuarios"}
                            </span>
                            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                        </div>
                    </div>

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Desactivar usuario"
                message={`¿Seguro que deseas desactivar al usuario ${targetRow?.document}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirmed}
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
