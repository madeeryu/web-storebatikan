/**
 * Format angka ke format Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Generate slug dari string (nama produk/kategori)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Hitung harga setelah diskon
 */
export function calculateDiscountedPrice(price: number, discountPercent: number): number {
  if (!discountPercent || discountPercent <= 0) return price
  return Math.round(price * (1 - discountPercent / 100))
}

/**
 * Cek apakah produk dianggap "baru" (< 7 hari)
 */
export function isNewProduct(createdAt: any): boolean {
  if (!createdAt) return false
  const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt)
  const now = new Date()
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays < 7
}

/**
 * Truncate teks dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format tanggal ke bahasa Indonesia
 */
export function formatDate(date: any): string {
  const d = date?.toDate ? date.toDate() : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Generate WhatsApp link dari nomor dan pesan
 */
export function generateWALink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}

/**
 * cn helper (menggabungkan class names)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
