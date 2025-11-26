"use client"

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { CodeBlock } from "./code-block"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()
            return (
              <h1 id={id} className="text-4xl font-bold tracking-tight mt-8 mb-4">
                {children}
              </h1>
            )
          },
          h2: ({ children }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()
            return (
              <h2 id={id} className="text-3xl font-semibold tracking-tight mt-8 mb-4 pb-2 border-b">
                {children}
              </h2>
            )
          },
          h3: ({ children }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()
            return (
              <h3 id={id} className="text-2xl font-semibold tracking-tight mt-6 mb-3">
                {children}
              </h3>
            )
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline font-medium"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isInline = !className

            if (isInline) {
              return <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono border">{children}</code>
            }

            return <code className={className}>{children}</code>
          },
          pre: ({ children }) => {
            const codeElement = children as { props?: { className?: string; children?: string } }
            const className = codeElement?.props?.className || ""
            const codeString = (codeElement?.props?.children || "").replace(/\n$/, "")

            return <CodeBlock className={className}>{codeString}</CodeBlock>
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
