"use client"

import { Check, Copy, Sparkles } from "lucide-react"
import { useState } from "react"

import { SyntaxHighlighter } from "./syntax-highlighter"

interface CodeBlockProps {
  children: string
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const language = className?.replace("language-", "") || "text"

  return (
    <div className="relative group my-6">
      {language !== "text" && (
        <div className="absolute top-0 right-12 px-3 py-1 text-xs font-medium text-tiber bg-green-yellow/90 rounded-b-md border-b border-x border-green-yellow/50 backdrop-blur-sm font-semibold">
          {language}
        </div>
      )}

      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 p-2 rounded-md border transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:shadow-lg ${
          copied
            ? "bg-green-yellow/30 border-green-yellow scale-110 shadow-green-yellow/30"
            : "bg-surf-crest/90 hover:bg-green-yellow border-everglade hover:scale-105 hover:border-green-yellow"
        }`}
        aria-label="Copy code"
      >
        <div className="relative w-4 h-4">
          <Copy
            className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
              copied ? "scale-0 rotate-180 opacity-0 text-tiber" : "scale-100 rotate-0 opacity-100 text-tiber"
            }`}
          />
          <div className="relative">
            <Check
              className={`absolute inset-0 w-4 h-4 text-green-yellow transition-all duration-500 ${
                copied ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0"
              }`}
            />
            {copied && (
              <>
                <Sparkles
                  className="absolute -top-1 -right-1 w-3 h-3 text-green-yellow animate-ping"
                  style={{ animationDuration: "0.6s" }}
                />
                <Sparkles
                  className="absolute -bottom-1 -left-1 w-2 h-2 text-sulu animate-ping"
                  style={{ animationDuration: "0.8s", animationDelay: "0.1s" }}
                />
              </>
            )}
          </div>
        </div>
      </button>

      <pre className="!bg-tiber !text-surf-crest rounded-lg p-4 overflow-x-auto border border-everglade shadow-lg font-mono text-sm leading-relaxed">
        <SyntaxHighlighter code={children} language={language} />
      </pre>

      <div
        className={`absolute -bottom-10 right-3 px-3 py-1.5 text-xs font-medium text-tiber bg-green-yellow/95 backdrop-blur-sm rounded-md border border-green-yellow shadow-lg shadow-green-yellow/20 transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Check className="w-3 h-3" />
          <span className="font-semibold">Copied to clipboard!</span>
        </div>
      </div>

      {copied && (
        <div className="absolute top-3 right-3 w-10 h-10 pointer-events-none">
          <div className="absolute inset-0 rounded-md bg-green-yellow/30 animate-ping" />
        </div>
      )}
    </div>
  )
}
