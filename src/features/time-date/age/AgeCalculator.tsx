'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calendar, Cake, Clock, Star, Users, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  calculateAge,
  validateAgeInputs,
  formatNumber,
  formatDate,
} from './calculations'
import type { AgeResult, ZodiacSign, Generation } from './types'

interface AgeCalculatorTranslations {
  birthDate: string
  targetDate: string
  useToday: string
  calculate: string
  reset: string
  results: {
    title: string
    age: string
    years: string
    months: string
    days: string
    nextBirthday: string
    daysUntil: string
    willTurn: string
    bornOn: string
    zodiacSign: string
    generation: string
    totalDays: string
    totalWeeks: string
    totalMonths: string
    totalHours: string
    totalMinutes: string
    birthdayToday: string
  }
  zodiacSigns: Record<ZodiacSign, string>
  generations: Record<Generation, string>
  daysOfWeek: Record<string, string>
  validation: {
    birthDateRequired: string
    birthDateInvalid: string
    birthDateFuture: string
    birthDateTooOld: string
    targetDateInvalid: string
  }
}

interface AgeCalculatorProps {
  locale?: string
  translations: AgeCalculatorTranslations
}

export function AgeCalculator({
  locale = 'en-US',
  translations: t,
}: AgeCalculatorProps) {
  // Input state
  const [birthDateStr, setBirthDateStr] = useState<string>('')
  const [targetDateStr, setTargetDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [useToday, setUseToday] = useState<boolean>(true)

  // Parse dates
  const birthDate = useMemo(() => {
    if (!birthDateStr) return null
    const date = new Date(birthDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [birthDateStr])

  const targetDate = useMemo(() => {
    if (useToday) return new Date()
    if (!targetDateStr) return new Date()
    const date = new Date(targetDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? new Date() : date
  }, [targetDateStr, useToday])

  // Validate inputs
  const validation = useMemo(() => {
    return validateAgeInputs({ birthDate, targetDate })
  }, [birthDate, targetDate])

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      return t.validation[error.message.split('.')[1] as keyof typeof t.validation] || error.message
    },
    [validation.errors, t.validation]
  )

  // Calculate result
  const result: AgeResult | null = useMemo(() => {
    if (!validation.valid || !birthDate) return null
    return calculateAge({ birthDate, targetDate })
  }, [birthDate, targetDate, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    setBirthDateStr('')
    setTargetDateStr(new Date().toISOString().split('T')[0])
    setUseToday(true)
  }, [])

  // Toggle use today
  const handleToggleUseToday = useCallback(() => {
    setUseToday(!useToday)
    if (!useToday) {
      setTargetDateStr(new Date().toISOString().split('T')[0])
    }
  }, [useToday])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `You are ${result.age.years} years, ${result.age.months} months, and ${result.age.days} days old`}
      </div>

      {/* Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Birth Date */}
          <div className="space-y-3">
            <Label htmlFor="birthDate" className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {t.birthDate}
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className={`h-12 text-base ${getFieldError('birthDate') ? 'border-destructive' : ''}`}
              max={new Date().toISOString().split('T')[0]}
              min="1900-01-01"
              aria-invalid={!!getFieldError('birthDate')}
              aria-describedby={getFieldError('birthDate') ? 'birthDate-error' : undefined}
            />
            {getFieldError('birthDate') && (
              <p id="birthDate-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('birthDate')}
              </p>
            )}
          </div>

          {/* Target Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="targetDate" className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {t.targetDate}
              </Label>
              <Button
                variant={useToday ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggleUseToday}
              >
                {t.useToday}
              </Button>
            </div>
            <Input
              id="targetDate"
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="h-12 text-base"
              disabled={useToday}
              aria-describedby="targetDate-hint"
            />
            <p id="targetDate-hint" className="text-sm text-muted-foreground">
              {useToday ? formatDate(new Date(), locale) : formatDate(targetDate, locale)}
            </p>
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full h-12">
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Hero Result - Age */}
              <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
                <CardContent className="p-6">
                  {result.isBirthdayToday && (
                    <div className="flex items-center gap-2 mb-3 text-sm font-medium opacity-90">
                      <Cake className="h-5 w-5" aria-hidden="true" />
                      {t.results.birthdayToday}
                    </div>
                  )}
                  <div className="text-sm font-medium opacity-90 mb-2">{t.results.age}</div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <div className="text-4xl md:text-5xl font-bold tracking-tight">
                      {result.age.years}
                    </div>
                    <div className="text-xl font-medium opacity-90">{t.results.years}</div>
                    <div className="text-2xl font-semibold">{result.age.months}</div>
                    <div className="text-lg opacity-90">{t.results.months}</div>
                    <div className="text-2xl font-semibold">{result.age.days}</div>
                    <div className="text-lg opacity-90">{t.results.days}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Birthday */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Cake className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="font-medium">{t.results.nextBirthday}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {result.nextBirthday.daysUntil}
                      </div>
                      <div className="text-sm text-muted-foreground">{t.results.daysUntil}</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {t.results.willTurn} {result.nextBirthday.age}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.daysOfWeek[result.nextBirthday.dayOfWeek]}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Birth Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t.results.bornOn}</div>
                        <div className="font-medium">{t.daysOfWeek[result.dayOfWeekBorn]}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t.results.zodiacSign}</div>
                        <div className="font-medium">{t.zodiacSigns[result.zodiacSign]}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 col-span-2">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t.results.generation}</div>
                        <div className="font-medium">{t.generations[result.generation]}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-muted-foreground">{t.birthDate}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Totals Section */}
      {result && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.results.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(result.totals.totalDays, locale)}
                </div>
                <div className="text-sm text-muted-foreground">{t.results.totalDays}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(result.totals.totalWeeks, locale)}
                </div>
                <div className="text-sm text-muted-foreground">{t.results.totalWeeks}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(result.totals.totalMonths, locale)}
                </div>
                <div className="text-sm text-muted-foreground">{t.results.totalMonths}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(result.totals.totalHours, locale)}
                </div>
                <div className="text-sm text-muted-foreground">{t.results.totalHours}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(result.totals.totalMinutes, locale)}
                </div>
                <div className="text-sm text-muted-foreground">{t.results.totalMinutes}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
