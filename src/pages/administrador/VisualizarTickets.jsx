"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogSlide } from "../../components/tickets/visualizar_tickets/Dialog"
import { Progress } from "../../components/tickets/visualizar_tickets/Progress"
import { Input } from "../../components/tickets/visualizar_tickets/Input"
import { CircleAlert, Search, Wrench, FlaskConical, CheckCircle, Users, X } from "lucide-react"
import { ticketService } from "../../api/ticketService"

const ESTADO_CONFIG = {
  1: {
    label: "Abierto",
    color: "bg-red-100 text-red-800",
    icon: CircleAlert,
  },
  2: {
    label: "En diagnóstico",
    color: "bg-orange-100 text-orange-800",
    icon: Search,
  },
  3: {
    label: "En reparación",
    color: "bg-yellow-100 text-yellow-800",
    icon: Wrench,
  },
  4: {
    label: "En pruebas",
    color: "bg-blue-100 text-blue-800",
    icon: FlaskConical,
  },
  5: {
    label: "Finalizado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
}

export default function VisualizarTickets() {
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null)
  const [isChangingTechnician, setIsChangingTechnician] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetchTickets()
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await ticketService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getTickets()
      setTickets(data)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTechnicians = async () => {
    try {
      const data = await ticketService.getActiveTechnicians()

      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data)
        setTechnicians([])
        return
      }

      const sortedData = data.sort((a, b) => (a.porcentaje_ocupacion || 0) - (b.porcentaje_ocupacion || 0))
      setTechnicians(sortedData)
    } catch (error) {
      console.error("Error fetching technicians:", error)
      setTechnicians([])
    }
  }

  const getUserByDocument = (document) => {
    return users.find((user) => String(user.document) === String(document))
  }

  const getTechnicianName = (technicianDocument) => {
    const user = getUserByDocument(technicianDocument)
    if (!user) return "No asignado"
    return `${user.first_name} ${user.last_name}`.trim() || user.email
  }

  const getTechnicianAvatar = (technicianDocument) => {
    const user = getUserByDocument(technicianDocument)
    return user?.profile_picture || "/default_avatar.svg"
  }

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
    setSelectedTechnicianId(null)
    setSearchTerm("")
    fetchTechnicians()
  }

  const handleChangeTechnician = async () => {
    if (!selectedTicket || !selectedTechnicianId || isChangingTechnician) return

    setIsChangingTechnician(true)
    setErrorMessage("")

    try {
      await ticketService.changeTechnician(selectedTicket.id, selectedTechnicianId)
      fetchTickets()
      setIsModalOpen(false)
      setSelectedTicket(null)
      setSelectedTechnicianId(null)
    } catch (error) {
      console.error("Error changing technician:", error)
      if (error.message.includes("CORS")) {
        setErrorMessage("Error de conexión: El servidor no permite la conexión desde este origen.")
      } else if (error.message.includes("502") || error.message.includes("Bad Gateway")) {
        setErrorMessage("El servidor no está disponible en este momento. Por favor, intenta más tarde.")
      } else if (error.message.includes("Failed to fetch")) {
        setErrorMessage("Error de red: No se pudo conectar con el servidor. Verifica tu conexión.")
      } else {
        setErrorMessage(error.message || "Error al cambiar el técnico. Por favor, intenta nuevamente.")
      }
    } finally {
      setIsChangingTechnician(false)
    }
  }

  const formatTicketNumber = (ticket) => {
    const year = new Date(ticket.creado_en).getFullYear()
    const paddedId = String(ticket.id).padStart(3, "0")
    return `#TK-${year}-${paddedId}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredTechnicians = technicians.filter((tech) => {
    const fullName = `${tech.first_name || ""} ${tech.last_name || ""}`.toLowerCase()
    const email = (tech.email || "").toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || email.includes(search)
  })

  // If is_active is undefined, assume the technician is active
  const availableTechnicians = filteredTechnicians.filter(
    (tech) => tech.is_active !== false && (tech.porcentaje_ocupacion || 0) < 100,
  )

  const unavailableTechnicians = filteredTechnicians.filter(
    (tech) => tech.is_active !== false && (tech.porcentaje_ocupacion || 0) >= 100,
  )

  const inactiveTechnicians = filteredTechnicians.filter((tech) => tech.is_active === false)

  const getWorkloadColor = (percentage) => {
    if (percentage < 40) return "bg-green-500"
    if (percentage < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getWorkloadTextColor = (percentage) => {
    if (percentage < 40) return "text-green-600"
    if (percentage < 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando tickets...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visualizar Tickets</h1>
        <div className="text-sm text-gray-500">Total: {tickets.length} tickets</div>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-6xl">
        {tickets.map((ticket) => {
          const estadoConfig = ESTADO_CONFIG[ticket.estado] || ESTADO_CONFIG[1]
          const EstadoIcon = estadoConfig.icon

          return (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{formatTicketNumber(ticket)}</h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span
                      className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${estadoConfig.color}`}
                    >
                      <EstadoIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {estadoConfig.label}
                    </span>
                    <span className="text-gray-600 text-xs sm:text-sm">Creado: {formatDate(ticket.creado_en)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(ticket)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Gestionar técnico
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Información del Ticket</h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Título:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{ticket.titulo}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Descripción:</span>
                      <p className="text-gray-800 text-sm sm:text-base">{ticket.descripcion}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Equipo:</span>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{ticket.equipo}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Técnico Asignado</h3>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={getTechnicianAvatar(ticket.tecnico) || "/placeholder.svg"}
                      alt={getTechnicianName(ticket.tecnico)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {getTechnicianName(ticket.tecnico)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Técnico</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                        <span className="text-xs text-green-600">Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <DialogSlide open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Reasignar técnico</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar técnico por nombre o correo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              {availableTechnicians.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Técnicos Disponibles</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {availableTechnicians.map((tech) => {
                      const workload = tech.porcentaje_ocupacion || 0
                      const fullName = `${tech.first_name} ${tech.last_name}`.trim()
                      const techUser = getUserByDocument(tech.document)
                      const techAvatar = techUser?.profile_picture || "/default_avatar.svg"
                      const isSelected = selectedTechnicianId === tech.document

                      return (
                        <button
                          key={tech.document}
                          onClick={() => setSelectedTechnicianId(tech.document)}
                          className={`w-full p-3 sm:p-4 border rounded-lg transition-all ${
                            isSelected
                              ? "border-teal-500 bg-teal-50"
                              : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <img
                                src={techAvatar || "/placeholder.svg"}
                                alt={fullName}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="text-left min-w-0 flex-1">
                                <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{fullName}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Técnico</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                              <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getWorkloadColor(workload)} transition-all`}
                                  style={{ width: `${workload}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${getWorkloadTextColor(workload)} w-8 sm:w-10 text-right`}
                              >
                                {Math.round(workload)}%
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {unavailableTechnicians.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Técnicos No Disponibles</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {unavailableTechnicians.map((tech) => {
                      const fullName = `${tech.first_name} ${tech.last_name}`.trim()
                      const techUser = getUserByDocument(tech.document)
                      const techAvatar = techUser?.profile_picture || "/default_avatar.svg"
                      const workload = tech.porcentaje_ocupacion || 0

                      return (
                        <div
                          key={tech.document}
                          className="p-3 sm:p-4 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed"
                          title="Técnico con sobreocupación (100%), no disponible para asignación"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <img
                                src={techAvatar || "/placeholder.svg"}
                                alt={fullName}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover grayscale flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-500 text-sm sm:text-base truncate">{fullName}</p>
                                <p className="text-xs sm:text-sm text-gray-400">Técnico - Sobreocupado</p>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-red-600 flex-shrink-0">
                              {Math.round(workload)}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {inactiveTechnicians.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Técnicos Inactivos</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {inactiveTechnicians.map((tech) => {
                      const fullName = `${tech.first_name} ${tech.last_name}`.trim()
                      const techUser = getUserByDocument(tech.document)
                      const techAvatar = techUser?.profile_picture || "/default_avatar.svg"

                      return (
                        <div
                          key={tech.document}
                          className="p-3 sm:p-4 bg-gray-100 rounded-lg opacity-50 cursor-not-allowed"
                          title="Técnico inactivo, no disponible para asignación"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <img
                                src={techAvatar || "/placeholder.svg"}
                                alt={fullName}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover grayscale flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-500 text-sm sm:text-base truncate">{fullName}</p>
                                <p className="text-xs sm:text-sm text-gray-400">Técnico - Inactivo</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-200 bg-white">
            {errorMessage && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleChangeTechnician}
                disabled={!selectedTechnicianId || isChangingTechnician}
                className="flex-1 bg-teal-600 text-white py-2.5 sm:py-3 rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
              >
                {isChangingTechnician ? "Cambiando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isChangingTechnician}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
              {selectedTechnicianId ? "Técnico seleccionado" : "Debes elegir un técnico"}
            </p>
          </div>
        </div>
      </DialogSlide>
    </div>
  )
}
