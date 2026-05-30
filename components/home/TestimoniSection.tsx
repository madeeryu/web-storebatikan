'use client'

import { useEffect, useState } from 'react'
import { getLatestReviews } from '@/lib/firestore'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { Review } from '@/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

export function TestimoniSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestReviews(6)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !reviews.length) return null

  return (
    <section className="py-14 px-4 bg-[var(--color-ivory)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="font-accent text-[var(--color-gold)] text-sm tracking-widest uppercase mb-1">
            Kepercayaan pelanggan
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-maroon)] mb-3">
            Kata Mereka
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[var(--color-gold)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
            <div className="h-px w-16 bg-[var(--color-gold)]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-5">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-3 w-24" />
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5" />
                <div className="h-3 bg-gray-200 animate-pulse rounded mt-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-[var(--color-ivory)] rounded-lg border border-[var(--color-gold)]/30 p-5 hover:border-[var(--color-gold)]/60 hover:shadow-sm transition-all duration-200"
              >
                {/* Gold top accent */}
                <div className="w-8 h-0.5 bg-[var(--color-gold)] mb-3" />

                <StarRating rating={review.rating} />

                <p className="text-[var(--color-charcoal)]/80 text-sm leading-relaxed mt-3 mb-4 font-body italic">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-charcoal)]">{review.reviewer_name}</p>
                    <p className="text-xs text-gray-400">{review.product_name}</p>
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
