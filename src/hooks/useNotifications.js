// src/hooks/useNotifications.js
import { useCallback, useEffect, useState } from "react";
import {
    fetchNotifications,           // ← usa este: filtra por request.user en tu backend
    fetchNotificationDetail,
    markNotificationAsRead,
    fetchNotificationStats,
} from "../api/notificationsService";
import { useAuth } from "../pages/auth/AuthContext";

export function useNotifications() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    const load = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            // ⚠️ Requiere estar autenticado (el backend usa request.user)
            if (!user) {
                setItems([]);
                return;
            }

            // GET /notifications?{filters}
            const data = await fetchNotifications(filters);
            const list = data.notifications ?? data; // por si tu service envía { notifications: [...] }
            setItems(list);

            try {
                const s = await fetchNotificationStats();
                setStats(s);
            } catch {
                /* silencioso */
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // detalle y marcar como leída NO necesitan cambios
    const get = useCallback((id) => fetchNotificationDetail(id), []);
    const markRead = useCallback((id) => markNotificationAsRead(id), []);

    useEffect(() => { load(); }, [load]);

    return { items, loading, error, stats, reload: load, get, markRead };
}
