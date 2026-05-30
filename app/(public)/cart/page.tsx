'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/cart/CartItem'
import { getStoreSettings } from '@/lib/firestore'
import { formatRupiah, generateWALink } from '@/lib/utils'
import type { StoreSettings } from '@/types'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, getTotal, clearCart } = useCart()
  const [buyerName, setBuyerName] = useState('')
  const [notes, setNotes] = useState('')
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getStoreSettings().then(setSettings).catch(console.error)
  }, [])

  if (!mounted) return null

  const total = getTotal()

  function handleCheckout() {
    if (!buyerName.trim()) {
      toast.error('Nama pembeli wajib diisi!')
      return
    }
    if (items.length === 0) {
      toast.error('Keranjang masih kosong!')
      return
    }

    const itemLines = items
      .map((item, idx) => {
        const price = item.discount_percent > 0
          ? Math.round(item.price * (1 - item.discount_percent / 100))
          : item.price
        const variants = [item.selected_color, item.selected_size].filter(Boolean).join(' | ')
        return [
          `${idx + 1}. ${item.product_name}`,
          variants ? `   ${variants}` : '',
          `   ${item.quantity} pcs × ${formatRupiah(price)} = ${formatRupiah(price * item.quantity)}`,
        ].filter(Boolean).join('\n')
      })
      .join('\n\n')

    const message = [
      'Halo Batik AN 🙏',
      '',
      'Saya ingin memesan:',
      itemLines,
      '',
      `*Total: ${formatRupiah(total)}*`,
      `Nama: ${buyerName}`,
      notes ? `Catatan: ${notes}` : '',
      '',
      'Mohon konfirmasi ketersediaan & info pengiriman. Terima kasih 🙏',
    ].filter(line => line !== undefined).join('\n')

    const phone = settings?.whatsapp_number || ''
    if (!phone) {
      toast.error('Nomor WhatsApp toko belum dikonfigurasi.')
      return
    }

    const waLink = generateWALink(phone, message)
    window.open(waLink, '_blank')
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: '#FFFFFF' }}>
          <ShoppingCart size={80} className="mb-6" style={{ color: 'rgba(201,168,76,0.4)' }} />
          <h1 className="font-playfair text-2xl font-bold mb-2" style={{ color: '#8B1A1A' }}>
            Keranjang Kosong
          </h1>
          <p className="text-gray-500 mb-8">Belum ada produk di keranjang Anda.</p>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded font-semibold transition-colors"
            style={{ backgroundColor: '#C5973A' }}
          >
            <ArrowLeft size={16} />
            Mulai Belanja
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto px-4 pt-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/produk"
              className="text-sm flex items-center gap-1 mb-3 hover:underline"
              style={{ color: '#6B3F2A' }}
            >
              <ArrowLeft size={14} /> Lanjut Belanja
            </Link>
            <h1 className="font-playfair text-3xl font-bold" style={{ color: '#8B1A1A' }}>
              Keranjang Belanja
            </h1>
            <div className="h-px w-24 mt-2" style={{ backgroundColor: '#C9A84C' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 rounded-lg border p-5" style={{ backgroundColor: '#FDFAF5', borderColor: 'rgba(201,168,76,0.2)' }}>
              {items.map(item => (
                <CartItem key={`${item.product_id}_${item.selected_color}_${item.selected_size}`} item={item} />
              ))}
            </div>

            {/* Checkout Panel */}
            <div className="space-y-4">
              {/* Summary */}
              <div className="rounded-lg border p-5" style={{ backgroundColor: '#FDFAF5', borderColor: 'rgba(201,168,76,0.2)' }}>
                <h2 className="font-playfair font-semibold mb-4" style={{ color: '#8B1A1A' }}>Ringkasan</h2>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} produk</span>
                  <span className="font-semibold">{formatRupiah(total)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span style={{ color: '#8B1A1A' }}>{formatRupiah(total)}</span>
                </div>
              </div>

              {/* Form */}
              <div className="rounded-lg border p-5" style={{ backgroundColor: '#FDFAF5', borderColor: 'rgba(201,168,76,0.2)' }}>
                <h2 className="font-playfair font-semibold mb-4" style={{ color: '#8B1A1A' }}>Data Pemesan</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Catatan tambahan untuk pesanan..."
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-lg font-bold text-base transition-colors shadow-lg"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={20} />
                Pesan via WhatsApp
              </button>

              <p className="text-xs text-gray-400 text-center">
                Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
