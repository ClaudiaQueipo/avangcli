"use client"

import { ChevronRight, Terminal } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/modules/shared/utils"

export interface DocSection {
  title: string
  items: DocItem[]
}

export interface DocItem {
  title: string
  href: string
}

interface DocsSidebarProps {
  sections: DocSection[]
  currentCli?: string
  currentLang?: string
  locale: string
}

export function DocsSidebar({ sections, currentCli = "frontend-cli", currentLang = "en", locale }: DocsSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map((s) => s.title))

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleCliChange = (newCli: string) => {
    // TODO: Navigate to the first category and document of the new CLI with the same language
    router.push(`/${locale}/docs/${newCli}/${currentLang}`)
  }

  return (
    <nav className="w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
        <div className="space-y-6">
          {/* NOTE: CLI Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" />
              CLI Tool
            </label>
            <Select value={currentCli} onValueChange={handleCliChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend-cli">Frontend CLI</SelectItem>
                <SelectItem disabled value="backend-cli">
                  Backend CLI (Soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-6 space-y-6">
            {sections.map((section) => {
              const isExpanded = expandedSections.includes(section.title)

              return (
                <div key={section.title}>
                  <button
                    aria-label={section.title}
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between text-sm font-semibold text-foreground mb-2 hover:text-primary transition-colors"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                  </button>

                  {isExpanded && (
                    <ul className="space-y-1 ml-2">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "block py-1.5 px-3 text-sm rounded-md transition-colors",
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              )}
                            >
                              {item.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
