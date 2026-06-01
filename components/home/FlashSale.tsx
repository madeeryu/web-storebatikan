'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { getActiveFlashSale, getFinalPrice } from '@/lib/firestore'
import { formatRupiah } from '@/lib/utils'
import type { Product, Promo } from '@/types'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function FlashSale() {
  const [data, setData] = useState<{ promo: Promo; products: Product[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    getActiveFlashSale()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Countdown ke end_date
  useEffect(() => {
    if (!data?.promo?.end_date) return
    const end = data.promo.end_date?.toDate?.() ?? new Date(data.promo.end_date)
    const tick = () => {
      const diff = Math.max(0, end.getTime() - Date.now())
      setRemaining({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [data])

  if (loading || !data || data.products.length === 0) return null

  const { promo, products } = data

  return (
    <section className="px-4 py-8">
      <div
        className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #8B1A1A, #A87C2A)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-white">
            <Zap size={24} className="fill-white" />
            <h2 className="font-playfair text-xl md:text-2xl font-bold tracking-wide">FLASH SALE</h2>
          </div>
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs hidden sm:inline">Berakhir dalam</span>
            <div className="flex items-center gap-1">
              {[remaining.h, remaining.m, remaining.s].map((v, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span
                    className="bg-white text-[#8B1A1A] font-bold text-sm rounded px-1.5 py-1 min-w-[26px] text-center"
                  >
                    {pad(v)}
                  </span>
                  {i < 2 && <span className="text-white font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Produk — scroll horizontal */}
        <div className="bg-white/95 p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {products.map((p) => {
              const { finalPrice, discountPercent } = getFinalPrice(p, [promo])
              return (
                <Link
                  key={p.id}
                  href={`/produk/${p.slug}`}
                  className="flex-shrink-0 w-32 md:w-40 group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="160px"
                      />
                    )}
                    {discountPercent > 0 && (
                      <span
                        className="absolute top-0 right-0 text-white text-xs font-bold px-1.5 py-0.5"
                        style={{ backgroundColor: '#8B1A1A' }}
                      >
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#8B1A1A' }}>
                    {formatRupiah(finalPrice)}
                  </p>
                  {discountPercent > 0 && (
                    <p className="text-xs text-gray-400 line-through">{formatRupiah(p.price)}</p>
                  )}
                  {/* Bar "stok terbatas" estetik */}
                  <div className="mt-1.5 h-4 rounded-full bg-[#C5973A]/20 relative overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${40 + ((p.sold ?? 0) % 50)}%`, background: 'linear-gradient(90deg, #C5973A, #8B1A1A)' }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                      Stok Terbatas
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
