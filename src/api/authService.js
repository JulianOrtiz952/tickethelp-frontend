import { api } from "./client";

const DEMO_FLAG = "__demo_auth__";

function enableDemo() { localStorage.setItem(DEMO_FLAG, "1"); }
function disableDemo() { localStorage.removeItem(DEMO_FLAG); }
function isDemo() { return localStorage.getItem(DEMO_FLAG) === "1"; }

function createFakeToken(email) {
    const payload = { email, demo: true, iat: Date.now(), exp: Date.now() + 24 * 3600 * 1000 };
    return `demo.${btoa(JSON.stringify(payload))}`;
}

export async function loginApi({ email, password }) {
    try {
        // INTENTO REAL
        const data = await api("/api/users/auth/login/", {
            method: "POST",
            body: { email, password },
        });
        const access = data.access || data.token || data?.tokens?.access;
        if (!access) throw new Error("No se recibió access token.");
        localStorage.setItem("access", access);
        disableDemo();
        return data;
    } catch (err) {
        // FALLBACK DEMO SOLO SI EL BACK NO TIENE LA RUTA (404)
        if (err?.status === 404) {
            enableDemo();
            const fake = createFakeToken(email);
            localStorage.setItem("access", fake);
            return { access: fake, demo: true };
        }
        throw err;
    }
}

export async function validateTokenApi() {
    if (isDemo()) return { active: true, demo: true };
    return api("/api/users/auth/validate-token/");
}

export async function meApi() {
    if (isDemo()) {
        const token = localStorage.getItem("access") || "";
        let email = "demo@local";
        try { email = JSON.parse(atob(token.split(".")[1]))?.email || email; } catch { }
        return {
            email,
            document: "000000000",
            first_name: "Demo",
            last_name: "Local",
            role: "ADMIN",
            is_active: true,
        };
    }
    return api("/api/users/auth/user-data/");
}

export function logoutApi() {
    localStorage.removeItem("access");
    disableDemo();
}
