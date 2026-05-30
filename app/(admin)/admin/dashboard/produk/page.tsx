'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  collection,
  query,
  getDocs,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product, Category } from '@/types'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(
        query(collection(db, 'products'), orderBy('created_at', 'desc'))
      )
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    getDocs(query(collection(db, 'categories'))).then((snap) =>
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)))
    )
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      filterCategory === 'all' || p.category_id === filterCategory
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.is_active) ||
      (filterStatus === 'inactive' && !p.is_active)
    return matchSearch && matchCategory && matchStatus
  })

  const handleToggle = async (
    id: string,
    field: 'is_active' | 'is_featured',
    value: boolean
  ) => {
    try {
      await updateDoc(doc(db, 'products', id), { [field]: value })
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      )
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'products', deleteTarget.id))
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Produk berhasil dihapus')
      setDeleteTarget(null)
    } catch {
      toast.error('Gagal menghapus produk')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="pl-9 w-52 border-stone-300"
              />
            </div>
            {/* Category filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 border-stone-300">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 border-stone-300">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/admin/dashboard/produk/tambah">
            <Button className="text-white flex items-center gap-2 whitespace-nowrap" style={{ background: 'var(--color-maroon)' }}>
              <Plus size={16} />
              Tambah Produk
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-stone-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-stone-300" />
                </div>
                <p className="text-stone-500 font-medium">
                  {products.length === 0 ? 'Belum ada produk' : 'Tidak ada produk yang cocok'}
                </p>
                {products.length === 0 && (
                  <Link href="/admin/dashboard/produk/tambah" className="text-sm text-[#8B1A1A] hover:underline mt-1 block">
                    Tambah produk pertama →
                  </Link>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ background: 'var(--color-ivory)', borderColor: '#C9A84C30' }}>
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold w-12">Foto</th>
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold">Nama</th>
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold hidden md:table-cell">Kategori</th>
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold hidden sm:table-cell">Harga</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold">Aktif</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold hidden lg:table-cell">Unggulan</th>
                    <th className="text-right px-5 py-3 text-xs uppercase tracking-wide text-stone-500 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-b last:border-0 hover:bg-stone-50/50 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-stone-50/30'
                      }`}
                    >
                      {/* Photo */}
                      <td className="px-5 py-3">
                        <div className="relative w-10 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">Foto</div>
                          )}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="px-5 py-3">
                        <p className="font-medium text-stone-800 line-clamp-1">{p.name}</p>
                        {p.discount_percent > 0 && (
                          <Badge className="mt-0.5 text-xs" style={{ background: '#C9A84C20', color: '#6B3F2A', border: '1px solid #C9A84C40' }}>
                            -{p.discount_percent}% diskon
                          </Badge>
                        )}
                      </td>
                      {/* Category */}
                      <td className="px-5 py-3 text-stone-500 hidden md:table-cell">{p.category_name}</td>
                      {/* Price */}
                      <td className="px-5 py-3 hidden sm:table-cell font-medium" style={{ color: 'var(--color-maroon)' }}>
                        {formatRupiah(p.price)}
                      </td>
                      {/* Active */}
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={p.is_active}
                          onCheckedChange={(v) => handleToggle(p.id, 'is_active', v)}
                        />
                      </td>
                      {/* Featured */}
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <Switch
                          checked={p.is_featured}
                          onCheckedChange={(v) => handleToggle(p.id, 'is_featured', v)}
                        />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/dashboard/produk/${p.id}`}>
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-stone-100 text-xs text-stone-400">
              Menampilkan {filtered.length} dari {products.length} produk
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--color-maroon)' }}>Hapus Produk</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600">
            Yakin ingin menghapus produk{' '}
            <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
