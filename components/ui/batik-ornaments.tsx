// ─── Batik AN — Ornamental SVG Components ───────────────────────────────────
// Javanese-inspired decorative elements for section dividers, borders, etc.

// ─── Section Divider (horizontal) ───────────────────────────────────────────

export function BatikDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-6 ${className}`}>
      <svg
        width="400"
        height="32"
        viewBox="0 0 400 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md opacity-60"
      >
        {/* Left line */}
        <line x1="0" y1="16" x2="150" y2="16" stroke="#C9A84C" strokeWidth="1" />
        {/* Center motif: parang/diagonal inspired */}
        <g transform="translate(158, 4)">
          <rect x="16" y="0" width="12" height="12" rx="1" transform="rotate(45 16 6)" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
          <circle cx="16" cy="6" r="2" fill="#C9A84C" />

          {/* small diamonds */}
          <rect x="0" y="5" width="6" height="6" rx="0.5" transform="rotate(45 0 8)" fill="#C9A84C" opacity="0.5" />
          <rect x="26" y="5" width="6" height="6" rx="0.5" transform="rotate(45 32 8)" fill="#C9A84C" opacity="0.5" />

          {/* dot accents */}
          <circle cx="8" cy="20" r="1.5" fill="#C9A84C" opacity="0.4" />
          <circle cx="24" cy="20" r="1.5" fill="#C9A84C" opacity="0.4" />
          <circle cx="16" cy="24" r="2" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
        </g>
        {/* Right line */}
        <line x1="250" y1="16" x2="400" y2="16" stroke="#C9A84C" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── Section Heading ornament ────────────────────────────────────────────────

export function BatikHeadingOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Left */}
      <svg width="60" height="14" viewBox="0 0 60 14" fill="none">
        <line x1="0" y1="7" x2="44" y2="7" stroke="#C9A84C" strokeWidth="1" />
        <polygon points="44,3 54,7 44,11" fill="#C9A84C" opacity="0.7" />
      </svg>
      {/* Center diamond */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="2" width="10" height="10" transform="rotate(45 7 7)" fill="#C9A84C" />
        <rect x="4" y="4" width="6" height="6" transform="rotate(45 7 7)" fill="#F5EFE0" />
      </svg>
      {/* Right */}
      <svg width="60" height="14" viewBox="0 0 60 14" fill="none">
        <polygon points="16,3 6,7 16,11" fill="#C9A84C" opacity="0.7" />
        <line x1="16" y1="7" x2="60" y2="7" stroke="#C9A84C" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── Corner ornament (for cards) ─────────────────────────────────────────────

export function BatikCornerOrnament({ 
  position = "top-left",
  size = 40,
  color = "#C9A84C" 
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: number
  color?: string 
}) {
  const rotateMap = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      style={{ transform: `rotate(${rotateMap[position]}deg)` }}
    >
      <path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20 Z" fill={color} opacity="0.6" />
      <path d="M0 0 L10 0 L10 2 L2 2 L2 10 L0 10 Z" fill={color} />
      <circle cx="6" cy="6" r="2" fill={color} opacity="0.8" />
    </svg>
  )
}

// ─── Background pattern (subtle, for sections) ───────────────────────────────

export function BatikPatternBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="batik-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Kawung-inspired motif */}
            <circle cx="30" cy="30" r="10" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.25" />
            <circle cx="30" cy="30" r="6" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.2" />
            <circle cx="30" cy="30" r="2" fill="#C9A84C" opacity="0.15" />

            <circle cx="0" cy="0" r="8" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.15" />
            <circle cx="60" cy="0" r="8" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.15" />
            <circle cx="0" cy="60" r="8" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.15" />
            <circle cx="60" cy="60" r="8" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.15" />

            {/* Small diamond accents */}
            <rect x="28" y="8" width="4" height="4" transform="rotate(45 30 10)" fill="#C9A84C" opacity="0.1" />
            <rect x="28" y="48" width="4" height="4" transform="rotate(45 30 50)" fill="#C9A84C" opacity="0.1" />
            <rect x="8" y="28" width="4" height="4" transform="rotate(45 10 30)" fill="#C9A84C" opacity="0.1" />
            <rect x="48" y="28" width="4" height="4" transform="rotate(45 50 30)" fill="#C9A84C" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#batik-pattern)" />
      </svg>
    </div>
  )
}

// ─── Gold border featured card wrapper ───────────────────────────────────────

export function FeaturedCardBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 z-10">
        <BatikCornerOrnament position="top-left" size={24} />
      </div>
      <div className="absolute top-0 right-0 z-10">
        <BatikCornerOrnament position="top-right" size={24} />
      </div>
      <div className="absolute bottom-0 left-0 z-10">
        <BatikCornerOrnament position="bottom-left" size={24} />
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <BatikCornerOrnament position="bottom-right" size={24} />
      </div>

      {/* Gold border */}
      <div className="border-2 border-[#C9A84C]/50 rounded-md overflow-hidden">
        {children}
      </div>
    </div>
  )
}

// ─── Fade-in on scroll hook (Intersection Observer, no library) ──────────────

// Usage: const ref = useFadeInOnScroll(); <div ref={ref} className="...">

import { useEffect, useRef, RefObject } from "react"

export function useFadeInOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial state
    element.style.opacity = "0"
    element.style.transform = "translateY(24px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
        ...options,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return ref
}

// ─── Staggered fade-in for lists ─────────────────────────────────────────────

export function useFadeInChildren(parentSelector: string, delay = 80) {
  useEffect(() => {
    const children = document.querySelectorAll<HTMLElement>(parentSelector)
    if (!children.length) return

    children.forEach((el, i) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = `opacity 0.5s ease ${i * delay}ms, transform 0.5s ease ${i * delay}ms`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )

    children.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [parentSelector, delay])
}
