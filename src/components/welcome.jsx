'use client'

import { InicioHero } from "./welcome/inicio-hero"
import { InicioValues } from "./welcome/inicio-values"
import { InicioCTA } from "./welcome/inicio-cta"

export default function Inicio() {
  return (
    <div className="w-full">
      <InicioHero />
      <InicioValues />
      <InicioCTA />
    </div>
  )
}
