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

  // Obtener solicitudes pendientes de aprobación
  async getPendingApprovals() {
    const data = await api("/api/tickets/pending-approvals/")
    return data.requests || []
  },

  // Aprobar cambio de estado de un ticket (de En pruebas a Finalizado)
  async approveStateChange(ticketId) {
    return api(`/api/tickets/testing-approval/${ticketId}/`, {
      method: "POST",
      body: { action: "approve" },
    })
  },

  // Rechazar cambio de estado de un ticket (volver a la fase anterior)
  async rejectStateChange(ticketId, rejectionReason = "Rechazado por el administrador") {
    return api(`/api/tickets/testing-approval/${ticketId}/`, {
      method: "POST",
      body: {
        action: "reject",
        rejection_reason: rejectionReason,
      },
    })
  },

  // Cancelar un ticket
  async cancelTicket(ticketId, userDocument = null) {
    const url = userDocument 
      ? `/api/tickets/cancel/${ticketId}/?user_document=${userDocument}`
      : `/api/tickets/cancel/${ticketId}/`
    return api(url, {
      method: "PUT",
    })
  },

  // Consultar adjuntos de un ticket
  async getAttachments(ticketId) {
    return api(`/api/tickets/${ticketId}/attachments/`)
  },

  // Subir archivo adjunto a un ticket
  async uploadAttachment(ticketId, file) {
    const formData = new FormData()
    formData.append("archivo", file)
    return api(`/api/tickets/${ticketId}/attachments/`, {
      method: "POST",
      body: formData,
    })
  },
}
