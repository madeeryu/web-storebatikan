// lib/storage.ts — Cloudinary upload (menggantikan Firebase Storage)

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

// ─── Generic upload dengan progress callback ─────────────────────────────────

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    // path dipakai sebagai folder di Cloudinary
    formData.append('folder', path.split('/').slice(0, -1).join('/') || 'batikan')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', UPLOAD_URL)

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.secure_url)
      } else {
        reject(new Error(`Upload gagal: ${xhr.status}`))
      }
    }

    xhr.onerror = () => reject(new Error('Upload gagal (network error)'))
    xhr.send(formData)
  })
}

// ─── Upload helpers per jenis file ───────────────────────────────────────────

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload gagal')
  const data = await res.json()
  return data.secure_url as string
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  return uploadToCloudinary(file, `batikan/products/${productId}`)
}

export async function uploadCategoryImage(file: File): Promise<string> {
  return uploadToCloudinary(file, 'batikan/categories')
}

export async function uploadBannerImage(file: File): Promise<string> {
  return uploadToCloudinary(file, 'batikan/banners')
}

export async function uploadLogo(file: File): Promise<string> {
  return uploadToCloudinary(file, 'batikan/settings')
}

// ─── Hapus gambar (Cloudinary delete butuh signed API — skip untuk sekarang) ──

export async function deleteImageByUrl(_url: string): Promise<void> {
  // Cloudinary unsigned delete tidak didukung langsung dari browser.
  // Gambar lama akan tetap ada di Cloudinary tapi tidak dipakai.
  // Untuk production bisa tambahkan API route server-side untuk delete.
  console.warn('deleteImageByUrl: not implemented for Cloudinary unsigned preset')
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function safeFileName(file: File, prefix = ''): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const base = prefix ? `${prefix}-` : ''
  return `${base}${Date.now()}.${ext}`
}
