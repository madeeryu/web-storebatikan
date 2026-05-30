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
