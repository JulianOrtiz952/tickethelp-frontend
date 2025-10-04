import { api } from "./client";

// ✅ Asegúrate de tener este export nombrado
export async function listUsers() {
  return api("/api/users//"); // respeta el doble slash que te dieron
}

// ✅ Y que getUserByDocument la use (si quieres)
export async function getUserByDocument(document) {
  const list = await listUsers();
  return Array.isArray(list)
    ? list.find((u) => String(u.document) === String(document))
    : null;
}

export async function updateMe(document, payload) {
  return api(`/api/me/${encodeURIComponent(document)}`, {
    method: "PUT",
    body: payload,
  });
}

export async function changePassword(document, body) {
  return api(`/api/me/change-password/${encodeURIComponent(document)}/`, {
    method: "POST",
    body,
  });
}

export async function createUser(payload) {
  return api("/api/users//", { method: "POST", body: payload });
}
