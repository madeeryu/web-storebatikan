'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
  initialIndex?: number
}

export function ProductGallery({ images, productName, initialIndex = 0 }: ProductGalleryProps) {
  const list = images.length ? images : ['/placeholder-product.jpg']
  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 && initialIndex < list.length ? initialIndex : 0
  )

  return (
    <div className="w-full max-w-[420px] mx-auto md:mx-0 md:sticky md:top-24 space-y-3">
      {/* Gambar Utama */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={list[activeIndex]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
          priority
        />
      </div>

      {/* Thumbnail — scroll horizontal jika banyak */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === i
                  ? 'border-[var(--color-maroon)]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
