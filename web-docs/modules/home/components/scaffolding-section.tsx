"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Code2, Database, FileCode, Folder, Layers } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ScaffoldingSection() {
  const t = useTranslations("home.scaffolding")
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out"
      })

      if (terminalRef.current) {
        gsap.from(terminalRef.current, {
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 75%"
          },
          opacity: 0,
          x: -100,
          duration: 1,
          ease: "power3.out"
        })

        const treeItems = terminalRef.current.querySelectorAll(".tree-item")
        gsap.from(treeItems, {
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 70%"
          },
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.5,
          ease: "power2.out"
        })
      }

      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll(".numbered-item")

        gsap.from(items, {
          scrollTrigger: {
            trigger: itemsRef.current,
            start: "top 75%"
          },
          opacity: 0,
          x: 100,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out"
        })

        items.forEach((item, index) => {
          const numberBadge = item.querySelector(".number-badge")

          gsap.from(numberBadge, {
            scrollTrigger: {
              trigger: item,
              start: "top 80%"
            },
            scale: 0,
            rotation: -180,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(2)"
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 bg-[#161616] relative overflow-hidden" id="scaffolding">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            {t("title")}{" "}
            <span className="text-[#BBF451] italic font-serif drop-shadow-[0_0_25px_rgba(132,204,22,0.4)]">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={terminalRef} className="order-2 lg:order-1">
            <div className="relative rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden group hover:border-lime-500/30 transition-colors duration-500">
              <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-lime-500/10 rounded-[100%] blur-[80px] pointer-events-none z-0" />
              <div className="bg-[#2a2a2a]/50 backdrop-blur-md px-4 py-3 flex items-center gap-2 border-b border-white/5 relative z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                </div>
                <div className="ml-4 text-xs text-gray-500 font-mono">explorer — src/modules</div>
              </div>

              <div className="p-8 font-mono text-sm relative z-10 space-y-3">
                <div className="tree-item flex items-center gap-2 text-white/90 font-bold pb-2 border-b border-white/5">
                  <Layers className="w-4 h-4 text-lime-400" />
                  <span>src/modules/auth</span>
                </div>

                <div className="space-y-3 pl-2">
                  <div className="group/item">
                    <div className="tree-item flex items-center gap-2 text-blue-400 mb-1">
                      <Folder className="w-4 h-4" />
                      <span>components/</span>
                    </div>
                    <div className="pl-6 space-y-1 border-l border-white/10 ml-2">
                      <div className="tree-item flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <FileCode className="w-3 h-3" />
                        <span>LoginForm.tsx</span>
                      </div>
                      <div className="tree-item flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <FileCode className="w-3 h-3" />
                        <span>RegisterForm.tsx</span>
                      </div>
                    </div>
                  </div>

                  <div className="group/item">
                    <div className="tree-item flex items-center gap-2 text-yellow-400 mb-1">
                      <Folder className="w-4 h-4" />
                      <span>hooks/</span>
                    </div>
                    <div className="pl-6 border-l border-white/10 ml-2">
                      <div className="tree-item flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <Code2 className="w-3 h-3" />
                        <span>useAuth.ts</span>
                      </div>
                    </div>
                  </div>

                  <div className="group/item">
                    <div className="tree-item flex items-center gap-2 text-green-400 mb-1">
                      <Folder className="w-4 h-4" />
                      <span>services/</span>
                    </div>
                    <div className="pl-6 border-l border-white/10 ml-2">
                      <div className="tree-item flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <Database className="w-3 h-3" />
                        <span>auth.service.ts</span>
                      </div>
                    </div>
                  </div>

                  <div className="tree-item flex items-center gap-2 text-purple-400">
                    <Folder className="w-4 h-4" />
                    <span>types/</span>
                  </div>

                  <div className="tree-item flex items-center gap-2 text-lime-200/70 pt-2">
                    <FileCode className="w-4 h-4" />
                    <span>index.ts</span>
                    <span className="text-xs text-gray-600 ml-2">// Barrel export</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={itemsRef} className="order-1 lg:order-2 space-y-10">
            <div className="numbered-item flex gap-6 group">
              <div className="number-badge w-12 h-12 rounded-2xl bg-[#D4FC79] flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,252,121,0.3)] shrink-0 transition-transform group-hover:scale-110 duration-300">
                <span className="font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-lime-300 transition-colors">
                  {t("item1.title")}
                </h3>
                <p className="text-gray-400 leading-relaxed">{t("item1.description")}</p>
              </div>
            </div>

            <div className="numbered-item flex gap-6 group">
              <div className="number-badge w-12 h-12 rounded-2xl bg-[#D4FC79] flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,252,121,0.3)] shrink-0 transition-transform group-hover:scale-110 duration-300">
                <span className="font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-lime-300 transition-colors">
                  {t("item2.title")}
                </h3>
                <p className="text-gray-400 leading-relaxed">{t("item2.description")}</p>
              </div>
            </div>

            <div className="numbered-item flex gap-6 group">
              <div className="number-badge w-12 h-12 rounded-2xl bg-[#D4FC79] flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,252,121,0.3)] shrink-0 transition-transform group-hover:scale-110 duration-300">
                <span className="font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-lime-300 transition-colors">
                  {t("item3.title")}
                </h3>
                <p className="text-gray-400 leading-relaxed">{t("item3.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
