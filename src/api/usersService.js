// src/api/usersService.js
import { api } from "./client";

/** 
 * Obtiene usuario por documento usando tu cliente tipo fetch.
 * IMPORTANTE: Esta función SÍ funciona con tu backend.
 */
export async function getUserByDocument(document) {
  const doc = encodeURIComponent(String(document));
  return api(`/api/users/${doc}/`, { method: "GET" });
}

/** ACTUALIZA perfil propio — usa /api/me/ para usuarios no-admin */
export async function updateMe(document, payload) {
  return api("/api/me/", { method: "PATCH", body: payload });
}

/** Cambiar password usando endpoint de usuario actual */
export async function changePassword(document, body) {
  return api("/api/me/change-password/", {
    method: "POST",
    body,
  });
}

/** Actualizar foto de perfil guardando el URL o seed */
export async function updateProfilePicture(document, avatarSeed) {
  const doc = String(document || "").trim();
  if (!doc) throw new Error("Documento requerido");
  if (!avatarSeed) throw new Error("Seed de avatar requerida");

  const url = `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
    avatarSeed
  )}&size=256`;

  return api(`/api/users/update-profile-picture/${encodeURIComponent(doc)}/`, {
    method: "PUT",
    body: { profile_picture: url },
  });
}

/** Datos del usuario actual */
export async function getSelf() {
  return api("/api/users/auth/user-data/", { method: "GET" });
}
