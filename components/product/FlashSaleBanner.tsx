'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { getActiveFlashSalePromo, isProductInFlashSale } from '@/lib/firestore'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/types'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

interface Props {
  product: Product
  finalPrice: number
}

export function FlashSaleBanner({ product, finalPrice }: Props) {
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    let active = true
    getActiveFlashSalePromo()
      .then((flash) => {
        if (!active || !flash || !isProductInFlashSale(product, flash)) return
        const end = flash.end_date?.toDate?.() ?? new Date(flash.end_date)
        setEndDate(end)
      })
      .catch(() => {})
    return () => { active = false }
  }, [product])

  useEffect(() => {
    if (!endDate) return
    const tick = () => {
      const diff = Math.max(0, endDate.getTime() - Date.now())
      setRemaining({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [endDate])

  if (!endDate) return null

  return (
    <div
      className="rounded-lg overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, #8B1A1A, #C5973A)' }}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Zap size={18} className="fill-white" />
          <span className="font-playfair font-bold tracking-wide text-sm sm:text-base">FLASH SALE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/80 text-[11px] hidden sm:inline">Berakhir dalam</span>
          <div className="flex items-center gap-1">
            {[remaining.h, remaining.m, remaining.s].map((v, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-black/30 font-bold text-xs rounded px-1.5 py-0.5 min-w-[24px] text-center">
                  {pad(v)}
                </span>
                {i < 2 && <span className="font-bold text-xs">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Harga flash */}
      <div className="bg-white/10 px-3 py-2 flex items-baseline gap-2">
        <span className="font-bold text-xl">{formatRupiah(finalPrice)}</span>
        <span className="text-white/70 line-through text-sm">{formatRupiah(product.price)}</span>
      </div>
    </div>
  )
}
