"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { CircleAlert, Search, Wrench, FlaskConical, CircleCheck, Check, X, XCircle } from 'lucide-react'

const STATES = [
  { id: 1, label: "Abierto", icon: CircleAlert },
  { id: 2, label: "Diagnóstico", icon: Search },
  { id: 3, label: "En reparación", icon: Wrench },
  { id: 4, label: "En pruebas", icon: FlaskConical },
  { id: 5, label: "Finalizado", icon: CircleCheck },
]

export function TicketApprovalModal({ 
  open, 
  onOpenChange, 
  ticket, 
  pendingApproval,
  onApprove,
  onReject 
}) {
  if (!ticket) return null

  const currentState = ticket.estado
  const requestedState = pendingApproval?.estado_solicitado || currentState

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
            {/* Progress Stepper */}
            <div className="relative px-4">
              {/* Horizontal connecting line */}
              <div className="absolute top-7 left-0 right-0 h-1 bg-gray-300" style={{ marginLeft: '3.5rem', marginRight: '3.5rem' }} />
              
              <div className="flex items-start justify-between relative">
                {STATES.map((state, index) => {
                  const StateIcon = state.icon
                  const isCompleted = state.id < requestedState
                  const isCurrent = state.id === requestedState
                  
                  return (
                    <div key={state.id} className="flex flex-col items-center" style={{ flex: '0 0 auto', width: '20%' }}>
                      {/* State circle */}
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                        style={
                          isCompleted
                            ? { boxShadow: '0 0 0 3px #CFFFE1' }
                            : isCurrent
                            ? { boxShadow: '0 0 0 3px #DBEAFE' }
                            : {}
                        }
                      >
                        {isCompleted ? (
                          <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        ) : (
                          <StateIcon className="w-6 h-6 text-white" strokeWidth={2} />
                        )}
                      </div>

                      {/* Connecting line segment */}
                      {index < STATES.length - 1 && (
                        <div 
                          className={`absolute top-7 h-1 transition-all ${
                            state.id < requestedState ? "bg-green-500" : "bg-gray-300"
                          }`}
                          style={{
                            left: `${(index * 20) + 10}%`,
                            width: '20%',
                            zIndex: 5
                          }}
                        />
                      )}

                      {/* State label */}
                      <p
                        className={`mt-3 text-sm font-medium text-center ${
                          isCurrent ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {state.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Information box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700">
                El ticket se encuentra actualmente en la fase de{" "}
                <span className="font-semibold text-blue-600">
                  {STATES.find((s) => s.id === requestedState)?.label}
                </span>
                . Selecciona si deseas aprobar el cambio de estado o rechazarlo para retornar a la fase
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
