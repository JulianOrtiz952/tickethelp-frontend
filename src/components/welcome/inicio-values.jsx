'use client'

const VALUES = [
  {
    title: 'Misión',
    items: [
      'Simplificar la gestión de tickets y la asignación de tareas.',
      'Mejorar la comunicación interna y externa del equipo.',
      'Garantizar una resolución rápida y eficiente de los problemas.',
      'Ofrecer una experiencia de soporte al cliente sin interrupciones.',
    ],
  },
  {
    title: 'Visión',
    items: [
      'Ser la plataforma líder en gestión de soporte técnico y atención al cliente.',
      'Potenciar la productividad y la satisfacción de los equipos.',
      'Establecer nuevos estándares de eficiencia y calidad en el servicio.',
      'Impulsar el crecimiento empresarial a través de un soporte superior.',
    ],
  },
  {
    title: 'Objetivos',
    items: [
      'Reducir el tiempo promedio de respuesta de tickets en un 30% en 6 meses.',
      'Aumentar la satisfacción del cliente en un 20% mediante encuestas.',
      'Optimizar los flujos de trabajo internos para una mayor eficiencia.',
      'Expandir nuestras funcionalidades para cubrir todas las necesidades de soporte.',
    ],
  },
]

export function InicioValues() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {VALUES.map((section) => (
          <div
            key={section.title}
            className="p-8 bg-white border border-border rounded-3xl shadow-md 
            transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: '#1F5E89' }}
            >
              {section.title}
            </h3>

            <ul className="space-y-3 text-foreground text-sm md:text-base opacity-80">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span
                    className="font-bold mt-1 flex-shrink-0"
                    style={{ color: '#1F5E89' }}
                  >
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>
    </section>
  )
}
