import { DocsSidebar, DocSection } from '@/components/docs-sidebar'
import { DocsNavbar } from '@/components/docs-navbar'
import { getAllCategories, getDocsByCategory, getCategoryTitle } from '@/lib/docs'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Build sidebar sections from file system
  const categories = getAllCategories()
  const sections: DocSection[] = categories.map((category) => {
    const docs = getDocsByCategory(category)

    return {
      title: getCategoryTitle(category),
      items: docs.map((doc) => ({
        title: doc.metadata.title,
        href: `/docs/${category}/${doc.slug}`,
      })),
    }
  })

  return (
    <div className="min-h-screen">
      <DocsNavbar />
      <div className="flex pt-20">
        <DocsSidebar sections={sections} />
        <main className="flex-1 py-8 px-6 pr-80">
          {children}
        </main>
      </div>
    </div>
  )
}
