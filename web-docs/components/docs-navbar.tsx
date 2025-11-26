"use client"

import { Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { constants } from "@/constants/global-constants"
import { useGitHubStars } from "@/hooks/use-github-api"
import { formatStarCount } from "@/modules/shared/utils"

const translations = {
  es: {
    home: "Inicio",
    github: "GitHub"
  },
  en: {
    home: "Home",
    github: "GitHub"
  }
}

export function DocsNavbar() {
  const [language, setLanguage] = useState<"es" | "en">("es")
  const { starCount, loading } = useGitHubStars(constants.github_owner, constants.github_repo)

  const t = translations[language]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-tiber border-b border-green-yellow/20">
      <div className="max-w-8xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-green-yellow text-tiber font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
              A
            </div>
            <span className="font-bold text-lg text-surf-crest group-hover:text-green-yellow transition-colors">
              AvangCLI
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-surf-crest hover:text-green-yellow transition-colors">
              {t.home}
            </Link>

            <div className="relative flex items-center gap-1 p-1 rounded-lg bg-tiber/40 border border-green-yellow/20 backdrop-blur-sm">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-linear-to-r from-green-yellow/40 to-green-yellow/20 rounded-md transition-all duration-300 ease-out ${
                  language === "es" ? "left-1" : "left-[calc(50%)]"
                }`}
              />

              <button
                onClick={() => setLanguage("es")}
                className={`relative z-10 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  language === "es"
                    ? "text-green-yellow scale-105"
                    : "text-surf-crest/50 hover:text-surf-crest/80 hover:scale-105"
                }`}
              >
                ES
              </button>

              <button
                onClick={() => setLanguage("en")}
                className={`relative z-10 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  language === "en"
                    ? "text-green-yellow scale-105"
                    : "text-surf-crest/50 hover:text-surf-crest/80 hover:scale-105"
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="https://github.com/avanglabs/avangcli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <Github className="w-5 h-5 text-surf-crest group-hover:text-green-yellow transition-colors" />
              <span className="text-sm font-medium text-surf-crest group-hover:text-green-yellow transition-colors">
                {loading || starCount === null ? (
                  <span className="w-6 h-4 bg-green-yellow/20 rounded animate-pulse inline-block"></span>
                ) : (
                  formatStarCount(starCount)
                )}
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
