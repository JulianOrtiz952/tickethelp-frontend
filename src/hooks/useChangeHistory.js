// src/hooks/useChangeHistory.js
import { useCallback, useState } from "react";
import { fetchChangeHistory, fetchChangeHistoryDetail } from "../api/changeHistoryService";
import { useAuth } from "../pages/auth/AuthContext";

export function useChangeHistory() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
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
                const list = data.historial ?? [];

                setItems(list);
            } catch (e) {
                console.error("Error en load()", e);
                setError(true);    // usado por tu componente
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    const get = useCallback((id) => fetchChangeHistoryDetail(id), []);

   

    return { items, loading, error, reload: load, get };
}
