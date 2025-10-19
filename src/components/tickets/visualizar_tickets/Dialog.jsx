"use client"

import { useEffect } from "react"

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg mx-4">{children}</div>
    </div>
  )
}

export function DialogContent({ children, className = "" }) {
  return <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
}

export function DialogHeader({ children, className = "" }) {
  return <div className={`p-6 pb-4 border-b ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
}
