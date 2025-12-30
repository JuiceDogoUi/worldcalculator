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
 * The container div must exist in DOM BEFORE the script loads
 */
export function NativeBanner({ className }: NativeBannerProps) {
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const scriptContainer = scriptContainerRef.current
    if (!scriptContainer) return

    // Clear any existing scripts
    scriptContainer.innerHTML = ''

    // Create invoke script - it will find the container div by ID
    const invokeScript = document.createElement('script')
    invokeScript.async = true
    invokeScript.setAttribute('data-cfasync', 'false')
    invokeScript.src = 'https://pl28366707.effectivegatecpm.com/b0b83e0ee95fbb7315903c71b5201f66/invoke.js'
    scriptContainer.appendChild(invokeScript)

    // Cleanup on unmount
    return () => {
      scriptContainer.innerHTML = ''
    }
  }, [pathname])

  return (
    <div className={cn('w-full', className)}>
      {/* Container div must exist BEFORE script loads */}
      <div id="container-b0b83e0ee95fbb7315903c71b5201f66" />
      {/* Script injection container */}
      <div ref={scriptContainerRef} />
    </div>
  )
}
