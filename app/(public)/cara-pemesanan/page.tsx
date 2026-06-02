'use client'

import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { Reveal } from '@/components/ui/Reveal'
import { Search, ShoppingCart, MessageCircle, CreditCard, Truck } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: 'Pilih Produk',
    desc: 'Jelajahi katalog, pilih batik favorit Anda lengkap dengan warna & ukuran.',
  },
  {
    icon: ShoppingCart,
    title: 'Beli / Keranjang',
    desc: 'Klik "Beli Sekarang" untuk langsung checkout, atau "Tambah ke Keranjang".',
  },
  {
    icon: MessageCircle,
    title: 'Chat via WhatsApp',
    desc: 'Pesanan otomatis terkirim ke WhatsApp admin untuk konfirmasi ketersediaan.',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran',
    desc: 'Admin info total & rekening. Lakukan pembayaran sesuai metode yang disepakati.',
  },
  {
    icon: Truck,
    title: 'Pengiriman',
    desc: 'Pesanan dikemas rapi dan dikirim ke alamat Anda melalui ekspedisi pilihan.',
  },
]

export default function CaraPemesananPage() {
  return (
    <>
      {/* Hero */}
      <div className="py-14 px-4 text-center border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
        <p className="font-inter text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#C5973A' }}>
          Panduan Belanja
        </p>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Cara Pemesanan
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
          <span style={{ color: '#C5973A' }}>✦</span>
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
        </div>
        <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
          Belanja batik di Batik AN sangat mudah. Ikuti 5 langkah berikut.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-14">
        {/* Stepper */}
        <Reveal>
          <div className="relative">
            {/* Garis penghubung horizontal (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5"
              style={{ background: 'linear-gradient(90deg, #C5973A, #8B1A1A)' }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-3 relative">
              {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  {/* Lingkaran ikon */}
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #8B1A1A, #A87C2A)' }}
                  >
                    <step.icon size={30} className="text-white" />
                    {/* Nomor langkah */}
                    <span
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold shadow"
                      style={{ color: '#8B1A1A', border: '2px solid #C5973A' }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-playfair font-bold text-base mb-1" style={{ color: '#8B1A1A' }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Catatan tambahan */}
        <Reveal delay={150}>
          <div
            className="mt-16 rounded-xl p-6 md:p-8"
            style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(197,151,58,0.25)' }}
          >
            <h2 className="font-playfair text-xl font-bold mb-4" style={{ color: '#8B1A1A' }}>
              Hal yang Perlu Diketahui
            </h2>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                'Stok produk dikonfirmasi langsung oleh admin saat Anda chat via WhatsApp.',
                'Ongkos kirim dihitung berdasarkan alamat tujuan dan ekspedisi yang dipilih.',
                'Pembayaran dilakukan setelah total (produk + ongkir) dikonfirmasi admin.',
                'Pesanan diproses dan dikirim setelah pembayaran diterima.',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: '#C5973A' }}>✦</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={250}>
          <div className="text-center mt-12">
            <Link
              href="/produk"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#8B1A1A' }}
            >
              Mulai Belanja Sekarang
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  )
}
