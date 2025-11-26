"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { cn } from "@/lib/utils"

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
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map((s) => s.title))

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <nav className="w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
        <div className="space-y-6">
          {sections.map((section) => {
            const isExpanded = expandedSections.includes(section.title)

            return (
              <div key={section.title}>
                <button
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
    </nav>
  )
}
