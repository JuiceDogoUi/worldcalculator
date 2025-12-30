'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NativeBannerProps {
  className?: string
}

/**
 * Native Banner Component for Adsterra
 * Blends with content, placed below calculator widget
 *
 * Uses useEffect to inject scripts - works on both initial load and client navigation
 */
export function NativeBanner({ className }: NativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear any existing content
    container.innerHTML = ''

    // Create the container div that Adsterra will populate
    const adContainer = document.createElement('div')
    adContainer.id = 'container-b0b83e0ee95fbb7315903c71b5201f66'
    container.appendChild(adContainer)

    // Create invoke script
    const invokeScript = document.createElement('script')
    invokeScript.async = true
    invokeScript.setAttribute('data-cfasync', 'false')
    invokeScript.src = 'https://pl28366707.effectivegatecpm.com/b0b83e0ee95fbb7315903c71b5201f66/invoke.js'
    container.appendChild(invokeScript)

    // Cleanup on unmount
    return () => {
      container.innerHTML = ''
    }
  }, [pathname]) // Re-run when pathname changes

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
    />
  )
}
