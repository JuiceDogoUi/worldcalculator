'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface NativeBannerProps {
  className?: string
}

/**
 * Native Banner Component for Adsterra
 * Blends with content, placed below calculator widget
 */
export function NativeBanner({ className }: NativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded || !containerRef.current) return
    if (containerRef.current.querySelector('script')) return

    setIsLoaded(true)

    // Create and append the script
    const script = document.createElement('script')
    script.src = 'https://pl28366707.effectivegatecpm.com/b0b83e0ee95fbb7315903c71b5201f66/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    containerRef.current.appendChild(script)
  }, [isLoaded])

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      <div id="container-b0b83e0ee95fbb7315903c71b5201f66" />
    </div>
  )
}
