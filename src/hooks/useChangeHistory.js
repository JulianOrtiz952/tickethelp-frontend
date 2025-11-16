// src/hooks/useChangeHistory.js
import { useCallback, useEffect, useState } from "react";
import { fetchChangeHistory, fetchChangeHistoryDetail } from "../api/changeHistoryService";
import { useAuth } from "../pages/auth/AuthContext";

export function useChangeHistory() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(
        async (filters = {}) => {
            setLoading(true);
            setError(null);
            try {
                if (!user) {
                    setItems([]);
                    return;
                }

                const data = await fetchChangeHistory(filters);
                const list = data.results ?? data.changes ?? data; // adapta a tu backend
                setItems(list);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    const get = useCallback((id) => fetchChangeHistoryDetail(id), []);

    useEffect(() => {
        load();
    }, [load]);

    return { items, loading, error, reload: load, get };
}
