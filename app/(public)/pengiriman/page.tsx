'use client'

import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { Reveal } from '@/components/ui/Reveal'
import { Truck, PackageCheck, Clock, MapPin, ShieldCheck } from 'lucide-react'

const COURIERS = ['JNE', 'J&T', 'SiCepat', 'POS', 'AnterAja', 'Ninja']

const POINTS = [
  { icon: MapPin, title: 'Jangkauan Nasional', desc: 'Pengiriman ke seluruh wilayah Indonesia melalui ekspedisi terpercaya.' },
  { icon: Clock, title: 'Estimasi 2–5 Hari', desc: 'Estimasi tiba 2–5 hari kerja tergantung kota tujuan dan ekspedisi.' },
  { icon: PackageCheck, title: 'Dikemas Aman', desc: 'Setiap pesanan dikemas rapi dan aman agar batik sampai dalam kondisi prima.' },
  { icon: ShieldCheck, title: 'Nomor Resi', desc: 'Anda akan menerima nomor resi untuk melacak paket setelah dikirim.' },
]

export default function PengirimanPage() {
  return (
    <>
      {/* Hero */}
      <div className="py-14 px-4 text-center border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
        <p className="font-inter text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#C5973A' }}>
          Layanan Pengiriman
        </p>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Info Pengiriman
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
          <span style={{ color: '#C5973A' }}>✦</span>
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-14 space-y-14">
        {/* Poin layanan */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POINTS.map((p) => (
              <div
                key={p.title}
                className="text-center p-5 rounded-xl border transition-shadow hover:shadow-md"
                style={{ borderColor: 'rgba(197,151,58,0.25)' }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8B1A1A, #A87C2A)' }}
                >
                  <p.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Ekspedisi */}
        <Reveal delay={120}>
          <div className="text-center">
            <h2 className="font-playfair text-xl font-bold mb-5" style={{ color: '#8B1A1A' }}>
              Ekspedisi Rekanan
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {COURIERS.map((c) => (
                <span
                  key={c}
                  className="px-5 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(197,151,58,0.3)', color: '#6B3F2A' }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Detail ongkir & proses */}
        <Reveal delay={200}>
          <div
            className="rounded-xl p-6 md:p-8"
            style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(197,151,58,0.25)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Truck size={22} style={{ color: '#C5973A' }} />
              <h2 className="font-playfair text-xl font-bold" style={{ color: '#8B1A1A' }}>
                Ketentuan Ongkos Kirim
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                'Ongkos kirim dihitung berdasarkan berat/volume pesanan dan alamat tujuan.',
                'Total ongkir akan diinformasikan admin saat konfirmasi pesanan via WhatsApp.',
                'Anda bebas memilih ekspedisi yang tersedia sesuai preferensi.',
                'Pesanan diproses & dikirim 1×24 jam setelah pembayaran dikonfirmasi (hari kerja).',
                'Nomor resi diberikan setelah paket diserahkan ke ekspedisi.',
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
        <Reveal delay={280}>
          <div className="text-center">
            <Link
              href="/cara-pemesanan"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#8B1A1A' }}
            >
              Lihat Cara Pemesanan
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  )
}
