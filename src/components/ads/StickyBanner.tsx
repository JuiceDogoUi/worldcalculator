'use client'

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
 * Uses inline script injection matching Adsterra's exact pattern
 */
export function StickyBanner({ position, className }: StickyBannerProps) {
  const config = AD_CONFIG[position]

  // Generate the exact HTML pattern Adsterra expects:
  // <script>atOptions = {...};</script>
  // <script src="invoke.js"></script>
  const adHtml = `
    <script type="text/javascript">
      atOptions = {
        'key' : '${config.key}',
        'format' : 'iframe',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js"></script>
  `

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
        id={`adsterra-banner-${position}`}
        className="overflow-hidden"
        style={{ width: config.width, height: config.height }}
        dangerouslySetInnerHTML={{ __html: adHtml }}
      />
    </div>
  )
}
