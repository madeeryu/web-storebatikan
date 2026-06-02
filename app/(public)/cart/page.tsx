'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/cart/CartItem'
import { getStoreSettings } from '@/lib/firestore'
import { formatRupiah, generateWALink } from '@/lib/utils'
import type { StoreSettings } from '@/types'
import toast from 'react-hot-toast'

const ADDRESS_KEY = 'batikan-shipping-info'

export default function CartPage() {
  const { items, getTotal, clearCart } = useCart()
  const [buyerName, setBuyerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [zone, setZone] = useState('')
  const [notes, setNotes] = useState('')
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getStoreSettings().then(setSettings).catch(console.error)
    // Auto-isi dari data tersimpan di browser
    try {
      const saved = JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}')
      if (saved.buyerName) setBuyerName(saved.buyerName)
      if (saved.phone) setPhone(saved.phone)
      if (saved.address) setAddress(saved.address)
      if (saved.city) setCity(saved.city)
      if (saved.postalCode) setPostalCode(saved.postalCode)
    } catch {}
  }, [])

  // Simpan info pengiriman ke browser setiap berubah
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(
      ADDRESS_KEY,
      JSON.stringify({ buyerName, phone, address, city, postalCode })
    )
  }, [mounted, buyerName, phone, address, city, postalCode])

  if (!mounted) return null

  const total = getTotal()

  // Estimasi ongkir per zona
  const ZONES = [
    { key: 'jabodetabek', label: 'Jabodetabek' },
    { key: 'jawa', label: 'Pulau Jawa' },
    { key: 'bali_ntb', label: 'Bali & Nusa Tenggara' },
    { key: 'luar_jawa', label: 'Luar Jawa lainnya' },
  ] as const
  const rates = settings?.shipping_rates ?? {}
  const ongkir = zone ? Number((rates as any)[zone] || 0) : 0
  const grandTotal = total + ongkir

  function handleCheckout() {
    if (!buyerName.trim()) {
      toast.error('Nama pembeli wajib diisi!')
      return
    }
    if (!phone.trim()) {
      toast.error('Nomor HP wajib diisi!')
      return
    }
    if (!address.trim()) {
      toast.error('Alamat pengiriman wajib diisi!')
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

    const fullAddress = [address, city, postalCode].filter(Boolean).join(', ')

    const message = [
      'Halo Batik AN 🙏',
      '',
      'Saya ingin memesan:',
      itemLines,
      '',
      `Subtotal: ${formatRupiah(total)}`,
      zone ? `Estimasi ongkir (${ZONES.find(z => z.key === zone)?.label}): ${formatRupiah(ongkir)}` : '',
      `*Estimasi Total: ${formatRupiah(grandTotal)}*`,
      '',
      '*Data Pengiriman:*',
      `Nama: ${buyerName}`,
      `No. HP: ${phone}`,
      `Alamat: ${fullAddress}`,
      notes ? `Catatan: ${notes}` : '',
      '',
      'Mohon konfirmasi ketersediaan & total ongkir final. Terima kasih 🙏',
    ].filter(line => line !== undefined).join('\n')

    const storePhone = settings?.whatsapp_number || ''
    if (!storePhone) {
      toast.error('Nomor WhatsApp toko belum dikonfigurasi.')
      return
    }

    const waLink = generateWALink(storePhone, message)
    window.open(waLink, '_blank')
  }

  if (items.length === 0) {
    return (
      <>
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

                {/* Pilih wilayah untuk estimasi ongkir */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Estimasi Ongkir — Wilayah</label>
                  <select
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-sm bg-white focus:outline-none"
                    style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                  >
                    <option value="">Pilih wilayah...</option>
                    {ZONES.map(z => (
                      <option key={z.key} value={z.key}>{z.label}</option>
                    ))}
                  </select>
                </div>

                {zone && (
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-gray-500">Estimasi ongkir</span>
                    <span className="font-semibold">{ongkir > 0 ? formatRupiah(ongkir) : 'Hubungi admin'}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between font-bold">
                  <span>{zone ? 'Estimasi Total' : 'Total'}</span>
                  <span style={{ color: '#8B1A1A' }}>{formatRupiah(grandTotal)}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  *Ongkir bersifat estimasi. Total final dikonfirmasi admin via WhatsApp.
                </p>
              </div>

              {/* Form */}
              <div className="rounded-lg border p-5" style={{ backgroundColor: '#FDFAF5', borderColor: 'rgba(201,168,76,0.2)' }}>
                <h2 className="font-playfair font-semibold mb-1" style={{ color: '#8B1A1A' }}>Data Pengiriman</h2>
                <p className="text-xs text-gray-400 mb-4">Data disimpan di perangkat ini untuk memudahkan pemesanan berikutnya.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Jalan, RT/RW, kelurahan, kecamatan..."
                      rows={2}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Kota/Kabupaten"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                        style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="00000"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                        style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Catatan tambahan untuk pesanan..."
                      rows={2}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
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
