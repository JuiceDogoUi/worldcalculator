'use client'

import { useState, useMemo, useCallback } from 'react'
import { Cake, Calendar, PartyPopper, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateBirthday, validateBirthdayInputs, formatDate, formatNumber } from './calculations'
import type { BirthdayResult } from './types'

interface BirthdayTranslations {
  birthDate: string
  reset: string
  results: {
    title: string
    daysUntil: string
    days: string
    nextBirthday: string
    willTurn: string
    bornOn: string
    totalDaysLived: string
    birthdayToday: string
    upcomingMilestones: string
    age: string
  }
  daysOfWeek: Record<string, string>
  validation: {
    birthDateRequired: string
    birthDateFuture: string
  }
}

interface BirthdayCalculatorProps {
  locale?: string
  translations: BirthdayTranslations
}

export function BirthdayCalculator({ locale = 'en-US', translations: t }: BirthdayCalculatorProps) {
  const [birthDateStr, setBirthDateStr] = useState<string>('')

  const birthDate = useMemo(() => {
    if (!birthDateStr) return null
    const date = new Date(birthDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [birthDateStr])

  const validation = useMemo(() => validateBirthdayInputs({ birthDate }), [birthDate])

  const getFieldError = useCallback((field: string): string | undefined => {
    const error = validation.errors.find((e) => e.field === field)
    if (!error) return undefined
    const key = error.message.split('.')[1] as keyof typeof t.validation
    return t.validation[key] || error.message
  }, [validation.errors, t.validation])

  const result: BirthdayResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateBirthday({ birthDate })
  }, [birthDate, validation.valid])

  const handleReset = useCallback(() => setBirthDateStr(''), [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="birthDate" className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.birthDate}
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className={`h-12 text-base ${getFieldError('birthDate') ? 'border-destructive' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {getFieldError('birthDate') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('birthDate')}
              </p>
            )}
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full h-12">{t.reset}</Button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                <CardContent className="p-6">
                  {result.isBirthdayToday ? (
                    <div className="flex items-center gap-3">
                      <PartyPopper className="h-8 w-8" />
                      <div className="text-2xl font-bold">{t.results.birthdayToday}</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-medium opacity-90 mb-2">{t.results.daysUntil}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{result.daysUntil}</span>
                        <span className="text-xl opacity-90">{t.results.days}</span>
                      </div>
                      <div className="mt-3 text-sm opacity-80">
                        {t.results.willTurn} {result.nextAge} on {t.daysOfWeek[result.nextBirthdayDayOfWeek]}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.bornOn}</div>
                      <div className="font-medium">{t.daysOfWeek[result.dayOfWeekBorn]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.totalDaysLived}</div>
                      <div className="font-medium">{formatNumber(result.totalDaysLived, locale)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.upcomingMilestones.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-3">{t.results.upcomingMilestones}</div>
                    <div className="space-y-2">
                      {result.upcomingMilestones.map((m) => (
                        <div key={m.age} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span className="font-medium">{m.age} {t.results.age}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(m.date, locale)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Cake className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.birthDate}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
