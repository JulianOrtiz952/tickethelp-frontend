import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    document: yup.string().required("Documento requerido"),
    number: yup.string().matches(/^\d{7,15}$/, "Solo dígitos (7 a 15)").required("Número requerido"),
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellido requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    role: yup.string().oneOf(["CLIENT", "ADMIN", "TECH"], "Rol inválido").required("Rol requerido"),
    // password solo en creación
    password: yup.string().when("isEdit", (isEdit, s) =>
        isEdit ? s.optional() : s.min(6, "Mínimo 6 caracteres").required("Contraseña requerida")
    ),
    isEdit: yup.boolean().default(false),
});

export default function UserFormModal({ open, onClose, onSubmit, defaultValues, isEdit = false }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm({ defaultValues: { ...defaultValues, isEdit }, resolver: yupResolver(schema) });

    useEffect(() => { reset({ ...defaultValues, isEdit }); }, [defaultValues, isEdit, reset]);
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                </div>

                <form className="px-6 py-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Documento y Teléfono */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm">Documento</label>
                            <input
                                className="w-full border rounded-lg p-2"
                                {...register("document")}
                                disabled={isEdit}  // documento no editable en edición
                            />
                            <p className="text-red-600 text-xs">{errors.document?.message}</p>
                        </div>
                        <div>
                            <label className="text-sm">Número (tel)</label>
                            <input className="w-full border rounded-lg p-2" {...register("number")} />
                            <p className="text-red-600 text-xs">{errors.number?.message}</p>
                        </div>
                    </div>

                    {/* Nombres */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm">Nombre</label>
                            <input className="w-full border rounded-lg p-2" {...register("first_name")} />
                            <p className="text-red-600 text-xs">{errors.first_name?.message}</p>
                        </div>
                        <div>
                            <label className="text-sm">Apellido</label>
                            <input className="w-full border rounded-lg p-2" {...register("last_name")} />
                            <p className="text-red-600 text-xs">{errors.last_name?.message}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm">Correo</label>
                        <input className="w-full border rounded-lg p-2" type="email" {...register("email")} />
                        <p className="text-red-600 text-xs">{errors.email?.message}</p>
                    </div>

                    {/* Rol */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm">Rol</label>
                            <select className="w-full border rounded-lg p-2" {...register("role")}>
                                <option value="CLIENT">Cliente</option>
                                <option value="ADMIN">Administrador</option>
                                <option value="TECH">Técnico</option>
                            </select>
                            <p className="text-red-600 text-xs">{errors.role?.message}</p>
                        </div>
                    </div>

                    {/* Password solo en creación */}
                    {!isEdit && (
                        <div>
                            <label className="text-sm">Contraseña</label>
                            <input className="w-full border rounded-lg p-2" type="password" {...register("password")} />
                            <p className="text-red-600 text-xs">{errors.password?.message}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border">Cancelar</button>
                        <button disabled={isSubmitting} className="px-3 py-2 rounded-lg bg-blue-600 text-white">
                            {isEdit ? "Guardar cambios" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}