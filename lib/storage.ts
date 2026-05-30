import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './firebase'
import { nanoid } from 'nanoid'

// Helper to convert file extension
function getExtension(file: File): string {
  const parts = file.name.split('.')
  return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : '.jpg'
}

// Upload product image
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const ext = getExtension(file)
  const filename = `${nanoid(8)}${ext}`
  const storageRef = ref(storage, `products/${productId}/${filename}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Upload category image
export async function uploadCategoryImage(file: File): Promise<string> {
  const ext = getExtension(file)
  const filename = `${nanoid(8)}${ext}`
  const storageRef = ref(storage, `categories/${filename}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Upload banner image
export async function uploadBannerImage(file: File): Promise<string> {
  const ext = getExtension(file)
  const filename = `${nanoid(8)}${ext}`
  const storageRef = ref(storage, `banners/${filename}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Upload settings logo
export async function uploadLogo(file: File): Promise<string> {
  const storageRef = ref(storage, 'settings/logo.png')
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Delete image by URL
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    // Extract path from Firebase Storage URL
    const decodedUrl = decodeURIComponent(url)
    const match = decodedUrl.match(/\/o\/(.+?)(\?|$)/)
    if (!match) return
    const path = match[1]
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    // Ignore errors (file may not exist)
    console.warn('Could not delete image:', error)
  }
}

// ─── Generic upload dengan progress ─────────────────────────────────────────

import { uploadBytesResumable } from 'firebase/storage'

/** Upload file ke path tertentu dengan progress callback */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, path)
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        onProgress?.(pct)
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

/** Buat nama file yang aman: prefix + timestamp + ekstensi */
export function safeFileName(file: File, prefix = ''): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const base = prefix ? `${prefix}-` : ''
  return `${base}${Date.now()}.${ext}`
}
