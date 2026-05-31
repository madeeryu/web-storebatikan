'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { ExternalLink, Save } from 'lucide-react'

import AdminLayout from '@/components/layout/AdminLayout'
import ImageUploaderSingle from '@/components/admin/ImageUploaderSingle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { getSettings, initSettings, updateSettings } from '@/lib/firestore'
import type { StoreSettings } from '@/types'

// ─── Schema ─────────────────────────────────────────────────
const settingsSchema = z.object({
  store_name: z.string().min(1, 'Nama toko wajib diisi'),
  tagline: z.string().optional(),
  whatsapp_number: z
    .string()
    .min(1, 'Nomor WhatsApp wajib diisi')
    .regex(/^628[0-9]{8,12}$/, 'Format: 628xxxxxxx (tanpa + dan tanda baca)'),
  instagram: z.string().optional(),
  whatsapp_message_template: z.string().optional(),
  address: z.string().optional(),
})
type SettingsForm = z.infer<typeof settingsSchema>

const DEFAULT_WA_TEMPLATE = `Halo Batik AN 🙏

Saya ingin memesan:
{items}

*Total: {total}*
Nama: {nama}
Catatan: {catatan}

Mohon konfirmasi ketersediaan & info pengiriman. Terima kasih 🙏`

// ─── Komponen utama ──────────────────────────────────────────
export default function AdminPengaturanPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      store_name: 'Batik AN',
      tagline: 'Warisan Budaya Modern',
      whatsapp_number: '',
      instagram: '',
      whatsapp_message_template: DEFAULT_WA_TEMPLATE,
      address: '',
    },
  })

  const waNumber = watch('whatsapp_number') ?? ''

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        const data = await getSettings()
        if (data) {
          reset({
            store_name: data.store_name ?? 'Batik AN',
            tagline: data.tagline ?? 'Warisan Budaya Modern',
            whatsapp_number: data.whatsapp_number ?? '',
            instagram: data.instagram ?? '',
            whatsapp_message_template: data.whatsapp_message_template ?? DEFAULT_WA_TEMPLATE,
            address: data.address ?? '',
          })
          setLogoUrl(data.logo_url ?? '')
        }
      } catch {
        toast.error('Gagal memuat pengaturan')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [reset])

  const onSubmit = async (data: SettingsForm) => {
    setSubmitting(true)
    try {
      const payload: StoreSettings = {
        ...data,
        tagline: data.tagline ?? '',
        instagram: data.instagram ?? '',
        whatsapp_message_template: data.whatsapp_message_template ?? DEFAULT_WA_TEMPLATE,
        address: data.address ?? '',
        logo_url: logoUrl,
      }
      // initSettings menggunakan setDoc (create or overwrite)
      await initSettings(payload)
      toast.success('Pengaturan berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Pengaturan Toko">
        <div className="p-12 text-center text-gray-400">Memuat pengaturan...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Pengaturan Toko">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Pengaturan Toko</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi dasar toko Batik AN</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* ── Section: Identitas Toko ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-[#1C1C1C]">Identitas Toko</h2>
            <Separator />

            {/* Logo */}
            <div className="space-y-1.5">
              <Label>Logo Toko</Label>
              <ImageUploaderSingle
                currentUrl={logoUrl || undefined}
                storagePath="settings"
                filePrefix="logo"
                onUploaded={setLogoUrl}
                label="Upload Logo Toko"
                sizeHint="Rekomendasi: PNG transparan, min. 200×200px"
              />
              <p className="text-xs text-gray-400">
                Logo akan tampil di navbar dan footer website.
              </p>
            </div>

            {/* Nama Toko */}
            <div className="space-y-1.5">
              <Label htmlFor="store_name">
                Nama Toko <span className="text-red-500">*</span>
              </Label>
              <Input id="store_name" {...register('store_name')} placeholder="Batik AN" />
              {errors.store_name && (
                <p className="text-xs text-red-500">{errors.store_name.message}</p>
              )}
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register('tagline')} placeholder="Warisan Budaya Modern" />
            </div>

            {/* Alamat */}
            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat Pabrik / Toko</Label>
              <Textarea
                id="address"
                {...register('address')}
                rows={3}
                placeholder="cth: Jl. Batik No. 123, Pekalongan, Jawa Tengah 51111"
              />
              <p className="text-xs text-gray-400">Alamat ini tampil di bagian footer website.</p>
            </div>
          </div>

          {/* ── Section: Kontak ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-[#1C1C1C]">Kontak & Media Sosial</h2>
            <Separator />

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <Label htmlFor="wa_number">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="wa_number"
                {...register('whatsapp_number')}
                placeholder="628123456789"
                className="font-mono"
              />
              <p className="text-xs text-gray-400">
                Format: <code className="bg-gray-100 px-1 rounded">628xxxxxxx</code> — tanpa tanda +, spasi, atau tanda baca
              </p>
              {errors.whatsapp_number && (
                <p className="text-xs text-red-500">{errors.whatsapp_number.message}</p>
              )}
              {/* Preview link WA */}
              {waNumber.match(/^628[0-9]{8,12}$/) && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:underline mt-1"
                >
                  <ExternalLink size={12} />
                  https://wa.me/{waNumber}
                </a>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <Label htmlFor="instagram">Username Instagram</Label>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm">@</span>
                <Input id="instagram" {...register('instagram')} placeholder="batikan.official" />
              </div>
            </div>
          </div>

          {/* ── Section: Template Pesan WhatsApp ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="font-semibold text-[#1C1C1C]">Template Pesan WhatsApp</h2>
              <p className="text-xs text-gray-400 mt-1">
                Pesan ini dikirim otomatis saat pelanggan checkout via WhatsApp.
              </p>
            </div>
            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="wa_template">Template Pesan</Label>
              <Textarea
                id="wa_template"
                {...register('whatsapp_message_template')}
                rows={10}
                className="font-mono text-sm resize-none"
              />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Variabel yang tersedia:</p>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li><code className="bg-amber-100 px-1 rounded">{'{items}'}</code> — daftar produk yang dipesan</li>
                  <li><code className="bg-amber-100 px-1 rounded">{'{total}'}</code> — total harga belanja</li>
                  <li><code className="bg-amber-100 px-1 rounded">{'{nama}'}</code> — nama pembeli</li>
                  <li><code className="bg-amber-100 px-1 rounded">{'{catatan}'}</code> — catatan/pesan dari pembeli</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pb-8">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#8B1A1A] hover:bg-[#6B1414] text-white gap-2 px-8"
            >
              <Save size={16} />
              {submitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
