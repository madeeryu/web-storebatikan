'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useWishlist } from '@/hooks/useWishlist'
import { formatRupiah, calculateDiscountedPrice, isNewProduct } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  promoDiscount?: number // diskon tambahan dari promo
}

export function ProductCard({ product, promoDiscount = 0 }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlist()
  const [hovered, setHovered] = useState(false)

  const discountPercent = Math.max(product.discount_percent || 0, promoDiscount)
  const finalPrice = calculateDiscountedPrice(product.price, discountPercent)
  const isNew = isNewProduct(product.created_at)
  const wishlisted = isWishlisted(product.id)

  const mainImage = product.images?.[0] || '/placeholder-product.jpg'
  const hoverImage = product.images?.[1] || mainImage

  return (
    <div
      className="product-card group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          toggle(product.id)
        }}
        className="wishlist-btn absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
      >
        <Heart
          size={16}
          className={wishlisted ? 'fill-[var(--color-maroon)] text-[var(--color-maroon)]' : 'text-gray-400'}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-[var(--color-gold)] text-[var(--color-maroon)] text-xs font-bold px-2 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
        {isNew && (
          <span className="bg-[var(--color-maroon)] text-white text-xs font-semibold px-2 py-0.5 rounded">
            BARU
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/produk/${product.slug}`} className="block">
        <div className="product-img-wrap relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={hovered && hoverImage !== mainImage ? hoverImage : mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Info */}
        <div className="p-3 pt-2">
          <h3
            className="font-display text-sm font-semibold text-[var(--color-charcoal)] line-clamp-2 leading-snug mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {discountPercent > 0 ? (
              <>
                <span className="text-[var(--color-maroon)] font-bold text-sm">
                  {formatRupiah(finalPrice)}
                </span>
                <span className="text-gray-400 line-through text-xs">
                  {formatRupiah(product.price)}
                </span>
              </>
            ) : (
              <span className="text-[var(--color-charcoal)] font-bold text-sm">
                {formatRupiah(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
