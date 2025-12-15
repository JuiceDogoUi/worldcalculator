import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categories } from '@/config/categories'

/**
 * Custom 404 Not Found page
 * Localized and with helpful navigation options
 */
export default async function NotFound() {
  const tActions = await getTranslations('actions')
  const tCategories = await getTranslations('categories')

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="max-w-2xl space-y-6 text-center">
        {/* 404 Display */}
        <div>
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              {tActions('backToHome')}
            </Button>
          </Link>
          <Link href="/calculators">
            <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
              <Search className="h-4 w-4" />
              Browse Calculators
            </Button>
          </Link>
        </div>

        {/* Popular Categories */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/calculators/${category.slug}`}
                  className="rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <p className="font-medium">
                    {tCategories(category.translationKey)}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
