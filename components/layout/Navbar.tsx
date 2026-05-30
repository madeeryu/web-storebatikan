'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/produk', label: 'Katalog Produk' },
  { href: '/kategori', label: 'Kategori' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const { wishlist } = useWishlist()
  const cartCount = getTotalItems()
  const wishlistCount = wishlist.length

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 bg-white"
        style={{
          zIndex: 9999,
          borderBottom: '1px solid #E5E5E5',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.3s ease',
          isolation: 'isolate',
          willChange: 'auto',
        }}
      >
        {/* Garis emas tipis paling atas */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #C5973A, #D4AE5A, #C5973A)' }} />

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative flex items-center h-16">

              {/* KIRI — Nav links */}
              <nav className="flex items-center gap-6 flex-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link text-sm font-medium${isActive(link.href) ? ' active' : ''}`}
                    style={{ color: isActive(link.href) ? '#C5973A' : '#1A1A1A' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* TENGAH — Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="relative w-12 h-12">
                  {!logoError ? (
                    <Image
                      src="/logo.png"
                      alt="Batik AN"
                      fill
                      sizes="48px"
                      loading="eager"
                      className="object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center"
                      style={{ border: '2px solid #C5973A' }}
                    >
                      <span className="font-playfair font-bold text-lg" style={{ color: '#C5973A' }}>AN</span>
                    </div>
                  )}
                </div>
                <span
                  className="font-playfair text-xs font-semibold tracking-widest mt-0.5"
                  style={{ color: '#1A1A1A', letterSpacing: '0.15em' }}
                >
                  BATIK AN
                </span>
              </Link>

              {/* KANAN — Actions */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1.5 rounded transition-colors hover:text-[#C5973A]"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Cari"
                >
                  <Search size={18} />
                </button>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative p-1.5 rounded transition-colors hover:text-[#C5973A]"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: '#C5973A', fontSize: '10px' }}
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-1.5 rounded transition-colors hover:text-[#C5973A]"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Keranjang"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: '#C5973A', fontSize: '10px' }}
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Search bar dropdown */}
          {searchOpen && (
            <div className="border-t" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
              <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="relative max-w-lg mx-auto">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cari produk batik..."
                    className="w-full pl-9 pr-4 py-2 text-sm border rounded outline-none"
                    style={{ borderColor: '#C5973A', borderRadius: '3px' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE NAVBAR */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5"
              style={{ color: '#1A1A1A' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo tengah mobile */}
            <Link href="/" className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
              <div className="relative w-9 h-9">
                {!logoError ? (
                  <Image
                    src="/logo.png"
                    alt="Batik AN"
                    fill
                    sizes="36px"
                    loading="eager"
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ border: '2px solid #C5973A' }}
                  >
                    <span className="font-playfair font-bold text-sm" style={{ color: '#C5973A' }}>AN</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Icons mobile */}
            <div className="flex items-center gap-2">
              <Link href="/wishlist" className="relative p-1.5" style={{ color: '#1A1A1A' }}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C5973A', fontSize: '10px' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-1.5" style={{ color: '#1A1A1A' }}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C5973A', fontSize: '10px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="border-t" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
              <nav className="flex flex-col py-2">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-5 py-3 text-sm font-medium border-b"
                    style={{
                      color: isActive(link.href) ? '#C5973A' : '#1A1A1A',
                      borderColor: '#F0F0F0',
                      backgroundColor: isActive(link.href) ? '#FDF8F0' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[67px] md:h-[71px]" />
    </>
  )
}
