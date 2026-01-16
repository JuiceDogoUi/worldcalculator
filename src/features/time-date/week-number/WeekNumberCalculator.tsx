'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calendar, Hash, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateWeekNumber, validateWeekNumberInputs, formatDate } from './calculations'
import type { WeekNumberResult } from './types'

interface WeekNumberTranslations {
  date: string
  today: string
  reset: string
  results: {
    weekNumber: string
    week: string
    of: string
    isoYear: string
    dayOfWeek: string
    dayOfYear: string
    quarter: string
    weekRange: string
    currentWeek: string
  }
  daysOfWeek: Record<string, string>
  validation: { dateRequired: string }
}

interface WeekNumberCalculatorProps {
  locale?: string
  translations: WeekNumberTranslations
}

export function WeekNumberCalculator({ locale = 'en-US', translations: t }: WeekNumberCalculatorProps) {
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0])

  const date = useMemo(() => {
    if (!dateStr) return null
    const d = new Date(dateStr + 'T00:00:00')
    return isNaN(d.getTime()) ? null : d
  }, [dateStr])

  const validation = useMemo(() => validateWeekNumberInputs({ date }), [date])

  const getFieldError = useCallback((field: string): string | undefined => {
    const error = validation.errors.find((e) => e.field === field)
    if (!error) return undefined
    return t.validation.dateRequired
  }, [validation.errors, t.validation])

  const result: WeekNumberResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateWeekNumber({ date })
  }, [date, validation.valid])

  const handleToday = useCallback(() => setDateStr(new Date().toISOString().split('T')[0]), [])
  const handleReset = useCallback(() => setDateStr(new Date().toISOString().split('T')[0]), [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.date}
            </Label>
            <div className="flex gap-2">
              <Input
                id="date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className={`h-12 text-base flex-1 ${getFieldError('date') ? 'border-destructive' : ''}`}
              />
              <Button onClick={handleToday} variant="outline" className="h-12">{t.today}</Button>
            </div>
            {getFieldError('date') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('date')}
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
                  <div className="text-sm font-medium opacity-90 mb-2">{t.results.weekNumber}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{result.weekNumber}</span>
                    <span className="text-xl opacity-90">{t.results.of} {result.weeksInYear}</span>
                  </div>
                  {result.isCurrentWeek && (
                    <div className="mt-2 text-sm opacity-80">{t.results.currentWeek}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.isoYear}</div>
                      <div className="font-bold text-lg">{result.isoYear}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.dayOfWeek}</div>
                      <div className="font-medium">{t.daysOfWeek[result.dayOfWeekName]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.dayOfYear}</div>
                      <div className="font-medium">{result.dayOfYear}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t.results.quarter}</div>
                      <div className="font-medium">Q{result.quarter}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">{t.results.weekRange}</div>
                  <div className="font-medium">
                    {formatDate(result.weekStart, locale)} - {formatDate(result.weekEnd, locale)}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.date}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
