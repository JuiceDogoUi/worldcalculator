'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StickyBannerProps {
  position: 'left' | 'right'
  className?: string
}

// Ad configurations for each position
const AD_CONFIG = {
  left: {
    key: 'ff36d6e872b075b342f94cd3829aa347',
    height: 600,
    width: 160,
  },
  right: {
    key: '9f3e0ac2372b6fc6ad5cb300bd510d6d',
    height: 300,
    width: 160,
  },
} as const

/**
 * Sticky Vertical Banner Component for Adsterra banners
 * Left: 160x600, Right: 160x300
 * Only visible on xl screens (1280px+)
 */
export function StickyBanner({ position, className }: StickyBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const config = AD_CONFIG[position]

  useEffect(() => {
    if (isLoaded || !containerRef.current) return
    if (containerRef.current.querySelector('script')) return

    setIsLoaded(true)

    // Create a wrapper script that isolates atOptions in an IIFE
    // This prevents race conditions when multiple banners load simultaneously
    const wrapperScript = document.createElement('script')
    wrapperScript.textContent = `
      (function() {
        window.atOptions = {
          key: '${config.key}',
          format: 'iframe',
          height: ${config.height},
          width: ${config.width},
          params: {}
        };
        var script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/${config.key}/invoke.js';
        script.async = true;
        document.getElementById('adsterra-banner-${position}').appendChild(script);
      })();
    `
    containerRef.current.appendChild(wrapperScript)
  }, [isLoaded, config, position])

  return (
    <div
      className={cn(
        'hidden xl:block',
        'fixed top-1/2 -translate-y-1/2',
        'z-40',
        position === 'left' ? 'left-2' : 'right-2',
        className
      )}
    >
      <div
        ref={containerRef}
        id={`adsterra-banner-${position}`}
        className="overflow-hidden"
        style={{ width: config.width, height: config.height }}
      />
    </div>
  )
}
