import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '@/components/layout/Footer'
import { ProdukPageClient } from './ProdukPageClient'

export const metadata: Metadata = {
  title: 'Semua Koleksi — Batik AN',
  description: 'Jelajahi seluruh koleksi batik pilihan Batik AN. Filter berdasarkan kategori, harga, dan temukan batik impian Anda.',
}

export const revalidate = 60

export default function ProdukPage() {
  return (
    <>
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 pt-8">
          {/* Heading */}
          <div className="mb-8">
            <p className="font-cormorant italic text-sm tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>
              Batik AN
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold" style={{ color: '#8B1A1A' }}>
              Semua Koleksi
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px w-16" style={{ backgroundColor: '#C9A84C' }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#C9A84C' }} />
              <div className="h-px w-16" style={{ backgroundColor: '#C9A84C' }} />
            </div>
          </div>

          <Suspense fallback={
            <div className="h-96 flex items-center justify-center text-gray-400">
              Memuat koleksi...
            </div>
          }>
            <ProdukPageClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
