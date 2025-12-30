'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StickyBannerProps {
  position: 'left' | 'right'
  className?: string
}

/**
 * Sticky Vertical Banner Component for Adsterra 160x600 banner
 * Only visible on xl screens (1280px+) to avoid cluttering mobile/tablet
 */
export function StickyBanner({ position, className }: StickyBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only load once
    if (isLoaded || !containerRef.current) return

    // Check if script already exists in this container
    if (containerRef.current.querySelector('script')) return

    setIsLoaded(true)

    // Set atOptions on window before loading script
    ;(window as unknown as Record<string, unknown>).atOptions = {
      key: 'ff36d6e872b075b342f94cd3829aa347',
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    }

    // Create and append the script
    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/ff36d6e872b075b342f94cd3829aa347/invoke.js'
    script.async = true
    containerRef.current.appendChild(script)
  }, [isLoaded])

  return (
    <div
      className={cn(
        // Hidden on mobile/tablet, visible on xl screens (1280px+)
        'hidden xl:block',
        // Fixed positioning on viewport edge
        'fixed top-1/2 -translate-y-1/2',
        // Z-index below modals but above content
        'z-40',
        // Position based on side
        position === 'left' ? 'left-2' : 'right-2',
        className
      )}
    >
      <div
        ref={containerRef}
        id={`adsterra-banner-${position}`}
        className="w-[160px] h-[600px] overflow-hidden"
      />
    </div>
  )
}
