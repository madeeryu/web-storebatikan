// ─── app/sitemap.ts ───────────────────────────────────────────────────────────
// Next.js 14 App Router — dynamic sitemap.xml
import type { MetadataRoute } from "next"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

const BASE_URL = "https://storebatikan.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/produk`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kategori`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cara-pemesanan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pengiriman`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // ── Dynamic: Products ──────────────────────────────────────────────────────
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const productsQuery = query(
      collection(db, "products"),
      where("is_active", "==", true)
    )
    const snapshot = await getDocs(productsQuery)
    productRoutes = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        url: `${BASE_URL}/produk/${data.slug}`,
        lastModified: data.created_at?.toDate?.() ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }
    })
  } catch (err) {
    console.error("Sitemap: failed to fetch products", err)
  }

  // ── Dynamic: Categories ────────────────────────────────────────────────────
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categoriesQuery = query(
      collection(db, "categories"),
      where("is_active", "==", true)
    )
    const snapshot = await getDocs(categoriesQuery)
    categoryRoutes = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        url: `${BASE_URL}/kategori/${data.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    })
  } catch (err) {
    console.error("Sitemap: failed to fetch categories", err)
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
