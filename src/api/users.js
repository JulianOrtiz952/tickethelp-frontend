import { api } from "./client"

/** Obtiene por documento*/
export async function getUserByDocument(document) {
  return api(`/api/users/${encodeURIComponent(String(document))}/`, { method: "GET" })
}

/**  ACTUALIZA perfil propio — usa /api/me/ para usuarios no-admin */
export async function updateMe(document, payload) {
  // Usar el endpoint /api/me/ que permite a usuarios TECH/CLIENT actualizar su propia info
  return api("/api/me/", { method: "PATCH", body: payload })
}

/** Cambiar password usando endpoint de usuario actual */
export async function changePassword(document, body) {
  // Usar /api/me/change-password/ en lugar de /api/users/{document}/change-password/
  return api("/api/me/change-password/", {
    method: "POST",
    body,
  })
}

/** Foto de perfil  */
export async function updateProfilePicture(document, avatarSeed) {
  const doc = String(document || "").trim()
  if (!doc) throw new Error("Documento requerido")
  if (!avatarSeed) throw new Error("Seed de avatar requerida")
  const url = `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(avatarSeed)}&size=256`
  return api(`/api/users/update-profile-picture/${encodeURIComponent(doc)}/`, {
    method: "PUT",
    body: { profile_picture: url },
  })
}

export async function getSelf() {
  return api("/api/users/auth/user-data/", { method: "GET" })
}
