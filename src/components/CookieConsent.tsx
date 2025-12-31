'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Cookie } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export type ConsentStatus = 'pending' | 'accepted' | 'rejected'

export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending'
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (stored === 'accepted' || stored === 'rejected') return stored
  return 'pending'
}

interface CookieConsentProps {
  locale: string
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('cookies')

  useEffect(() => {
    setMounted(true)
    setStatus(getConsentStatus())
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    // Reload page to apply personalized ads setting
    window.location.reload()
  }

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    setStatus('rejected')
    // No reload needed - already showing non-personalized ads
  }

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) return null

  // Don't show if user already made a choice
  if (status !== 'pending') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 pointer-events-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="h-5 w-5 text-muted-foreground shrink-0 hidden sm:block" />
            <p className="text-sm text-muted-foreground flex-1">
              {t('message')}{' '}
              <Link href={`/${locale}/privacy`} className="underline hover:text-foreground">
                {t('learnMore')}
              </Link>
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 sm:flex-none px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('decline')}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
