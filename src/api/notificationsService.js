// usa la misma forma que los demás servicios
import { api } from "./client";

const qs = (params = {}) =>
    Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

export async function fetchNotifications(params = {}) {
    const query = qs(params);
    return api(`/api/notifications/${query ? `?${query}` : ""}`);
}

export async function fetchUserNotifications(params = {}) {
    const query = qs(params);
    return api(`/api/notifications/user-notifications/${query ? `?${query}` : ""}`);
}

export async function fetchNotificationDetail(id, params = {}) {
    const query = qs(params);
    return api(`/api/notifications/${id}/${query ? `?${query}` : ""}`);
}

export async function markNotificationAsRead(id, params = {}) {
    const query = qs(params);
    return api(`/api/notifications/${id}/mark-read/${query ? `?${query}` : ""}`, {
        method: "PUT",
        body: { estado: "LEIDA" },
    });
}

export async function fetchNotificationStats() {
    return api("/api/notifications/stats/");
}

export async function fetchNotificationTypes() {
    return api("/api/notifications/types/");
}
