'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const loadingTranslations: Record<string, string> = {
  en: 'Loading...',
  es: 'Cargando...',
  fr: 'Chargement...',
  de: 'Laden...',
  pt: 'Carregando...',
  it: 'Caricamento...',
}

export default function RootPage() {
  const router = useRouter()
  const [loadingText, setLoadingText] = useState('Loading...')

  useEffect(() => {
    // Detect browser language and set loading text
    const browserLang = navigator.language.split('-')[0]
    const text = loadingTranslations[browserLang] || loadingTranslations.en
    setLoadingText(text)

    router.replace('/en')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">{loadingText}</p>
      </div>
    </div>
  )
}
