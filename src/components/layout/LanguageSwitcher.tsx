'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeConfigs } from '@/i18n/locales'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Language switcher component
 * Allows users to switch between available locales
 */
export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/').filter(Boolean)
    const currentLocaleIndex = segments.findIndex((seg) =>
      locales.includes(seg as (typeof locales)[number])
    )

    if (currentLocaleIndex !== -1) {
      segments[currentLocaleIndex] = newLocale
    } else {
      segments.unshift(newLocale)
    }

    router.push(`/${segments.join('/')}`)
  }

  const currentLocale = localeConfigs[locale as keyof typeof localeConfigs]

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{currentLocale?.flag}</span>
            <span className="hidden sm:inline">{currentLocale?.nativeName}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => {
          const config = localeConfigs[loc]
          return (
            <SelectItem key={loc} value={loc}>
              <span className="flex items-center gap-2">
                <span>{config.flag}</span>
                <span>{config.nativeName}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
