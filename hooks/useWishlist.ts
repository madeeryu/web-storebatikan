'use client'

import { useState, useEffect, useCallback } from 'react'

const WISHLIST_KEY = 'batikan-wishlist'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) setWishlist(JSON.parse(stored))
    } catch {
      setWishlist([])
    }
  }, [])

  const save = useCallback((ids: string[]) => {
    setWishlist(ids)
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
    } catch {}
  }, [])

  const toggle = useCallback((productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  )

  const remove = useCallback((productId: string) => {
    setWishlist(prev => {
      const next = prev.filter(id => id !== productId)
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  return { wishlist, toggle, isWishlisted, remove, mounted }
}
