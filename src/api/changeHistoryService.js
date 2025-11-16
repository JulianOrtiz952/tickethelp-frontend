// src/api/changeHistoryService.js
import { api } from "./client";

const qs = (params = {}) =>
    Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

/**
 * Historial de cambios de tickets
 * GET /api/change-history/?ticket=...&estado=...
 */
export async function fetchChangeHistory(params = {}) {
    const query = qs(params);
    return api(`/api/change-history/${query ? `?${query}` : ""}`);
}

// por si luego quieres ver el detalle de un cambio concreto
export async function fetchChangeHistoryDetail(id, params = {}) {
    const query = qs(params);
    return api(`/api/change-history/${id}/${query ? `?${query}` : ""}`);
}
