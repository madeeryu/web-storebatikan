'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [rendered, setRendered] = useState(false)
  const [key, setKey] = useState(pathname)

  useEffect(() => {
    setRendered(false)
    setKey(pathname)
    // Sedikit delay agar animasi reset dulu
    const t = setTimeout(() => setRendered(true), 20)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      key={key}
      style={{
        opacity: rendered ? 1 : 0,
        transform: rendered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {children}
    </div>
  )
}
