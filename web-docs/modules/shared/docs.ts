import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

const contentDirectory = path.join(process.cwd(), "modules/docs/content")

interface CategoryConfig {
  [lang: string]: string
}

interface DocConfig {
  [slug: string]: {
    [lang: string]: string
  }
}

interface Config {
  categories: {
    [categorySlug: string]: CategoryConfig
  }
  docs: {
    [categorySlug: string]: DocConfig
  }
}

const config: Config = {
  categories: {
    introduction: {
      en: "01-introduction",
      es: "01-introduccion"
    },
    ["getting-started"]: {
      en: "02-getting-started",
      es: "02-primeros-pasos"
    },
    commands: {
      en: "03-commands",
      es: "03-comandos"
    },
    architecture: {
      en: "04-architecture",
      es: "04-arquitectura"
    },
    guides: {
      en: "05-guides",
      es: "05-guias"
    }
  },
  docs: {
    introduction: {
      overview: {
        en: "overview",
        es: "vision-general"
      },
      ["when-to-use"]: {
        en: "when-to-use",
        es: "cuando-usar"
      },
      ["why-use-this-tool"]: {
        en: "why-use-this-tool",
        es: "por-que-usar-esta-herramienta"
      }
    },
    ["getting-started"]: {
      configuration: {
        en: "configuration",
        es: "configuracion"
      },
      installation: {
        en: "installation",
        es: "instalacion"
      }
    },
    commands: {
      config: {
        en: "config",
        es: "config"
      },
      generate: {
        en: "generate",
        es: "generate"
      },
      init: {
        en: "init",
        es: "init"
      },
      module: {
        en: "module",
        es: "module"
      },
      ["ui-library"]: {
        en: "ui-library",
        es: "ui-library"
      }
    },
    architecture: {
      ["core-modules"]: {
        en: "core-modules",
        es: "modulos-principales"
      },
      overview: {
        en: "overview",
        es: "vision-general"
      },
      ["screaming-architecture"]: {
        en: "screaming-architecture",
        es: "screaming-architecture"
      }
    },
    guides: {
      ["best-practices"]: {
        en: "best-practices",
        es: "mejores-practicas"
      },
      ["complete-project-walkthrough"]: {
        en: "complete-project-walkthrough",
        es: "proyecto-completo-paso-a-paso"
      },
      troubleshooting: {
        en: "troubleshooting",
        es: "solucion-de-problemas"
      }
    }
  }
}

function getRealCategoryName(cli: string, categorySlug: string, lang: string): string {
  if (cli !== "frontend-cli") return categorySlug
  return config.categories[categorySlug]?.[lang] || categorySlug
}

function getRealDocSlug(cli: string, categorySlug: string, docSlug: string, lang: string): string {
  if (cli !== "frontend-cli") return docSlug
  return config.docs[categorySlug]?.[docSlug]?.[lang] || docSlug
}

function getCategorySlug(cli: string, realCategory: string, lang: string): string {
  if (cli !== "frontend-cli") return realCategory
  for (const [slug, langs] of Object.entries(config.categories)) {
    if (langs[lang] === realCategory) return slug
  }
  return realCategory
}

function getDocSlug(cli: string, categorySlug: string, realSlug: string, lang: string): string {
  if (cli !== "frontend-cli") return realSlug
  const categoryDocs = config.docs[categorySlug]
  if (!categoryDocs) return realSlug
  for (const [slug, langs] of Object.entries(categoryDocs)) {
    if (langs[lang] === realSlug) return slug
  }
  return realSlug
}

export interface DocMetadata {
  title: string
  description?: string
  order?: number
}

export interface DocFile {
  slug: string
  category: string
  cli: string
  lang: string
  metadata: DocMetadata
  content: string
}

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : "Untitled"
}

function extractDescriptionFromContent(content: string): string {
  const lines = content.split("\n")
  let foundTitle = false

  for (const line of lines) {
    if (line.trim().startsWith("#") && !foundTitle) {
      foundTitle = true
      continue
    }
    if (foundTitle && line.trim() && !line.trim().startsWith("#")) {
      return line.trim().substring(0, 160)
    }
  }

  return ""
}

export function getDocBySlug(cli: string, lang: string, category: string, slug: string): DocFile | null {
  try {
    const realCategory = getRealCategoryName(cli, category, lang)
    const realSlug = getRealDocSlug(cli, category, slug, lang)
    const fullPath = path.join(contentDirectory, cli, lang, realCategory, `${realSlug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    const title = data.title || extractTitleFromContent(content)
    const description = data.description || extractDescriptionFromContent(content)

    const orderMatch = realCategory.match(/^(\d+)-/)
    const categoryOrder = orderMatch ? parseInt(orderMatch[1]) : 999

    return {
      slug,
      category,
      cli,
      lang,
      metadata: {
        title,
        description,
        order: data.order ?? categoryOrder
      },
      content
    }
  } catch {
    return null
  }
}

export function getAllDocs(cli?: string, lang?: string): DocFile[] {
  const docs: DocFile[] = []

  try {
    const clis = cli
      ? [cli]
      : fs.readdirSync(contentDirectory).filter((item) => {
          try {
            const itemPath = path.join(contentDirectory, item)
            return fs.statSync(itemPath).isDirectory() && item !== "docs" && !item.startsWith(".")
          } catch {
            return false
          }
        })

    for (const currentCli of clis) {
      if (currentCli === "frontend-cli") {
        const languages = lang ? [lang] : ["en", "es"]
        for (const currentLang of languages) {
          for (const categorySlug of Object.keys(config.categories)) {
            const categoryDocs = config.docs[categorySlug]
            if (!categoryDocs) continue
            for (const docSlug of Object.keys(categoryDocs)) {
              const doc = getDocBySlug(currentCli, currentLang, categorySlug, docSlug)
              if (doc) {
                docs.push(doc)
              }
            }
          }
        }
      } else {
        const cliPath = path.join(contentDirectory, currentCli)

        if (!fs.existsSync(cliPath)) continue

        const languages = lang
          ? [lang]
          : fs.readdirSync(cliPath).filter((item) => {
              try {
                const itemPath = path.join(cliPath, item)
                return fs.statSync(itemPath).isDirectory() && !item.startsWith(".")
              } catch {
                return false
              }
            })

        for (const currentLang of languages) {
          const langPath = path.join(cliPath, currentLang)

          if (!fs.existsSync(langPath)) continue

          const categories = fs.readdirSync(langPath).filter((item) => {
            try {
              const itemPath = path.join(langPath, item)
              return fs.statSync(itemPath).isDirectory() && !item.startsWith(".")
            } catch {
              return false
            }
          })

          for (const category of categories) {
            const categoryPath = path.join(langPath, category)

            if (!fs.existsSync(categoryPath)) continue

            const files = fs.readdirSync(categoryPath)

            for (const file of files) {
              if (file.endsWith(".md") && !file.startsWith(".")) {
                const slug = file.replace(/\.md$/, "")
                const doc = getDocBySlug(currentCli, currentLang, category, slug)
                if (doc) {
                  docs.push(doc)
                }
              }
            }
          }
        }
      }
    }
  } catch {
    // NOTE: Silently fail if docs directory doesn't exist
  }

  return docs
}

export function getDocsByCategory(cli: string, lang: string, category: string): DocFile[] {
  if (cli === "frontend-cli") {
    const docs: DocFile[] = []
    const categoryDocs = config.docs[category]
    if (!categoryDocs) return []
    for (const docSlug of Object.keys(categoryDocs)) {
      const doc = getDocBySlug(cli, lang, category, docSlug)
      if (doc) {
        docs.push(doc)
      }
    }
    return docs.sort((a, b) => a.slug.localeCompare(b.slug))
  }

  const realCategory = getRealCategoryName(cli, category, lang)
  const categoryPath = path.join(contentDirectory, cli, lang, realCategory)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  const files = fs.readdirSync(categoryPath)
  const docs: DocFile[] = []

  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const realSlug = file.replace(/\.md$/, "")
      const docSlug = getDocSlug(cli, category, realSlug, lang)
      const doc = getDocBySlug(cli, lang, category, docSlug)
      if (doc) {
        docs.push(doc)
      }
    }
  })

  return docs.sort((a, b) => a.slug.localeCompare(b.slug))
}

const categoryOrder = ["introduction", "getting-started", "commands", "architecture", "guides"]

export function getAllCategories(cli: string, lang: string): string[] {
  if (cli === "frontend-cli") {
    return categoryOrder
  }

  const langPath = path.join(contentDirectory, cli, lang)

  if (!fs.existsSync(langPath)) {
    return []
  }

  const realCategories = fs
    .readdirSync(langPath)
    .filter((category) => {
      const categoryPath = path.join(langPath, category)
      return fs.statSync(categoryPath).isDirectory()
    })
    .sort((a, b) => {
      const numA = parseInt(a.split("-")[0]) || 0
      const numB = parseInt(b.split("-")[0]) || 0
      return numA - numB
    })

  return realCategories.map((realCat) => getCategorySlug(cli, realCat, lang))
}

export async function getCategoryTitle(category: string, locale: string): Promise<string> {
  const { getTranslations } = await import("next-intl/server")
  const t = await getTranslations({ locale, namespace: "categories" })
  const key = category.replace(/^\d+-/, "").replace(/-/g, "-")
  return t(key) || category
}

export function getAllCLIs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return []
    }

    return fs.readdirSync(contentDirectory).filter((item) => {
      try {
        const itemPath = path.join(contentDirectory, item)
        return fs.statSync(itemPath).isDirectory() && item !== "docs" && !item.startsWith(".")
      } catch {
        return false
      }
    })
  } catch {
    return []
  }
}

export function getAllLanguages(cli: string): string[] {
  try {
    const cliPath = path.join(contentDirectory, cli)

    if (!fs.existsSync(cliPath)) {
      return []
    }

    return fs.readdirSync(cliPath).filter((item) => {
      try {
        const itemPath = path.join(cliPath, item)
        return fs.statSync(itemPath).isDirectory() && !item.startsWith(".")
      } catch {
        return false
      }
    })
  } catch {
    return []
  }
}
