// src/hooks/useChangeHistory.js
import { useCallback, useState } from "react";
import { fetchChangeHistory } from "../api/changeHistoryService";
import { useAuth } from "../pages/auth/AuthContext";
import { getUserByDocument } from "../api/usersService";

export function useChangeHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const load = useCallback(
    async (filters = {}) => {
      setHasSearched(true);
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        if (!user) {
          setItems([]);
          return;
        }

        // 1️⃣ Cargar historial
        const data = await fetchChangeHistory(filters);
        let list = data.historial ?? [];

        // 2️⃣ Enriquecer cada item con foto/seed REAL consultando backend
        list = await Promise.all(
          list.map(async (item) => {
            const doc = item.realizado_por_documento;
            if (!doc) return item;

            // Consultar el usuario real del backend
            let result = null;
            try {
              result = await getUserByDocument(doc);
            } catch (err) {
              console.warn("Error consultando usuario:", doc, err);
            }

            // El backend retorna { user: {...} } o { ... }
            const profile = result?.user ?? result ?? null;

            return {
              ...item,
              // Seed real/foto real si existe
              realizado_por_seed: profile?.profile_picture || null,
              
              realizado_por_email:
                item.realizado_por_email || profile?.email || null,

              realizado_por_nombre:
                item.realizado_por_nombre ||
                profile?.first_name ||
                profile?.name ||
                null,
            };
          })
        );

        setItems(list);

      } catch (e) {
        const msg = e?.message ?? "";

        if (
          msg.includes("No Ticket matches") ||
          msg.includes("No encontrado") ||
          msg.includes("not exist")
        ) {
          setNotFound(true);
          setItems([]);
          return;
        }

        if (msg.includes("token") || msg.includes("Unauthorized")) {
          setError("unauthorized");
          setItems([]);
          return;
        }

        console.error("Error en load()", e);
        setError("generic");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { items, loading, error, notFound, hasSearched, reload: load };
}
