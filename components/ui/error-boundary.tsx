"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return <ErrorFallback onReset={this.handleReset} />
    }

    return this.props.children
  }
}

// ─── Error Fallback UI ───────────────────────────────────────────────────────

export function ErrorFallback({ onReset }: { onReset?: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-dashed border-red-200 flex items-center justify-center mb-6">
        <AlertTriangle className="w-9 h-9 text-[#8B1A1A]" />
      </div>

      {/* Decorative */}
      <div className="flex items-center gap-3 text-[#C9A84C]/50 mb-4">
        <div className="h-px w-10 bg-[#C9A84C]/30" />
        <span className="text-lg">❈</span>
        <div className="h-px w-10 bg-[#C9A84C]/30" />
      </div>

      <h2 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-2">
        Oops! Terjadi Kesalahan
      </h2>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        Maaf, ada sesuatu yang tidak berjalan dengan baik. Coba muat ulang halaman atau kembali ke beranda.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {onReset && (
          <Button
            onClick={onReset}
            className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        )}
        <Button asChild variant="outline" className="border-[#C9A84C] text-[#6B3F2A]">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  )
}

// ─── Page-level error components (for Next.js error.tsx) ────────────────────

export function PageError({ reset }: { reset?: () => void }) {
  return (
    <div className="min-h-[70vh] bg-[#F5EFE0] flex items-center justify-center">
      <ErrorFallback onReset={reset} />
    </div>
  )
}

// app/error.tsx usage:
// "use client"
// export default function Error({ reset }: { reset: () => void }) {
//   return <PageError reset={reset} />
// }

// app/not-found.tsx usage:
export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] bg-[#F5EFE0] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-playfair text-8xl font-bold text-[#8B1A1A]/20 mb-4">404</div>
      <div className="flex items-center gap-3 text-[#C9A84C] mb-4">
        <div className="h-px w-12 bg-[#C9A84C]/40" />
        <span className="text-xl">❈</span>
        <div className="h-px w-12 bg-[#C9A84C]/40" />
      </div>
      <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C] mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button asChild className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white px-8">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
