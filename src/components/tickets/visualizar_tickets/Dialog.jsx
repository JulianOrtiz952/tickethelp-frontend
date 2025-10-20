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

export function DialogSlide({ open, onOpenChange, children }) {
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={() => onOpenChange(false)}
        style={{ margin: 0, padding: 0 }}
      />
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[101]`}
        style={{ margin: 0 }}
      >
        {children}
      </div>
    </>
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
