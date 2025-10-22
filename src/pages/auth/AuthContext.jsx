import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi, validateTokenApi, logoutApi } from "../../api/authService";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("access");
                if (!token) { setLoading(false); return; }
                await validateTokenApi();   // en demo devuelve {active:true}
                const u = await meApi();    // en demo devuelve usuario ficticio
                setUser(u);
                setIsAuthed(true);
            } catch {
                localStorage.removeItem("access");
                setIsAuthed(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function login({ email, password /*, remember*/ }) {
        const data = await loginApi({ email, password }); // real o demo si 404
        const u = await meApi();
        setUser(u);
        setIsAuthed(true);
        return data;
    }

    function logout() {
        logoutApi();
        setIsAuthed(false);
        setUser(null);
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
