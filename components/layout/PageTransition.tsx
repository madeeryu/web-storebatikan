'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset animasi setiap ganti halaman
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'

    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    })

    return () => cancelAnimationFrame(t)
  }, [pathname])

  return (
    <div
      ref={ref}
      style={{ opacity: 0, transform: 'translateY(10px)' }}
    >
      {children}
    </div>
  )
}
