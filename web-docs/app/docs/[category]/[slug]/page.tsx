import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocs } from '@/lib/docs'
import { MarkdownContent } from '@/components/markdown-content'
import { DocsRightSidebar } from '@/components/docs-right-sidebar'
import { Metadata } from 'next'

interface DocPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()

  return docs.map((doc) => ({
    category: doc.category,
    slug: doc.slug,
  }))
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { category, slug } = await params
  const doc = getDocBySlug(category, slug)

  if (!doc) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${doc.metadata.title} | Documentation`,
    description: doc.metadata.description,
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const { category, slug } = await params
  const doc = getDocBySlug(category, slug)

  if (!doc) {
    notFound()
  }

  return (
    <>
      <article className="flex-1 pr-8">
        <MarkdownContent content={doc.content} />

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </article>

      <DocsRightSidebar content={doc.content} />
    </>
  )
}
