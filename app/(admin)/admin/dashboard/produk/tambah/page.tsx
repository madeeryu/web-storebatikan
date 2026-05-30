'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TambahProdukPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/produk"
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft size={18} style={{ color: 'var(--color-maroon)' }} />
          </Link>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-maroon)' }}
            >
              Tambah Produk Baru
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Isi semua informasi produk di bawah ini</p>
          </div>
        </div>

        <ProductForm />
      </div>
    </AdminLayout>
  )
}
