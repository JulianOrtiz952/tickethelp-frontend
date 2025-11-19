"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { X, XCircle, CircleCheck } from 'lucide-react'
import { TicketProgressStepper } from "../visualizar_tickets/TicketProgressStepper"

export function TicketApprovalModal({ 
  open, 
  onOpenChange, 
  ticket, 
  pendingApproval,
  onApprove,
  onReject 
}) {
  if (!ticket) return null

  const requestedState = 5

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-8">
              Progreso del Ticket
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <TicketProgressStepper currentStateId={requestedState} />

            {/* Information box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700">
                El ticket se encuentra actualmente en la fase de{" "}
                <span className="font-semibold text-blue-600">En pruebas</span>
                . Selecciona si deseas aprobar la finalización o rechazar las pruebas para retornar a la fase
                anterior.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={onApprove}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <CircleCheck className="w-5 h-5" />
                Aprobar pruebas
              </button>
              <button 
                onClick={onReject}
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

            {/* Footer note */}
            <p className="text-center text-sm text-gray-500 italic">
              Estas acciones impactan la notificación final del cliente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
