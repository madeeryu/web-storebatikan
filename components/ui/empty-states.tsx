"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, PackageOpen, Plus, Star, Image as ImageIcon } from "lucide-react"

// ─── Shared wrapper ─────────────────────────────────────────────────────────

function EmptyContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {children}
    </div>
  )
}

// ─── SVG Illustrations ──────────────────────────────────────────────────────

function BatchIconProduct() {
  return (
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-[#F5EFE0] flex items-center justify-center border-2 border-dashed border-[#C9A84C]/40">
        <PackageOpen className="w-10 h-10 text-[#C9A84C]" />
      </div>
      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#8B1A1A]/10 flex items-center justify-center">
        <span className="text-[#8B1A1A] text-xs font-bold">?</span>
      </div>
    </div>
  )
}

// ─── Empty Products ─────────────────────────────────────────────────────────

export function EmptyProducts() {
  return (
    <EmptyContainer>
      <BatchIconProduct />
      <h3 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-2">
        Koleksi Segera Hadir
      </h3>
      <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
        Kami sedang menyiapkan koleksi batik terbaik untuk Anda. Kunjungi kembali sebentar lagi.
      </p>
      {/* Batik ornament */}
      <div className="flex items-center gap-2 text-[#C9A84C]/60 mb-6">
        <span className="text-2xl">❈</span>
        <div className="h-px w-12 bg-[#C9A84C]/30" />
        <span className="text-2xl">❈</span>
      </div>
      <Button asChild className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white px-8">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </EmptyContainer>
  )
}

// ─── Empty Filtered Products ─────────────────────────────────────────────────

export function EmptyFilteredProducts({ onReset }: { onReset: () => void }) {
  return (
    <EmptyContainer>
      <div className="w-24 h-24 rounded-full bg-[#F5EFE0] flex items-center justify-center mb-6 border-2 border-dashed border-[#C9A84C]/40">
        <ShoppingBag className="w-10 h-10 text-[#C9A84C]" />
      </div>
      <h3 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-2">
        Produk Tidak Ditemukan
      </h3>
      <p className="text-gray-500 max-w-xs mb-6">
        Tidak ada produk yang sesuai dengan filter yang Anda pilih.
      </p>
      <Button
        variant="outline"
        onClick={onReset}
        className="border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white"
      >
        Reset Filter
      </Button>
    </EmptyContainer>
  )
}

// ─── Empty Wishlist ──────────────────────────────────────────────────────────

export function EmptyWishlist() {
  return (
    <EmptyContainer>
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#F5EFE0] flex items-center justify-center border-2 border-dashed border-[#C9A84C]/40">
          <Heart className="w-10 h-10 text-[#C9A84C]" />
        </div>
      </div>
      <h3 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-2">
        Wishlist Anda Kosong
      </h3>
      <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
        Simpan produk favorit Anda dengan menekan ikon ♡ di setiap produk agar mudah ditemukan kembali.
      </p>
      <Button asChild className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white px-8">
        <Link href="/produk">Jelajahi Produk</Link>
      </Button>
    </EmptyContainer>
  )
}

// ─── Empty Cart ──────────────────────────────────────────────────────────────

export function EmptyCart() {
  return (
    <EmptyContainer>
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#F5EFE0] flex items-center justify-center border-2 border-dashed border-[#C9A84C]/40">
          <ShoppingBag className="w-10 h-10 text-[#C9A84C]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#8B1A1A] flex items-center justify-center">
          <span className="text-white text-base font-bold leading-none">0</span>
        </div>
      </div>
      <h3 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-2">
        Keranjang Anda Kosong
      </h3>
      <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
        Belum ada produk di keranjang Anda. Temukan koleksi batik pilihan dan mulai belanja sekarang.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button asChild className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white px-8">
          <Link href="/produk">Mulai Belanja</Link>
        </Button>
        <Button asChild variant="outline" className="border-[#C9A84C] text-[#6B3F2A]">
          <Link href="/wishlist">Lihat Wishlist</Link>
        </Button>
      </div>
    </EmptyContainer>
  )
}

// ─── Admin Empty States ──────────────────────────────────────────────────────

interface AdminEmptyProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: AdminEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
        {icon ?? <PackageOpen className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Specific admin empty states
export const EmptyProductTable = ({ onAdd }: { onAdd?: () => void }) => (
  <AdminEmptyState
    icon={<PackageOpen className="w-8 h-8 text-[#8B1A1A]/40" />}
    title="Belum Ada Produk"
    description="Mulai tambah produk pertama Anda. Produk yang ditambahkan akan tampil di toko Anda."
    actionLabel="Tambah Produk Pertama"
    onAction={onAdd}
  />
)

export const EmptyBannerTable = ({ onAdd }: { onAdd?: () => void }) => (
  <AdminEmptyState
    icon={<ImageIcon className="w-8 h-8 text-[#8B1A1A]/40" />}
    title="Belum Ada Banner"
    description="Tambah banner untuk hero slider di homepage. Gunakan ukuran 1920×700px untuk tampilan optimal."
    actionLabel="Tambah Banner"
    onAction={onAdd}
  />
)

export const EmptyReviewTable = () => (
  <AdminEmptyState
    icon={<Star className="w-8 h-8 text-[#8B1A1A]/40" />}
    title="Tidak Ada Review"
    description="Belum ada review yang masuk untuk ditampilkan di sini."
  />
)
