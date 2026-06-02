'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Heart, ChevronDown, MessageCircle } from 'lucide-react'
import { getStoreSettings } from '@/lib/firestore'
import { generateWALink } from '@/lib/utils'
import { ProductGallery } from '@/components/product/ProductGallery'
import { VariantSelector } from '@/components/product/VariantSelector'
import { ReviewSection } from '@/components/product/ReviewSection'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { FlashSaleBanner } from '@/components/product/FlashSaleBanner'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'
import { Star } from 'lucide-react'

interface Props {
  product: Product
  finalPrice: number
  discountPercent: number
}

export function DetailProdukClient({ product, finalPrice, discountPercent }: Props) {
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0]?.name || '')
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || '')
  const [descExpanded, setDescExpanded] = useState(false)

  const router = useRouter()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [waNumber, setWaNumber] = useState('')

  useEffect(() => {
    getStoreSettings()
      .then((s) => { if (s?.whatsapp_number) setWaNumber(s.whatsapp_number) })
      .catch(() => {})
  }, [])

  function handleAskAdmin() {
    if (!waNumber) {
      toast.error('Nomor WhatsApp toko belum tersedia.')
      return
    }
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const msg = [
      'Halo Batik AN 🙏',
      '',
      `Saya ingin bertanya tentang produk:`,
      `*${product.name}*`,
      selectedColor ? `Warna: ${selectedColor}` : '',
      selectedSize ? `Ukuran: ${selectedSize}` : '',
      url ? `Link: ${url}` : '',
      '',
      'Apakah produk ini tersedia?',
    ].filter(Boolean).join('\n')
    window.open(generateWALink(waNumber, msg), '_blank')
  }

  const wishlisted = isWishlisted(product.id)
  const hasVariants = (product.variants?.colors?.length ?? 0) > 0 || (product.variants?.sizes?.length ?? 0) > 0

  // Galeri SELALU menampilkan semua foto produk.
  // Saat warna dipilih, galeri lompat ke foto pertama warna itu.
  const allImages = product.images || []
  const colorObj = product.variants?.colors?.find((c) => c.name === selectedColor)
  const colorFirstImage = colorObj?.images?.[0]
  const initialImageIndex = colorFirstImage ? Math.max(0, allImages.indexOf(colorFirstImage)) : 0

  // Harga menyesuaikan ukuran terpilih (jika ukuran punya harga khusus)
  const sizePrices = product.variants?.size_prices ?? {}
  const basePrice = (selectedSize && sizePrices[selectedSize]) || product.price
  const effectiveFinalPrice = discountPercent > 0
    ? Math.round(basePrice * (1 - discountPercent / 100))
    : basePrice

  function cartPayload() {
    return {
      product_id: product.id,
      product_name: product.name,
      image: colorObj?.images?.[0] || product.images?.[0] || '',
      price: basePrice,                 // harga sesuai ukuran terpilih
      original_price: basePrice,
      discount_percent: discountPercent,
      selected_color: selectedColor || undefined,
      selected_size: selectedSize || undefined,
      quantity: qty,
      slug: product.slug,
    }
  }

  function handleAddToCart() {
    addItem(cartPayload())
    toast.success('Produk ditambahkan ke keranjang!')
  }

  function handleBuyNow() {
    addItem(cartPayload())
    router.push('/cart')
  }

  const descLong = (product.description?.length ?? 0) > 300

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-[var(--color-maroon)] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-[var(--color-maroon)] transition-colors">Produk</Link>
          <span>/</span>
          <span className="text-[var(--color-charcoal)] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery — key reset saat warna ganti */}
          <ProductGallery key={selectedColor} images={allImages} initialIndex={initialImageIndex} productName={product.name} />

          {/* Info */}
          <div className="space-y-5">
            {/* Category */}
            {product.category_name && (
              <Link
                href={`/kategori/${product.category_id}`}
                className="text-xs font-semibold text-[var(--color-gold)] uppercase tracking-widest hover:underline"
              >
                {product.category_name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] leading-tight">
              {product.name}
            </h1>

            {/* Flash Sale banner (jika produk sedang flash sale) */}
            <FlashSaleBanner product={product} finalPrice={effectiveFinalPrice} />

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-xl sm:text-2xl text-[var(--color-maroon)]">
                {formatRupiah(effectiveFinalPrice)}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-gray-400 line-through text-sm sm:text-base">{formatRupiah(basePrice)}</span>
                  <span className="bg-[var(--color-gold)] text-[var(--color-maroon)] text-xs font-bold px-2 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-gold)]/20" />

            {/* Varian */}
            {hasVariants && (
              <VariantSelector
                colors={product.variants?.colors || []}
                sizes={product.variants?.sizes || []}
                sizePrices={sizePrices}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
              />
            )}

            {/* Qty */}
            <div>
              <p className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">Jumlah</p>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-9 border-t border-b border-gray-300 flex items-center justify-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Buy Now — langsung ke checkout */}
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 text-white py-3 rounded font-semibold transition-opacity hover:opacity-90 text-sm"
              style={{ backgroundColor: '#C5973A' }}
            >
              Beli Sekarang
            </button>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-maroon)] text-white py-3 rounded font-semibold hover:bg-[var(--color-maroon)]/90 transition-colors text-sm"
              >
                <ShoppingCart size={18} />
                Tambah ke Keranjang
              </button>
              <button
                onClick={() => {
                  toggle(product.id)
                  toast(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist ❤️')
                }}
                className={`px-4 py-3 border rounded font-semibold text-sm transition-all duration-200 ${
                  wishlisted
                    ? 'border-[var(--color-maroon)] bg-[var(--color-maroon)] text-white'
                    : 'border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white'
                }`}
              >
                <Heart size={18} className={wishlisted ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Tanya Admin via WhatsApp */}
            <button
              onClick={handleAskAdmin}
              className="ask-admin-btn group w-full flex items-center justify-center gap-2 py-2.5 rounded font-semibold text-sm border"
            >
              <MessageCircle size={18} className="transition-transform duration-300 group-hover:rotate-12" />
              Tanya tentang produk ini
            </button>

            {/* Deskripsi */}
            {product.description && (
              <div className="border-t border-[var(--color-gold)]/20 pt-4">
                <p className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">Deskripsi Produk</p>
                <div className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${!descExpanded && descLong ? 'line-clamp-4' : ''}`}>
                  {product.description}
                </div>
                {descLong && (
                  <button
                    onClick={() => setDescExpanded(e => !e)}
                    className="mt-2 text-xs text-[var(--color-maroon)] flex items-center gap-1 hover:underline"
                  >
                    {descExpanded ? 'Lebih sedikit' : 'Selengkapnya'}
                    <ChevronDown size={12} className={`transition-transform ${descExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection productId={product.id} productName={product.name} />

        {/* Rekomendasi produk kategori sama */}
        <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
      </div>
    </div>
  )
}
