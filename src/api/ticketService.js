const API_BASE_URL = "https://tickethelp-backend.onrender.com/api"

export const ticketService = {
  // Obtener todos los tickets
  async getTickets() {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/`)
      if (!response.ok) throw new Error("Error al obtener tickets")
      return await response.json()
    } catch (error) {
      console.error("Error fetching tickets:", error)
      throw error
    }
  },

  // Obtener todos los usuarios
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`)
      if (!response.ok) throw new Error("Error al obtener usuarios")
      return await response.json()
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  // Obtener técnicos activos
  async getActiveTechnicians() {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/active-technicians/`)
      if (!response.ok) throw new Error("Error al obtener técnicos")
      return await response.json()
    } catch (error) {
      console.error("Error fetching technicians:", error)
      throw error
    }
  },

  // Cambiar técnico asignado a un ticket
  async changeTechnician(ticketId, technicianId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/change-technician/${ticketId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tecnico: technicianId }),
      })
      if (!response.ok) throw new Error("Error al cambiar técnico")
      return await response.json()
    } catch (error) {
      console.error("Error changing technician:", error)
      throw error
    }
  },
}
