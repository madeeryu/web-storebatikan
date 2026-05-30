'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { useWishlist } from '@/hooks/useWishlist'
import { getProductsByIds } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default function WishlistPage() {
  const { wishlist, mounted } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mounted) return
    if (wishlist.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    getProductsByIds(wishlist)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [wishlist, mounted])

  if (!mounted || loading) {
    return (
      <>
        <main className="min-h-screen pt-8" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
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
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 pt-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/produk"
              className="text-sm flex items-center gap-1 mb-3 hover:underline"
              style={{ color: '#6B3F2A' }}
            >
              <ArrowLeft size={14} /> Kembali Belanja
            </Link>
            <div className="flex items-center gap-3">
              <Heart size={28} style={{ fill: '#8B1A1A', color: '#8B1A1A' }} />
              <h1 className="font-playfair text-3xl font-bold" style={{ color: '#8B1A1A' }}>
                Wishlist
              </h1>
            </div>
            <div className="h-px w-24 mt-2" style={{ backgroundColor: '#C9A84C' }} />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Heart size={80} className="mb-6" style={{ color: 'rgba(201,168,76,0.3)' }} />
              <h2 className="font-playfair text-xl font-semibold text-gray-400 mb-2">
                Belum ada produk favorit
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Klik ikon ♡ pada produk untuk menambahkan ke wishlist
              </p>
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded font-semibold transition-colors"
                style={{ backgroundColor: '#C5973A' }}
              >
                Jelajahi Produk
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{products.length} produk favorit</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
