// ─── lib/pagination.ts ────────────────────────────────────────────────────────
// Firestore cursor-based pagination helper

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"

const PAGE_SIZE = 8

export interface PaginationResult<T> {
  items: T[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

// ─── Fetch first page of products ────────────────────────────────────────────

export async function fetchProductsPage({
  categoryId,
  sortBy = "newest",
  minPrice,
  maxPrice,
  pageSize = PAGE_SIZE,
}: {
  categoryId?: string
  sortBy?: "newest" | "price_asc" | "price_desc" | "discount"
  minPrice?: number
  maxPrice?: number
  pageSize?: number
} = {}): Promise<PaginationResult<Product>> {
  let q: Query = collection(db, "products")

  // Base filter
  const filters = [where("is_active", "==", true)]

  if (categoryId) {
    filters.push(where("category_id", "==", categoryId))
  }

  // Sort
  let sortField = "created_at"
  let sortDir: "asc" | "desc" = "desc"

  if (sortBy === "price_asc") {
    sortField = "price"
    sortDir = "asc"
  } else if (sortBy === "price_desc") {
    sortField = "price"
    sortDir = "desc"
  } else if (sortBy === "discount") {
    sortField = "discount_percent"
    sortDir = "desc"
  }

  q = query(
    collection(db, "products"),
    ...filters,
    orderBy(sortField, sortDir),
    limit(pageSize + 1) // fetch one extra to know if there's more
  )

  const snapshot = await getDocs(q)
  const docs = snapshot.docs

  const hasMore = docs.length > pageSize
  const items = (hasMore ? docs.slice(0, pageSize) : docs).map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Product[]

  // Client-side price filter (Firestore doesn't support range on non-indexed field easily)
  const filtered = items.filter((p) => {
    const finalPrice = p.price * (1 - (p.discount_percent ?? 0) / 100)
    if (minPrice !== undefined && finalPrice < minPrice) return false
    if (maxPrice !== undefined && finalPrice > maxPrice) return false
    return true
  })

  return {
    items: filtered,
    lastDoc: hasMore ? docs[pageSize - 1] : null,
    hasMore,
  }
}

// ─── Fetch next page (load more) ──────────────────────────────────────────────

export async function fetchNextProductsPage({
  lastDoc,
  categoryId,
  sortBy = "newest",
  minPrice,
  maxPrice,
  pageSize = PAGE_SIZE,
}: {
  lastDoc: QueryDocumentSnapshot<DocumentData>
  categoryId?: string
  sortBy?: "newest" | "price_asc" | "price_desc" | "discount"
  minPrice?: number
  maxPrice?: number
  pageSize?: number
}): Promise<PaginationResult<Product>> {
  const filters = [where("is_active", "==", true)]

  if (categoryId) {
    filters.push(where("category_id", "==", categoryId))
  }

  let sortField = "created_at"
  let sortDir: "asc" | "desc" = "desc"

  if (sortBy === "price_asc") { sortField = "price"; sortDir = "asc" }
  else if (sortBy === "price_desc") { sortField = "price"; sortDir = "desc" }
  else if (sortBy === "discount") { sortField = "discount_percent"; sortDir = "desc" }

  const q = query(
    collection(db, "products"),
    ...filters,
    orderBy(sortField, sortDir),
    startAfter(lastDoc),
    limit(pageSize + 1)
  )

  const snapshot = await getDocs(q)
  const docs = snapshot.docs

  const hasMore = docs.length > pageSize
  const items = (hasMore ? docs.slice(0, pageSize) : docs).map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Product[]

  const filtered = items.filter((p) => {
    const finalPrice = p.price * (1 - (p.discount_percent ?? 0) / 100)
    if (minPrice !== undefined && finalPrice < minPrice) return false
    if (maxPrice !== undefined && finalPrice > maxPrice) return false
    return true
  })

  return {
    items: filtered,
    lastDoc: hasMore ? docs[pageSize - 1] : null,
    hasMore,
  }
}
