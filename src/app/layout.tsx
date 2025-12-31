import type { Metadata, Viewport } from 'next'
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
      <head>
        {/* Set AdSense personalization based on cookie consent - must run before AdSense loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var consent = localStorage.getItem('cookie-consent');
                  window.adsbygoogle = window.adsbygoogle || [];
                  window.adsbygoogle.requestNonPersonalizedAds = (consent === 'accepted') ? 0 : 1;
                } catch(e) {
                  window.adsbygoogle = window.adsbygoogle || [];
                  window.adsbygoogle.requestNonPersonalizedAds = 1;
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
