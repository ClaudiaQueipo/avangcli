import { notFound } from "next/navigation"

import { DocsNavbar } from "@/modules/docs/components/docs-navbar-intl"
import { DocSection, DocsSidebar } from "@/modules/docs/components/docs-sidebar"
import { getAllCategories, getAllCLIs, getCategoryTitle, getDocsByCategory } from "@/modules/shared/docs"

interface DocsCliLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
    cli: string
  }>
}

export async function generateStaticParams() {
  const clis = getAllCLIs()
  const locales = ["en", "es"]
  const params: Array<{ locale: string; cli: string }> = []

  for (const locale of locales) {
    for (const cli of clis) {
      params.push({ locale, cli })
    }
  }

  return params
}

export default async function DocsCliLayout({ children, params }: DocsCliLayoutProps) {
  const { locale, cli } = await params

  const clis = getAllCLIs()
  if (!clis.includes(cli)) {
    notFound()
  }

  const categories = getAllCategories(cli, locale)
  const sections: DocSection[] = await Promise.all(
    categories.map(async (category) => {
      const docs = getDocsByCategory(cli, locale, category)

      return {
        title: await getCategoryTitle(category, locale),
        items: docs.map((doc) => ({
          title: doc.metadata.title,
          href: `/${locale}/docs/${cli}/${category}/${doc.slug}`
        }))
      }
    })
  )

  return (
    <div className="min-h-screen">
      <DocsNavbar />
      <div className="flex pt-20">
        <DocsSidebar sections={sections} currentCli={cli} currentLang={locale} locale={locale} />
        <main className="flex-1 py-8 px-6 pr-80">{children}</main>
      </div>
    </div>
  )
}
