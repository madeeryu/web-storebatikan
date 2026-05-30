'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from 'lucide-react'
import Image from 'next/image'

import AdminLayout from '@/components/layout/AdminLayout'
import ImageUploaderSingle from '@/components/admin/ImageUploaderSingle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/firestore'
import type { Category } from '@/types'

// ─── Zod schema ─────────────────────────────────────────────
const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi').regex(/^[a-z0-9-]+$/, 'Slug hanya huruf kecil, angka, dan strip'),
  order: z.number().min(0, 'Urutan harus ≥ 0'),
  is_active: z.boolean(),
})
type CategoryForm = z.infer<typeof categorySchema>

// ─── Helper ─────────────────────────────────────────────────
function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// ─── Komponen utama ──────────────────────────────────────────
export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: { name: '', slug: '', order: 0, is_active: true },
  })

  const nameVal = watch('name')

  // auto-slug dari nama saat tambah baru
  useEffect(() => {
    if (!editTarget) {
      setValue('slug', toSlug(nameVal ?? ''))
    }
  }, [nameVal, editTarget, setValue])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      toast.error('Gagal memuat kategori')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  // Buka dialog tambah
  const openAdd = () => {
    setEditTarget(null)
    setImageUrl('')
    reset({ name: '', slug: '', order: categories.length, is_active: true })
    setDialogOpen(true)
  }

  // Buka dialog edit
  const openEdit = (cat: Category) => {
    setEditTarget(cat)
    setImageUrl(cat.image ?? '')
    reset({ name: cat.name, slug: cat.slug, order: cat.order, is_active: cat.is_active })
    setDialogOpen(true)
  }

  // Submit form
  const onSubmit = async (data: CategoryForm) => {
    setSubmitting(true)
    try {
      const payload = { ...data, image: imageUrl }
      if (editTarget) {
        await updateCategory(editTarget.id, payload)
        toast.success('Kategori berhasil diperbarui')
      } else {
        await createCategory(payload)
        toast.success('Kategori berhasil ditambahkan')
      }
      setDialogOpen(false)
      fetchCategories()
    } catch {
      toast.error('Gagal menyimpan kategori')
    } finally {
      setSubmitting(false)
    }
  }

  // Hapus kategori
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      toast.success('Kategori dihapus')
      setDeleteTarget(null)
      fetchCategories()
    } catch {
      toast.error('Gagal menghapus kategori')
    }
  }

  // Toggle is_active langsung dari tabel
  const toggleActive = async (cat: Category) => {
    try {
      await updateCategory(cat.id, { is_active: !cat.is_active })
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
      )
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  return (
    <AdminLayout title="Manajemen Kategori">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Kategori</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} kategori terdaftar</p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white gap-2"
        >
          <Plus size={16} /> Tambah Kategori
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Memuat...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Belum ada kategori</p>
            <p className="text-sm text-gray-400 mt-1">Tambah kategori pertama untuk mulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium w-12">#</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Gambar</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Urutan</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={18} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1C1C1C]">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={cat.is_active}
                        onCheckedChange={() => toggleActive(cat)}
                        className="data-[state=checked]:bg-[#8B1A1A]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(cat)}
                          className="text-gray-500 hover:text-[#8B1A1A]"
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(cat)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog Tambah / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-semibold text-[#1C1C1C]">
              {editTarget ? 'Edit Kategori' : 'Tambah Kategori'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Gambar */}
            <div className="space-y-1.5">
              <Label>Gambar Kategori</Label>
              <ImageUploaderSingle
                currentUrl={imageUrl || undefined}
                storagePath="categories"
                filePrefix={watch('slug') || 'category'}
                onUploaded={setImageUrl}
                label="Upload Gambar Kategori"
                sizeHint="Rekomendasi: 800×600px (landscape)"
              />
            </div>

            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Kategori <span className="text-red-500">*</span></Label>
              <Input id="name" {...register('name')} placeholder="Contoh: Batik Tulis" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" {...register('slug')} placeholder="batik-tulis" className="font-mono text-sm" />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <Label htmlFor="order">Urutan Tampil</Label>
              <Input id="order" type="number" {...register('order')} min={0} className="w-24" />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <Switch
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(v) => setValue('is_active', v)}
                className="data-[state=checked]:bg-[#8B1A1A]"
              />
              <Label htmlFor="is_active">Aktif (tampil di website)</Label>
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white"
              >
                {submitting ? 'Menyimpan...' : editTarget ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert hapus */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.{' '}
              <strong>Produk yang ada di kategori ini tidak ikut terhapus</strong>, namun
              tidak akan tampil dalam filter kategori.
            </AlertDialogDescription>
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
