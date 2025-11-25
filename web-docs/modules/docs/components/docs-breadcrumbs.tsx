"use client"

import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { cn } from "@/modules/shared/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DocsBreadcrumbsProps {
  cli: string
  category: string
  title: string
  locale: string
}

export function DocsBreadcrumbs({ cli, category, title, locale: _locale }: Readonly<DocsBreadcrumbsProps>) {
  const t = useTranslations()
  const tCategories = useTranslations("categories")
  const categoryLabel = (() => {
    const key = category.replace(/^\d+-/, "").replace(/-/g, "-")
    return tCategories(key) || category
  })()

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("nav.home"), href: `/` },
    { label: t("docs.title"), href: `/docs` },
    { label: categoryLabel, href: `/docs/${cli}/${category}` },
    { label: title }
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {!isFirst && <ChevronRight className="h-4 w-4 shrink-0" />}

              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-foreground transition-colors flex items-center gap-1.5",
                    isFirst && "font-medium"
                  )}
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast && "text-foreground font-medium")}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
