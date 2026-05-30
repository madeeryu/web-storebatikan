'use client'

import { useEffect, useState } from 'react'
import { getApprovedReviews, addReview } from '@/lib/firestore'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Review } from '@/types'

interface ReviewSectionProps {
  productId: string
  productName: string
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

function ClickableStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            size={24}
            className={i <= (hovered || value)
              ? 'fill-[var(--color-gold)] text-[var(--color-gold)]'
              : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' })

  useEffect(() => {
    getApprovedReviews(productId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [productId])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Nama wajib diisi')
    if (!form.rating) return toast.error('Pilih rating bintang')
    if (!form.comment.trim()) return toast.error('Komentar wajib diisi')

    setSubmitting(true)
    try {
      await addReview({
        product_id: productId,
        product_name: productName,
        reviewer_name: form.name.trim(),
        rating: form.rating,
        comment: form.comment.trim(),
        is_approved: false,
        created_at: null,
      })
      setForm({ name: '', rating: 0, comment: '' })
      toast.success('Terima kasih! Review akan tampil setelah disetujui admin 🙏')
    } catch {
      toast.error('Gagal mengirim review. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 border-t border-[var(--color-gold)]/20 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-[var(--color-maroon)]">Ulasan Produk</h2>
        {avgRating && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-[var(--color-charcoal)]">{avgRating}</span>
            <div>
              <StarRating rating={Math.round(Number(avgRating))} />
              <p className="text-xs text-gray-400">{reviews.length} ulasan</p>
            </div>
          </div>
        )}
      </div>

      {/* List reviews */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">Belum ada ulasan. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {reviews.map(review => (
            <div key={review.id} className="bg-[var(--color-ivory)] rounded-lg border border-[var(--color-gold)]/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-[var(--color-charcoal)]">{review.reviewer_name}</p>
                  <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form tambah review */}
      <div className="bg-[var(--color-ivory)] rounded-lg border border-[var(--color-gold)]/30 p-6">
        <h3 className="font-display font-semibold text-[var(--color-maroon)] mb-4">Tulis Ulasan</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Masukkan nama Anda"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-maroon)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
            <ClickableStars value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ulasan *</label>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Ceritakan pengalaman Anda dengan produk ini..."
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-maroon)] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[var(--color-maroon)] text-white rounded text-sm font-medium hover:bg-[var(--color-maroon)]/90 disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </section>
  )
}
