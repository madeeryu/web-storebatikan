// ─── app/error.tsx ───────────────────────────────────────────────────────────
// Next.js 14 App Router global error boundary

"use client"

import { useEffect } from "react"
import { PageError } from "@/components/ui/error-boundary"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#F5EFE0]">
      <PageError reset={reset} />
    </main>
  )
}
