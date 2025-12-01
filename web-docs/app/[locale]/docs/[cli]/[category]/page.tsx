import { ArrowRight, FileText } from "lucide-react"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { getAllCategories, getAllCLIs, getCategoryTitle, getDocsByCategory } from "@/modules/shared/docs"

interface CategoryPageProps {
  params: Promise<{
    locale: string
    cli: string
    category: string
  }>
}

export async function generateStaticParams() {
  const clis = getAllCLIs()
  const locales = ["en", "es"]
  const params: Array<{ locale: string; cli: string; category: string }> = []

  for (const locale of locales) {
    for (const cli of clis) {
      const categories = getAllCategories(cli, locale)
      for (const category of categories) {
        params.push({ locale, cli, category })
      }
    }
  }

  return params
}

export default async function CategoryPage({ params }: Readonly<CategoryPageProps>) {
  const { locale, cli, category } = await params
  const t = await getTranslations("docs")

  const clis = getAllCLIs()
  if (!clis.includes(cli)) {
    notFound()
  }

  const categories = getAllCategories(cli, locale)
  if (!categories.includes(category)) {
    notFound()
  }

  const docs = getDocsByCategory(cli, locale, category)
  const categoryTitle = await getCategoryTitle(category, locale)

  if (docs.length === 0) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{categoryTitle}</h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Link key={doc.slug} href={`/docs/${cli}/${category}/${doc.slug}`} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                </div>
                <CardTitle className="text-xl">{doc.metadata.title}</CardTitle>
                <CardDescription className="line-clamp-3">{doc.metadata.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
