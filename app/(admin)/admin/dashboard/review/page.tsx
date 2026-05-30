'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Star, CheckCircle2, Trash2, CheckCheck } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

import AdminLayout from '@/components/layout/AdminLayout'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  getReviews, approveReview, deleteReview, approveAllPendingReviews,
} from '@/lib/firestore'
import type { Review } from '@/types'

// ─── Helper ─────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

function formatDate(raw: any): string {
  try {
    const d = raw?.toDate ? raw.toDate() : new Date(raw)
    return format(d, 'd MMM yyyy', { locale: idLocale })
  } catch { return '-' }
}

function truncate(text: string, max = 80) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// ─── Tabel review ────────────────────────────────────────────
function ReviewTable({
  reviews,
  showApprove,
  onApprove,
  onDelete,
}: {
  reviews: Review[]
  showApprove: boolean
  onApprove: (id: string) => void
  onDelete: (r: Review) => void
}) {
  if (reviews.length === 0) {
    return (
      <div className="p-10 text-center text-gray-400 text-sm">Tidak ada review di kategori ini.</div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Reviewer</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Produk</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Rating</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Komentar</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Tanggal</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {reviews.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-[#1C1C1C]">{r.reviewer_name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs max-w-[120px] truncate">{r.product_name}</td>
              <td className="px-4 py-3">
                <StarRating rating={r.rating} />
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-[220px]">
                {truncate(r.comment)}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                {formatDate(r.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {showApprove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove(r.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 text-xs"
                    >
                      <CheckCircle2 size={14} /> Setujui
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(r)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Komponen utama ──────────────────────────────────────────
export default function AdminReviewPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)
  const [bulkApproving, setBulkApproving] = useState(false)

  const pending = allReviews.filter((r) => !r.is_approved)
  const approved = allReviews.filter((r) => r.is_approved)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      setAllReviews(await getReviews())
    } catch { toast.error('Gagal memuat review') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id)
      toast.success('Review disetujui')
      setAllReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: true } : r))
    } catch { toast.error('Gagal menyetujui review') }
  }

  const handleBulkApprove = async () => {
    setBulkApproving(true)
    try {
      await approveAllPendingReviews()
      toast.success(`${pending.length} review disetujui`)
      setAllReviews((prev) => prev.map((r) => ({ ...r, is_approved: true })))
    } catch { toast.error('Gagal bulk approve') }
    finally { setBulkApproving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteReview(deleteTarget.id)
      toast.success('Review dihapus')
      setAllReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch { toast.error('Gagal menghapus review') }
  }

  return (
    <AdminLayout title="Moderasi Review">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Moderasi Review</h1>
          <p className="text-sm text-gray-500 mt-1">{allReviews.length} total review</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Tabs defaultValue="pending" className="w-full">
          <div className="flex items-center justify-between px-4 pt-4 border-b border-gray-100 pb-0">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-white">
                Menunggu
                {pending.length > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pending.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white">
                Disetujui ({approved.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                Semua ({allReviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Tombol bulk approve — hanya tampil di tab pending */}
            <div className="pb-3">
              {pending.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={bulkApproving}
                  className="gap-1.5 border-green-600 text-green-600 hover:bg-green-50 text-xs"
                >
                  <CheckCheck size={14} />
                  {bulkApproving ? 'Memproses...' : 'Setujui Semua'}
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Memuat review...</div>
          ) : (
            <>
              <TabsContent value="pending" className="mt-0">
                <ReviewTable
                  reviews={pending}
                  showApprove={true}
                  onApprove={handleApprove}
                  onDelete={setDeleteTarget}
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <ReviewTable
                  reviews={approved}
                  showApprove={false}
                  onApprove={handleApprove}
                  onDelete={setDeleteTarget}
                />
              </TabsContent>
              <TabsContent value="all" className="mt-0">
                <ReviewTable
                  reviews={allReviews}
                  showApprove={true}
                  onApprove={handleApprove}
                  onDelete={setDeleteTarget}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Alert hapus */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus review dari "{deleteTarget?.reviewer_name}"?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
