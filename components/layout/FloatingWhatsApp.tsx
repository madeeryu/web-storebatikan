'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { getStoreSettings } from '@/lib/firestore'
import { generateWALink } from '@/lib/utils'

export default function FloatingWhatsApp() {
  const [phone, setPhone] = useState('')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getStoreSettings()
      .then((s) => { if (s?.whatsapp_number) setPhone(s.whatsapp_number) })
      .catch(() => {})
  }, [])

  if (!mounted || !phone) return null

  const waLink = generateWALink(
    phone,
    'Halo Batik AN 🙏\nSaya ingin bertanya tentang produk batik.'
  )

  return (
    <div className="fixed bottom-5 right-5 z-[9998] flex flex-col items-end gap-3">
      {/* Kartu sapaan */}
      {open && (
        <div
          className="bg-white rounded-2xl shadow-2xl border w-64 overflow-hidden animate-fade-in"
          style={{ borderColor: 'rgba(197,151,58,0.3)' }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#25D366' }}>
            <div className="flex items-center gap-2 text-white">
              <MessageCircle size={18} />
              <span className="font-semibold text-sm">Chat Admin</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              Halo! 👋 Ada yang bisa kami bantu? Klik tombol di bawah untuk chat langsung via WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-white text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              Mulai Chat
            </a>
          </div>
        </div>
      )}

      {/* Tombol bulat */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat WhatsApp"
      >
        {open ? <X size={26} color="white" /> : <MessageCircle size={26} color="white" />}
      </button>
    </div>
  )
}
