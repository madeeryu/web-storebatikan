'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product } from '@/types'
import AdminLayout from '@/components/layout/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProdukPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() } as Product)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

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
              Edit Produk
            </h1>
            {product && (
              <p className="text-xs text-stone-400 mt-0.5">{product.name}</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : notFound ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-stone-500 mb-3">Produk tidak ditemukan</p>
            <Link
              href="/admin/dashboard/produk"
              className="text-sm text-[#8B1A1A] hover:underline"
            >
              Kembali ke daftar produk
            </Link>
          </div>
        ) : product ? (
          <ProductForm initialData={product} productId={id} />
        ) : null}
      </div>
    </AdminLayout>
  )
}
