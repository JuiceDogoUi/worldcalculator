import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.worldcalculator.org'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'World Calculator',
  description: 'Free online calculators for finance, health, math, and more',
  openGraph: {
    type: 'website',
    siteName: 'World Calculator',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'World Calculator - Free online calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {/* Ezoic Privacy Scripts - Load First */}
        <Script
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />

        {/* Ezoic Main Script */}
        <Script
          src="https://www.ezojs.com/ezoic/sa.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="ezoic-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />

        {children}
      </body>
    </html>
  )
}
