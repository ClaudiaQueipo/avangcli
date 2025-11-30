"use client"

import { Check, ChevronDown, Star } from "lucide-react"
import { useLocale } from "next-intl"
import { useEffect, useRef, useState } from "react"

import { constants } from "@/constants/global-constants"
import { useGitHubStars } from "@/hooks/use-github-api"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import Logo from "@/modules/home/components/logo"
import { formatStarCount } from "@/modules/shared/utils"

import { DocsSearch } from "./docs-search"

export function DocsNavbar() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { starCount, loading: loadingStars } = useGitHubStars(constants.github_owner, constants.github_repo)

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLanguageChange = (newLang: "es" | "en") => {
    setIsOpen(false)
    router.replace(pathname, { locale: newLang })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const languages = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" }
  ] as const

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-tiber border-b border-green-yellow/20">
      <div className="max-w-8xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex relative justify-start">
              <Logo className="w-15 h-8"></Logo>
              <span className="text-2xl font-bold tracking-wide text-white absolute left-8 ">vangCLI</span>
            </div>
          </Link>

          <div className="flex-1 max-w-md">
            <DocsSearch />
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                aria-label="select language"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
                  isOpen
                    ? "bg-tiber border-green-yellow text-green-yellow shadow-[0_0_10px_rgba(173,255,47,0.2)]"
                    : "bg-tiber/40 border-green-yellow/20 text-surf-crest hover:text-green-yellow hover:border-green-yellow/50"
                }`}
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-32 bg-tiber border border-green-yellow/20 rounded-lg shadow-xl overflow-hidden backdrop-blur-md transition-all duration-200 origin-top z-50 ${
                  isOpen ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 -translate-y-2 scale-95 invisible"
                }`}
              >
                <div className="p-1 flex flex-col gap-0.5">
                  {languages.map((lang) => {
                    const isActive = locale === lang.code
                    return (
                      <button
                        aria-label={lang.code}
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-green-yellow/10 text-green-yellow"
                            : "text-surf-crest/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {lang.label}
                        {isActive && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <a
              href={constants.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <svg
                className="w-5 h-5 fill-green-yellow text-surf-crest group-hover:text-green-yellow transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>

              {loadingStars || starCount === null ? (
                <span className="w-6 h-4 bg-lime-400/20 rounded animate-pulse"></span>
              ) : (
                formatStarCount(starCount)
              )}
              <Star className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
