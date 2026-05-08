import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUser,
    getUserByDocument,
    deleteOrSuggestDeactivate,
    reactivateUser,
    listUsers,
    mapUserToRow,
} from "../../api/user2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmDialog from "../../components/ConfirmDialog";
import MessageDialog from "../../components/MessageDialog";
import { 
    Search, 
    UserPlus, 
    Pencil, 
    Trash2, 
    CheckCircle2, 
    X, 
    ChevronRight,
    User as UserIcon,
    Mail,
    Shield
} from "lucide-react";

/* ---------- Pequeño componente de banner ---------- */
function InfoBanner({ children }) {
    return (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900 shadow-sm">
            <div className="flex gap-3">
                <div className="mt-0.5">ℹ️</div>
                <div>{children}</div>
            </div>
        </div>
    );
}

/* ---------- Badges ---------- */
function RoleBadge({ role }) {
    const configs = {
        ADMIN: { label: "Administrador", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        TECH: { label: "Técnico", cls: "bg-amber-50 text-amber-700 border-amber-200" },
        CLIENT: { label: "Cliente", cls: "bg-blue-50 text-blue-700 border-blue-200" }
    };
    const { label, cls } = configs[role] || { label: role, cls: "bg-gray-50 text-gray-700 border-gray-200" };
    
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
            {label}
        </span>
    );
}

function StateBadge({ active }) {
    return active ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Activo
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactivo
        </span>
    );
}

/* ---------- Validación (alineada al backend) ---------- */
const schema = yup.object({
    document: yup.string().required("Documento requerido"),
    number: yup
        .string()
        .matches(/^3\d{9}$/, "Debe iniciar con 3 y tener 10 dígitos (ej: 3001234567)")
        .required("Número requerido"),
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellido requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    role: yup
        .string()
        .oneOf(["CLIENT", "ADMIN", "TECH"], "Rol inválido")
        .required("Rol requerido"),
});

export default function UsersPage() {
    const navigate = useNavigate();
    const [documento, setDocumento] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState("deactivate");
    const [targetRow, setTargetRow] = useState(null);

    const [msg, setMsg] = useState({ open: false, title: "", message: "", variant: "info" });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({ resolver: yupResolver(schema) });

    const watchNumber = watch("number");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await listUsers();
                const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
                setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U", picture: r.profile_picture })));
                setError("");
            } catch (err) {
                setError("No se pudo cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function buscar(e) {
        e?.preventDefault?.();
        setError("");
        if (!documento.trim()) {
            try {
                setLoading(true);
                const list = await listUsers();
                const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
                setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U", picture: r.profile_picture })));
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
                setRows([{ ...userRow, avatar: userRow.nombre?.slice(0, 1) || "U", picture: userRow.profile_picture }]);
            }
        } catch {
            setRows([]);
            setError("Error al consultar el usuario. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(data) {
        try {
            const payload = {
                document: String(data.document || "").trim(),
                email: String(data.email || "").trim(),
                number: String(data.number || "").replace(/\s+/g, ""),
                role: String(data.role || "").toUpperCase().trim(),
                first_name: String(data.first_name || "").trim(),
                last_name: String(data.last_name || "").trim(),
            };

            const res = await createUser(payload);

            setMsg({
                open: true,
                title: "Usuario creado",
                message:
                    res?.message ||
                    "Usuario creado exitosamente. La contraseña inicial es el mismo número de documento.",
                variant: "success",
            });

            setShowForm(false);
            reset();

            setLoading(true);
            const list = await listUsers();
            const mapped = Array.isArray(list) ? list.map(mapUserToRow) : [];
            setRows(mapped.map((r) => ({ ...r, avatar: r.nombre?.slice(0, 1) || "U", picture: r.profile_picture })));
            setLoading(false);
        } catch (err) {
            console.error("Create user error:", err);
            const dictMsg = (() => {
                if (err && typeof err === "object") {
                    const keys = Object.keys(err).filter((k) => !["status", "url"].includes(k));
                    if (keys.length) {
                        const v = err[keys[0]];
                        return Array.isArray(v) ? v[0] : typeof v === "string" ? v : null;
                    }
                }
                return null;
            })();

            setMsg({
                open: true,
                title: "No se pudo crear",
                message:
                    dictMsg ||
                    err?.detail ||
                    err?.message ||
                    "Revisa los datos: el celular debe iniciar con 3 y tener 10 dígitos; el documento y el correo no deben estar registrados.",
                variant: "error",
            });
        }
    }

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

    async function handleActivateConfirmed() {
        if (!targetRow) return;
        try {
            const res = await reactivateUser(targetRow.document);
            setRows((prev) =>
                prev.map((r) => (r.document === targetRow.document ? { ...r, activo: true } : r))
            );
            setTargetRow(null);
            setConfirmOpen(false);

            setMsg({
                open: true,
                title: "Usuario activado",
                message: res?.detail || res?.message || "El usuario fue activado.",
                variant: "success",
            });
        } catch {
            setMsg({
                open: true,
                title: "No se pudo activar",
                message: "Intenta de nuevo.",
                variant: "error",
            });
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
                    <p className="mt-1 text-gray-500">
                        Administra usuarios, roles y permisos del sistema desde un panel centralizado.
                    </p>
                </div>

                {!showForm && (
                    <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-all active:scale-95"
                        onClick={() => setShowForm(true)}
                    >
                        <UserPlus size={18} />
                        Nuevo Usuario
                    </button>
                )}
            </div>

            {showForm ? (
                <section className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 px-1">
                        <span className="hover:text-blue-600 cursor-pointer" onClick={() => setShowForm(false)}>Usuarios</span>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-semibold">Agregar Usuario</span>
                    </nav>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Usuario</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Ingrese las credenciales iniciales y asigne un rol específico.
                            </p>

                            <InfoBanner>
                                <div className="space-y-1.5">
                                    <p><strong>Contraseña inicial:</strong> El número de documento.</p>
                                    <p><strong>Celular colombiano:</strong> 10 dígitos (ej: 3001234567).</p>
                                </div>
                            </InfoBanner>
                        </div>

                        <form onSubmit={handleSubmit(handleCreate)} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                        <Shield size={14} className="text-blue-500" />
                                        Tipo de Usuario
                                    </label>
                                    <select
                                        {...register("role")}
                                        defaultValue=""
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="" disabled>Seleccionar rol</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="TECH">Técnico</option>
                                        <option value="CLIENT">Cliente</option>
                                    </select>
                                    {errors.role && <p className="text-xs text-red-500 ml-1">{errors.role.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                        <UserIcon size={14} className="text-blue-500" />
                                        Nombre
                                    </label>
                                    <input
                                        {...register("first_name")}
                                        placeholder="Juan"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.first_name && <p className="text-xs text-red-500 ml-1">{errors.first_name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                        <UserIcon size={14} className="text-blue-500" />
                                        Apellido
                                    </label>
                                    <input
                                        {...register("last_name")}
                                        placeholder="Pérez"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.last_name && <p className="text-xs text-red-500 ml-1">{errors.last_name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Número de Documento</label>
                                    <input
                                        {...register("document")}
                                        placeholder="1234567890"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                                    />
                                    {errors.document && <p className="text-xs text-red-500 ml-1">{errors.document.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                        <Mail size={14} className="text-blue-500" />
                                        Correo Electrónico
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        placeholder="juan.perez@ejemplo.com"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Teléfono Móvil</label>
                                    <input
                                        {...register("number", {
                                            onChange: (e) => {
                                                const digits = e.target.value.replace(/\D+/g, "");
                                                setValue("number", digits, { shouldValidate: true });
                                            },
                                        })}
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="3001234567"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                                    />
                                    {errors.number && <p className="text-xs text-red-500 ml-1">{errors.number.message}</p>}
                                </div>
                            </div>

                            <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); reset(); }}
                                    className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {isSubmitting ? "Creando..." : "Crear Usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            ) : (
                <>
                    <form onSubmit={buscar} className="flex flex-wrap items-center gap-3 mb-8">
                        <div className="relative flex-1 group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Search size={18} />
                            </span>
                            <input
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                                placeholder="Buscar usuario por documento..."
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-md active:scale-95"
                        >
                            Aplicar
                        </button>
                    </form>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 lg:rounded-[2.5rem]">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h2 className="font-bold text-gray-800">Lista de Usuarios</h2>
                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-500 shadow-sm">
                                {rows.length} REGISTROS
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-white">
                                    <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                                        <th className="px-8 py-5">Usuario</th>
                                        <th className="px-8 py-5">Correo</th>
                                        <th className="px-8 py-5 text-center">Rol</th>
                                        <th className="px-8 py-5 text-center">Estado</th>
                                        <th className="px-8 py-5">Creado el</th>
                                        <th className="px-8 py-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && (
                                        <tr><td className="p-12 text-center" colSpan={6}>
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-gray-500 font-medium">Cargando usuarios...</span>
                                            </div>
                                        </td></tr>
                                    )}
                                    {!loading && rows.length === 0 && (
                                        <tr><td className="p-12 text-center" colSpan={6}>
                                            <div className="text-gray-400 flex flex-col items-center gap-2">
                                                <Search size={40} className="text-gray-200" />
                                                <p className="font-medium">No se encontraron usuarios</p>
                                            </div>
                                        </td></tr>
                                    )}
                                    {rows.map((u) => (
                                        <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                                        {u.picture ? (
                                                            <img src={u.picture} alt={u.nombre} className="w-full h-full object-cover" />
                                                        ) : (
                                                            u.avatar
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{u.nombre}</div>
                                                        <div className="text-xs text-gray-400 font-medium font-mono">{u.document}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="text-sm text-gray-600 font-medium">{u.correo}</div>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <RoleBadge role={u.rol} />
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <StateBadge active={u.activo} />
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="text-sm text-gray-500 font-medium">{u.fecha}</div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        title="Editar Usuario"
                                                        className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all"
                                                        onClick={() => navigate(`/admin/usuarios/${u.document}`)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    
                                                    {u.activo ? (
                                                        <button
                                                            title="Desactivar Usuario"
                                                            className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all"
                                                            onClick={() => { setConfirmAction("deactivate"); setTargetRow(u); setConfirmOpen(true); }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            title="Activar Usuario"
                                                            className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all"
                                                            onClick={() => { setConfirmAction("activate"); setTargetRow(u); setConfirmOpen(true); }}
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title={confirmAction === "deactivate" ? "Desactivar" : "Activar"}
                message={confirmAction === "deactivate" 
                    ? `¿Estás seguro de desactivar al usuario con documento ${targetRow?.document}?` 
                    : `¿Estás seguro de activar al usuario con documento ${targetRow?.document}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmAction === "deactivate" ? handleDeleteConfirmed : handleActivateConfirmed}
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
