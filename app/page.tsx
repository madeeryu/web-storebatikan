import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center bg-batik-pattern"
        style={{ backgroundColor: '#F5EFE0' }}
      >
        <div className="text-center px-6 py-20">
          {/* Logo placeholder */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #A8882E)',
              boxShadow: '0 4px 20px rgba(201, 168, 76, 0.3)',
            }}
          >
            <span
              className="font-playfair text-3xl font-bold"
              style={{ color: '#8B1A1A' }}
            >
              AN
            </span>
          </div>

          <h1
            className="font-playfair text-5xl font-bold mb-3"
            style={{ color: '#8B1A1A' }}
          >
            Batik AN
          </h1>

          <p
            className="font-cormorant italic text-2xl mb-8"
            style={{ color: '#6B3F2A' }}
          >
            Warisan Budaya Modern
          </p>

          {/* Ornamen divider */}
          <div className="ornamen-divider max-w-xs mx-auto mb-8">
            <span style={{ color: '#C9A84C', fontSize: '1.2rem' }}>✦</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: 'rgba(139, 26, 26, 0.08)',
              color: '#8B1A1A',
              border: '1px solid rgba(139, 26, 26, 0.2)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Step 1 Selesai ✓ — Siap lanjut ke Step 2
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
