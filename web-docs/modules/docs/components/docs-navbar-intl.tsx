"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { constants } from "@/constants/global-constants"
import { Link, usePathname, useRouter } from "@/i18n/routing"

import { DocsSearch } from "./docs-search"

export function DocsNavbar() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [stars, setStars] = useState<string>("0")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(constants.repository_url)
        const data = await response.json()

        const count = data.stargazers_count || 0
        if (count >= 1000) {
          setStars(`${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`)
        } else {
          setStars(count.toString())
        }
      } catch {
        setStars("0")
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [])

  const handleLanguageChange = (newLang: "es" | "en") => {
    router.replace(pathname, { locale: newLang })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-tiber border-b border-green-yellow/20">
      <div className="max-w-8xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* NOTE: Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-green-yellow text-tiber font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
              A
            </div>
            <span className="font-bold text-lg text-surf-crest group-hover:text-green-yellow transition-colors">
              AvangCLI
            </span>
          </Link>

          {/* NOTE: Search Bar */}
          <div className="flex-1 max-w-md">
            <DocsSearch />
          </div>

          {/* NOTE: Right Section */}
          <div className="flex items-center gap-6 shrink-0">
            {/* NOTE: Home Link */}
            <Link href="/" className="text-sm font-medium text-surf-crest hover:text-green-yellow transition-colors">
              {t("home")}
            </Link>

            {/* NOTE: Language Selector */}
            <div className="relative flex items-center gap-1 p-1 rounded-lg bg-tiber/40 border border-green-yellow/20 backdrop-blur-sm">
              {/* NOTE: Sliding background indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-linear-to-r from-green-yellow/40 to-green-yellow/20 rounded-md transition-all duration-300 ease-out ${
                  locale === "es" ? "left-1" : "left-[calc(50%)]"
                }`}
              />

              <button
                onClick={() => handleLanguageChange("es")}
                className={`relative z-10 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  locale === "es"
                    ? "text-green-yellow scale-105"
                    : "text-surf-crest/50 hover:text-surf-crest/80 hover:scale-105"
                }`}
              >
                ES
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className={`relative z-10 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  locale === "en"
                    ? "text-green-yellow scale-105"
                    : "text-surf-crest/50 hover:text-surf-crest/80 hover:scale-105"
                }`}
              >
                EN
              </button>
            </div>

            {/* NOTE: GitHub Link */}
            <a
              href={constants.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <svg
                className="w-5 h-5 text-surf-crest group-hover:text-green-yellow transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-medium text-surf-crest group-hover:text-green-yellow transition-colors">
                {loading ? "..." : stars}
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
