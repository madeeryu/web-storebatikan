'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { getCategories } from '@/lib/firestore'
import type { Category } from '@/types'

export default function KategoriPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Page Header */}
      <div
        className="py-12 px-4 text-center border-b"
        style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}
      >
        <p
          className="font-inter text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: '#C5973A' }}
        >
          Koleksi Batik AN
        </p>
        <h1
          className="font-playfair text-4xl font-bold mb-3"
          style={{ color: '#1A1A1A' }}
        >
          Semua Kategori
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#C5973A' }} />
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded overflow-hidden border" style={{ borderColor: '#E5E5E5' }}>
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2" style={{ color: '#C5973A' }}>✦</p>
            <p className="font-playfair text-xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Belum ada kategori
            </p>
            <p className="text-sm mb-6" style={{ color: '#888888' }}>
              Kategori akan segera hadir.
            </p>
            <Link
              href="/produk"
              className="inline-block px-6 py-2.5 text-sm font-semibold text-white rounded"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="category-card group block"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(197,151,58,0.1), rgba(139,26,26,0.1))' }}
                    >
                      <span className="font-playfair text-3xl font-bold" style={{ color: '#C5973A', opacity: 0.4 }}>
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3" style={{ backgroundColor: '#FAFAFA' }}>
                  <h2
                    className="font-inter text-sm font-semibold text-center transition-colors duration-200 group-hover:text-[#C5973A]"
                    style={{ color: '#1A1A1A' }}
                  >
                    {cat.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
