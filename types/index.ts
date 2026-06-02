// ═══════════════════════════════════════════
// BATIK AN — TypeScript Types
// ═══════════════════════════════════════════

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount_percent: number          // 0 = tidak ada diskon
  images: string[]                  // array URL Firebase Storage, index 0 = foto utama
  category_id: string
  category_name: string
  variants: {
    colors: ProductColor[]
    sizes: string[]                 // ["S","M","L","XL"] atau ["38","39","40"] dll
    size_prices?: Record<string, number>  // harga khusus per ukuran, mis. {"XXL":95000,"L4":120000}
  }
  is_featured: boolean              // tampil di section unggulan homepage
  is_active: boolean
  created_at: any                   // Firestore Timestamp
}

export interface ProductColor {
  name: string                      // "Merah Marun", "Navy", dll
  hex_code: string                  // "#8B1A1A"
  images?: string[]                 // foto khusus warna ini (opsional)
  available_sizes?: string[]        // ukuran yang tersedia utk warna ini; kosong = semua tersedia
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string                     // URL Firebase Storage
  order: number                     // urutan tampil
  is_active: boolean
}

export interface Banner {
  id: string
  image: string                     // URL Firebase Storage (rekomendasi 1920x700px)
  title: string
  subtitle: string
  cta_text: string                  // teks tombol, misal "Lihat Koleksi"
  cta_link: string                  // link tujuan, misal "/produk"
  order: number
  is_active: boolean
}

export interface Promo {
  id: string
  name: string                      // "Lebaran Sale", "Flash Sale Jumat"
  discount_percent: number          // 1-99
  applies_to: 'all' | 'category' | 'product'
  target_ids: string[]              // kosong jika applies_to = 'all'
  start_date: any                   // Firestore Timestamp
  end_date: any                     // Firestore Timestamp
  is_active: boolean
  is_flash_sale?: boolean           // true = tampil di section Flash Sale homepage
}

export interface Review {
  id: string
  product_id: string
  product_name: string
  reviewer_name: string
  rating: number                    // 1-5
  comment: string
  is_approved: boolean              // false = menunggu persetujuan admin
  created_at: any                   // Firestore Timestamp
}

export interface CartItem {
  product_id: string
  product_name: string
  image: string                     // URL foto utama produk
  price: number                     // harga sudah setelah diskon
  original_price: number            // harga asli sebelum diskon
  discount_percent: number
  selected_color?: string           // nama warna yang dipilih
  selected_size?: string            // ukuran yang dipilih
  quantity: number
  slug: string                      // untuk link ke halaman produk
}

export interface StoreSettings {
  store_name: string
  tagline: string
  whatsapp_number: string           // format: 628xxxxxxx
  whatsapp_message_template?: string
  instagram: string                 // tanpa @
  logo_url: string                  // URL Firebase Storage
  address?: string                  // alamat pabrik/toko, tampil di footer
  about_story?: string              // cerita "Tentang Kami"
  about_vision?: string             // visi
  about_mission?: string            // misi (pisahkan tiap poin dengan baris baru)
  shipping_rates?: {                // estimasi ongkir per zona (Rp)
    jabodetabek?: number
    jawa?: number
    bali_ntb?: number
    luar_jawa?: number
  }
}

// Untuk filter halaman produk
export interface ProductFilter {
  category_id?: string
  min_price?: number
  max_price?: number
  sort?: 'terbaru' | 'termurah' | 'termahal' | 'diskon'
  page?: number
}

// Response dari fungsi Firestore
export interface PaginatedProducts {
  products: Product[]
  hasMore: boolean
  lastDoc: any                      // Firestore DocumentSnapshot untuk cursor
}
