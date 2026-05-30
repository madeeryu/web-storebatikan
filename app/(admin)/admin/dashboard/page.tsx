'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Tag, Percent, Star, Plus, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, Review } from '@/types'
import { formatRupiah } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, promos: 0, pendingReviews: 0 })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodSnap, catSnap, promoSnap, reviewSnap, recentProd, pendingRev] = await Promise.all([
          getDocs(query(collection(db, 'products'), where('is_active', '==', true))),
          getDocs(query(collection(db, 'categories'), where('is_active', '==', true))),
          getDocs(query(collection(db, 'promos'), where('is_active', '==', true))),
          getDocs(query(collection(db, 'reviews'), where('is_approved', '==', false))),
          getDocs(query(collection(db, 'products'), orderBy('created_at', 'desc'), limit(5))),
          getDocs(query(collection(db, 'reviews'), where('is_approved', '==', false), orderBy('created_at', 'desc'), limit(5))),
        ])
        setStats({
          products: prodSnap.size,
          categories: catSnap.size,
          promos: promoSnap.size,
          pendingReviews: reviewSnap.size,
        })
        setRecentProducts(recentProd.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
        setPendingReviews(pendingRev.docs.map(d => ({ id: d.id, ...d.data() } as Review)))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Produk Aktif', value: stats.products, icon: Package, color: '#8B1A1A', href: '/admin/dashboard/produk' },
    { label: 'Kategori', value: stats.categories, icon: Tag, color: '#C9A84C', href: '/admin/dashboard/kategori' },
    { label: 'Promo Aktif', value: stats.promos, icon: Percent, color: '#2563EB', href: '/admin/dashboard/promo' },
    { label: 'Review Pending', value: stats.pendingReviews, icon: Star, color: stats.pendingReviews > 0 ? '#DC2626' : '#6B7280', href: '/admin/dashboard/review' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <Link key={card.label} href={card.href}>
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '15' }}>
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                </div>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-100 animate-pulse rounded" />
                ) : (
                  <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Shortcuts */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/dashboard/produk/tambah">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#8B1A1A' }}>
              <Plus size={16} /> Tambah Produk
            </button>
          </Link>
          <Link href="/admin/dashboard/banner">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#C9A84C' }}>
              <ImageIcon size={16} /> Tambah Banner
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-sm text-gray-800">Produk Terbaru</h2>
              <Link href="/admin/dashboard/produk" className="text-xs text-[#8B1A1A] hover:underline">Lihat semua →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="px-5 py-3 flex gap-3 items-center">
                    <div className="w-10 h-12 bg-gray-100 animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : recentProducts.length === 0 ? (
                <p className="px-5 py-8 text-sm text-gray-400 text-center">Belum ada produk</p>
              ) : (
                recentProducts.map(p => (
                  <div key={p.id} className="px-5 py-3 flex gap-3 items-center">
                    <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{formatRupiah(p.price)}</p>
                    </div>
                    <Link href={`/admin/dashboard/produk/${p.id}`} className="text-xs text-blue-500 hover:underline flex-shrink-0">Edit</Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-sm text-gray-800">Review Menunggu</h2>
              <Link href="/admin/dashboard/review" className="text-xs text-[#8B1A1A] hover:underline">Kelola →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="px-5 py-3 space-y-2">
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                  </div>
                ))
              ) : pendingReviews.length === 0 ? (
                <p className="px-5 py-8 text-sm text-gray-400 text-center">Tidak ada review pending ✓</p>
              ) : (
                pendingReviews.map(r => (
                  <div key={r.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">{r.reviewer_name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{r.comment}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{r.product_name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
