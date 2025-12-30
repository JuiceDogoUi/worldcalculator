'use client'

import Script from 'next/script'

/**
 * Adsterra Popunder Ad Component
 *
 * Uses afterInteractive strategy so the script is ready
 * when users interact with the page (popunders trigger on click)
 */
export function AdsterraAd() {
  return (
    <Script
      src="https://pl28366435.effectivegatecpm.com/0c/ca/2c/0cca2c89902512bd6feb2be1959b1e92.js"
      strategy="afterInteractive"
      id="adsterra-popunder"
    />
  )
}
