import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi, validateTokenApi, logoutApi } from "../../api/authService";

const AuthCtx = createContext(null);

// Lee el rol desde el payload del JWT (claim "role" o "groups")
function getRoleFromToken(token) {
    try {
        const [, b64] = token.split(".");
        if (!b64) return null;
        const json = JSON.parse(atob(b64));
        const raw =
            json?.role ||
            json?.roles?.[0] ||
            json?.groups?.[0] ||
            json?.user_role ||
            null;
        return typeof raw === "string" ? raw : null;
    } catch {
        return null;
    }
}

// Normaliza múltiples formas a "ADMIN" | "TECH"
function normalizeRole(raw) {
    const r = String(raw || "").trim().toUpperCase();
    if (["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR", "SUPERUSER", "STAFF"].includes(r)) return "ADMIN";
    if (["TECH", "TECNICO", "TÉCNICO", "TECHNICIAN"].includes(r)) return "TECH";
    return r || null;
}

function clearCredsAll() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const token = sessionStorage.getItem("access") || localStorage.getItem("access");
                if (!token) { setLoading(false); return; }

                await validateTokenApi();

                // 1) Trae user del backend
                const u = await meApi();

                // 2) Intenta sacar role del backend; si no viene, del token
                let role = normalizeRole(u?.role);
                if (!role) {
                    const tokenRole = getRoleFromToken(token);
                    role = normalizeRole(tokenRole);
                }

                // Guarda user normalizado (aunque el back no mande role)
                setUser({ ...u, role });

                setIsAuthed(true);
            } catch {
                clearCredsAll();
                setIsAuthed(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function login({ email, password, remember }) {
        const data = await loginApi({ email, password });

        // por defecto loginApi guarda access en localStorage
        const access = localStorage.getItem("access");

        if (!remember) {
            if (access) sessionStorage.setItem("access", access);
            localStorage.removeItem("access");
        }

        const token = sessionStorage.getItem("access") || localStorage.getItem("access") || "";

        const u = await meApi();

        // igual que arriba: role del back o del token
        let role = normalizeRole(u?.role);
        if (!role) {
            const tokenRole = getRoleFromToken(token);
            role = normalizeRole(tokenRole);
        }

        const userNorm = { ...u, role };
        setUser(userNorm);
        setIsAuthed(true);

        const mustChange = data?.must_change_password ?? u?.must_change_password ?? false;

        return { user: userNorm, token, mustChange };
    }

    function logout() {
        logoutApi();
        setIsAuthed(false);
        setUser(null);
        clearCredsAll();
    }

    return (
        <AuthCtx.Provider value={{ loading, isAuthed, user, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
