"use client"

import hljs from "highlight.js/lib/core"
import bash from "highlight.js/lib/languages/bash"
import css from "highlight.js/lib/languages/css"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import markdown from "highlight.js/lib/languages/markdown"
import python from "highlight.js/lib/languages/python"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"
import { useEffect } from "react"

hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("jsx", javascript)
hljs.registerLanguage("tsx", typescript)
hljs.registerLanguage("python", python)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("sh", bash)
hljs.registerLanguage("json", json)
hljs.registerLanguage("css", css)
hljs.registerLanguage("html", xml)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("md", markdown)
hljs.registerLanguage("yaml", yaml)
hljs.registerLanguage("yml", yaml)

interface SyntaxHighlighterProps {
  code: string
  language: string
}

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })
  }, [code, language])

  const highlighted = (() => {
    if (!language || language === "text") return code

    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value
    } catch {
      // If language is not supported, return code without highlighting
      return code
    }
  })()

  return <code className={`language-${language} hljs`} dangerouslySetInnerHTML={{ __html: highlighted }} />
}
