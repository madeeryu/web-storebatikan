'use client'

import { formatRupiah } from '@/lib/utils'

interface VariantSelectorProps {
  colors: { name: string; hex_code: string; images?: string[] }[]
  sizes: string[]
  sizePrices?: Record<string, number>
  selectedColor: string
  selectedSize: string
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
}

export function VariantSelector({
  colors,
  sizes,
  sizePrices = {},
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Pilih Warna */}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">
            Warna
            {selectedColor && (
              <span className="ml-2 font-normal text-gray-500 capitalize">— {selectedColor}</span>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(color => {
              const thumb = color.images?.[0]
              const isSelected = selectedColor === color.name
              return (
                <button
                  key={color.name}
                  onClick={() => onColorChange(color.name)}
                  title={color.name}
                  className={`flex items-center gap-2 pr-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'border-[var(--color-maroon)] text-[var(--color-maroon)] bg-[var(--color-maroon)]/5'
                      : 'border-gray-300 text-gray-600 hover:border-[var(--color-maroon)]'
                  }`}
                  style={!thumb ? undefined : {}}
                >
                  {/* Thumbnail foto warna (fallback ke lingkaran hex) */}
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={color.name}
                      className="w-9 h-9 rounded-l-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <span
                      className="w-9 h-9 rounded-l-lg flex-shrink-0"
                      style={{ backgroundColor: color.hex_code }}
                    />
                  )}
                  <span className="text-sm font-medium pl-1 py-1.5">{color.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Pilih Ukuran */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">
            Ukuran
            {selectedSize && (
              <span className="ml-2 font-normal text-gray-500">— {selectedSize}</span>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(size => {
              const sp = sizePrices[size]
              return (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`px-4 py-1.5 border rounded text-sm font-medium transition-all duration-200 flex flex-col items-center leading-tight ${
                    selectedSize === size
                      ? 'bg-[var(--color-maroon)] text-white border-[var(--color-maroon)]'
                      : 'border-gray-300 text-gray-600 hover:border-[var(--color-maroon)] hover:text-[var(--color-maroon)]'
                  }`}
                >
                  <span>{size}</span>
                  {sp ? (
                    <span className={`text-[10px] ${selectedSize === size ? 'text-white/80' : 'text-[var(--color-gold)]'}`}>
                      {formatRupiah(sp)}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
