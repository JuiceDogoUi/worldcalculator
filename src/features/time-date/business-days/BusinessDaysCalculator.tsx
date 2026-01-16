'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calendar, Briefcase, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { calculateBusinessDays, validateBusinessDaysInputs, formatDate } from './calculations'
import type { CalculationMode, BusinessDaysResult } from './types'

interface BusinessDaysTranslations {
  modes: { between: string; add: string }
  inputs: {
    startDate: string
    endDate: string
    daysToAdd: string
    excludeWeekends: string
    excludeHolidays: string
  }
  results: {
    title: string
    businessDays: string
    calendarDays: string
    weekendDays: string
    holidaysExcluded: string
    resultDate: string
  }
  reset: string
  validation: {
    startDateRequired: string
    endDateRequired: string
    daysToAddRequired: string
  }
}

interface BusinessDaysCalculatorProps {
  locale?: string
  translations: BusinessDaysTranslations
}

export function BusinessDaysCalculator({
  locale = 'en-US',
  translations: t,
}: BusinessDaysCalculatorProps) {
  const [mode, setMode] = useState<CalculationMode>('between')
  const [startDateStr, setStartDateStr] = useState<string>(new Date().toISOString().split('T')[0])
  const [endDateStr, setEndDateStr] = useState<string>('')
  const [daysToAdd, setDaysToAdd] = useState<number>(10)
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true)
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(false)

  const startDate = useMemo(() => {
    if (!startDateStr) return null
    const date = new Date(startDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [startDateStr])

  const endDate = useMemo(() => {
    if (!endDateStr) return null
    const date = new Date(endDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [endDateStr])

  const inputs = useMemo(() => ({
    mode,
    startDate,
    endDate,
    daysToAdd,
    excludeWeekends,
    excludeHolidays,
    customHolidays: [],
  }), [mode, startDate, endDate, daysToAdd, excludeWeekends, excludeHolidays])

  const validation = useMemo(() => validateBusinessDaysInputs(inputs), [inputs])

  const getFieldError = useCallback((field: string): string | undefined => {
    const error = validation.errors.find((e) => e.field === field)
    if (!error) return undefined
    const key = error.message.split('.')[1] as keyof typeof t.validation
    return t.validation[key] || error.message
  }, [validation.errors, t.validation])

  const result: BusinessDaysResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateBusinessDays(inputs)
  }, [inputs, validation.valid])

  const handleReset = useCallback(() => {
    setStartDateStr(new Date().toISOString().split('T')[0])
    setEndDateStr('')
    setDaysToAdd(10)
    setExcludeWeekends(true)
    setExcludeHolidays(false)
  }, [])

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="between">{t.modes.between}</TabsTrigger>
          <TabsTrigger value="add">{t.modes.add}</TabsTrigger>
        </TabsList>

        <TabsContent value="between" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t.inputs.startDate}
                </Label>
                <Input id="startDate" type="date" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t.inputs.endDate}
                </Label>
                <Input id="endDate" type="date" value={endDateStr} onChange={(e) => setEndDateStr(e.target.value)} className={`h-12 ${getFieldError('endDate') ? 'border-destructive' : ''}`} />
                {getFieldError('endDate') && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4" />{getFieldError('endDate')}</p>}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="excludeWeekends" className="text-sm cursor-pointer">{t.inputs.excludeWeekends}</Label>
                  <Switch id="excludeWeekends" checked={excludeWeekends} onCheckedChange={setExcludeWeekends} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="excludeHolidays" className="text-sm cursor-pointer">{t.inputs.excludeHolidays}</Label>
                  <Switch id="excludeHolidays" checked={excludeHolidays} onCheckedChange={setExcludeHolidays} />
                </div>
              </div>
              <Button onClick={handleReset} variant="outline" className="w-full h-12">{t.reset}</Button>
            </div>
            <div className="space-y-6">
              {result ? (
                <>
                  <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium opacity-90 mb-2">{t.results.businessDays}</div>
                      <div className="text-5xl font-bold">{result.businessDays}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">{result.totalCalendarDays}</div>
                          <div className="text-xs text-muted-foreground">{t.results.calendarDays}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">{result.weekendDays}</div>
                          <div className="text-xs text-muted-foreground">{t.results.weekendDays}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">{result.holidaysExcluded}</div>
                          <div className="text-xs text-muted-foreground">{t.results.holidaysExcluded}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t.inputs.endDate}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="addStartDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t.inputs.startDate}
                </Label>
                <Input id="addStartDate" type="date" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="daysToAdd" className="text-base font-medium">{t.inputs.daysToAdd}</Label>
                <Input id="daysToAdd" type="number" min="0" value={daysToAdd} onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)} className="h-12" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="excludeWeekends2" className="text-sm cursor-pointer">{t.inputs.excludeWeekends}</Label>
                <Switch id="excludeWeekends2" checked={excludeWeekends} onCheckedChange={setExcludeWeekends} />
              </div>
              <Button onClick={handleReset} variant="outline" className="w-full h-12">{t.reset}</Button>
            </div>
            <div className="space-y-6">
              {result && result.mode === 'add' ? (
                <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium opacity-90 mb-2">{t.results.resultDate}</div>
                    <div className="text-2xl font-bold">{formatDate(result.endDate, locale)}</div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t.inputs.daysToAdd}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
