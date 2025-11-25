import { NextResponse } from "next/server"

import { getAllDocs } from "@/modules/shared/docs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const allDocs = getAllDocs()

  const results = allDocs
    .filter((doc) => {
      const titleMatch = doc.metadata.title.toLowerCase().includes(query)
      const descMatch = doc.metadata.description?.toLowerCase().includes(query)
      const contentMatch = doc.content.toLowerCase().includes(query)

      return titleMatch || descMatch || contentMatch
    })
    .slice(0, 20)
    .map((doc) => ({
      cli: doc.cli,
      lang: doc.lang,
      category: doc.category,
      slug: doc.slug,
      title: doc.metadata.title,
      description: doc.metadata.description
    }))

  return NextResponse.json({ results })
}
