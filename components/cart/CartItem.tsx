'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatRupiah, calculateDiscountedPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()

  const unitPrice = calculateDiscountedPrice(item.price, item.discount_percent)
  const subtotal = unitPrice * item.quantity

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-gold)]/20 last:border-0">
      {/* Image */}
      <div className="relative w-20 h-24 shrink-0 rounded overflow-hidden bg-gray-100">
        {item.image ? (
          <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-sm text-[var(--color-charcoal)] line-clamp-2 mb-1">
          {item.product_name}
        </h3>

        {(item.selected_color || item.selected_size) && (
          <p className="text-xs text-gray-500 mb-2">
            {[item.selected_color, item.selected_size].filter(Boolean).join(' • ')}
          </p>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--color-maroon)]">{formatRupiah(unitPrice)}</span>
          {item.discount_percent > 0 && (
            <span className="text-xs text-gray-400 line-through">{formatRupiah(item.price)}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Qty control */}
          <div className="flex items-center">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.selected_color, item.selected_size)}
              className="w-7 h-7 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 h-7 border-t border-b border-gray-300 flex items-center justify-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.selected_color, item.selected_size)}
              className="w-7 h-7 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal & Delete */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--color-charcoal)]">{formatRupiah(subtotal)}</span>
            <button
              onClick={() => removeItem(item.product_id, item.selected_color, item.selected_size)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
