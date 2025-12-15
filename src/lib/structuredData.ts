/**
 * Structured data (JSON-LD) utilities for SEO
 * Generates schema.org markup for various entity types
 */

export interface StructuredDataConfig {
  siteName: string
  siteUrl: string
  locale: string
}

/**
 * Organization schema
 * Used in site-wide layout to establish brand identity
 */
export function generateOrganizationSchema(config: StructuredDataConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${config.siteUrl}/logo.png`,
    },
    sameAs: [
      // Social media profiles can be added here
      // 'https://twitter.com/worldcalculator',
      // 'https://facebook.com/worldcalculator',
    ],
  }
}

/**
 * WebSite schema with search action
 * Enables Google to show search box in search results
 */
export function generateWebSiteSchema(config: StructuredDataConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    inLanguage: config.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * BreadcrumbList schema
 * Shows navigation path in search results
 */
export interface BreadcrumbItem {
  name: string
  url?: string
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${siteUrl}${item.url}` }),
    })),
  }
}

/**
 * SoftwareApplication schema for calculators
 * Marks calculators as web applications/tools
 */
export interface CalculatorSchema {
  name: string
  description: string
  url: string
  applicationCategory: string
  offers?: {
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export function generateCalculatorSchema(
  calculator: CalculatorSchema,
  config: StructuredDataConfig
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calculator.name,
    description: calculator.description,
    url: `${config.siteUrl}${calculator.url}`,
    applicationCategory: calculator.applicationCategory || 'Utility',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: calculator.offers?.price || '0',
      priceCurrency: calculator.offers?.priceCurrency || 'USD',
    },
    ...(calculator.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: calculator.aggregateRating.ratingValue,
        reviewCount: calculator.aggregateRating.reviewCount,
      },
    }),
  }
}

/**
 * Article schema for calculator description pages
 * Helps search engines understand the content
 */
export interface ArticleSchema {
  headline: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  author?: string
  image?: string
}

export function generateArticleSchema(
  article: ArticleSchema,
  config: StructuredDataConfig
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    url: `${config.siteUrl}${article.url}`,
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: config.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${config.siteUrl}/logo.png`,
      },
    },
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image,
      },
    }),
  }
}

/**
 * FAQPage schema for calculator FAQ sections
 * Shows rich results in Google search
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * HowTo schema for calculator usage instructions
 * Shows step-by-step guide in Google search
 */
export interface HowToStep {
  name: string
  text: string
  url?: string
  image?: string
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  }
}

/**
 * Helper to convert structured data to JSON string
 * Use this in a <script type="application/ld+json"> tag
 */
export function stringifyStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data)
}
