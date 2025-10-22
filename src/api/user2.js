// api/user2.js
import { api } from "./client.js";

export const ROLES = ["ADMIN", "TECH", "CLIENT"];

/** Normaliza para la tabla */
export function mapUserToRow(u) {
    if (!u) return null;
    return {
        id: u.document, // ahora el pk es document
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

/** Validación de creación */
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

/** 📡 Endpoints base */
const USERS = "/api/users/";
const USER_DETAIL = (document) => `/api/users/${encodeURIComponent(String(document))}/`;
const USER_DEACTIVATE = (document) => `/api/users/${encodeURIComponent(String(document))}/deactivate/`;

/** Obtener todos los usuarios */
export async function listUsers() {
    return api(USERS); // GET /api/users/
}

/** Obtener un usuario por documento */
export async function getUserByDocument(document, { normalize = false } = {}) {
    const doc = String(document || "").trim();
    if (!doc) {
        const e = new Error("Documento vacío");
        e.status = 400;
        throw e;
    }
    const data = await api(USER_DETAIL(doc)); // GET /api/users/{document}/
    return normalize ? mapUserToRow(data) : data;
}

/** Crear usuario */
export async function createUser(payload) {
    const v = validateNewUserPayload(payload);
    if (!v.valid) throw { code: "VALIDATION_ERROR", errors: v.errors };

    return api(USERS, { method: "POST", body: payload });
}




/** ✅ Actualizar usuario*/
export async function updateUser(document, partialPayload = {}) {
    const url = `/api/users/${encodeURIComponent(String(document))}/`;


    const current = await api(url); // GET


    const trim = (v) => (typeof v === "string" ? v.trim() : v);
    const normNum = (v) => (v == null ? null : String(v).replace(/\s+/g, ""));
    const upper = (v) => (typeof v === "string" ? v.toUpperCase() : v);


    const nextRaw = {

        username: current.username ?? undefined,
        email: trim(partialPayload.email ?? current.email ?? ""),
        role: upper(trim(partialPayload.role ?? current.role ?? "")),
        is_active: (partialPayload.is_active !== undefined
            ? Boolean(partialPayload.is_active)
            : (typeof current.is_active === "boolean" ? current.is_active : undefined)),
        document: current.document ?? undefined,


        first_name: trim(partialPayload.first_name ?? current.first_name ?? ""),
        last_name: trim(partialPayload.last_name ?? current.last_name ?? ""),
        number: normNum(partialPayload.number ?? (current.number ?? null)),
    };


    const next = {};
    for (const [k, v] of Object.entries(nextRaw)) {
        if (v === undefined) continue;
        if (typeof v === "string" && v.trim() === "") continue; // evita allow_blank=False
        next[k] = v;
    }


    try {

        const out = await api(url, { method: "PATCH", body: next });
        return out;
    } catch (err) {


        if (err?.status === 404 || err?.status === 405) {
            const out = await api(url, { method: "PUT", body: next });
            return out;
        }

        console.error("Update failed:", err);
        throw err;
    }
}





/** Desactivar usuario */
export async function deleteOrSuggestDeactivate(document) {
    try {
        const resp = await api(USER_DEACTIVATE(document), { method: "POST" });
        return { action: "deactivated", message: resp?.detail || "Usuario desactivado." };
    } catch {
        await api(USER_DETAIL(document), { method: "PATCH", body: { is_active: false } });
        return { action: "deactivated", message: "Usuario desactivado (por fallback)." };
    }
}

/** Reactivar usuario */
export async function reactivateUser(document) {
    return api(USER_DETAIL(document), { method: "PATCH", body: { is_active: true } });
}
