import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { constants } from "@/constants/global-constants"
import { DocsBreadcrumbs } from "@/modules/docs/components/docs-breadcrumbs"
import { DocsRightSidebar } from "@/modules/docs/components/docs-right-sidebar"
import { MarkdownContent } from "@/modules/docs/components/markdown-content"
import { getAllDocs, getCategoryTitle, getDocBySlug } from "@/modules/shared/docs"

interface DocPageProps {
  params: Promise<{
    locale: string
    cli: string
    category: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  const params: Array<{ locale: string; cli: string; category: string; slug: string }> = []

  for (const doc of docs) {
    params.push({
      locale: doc.lang,
      cli: doc.cli,
      category: doc.category,
      slug: doc.slug
    })
  }

  return params
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { locale, cli, category, slug } = await params
  const doc = getDocBySlug(cli, locale, category, slug)

  if (!doc) {
    return {
      title: "Not Found"
    }
  }

  const t = await getTranslations("clis")
  const cliLabel = t(cli === "frontend-cli" ? "frontend" : "backend")

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
    openGraph: {
      title: doc.metadata.title,
      description: doc.metadata.description || "",
      type: "article",
      locale: locale === "es" ? "es_ES" : "en_US"
    },
    alternates: {
      canonical: `/${locale}/docs/${cli}/${category}/${slug}`,
      languages: {
        en: `/en/docs/${cli}/${category}/${slug}`,
        es: `/es/docs/${cli}/${category}/${slug}`
      }
    },
    keywords: [doc.metadata.title, cliLabel, "documentation", "guide", "tutorial"]
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale, cli, category, slug } = await params
  const doc = getDocBySlug(cli, locale, category, slug)

  if (!doc) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const t = await getTranslations("clis")
  const cliLabel = t(cli === "frontend-cli" ? "frontend" : "backend")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.metadata.title,
    description: doc.metadata.description,
    author: {
      "@type": "Organization",
      name: "AvangCLI Team",
      url: constants.repository_url
    },
    publisher: {
      "@type": "Organization",
      name: "AvangCLI Team",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/avangcli2.svg`
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    inLanguage: locale,
    articleSection: await getCategoryTitle(category, locale),
    about: {
      "@type": "SoftwareApplication",
      name: cliLabel,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform"
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Documentation",
          item: `${baseUrl}/${locale}/docs`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: cliLabel,
          item: `${baseUrl}/${locale}/docs/${cli}`
        },
        {
          "@type": "ListItem",
          position: 4,
          name: await getCategoryTitle(category, locale)
        },
        {
          "@type": "ListItem",
          position: 5,
          name: doc.metadata.title,
          item: `${baseUrl}/${locale}/docs/${cli}/${category}/${slug}`
        }
      ]
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="flex-1 pr-8">
        <DocsBreadcrumbs cli={cli} category={category} title={doc.metadata.title} locale={locale} />

        <MarkdownContent content={doc.content} cli={cli} lang={locale} category={category} />

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </article>

      <DocsRightSidebar content={doc.content} />
    </>
  )
}
