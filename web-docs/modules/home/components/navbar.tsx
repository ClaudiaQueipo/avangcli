"use client"

import { Icon } from "@iconify/react"
import gsap from "gsap"
import { BookOpen, Check, ChevronDown, Github, Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import React, { useEffect, useRef, useState } from "react"

import { constants } from "@/constants/global-constants"
import { useGitHubStars } from "@/hooks/use-github-api"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { formatStarCount } from "@/modules/shared/utils"

import Logo from "./logo"

const GITHUB_REPO_URL = constants.repository_url

const Navbar = () => {
  const locale = useLocale()
  const t = useTranslations("nav")
  const router = useRouter()
  const pathname = usePathname()
  const { starCount, loading: loadingStars } = useGitHubStars(constants.github_owner, constants.github_repo)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const NAV_ITEMS = [
    { id: "home", label: t("home"), href: "#home" },
    { id: "features", label: t("features"), href: "#features" },
    { id: "scaffolding", label: t("scaffolding"), href: "#scaffolding" },
    { id: "roadmap", label: t("roadmap"), href: "#roadmap" },
    { id: "creators", label: t("creators"), href: "#creators" },
    { id: "cta", label: t("startProject"), href: "#cta" }
  ]

  const languages = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" }
  ] as const

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = NAV_ITEMS.map((item) => item.id)
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection)
    const activeRef = navRefs.current[activeIndex]

    if (activeRef) {
      const container = activeRef.parentElement
      if (container) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = activeRef.getBoundingClientRect()

        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width
        })
      }
    }
  }, [activeSection, isScrolled])

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          pointerEvents: "auto"
        })
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
          pointerEvents: "none"
        })
      }
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (newLang: "es" | "en") => {
    setIsLangOpen(false)
    router.replace(pathname, { locale: newLang })
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }

    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={`
                w-full z-50
                ${isScrolled ? "fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl" : "relative max-w-7xl mx-auto"}
            `}
    >
      <div
        className={`
                    grid grid-cols-[80%_20%] md:grid-cols-[1fr_auto_1fr]  items-center px-6 md:px-8
                    ${
                      isScrolled
                        ? "bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-full py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                        : "bg-transparent py-0"
                    }
                `}
      >
        <div className="flex relative justify-start">
          <Logo className="w-15 h-8"></Logo>
          <span className="text-2xl font-bold tracking-wide text-white absolute left-8 ">vangCLI</span>
        </div>

        <div className="hidden md:flex justify-center">
          <div
            className={`
                            inline-flex items-center gap-2 relative
                            ${isScrolled ? "" : "p-1 rounded-full backdrop-blur-md border bg-[#1a1a1a]/50 border-white/5"}
                        `}
          >
            {!isScrolled && (
              <div
                className="absolute bg-[#333] rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "calc(100% - 8px)",
                  top: "4px"
                }}
              />
            )}

            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                ref={(el) => {
                  navRefs.current[index] = el
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`
                                    px-5 py-2 rounded-full text-sm transition-colors relative z-10
                                    ${activeSection === item.id ? "text-white" : "text-gray-400 hover:text-white"}
                                `}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 md:gap-4 w-full pl-3">
          <button
            aria-label="Menu"
            className="md:hidden flex items-center justify-center text-white"
            onClick={toggleMenu}
          >
            <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center gap-3 md:gap-2">
            <div className="relative" ref={langDropdownRef}>
              <button
                aria-label="select language"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  isLangOpen
                    ? "bg-[#1a1a1a] border-lime-400 text-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.2)]"
                    : "bg-[#1a1a1a]/40 border-white/10 text-gray-300 hover:text-lime-400 hover:border-lime-400/50"
                }`}
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              <div
                className={`absolute right-0 top-full mt-2 w-24 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-md transition-all duration-200 origin-top z-100 ${
                  isLangOpen
                    ? "opacity-100 translate-y-0 scale-100 visible"
                    : "opacity-0 -translate-y-2 scale-95 invisible"
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
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          isActive ? "bg-lime-400/10 text-lime-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
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

            <Link
              href="/docs"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t("docs")}</span>
            </Link>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black transition-all text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              {/* <span className="flex items-center gap-1.5 border-r border-lime-400/50 pr-3">GitHub</span> */}

              <span className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4" />
                {loadingStars || starCount === null ? (
                  <span className="w-6 h-4 bg-lime-400/20 rounded animate-pulse"></span>
                ) : (
                  formatStarCount(starCount)
                )}
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 opacity-0 pointer-events-none"
      >
        <div className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`
                                px-4 py-3 rounded-xl text-base transition-colors
                                ${
                                  activeSection === item.id
                                    ? "bg-[#252525] text-white"
                                    : "text-gray-400 hover:text-white"
                                }
                            `}
            >
              {item.label}
            </a>
          ))}

          <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 px-4">
              {languages.map((lang) => {
                const isActive = locale === lang.code
                return (
                  <button
                    aria-label={lang.code}
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-lime-400/10 text-lime-400 border border-lime-400/50"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {lang.label}
                  </button>
                )
              })}
            </div>

            <Link
              href="/docs"
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-base font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t("docs")}</span>
            </Link>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black transition-all text-base font-medium"
            >
              <span className="flex items-center gap-1.5 border-r border-lime-400/50 pr-3">GitHub</span>

              <span className="flex items-center gap-1 font-bold">
                <Star className="w-5 h-5" />
                {loadingStars || starCount === null ? (
                  <span className="w-6 h-4 bg-lime-400/20 rounded animate-pulse"></span>
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

export default Navbar
