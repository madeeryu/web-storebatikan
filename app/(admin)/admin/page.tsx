'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Jika sudah login → langsung ke dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/dashboard')
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/admin/dashboard')
    } catch {
      setError('Email atau password salah. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C5973A' }} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#F5EFE0' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C5973A, #A87C2A)', boxShadow: '0 4px 20px rgba(197,151,58,0.3)' }}
          >
            <span className="font-playfair text-2xl font-bold text-white">AN</span>
          </div>
          <h1 className="font-playfair text-2xl font-bold mb-1" style={{ color: '#1A1A1A' }}>
            Batik AN
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>Admin Panel</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12" style={{ backgroundColor: '#C5973A' }} />
            <span style={{ color: '#C5973A' }}>✦</span>
            <div className="h-px w-12" style={{ backgroundColor: '#C5973A' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: 'rgba(197,151,58,0.2)' }}>
          <h2 className="font-semibold text-lg mb-6 text-center" style={{ color: '#1A1A1A' }}>
            Masuk ke Dashboard
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@batikan.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-all"
                  style={{ borderColor: '#E5E5E5' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none transition-all"
                  style={{ borderColor: '#E5E5E5' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-70 mt-2"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(0,0,0,0.35)' }}>
          © {new Date().getFullYear()} Batik AN — Admin Only
        </p>
      </div>
    </div>
  )
}
