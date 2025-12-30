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
 *
 * Uses sequential loading with delay to prevent atOptions conflicts
 */
export function StickyBanner({ position, className }: StickyBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const config = AD_CONFIG[position]

  useEffect(() => {
    if (isLoaded || !containerRef.current) return
    if (containerRef.current.querySelector('script')) return

    setIsLoaded(true)

    // Delay right banner to ensure left loads first without conflict
    // Left loads immediately, right waits 500ms for left's invoke.js to execute
    const delay = position === 'right' ? 500 : 0

    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return

      // Set atOptions
      ;(window as unknown as Record<string, unknown>).atOptions = {
        key: config.key,
        format: 'iframe',
        height: config.height,
        width: config.width,
        params: {},
      }

      // Load the invoke script synchronously (no async) to ensure it reads atOptions immediately
      const script = document.createElement('script')
      script.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`
      containerRef.current.appendChild(script)
    }, delay)

    return () => clearTimeout(timeoutId)
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
