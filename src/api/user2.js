// api/user2.js
import { api } from "./client.js";

export const ROLES = ["ADMIN", "TECH", "CLIENT"];

/** Normaliza para la tabla */
export function mapUserToRow(u) {
    if (!u) return null;
    return {
        id: u.id ?? Math.random().toString(36).slice(2),
        pk: u.id,
        document: u.document,
        nombre: [u.first_name, u.last_name].filter(Boolean).join(" "),
        correo: u.email,
        numero: u.number,
        rol: u.role,
        activo: u.is_active,
        fecha: u.date_joined?.slice(0, 10)?.split("-")?.reverse()?.join("/") || "-",
        raw: u,
    };
}

export function validateNewUserPayload(payload) {
    const errors = {};
    if (!payload) return { valid: false, errors: { general: "Payload requerido" } };

    for (const k of ["document", "email", "password"]) {
        if (!payload[k] || String(payload[k]).trim() === "") errors[k] = "Campo requerido";
    }
    if (payload.role && !ROLES.includes(payload.role)) {
        errors.role = `Rol inválido. Usa: ${ROLES.join(", ")}`;
    }
    if (payload.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
        errors.email = "Correo inválido";
    }
    if (payload.password && payload.password.length < 8) {
        errors.password = "La contraseña debe tener mínimo 8 caracteres";
    }
    return { valid: Object.keys(errors).length === 0, errors };
}

const USERS = "/api/users//";


const USER_DETAIL_BY_ID = (id) => `/api/users/${encodeURIComponent(String(id))}/`;
const USER_DEACTIVATE_BY_ID = (id) => `/api/users/${encodeURIComponent(String(id))}/deactivate/`;

/** Lista completa */
export async function listUsers() {
    return api(USERS);
}

/** Buscar por document en la lista general (cualquier rol) */
export async function getUserByDocument(document, { normalize = false } = {}) {
    const doc = String(document || "").trim();
    if (!doc) {
        const e = new Error("Documento vacío");
        e.status = 400;
        throw e;
    }
    const all = await listUsers();
    if (!Array.isArray(all)) throw new Error("Respuesta inesperada del backend");
    const found = all.find((u) => String(u.document) === doc);
    if (!found) {
        const e = new Error("Usuario no encontrado");
        e.status = 404;
        throw e;
    }
    return normalize ? mapUserToRow(found) : found;
}

/** Crear usuario */
export async function createUser(payload, { precheckDuplicates = true } = {}) {
    const v = validateNewUserPayload(payload);
    if (!v.valid) {
        throw { code: "VALIDATION_ERROR", errors: v.errors, message: "Validación fallida" };
    }

    if (precheckDuplicates) {
        try {
            const list = await listUsers();
            const exists = Array.isArray(list) &&
                list.some((u) => String(u.email).toLowerCase() === String(payload.email).toLowerCase());
            if (exists) throw { code: "EMAIL_DUPLICATE", message: "correo ya registrado" };
        } catch { /* si falla el precheck, seguimos */ }
    }

    try {
        return await api(USERS, { method: "POST", body: payload });
    } catch (err) {
        const msg = (err?.message || err?.detail || "").toLowerCase();
        if (msg.includes("duplic") || msg.includes("already") || msg.includes("correo")) {
            throw { code: "EMAIL_DUPLICATE", message: "correo ya registrado" };
        }
        throw err;
    }
}

/** Actualizar por DOCUMENT, resolviendo primero el PK y luego PATCH /api/users/{id}/ */
export async function updateUser(document, partialPayload) {
    const target = await getUserByDocument(document);
    const id = target?.id;
    if (!id && id !== 0) {
        const e = new Error("El backend no devuelve 'id' en el listado. Pide al backend agregar 'id' al serializer.");
        e.code = "MISSING_ID";
        throw e;
    }
    // Sanitiza y normaliza
    const body = {};
    if (partialPayload.first_name !== undefined) body.first_name = String(partialPayload.first_name).trim();
    if (partialPayload.last_name !== undefined) body.last_name = String(partialPayload.last_name).trim();
    if (partialPayload.email !== undefined) body.email = String(partialPayload.email).trim();
    if (partialPayload.number !== undefined) body.number = partialPayload.number ? String(partialPayload.number).replace(/\s+/g, "") : null;
    if (partialPayload.role !== undefined) body.role = String(partialPayload.role).toUpperCase().trim();
    if (partialPayload.is_active !== undefined) body.is_active = Boolean(partialPayload.is_active);

    return api(USER_DETAIL_BY_ID(id), { method: "PATCH", body });
}

/** Desactivar por DOCUMENT usando acción /deactivate/ del ViewSet */
export async function deleteOrSuggestDeactivate(document) {
    const target = await getUserByDocument(document);
    const id = target?.id;
    if (!id && id !== 0) {
        const e = new Error("El backend no devuelve 'id' en el listado. Pide al backend agregar 'id' al serializer.");
        e.code = "MISSING_ID";
        throw e;
    }
    try {
        const resp = await api(USER_DEACTIVATE_BY_ID(id), { method: "POST" });
        return { action: "deactivated", message: resp?.detail || "Usuario desactivado." };
    } catch (err) {
        // fallback: PATCH is_active=false
        await api(USER_DETAIL_BY_ID(id), { method: "PATCH", body: { is_active: false } });
        return { action: "deactivated", message: "Usuario desactivado." };
    }
}

/** Reactivar por DOCUMENT (PATCH is_active=true) */
export async function reactivateUser(document) {
    const target = await getUserByDocument(document);
    const id = target?.id;
    if (!id && id !== 0) {
        const e = new Error("El backend no devuelve 'id' en el listado. Pide al backend agregar 'id' al serializer.");
        e.code = "MISSING_ID";
        throw e;
    }
    return api(USER_DETAIL_BY_ID(id), { method: "PATCH", body: { is_active: true } });
}
