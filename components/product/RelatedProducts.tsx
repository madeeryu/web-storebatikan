'use client'

import { useEffect, useState } from 'react'
import { getProductsByCategory } from '@/lib/firestore'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface Props {
  categoryId: string
  currentProductId: string
}

// Acak urutan array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function RelatedProducts({ categoryId, currentProductId }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }
    getProductsByCategory(categoryId)
      .then((all) => {
        const others = all.filter((p) => p.id !== currentProductId)
        // acak lalu ambil maksimal 5 produk → beda-beda tiap kunjungan
        setProducts(shuffle(others).slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [categoryId, currentProductId])

  if (loading) {
    return (
      <div className="mt-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="mt-16">
      {/* Heading */}
      <div className="text-center mb-8">
        <p className="font-inter text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#C5973A' }}>
          Untukmu
        </p>
        <h2 className="font-playfair text-2xl md:text-3xl font-bold" style={{ color: '#8B1A1A' }}>
          Rekomendasi Produk
        </h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-12" style={{ backgroundColor: '#C5973A' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#C5973A' }} />
          <div className="h-px w-12" style={{ backgroundColor: '#C5973A' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
