'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NativeBannerProps {
  className?: string
}

const NATIVE_BANNER_ID = 'b0b83e0ee95fbb7315903c71b5201f66'

/**
 * Native Banner Component for Adsterra
 * Blends with content, placed below calculator widget
 *
 * Uses useEffect with dynamic script injection for proper SPA navigation support
 */
export function NativeBanner({ className }: NativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Small delay to ensure DOM is ready and avoid conflicts with sticky banners
    const timeoutId = setTimeout(() => {
      if (!container) return

      // Clear any existing content
      container.innerHTML = ''

      // Create the container div that Adsterra populates
      const adContainer = document.createElement('div')
      adContainer.id = `container-${NATIVE_BANNER_ID}`
      container.appendChild(adContainer)

      // Create and inject the invoke script
      const invokeScript = document.createElement('script')
      invokeScript.async = true
      invokeScript.setAttribute('data-cfasync', 'false')
      invokeScript.src = `https://pl28366707.effectivegatecpm.com/${NATIVE_BANNER_ID}/invoke.js`
      container.appendChild(invokeScript)
    }, 1500) // Load after sticky banners (left: 0ms, right: 1000ms)

    return () => {
      clearTimeout(timeoutId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [pathname])

  return (
    <div className={cn('w-full', className)}>
      <div ref={containerRef} />
    </div>
  )
}
