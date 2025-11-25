import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

const docsDirectory = path.join(process.cwd(), "content/docs")

export interface DocMetadata {
  title: string
  description: string
  order?: number
}

export interface DocFile {
  slug: string
  category: string
  metadata: DocMetadata
  content: string
}

export function getDocBySlug(category: string, slug: string): DocFile | null {
  try {
    const fullPath = path.join(docsDirectory, category, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      category,
      metadata: data as DocMetadata,
      content
    }
  } catch {
    return null
  }
}

export function getAllDocs(): DocFile[] {
  const categories = fs.readdirSync(docsDirectory)
  const docs: DocFile[] = []

  categories.forEach((category) => {
    const categoryPath = path.join(docsDirectory, category)
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath)

      files.forEach((file) => {
        if (file.endsWith(".md")) {
          const slug = file.replace(/\.md$/, "")
          const doc = getDocBySlug(category, slug)
          if (doc) {
            docs.push(doc)
          }
        }
      })
    }
  })

  return docs
}

export function getDocsByCategory(category: string): DocFile[] {
  const categoryPath = path.join(docsDirectory, category)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  const files = fs.readdirSync(categoryPath)
  const docs: DocFile[] = []

  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const slug = file.replace(/\.md$/, "")
      const doc = getDocBySlug(category, slug)
      if (doc) {
        docs.push(doc)
      }
    }
  })

  return docs.sort((a, b) => {
    const orderA = a.metadata.order ?? 999
    const orderB = b.metadata.order ?? 999
    return orderA - orderB
  })
}

export function getAllCategories(): string[] {
  const categories = fs.readdirSync(docsDirectory)
  return categories.filter((category) => {
    const categoryPath = path.join(docsDirectory, category)
    return fs.statSync(categoryPath).isDirectory()
  })
}

export function getCategoryTitle(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
