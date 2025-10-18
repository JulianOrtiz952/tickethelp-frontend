// API functions para gestión de usuarios

import { api } from "./client"

// Lista de avatares disponibles para asignar aleatoriamente
export const AVATAR_SEEDS = [
    "Emery",
    "Sophia",
    "Riley",
    "Nolan",
    "Brian",
    "Jocelyn",
    "Andrea",
    "George",
]

export async function listUsers() {
  return api("/api/users/")
}

export async function getUserByDocument(document) {
  const list = await listUsers()
  const user = Array.isArray(list) ? list.find((u) => String(u.document) === String(document)) : null
  return user
}

export async function updateMe(document, payload) {
  return api(`/api/me/${encodeURIComponent(document)}`, {
    method: "PUT",
    body: payload,
  })
}

export async function changePassword(document, body) {
  return api(`/api/me/change-password/${encodeURIComponent(document)}/`, {
    method: "POST",
    body,
  })
}

export async function updateProfilePicture(document, avatarSeed) {
  // Usa PNG para evitar bloqueos por SVG en algunos validadores
  const url = `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
    avatarSeed
  )}&size=256`;

  // El endpoint espera JSON y método PUT/PATCH
  return api(`/api/users/update-profile-picture/${encodeURIComponent(document)}/`, {
    method: "PUT",
    body: { profile_picture: url }, // <-- JSON, no FormData
  });
}

export async function createUser(payload) {
  return api("/api/users/", { method: "POST", body: payload })
}
