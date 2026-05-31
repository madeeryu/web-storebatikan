'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCategories } from '@/lib/firestore'
import { formatRupiah } from '@/lib/utils'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Category } from '@/types'

interface FilterState {
  categories: string[]
  minPrice: number
  maxPrice: number
  sort: string
}

const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-asc', label: 'Harga: Terendah' },
  { value: 'harga-desc', label: 'Harga: Tertinggi' },
  { value: 'diskon', label: 'Diskon Terbesar' },
]

const MAX_PRICE = 5_000_000

export function ProductFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  const [filter, setFilter] = useState<FilterState>({
    categories: params.get('kategori')?.split(',').filter(Boolean) ?? [],
    minPrice: Number(params.get('min')) || 0,
    maxPrice: Number(params.get('max')) || MAX_PRICE,
    sort: params.get('sort') || 'terbaru',
  })

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  function applyFilter(f: FilterState) {
    const p = new URLSearchParams()
    if (f.categories.length) p.set('kategori', f.categories.join(','))
    if (f.minPrice > 0) p.set('min', String(f.minPrice))
    if (f.maxPrice < MAX_PRICE) p.set('max', String(f.maxPrice))
    if (f.sort !== 'terbaru') p.set('sort', f.sort)
    p.set('halaman', '1')
    router.push(`?${p.toString()}`, { scroll: false })
  }

  function toggleCategory(slug: string) {
    const updated = filter.categories.includes(slug)
      ? filter.categories.filter(c => c !== slug)
      : [...filter.categories, slug]
    const next = { ...filter, categories: updated }
    setFilter(next)
    applyFilter(next)
  }

  function resetFilter() {
    const next: FilterState = { categories: [], minPrice: 0, maxPrice: MAX_PRICE, sort: 'terbaru' }
    setFilter(next)
    router.push('?', { scroll: false })
  }

  const hasActiveFilter =
    filter.categories.length > 0 || filter.minPrice > 0 || filter.maxPrice < MAX_PRICE || filter.sort !== 'terbaru'

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Urutkan</h3>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                const next = { ...filter, sort: opt.value }
                setFilter(next)
                applyFilter(next)
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filter.sort === opt.value
                  ? 'bg-[var(--color-maroon)] text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kategori */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Kategori</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filter.categories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="accent-[var(--color-maroon)] w-4 h-4"
                />
                <span className="text-sm text-gray-600 group-hover:text-[var(--color-maroon)] transition-colors">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Harga */}
      <div>
        <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Harga</h3>
        <div className="space-y-3">
          <div className="flex gap-2 text-xs text-gray-500">
            <span>{formatRupiah(filter.minPrice)}</span>
            <span className="ml-auto">{formatRupiah(filter.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={50000}
            value={filter.maxPrice}
            onChange={e => {
              const next = { ...filter, maxPrice: Number(e.target.value) }
              setFilter(next)
            }}
            onMouseUp={() => applyFilter(filter)}
            onTouchEnd={() => applyFilter(filter)}
            className="w-full accent-[var(--color-maroon)]"
          />
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilter && (
        <button
          onClick={resetFilter}
          className="w-full py-2 border border-[var(--color-maroon)] text-[var(--color-maroon)] text-sm rounded hover:bg-[var(--color-maroon)] hover:text-white transition-colors"
        >
          Reset Filter
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop filter bar — horizontal memanjang */}
      <aside className="hidden md:block w-full mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[var(--color-maroon)] flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filter
            </h2>
            {hasActiveFilter && (
              <button onClick={resetFilter} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                <X size={12} /> Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urutkan */}
            <div>
              <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Urutkan</h3>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const next = { ...filter, sort: opt.value }
                      setFilter(next)
                      applyFilter(next)
                    }}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      filter.sort === opt.value
                        ? 'bg-[var(--color-maroon)] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori */}
            {categories.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Kategori</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filter.categories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="accent-[var(--color-maroon)] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[var(--color-maroon)] transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Harga */}
            <div>
              <h3 className="font-semibold text-[var(--color-charcoal)] mb-3 text-sm uppercase tracking-wide">Harga</h3>
              <div className="space-y-2">
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{formatRupiah(filter.minPrice)}</span>
                  <span className="ml-auto">{formatRupiah(filter.maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={50000}
                  value={filter.maxPrice}
                  onChange={e => {
                    const next = { ...filter, maxPrice: Number(e.target.value) }
                    setFilter(next)
                  }}
                  onMouseUp={() => applyFilter(filter)}
                  onTouchEnd={() => applyFilter(filter)}
                  className="w-full accent-[var(--color-maroon)]"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile: Tombol filter + Drawer */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-maroon)] text-[var(--color-maroon)] rounded text-sm"
        >
          <SlidersHorizontal size={16} />
          Filter & Urutkan
          {hasActiveFilter && (
            <span className="bg-[var(--color-maroon)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-[var(--color-maroon)]">Filter</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  )
}
