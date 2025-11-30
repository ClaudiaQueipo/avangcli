"use client"

import { Command, FileText, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { getCliLabel, getLangLabel } from "@/modules/shared/docs-utils"

interface SearchResult {
  cli: string
  lang: string
  category: string
  slug: string
  title: string
  description?: string
}

export function DocsSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const _locale = useLocale()
  const t = useTranslations("categories")

  useEffect(() => {
    if (!search || search.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const groupedDocs = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}

    for (const doc of results) {
      const cliLabel = getCliLabel(doc.cli)
      const langLabel = getLangLabel(doc.lang)
      const key = `${cliLabel} - ${langLabel}`

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(doc)
    }

    return groups
  }, [results])

  // NOTE: Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (cli: string, lang: string, category: string, slug: string) => {
    setOpen(false)
    setSearch("")
    router.push(`/${lang}/docs/${cli}/${category}/${slug}`)
  }

  return (
    <>
      {/* NOTE: Search trigger button */}
      <button
        aria-label="Search in documentation"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full max-w-sm px-3 py-2 text-sm text-muted-foreground bg-background border rounded-md hover:border-primary/50 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* NOTE: Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." value={search} onValueChange={setSearch} />
        <CommandList>
          {loading && <div className="py-6 text-center text-sm text-muted-foreground">Searching...</div>}

          {!loading && search.length >= 2 && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

          {!loading && search.length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          )}

          {!loading &&
            Object.entries(groupedDocs).map(([groupName, docs]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {docs.map((doc) => (
                  <CommandItem
                    key={`${doc.cli}-${doc.lang}-${doc.category}-${doc.slug}`}
                    value={doc.title}
                    onSelect={() => handleSelect(doc.cli, doc.lang, doc.category, doc.slug)}
                    className="cursor-pointer"
                  >
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-medium truncate">{doc.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {(() => {
                          const key = doc.category.replace(/^\d+-/, "").replace(/-/g, "-")
                          return t(key) || doc.category
                        })()}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
