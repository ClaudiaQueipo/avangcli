"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Check, Cloud, Plug } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function RoadmapSection() {
  const t = useTranslations("home.roadmap")
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: "bottom center",
              scrub: 1
            },
            scaleY: 1,
            duration: 1,
            ease: "none"
          }
        )
      }

      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(".roadmap-item")

        items.forEach((item, index) => {
          const dot = item.querySelector(".timeline-dot")
          gsap.from(dot, {
            scrollTrigger: {
              trigger: item,
              start: "top 75%"
            },
            scale: 0,
            duration: 0.5,
            ease: "back.out(2)",
            delay: 0.2
          })

          const content = item.querySelector(".roadmap-content")
          const isLeft = index % 2 === 0

          gsap.from(content, {
            scrollTrigger: {
              trigger: item,
              start: "top 80%"
            },
            opacity: 0,
            x: isLeft ? -80 : 80,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.1
          })

          const badge = item.querySelector(".status-badge")
          if (badge) {
            gsap.from(badge, {
              scrollTrigger: {
                trigger: item,
                start: "top 75%"
              },
              scale: 0,
              rotation: 180,
              duration: 0.6,
              ease: "back.out(2)",
              delay: 0.4
            })
          }

          const glowElement = item.querySelector(".progress-glow")
          if (glowElement) {
            gsap.to(glowElement, {
              scale: 1.2,
              opacity: 0.8,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            })
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 bg-[#161616] relative overflow-hidden" id="roadmap">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10 px-6">
        <div ref={headerRef} className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            {t("title")}{" "}
            <span className="text-[#BBF451] drop-shadow-[0_0_25px_rgba(132,204,22,0.4)] italic font-serif">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">{t("description")}</p>
        </div>

        <div ref={timelineRef} className="relative">
          <div
            ref={lineRef}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2 z-0"
          />

          <div className="space-y-20">
            <div className="roadmap-item relative flex flex-col md:flex-row gap-8 items-start md:items-center group">
              <div className="roadmap-content md:w-1/2 md:text-right order-2 md:order-1 pl-12 md:pl-0">
                <div className="relative bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-xl overflow-hidden group-hover:border-lime-500/30 transition-all duration-500">
                  <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-lime-500/20 rounded-[100%] blur-2xl pointer-events-none" />

                  <h3 className="text-xl font-bold mb-2 flex items-center md:justify-end gap-2 text-white">
                    {t("items.nextjs.title")}
                    <span className="status-badge flex items-center justify-center w-5 h-5 rounded-full bg-lime-400/20 text-lime-400">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t("items.nextjs.description")}</p>
                </div>
              </div>
              <div className="timeline-dot absolute left-6 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 flex items-center justify-center z-10 order-1 md:order-2">
                <div className="w-4 h-4 rounded-full bg-[#161616] border-2 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
              </div>
              <div className="md:w-1/2 pl-12 md:pl-12 order-3 md:order-3">
                <span className="text-sm font-mono font-bold text-lime-400 opacity-80">
                  {t("items.nextjs.quarter")}
                </span>
              </div>
            </div>

            <div className="roadmap-item relative flex flex-col md:flex-row gap-8 items-start md:items-center group">
              <div className="md:w-1/2 md:text-right order-2 md:order-1 hidden md:block pr-12">
                <span className="text-sm font-mono font-bold text-blue-400">{t("items.typescript.quarter")}</span>
              </div>

              <div className="timeline-dot absolute left-6 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 flex items-center justify-center z-10 order-1 md:order-2">
                <span className="progress-glow absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <div className="w-4 h-4 rounded-full bg-[#161616] border-2 border-blue-400 relative z-10" />
              </div>

              <div className="roadmap-content md:w-1/2 pl-12 md:pl-0 order-3 md:order-3 w-full">
                <div className="relative bg-[#1a1a1a] border border-blue-500/30 p-6 rounded-2xl shadow-[0_0_30px_-10px_rgba(59,130,246,0.1)] overflow-hidden">
                  <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-blue-500/10 rounded-[100%] blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Cloud className="w-5 h-5 text-blue-400" />
                      {t("items.typescript.title")}
                    </h3>
                    <span className="status-badge flex items-center justify-center w-5 h-5 rounded-full bg-blue-400/20 text-blue-400">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">{t("items.typescript.description")}</p>
                </div>

                <div className="md:hidden mt-2">
                  <span className="text-sm font-mono font-bold text-blue-400">{t("items.typescript.quarter")}</span>
                </div>
              </div>
            </div>

            <div className="roadmap-item relative flex flex-col md:flex-row gap-8 items-start md:items-center group">
              <div className="roadmap-content md:w-1/2 md:text-right order-2 md:order-1 pl-12 md:pl-0">
                <div className="relative bg-[#1a1a1a] border border-yellow-500/30 p-6 rounded-2xl shadow-[0_0_30px_-10px_rgba(234,179,8,0.1)] overflow-hidden">
                  <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-yellow-500/10 rounded-[100%] blur-2xl pointer-events-none" />

                  <h3 className="text-xl font-bold mb-2 flex items-center md:justify-end gap-2 text-white">
                    {t("items.fastapi.title")}
                    <span className="status-badge px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 uppercase tracking-wide">
                      {t("items.fastapi.status")}
                    </span>
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">{t("items.fastapi.description")}</p>
                </div>
              </div>

              <div className="timeline-dot absolute left-6 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 flex items-center justify-center z-10 order-1 md:order-2">
                <div className="w-4 h-4 rounded-full bg-[#161616] border-2 border-yellow-400 relative z-10" />
              </div>

              <div className="md:w-1/2 pl-12 md:pl-12 order-3 md:order-3">
                <span className="text-sm font-mono font-bold text-yellow-400">{t("items.fastapi.quarter")}</span>
              </div>
            </div>

            <div className="roadmap-item relative flex flex-col md:flex-row gap-8 items-start md:items-center group">
              <div className="md:w-1/2 md:text-right order-2 md:order-1 hidden md:block pr-12">
                <span className="text-sm font-mono font-bold text-gray-500 group-hover:text-purple-400 transition-colors">
                  {t("items.future.quarter")}
                </span>
              </div>

              <div className="timeline-dot absolute left-6 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 flex items-center justify-center z-10 order-1 md:order-2">
                <div className="w-4 h-4 rounded-full bg-[#161616] border-2 border-white/20 group-hover:border-purple-400 transition-colors" />
              </div>

              <div className="roadmap-content md:w-1/2 pl-12 md:pl-0 order-3 md:order-3 w-full">
                <div className="relative bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl shadow-lg overflow-hidden group-hover:border-purple-500/30 transition-all duration-500 opacity-60 group-hover:opacity-100">
                  <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-purple-500/10 rounded-[100%] blur-2xl pointer-events-none" />

                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                    <Plug className="w-5 h-5 text-purple-400" /> {t("items.future.title")}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t("items.future.description")}</p>
                </div>
                <div className="md:hidden mt-2">
                  <span className="text-sm font-mono font-bold text-gray-500">{t("items.future.quarter")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
