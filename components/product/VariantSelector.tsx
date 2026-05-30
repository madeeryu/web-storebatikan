'use client'

interface VariantSelectorProps {
  colors: { name: string; hex_code: string; images?: string[] }[]
  sizes: string[]
  selectedColor: string
  selectedSize: string
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
}

export function VariantSelector({
  colors,
  sizes,
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
            {colors.map(color => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                title={color.name}
                className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                  selectedColor === color.name
                    ? 'ring-2 ring-offset-2 ring-[var(--color-maroon)] scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex_code }}
              />
            ))}
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
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-4 py-1.5 border rounded text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-[var(--color-maroon)] text-white border-[var(--color-maroon)]'
                    : 'border-gray-300 text-gray-600 hover:border-[var(--color-maroon)] hover:text-[var(--color-maroon)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
