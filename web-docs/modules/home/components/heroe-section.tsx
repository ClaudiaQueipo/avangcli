"use client"

import { Icon } from "@iconify/react"
import { ArrowRight, Box, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import React from "react"

import { FlipWords } from "@/components/ui/flip-words"
import { Highlighter } from "@/components/ui/highlighter"

import Navbar from "./navbar"

interface LogoPlaceholderProps {
  text: string
  icon: string
}

interface FloatingCardProps {
  name: string
  time: string
  amount: string
  icon: React.ReactElement
  rotation: string
}

const HeroeSection = () => {
  const words = ["Next.js projects", "FastAPI backends", "full-stack apps"]
  return (
    <div className="min-h-screen bg-[#161616] p-2 flex flex-col" id="home">
      <section className="relative w-full bg-[#252525] rounded-b-[2.5rem] rounded-t-xl overflow-hidden flex flex-col pt-6 pb-20 shadow-2xl ring-1 ring-white/5 h-[98vh]">
        <div className="absolute left-20 top-1/2 space-y-6 hidden xl:block z-10 select-none pointer-events-none opacity-80">
          <FloatingCard
            name="Deploy Success"
            time="Just now"
            amount="v2.0"
            icon={<CheckCircle className="text-black w-6 h-6" />}
            rotation="-rotate-6"
          />
          <FloatingCard
            name="Docker Image"
            time="24s ago"
            amount="Built"
            icon={<Box className="text-black w-6 h-6" />}
            rotation="rotate-3 ml-12"
          />
          <FloatingCard
            name="New Star"
            time="1min ago"
            amount="+1"
            icon={<Star className="text-black w-6 h-6" />}
            rotation="-rotate-3"
          />
        </div>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-10 pointer-events-none">
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-72 shadow-[0_0_40px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-lime-400 font-bold text-sm">Project Structure</span>
              <Box size={16} className="text-gray-400" />
            </div>
            <div className="space-y-2 font-mono text-xs text-gray-300">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lime-400">📂</span> /apps
              </div>
              <div className="pl-4 flex items-center gap-2 border-l border-white/10 ml-1">
                <span className="text-blue-400">⚛️</span> web-nextjs
              </div>
              <div className="pl-4 flex items-center gap-2 border-l border-white/10 ml-1">
                <span className="text-yellow-400">⚡</span> api-fastapi
              </div>
              <div className="pl-4 flex items-center gap-2 border-l border-white/10 ml-1">
                <span className="text-sky-400">🐳</span> docker-compose
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-lime-500/30 p-3 rounded-lg shadow-xl flex items-center gap-3 -rotate-6 ">
            <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse"></div>
            <span className="text-xs font-bold text-white">Ready to deploy</span>
          </div>
        </div>

        <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-lime-500/15 rounded-[100%] blur-[100px] pointer-events-none z-0" />

        <div className="w-full px-6 mb-16 absolute top-5">
          <Navbar />
        </div>

        <div className="w-full h-full absolute flex justify-center items-center">
          <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl mx-auto h-full ">
            <h1 className="text-center text-white text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              Optimize your <br className="hidden md:block" />
              <span className="inline-block text-lime-300 italic font-serif mt-2">
                <FlipWords
                  words={words}
                  className="text-lime-300 drop-shadow-[0_0_25px_rgba(132,204,22,0.4)] flex flex-col text-center md:flex-row md:text-left"
                />
              </span>
            </h1>

            <p className="text-center text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
              AvangCLI genera proyectos{" "}
              <Highlighter action="underline" color="#a3e635" strokeWidth={2} isView>
                full-stack
              </Highlighter>{" "}
              preconfigurados con{" "}
              <Highlighter action="underline" color="#bef264" strokeWidth={2} isView>
                Next.js
              </Highlighter>{" "}
              y{" "}
              <Highlighter action="underline" color="#bef264" strokeWidth={2} isView>
                FastAPI
              </Highlighter>
              . Despliega en segundos con Docker y CI/CD integrado.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center mb-10">
              <Link
                href="/docs/getting-started/installation"
                className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 group transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/docs/guides/basic-usage"
                className="px-8 py-4 rounded-full border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black font-semibold border transition-colors text-center flex items-center justify-center gap-2"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <LogoPlaceholder text="Next.js" icon="simple-icons:nextdotjs" />
          <LogoPlaceholder text="TypeScript" icon="simple-icons:typescript" />
          <LogoPlaceholder text="Python" icon="simple-icons:python" />
          <LogoPlaceholder text="FastAPI" icon="simple-icons:fastapi" />
          <LogoPlaceholder text="Docker" icon="simple-icons:docker" />
          <LogoPlaceholder text="Tailwind" icon="simple-icons:tailwindcss" />
        </div>
      </div>
    </div>
  )
}

const LogoPlaceholder = ({ text, icon }: LogoPlaceholderProps) => (
  <div className="flex items-center gap-2 text-xl font-bold text-lime-400 select-none hover:text-lime-300 transition-colors">
    <Icon icon={icon} width="28" height="28" />
    <span className="text-white">{text}</span>
  </div>
)

const FloatingCard = ({ name, time, amount, icon, rotation }: FloatingCardProps) => (
  <div
    className={`flex items-center gap-3 bg-[#D4FC79] text-black p-3 rounded-2xl w-56 shadow-2xl border border-white/50 transform transition-transform duration-300 ${rotation}`}
  >
    <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center border border-white/60">
      {icon}
    </div>
    <div className="flex-1 leading-tight">
      <p className="text-xs font-bold">{name}</p>
      <p className="text-[10px] opacity-60">{time}</p>
    </div>
    <div className="text-sm font-bold px-2 py-1 bg-white/30 rounded-lg">{amount}</div>
  </div>
)

export default HeroeSection
