'use client'

import Script from 'next/script'

interface AdsterraAdProps {
  className?: string
}

/**
 * Adsterra Ad Component
 *
 * Uses Next.js Script component with lazyOnload strategy to:
 * - Defer loading until browser idle time
 * - Prevent blocking initial page render
 * - Improve Core Web Vitals (LCP, FID)
 *
 * Best practices applied:
 * - Single script instance (no duplicates that could conflict)
 * - lazyOnload for performance optimization
 * - Placed in layout for consistent monetization across pages
 */
export function AdsterraAd({ className }: AdsterraAdProps) {
  return (
    <div className={className}>
      <Script
        src="https://pl28366435.effectivegatecpm.com/0c/ca/2c/0cca2c89902512bd6feb2be1959b1e92.js"
        strategy="lazyOnload"
        id="adsterra-main"
      />
    </div>
  )
}
