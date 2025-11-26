"use client"

import { useEffect, useState } from "react"

import { cn } from "@/modules/shared/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface DocsRightSidebarProps {
  content: string
}

export function DocsRightSidebar({ content }: DocsRightSidebarProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState<string>("")

  useEffect(() => {
    const lines = content.split("\n")
    const extractedHeadings: Heading[] = []

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (trimmed.startsWith("##") && !trimmed.startsWith("###")) {
        // NOTE: H2 heading
        const text = trimmed.replace(/^#+\s*/, "")
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()

        if (text) {
          extractedHeadings.push({
            id,
            text,
            level: 2
          })
        }
      } else if (trimmed.startsWith("###") && !trimmed.startsWith("####")) {
        // NOTE: H3 heading
        const text = trimmed.replace(/^#+\s*/, "")
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()

        if (text) {
          extractedHeadings.push({
            id,
            text,
            level: 3
          })
        }
      }
    })

    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean)

      let current = ""
      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            current = element.id
          } else {
            break
          }
        }
      }

      setActiveHeading(current)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // NOTE: Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // NOTE: Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="fixed right-0 top-20 w-72 h-[calc(100vh-5rem)] border-l border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto py-6 px-4 z-10">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-4">Content</h3>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "block w-full text-left py-1 px-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeHeading === heading.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
