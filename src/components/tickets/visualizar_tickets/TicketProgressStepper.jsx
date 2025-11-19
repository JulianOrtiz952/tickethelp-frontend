import { CircleAlert, Search, Wrench, FlaskConical, CircleCheck, Check } from 'lucide-react'

const STATES = [
  { id: 1, label: "Abierto", icon: CircleAlert },
  { id: 2, label: "Diagnóstico", icon: Search },
  { id: 3, label: "En reparación", icon: Wrench },
  { id: 4, label: "En pruebas", icon: FlaskConical },
  { id: 5, label: "Finalizado", icon: CircleCheck },
]

export function TicketProgressStepper({ currentStateId }) {
  return (
    <div className="relative px-4">
      {/* Horizontal connecting line */}
      <div className="absolute top-7 left-0 right-0 h-1 bg-gray-300" style={{ marginLeft: '3.5rem', marginRight: '3.5rem' }} />
      
      <div className="flex items-start justify-between relative">
        {STATES.map((state, index) => {
          const StateIcon = state.icon
          const isCompleted = state.id < currentStateId
          const isCurrent = state.id === currentStateId
          
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
                    state.id < currentStateId ? "bg-green-500" : "bg-gray-300"
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
  )
}
