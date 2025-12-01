"use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BookOpen } from "lucide-react"
import { useEffect, useRef } from "react"

import { AnimatedChecklist } from "@/components/magicui/animated-checklist"
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid"
import { CatCLI } from "@/components/magicui/cat-cli"
import ClippedCard from "@/components/magicui/cliped-card"
import { Terminal } from "@/components/magicui/terminal"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturesSection() {
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
          Potencia tu{" "}
          <span className="text-[#BBF451] italic font-serif drop-shadow-[0_0_25px_rgba(132,204,22,0.4)]">
            flujo de trabajo
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Todo lo que necesitas para escalar tus aplicaciones full-stack desde el primer día, automatizado y
          estandarizado.
        </p>
      </div>

      <div ref={gridRef}>
        <BentoGrid className="w-full">
          <BentoCard
            className="md:col-span-2 shadow-[0_0_50px_-12px_rgba(132,204,22,0.1)]"
            background={
              <Terminal className="max-w-full h-full bg-[#1a1a1a] border-none" sequence={false} startOnView={true}>
                <CatCLI mode="cli" className="pl-6 pt-6" />
              </Terminal>
            }
          />

          <div className="md:col-span-1 flex items-center justify-center group relative col-span-1 flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/10 shadow-2xl w-full h-full">
            <ClippedCard color="#BBF451" className="transition-transform duration-300" fillContainer={true}>
              <div className="text-left w-full">
                <h3 className="text-2xl font-bold text-black mb-3">Stack Robusto</h3>
                <p className="text-black/80 text-sm mb-6 font-medium">Docker, Linter, Hooks y más listos para usar.</p>
                <div className="mt-4">
                  <AnimatedChecklist
                    items={[
                      { name: "Docker Compose" },
                      { name: "ESLint & Prettier" },
                      { name: "Husky Git Hooks" },
                      { name: "CI/CD Pipelines" }
                    ]}
                  />
                </div>
              </div>
            </ClippedCard>
          </div>

          <BentoCard
            Icon={BookOpen}
            name="Arquitectura Clara"
            description="Estructura modular que escala con tu proyecto. Carpetas organizadas por features, no por tipos de archivos."
            href="#"
            cta="Ver arquitectura"
            className="md:col-span-1 group"
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
                <CatCLI mode="help" className="pl-6 pt-6" />
              </Terminal>
            }
          />
        </BentoGrid>
      </div>
    </section>
  )
}
