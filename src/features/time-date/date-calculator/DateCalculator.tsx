'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calendar, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  calculateDate,
  validateDateCalculatorInputs,
  formatDate,
  formatNumber,
} from './calculations'
import type { DateCalculatorMode, DateOperation, DateCalculatorResult } from './types'

interface DateCalculatorTranslations {
  modes: {
    difference: string
    addSubtract: string
  }
  inputs: {
    startDate: string
    endDate: string
    includeEndDate: string
    operation: string
    add: string
    subtract: string
    years: string
    months: string
    weeks: string
    days: string
  }
  results: {
    title: string
    difference: string
    resultDate: string
    totalDays: string
    totalWeeks: string
    totalMonths: string
    breakdown: string
    includesLeapDay: string
  }
  reset: string
  validation: {
    startDateRequired: string
    startDateInvalid: string
    endDateRequired: string
    endDateInvalid: string
  }
}

interface DateCalculatorProps {
  locale?: string
  translations: DateCalculatorTranslations
}

export function DateCalculator({
  locale = 'en-US',
  translations: t,
}: DateCalculatorProps) {
  // Mode state
  const [mode, setMode] = useState<DateCalculatorMode>('difference')

  // Difference mode state
  const [startDateStr, setStartDateStr] = useState<string>('')
  const [endDateStr, setEndDateStr] = useState<string>(new Date().toISOString().split('T')[0])
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false)

  // Add/subtract mode state
  const [addStartDateStr, setAddStartDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [operation, setOperation] = useState<DateOperation>('add')
  const [years, setYears] = useState<number>(0)
  const [months, setMonths] = useState<number>(0)
  const [weeks, setWeeks] = useState<number>(0)
  const [days, setDays] = useState<number>(0)

  // Parse dates
  const startDate = useMemo(() => {
    const dateStr = mode === 'difference' ? startDateStr : addStartDateStr
    if (!dateStr) return null
    const date = new Date(dateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [startDateStr, addStartDateStr, mode])

  const endDate = useMemo(() => {
    if (!endDateStr) return null
    const date = new Date(endDateStr + 'T00:00:00')
    return isNaN(date.getTime()) ? null : date
  }, [endDateStr])

  // Build inputs based on mode
  const inputs = useMemo(() => {
    if (mode === 'difference') {
      return {
        mode: 'difference' as const,
        startDate,
        endDate,
        includeEndDate,
      }
    } else {
      return {
        mode: 'add-subtract' as const,
        startDate,
        operation,
        years,
        months,
        weeks,
        days,
      }
    }
  }, [mode, startDate, endDate, includeEndDate, operation, years, months, weeks, days])

  // Validate inputs
  const validation = useMemo(() => {
    return validateDateCalculatorInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      const key = error.message.split('.')[1] as keyof typeof t.validation
      return t.validation[key] || error.message
    },
    [validation.errors, t.validation]
  )

  // Calculate result
  const result: DateCalculatorResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateDate(inputs)
  }, [inputs, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    if (mode === 'difference') {
      setStartDateStr('')
      setEndDateStr(new Date().toISOString().split('T')[0])
      setIncludeEndDate(false)
    } else {
      setAddStartDateStr(new Date().toISOString().split('T')[0])
      setYears(0)
      setMonths(0)
      setWeeks(0)
      setDays(0)
    }
  }, [mode])

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as DateCalculatorMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="difference">{t.modes.difference}</TabsTrigger>
          <TabsTrigger value="add-subtract">{t.modes.addSubtract}</TabsTrigger>
        </TabsList>

        {/* Difference Mode */}
        <TabsContent value="difference" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {/* Start Date */}
              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t.inputs.startDate}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className={`h-12 text-base ${getFieldError('startDate') ? 'border-destructive' : ''}`}
                  aria-invalid={!!getFieldError('startDate')}
                />
                {getFieldError('startDate') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('startDate')}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t.inputs.endDate}
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className={`h-12 text-base ${getFieldError('endDate') ? 'border-destructive' : ''}`}
                  aria-invalid={!!getFieldError('endDate')}
                />
                {getFieldError('endDate') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('endDate')}
                  </p>
                )}
              </div>

              {/* Include End Date */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="includeEndDate" className="text-sm cursor-pointer">
                  {t.inputs.includeEndDate}
                </Label>
                <Switch
                  id="includeEndDate"
                  checked={includeEndDate}
                  onCheckedChange={setIncludeEndDate}
                />
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full h-12">
                {t.reset}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result && result.mode === 'difference' ? (
                <>
                  <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium opacity-90 mb-2">{t.results.difference}</div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {result.breakdown.years > 0 && (
                          <>
                            <span className="text-4xl font-bold">{result.breakdown.years}</span>
                            <span className="text-lg opacity-90">{t.inputs.years}</span>
                          </>
                        )}
                        {result.breakdown.months > 0 && (
                          <>
                            <span className="text-3xl font-bold">{result.breakdown.months}</span>
                            <span className="text-lg opacity-90">{t.inputs.months}</span>
                          </>
                        )}
                        <span className="text-3xl font-bold">
                          {result.breakdown.weeks * 7 + result.breakdown.days}
                        </span>
                        <span className="text-lg opacity-90">{t.inputs.days}</span>
                      </div>
                      {result.includesLeapDay && (
                        <div className="mt-2 text-sm opacity-80">{t.results.includesLeapDay}</div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-3">{t.results.breakdown}</div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">
                            {formatNumber(result.breakdown.totalDays, locale)}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.results.totalDays}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">
                            {formatNumber(result.breakdown.totalWeeks, locale)}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.results.totalWeeks}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xl font-bold">
                            {formatNumber(result.breakdown.totalMonths, locale)}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.results.totalMonths}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t.inputs.startDate}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Add/Subtract Mode */}
        <TabsContent value="add-subtract" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {/* Start Date */}
              <div className="space-y-3">
                <Label htmlFor="addStartDate" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t.inputs.startDate}
                </Label>
                <Input
                  id="addStartDate"
                  type="date"
                  value={addStartDateStr}
                  onChange={(e) => setAddStartDateStr(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Operation Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={operation === 'add' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setOperation('add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.inputs.add}
                </Button>
                <Button
                  variant={operation === 'subtract' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setOperation('subtract')}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  {t.inputs.subtract}
                </Button>
              </div>

              {/* Time Period Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years">{t.inputs.years}</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="months">{t.inputs.months}</Label>
                  <Input
                    id="months"
                    type="number"
                    min="0"
                    value={months}
                    onChange={(e) => setMonths(parseInt(e.target.value) || 0)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeks">{t.inputs.weeks}</Label>
                  <Input
                    id="weeks"
                    type="number"
                    min="0"
                    value={weeks}
                    onChange={(e) => setWeeks(parseInt(e.target.value) || 0)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">{t.inputs.days}</Label>
                  <Input
                    id="days"
                    type="number"
                    min="0"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full h-12">
                {t.reset}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result && result.mode === 'add-subtract' ? (
                <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium opacity-90 mb-4">{t.results.resultDate}</div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-sm opacity-80">
                        {formatDate(result.startDate, locale)}
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-80" />
                    </div>
                    <div className="text-2xl font-bold">
                      {formatDate(result.resultDate, locale)}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t.inputs.startDate}</p>
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
