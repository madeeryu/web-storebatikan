'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Hanya opacity — TIDAK pakai transform agar tidak merusak position:fixed navbar
    el.style.opacity = '0'
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.3s ease'
        el.style.opacity = '1'
      })
    })
    return () => cancelAnimationFrame(t)
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
