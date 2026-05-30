'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getProducts, getActivePromos, getFinalPrice } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product, Promo } from '@/types'
import { where, orderBy, limit } from 'firebase/firestore'
import { ShoppingBag } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-asc', label: 'Harga Terendah' },
  { value: 'harga-desc', label: 'Harga Tertinggi' },
]

interface Props {
  categoryId: string
  categoryName: string
}

export function KategoriPageClient({ categoryId, categoryName }: Props) {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(params.get('sort') || 'terbaru')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const activePromos = await getActivePromos()
      setPromos(activePromos)

      const constraints: any[] = [
        where('is_active', '==', true),
        where('category_id', '==', categoryId),
      ]

      if (sort === 'harga-asc') {
        constraints.push(orderBy('price', 'asc'))
      } else if (sort === 'harga-desc') {
        constraints.push(orderBy('price', 'desc'))
      } else {
        constraints.push(orderBy('created_at', 'desc'))
      }
      constraints.push(limit(100))

      const all = await getProducts(constraints)
      setProducts(all)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [categoryId, sort])

  useEffect(() => { load() }, [load])

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{!loading && `${products.length} produk`}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Urutkan:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[var(--color-maroon)] bg-white"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={64} className="text-[var(--color-gold)]/40 mb-4" />
          <p className="font-display text-xl text-gray-400 mb-2">Koleksi {categoryName} segera hadir</p>
          <Link
            href="/produk"
            className="mt-4 px-6 py-2 bg-[var(--color-maroon)] text-white rounded text-sm hover:bg-[var(--color-maroon)]/90 transition-colors"
          >
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              promoDiscount={getFinalPrice(product, promos).discountPercent}
            />
          ))}
        </div>
      )}
    </div>
  )
}
