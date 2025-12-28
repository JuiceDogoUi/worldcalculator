import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const config: NextConfig = {
  // Static site generation
  output: 'export',

  // Trailing slashes for consistent URLs
  trailingSlash: true,

  // Image optimization configuration
  images: {
    unoptimized: true,
    formats: ['image/webp'],
  },

  // Strict mode for better debugging
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production but keep error/warn for debugging
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL || 'https://worldcalculator.com',
  },
}

export default withBundleAnalyzer(withNextIntl(config))
