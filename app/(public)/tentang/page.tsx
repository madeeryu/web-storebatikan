'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { getStoreSettings } from '@/lib/firestore'
import { Sparkles, Target, Award, Users, MessageCircle } from 'lucide-react'
import type { StoreSettings } from '@/types'

const VALUES = [
  { icon: Award, title: 'Kualitas Premium', desc: 'Bahan pilihan dan jahitan rapi untuk kenyamanan maksimal.' },
  { icon: Users, title: 'Perajin Lokal', desc: 'Mendukung perajin batik nusantara yang berpengalaman.' },
  { icon: Sparkles, title: 'Motif Autentik', desc: 'Motif khas dengan sentuhan modern yang elegan.' },
  { icon: Target, title: 'Harga Jujur', desc: 'Harga wajar dengan kualitas yang sepadan.' },
]

export default function TentangPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const storeName = settings?.store_name || 'Batik AN'
  const tagline = settings?.tagline || 'Warisan Budaya Modern'
  const story = settings?.about_story
  const vision = settings?.about_vision
  const mission = settings?.about_mission?.split('\n').map((m) => m.trim()).filter(Boolean) ?? []

  return (
    <>
      {/* Hero */}
      <div className="py-16 px-4 text-center border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
        <p className="font-inter text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#C5973A' }}>
          {tagline}
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
          Tentang {storeName}
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
          <span style={{ color: '#C5973A' }}>✦</span>
          <div className="h-px w-16" style={{ backgroundColor: '#C5973A' }} />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-14 space-y-16">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Memuat...</div>
        ) : (
          <>
            {/* Cerita Kami */}
            <section>
              <h2 className="font-playfair text-2xl font-bold mb-4 text-center" style={{ color: '#8B1A1A' }}>
                Cerita Kami
              </h2>
              <div className="text-gray-600 leading-relaxed text-center whitespace-pre-line max-w-2xl mx-auto">
                {story || `${storeName} hadir untuk menghadirkan koleksi batik pilihan dengan sentuhan modern, melestarikan warisan budaya nusantara dalam setiap helai kain.`}
              </div>
            </section>

            {/* Nilai/Keunggulan */}
            <section>
              <h2 className="font-playfair text-2xl font-bold mb-8 text-center" style={{ color: '#8B1A1A' }}>
                Mengapa Memilih Kami
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {VALUES.map((v) => (
                  <div
                    key={v.title}
                    className="text-center p-5 rounded-xl border transition-shadow hover:shadow-md"
                    style={{ borderColor: 'rgba(197,151,58,0.25)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(197,151,58,0.12)' }}
                    >
                      <v.icon size={22} style={{ color: '#C5973A' }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Visi & Misi */}
            {(vision || mission.length > 0) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vision && (
                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(197,151,58,0.2)' }}>
                    <h3 className="font-playfair text-xl font-bold mb-3" style={{ color: '#8B1A1A' }}>Visi</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vision}</p>
                  </div>
                )}
                {mission.length > 0 && (
                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(197,151,58,0.2)' }}>
                    <h3 className="font-playfair text-xl font-bold mb-3" style={{ color: '#8B1A1A' }}>Misi</h3>
                    <ul className="space-y-2">
                      {mission.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                          <span style={{ color: '#C5973A' }}>✦</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* CTA */}
            <section className="text-center pt-4">
              <h2 className="font-playfair text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                Temukan Koleksi Kami
              </h2>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href="/produk"
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#8B1A1A' }}
                >
                  Jelajahi Produk
                </Link>
                {settings?.whatsapp_number && (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={16} /> Chat Kami
                  </a>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
