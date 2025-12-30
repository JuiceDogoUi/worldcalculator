'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
 *
 * Uses useEffect to inject scripts - works on both initial load and client navigation
 */
export function StickyBanner({ position, className }: StickyBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const config = AD_CONFIG[position]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Delay: left loads at 0ms, right loads at 1000ms
    // This ensures left's invoke.js executes before right overwrites atOptions
    const delay = position === 'left' ? 0 : 1000

    const timeoutId = setTimeout(() => {
      if (!container) return

      // Clear any existing content
      container.innerHTML = ''

      // Create atOptions script
      const optionsScript = document.createElement('script')
      optionsScript.type = 'text/javascript'
      optionsScript.textContent = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `
      container.appendChild(optionsScript)

      // Create invoke script
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`
      container.appendChild(invokeScript)
    }, delay)

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId)
      container.innerHTML = ''
    }
  }, [config.key, config.height, config.width, position, pathname]) // Re-run when pathname changes

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
