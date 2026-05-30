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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="h-5 bg-gray-200 animate-pulse rounded mt-2 mx-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="category-card group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-maroon)]/20 to-[var(--color-gold)]/20" />
                  )}
                </div>

                <div className="p-3 bg-[var(--color-ivory)]">
                  <h3 className="font-display font-semibold text-[var(--color-charcoal)] text-center text-sm group-hover:text-[var(--color-maroon)] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
