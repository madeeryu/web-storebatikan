import { redirect } from 'next/navigation'

// /kategori tanpa slug → redirect ke /produk
export default function KategoriIndexPage() {
  redirect('/produk')
}
