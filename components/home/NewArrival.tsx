'use client'

import { useEffect, useState } from 'react'
import { getNewArrivals } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export function NewArrival() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewArrivals(8)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-14 px-4 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="font-accent text-[var(--color-gold)] text-sm tracking-widest uppercase mb-1">
            Terkini dari kami
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-maroon)] mb-3">
            Koleksi Terbaru
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[var(--color-gold)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
            <div className="h-px w-16 bg-[var(--color-gold)]" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-display text-xl">Koleksi segera hadir</p>
          </div>
        )}
      </div>
    </section>
  )
}
