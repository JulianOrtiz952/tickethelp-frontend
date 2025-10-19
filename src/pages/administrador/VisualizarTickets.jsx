"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/tickets/visualizar_tickets/Dialog"
import { Progress } from "../../components/tickets/visualizar_tickets/Progress"
import { Input } from "../../components/tickets/visualizar_tickets/Input"
import { CircleAlert, Search, Wrench, FlaskConical, CheckCircle, Users } from "lucide-react"
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
      setTechnicians(data)
    } catch (error) {
      console.error("Error fetching technicians:", error)
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
    fetchTechnicians()
  }

  const handleChangeTechnician = async (technicianId) => {
    if (!selectedTicket) return

    try {
      await ticketService.changeTechnician(selectedTicket.id, technicianId)
      // Refrescar tickets después de cambiar técnico
      fetchTickets()
      setIsModalOpen(false)
      setSelectedTicket(null)
    } catch (error) {
      console.error("Error changing technician:", error)
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

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeTechnicians = filteredTechnicians.filter((tech) => tech.is_active)
  const inactiveTechnicians = filteredTechnicians.filter((tech) => !tech.is_active)

  const getWorkloadColor = (percentage) => {
    if (percentage <= 30) return "bg-green-500"
    if (percentage <= 60) return "bg-yellow-500"
    return "bg-orange-500"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando tickets...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visualizar Tickets</h1>
        <div className="text-sm text-gray-500">Total: {tickets.length} tickets</div>
      </div>

      <div className="space-y-6 max-w-6xl">
        {tickets.map((ticket) => {
          const estadoConfig = ESTADO_CONFIG[ticket.estado] || ESTADO_CONFIG[1]
          const EstadoIcon = estadoConfig.icon

          return (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{formatTicketNumber(ticket)}</h2>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoConfig.color}`}
                    >
                      <EstadoIcon className="w-4 h-4 mr-1" />
                      {estadoConfig.label}
                    </span>
                    <span className="text-gray-600 text-sm">Creado: {formatDate(ticket.creado_en)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(ticket)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Gestionar técnico
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Información del Ticket</h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Título:</span>
                      <p className="font-medium text-gray-800">{ticket.titulo}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Descripción:</span>
                      <p className="text-gray-800">{ticket.descripcion}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Equipo:</span>
                      <p className="font-medium text-gray-800">{ticket.equipo}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Técnico Asignado</h3>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={getTechnicianAvatar(ticket.tecnico) || "/placeholder.svg"}
                      alt={getTechnicianName(ticket.tecnico)}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />

                    <div>
                      <p className="font-medium text-gray-800">{getTechnicianName(ticket.tecnico)}</p>
                      <p className="text-sm text-gray-600">Técnico</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Reasignar técnico</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar técnico por nombre o correo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Técnicos Disponibles</h3>
              <div className="space-y-2">
                {activeTechnicians.map((tech) => {
                  const workload = tech.workload_percentage || 0
                  const techUser = getUserByDocument(tech.document || tech.id)
                  const techAvatar = techUser?.profile_picture || "/default_avatar.svg"

                  return (
                    <button
                      key={tech.id}
                      onClick={() => handleChangeTechnician(tech.document || tech.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                    >
                      <img
                        src={techAvatar || "/placeholder.svg"}
                        alt={tech.nombre}
                        className="w-10 h-10 rounded-full bg-gray-200"
                      />

                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{tech.nombre}</p>
                        <p className="text-xs text-gray-500">{tech.rol || "Técnico"}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Progress
                          value={workload}
                          className="w-24 h-2"
                          indicatorClassName={getWorkloadColor(workload)}
                        />
                        <span className="text-sm font-medium text-gray-600 w-10 text-right">{workload}%</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {inactiveTechnicians.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Técnicos Inactivos</h3>
                <div className="space-y-2">
                  {inactiveTechnicians.map((tech) => {
                    const techUser = getUserByDocument(tech.document || tech.id)
                    const techAvatar = techUser?.profile_picture || "/default_avatar.svg"

                    return (
                      <div
                        key={tech.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed"
                      >
                        <img
                          src={techAvatar || "/placeholder.svg"}
                          alt={tech.nombre}
                          className="w-10 h-10 rounded-full bg-gray-200 grayscale"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">{tech.nombre}</p>
                          <p className="text-xs text-gray-400">{tech.rol || "Técnico"} - Inactivo</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
