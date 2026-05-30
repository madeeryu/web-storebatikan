'use client'

// hooks/useAdminGuard.ts
// Gunakan hook ini di SETIAP halaman dashboard untuk proteksi client-side

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

/**
 * Hook yang redirect ke /admin jika belum login.
 * Panggil di awal setiap komponen halaman admin/dashboard.
 *
 * @example
 * export default function AdminDashboardPage() {
 *   const { user, loading } = useAdminGuard()
 *   if (loading) return <LoadingSpinner />
 *   ...
 * }
 */
export function useAdminGuard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin')
    }
  }, [user, loading, router])

  return { user, loading: loading || !user }
}
