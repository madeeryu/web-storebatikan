import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const shopLinks = [
  { href: '/', label: 'Home' },
  { href: '/produk', label: 'Katalog Produk' },
  { href: '/kategori', label: 'Kategori' },
  { href: '/produk?sort=diskon', label: 'Promo / Sale' },
]

const infoLinks = [
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/cara-pemesanan', label: 'Cara Pemesanan' },
  { href: '/pengiriman', label: 'Info Pengiriman' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
      {/* Garis emas atas */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #C5973A, #D4AE5A, #C5973A)' }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-playfair text-2xl font-bold mb-1" style={{ color: '#C5973A' }}>
              BATIK AN
            </h2>
            <p className="font-cormorant italic text-base mb-4" style={{ color: 'rgba(197,151,58,0.7)' }}>
              Warisan Budaya Modern
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Menghadirkan koleksi batik pilihan dengan sentuhan modern.
              Setiap helai kain mengandung cerita dan kekayaan budaya nusantara.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                style={{ backgroundColor: '#25D366' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} color="white" />
              </a>
              <a
                href="https://instagram.com/batikan"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white' }}
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          {/* Toko */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#C5973A' }}>
              Toko
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    <span className="footer-link-arrow">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#C5973A' }}>
              Informasi
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    <span className="footer-link-arrow">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
        >
          <p>© {year} Batik AN. Semua hak dilindungi.</p>
          <p className="font-cormorant italic" style={{ color: 'rgba(197,151,58,0.6)' }}>Warisan Budaya Modern</p>
        </div>
      </div>
    </footer>
  )
}
