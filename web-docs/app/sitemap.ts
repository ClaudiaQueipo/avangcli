import { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { getAllDocs } from "@/modules/shared/docs"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://avangcli.vercel.app"
  const { locales } = routing

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${baseUrl}/${locale}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    }
  ])

  const docs = getAllDocs()
  const docPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    docs.map((doc) => ({
      url: `${baseUrl}/${locale}/docs/${doc.cli}/${doc.lang}/${doc.category}/${doc.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }))
  )

  return [...staticPages, ...docPages]
}
