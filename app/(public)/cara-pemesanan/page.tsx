import Footer from '@/components/layout/Footer'

export default function Page() {
  return (
    <>
      <main className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center px-6">
          <p className="font-playfair text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            Segera Hadir
          </p>
          <p className="text-sm" style={{ color: '#888888' }}>
            Halaman ini sedang dalam pengerjaan.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
