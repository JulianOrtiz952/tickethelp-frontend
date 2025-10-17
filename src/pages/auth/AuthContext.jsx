import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        const v = localStorage.getItem("tkh_auth") === "1";
        setIsAuthed(v);
        setLoading(false);
    }, []);

    function loginDemo() {
        localStorage.setItem("tkh_auth", "1");
        setIsAuthed(true);
    }
    function logoutDemo() {
        localStorage.removeItem("tkh_auth");
        setIsAuthed(false);
    }

    return (
        <AuthCtx.Provider value={{ loading, isAuthed, loginDemo, logoutDemo }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
