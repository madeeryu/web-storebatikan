// ─── Batik AN — SEO & Metadata Helpers ──────────────────────────────────────
// Usage: import in page.tsx files for generateMetadata

import type { Metadata } from "next"

const BASE_URL = "https://storebatikan.vercel.app"
const STORE_NAME = "Batik AN"
const TAGLINE = "Warisan Budaya Modern"
const DEFAULT_DESCRIPTION =
  "Batik AN — Temukan koleksi batik eksklusif berkualitas tinggi dengan nuansa Jawa yang elegan. Belanja mudah, aman, dan langsung via WhatsApp."
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg` // upload manually to /public/

// ─── Base metadata (used in app/layout.tsx) ──────────────────────────────────

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${STORE_NAME} | ${TAGLINE}`,
    template: `%s — ${STORE_NAME} | ${TAGLINE}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "batik",
    "batik online",
    "batik modern",
    "kain batik",
    "batik jawa",
    "baju batik",
    "batik AN",
    "belanja batik",
    "batik eksklusif",
  ],
  authors: [{ name: "Batik AN" }],
  creator: "Batik AN",
  publisher: "Batik AN",
  verification: {
    google: "rvwrOZkWKHTToLUdfwOFY3Gz4LDXI18Cd3pHCBFjZu4",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: STORE_NAME,
    title: `${STORE_NAME} | ${TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} — ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | ${TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

// ─── Homepage metadata ────────────────────────────────────────────────────────

export const homepageMetadata: Metadata = {
  title: `${STORE_NAME} | ${TAGLINE}`,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: BASE_URL,
  },
}

// ─── Products page metadata ───────────────────────────────────────────────────

export const productsMetadata: Metadata = {
  title: "Semua Koleksi",
  description: `Jelajahi semua koleksi batik eksklusif di ${STORE_NAME}. Filter berdasarkan kategori, harga, dan promo terbaik.`,
  alternates: {
    canonical: `${BASE_URL}/produk`,
  },
  openGraph: {
    title: `Semua Koleksi — ${STORE_NAME}`,
    description: `Jelajahi koleksi batik lengkap di ${STORE_NAME}.`,
    url: `${BASE_URL}/produk`,
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
}

// ─── Product detail metadata (dynamic) ───────────────────────────────────────

export function generateProductMetadata({
  name,
  description,
  slug,
  image,
  price,
}: {
  name: string
  description: string
  slug: string
  image?: string
  price?: number
}): Metadata {
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const productUrl = `${BASE_URL}/produk/${slug}`
  const priceStr = price
    ? ` — Rp ${price.toLocaleString("id-ID")}`
    : ""

  return {
    title: name,
    description: `${description.slice(0, 155)}...`,
    alternates: { canonical: productUrl },
    openGraph: {
      type: "website",
      title: `${name}${priceStr} — ${STORE_NAME}`,
      description: description.slice(0, 155),
      url: productUrl,
      images: [{ url: ogImage, width: 800, height: 1067, alt: name }],
      siteName: STORE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${STORE_NAME}`,
      description: description.slice(0, 155),
      images: [ogImage],
    },
  }
}

// ─── Category page metadata (dynamic) ────────────────────────────────────────

export function generateCategoryMetadata({
  name,
  slug,
  image,
}: {
  name: string
  slug: string
  image?: string
}): Metadata {
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const categoryUrl = `${BASE_URL}/kategori/${slug}`

  return {
    title: `Koleksi ${name}`,
    description: `Temukan koleksi batik ${name} terbaik di ${STORE_NAME}. Pilihan motif elegan dengan kualitas premium.`,
    alternates: { canonical: categoryUrl },
    openGraph: {
      title: `Koleksi ${name} — ${STORE_NAME}`,
      description: `Batik ${name} eksklusif di ${STORE_NAME}.`,
      url: categoryUrl,
      images: [{ url: ogImage }],
    },
  }
}

// ─── Cart & Wishlist metadata ─────────────────────────────────────────────────

export const cartMetadata: Metadata = {
  title: "Keranjang Belanja",
  description: "Tinjau produk di keranjang belanja Anda dan lanjutkan ke checkout via WhatsApp.",
  robots: { index: false, follow: false },
}

export const wishlistMetadata: Metadata = {
  title: "Wishlist Saya",
  description: "Produk favorit yang Anda simpan di Batik AN.",
  robots: { index: false, follow: false },
}

// ─── Admin metadata (no-index) ───────────────────────────────────────────────

export const adminMetadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
}
