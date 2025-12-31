import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { categories } from '@/config/categories'
import { Calculator } from 'lucide-react'
import { CookieSettingsButton } from '@/components/CookieSettingsButton'

export async function Footer() {
  const tSite = await getTranslations('site')
  const tFooter = await getTranslations('footer')
  const tCategories = await getTranslations('categories')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-lg font-semibold"
            >
              <Calculator className="h-6 w-6" />
              <span>{tSite('name')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {tFooter('description')}
            </p>
          </div>

          {/* Categories Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {tFooter('categoriesTitle')}
            </h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/calculators/${category.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tCategories(category.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{tFooter('companyTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tFooter('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tFooter('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{tFooter('legalTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tFooter('privacy')}
                </Link>
              </li>
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {tSite('name')}. {tFooter('copyright')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
