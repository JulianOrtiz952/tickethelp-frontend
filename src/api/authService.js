// src/api/authService.js
import { api } from "./client";

// LOGIN
export async function loginApi({ email, password }) {
  const data = await api("/api/users/auth/login/", {
    method: "POST",
    body: { email, password },
  });

  // Soporta distintas respuestas del backend
  const access = data.access || data.token || data?.tokens?.access;
  const refresh = data.refresh || data?.tokens?.refresh;
  if (!access) throw new Error("No se recibió access token.");

  // Guarda en LS; si luego haces refresh, puedes moverlo a SS
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  return data;
}

// VALIDAR TOKEN
export function validateTokenApi() {
  return api("/api/users/auth/validate-token/");
}

// DATOS DEL USUARIO (desde token)
export function meApi() {
  return api("/api/users/auth/user-data/");
}

// LOGOUT
export function logoutApi() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  sessionStorage.removeItem("access");
}
