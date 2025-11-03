import { api } from "./client";

/** Obtiene por documento*/
export async function getUserByDocument(document) {
  return api(`/api/users/${encodeURIComponent(String(document))}/`, { method: "GET" });
}

/**  ACTUALIZA por documento — usa PATCH */
export async function updateMe(document, payload) {
  const doc = String(document || "").trim();
  if (!doc) throw new Error("Documento requerido para actualizar el perfil");

  return api(
    `/api/users/update-user/${encodeURIComponent(doc)}/`,
    { method: "PATCH", body: payload }
  );
}

/** Cambiar password  */
export async function changePassword(document, body) {
  const doc = String(document || "").trim();
  if (!doc) throw new Error("Documento requerido para cambiar contraseña");
  return api(`/api/users/${encodeURIComponent(doc)}/change-password/`, {
    method: "POST",
    body,
  });
}

/** Foto de perfil  */
export async function updateProfilePicture(document, avatarSeed) {
  const doc = String(document || "").trim();
  if (!doc) throw new Error("Documento requerido");
  if (!avatarSeed) throw new Error("Seed de avatar requerida");
  const url = `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(avatarSeed)}&size=256`;
  return api(`/api/users/update-profile-picture/${encodeURIComponent(doc)}/`, {
    method: "PUT",
    body: { profile_picture: url },
  });
}
