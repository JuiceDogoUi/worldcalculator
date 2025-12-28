import { Link } from '@/i18n/routing'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  homeLabel: string
  siteUrl?: string
  className?: string
}

/**
 * Breadcrumb navigation component with structured data for SEO
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   homeLabel="Home"
 *   siteUrl="https://www.worldcalculator.org"
 *   items={[
 *     { label: 'Finance', href: '/calculators/finance' },
 *     { label: 'Loan Calculator' }
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  homeLabel,
  siteUrl = '',
  className = '',
}: BreadcrumbsProps) {
  // Build structured data for SEO with absolute URLs
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.worldcalculator.org'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && {
          item: `${baseUrl}${item.href}`,
        }),
      })),
    ],
  }

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visual breadcrumb navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        {/* Home link */}
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
          aria-label={homeLabel}
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">{homeLabel}</span>
        </Link>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'font-medium text-foreground' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
