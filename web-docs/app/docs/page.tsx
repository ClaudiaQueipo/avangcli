import Link from 'next/link'
import { getAllCategories, getDocsByCategory, getCategoryTitle } from '@/lib/docs'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function DocsPage() {
  const categories = getAllCategories()

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know to get started and build with our platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const docs = getDocsByCategory(category)
          const firstDoc = docs[0]

          if (!firstDoc) return null

          return (
            <Link
              key={category}
              href={`/docs/${category}/${firstDoc.slug}`}
              className="group"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {getCategoryTitle(category)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </CardTitle>
                  <CardDescription>
                    {firstDoc.metadata.description}
                  </CardDescription>
                  <div className="pt-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {docs.slice(0, 3).map((doc) => (
                        <li key={doc.slug} className="flex items-center">
                          <span className="mr-2">•</span>
                          {doc.metadata.title}
                        </li>
                      ))}
                      {docs.length > 3 && (
                        <li className="text-xs italic">
                          +{docs.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
