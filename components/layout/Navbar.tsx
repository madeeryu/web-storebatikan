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
        className="fixed top-0 left-0 right-0"
        style={{
          zIndex: 9999,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(197,151,58,0.15)' : '1px solid #E5E5E5',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
          isolation: 'isolate',
          transition: 'background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Garis emas tipis paling atas — mengecil saat scroll */}
        <div style={{
          height: scrolled ? '2px' : '3px',
          background: 'linear-gradient(90deg, #C5973A, #D4AE5A, #C5973A)',
          transition: 'height 0.4s ease',
        }} />

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            {/* Tinggi navbar mengecil saat scroll */}
            <div
              className="relative flex items-center"
              style={{
                height: scrolled ? '52px' : '64px',
                transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >

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

              {/* TENGAH — Logo mengecil saat scroll */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div
                  className="relative"
                  style={{
                    width: scrolled ? '36px' : '48px',
                    height: scrolled ? '36px' : '48px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
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
                  className="font-playfair font-semibold tracking-widest"
                  style={{
                    color: '#1A1A1A',
                    letterSpacing: '0.15em',
                    fontSize: scrolled ? '0' : '0.75rem',
                    opacity: scrolled ? 0 : 1,
                    marginTop: scrolled ? '0' : '2px',
                    transition: 'font-size 0.4s ease, opacity 0.3s ease, margin-top 0.4s ease',
                    overflow: 'hidden',
                  }}
                >
                  BATIK AN
                </span>
              </Link>

              {/* KANAN — Actions */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="navbar-icon-btn group relative p-1.5"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Cari"
                >
                  <span className="navbar-icon-bg" />
                  <Search size={18} className="relative z-10 transition-colors duration-200 group-hover:text-[#C5973A]" />
                  <span className="navbar-icon-tooltip">Cari</span>
                </button>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="navbar-icon-btn group relative p-1.5"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Wishlist"
                >
                  <span className="navbar-icon-bg" />
                  <Heart size={18} className="relative z-10 transition-colors duration-200 group-hover:text-[#C5973A]" />
                  <span className="navbar-icon-tooltip">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold z-20 shadow-md"
                      style={{ backgroundColor: '#DC2626', fontSize: '10px', border: '2px solid #FFFFFF' }}
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="navbar-icon-btn group relative p-1.5"
                  style={{ color: '#1A1A1A' }}
                  aria-label="Keranjang"
                >
                  <span className="navbar-icon-bg" />
                  <ShoppingCart size={18} className="relative z-10 transition-colors duration-200 group-hover:text-[#C5973A]" />
                  <span className="navbar-icon-tooltip">Keranjang</span>
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold z-20 shadow-md"
                      style={{ backgroundColor: '#8B1A1A', fontSize: '10px', border: '2px solid #FFFFFF' }}
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
            <div className="flex items-center gap-1">
              <Link href="/wishlist" className="relative p-2" style={{ color: '#1A1A1A' }} aria-label="Wishlist">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold leading-none shadow-md"
                    style={{ backgroundColor: '#DC2626', fontSize: '10px', border: '2px solid #FFFFFF' }}
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-2" style={{ color: '#1A1A1A' }} aria-label="Keranjang">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold leading-none shadow-md"
                    style={{ backgroundColor: '#8B1A1A', fontSize: '10px', border: '2px solid #FFFFFF' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
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
      {/* Spacer menyesuaikan tinggi navbar (garis emas 3px + navbar 64px) */}
      <div className="h-[67px] md:h-[71px]" />
    </>
  )
}
