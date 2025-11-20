'use client'

export function InicioCTA() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div
        className="max-w-3xl mx-auto text-center bg-white p-10 md:p-14 rounded-3xl 
        border border-border shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <p className="text-foreground text-lg md:text-xl leading-relaxed mb-10 opacity-80">
          Únete a la comunidad de Ticket-Help y transforma la forma en que
          gestionas tu soporte. Descubre una solución potente, intuitiva y
          diseñada para el éxito de tu equipo.
        </p>

        <a
  href="https://github.com/JulianOrtiz952/tickethelp-frontend"
  target="_blank"
  rel="noopener noreferrer"
  className="px-12 py-4 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
  style={{ backgroundColor: '#1F5E89' }}
>
          Únete Ahora
        </a>
      </div>
    </section>
  )
}
