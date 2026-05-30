'use client'

import { useEffect, useState } from 'react'
import { getActivePromos, getProducts, getFinalPrice } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product, Promo } from '@/types'
import { where, orderBy, limit } from 'firebase/firestore'

export function PromoSection() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [products, setProducts] = useState<{ product: Product; discount: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const activePromos = await getActivePromos()
        if (!activePromos.length) {
          setLoading(false)
          return
        }
        setPromos(activePromos)

        // Ambil semua produk aktif lalu filter yang kena promo
        const allProducts = await getProducts([
          where('is_active', '==', true),
          orderBy('created_at', 'desc'),
          limit(50),
        ])

        const promoProducts: { product: Product; discount: number }[] = []
        for (const p of allProducts) {
          const { discountPercent } = getFinalPrice(p, activePromos)
          if (discountPercent > 0) {
            promoProducts.push({ product: p, discount: discountPercent })
          }
        }

        // Ambil maks 4
        setProducts(promoProducts.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !products.length) return null

  return (
    <section className="py-14 px-4 bg-gradient-to-r from-[var(--color-maroon)] to-[var(--color-brown)] relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="font-accent text-[var(--color-gold)] text-sm tracking-widest uppercase mb-1">
            Terbatas • Spesial
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Penawaran Spesial
          </h2>
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[var(--color-gold)]" />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="#C9A84C"/>
            </svg>
            <div className="h-px w-16 bg-[var(--color-gold)]" />
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(({ product, discount }) => (
            <ProductCard key={product.id} product={product} promoDiscount={discount} />
          ))}
        </div>
      </div>
    </section>
  )
}
