'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import Image from 'next/image'

import AdminLayout from '@/components/layout/AdminLayout'
import ImageUploaderSingle from '@/components/admin/ImageUploaderSingle'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '@/lib/firestore'
import type { Banner } from '@/types'

const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order: z.number().min(0),
  is_active: z.boolean(),
})
type BannerForm = z.infer<typeof bannerSchema>

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema) as any,
    defaultValues: { title: '', subtitle: '', cta_text: '', cta_link: '', order: 0, is_active: true },
  })

  const fetchBanners = async () => {
    setLoading(true)
    try {
      setBanners(await getAllBanners())
    } catch { toast.error('Gagal memuat banner') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBanners() }, [])

  const openAdd = () => {
    setEditTarget(null)
    setImageUrl('')
    reset({ title: '', subtitle: '', cta_text: '', cta_link: '', order: banners.length, is_active: true })
    setDialogOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditTarget(b)
    setImageUrl(b.image ?? '')
    reset({ title: b.title, subtitle: b.subtitle, cta_text: b.cta_text, cta_link: b.cta_link, order: b.order, is_active: b.is_active })
    setDialogOpen(true)
  }

  const onSubmit = async (data: BannerForm) => {
    if (!imageUrl) { toast.error('Gambar banner wajib diupload'); return }
    setSubmitting(true)
    try {
      const payload = { ...data, image: imageUrl } as Omit<Banner, 'id'>
      if (editTarget) {
        await updateBanner(editTarget.id, payload)
        toast.success('Banner diperbarui')
      } else {
        await createBanner(payload)
        toast.success('Banner ditambahkan')
      }
      setDialogOpen(false)
      fetchBanners()
    } catch { toast.error('Gagal menyimpan banner') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteBanner(deleteTarget.id)
      toast.success('Banner dihapus')
      setDeleteTarget(null)
      fetchBanners()
    } catch { toast.error('Gagal menghapus banner') }
  }

  const toggleActive = async (b: Banner) => {
    try {
      await updateBanner(b.id, { is_active: !b.is_active })
      setBanners((prev) => prev.map((item) => item.id === b.id ? { ...item, is_active: !b.is_active } : item))
    } catch { toast.error('Gagal mengubah status') }
  }

  return (
    <AdminLayout title="Manajemen Banner">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Banner Hero</h1>
          <p className="text-sm text-gray-500 mt-1">{banners.length} banner terdaftar</p>
        </div>
        <Button onClick={openAdd} className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white gap-2">
          <Plus size={16} /> Tambah Banner
        </Button>
      </div>

      {/* Grid preview banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Memuat...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Belum ada banner</p>
            <p className="text-sm text-gray-400 mt-1">Tambah banner untuk ditampilkan di hero homepage</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Preview</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Judul</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">CTA</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Urutan</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {b.image ? (
                        <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={b.image} alt={b.title || 'banner'} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1C]">{b.title || <span className="text-gray-400 italic">Tanpa judul</span>}</p>
                      {b.subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{b.subtitle}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {b.cta_text && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{b.cta_text}</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{b.order}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={b.is_active}
                        onCheckedChange={() => toggleActive(b)}
                        className="data-[state=checked]:bg-[#8B1A1A]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(b)} className="text-gray-500 hover:text-[#8B1A1A]">
                          <Pencil size={15} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(b)} className="text-gray-500 hover:text-red-600">
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

      {/* Dialog tambah/edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Banner' : 'Tambah Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kiri: upload */}
              <div className="space-y-1.5">
                <Label>Gambar Banner <span className="text-red-500">*</span></Label>
                <ImageUploaderSingle
                  currentUrl={imageUrl || undefined}
                  storagePath="banners"
                  filePrefix="banner"
                  onUploaded={setImageUrl}
                  label="Upload Gambar Banner"
                  sizeHint="Rekomendasi: 1920×700px (landscape)"
                />
              </div>

              {/* Kanan: form fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="b-title">Judul (opsional)</Label>
                  <Input id="b-title" {...register('title')} placeholder="Koleksi Lebaran 2025" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-subtitle">Subtitle (opsional)</Label>
                  <Input id="b-subtitle" {...register('subtitle')} placeholder="Elegan di setiap momen" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-cta">Teks Tombol CTA</Label>
                  <Input id="b-cta" {...register('cta_text')} placeholder="Lihat Koleksi" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-link">Link CTA</Label>
                  <Input id="b-link" {...register('cta_link')} placeholder="/produk atau https://..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-order">Urutan di Slider</Label>
                  <Input id="b-order" type="number" {...register('order')} min={0} className="w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={watch('is_active')}
                    onCheckedChange={(v) => setValue('is_active', v)}
                    className="data-[state=checked]:bg-[#8B1A1A]"
                  />
                  <Label>Aktif (tampil di homepage)</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={submitting} className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white">
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
            <AlertDialogTitle>Hapus banner ini?</AlertDialogTitle>
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
