'use client'

export function InicioHero() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div
        className="max-w-6xl mx-auto bg-white rounded-3xl border border-border p-10 md:p-14 shadow-md 
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Izquierda */}
          <div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-balance"
              style={{ color: '#1F5E89' }}
            >
              ¡Bienvenido a<br />Ticket-Help!
            </h1>

            <p className="text-foreground text-base md:text-lg leading-relaxed mb-8 opacity-90 max-w-xl">
              Tu plataforma integral para una gestión de tickets eficiente y un
              soporte al cliente excepcional. Optimiza la comunicación, acelera
              las soluciones y transforma la experiencia de tu equipo.
            </p>

          </div>

          {/* Derecha */}
          <div className="w-full flex justify-center">
            <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-4 max-w-md w-full">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg"
                alt="Vista previa de Ticket-Help"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
