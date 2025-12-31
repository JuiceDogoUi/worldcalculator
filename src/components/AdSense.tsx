'use client'

import Script from 'next/script'

const ADSENSE_CLIENT_ID = 'ca-pub-7899464715113939'

export function AdSense() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
