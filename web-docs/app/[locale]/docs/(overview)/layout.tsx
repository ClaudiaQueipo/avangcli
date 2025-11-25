import { DocsNavbar } from "@/modules/docs/components/docs-navbar-intl"
import { DocSection, DocsSidebar } from "@/modules/docs/components/docs-sidebar"
import { getAllCategories, getCategoryTitle, getDocsByCategory } from "@/modules/shared/docs"

interface DocsLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const { locale } = await params
  const defaultCli = "frontend-cli"

  const sections: DocSection[] = await Promise.all(
    getAllCategories(defaultCli, locale).map(async (category) => {
      const docs = getDocsByCategory(defaultCli, locale, category)
      return {
        title: await getCategoryTitle(category, locale),
        items: docs.map((doc) => ({
          title: doc.metadata.title,
          href: `/${locale}/docs/${defaultCli}/${category}/${doc.slug}`
        }))
      }
    })
  )

  return (
    <div className="min-h-screen">
      <DocsNavbar />
      <div className="flex pt-20">
        <DocsSidebar sections={sections} currentCli={defaultCli} currentLang={locale} locale={locale} />
        <main className="flex-1 py-8 px-6">{children}</main>
      </div>
    </div>
  )
}
