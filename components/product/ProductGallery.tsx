'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const allImages = images.length > 0 ? images : ['/placeholder-product.jpg']
  const activeImage = allImages[activeIdx]

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in group"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={activeImage}
            alt={`${productName} - foto ${activeIdx + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/80 rounded-full p-1.5">
              <ZoomIn size={18} className="text-[var(--color-maroon)]" />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 transition-all duration-200 ${
                  activeIdx === idx
                    ? 'border-[var(--color-maroon)]'
                    : 'border-transparent hover:border-[var(--color-gold)]'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <div className="relative max-w-2xl max-h-[90vh] w-full aspect-[3/4]" onClick={e => e.stopPropagation()}>
            <Image
              src={activeImage}
              alt={productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Thumbnail navigation inside lightbox */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.stopPropagation(); setActiveIdx(idx) }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 ${
                    activeIdx === idx ? 'border-[var(--color-gold)]' : 'border-white/30'
                  }`}
                >
                  <Image src={img} alt="" width={48} height={48} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
