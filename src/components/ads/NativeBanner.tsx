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
 * Container div MUST exist before invoke.js runs
 */
export function NativeBanner({ className }: NativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous content
    container.innerHTML = ''

    // Create the container div FIRST - Adsterra needs this to exist
    const adContainer = document.createElement('div')
    adContainer.id = `container-${NATIVE_BANNER_ID}`
    container.appendChild(adContainer)

    // Wait a tick to ensure container is in DOM, then load script
    const timeoutId = setTimeout(() => {
      const invokeScript = document.createElement('script')
      invokeScript.async = true
      invokeScript.setAttribute('data-cfasync', 'false')
      invokeScript.src = `//pl28366707.effectivegatecpm.com/${NATIVE_BANNER_ID}/invoke.js`
      container.appendChild(invokeScript)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [pathname])

  return (
    <div className={cn('w-full min-h-[250px]', className)}>
      <div ref={containerRef} />
    </div>
  )
}
