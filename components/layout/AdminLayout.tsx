'use client'

// components/layout/AdminLayout.tsx
// Versi yang sudah include auth guard built-in
// Ganti/merge dengan AdminLayout dari Step 3A

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, Tag, Image as ImageIcon,
  Percent, Star, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/dashboard/produk', icon: Package },
  { label: 'Kategori', href: '/admin/dashboard/kategori', icon: Tag },
  { label: 'Banner', href: '/admin/dashboard/banner', icon: ImageIcon },
  { label: 'Promo & Diskon', href: '/admin/dashboard/promo', icon: Percent },
  { label: 'Review', href: '/admin/dashboard/review', icon: Star },
  { label: 'Pengaturan', href: '/admin/dashboard/pengaturan', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

function NavLink({ item, onClose }: { item: typeof navItems[0]; onClose?: () => void }) {
  const pathname = usePathname()
  // exact match untuk dashboard, prefix match untuk lainnya
  const isActive =
    item.href === '/admin/dashboard'
      ? pathname === '/admin/dashboard'
      : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-[#8B1A1A] text-white'
          : 'text-gray-600 hover:bg-red-50 hover:text-[#8B1A1A]'
      )}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  )
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/admin')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="font-bold text-[#8B1A1A] text-lg">Batik AN</p>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* Footer: user + logout */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 truncate mb-2">{user?.email}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F5EFE0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:ml-60">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <Sidebar onClose={() => {}} />
              </SheetContent>
            </Sheet>

            <h1 className="text-sm font-semibold text-[#1C1C1C]">{title}</h1>
          </div>

          <span className="text-xs text-gray-400 hidden sm:block">{user.email}</span>
        </header>

        {/* Konten */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
