import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product, Category, Banner, Promo, Review, StoreSettings } from '@/types'

// ─── PRODUCTS ───────────────────────────────────────────

export async function getProducts(constraints: QueryConstraint[] = []) {
  const q = query(collection(db, 'products'), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), where('is_active', '==', true))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { id: d.id, ...d.data() } as Product
}

export async function getActiveProducts(limitCount = 8, lastDoc?: DocumentSnapshot) {
  const constraints: QueryConstraint[] = [
    where('is_active', '==', true),
    orderBy('created_at', 'desc'),
    limit(limitCount),
  ]
  if (lastDoc) constraints.push(startAfter(lastDoc))
  return getProducts(constraints)
}

export async function getNewArrivals(limitCount = 8): Promise<Product[]> {
  return getProducts([
    where('is_active', '==', true),
    orderBy('created_at', 'desc'),
    limit(limitCount),
  ])
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts([
    where('is_active', '==', true),
    where('is_featured', '==', true),
    orderBy('created_at', 'desc'),
  ])
}

export async function getProductsByCategory(categoryId: string, limitCount = 20): Promise<Product[]> {
  return getProducts([
    where('is_active', '==', true),
    where('category_id', '==', categoryId),
    orderBy('created_at', 'desc'),
    limit(limitCount),
  ])
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return []
  const promises = ids.map(id => getDoc(doc(db, 'products', id)))
  const docs = await Promise.all(promises)
  return docs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function addProduct(data: Omit<Product, 'id'>) {
  return addDoc(collection(db, 'products'), { ...data, created_at: Timestamp.now() })
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, 'products', id), data)
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, 'products', id))
}

// ─── CATEGORIES ─────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), where('is_active', '==', true), orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category))
}

export async function getAllCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(collection(db, 'categories'), where('slug', '==', slug))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { id: d.id, ...d.data() } as Category
}

export async function addCategory(data: Omit<Category, 'id'>) {
  return addDoc(collection(db, 'categories'), data)
}

export async function updateCategory(id: string, data: Partial<Category>) {
  return updateDoc(doc(db, 'categories', id), data)
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, 'categories', id))
}

// ─── BANNERS ────────────────────────────────────────────

export function subscribeBanners(callback: (banners: Banner[]) => void) {
  const q = query(collection(db, 'banners'), where('is_active', '==', true), orderBy('order', 'asc'))
  return onSnapshot(q, snapshot => {
    const banners = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner))
    callback(banners)
  })
}

export async function getBanners(): Promise<Banner[]> {
  const q = query(collection(db, 'banners'), where('is_active', '==', true), orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner))
}

export async function getAllBanners(): Promise<Banner[]> {
  const q = query(collection(db, 'banners'), orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner))
}

export async function addBanner(data: Omit<Banner, 'id'>) {
  return addDoc(collection(db, 'banners'), data)
}

export async function updateBanner(id: string, data: Partial<Banner>) {
  return updateDoc(doc(db, 'banners', id), data)
}

export async function deleteBanner(id: string) {
  return deleteDoc(doc(db, 'banners', id))
}

// ─── PROMOS ─────────────────────────────────────────────

export async function getActivePromos(): Promise<Promo[]> {
  const now = Timestamp.now()
  const q = query(
    collection(db, 'promos'),
    where('is_active', '==', true),
    where('start_date', '<=', now),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() } as Promo))
    .filter(p => p.end_date.toDate() >= now.toDate())
}

export async function getAllPromos(): Promise<Promo[]> {
  const snapshot = await getDocs(collection(db, 'promos'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Promo))
}

export async function addPromo(data: Omit<Promo, 'id'>) {
  return addDoc(collection(db, 'promos'), data)
}

export async function updatePromo(id: string, data: Partial<Promo>) {
  return updateDoc(doc(db, 'promos', id), data)
}

export async function deletePromo(id: string) {
  return deleteDoc(doc(db, 'promos', id))
}

// ─── REVIEWS ────────────────────────────────────────────

export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  const constraints: QueryConstraint[] = [where('is_approved', '==', true)]
  if (productId) constraints.push(where('product_id', '==', productId))
  constraints.push(orderBy('created_at', 'desc'))
  const q = query(collection(db, 'reviews'), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review))
}

export async function getLatestReviews(limitCount = 6): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('is_approved', '==', true),
    orderBy('created_at', 'desc'),
    limit(limitCount),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review))
}

export async function getPendingReviews(): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('is_approved', '==', false), orderBy('created_at', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review))
}

export async function addReview(data: Omit<Review, 'id'>) {
  return addDoc(collection(db, 'reviews'), { ...data, created_at: Timestamp.now() })
}

export async function updateReview(id: string, data: Partial<Review>) {
  return updateDoc(doc(db, 'reviews', id), data)
}

export async function deleteReview(id: string) {
  return deleteDoc(doc(db, 'reviews', id))
}

// ─── SETTINGS ───────────────────────────────────────────

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const d = await getDoc(doc(db, 'settings', 'config'))
  if (!d.exists()) return null
  return d.data() as StoreSettings
}

export async function updateStoreSettings(data: Partial<StoreSettings>) {
  return updateDoc(doc(db, 'settings', 'config'), data)
}

// ─── HELPERS ────────────────────────────────────────────

/** Hitung harga final setelah diskon terbesar (product vs promo) */
export function getFinalPrice(product: Product, promos: Promo[]): { finalPrice: number; discountPercent: number } {
  let best = product.discount_percent || 0

  for (const promo of promos) {
    if (promo.applies_to === 'all') {
      best = Math.max(best, promo.discount_percent)
    } else if (promo.applies_to === 'category' && promo.target_ids.includes(product.category_id)) {
      best = Math.max(best, promo.discount_percent)
    } else if (promo.applies_to === 'product' && promo.target_ids.includes(product.id)) {
      best = Math.max(best, promo.discount_percent)
    }
  }

  const finalPrice = best > 0 ? Math.round(product.price * (1 - best / 100)) : product.price
  return { finalPrice, discountPercent: best }
}
