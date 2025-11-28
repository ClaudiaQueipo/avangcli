"use client"

import { ArrowRight, Terminal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"

interface Category {
  name: string
  title: string
  docs: Array<{
    slug: string
    title: string
    description?: string
  }>
}

interface CLIData {
  cli: string
  cliTitle: string
  categories: Category[]
}

interface DocsOverviewIntlProps {
  cliData: CLIData[]
}

export function DocsOverviewIntl({ cliData }: DocsOverviewIntlProps) {
  const t = useTranslations("docs")
  const _locale = useLocale()

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </div>

      {cliData.map(({ cli, cliTitle, categories }) => (
        <section key={cli} className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Terminal className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">{cliTitle}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const [firstDoc] = category.docs
              if (!firstDoc) return null

              return (
                <Link key={category.name} href={`/docs/${cli}/${category.name}/${firstDoc.slug}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {category.title}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </CardTitle>
                      <CardDescription>{`${firstDoc.description}...`}</CardDescription>
                      <div className="pt-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {category.docs.slice(0, 3).map((doc) => (
                            <li key={doc.slug} className="flex items-center">
                              <span className="mr-2">•</span>
                              {doc.title}
                            </li>
                          ))}
                          {category.docs.length > 3 && (
                            <li className="text-xs italic">
                              +{category.docs.length - 3} {t("more")}
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
