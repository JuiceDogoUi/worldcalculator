'use client'

import { useState, useMemo, useCallback } from 'react'
import { ArrowRightLeft, Ruler } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AreaUnit } from './types'
import {
  AREA_UNITS,
  UNIT_ORDER,
  convertArea,
  convertToAllUnits,
  formatAreaValue,
  getUnitAbbreviation,
  validateAreaInputs,
} from './calculations'

interface UnitTranslations {
  mm2: { name: string; abbr: string }
  cm2: { name: string; abbr: string }
  m2: { name: string; abbr: string }
  km2: { name: string; abbr: string }
  hectare: { name: string; abbr: string }
  in2: { name: string; abbr: string }
  ft2: { name: string; abbr: string }
  yd2: { name: string; abbr: string }
  acre: { name: string; abbr: string }
  mi2: { name: string; abbr: string }
}

interface AreaConverterTranslations {
  value: string
  fromUnit: string
  toUnit: string
  result: string
  allConversions: string
  metricUnits: string
  imperialUnits: string
  swap: string
  reset: string
  formula: string
  conversionFactor: string
  realEstateContext: string
  landMeasurement: string
  units: UnitTranslations
  validation: {
    valueRequired: string
    valueNegative: string
    valueInvalid: string
    valueMax: string
  }
}

interface AreaConverterProps {
  locale?: string
  translations: AreaConverterTranslations
}

export function AreaConverter({
  locale = 'en-US',
  translations: t,
}: AreaConverterProps) {
  // Input state
  const [inputValue, setInputValue] = useState<string>('100')
  const [fromUnit, setFromUnit] = useState<AreaUnit>('m2')
  const [toUnit, setToUnit] = useState<AreaUnit>('ft2')

  // Parse input value
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue)
    return isNaN(parsed) ? 0 : parsed
  }, [inputValue])

  // Validation
  const validation = useMemo(() => {
    return validateAreaInputs({
      value: numericValue,
      fromUnit,
      toUnit,
    })
  }, [numericValue, fromUnit, toUnit])

  // Get translated error message
  const getErrorMessage = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined

      // Map internal error to translated message
      if (error.message.includes('required')) return t.validation.valueRequired
      if (error.message.includes('negative')) return t.validation.valueNegative
      if (error.message.includes('valid')) return t.validation.valueInvalid
      if (error.message.includes('maximum')) return t.validation.valueMax
      return error.message
    },
    [validation.errors, t.validation]
  )

  // Conversion result
  const result = useMemo(() => {
    if (!validation.valid) return null
    return convertArea({ value: numericValue, fromUnit, toUnit })
  }, [numericValue, fromUnit, toUnit, validation.valid])

  // All conversions
  const allConversions = useMemo(() => {
    if (!validation.valid || numericValue === 0) return null
    return convertToAllUnits(numericValue, fromUnit)
  }, [numericValue, fromUnit, validation.valid])

  // Handlers
  const handleSwapUnits = useCallback(() => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }, [fromUnit, toUnit])

  const handleReset = useCallback(() => {
    setInputValue('100')
    setFromUnit('m2')
    setToUnit('ft2')
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    []
  )

  // Get unit display name
  const getUnitDisplayName = useCallback(
    (unit: AreaUnit) => {
      return t.units[unit]?.name || unit
    },
    [t.units]
  )

  // Get unit abbreviation from translations or fallback
  const getUnitAbbr = useCallback(
    (unit: AreaUnit) => {
      return t.units[unit]?.abbr || getUnitAbbreviation(unit)
    },
    [t.units]
  )

  // Separate metric and imperial units
  const metricUnits = UNIT_ORDER.filter(
    (u) => AREA_UNITS[u].system === 'metric'
  )
  const imperialUnits = UNIT_ORDER.filter(
    (u) => AREA_UNITS[u].system === 'imperial'
  )

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${formatAreaValue(result.inputValue, locale)} ${getUnitDisplayName(result.inputUnit)} = ${formatAreaValue(result.outputValue, locale)} ${getUnitDisplayName(result.outputUnit)}`}
      </div>

      {/* Main Converter */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Value Input */}
          <div className="space-y-3">
            <Label
              htmlFor="areaValue"
              id="areaValue-label"
              className="flex items-center gap-2 text-base"
            >
              <Ruler className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.value}
            </Label>
            <Input
              id="areaValue"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className={`text-lg h-12 ${getErrorMessage('value') ? 'border-destructive' : ''}`}
              min={0}
              step="any"
              aria-labelledby="areaValue-label"
              aria-invalid={!!getErrorMessage('value')}
              aria-describedby={
                getErrorMessage('value') ? 'areaValue-error' : undefined
              }
            />
            {getErrorMessage('value') && (
              <p id="areaValue-error" className="text-sm text-destructive">
                {getErrorMessage('value')}
              </p>
            )}
          </div>

          {/* From Unit */}
          <div className="space-y-3">
            <Label
              htmlFor="fromUnit"
              id="fromUnit-label"
              className="text-base"
            >
              {t.fromUnit}
            </Label>
            <Select
              value={fromUnit}
              onValueChange={(value: AreaUnit) => setFromUnit(value)}
            >
              <SelectTrigger
                id="fromUnit"
                className="h-12 text-base"
                aria-labelledby="fromUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {t.metricUnits}
                </div>
                {metricUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitDisplayName(unit)} ({getUnitAbbr(unit)})
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                  {t.imperialUnits}
                </div>
                {imperialUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitDisplayName(unit)} ({getUnitAbbr(unit)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              aria-label={t.swap}
              className="h-10 w-10 rounded-full"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-3">
            <Label htmlFor="toUnit" id="toUnit-label" className="text-base">
              {t.toUnit}
            </Label>
            <Select
              value={toUnit}
              onValueChange={(value: AreaUnit) => setToUnit(value)}
            >
              <SelectTrigger
                id="toUnit"
                className="h-12 text-base"
                aria-labelledby="toUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {t.metricUnits}
                </div>
                {metricUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitDisplayName(unit)} ({getUnitAbbr(unit)})
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                  {t.imperialUnits}
                </div>
                {imperialUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitDisplayName(unit)} ({getUnitAbbr(unit)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.result}
              </div>
              <div className="text-4xl md:text-5xl font-bold tracking-tight break-all">
                {result
                  ? formatAreaValue(result.outputValue, locale)
                  : '--'}
              </div>
              {result && (
                <div className="mt-3 text-lg opacity-90">
                  {getUnitAbbr(result.outputUnit)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Formula */}
          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t.formula}
                </div>
                <div className="text-center py-3 px-4 bg-muted rounded-lg">
                  <span className="font-mono text-sm">
                    {formatAreaValue(result.inputValue, locale)}{' '}
                    {getUnitAbbr(result.inputUnit)} ={' '}
                    {formatAreaValue(result.outputValue, locale)}{' '}
                    {getUnitAbbr(result.outputUnit)}
                  </span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  {t.conversionFactor}: {result.formula}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Conversions */}
          {allConversions && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {t.allConversions}
                </div>

                {/* Metric Units */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    {t.metricUnits}
                  </div>
                  <div className="space-y-2">
                    {allConversions.conversions
                      .filter((c) => c.system === 'metric')
                      .map((conversion) => (
                        <div
                          key={conversion.unit}
                          className={`flex justify-between items-center py-2 px-3 rounded ${
                            conversion.unit === fromUnit
                              ? 'bg-primary/10 font-medium'
                              : 'bg-muted/50'
                          }`}
                        >
                          <span className="text-sm">
                            {getUnitDisplayName(conversion.unit)}
                          </span>
                          <span className="font-mono text-sm">
                            {formatAreaValue(conversion.value, locale)}{' '}
                            {getUnitAbbr(conversion.unit)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Imperial Units */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    {t.imperialUnits}
                  </div>
                  <div className="space-y-2">
                    {allConversions.conversions
                      .filter((c) => c.system === 'imperial')
                      .map((conversion) => (
                        <div
                          key={conversion.unit}
                          className={`flex justify-between items-center py-2 px-3 rounded ${
                            conversion.unit === fromUnit
                              ? 'bg-primary/10 font-medium'
                              : 'bg-muted/50'
                          }`}
                        >
                          <span className="text-sm">
                            {getUnitDisplayName(conversion.unit)}
                          </span>
                          <span className="font-mono text-sm">
                            {formatAreaValue(conversion.value, locale)}{' '}
                            {getUnitAbbr(conversion.unit)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
