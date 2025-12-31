'use client'

import { useTranslations } from 'next-intl'
import { Cookie } from 'lucide-react'

export function CookieSettingsButton() {
  const t = useTranslations('cookies')

  const handleClick = () => {
    // Clear consent to re-show the banner
    localStorage.removeItem('cookie-consent')
    // Reload to apply changes and show banner
    window.location.reload()
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground text-sm"
    >
      <Cookie className="h-3.5 w-3.5" />
      {t('settings')}
    </button>
  )
}
