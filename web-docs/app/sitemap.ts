import { MetadataRoute } from "next"
import { useLocale } from "next-intl"

import { getAllDocs } from "@/modules/shared/docs"

export default function sitemap(): MetadataRoute.Sitemap {
  const locale = useLocale()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://avangcli.vercel.app/${locale}`

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    }
  ]

  const docs = getAllDocs()
  const docPages: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${baseUrl}/${locale}/docs/${doc.cli}/${doc.lang}/${doc.category}/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8
  }))

  return [...staticPages, ...docPages]
}
