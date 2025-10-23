// src/hooks/useNotifications.js
import { useCallback, useEffect, useState } from "react";
import { fetchNotifications, fetchUserNotifications, fetchNotificationDetail, markNotificationAsRead, fetchNotificationStats } from "../api/notificationsService";
import { useAuth } from "../pages/auth/AuthContext";

export function useNotifications({ unauthParams } = {}) {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    const load = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            if (unauthParams) {
                const data = await fetchUserNotifications({ ...unauthParams, ...filters });
                const list = data.notifications ?? data;
                setItems(list);
            } else {
                // 1) intento normal (requiere auth)
                let data;
                try {
                    data = await fetchNotifications(filters);
                } catch (e) {
                    // 2) fallback si 400 + tienes user: llama /user-notifications/?user_id=...
                    const status = e?.response?.status || e?.status;
                    if (status === 400 && user?.id) {
                        data = await fetchUserNotifications({ user_id: user.id, ...filters });
                    } else {
                        throw e;
                    }
                }
                const list = data.notifications ?? data;
                setItems(list);
                try { setStats(await fetchNotificationStats()); } catch { }
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [unauthParams, user?.id]);

    const get = useCallback((id) => fetchNotificationDetail(id, unauthParams || {}), [unauthParams]);
    const markRead = useCallback((id) => markNotificationAsRead(id, unauthParams || {}), [unauthParams]);

    useEffect(() => { load(); }, [load]);
    return { items, loading, error, stats, reload: load, get, markRead };
}
