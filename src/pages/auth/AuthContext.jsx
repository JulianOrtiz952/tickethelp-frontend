import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi, validateTokenApi, logoutApi } from "../../api/authService";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [user, setUser] = useState(null);

    function clearCreds() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
    }

    useEffect(() => {
        (async () => {
            try {
                const token =
                    sessionStorage.getItem("access") || localStorage.getItem("access");
                if (!token) {
                    setLoading(false);
                    return;
                }

                await validateTokenApi();
                const u = await meApi();
                setUser(u);
                setIsAuthed(true);
            } catch {
                clearCreds();
                setIsAuthed(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function login({ email, password, remember }) {
        const data = await loginApi({ email, password });
        const access = localStorage.getItem("access");

        if (remember) {
            // se queda en localStorage
        } else {
            // mover a sessionStorage
            if (access) sessionStorage.setItem("access", access);
            localStorage.removeItem("access");
        }

        const u = await meApi();
        setUser(u);
        setIsAuthed(true);

        const mustChange =
            data?.must_change_password ?? u?.must_change_password ?? false;

        return {
            user: u,
            token: access || sessionStorage.getItem("access") || null,
            mustChange,
        };
    }

    function logout() {
        logoutApi();
        setIsAuthed(false);
        setUser(null);
        clearCreds();
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
