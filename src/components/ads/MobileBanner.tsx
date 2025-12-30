'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MobileBannerProps {
  position: 'top' | 'bottom'
  className?: string
}

const AD_CONFIG = {
  top: {
    key: '9e378472206fe2a91747abe75b682219',
    height: 50,
    width: 320,
  },
  bottom: {
    key: '3b0acaf6f8fd19553dea7d20813ca07b',
    height: 250,
    width: 300,
  },
} as const

/**
 * Mobile Banner Component for Adsterra
 * Top: 320x50 above breadcrumb
 * Bottom: 300x250 below source/share widget
 * Only visible on mobile (< 768px)
 */
export function MobileBanner({ position, className }: MobileBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const config = AD_CONFIG[position]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Delay to avoid atOptions conflicts
    const delay = position === 'top' ? 2000 : 2500

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
      invokeScript.src = `https://bouncingbuzz.com/${config.key}/invoke.js`
      container.appendChild(invokeScript)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [config.key, config.height, config.width, position, pathname])

  return (
    <div
      className={cn(
        'md:hidden flex justify-center',
        className
      )}
    >
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ width: config.width, height: config.height }}
      />
    </div>
  )
}
