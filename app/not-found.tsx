// ─── app/not-found.tsx ──────────────────────────────────────────────────────
// Next.js 14 App Router — custom 404 page

import { NotFoundPage } from "@/components/ui/error-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — Batik AN",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5EFE0]">
      <NotFoundPage />
    </main>
  )
}
