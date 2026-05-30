// proxy.ts — Next.js 16 proxy (previously middleware)
// Auth protection is handled client-side in AdminLayout via useAuth hook.
// Firebase Auth uses localStorage (not cookies), so server-side cookie
// checking won't work without additional setup.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Pass all requests through — auth guard is in AdminLayout (client-side)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
