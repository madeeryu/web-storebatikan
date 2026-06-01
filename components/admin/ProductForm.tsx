'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createProduct, updateProduct } from '@/lib/firestore'
import { Category, Product } from '@/types'
import { generateSlug } from '@/lib/utils'
import ImageUploader from './ImageUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid' // or use crypto.randomUUID()

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda -'),
  description: z.string().default(''),
  category_id: z.string().min(1, 'Pilih kategori'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  discount_percent: z.number().min(0).max(100),
  is_featured: z.boolean(),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface ProductFormProps {
  initialData?: Product
  productId?: string
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [colors, setColors] = useState<{ name: string; hex_code: string; images?: string[] }[]>(
    initialData?.variants?.colors ?? []
  )
  const [sizes, setSizes] = useState<string[]>(initialData?.variants?.sizes ?? [])
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#8B1A1A')
  const [newSize, setNewSize] = useState('')
  const [loading, setLoading] = useState(false)

  // Generate a stable temp product ID for image upload path
  const [tempId] = useState(() => productId ?? `temp-${nanoid(10)}`)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      description: initialData?.description ?? '',
      category_id: initialData?.category_id ?? '',
      price: initialData?.price ?? 0,
      discount_percent: initialData?.discount_percent ?? 0,
      is_featured: initialData?.is_featured ?? false,
      is_active: initialData?.is_active ?? true,
    },
  })

  const nameValue = watch('name')
  const slugValue = watch('slug')

  // Auto-generate slug from name (only if slug hasn't been manually edited)
  useEffect(() => {
    if (!initialData && nameValue) {
      setValue('slug', generateSlug(nameValue))
    }
  }, [nameValue, initialData, setValue])

  useEffect(() => {
    const fetchCategories = async () => {
      const snap = await getDocs(
        query(collection(db, 'categories'), where('is_active', '==', true))
      )
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)))
    }
    fetchCategories()
  }, [])

  const addColor = () => {
    if (!newColorName.trim()) return
    setColors((prev) => [...prev, { name: newColorName.trim(), hex_code: newColorHex, images: [] }])
    setNewColorName('')
    setNewColorHex('#8B1A1A')
  }

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index))
  }

  // Toggle sebuah foto galeri untuk warna tertentu
  const toggleColorImage = (colorIndex: number, imageUrl: string) => {
    setColors((prev) =>
      prev.map((c, i) => {
        if (i !== colorIndex) return c
        const imgs = c.images ?? []
        return {
          ...c,
          images: imgs.includes(imageUrl)
            ? imgs.filter((u) => u !== imageUrl)
            : [...imgs, imageUrl],
        }
      })
    )
  }

  const addSize = () => {
    const trimmed = newSize.trim().toUpperCase()
    if (!trimmed || sizes.includes(trimmed)) return
    setSizes((prev) => [...prev, trimmed])
    setNewSize('')
  }

  const removeSize = (size: string) => {
    setSizes((prev) => prev.filter((s) => s !== size))
  }

  const selectedCategory = categories.find((c) => c.id === watch('category_id'))

  const onSubmit = async (data: FormValues) => {
    if (images.length === 0) {
      toast.error('Upload minimal 1 foto produk')
      return
    }

    // Wajib tiap warna punya minimal 1 foto
    const colorTanpaFoto = colors.find((c) => !c.images || c.images.length === 0)
    if (colorTanpaFoto) {
      toast.error(`Warna "${colorTanpaFoto.name}" belum punya foto. Pilih foto untuk tiap warna.`)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...data,
        category_name: selectedCategory?.name ?? '',
        images,
        variants: { colors, sizes },
      }

      if (initialData && productId) {
        await updateProduct(productId, payload)
        toast.success('Produk berhasil diperbarui!')
      } else {
        await createProduct(payload)
        toast.success('Produk berhasil ditambahkan!')
      }
      router.push('/admin/dashboard/produk')
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = 'border-stone-300 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]'
  const labelStyle = { color: 'var(--color-charcoal)' }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 space-y-5">
        <h2
          className="text-base font-semibold border-b pb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-maroon)', borderColor: '#C9A84C30' }}
        >
          Informasi Dasar
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Nama Produk *</Label>
            <Input {...register('name')} className={fieldStyle} placeholder="cth: Batik Parang Rusak" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Slug (URL)</Label>
            <Input {...register('slug')} className={fieldStyle} placeholder="batik-parang-rusak" />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            <p className="text-xs text-stone-400">/produk/{slugValue || 'slug-produk'}</p>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Kategori *</Label>
            <select
              {...register('category_id')}
              className="w-full h-9 px-3 py-1 text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A]"
            >
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Harga Normal (Rp) *</Label>
            <Input
              {...register('price', { valueAsNumber: true })}
              type="number"
              min={0}
              className={fieldStyle}
              placeholder="150000"
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>

          {/* Discount */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Diskon (%)</Label>
            <Input
              {...register('discount_percent', { valueAsNumber: true })}
              type="number"
              min={0}
              max={100}
              className={fieldStyle}
              placeholder="0"
            />
            <p className="text-xs text-stone-400">Isi 0 jika tidak ada diskon</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label style={labelStyle}>Deskripsi Produk</Label>
          <Textarea
            {...register('description')}
            className={`${fieldStyle} min-h-[120px]`}
            placeholder="Tulis deskripsi produk, bahan, cara perawatan, dll."
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-2">
          <div className="flex items-center gap-3">
            <Switch
              defaultChecked={initialData?.is_featured ?? false}
              onCheckedChange={(v) => setValue('is_featured', v)}
              id="is_featured"
            />
            <Label htmlFor="is_featured" style={labelStyle}>
              Tampil sebagai Produk Unggulan
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              defaultChecked={initialData?.is_active ?? true}
              onCheckedChange={(v) => setValue('is_active', v)}
              id="is_active"
            />
            <Label htmlFor="is_active" style={labelStyle}>
              Produk Aktif (tampil di toko)
            </Label>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 space-y-4">
        <h2
          className="text-base font-semibold border-b pb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-maroon)', borderColor: '#C9A84C30' }}
        >
          Foto Produk *
        </h2>
        <ImageUploader
          productId={tempId}
          initialImages={images}
          onChange={setImages}
          maxImages={8}
        />
      </section>

      {/* Variants */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 space-y-6">
        <h2
          className="text-base font-semibold border-b pb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-maroon)', borderColor: '#C9A84C30' }}
        >
          Varian Produk
        </h2>

        {/* Colors */}
        <div className="space-y-3">
          <Label style={labelStyle}>Pilihan Warna</Label>
          {/* Daftar warna + pemilih foto per warna */}
          <div className="space-y-3 mb-3">
            {colors.map((c, i) => (
              <div key={i} className="border border-stone-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-5 h-5 rounded-full border border-white shadow-sm flex-shrink-0"
                    style={{ background: c.hex_code }}
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="text-xs text-stone-400">
                    ({c.images?.length ?? 0} foto dipilih)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="ml-auto text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Pilih foto dari galeri untuk warna ini */}
                {images.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">
                    Upload foto produk dulu di atas, lalu pilih foto untuk warna ini.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {images.map((url) => {
                      const selected = c.images?.includes(url)
                      return (
                        <button
                          type="button"
                          key={url}
                          onClick={() => toggleColorImage(i, url)}
                          className="relative w-14 h-14 rounded-md overflow-hidden border-2 transition-all"
                          style={{ borderColor: selected ? '#8B1A1A' : 'transparent', opacity: selected ? 1 : 0.55 }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {selected && (
                            <span className="absolute top-0.5 right-0.5 bg-[#8B1A1A] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1">
              <p className="text-xs text-stone-500">Nama warna</p>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="cth: Merah Marun"
                className={`${fieldStyle} w-40`}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-stone-500">Pilih warna</p>
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-stone-300"
              />
            </div>
            <Button
              type="button"
              onClick={addColor}
              variant="outline"
              size="sm"
              className="border-[#C9A84C] text-[#6B3F2A] hover:bg-[#C9A84C]/10 h-10"
            >
              <Plus size={14} className="mr-1" /> Tambah
            </Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label style={labelStyle}>Pilihan Ukuran</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {sizes.map((s) => (
              <div
                key={s}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-medium text-stone-700"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSize(s)}
                  className="text-stone-400 hover:text-red-500 transition-colors ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="cth: S, M, L, XL, All Size, 38"
              className={`${fieldStyle} w-48`}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <Button
              type="button"
              onClick={addSize}
              variant="outline"
              size="sm"
              className="border-[#C9A84C] text-[#6B3F2A] hover:bg-[#C9A84C]/10"
            >
              <Plus size={14} className="mr-1" /> Tambah
            </Button>
          </div>
          <p className="text-xs text-stone-400">Tekan Enter atau klik Tambah untuk menambah ukuran</p>
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/dashboard/produk')}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="text-white px-8"
          style={{ background: 'var(--color-maroon)' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Menyimpan...
            </span>
          ) : initialData ? (
            'Update Produk'
          ) : (
            'Simpan Produk'
          )}
        </Button>
      </div>
    </form>
  )
}
