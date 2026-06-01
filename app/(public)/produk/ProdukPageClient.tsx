'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getProducts, getActivePromos, getFinalPrice, getCategories } from '@/lib/firestore'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductFilter } from '@/components/product/ProductFilter'
import type { Product, Promo } from '@/types'
import { where, limit } from 'firebase/firestore'
import { ShoppingBag } from 'lucide-react'

const PER_PAGE = 12

export function ProdukPageClient() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const kategoriSlugs = params.get('kategori')?.split(',').filter(Boolean) ?? []
  const minPrice = Number(params.get('min')) || 0
  const maxPrice = Number(params.get('max')) || 9_999_999
  const sort = params.get('sort') || 'terbaru'
  const page = Number(params.get('halaman')) || 1
  const q = (params.get('q') || '').trim().toLowerCase()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [activePromos, allCats] = await Promise.all([
        getActivePromos(),
        getCategories(),
      ])
      setPromos(activePromos)

      // Ambil SEMUA produk aktif, lalu filter & sort di client.
      // (hindari composite index Firestore yang bikin filter tidak konsisten)
      let all = await getProducts([where('is_active', '==', true), limit(300)] as any)

      // Filter kategori (1 atau lebih slug)
      if (kategoriSlugs.length > 0) {
        const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]))
        const catIds = kategoriSlugs.map(s => catMap[s]).filter(Boolean)
        all = all.filter(p => catIds.includes(p.category_id))
      }

      // Filter pencarian (cocokkan nama / kategori)
      if (q) {
        all = all.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            (p.category_name || '').toLowerCase().includes(q)
        )
      }

      // Filter harga (pakai harga final setelah diskon/promo)
      all = all.filter(p => {
        const { finalPrice } = getFinalPrice(p, activePromos)
        return finalPrice >= minPrice && finalPrice <= maxPrice
      })

      // Sort
      if (sort === 'harga-asc') {
        all = all.sort((a, b) => getFinalPrice(a, activePromos).finalPrice - getFinalPrice(b, activePromos).finalPrice)
      } else if (sort === 'harga-desc') {
        all = all.sort((a, b) => getFinalPrice(b, activePromos).finalPrice - getFinalPrice(a, activePromos).finalPrice)
      } else if (sort === 'diskon') {
        all = all.sort((a, b) => getFinalPrice(b, activePromos).discountPercent - getFinalPrice(a, activePromos).discountPercent)
      } else {
        // terbaru: berdasarkan created_at desc
        all = all.sort((a, b) => {
          const ta = a.created_at?.toMillis?.() ?? 0
          const tb = b.created_at?.toMillis?.() ?? 0
          return tb - ta
        })
      }

      setTotalCount(all.length)
      setProducts(all.slice((page - 1) * PER_PAGE, page * PER_PAGE))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [params.toString()])

  useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  const getPromoDiscount = (product: Product) =>
    promos.length ? getFinalPrice(product, promos).discountPercent : product.discount_percent

  return (
    <div>
      {/* Filter bar — full width */}
      <ProductFilter />

      <div className="mt-4">
        {/* Count */}
        {!loading && totalCount > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Menampilkan {totalCount} produk
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
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
          <div className="flex flex-col items-center justify-center py-24 text-center w-full">
            <ShoppingBag size={64} className="mb-4" style={{ color: 'rgba(201,168,76,0.4)' }} />
            <p className="font-playfair text-xl mb-2" style={{ color: '#8B1A1A' }}>
              Koleksi segera hadir
            </p>
            <p className="text-gray-400 text-sm mb-6">Tidak ada produk yang sesuai filter Anda</p>
            <Link
              href="/produk"
              className="px-6 py-2 text-white rounded text-sm transition-colors"
              style={{ backgroundColor: '#C5973A' }}
            >
              Lihat Semua
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  promoDiscount={getPromoDiscount(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10 flex-wrap">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  const p = new URLSearchParams(params.toString())
                  p.set('halaman', String(pageNum))
                  return (
                    <Link
                      key={pageNum}
                      href={`?${p.toString()}`}
                      scroll={false}
                      className="w-9 h-9 flex items-center justify-center rounded text-sm border transition-colors"
                      style={
                        page === pageNum
                          ? { backgroundColor: '#8B1A1A', color: 'white', borderColor: '#8B1A1A' }
                          : { borderColor: '#d1d5db', color: '#6b7280' }
                      }
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
