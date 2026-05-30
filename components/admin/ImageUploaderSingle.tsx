'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFile, safeFileName } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface ImageUploaderSingleProps {
  /** URL gambar yang sudah ada (dari Firestore) */
  currentUrl?: string
  /** Path folder di Storage, misal: "categories" */
  storagePath: string
  /** Prefix nama file, misal: slug kategori */
  filePrefix?: string
  /** Callback saat upload selesai, menerima download URL */
  onUploaded: (url: string) => void
  /** Label tombol upload */
  label?: string
  /** Rekomendasi ukuran untuk user */
  sizeHint?: string
}

/**
 * Komponen upload gambar tunggal dengan drag-and-drop,
 * preview, dan progress bar — digunakan di form Kategori, Banner, Settings.
 */
export default function ImageUploaderSingle({
  currentUrl,
  storagePath,
  filePrefix = 'image',
  onUploaded,
  label = 'Upload Gambar',
  sizeHint,
}: ImageUploaderSingleProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    // local preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setProgress(0)
    try {
      const filename = safeFileName(file, filePrefix)
      const url = await uploadFile(file, `${storagePath}/${filename}`, setProgress)
      onUploaded(url)
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clearImage = () => {
    setPreview(null)
    onUploaded('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          dragging ? 'border-[#C9A84C] bg-amber-50' : 'border-gray-300 hover:border-[#8B1A1A]',
          preview ? 'p-2' : 'p-8'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />

        {preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded"
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearImage() }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 z-10"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload size={32} />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs">Klik atau seret gambar ke sini</p>
            {sizeHint && (
              <p className="text-xs text-amber-600 font-medium">{sizeHint}</p>
            )}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg gap-2">
            <Loader2 className="animate-spin text-[#8B1A1A]" size={24} />
            <p className="text-sm text-[#8B1A1A] font-medium">{progress}%</p>
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B1A1A] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
