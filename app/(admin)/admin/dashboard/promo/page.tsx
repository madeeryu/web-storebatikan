'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Percent, Info } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

import AdminLayout from '@/components/layout/AdminLayout'
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
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { getPromos, createPromo, updatePromo, deletePromo, getCategories } from '@/lib/firestore'
import type { Promo, Category } from '@/types'

// ─── Schema ─────────────────────────────────────────────────
const promoSchema = z.object({
  name: z.string().min(1, 'Nama promo wajib diisi'),
  discount_percent: z.number().min(1).max(99),
  applies_to: z.enum(['all', 'category', 'product']),
  target_ids: z.array(z.string()),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
  is_active: z.boolean(),
})
type PromoForm = z.infer<typeof promoSchema>

// ─── Helper ─────────────────────────────────────────────────
function promoStatus(promo: Promo): 'aktif' | 'nonaktif' | 'expired' {
  if (isPast(promo.end_date?.toDate?.() ?? new Date(promo.end_date))) return 'expired'
  if (!promo.is_active) return 'nonaktif'
  return 'aktif'
}

const statusBadge: Record<string, string> = {
  aktif: 'bg-green-100 text-green-700',
  nonaktif: 'bg-gray-100 text-gray-600',
  expired: 'bg-gray-200 text-gray-500',
}

function formatDate(raw: any): string {
  try {
    const d = raw?.toDate ? raw.toDate() : new Date(raw)
    return format(d, 'd MMM yyyy', { locale: idLocale })
  } catch { return '-' }
}

function toInputDate(raw: any): string {
  try {
    const d = raw?.toDate ? raw.toDate() : new Date(raw)
    return format(d, 'yyyy-MM-dd')
  } catch { return '' }
}

// ─── Komponen utama ──────────────────────────────────────────
export default function AdminPromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Promo | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, reset, control, formState: { errors } } = useForm<PromoForm>({
    resolver: zodResolver(promoSchema) as any,
    defaultValues: {
      name: '', discount_percent: 10, applies_to: 'all',
      target_ids: [], start_date: '', end_date: '', is_active: true,
    },
  })

  const appliesTo = watch('applies_to')
  const targetIds = watch('target_ids')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([getPromos(), getCategories()])
      setPromos(p)
      setCategories(c)
    } catch { toast.error('Gagal memuat data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => {
    setEditTarget(null)
    reset({ name: '', discount_percent: 10, applies_to: 'all', target_ids: [], start_date: '', end_date: '', is_active: true })
    setDialogOpen(true)
  }

  const openEdit = (p: Promo) => {
    setEditTarget(p)
    reset({
      name: p.name,
      discount_percent: p.discount_percent,
      applies_to: p.applies_to,
      target_ids: p.target_ids ?? [],
      start_date: toInputDate(p.start_date),
      end_date: toInputDate(p.end_date),
      is_active: p.is_active,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: PromoForm) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        target_ids: data.applies_to === 'all' ? [] : data.target_ids,
      } as Omit<Promo, 'id'>
      if (editTarget) {
        await updatePromo(editTarget.id, payload)
        toast.success('Promo diperbarui')
      } else {
        await createPromo(payload)
        toast.success('Promo ditambahkan')
      }
      setDialogOpen(false)
      fetchData()
    } catch { toast.error('Gagal menyimpan promo') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePromo(deleteTarget.id)
      toast.success('Promo dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch { toast.error('Gagal menghapus promo') }
  }

  const toggleTarget = (id: string) => {
    const current = targetIds ?? []
    if (current.includes(id)) {
      setValue('target_ids', current.filter((t) => t !== id))
    } else {
      setValue('target_ids', [...current, id])
    }
  }

  return (
    <AdminLayout title="Promo & Diskon">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Promo & Diskon</h1>
          <p className="text-sm text-gray-500 mt-1">{promos.length} promo terdaftar</p>
        </div>
        <Button onClick={openAdd} className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white gap-2">
          <Plus size={16} /> Tambah Promo
        </Button>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
        <Info size={16} className="mt-0.5 flex-shrink-0" />
        <p>Jika produk memiliki diskon sendiri <strong>DAN</strong> ada promo aktif, sistem otomatis menggunakan diskon terbesar.</p>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Memuat...</div>
        ) : promos.length === 0 ? (
          <div className="p-12 text-center">
            <Percent size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Belum ada promo</p>
            <p className="text-sm text-gray-400 mt-1">Tambah promo untuk memberikan diskon ke pelanggan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Nama Promo</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Diskon</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Berlaku untuk</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Periode</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promos.map((p) => {
                  const status = promoStatus(p)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[#1C1C1C]">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[#8B1A1A] font-bold">{p.discount_percent}%</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">
                        {p.applies_to === 'all' ? 'Semua produk' :
                         p.applies_to === 'category' ? `Kategori (${p.target_ids?.length ?? 0})` :
                         `Produk (${p.target_ids?.length ?? 0})`}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(p.start_date)} — {formatDate(p.end_date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="text-gray-500 hover:text-[#8B1A1A]">
                            <Pencil size={15} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)} className="text-gray-500 hover:text-red-600">
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog tambah/edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Promo' : 'Tambah Promo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Nama */}
            <div className="space-y-1.5">
              <Label>Nama Promo <span className="text-red-500">*</span></Label>
              <Input {...register('name')} placeholder="Contoh: Lebaran Sale, Flash Sale Jumat" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Diskon % */}
            <div className="space-y-1.5">
              <Label>Persentase Diskon <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-2">
                <Input type="number" {...register('discount_percent', { valueAsNumber: true })} min={1} max={99} className="w-24" />
                <span className="text-gray-500">%</span>
              </div>
              {errors.discount_percent && <p className="text-xs text-red-500">Masukkan angka 1–99</p>}
            </div>

            {/* Berlaku untuk */}
            <div className="space-y-1.5">
              <Label>Berlaku untuk</Label>
              <Controller
                name="applies_to"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue('target_ids', []) }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua produk</SelectItem>
                      <SelectItem value="category">Kategori tertentu</SelectItem>
                      <SelectItem value="product">Produk tertentu</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Target: kategori */}
            {appliesTo === 'category' && (
              <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                <Label className="text-xs text-gray-500">Pilih kategori yang mendapat promo:</Label>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={targetIds?.includes(cat.id)}
                      onCheckedChange={() => toggleTarget(cat.id)}
                    />
                    <label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">{cat.name}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Periode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tanggal Mulai</Label>
                <Input type="date" {...register('start_date')} />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Tanggal Selesai</Label>
                <Input type="date" {...register('end_date')} />
                {errors.end_date && <p className="text-xs text-red-500">{errors.end_date.message}</p>}
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <Switch
                checked={watch('is_active')}
                onCheckedChange={(v) => setValue('is_active', v)}
                className="data-[state=checked]:bg-[#8B1A1A]"
              />
              <Label>Aktifkan promo</Label>
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
            <AlertDialogTitle>Hapus promo "{deleteTarget?.name}"?</AlertDialogTitle>
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
