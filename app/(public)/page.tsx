export const revalidate = 60

import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import { HeroBanner } from '@/components/home/HeroBanner'
import { PromoSection } from '@/components/home/PromoSection'
import { NewArrival } from '@/components/home/NewArrival'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TestimoniSection } from '@/components/home/TestimoniSection'

export const metadata: Metadata = {
  title: 'Batik AN — Warisan Budaya Modern',
  description:
    'Toko batik online terpercaya. Koleksi batik tulis, batik cap, dan batik modern pilihan dengan kualitas premium dari perajin terbaik nusantara.',
}

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Hero Banner Slider */}
        <HeroBanner />

        {/* Promo Section — tampil otomatis jika ada promo aktif */}
        <PromoSection />

        {/* New Arrival */}
        <NewArrival />

        {/* Kategori Grid */}
        <CategoryGrid />

        {/* Produk Unggulan */}
        <FeaturedProducts />

        {/* Testimoni / Review */}
        <TestimoniSection />
      </main>
      <Footer />
    </>
  )
}
