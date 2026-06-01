'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategories } from '@/lib/firestore'
import type { Category } from '@/types'

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !categories.length) return null

  return (
    <section className="py-14 px-4 bg-[var(--color-ivory)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="font-accent text-[var(--color-gold)] text-sm tracking-widest uppercase mb-1">
            Temukan yang anda cari
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-maroon)] mb-3">
            Jelajahi Koleksi
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[var(--color-gold)]" />
            <div className="w-2 h-2 rotate-45 bg-[var(--color-gold)]" />
            <div className="h-px w-16 bg-[var(--color-gold)]" />
          </div>
        </div>

        {/* Grid gaya Shopee: lingkaran kategori, banyak kolom */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-x-2 gap-y-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-14 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-x-2 gap-y-5">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="category-circle group flex flex-col items-center gap-2"
              >
                <div className="category-circle-img relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-maroon)]/15 to-[var(--color-gold)]/15">
                      <span className="font-display text-xl font-bold" style={{ color: 'var(--color-gold)' }}>
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xs md:text-sm text-center text-[var(--color-charcoal)] group-hover:text-[var(--color-maroon)] transition-colors line-clamp-2 leading-tight">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
