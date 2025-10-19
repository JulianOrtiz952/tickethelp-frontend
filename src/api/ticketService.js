import { api } from "./client"

export const ticketService = {
  // Obtener todos los tickets
  async getTickets() {
    return api("/api/tickets/")
  },

  // Obtener todos los usuarios
  async getUsers() {
    return api("/api/users/")
  },

  // Obtener técnicos activos
  async getActiveTechnicians() {
    const data = await api("/api/tickets/active-technicians/")
    return data.tecnicos || []
  },

  // Cambiar técnico asignado a un ticket
  async changeTechnician(ticketId, technicianDocument) {
    return api(`/api/tickets/change-technician/${ticketId}/`, {
      method: "PUT",
      body: { documento_tecnico: technicianDocument },
    })
  },
}