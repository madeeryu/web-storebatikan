"use client"

import { Skeleton } from "@/components/ui/skeleton"

// ─── ProductCard Skeleton ───────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#FDFAF5] border border-[#C9A84C]/20">
      {/* Image area - portrait 3:4 */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      </div>
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 items-center pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  )
}

// Grid of product card skeletons
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Product Detail Skeleton ────────────────────────────────────────────────

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <div className="space-y-3">
          <Skeleton className="w-full aspect-[3/4] rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-3/5" />
          </div>

          {/* Rating */}
          <div className="flex gap-1 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full" />
            ))}
            <Skeleton className="h-4 w-24 ml-2" />
          </div>

          {/* Price */}
          <div className="flex gap-3 items-center">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-14 rounded-md" />
              ))}
            </div>
          </div>

          {/* Qty + Buttons */}
          <Skeleton className="h-11 w-32 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-[#C9A84C]/20">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Admin Table Skeleton ───────────────────────────────────────────────────

export function AdminTableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="px-4 py-4 border-b border-gray-100 grid gap-4 items-center"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="flex items-center gap-2">
              {colIdx === 0 && <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />}
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Admin Dashboard Stat Skeleton ─────────────────────────────────────────

export function AdminStatSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-5 border border-gray-200 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}
