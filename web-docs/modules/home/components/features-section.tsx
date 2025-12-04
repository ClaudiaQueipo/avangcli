"use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

import { AnimatedChecklist } from "@/components/magicui/animated-checklist"
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid"
import { CLIHelp } from "@/components/magicui/cli-help"
import ClippedCard from "@/components/magicui/cliped-card"
import { Terminal } from "@/components/magicui/terminal"

import GlowingLogo from "./glowing-logo"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturesSection() {
  const t = useTranslations("home.features")
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
              amount: 0.5,
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

  return (
    <section ref={sectionRef} className="px-4 py-24 max-w-7xl mx-auto bg-[#161616]" id="features">
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
        <BentoGrid className="w-full" firstRowHeight="394px">
          <div className="md:col-span-2 h-full flex items-center justify-between group relative col-span-1 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/10 w-full border border-white/5 p-8 rounded-2xl shadow-lg bg-[#1a1a1a]">
            <div className="flex-1 max-w-lg relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl md:text-xl font-bold text-white">{t("generateTypes.title")}</h3>
              </div>
              <p className="text-gray-400 mb-8 text-base leading-relaxed">{t("generateTypes.description")}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-start space-x-3">
                  <svg className="w-5 h-5 text-[#BBF451]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-base">{t("generateTypes.items.openapi")}</span>
                </div>
                <div className="flex items-center justify-start space-x-3">
                  <svg className="w-5 h-5 text-[#BBF451]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-base">{t("generateTypes.items.speed")}</span>
                </div>
                <div className="flex items-center justify-start space-x-3">
                  <svg className="w-5 h-5 text-[#BBF451]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-base">{t("generateTypes.items.configurable")}</span>
                </div>
              </div>
            </div>

            <GlowingLogo className="absolute z-0 w-[250px] right-10 hidden md:block"></GlowingLogo>
            <div className="hidden md:block border-2 border-[#2C2C2C] rounded-2xl w-[250px] h-[250px] absolute right-10 z-[-1]"></div>
            <div className="hidden md:block border-2 border-[#2C2C2C] rounded-[4rem] w-[250px] h-[250px] absolute right-10 z-[-1]"></div>
            <div className="hidden md:block border-2 border-[#2C2C2C] rounded-[6rem] w-[250px] h-[250px] absolute right-10 z-[-1]"></div>
            <div className="hidden md:block border-2 border-[#2C2C2C] rounded-full w-[250px] h-[250px] absolute right-10 z-[-1]"></div>
          </div>

          <div className="md:col-span-1 h-full flex items-center justify-center group relative col-span-1 flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/10 shadow-2xl w-full">
            <ClippedCard color="#BBF451" className="transition-transform duration-300 h-full" fillContainer={true}>
              <div className="text-left w-full h-full flex flex-col justify-center">
                <div className="p-0">
                  <h3 className="text-2xl font-bold text-black mb-3">{t("robustStack.title")}</h3>
                  <p className="text-black/80 text-sm mb-6 font-medium">{t("robustStack.description")}</p>
                  <div className="mt-4">
                    <AnimatedChecklist
                      items={[
                        { name: t("robustStack.items.docker") },
                        { name: t("robustStack.items.eslint") },
                        { name: t("robustStack.items.husky") },
                        { name: t("robustStack.items.cicd") }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </ClippedCard>
          </div>

          <BentoCard
            Icon={BookOpen}
            name={t("architecture.title")}
            description={t("architecture.description")}
            href="#"
            cta={t("architecture.cta")}
            className="md:col-span-1 group md:h-[354px]"
            variant="dark"
            background={
              <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-lime-500/10 via-transparent to-lime-500/5" />
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-500/20 rounded-full blur-[60px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-lime-400/10 rounded-full blur-[80px] group-hover:blur-[100px] transition-all duration-700" />

                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(132, 204, 22, 0.1) 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                />
              </div>
            }
          />

          <BentoCard
            className="md:col-span-2"
            background={
              <Terminal className="max-w-full h-full bg-[#1a1a1a] border-none" sequence={false} startOnView={true}>
                <CLIHelp className="pl-6 pt-6" />
              </Terminal>
            }
          />
        </BentoGrid>
      </div>
    </section>
  )
}
