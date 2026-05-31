'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

import AdminLayout from '@/components/layout/AdminLayout'
import ImageUploaderSingle from '@/components/admin/ImageUploaderSingle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { getSettings, initSettings, updateSettings } from '@/lib/firestore'
import type { StoreSettings } from '@/types'

const settingsSchema = z.object({
  store_name: z.string().min(1, 'Nama toko wajib diisi'),
  tagline: z.string().optional(),
  whatsapp_number: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  whatsapp_message_template: z.string().optional(),
  instagram: z.string().optional(),
  logo_url: z.string().optional(),
  address: z.string().optional(),
})
type SettingsForm = z.infer<typeof settingsSchema>

export default function PengaturanPage() {
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      store_name: '',
      tagline: '',
      whatsapp_number: '',
      whatsapp_message_template: '',
      instagram: '',
      logo_url: '',
      address: '',
    },
  })

  const logoUrl = watch('logo_url')
  const waNumber = watch('whatsapp_number')

  useEffect(() => {
    getSettings().then((s) => {
      if (s) reset(s)
    })
  }, [reset])

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true)
    try {
      const existing = await getSettings()
      if (existing) {
        await updateSettings(data)
      } else {
        await initSettings(data as StoreSettings)
      }
      toast.success('Pengaturan berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const labelStyle = { color: 'var(--color-charcoal)' }
  const fieldStyle = 'border-stone-300 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]'

  return (
    <AdminLayout title="Pengaturan">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 space-y-5">
          <h2 className="text-base font-semibold border-b pb-3" style={{ color: 'var(--color-maroon)', borderColor: '#C9A84C30' }}>
            Informasi Toko
          </h2>

          {/* Logo */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Logo Toko</Label>
            <ImageUploaderSingle
              value={logoUrl}
              onChange={(url) => setValue('logo_url', url)}
              folder="settings"
            />
            <p className="text-xs text-stone-400">Logo tampil di navbar & footer.</p>
          </div>

          {/* Nama toko */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Nama Toko *</Label>
            <Input {...register('store_name')} className={fieldStyle} placeholder="Batik AN" />
            {errors.store_name && <p className="text-xs text-red-500">{errors.store_name.message}</p>}
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Tagline</Label>
            <Input {...register('tagline')} className={fieldStyle} placeholder="Warisan Budaya Modern" />
          </div>

          {/* Alamat */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Alamat Pabrik / Toko</Label>
            <Textarea
              {...register('address')}
              className={fieldStyle}
              rows={3}
              placeholder="cth: Jl. Batik No. 123, Pekalongan, Jawa Tengah 51111"
            />
            <p className="text-xs text-stone-400">Alamat ini tampil di bagian footer website.</p>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 space-y-5">
          <h2 className="text-base font-semibold border-b pb-3" style={{ color: 'var(--color-maroon)', borderColor: '#C9A84C30' }}>
            Kontak
          </h2>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Nomor WhatsApp *</Label>
            <Input {...register('whatsapp_number')} className={fieldStyle} placeholder="628xxxxxxxxxx" />
            {errors.whatsapp_number && <p className="text-xs text-red-500">{errors.whatsapp_number.message}</p>}
            {waNumber && (
              <p className="text-xs text-stone-400">
                Preview: <span className="text-[#25D366]">https://wa.me/{waNumber}</span>
              </p>
            )}
            <p className="text-xs text-stone-400">Format: 62 + nomor tanpa angka 0 di depan.</p>
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Instagram</Label>
            <Input {...register('instagram')} className={fieldStyle} placeholder="username tanpa @" />
          </div>

          {/* Template pesan WA */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Template Pesan WhatsApp</Label>
            <Textarea
              {...register('whatsapp_message_template')}
              className={fieldStyle}
              rows={3}
              placeholder="Variabel: {items}, {total}, {nama}, {catatan}"
            />
          </div>
        </section>

        <Button
          type="submit"
          disabled={saving}
          className="text-white flex items-center gap-2"
          style={{ background: 'var(--color-maroon)' }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Simpan Pengaturan
        </Button>
      </form>
    </AdminLayout>
  )
}
