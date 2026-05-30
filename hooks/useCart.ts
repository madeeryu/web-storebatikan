'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color?: string, size?: string) => void
  updateQuantity: (productId: string, qty: number, color?: string, size?: string) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
}

const getItemKey = (productId: string, color?: string, size?: string) =>
  `${productId}__${color || ''}__${size || ''}`

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set(state => {
          const key = getItemKey(newItem.product_id, newItem.selected_color, newItem.selected_size)
          const existing = state.items.find(
            i => getItemKey(i.product_id, i.selected_color, i.selected_size) === key
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                getItemKey(i.product_id, i.selected_color, i.selected_size) === key
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId, color, size) => {
        const key = getItemKey(productId, color, size)
        set(state => ({
          items: state.items.filter(
            i => getItemKey(i.product_id, i.selected_color, i.selected_size) !== key
          ),
        }))
      },

      updateQuantity: (productId, qty, color, size) => {
        const key = getItemKey(productId, color, size)
        if (qty <= 0) {
          get().removeItem(productId, color, size)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            getItemKey(i.product_id, i.selected_color, i.selected_size) === key
              ? { ...i, quantity: qty }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.discount_percent > 0
            ? Math.round(item.price * (1 - item.discount_percent / 100))
            : item.price
          return sum + price * item.quantity
        }, 0)
      },

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'batikan-cart',
    }
  )
)
