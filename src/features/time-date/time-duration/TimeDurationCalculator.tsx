'use client'

import { useState, useMemo, useCallback } from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { calculateTimeDuration, validateTimeDurationInputs, formatDecimalHours } from './calculations'
import type { TimeDurationResult } from './types'

interface TimeDurationTranslations {
  startTime: string
  endTime: string
  crossesMidnight: string
  reset: string
  results: {
    title: string
    duration: string
    hours: string
    minutes: string
    totalMinutes: string
    totalSeconds: string
    decimalHours: string
  }
  validation: {
    startTimeRequired: string
    startTimeInvalid: string
    endTimeRequired: string
    endTimeInvalid: string
  }
}

interface TimeDurationCalculatorProps {
  locale?: string
  translations: TimeDurationTranslations
}

export function TimeDurationCalculator({
  locale = 'en-US',
  translations: t,
}: TimeDurationCalculatorProps) {
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('17:00')
  const [crossesMidnight, setCrossesMidnight] = useState<boolean>(false)

  const validation = useMemo(() => {
    return validateTimeDurationInputs({ startTime, endTime, crossesMidnight })
  }, [startTime, endTime, crossesMidnight])

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      const key = error.message.split('.')[1] as keyof typeof t.validation
      return t.validation[key] || error.message
    },
    [validation.errors, t.validation]
  )

  const result: TimeDurationResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateTimeDuration({ startTime, endTime, crossesMidnight })
  }, [startTime, endTime, crossesMidnight, validation.valid])

  const handleReset = useCallback(() => {
    setStartTime('09:00')
    setEndTime('17:00')
    setCrossesMidnight(false)
  }, [])

  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="startTime" className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {t.startTime}
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`h-12 text-base ${getFieldError('startTime') ? 'border-destructive' : ''}`}
            />
            {getFieldError('startTime') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('startTime')}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="endTime" className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {t.endTime}
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`h-12 text-base ${getFieldError('endTime') ? 'border-destructive' : ''}`}
            />
            {getFieldError('endTime') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('endTime')}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <Label htmlFor="crossesMidnight" className="text-sm cursor-pointer">
              {t.crossesMidnight}
            </Label>
            <Switch
              id="crossesMidnight"
              checked={crossesMidnight}
              onCheckedChange={setCrossesMidnight}
            />
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full h-12">
            {t.reset}
          </Button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                <CardContent className="p-6">
                  <div className="text-sm font-medium opacity-90 mb-2">{t.results.duration}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold">{result.hours}</span>
                    <span className="text-xl opacity-90">{t.results.hours}</span>
                    <span className="text-3xl font-bold">{result.minutes}</span>
                    <span className="text-xl opacity-90">{t.results.minutes}</span>
                  </div>
                  <div className="mt-3 text-lg opacity-80">{result.formatted}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xl font-bold">{formatNumber(result.totalMinutes)}</div>
                      <div className="text-xs text-muted-foreground">{t.results.totalMinutes}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xl font-bold">{formatNumber(result.totalSeconds)}</div>
                      <div className="text-xs text-muted-foreground">{t.results.totalSeconds}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xl font-bold">{formatDecimalHours(result.decimalHours)}</div>
                      <div className="text-xs text-muted-foreground">{t.results.decimalHours}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.startTime}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
