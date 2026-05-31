import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import { getProductBySlug, getActivePromos, getFinalPrice } from '@/lib/firestore'
import { DetailProdukClient } from './DetailProdukClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) return { title: 'Produk tidak ditemukan — Batik AN' }

  return {
    title: `${product.name} — Batik AN`,
    description: product.description?.slice(0, 160) || `${product.name} dari Batik AN. Batik pilihan berkualitas tinggi.`,
    openGraph: {
      title: product.name,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export const revalidate = 60

export default async function DetailProdukPage({ params }: Props) {
  const { slug } = await params
  const [product, promos] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    getActivePromos().catch(() => []),
  ])

  if (!product) notFound()

  const { finalPrice, discountPercent } = getFinalPrice(product, promos)

  return (
    <>
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#FFFFFF' }}>
        <DetailProdukClient
          product={product}
          finalPrice={finalPrice}
          discountPercent={discountPercent}
        />
      </main>
      <Footer />
    </>
  )
}
