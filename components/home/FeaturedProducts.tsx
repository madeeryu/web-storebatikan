'use client'

import { useEffect, useState } from 'react'
import { getFeaturedProducts } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !products.length) return null

  return (
    <section className="py-14 px-4 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="font-accent text-[var(--color-gold)] text-sm tracking-widest uppercase mb-1">
            Terpilih untuk anda
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-maroon)] mb-3">
            Pilihan Unggulan
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[var(--color-gold)]" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z" fill="#C9A84C"/>
            </svg>
            <div className="h-px w-16 bg-[var(--color-gold)]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-[var(--color-gold)]/30">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              // Featured products: tambahan gold border
              <div key={product.id} className="ring-1 ring-[var(--color-gold)]/40 rounded-lg">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
