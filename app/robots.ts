// ─── app/robots.ts ───────────────────────────────────────────────────────────
// Next.js 14 App Router — robots.txt auto-generated

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin/*"],
      },
    ],
    sitemap: "https://storebatikan.vercel.app/sitemap.xml",
    host: "https://storebatikan.vercel.app",
  }
}
