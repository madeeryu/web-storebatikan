import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Batik AN — Warisan Budaya Modern',
    template: '%s — Batik AN | Warisan Budaya Modern',
  },
  description:
    'Toko batik online terpercaya. Koleksi batik tulis, batik cap, dan batik modern pilihan dengan kualitas premium dari perajin terbaik nusantara.',
  keywords: ['batik', 'batik tulis', 'batik cap', 'kain batik', 'baju batik', 'batik AN'],
  openGraph: {
    title: 'Batik AN — Warisan Budaya Modern',
    description: 'Koleksi batik premium dari perajin terbaik nusantara.',
    url: 'https://storebatikan.vercel.app',
    siteName: 'Batik AN',
    locale: 'id_ID',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body
        className="antialiased min-h-screen"
        style={{ backgroundColor: '#FFFFFF', color: '#1A1A1A' }}
      >
        {/* Navbar di LUAR PageTransition agar position:fixed tidak rusak */}
        <Navbar />

        <PageTransition>
          {children}
        </PageTransition>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#1A1A1A',
              border: '1px solid rgba(197,151,58,0.4)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#C5973A', secondary: '#FFFFFF' } },
            error:   { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
          }}
        />
      </body>
    </html>
  )
}
