'use client'

import Script from 'next/script'
import { cn } from '@/lib/utils'

interface NativeBannerProps {
  className?: string
}

/**
 * Native Banner Component for Adsterra
 * Blends with content, placed below calculator widget
 *
 * Uses Next.js Script component for proper script loading
 */
export function NativeBanner({ className }: NativeBannerProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Container div that Adsterra will populate */}
      <div id="container-b0b83e0ee95fbb7315903c71b5201f66" />
      {/* Adsterra native banner script */}
      <Script
        async
        data-cfasync="false"
        src="https://pl28366707.effectivegatecpm.com/b0b83e0ee95fbb7315903c71b5201f66/invoke.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
