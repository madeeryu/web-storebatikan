'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { subscribeBanners } from '@/lib/firestore'
import type { Banner } from '@/types'

// Swiper CSS diimport di globals.css
// import 'swiper/css'
// import 'swiper/css/pagination'
// import 'swiper/css/effect-fade'

const FALLBACK_BANNERS: Omit<Banner, 'id'>[] = [
  {
    image: '/banner-placeholder.jpg',
    title: 'Warisan Budaya Modern',
    subtitle: 'Temukan koleksi batik pilihan dengan motif-motif indah warisan leluhur',
    cta_text: 'Jelajahi Koleksi',
    cta_link: '/produk',
    order: 1,
    is_active: true,
  },
]

export function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeBanners(data => {
      setBanners(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const displayBanners = banners.length > 0 ? banners : (FALLBACK_BANNERS as Banner[])

  if (loading) {
    return (
      <div className="w-full aspect-[16/6] bg-gradient-to-r from-[var(--color-maroon)] to-[var(--color-brown)] animate-pulse" />
    )
  }

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={displayBanners.length > 1}
        className="hero-swiper w-full"
      >
        {displayBanners.map((banner, idx) => (
          <SwiperSlide key={banner.id || idx}>
            <div className="relative w-full aspect-[16/7] min-h-[300px] max-h-[600px] overflow-hidden">
              {/* Background Image */}
              {banner.image ? (
                <Image
                  src={banner.image}
                  alt={banner.title || 'Banner Batik AN'}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-maroon)] via-[#6B1B1B] to-[var(--color-brown)]" />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Ornamen dekoratif */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-end pb-12 md:pb-16 px-6 md:px-16 lg:px-24">
                <div className="max-w-2xl">
                  {banner.title && (
                    <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                      {banner.title}
                    </h1>
                  )}
                  {banner.subtitle && (
                    <p className="font-accent text-base md:text-lg text-white/90 mb-6 leading-relaxed drop-shadow">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.cta_text && banner.cta_link && (
                    <Link
                      href={banner.cta_link}
                      className="inline-block bg-[var(--color-gold)] text-[var(--color-maroon)] font-bold px-8 py-3 rounded hover:bg-white transition-colors duration-200 text-sm md:text-base shadow-lg"
                    >
                      {banner.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gold line decoration */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: #C9A84C;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 28px;
          border-radius: 5px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 16px;
        }
      `}</style>
    </section>
  )
}
