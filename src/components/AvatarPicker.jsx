"use client"

import { useState, useEffect } from "react"
import Card from "./Card"

const AVATAR_SEEDS = [
    "Emery",
    "Sophia",
    "Riley",
    "Nolan",
    "Brian",
    "Jocelyn",
    "Andrea",
    "George",
]

export default function AvatarPicker({ isOpen, onClose, onSelectAvatar, currentSeed }) {
  const [selectedSeed, setSelectedSeed] = useState(currentSeed || "Liam")
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatingSeed, setAnimatingSeed] = useState(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSelectAvatar = (seed) => {
    setSelectedSeed(seed)
    setAnimatingSeed(seed)
    setIsAnimating(true)

    setTimeout(() => {
      onSelectAvatar(seed)
      setIsAnimating(false)
      setAnimatingSeed(null)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-3xl w-full">
        <div className="relative">
          <Card title="Selecciona tu avatar">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="text-sm text-gray-600 mb-6">
              Elige un avatar personalizado para identificarte dentro de la empresa
            </p>

            <div className="relative">
              <div className="grid grid-cols-4 gap-4">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => handleSelectAvatar(seed)}
                    disabled={isAnimating}
                    className={`relative group transition-all duration-300 ${
                      selectedSeed === seed
                        ? "ring-4 ring-teal-600 rounded-full"
                        : "hover:scale-110 rounded-full"
                    } ${
                      isAnimating && animatingSeed === seed
                        ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] scale-150"
                        : ""
                    }`}
                    title={seed}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`}
                      alt={`Avatar ${seed}`}
                      className="w-full h-full rounded-full bg-gray-100"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={isAnimating}
                className="flex-1 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 
                           rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
