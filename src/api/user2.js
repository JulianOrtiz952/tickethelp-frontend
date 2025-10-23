// api/user2.js
import { api } from "./client.js";

export const ROLES = ["ADMIN", "TECH", "CLIENT"];

export function mapUserToRow(u) {
    if (!u) return null;
    return {
        id: u.document,
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

    for (const k of ["document", "email"]) {
        if (!payload[k] || String(payload[k]).trim() === "") errors[k] = "Campo requerido";
    }
    if (payload.role && !ROLES.includes(payload.role)) {
        errors.role = `Rol inválido. Usa: ${ROLES.join(", ")}`;
    }
    if (payload.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
        errors.email = "Correo inválido";
    }
    return { valid: Object.keys(errors).length === 0, errors };
}

const USERS_LIST = "/api/users/";
const USERS_CREATE = "/api/users/create/";
const USER_DETAIL = (pk) => `/api/users/${encodeURIComponent(String(pk))}/`;
const USER_UPDATE_ADMIN = (pk) => `/api/users/update-user/${encodeURIComponent(String(pk))}/`;
const USER_DEACTIVATE = (pk) => `/api/users/deactivate/${encodeURIComponent(String(pk))}`;
const USER_ACTIVATE = (pk) => `/api/users/activate/${encodeURIComponent(String(pk))}/`;
const USER_DELETE = (pk) => `/api/users/delete/${encodeURIComponent(String(pk))}`;
const USER_UPDATE_PICTURE = (pk) => `/api/users/update-profile-picture/${encodeURIComponent(String(pk))}/`;

export async function listUsers() { return api(USERS_LIST); }

export async function getUserByDocument(document, { normalize = false } = {}) {
    const doc = String(document || "").trim();
    if (!doc) { const e = new Error("Documento vacío"); e.status = 400; throw e; }
    const data = await api(USER_DETAIL(doc));
    return normalize ? mapUserToRow(data) : data;
}

export async function createUser(payload) {
    const v = validateNewUserPayload(payload);
    if (!v.valid) throw { code: "VALIDATION_ERROR", errors: v.errors };
    const { password, ...rest } = payload || {}; // 👈 no enviamos password
    return api(USERS_CREATE, { method: "POST", body: rest });
}

export async function updateUser(document, partialPayload = {}) {
    const pk = encodeURIComponent(String(document));
    const url = USER_UPDATE_ADMIN(pk);
    const current = await api(USER_DETAIL(pk));
    const trim = (v) => (typeof v === "string" ? v.trim() : v);
    const normNum = (v) => (v == null ? null : String(v).replace(/\s+/g, ""));
    const upper = (v) => (typeof v === "string" ? v.toUpperCase() : v);

    const nextRaw = {
        username: current.username ?? undefined,
        email: trim(partialPayload.email ?? current.email ?? ""),
        role: upper(trim(partialPayload.role ?? current.role ?? "")),
        is_active:
            partialPayload.is_active !== undefined
                ? Boolean(partialPayload.is_active)
                : typeof current.is_active === "boolean"
                    ? current.is_active
                    : undefined,
        document: current.document ?? undefined,
        first_name: trim(partialPayload.first_name ?? current.first_name ?? ""),
        last_name: trim(partialPayload.last_name ?? current.last_name ?? ""),
        number: normNum(partialPayload.number ?? (current.number ?? null)),
    };

    const next = {};
    for (const [k, v] of Object.entries(nextRaw)) {
        if (v === undefined) continue;
        if (typeof v === "string" && v.trim() === "") continue;
        next[k] = v;
    }

    try {
        return await api(url, { method: "PATCH", body: next });
    } catch (err) {
        if (err?.status === 404 || err?.status === 405) {
            return api(url, { method: "PUT", body: next });
        }
        console.error("Update failed:", err);
        throw err;
    }
}

export async function deleteOrSuggestDeactivate(document) {
    const pk = encodeURIComponent(String(document));
    try {
        const resp = await api(USER_DEACTIVATE(pk), { method: "POST" });
        return { action: "deactivated", message: resp?.detail || "Usuario desactivado." };
    } catch {
        await api(USER_UPDATE_ADMIN(pk), { method: "PATCH", body: { is_active: false } });
        return { action: "deactivated", message: "Usuario desactivado (por fallback)." };
    }
}

export async function reactivateUser(document) {
    return api(USER_ACTIVATE(document), { method: "POST" });
}

export async function deleteUser(document) {
    return api(USER_DELETE(document), { method: "DELETE" });
}

export async function updateUserProfilePicture(document, file) {
    if (!file) throw new Error("Archivo requerido");
    const fd = new FormData();
    fd.append("profile_picture", file);
    return api(USER_UPDATE_PICTURE(document), { method: "PATCH", body: fd });
}
