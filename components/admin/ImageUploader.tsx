'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, GripVertical, Star } from 'lucide-react'
import { uploadProductImage, deleteImageByUrl } from '@/lib/storage'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  productId: string
  initialImages?: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUploader({
  productId,
  initialImages = [],
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = maxImages - images.length
      if (remaining <= 0) {
        toast.error(`Maksimal ${maxImages} foto`)
        return
      }

      const filesToProcess = Array.from(files).slice(0, remaining)
      const validFiles = filesToProcess.filter((f) => f.type.startsWith('image/'))

      if (validFiles.length === 0) {
        toast.error('File harus berupa gambar')
        return
      }

      setUploading(true)
      try {
        const uploadPromises = validFiles.map((file) =>
          uploadProductImage(file, productId)
        )
        const urls = await Promise.all(uploadPromises)
        const newImages = [...images, ...urls]
        setImages(newImages)
        onChange(newImages)
        toast.success(`${urls.length} foto berhasil diupload`)
      } catch (err) {
        console.error(err)
        toast.error('Gagal mengupload foto')
      } finally {
        setUploading(false)
      }
    },
    [images, productId, maxImages, onChange]
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = async (url: string, index: number) => {
    try {
      await deleteImageByUrl(url)
    } catch {
      // Ignore delete errors (file might not exist in storage)
    }
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onChange(newImages)
  }

  const handleSetPrimary = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.unshift(moved)
    setImages(newImages)
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#8B1A1A] bg-[#8B1A1A08]'
            : uploading
            ? 'border-stone-200 cursor-not-allowed bg-stone-50'
            : 'border-stone-300 hover:border-[#C9A84C] hover:bg-[#C9A84C08]'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-8 w-8 text-[#8B1A1A]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-stone-500">Mengupload...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-stone-400" />
            <p className="text-sm font-medium text-stone-600">
              Drag & drop foto di sini, atau{' '}
              <span style={{ color: 'var(--color-maroon)' }}>klik untuk pilih</span>
            </p>
            <p className="text-xs text-stone-400">
              PNG, JPG, WEBP • Maksimal {maxImages} foto •{' '}
              {images.length}/{maxImages} terpakai
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-stone-500 mb-2">
            Foto pertama adalah foto utama. Klik ★ untuk jadikan utama.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {images.map((url, index) => (
              <div
                key={url}
                className={`relative rounded-lg overflow-hidden aspect-square group ${
                  index === 0 ? 'ring-2 ring-[#C9A84C]' : ''
                }`}
              >
                <Image
                  src={url}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="p-1.5 bg-yellow-400 rounded-full text-black"
                      title="Jadikan foto utama"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(url, index)}
                    className="p-1.5 bg-red-500 rounded-full text-white"
                    title="Hapus foto"
                  >
                    <X size={14} />
                  </button>
                </div>
                {/* Primary badge */}
                {index === 0 && (
                  <div
                    className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded text-white font-medium"
                    style={{ background: 'var(--color-gold)' }}
                  >
                    Utama
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
