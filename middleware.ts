// middleware.ts — proteksi semua route /admin/dashboard/*
// File ini diletakkan di ROOT project (sejajar dengan app/)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Hanya proteksi route dashboard, bukan halaman login (/admin)
  if (pathname.startsWith('/admin/dashboard')) {
    // Cek token Firebase di cookie
    // Firebase Auth menyimpan token di cookie dengan prefix '__session' atau 'firebase-auth-token'
    // Untuk client-side Firebase Auth, kita cek keberadaan cookie autentikasi
    const authCookie = request.cookies.get('firebase-auth-token')
      ?? request.cookies.get('__session')

    if (!authCookie) {
      // Redirect ke halaman login admin
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}

// ─────────────────────────────────────────────────────────────
// CATATAN IMPLEMENTASI:
//
// Firebase Auth secara default menggunakan localStorage (bukan cookie),
// sehingga middleware Next.js tidak bisa langsung membaca token-nya.
//
// Solusi yang direkomendasikan:
// 1. Setelah signIn berhasil, simpan token ke cookie:
//
//    import { getIdToken } from 'firebase/auth'
//    const token = await getIdToken(user)
//    document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`
//
// 2. Atau gunakan pendekatan alternatif: proteksi di level komponen
//    menggunakan hook useAuth (lihat hooks/useAuth.ts) yang redirect
//    ke /admin jika tidak ada user.
//
// Implementasi proteksi di komponen (alternatif lebih sederhana):
// Tambahkan di setiap halaman dashboard:
//
//    const { user, loading } = useAuth()
//    const router = useRouter()
//    useEffect(() => {
//      if (!loading && !user) router.replace('/admin')
//    }, [user, loading, router])
// ─────────────────────────────────────────────────────────────
