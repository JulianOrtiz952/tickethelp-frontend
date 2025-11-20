import { api } from "./client";

const qs = (params = {}) =>
    Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

/**
 * Obtener historial de un ticket
 * GET /api/tickets/<ticket_id>/history/?user_document=...
 */
export async function fetchChangeHistory(params = {}) {
    const { ticket, user_document, ...rest } = params;

    if (!ticket) {
        throw new Error("Debes enviar el número de ticket");
    }

    const query = qs({ user_document, ...rest });
    return api(`/api/tickets/${ticket}/history/${query ? `?${query}` : ""}`);
}


export async function fetchChangeHistoryDetail(id, params = {}) {
    console.warn("⚠️ Advertencia: tu backend NO tiene endpoint para detalle del historial.");
    const query = qs(params);
    return api(`/api/tickets/${id}/history/${query ? `?${query}` : ""}`);
}
