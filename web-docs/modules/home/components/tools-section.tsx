"use client"

import { Icon } from "@iconify/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Download, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

import { constants } from "@/constants/global-constants"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface LogoPlaceholderProps {
  text: string
  icon: string
}

const EXTENSIONS_REPO_URL = {
  vscode_download: constants.vscode_extension_download,
  vscode_extension: constants.vscode_extension_url,
  jetbrains_download: constants.jetbrains_extension_download,
  jetbrains_extension: constants.jetbrains_extension_url
}

export function ToolsSection() {
  const t = useTranslations("home.tools")
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 30 })

      gsap.to(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })

      if (gridRef.current) {
        const bentoGrid = gridRef.current.querySelector(".grid")
        if (bentoGrid) {
          const cards = Array.from(bentoGrid.children)
          gsap.set(cards, {
            opacity: 0,
            y: 60,
            scale: 0.95
          })

          gsap.to(cards, {
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: {
              amount: 0.3,
              from: "start"
            },
            duration: 0.8,
            ease: "back.out(1.2)"
          })
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleVSCodeClick = (origin: string) => {
    if (origin === "market") {
      window.open(EXTENSIONS_REPO_URL.vscode_extension, "_blank")
    } else {
      window.open(EXTENSIONS_REPO_URL.vscode_download, "_blank")
    }
  }

  const handleJetBrainsClick = (origin: string) => {
    if (origin === "market") {
      window.open(EXTENSIONS_REPO_URL.jetbrains_extension, "_blank")
    } else {
      window.open(EXTENSIONS_REPO_URL.jetbrains_download, "_blank")
    }
  }

  return (
    <section ref={sectionRef} className="px-4 py-24 max-w-7xl mx-auto bg-[#161616]" id="tools">
      <div ref={headerRef} className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          {t("title")}{" "}
          <span className="text-[#BBF451] italic font-serif drop-shadow-[0_0_25px_rgba(132,204,22,0.4)]">
            {t("titleHighlight")}
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">{t("description")}</p>
      </div>

      <div ref={gridRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="h-full flex items-center justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/10 w-full border border-white/5 p-8 rounded-2xl shadow-lg bg-[#1a1a1a]">
            <div className="flex-1 max-w-lg relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <LogoPlaceholder text="" icon="simple-icons:visualstudiocode" />
                <h3 className="text-2xl md:text-xl font-bold text-white">{t("vscode.title")}</h3>
              </div>
              <p className="text-gray-400 mb-8 text-base leading-relaxed">{t("vscode.description")}</p>

              <div className="space-y-3 mb-8">
                {(t.raw("vscode.features") as string[]).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#BBF451]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleVSCodeClick("download")}
                  className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 group transform hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  {t("install")}
                </button>

                <button
                  onClick={() => handleVSCodeClick("market")}
                  className="px-8 py-4 rounded-full border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black font-semibold border transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  {t("marketplace")}
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-64 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <div className="absolute top-8 right-8 w-16 h-16 bg-[#007ACC] rounded-full blur-xl"></div>
              <div className="absolute top-20 right-12 w-12 h-12 bg-[#BBF451] rounded-full blur-lg"></div>
              <div className="absolute top-32 right-6 w-8 h-8 bg-white rounded-full blur-md"></div>
            </div>
          </div>

          <div className="h-full flex items-center justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/10 w-full border border-white/5 p-8 rounded-2xl shadow-lg bg-[#1a1a1a]">
            <div className="flex-1 max-w-lg relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <LogoPlaceholder text="" icon="simple-icons:jetbrains" />
                <h3 className="text-2xl md:text-xl font-bold text-white">{t("jetbrains.title")}</h3>
              </div>
              <p className="text-gray-400 mb-8 text-base leading-relaxed">{t("jetbrains.description")}</p>

              <div className="space-y-3 mb-8">
                {(t.raw("jetbrains.features") as string[]).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#BBF451]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleJetBrainsClick("download")}
                  className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 group transform hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  {t("install")}
                </button>

                <button
                  onClick={() => handleJetBrainsClick("market")}
                  className="px-8 py-4 rounded-full border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black font-semibold border transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  {t("marketplace")}
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-64 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <div className="absolute top-8 right-8 w-16 h-16 bg-[#007ACC] rounded-full blur-xl"></div>
              <div className="absolute top-20 right-12 w-12 h-12 bg-[#BBF451] rounded-full blur-lg"></div>
              <div className="absolute top-32 right-6 w-8 h-8 bg-white rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const LogoPlaceholder = ({ text, icon }: LogoPlaceholderProps) => (
  <div className="flex items-center gap-2 text-xl font-bold text-lime-400 select-none hover:text-lime-300 transition-colors">
    <Icon icon={icon} width="28" height="28" />
    <span className="text-white">{text}</span>
  </div>
)
