import { getTranslations } from "next-intl/server"

import { DocsOverviewIntl } from "@/modules/docs/components/docs-overview-intl"
import { getAllCategories, getAllCLIs, getCategoryTitle, getDocsByCategory } from "@/modules/shared/docs"

export default async function DocsOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("clis")
  const clis = getAllCLIs()

  const cliData = await Promise.all(
    clis.map(async (cli) => {
      const categories = getAllCategories(cli, locale)
      const cliTitle = t(cli === "frontend-cli" ? "frontend" : "backend")

      return {
        cli,
        cliTitle,
        categories: await Promise.all(
          categories.map(async (category) => {
            const docs = getDocsByCategory(cli, locale, category)
            return {
              name: category,
              title: await getCategoryTitle(category, locale),
              docs: docs.map((doc) => ({
                slug: doc.slug,
                title: doc.metadata.title,
                description: doc.metadata.description
              }))
            }
          })
        )
      }
    })
  )

  return <DocsOverviewIntl cliData={cliData} />
}
