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
      <head>
        <meta name="monetag" content="6ea163b32dfd182681742ce5c59a73d2" />
        <script src="https://quge5.com/88/tag.min.js" data-zone="205637" async data-cfasync="false"></script>
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7899464715113939"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}
