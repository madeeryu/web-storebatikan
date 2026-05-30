import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCategoryBySlug } from '@/lib/firestore'
import { KategoriPageClient } from './KategoriPageClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug).catch(() => null)
  if (!cat) return { title: 'Kategori tidak ditemukan — Batik AN' }
  return {
    title: `${cat.name} — Batik AN`,
    description: `Temukan koleksi ${cat.name} terbaik di Batik AN. Batik pilihan berkualitas tinggi dengan motif indah.`,
  }
}

export const revalidate = 60

export default async function KategoriPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug).catch(() => null)
  if (!category) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Category Header Banner */}
        <div
          className="relative w-full h-48 md:h-64 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8B1A1A, #6B3F2A)' }}
        >
          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="font-cormorant italic text-sm tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>
              Kategori
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white">
              {category.name}
            </h1>
          </div>
        </div>

        {/* Garis emas */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

        <div className="max-w-6xl mx-auto px-4 pt-8">
          <Suspense fallback={
            <div className="h-64 flex items-center justify-center text-gray-400">
              Memuat produk...
            </div>
          }>
            <KategoriPageClient categoryId={category.id} categoryName={category.name} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
