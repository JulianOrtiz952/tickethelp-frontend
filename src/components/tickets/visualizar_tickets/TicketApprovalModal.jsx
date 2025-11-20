"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { X, XCircle, CircleCheck } from "lucide-react"
import { TicketProgressStepper } from "../visualizar_tickets/TicketProgressStepper"

export function TicketApprovalModal({ open, onOpenChange, ticket, pendingApproval, onApprove, onReject }) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!ticket) return null

  const requestedState = 5

  const handleRejectClick = () => {
    setShowRejectModal(true)
  }

  const handleSubmitRejection = async () => {
    if (!rejectionReason.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onReject(rejectionReason)
      setShowRejectModal(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Error al rechazar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelRejection = () => {
    setShowRejectModal(false)
    setRejectionReason("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-8">Progreso del Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <TicketProgressStepper currentStateId={requestedState} />

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700">
                El ticket se encuentra actualmente en la fase de{" "}
                <span className="font-semibold text-blue-600">En pruebas</span>. Selecciona si deseas aprobar la
                finalización o rechazar las pruebas para retornar a la fase anterior.
              </p>
            </div>

            {showRejectModal ? (
              <div className="bg-white border-2 border-red-300 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Motivo del rechazo</h3>
                <p className="text-sm text-gray-600">Por favor, explica el motivo del rechazo:</p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Escribe aquí el motivo del rechazo..."
                  className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent resize-none text-sm"
                  disabled={isSubmitting}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelRejection}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitRejection}
                    disabled={!rejectionReason.trim() || isSubmitting}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar rechazo"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={onApprove}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <CircleCheck className="w-5 h-5" />
                    Aprobar pruebas
                  </button>
                  <button
                    onClick={handleRejectClick}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Rechazar pruebas
                  </button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 italic">
                  Estas acciones impactan la notificación final del cliente.
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
