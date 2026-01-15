'use client'

import { useState, useMemo, useCallback } from 'react'
import { ArrowLeftRight, ArrowDown, AlertCircle } from 'lucide-react'
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
import {
  convertLength,
  convertToAllUnits,
  validateInputs,
  formatConversionValue,
  METRIC_UNITS,
  IMPERIAL_UNITS,
  COMMON_CONVERSIONS,
  getUnitSystem,
  isCrossSystemConversion,
} from './calculations'
import type { LengthUnit, LengthValidation } from './types'

interface UnitTranslations {
  mm: { name: string; abbr: string }
  cm: { name: string; abbr: string }
  m: { name: string; abbr: string }
  km: { name: string; abbr: string }
  in: { name: string; abbr: string }
  ft: { name: string; abbr: string }
  yd: { name: string; abbr: string }
  mi: { name: string; abbr: string }
}

interface LengthConverterTranslations {
  inputValue: string
  fromUnit: string
  toUnit: string
  result: string
  swap: string
  reset: string
  allConversions: string
  commonConversions: string
  metricUnits: string
  imperialUnits: string
  conversionFactor: string
  units: UnitTranslations
  validation: {
    required: string
    invalidNumber: string
    negativeValue: string
    invalidUnit: string
  }
}

interface LengthConverterProps {
  locale?: string
  translations: LengthConverterTranslations
}

export function LengthConverter({
  locale = 'en-US',
  translations: t,
}: LengthConverterProps) {
  // Input state
  const [inputValue, setInputValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState<LengthUnit>('m')
  const [toUnit, setToUnit] = useState<LengthUnit>('ft')

  // Parse input value
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue)
    return isNaN(parsed) ? 0 : parsed
  }, [inputValue])

  // Validate inputs
  const validation: LengthValidation = useMemo(() => {
    return validateInputs({
      value: numericValue,
      fromUnit,
      toUnit,
    })
  }, [numericValue, fromUnit, toUnit])

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate conversion result
  const result = useMemo(() => {
    if (!validation.valid || numericValue === 0) {
      return convertLength({ value: 0, fromUnit, toUnit })
    }
    return convertLength({ value: numericValue, fromUnit, toUnit })
  }, [numericValue, fromUnit, toUnit, validation.valid])

  // Calculate all unit conversions
  const allConversions = useMemo(() => {
    if (!validation.valid || numericValue === 0) {
      return convertToAllUnits(0, fromUnit)
    }
    return convertToAllUnits(numericValue, fromUnit)
  }, [numericValue, fromUnit, validation.valid])

  // Swap units handler
  const handleSwap = useCallback(() => {
    const tempFrom = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempFrom)
  }, [fromUnit, toUnit])

  // Reset handler
  const handleReset = useCallback(() => {
    setInputValue('1')
    setFromUnit('m')
    setToUnit('ft')
  }, [])

  // Format number for locale
  const formatNumber = useCallback(
    (value: number) => {
      return value.toLocaleString(locale, {
        maximumFractionDigits: 6,
      })
    },
    [locale]
  )

  // Get unit display name
  const getUnitName = useCallback(
    (unit: LengthUnit) => {
      return t.units[unit].name
    },
    [t.units]
  )

  // Get unit abbreviation
  const getUnitAbbr = useCallback(
    (unit: LengthUnit) => {
      return t.units[unit].abbr
    },
    [t.units]
  )

  // Render unit select option
  const renderUnitOption = useCallback(
    (unit: LengthUnit) => (
      <SelectItem key={unit} value={unit}>
        <span className="flex items-center gap-2">
          <span className="font-medium">{getUnitAbbr(unit)}</span>
          <span className="text-muted-foreground">- {getUnitName(unit)}</span>
        </span>
      </SelectItem>
    ),
    [getUnitAbbr, getUnitName]
  )

  // Check if cross-system conversion
  const isCrossSystem = isCrossSystemConversion(fromUnit, toUnit)

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {validation.valid &&
          numericValue > 0 &&
          `${formatConversionValue(result.inputValue)} ${getUnitName(fromUnit)} equals ${formatConversionValue(result.outputValue)} ${getUnitName(toUnit)}`}
      </div>

      {/* Main Converter Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Input Value */}
          <div className="space-y-3">
            <Label
              htmlFor="inputValue"
              id="inputValue-label"
              className="text-base font-medium"
            >
              {t.inputValue}
            </Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`text-lg h-12 ${getFieldError('value') ? 'border-destructive' : ''}`}
              min={0}
              step="any"
              aria-labelledby="inputValue-label"
              aria-invalid={!!getFieldError('value')}
              aria-describedby={
                getFieldError('value') ? 'inputValue-error' : undefined
              }
            />
            {getFieldError('value') && (
              <p
                id="inputValue-error"
                className="text-sm text-destructive flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('value')}
              </p>
            )}
          </div>

          {/* From Unit */}
          <div className="space-y-3">
            <Label
              htmlFor="fromUnit"
              id="fromUnit-label"
              className="text-base font-medium"
            >
              {t.fromUnit}
            </Label>
            <Select
              value={fromUnit}
              onValueChange={(value: LengthUnit) => setFromUnit(value)}
            >
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="fromUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {t.metricUnits}
                </div>
                {METRIC_UNITS.map(renderUnitOption)}
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                  {t.imperialUnits}
                </div>
                {IMPERIAL_UNITS.map(renderUnitOption)}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSwap}
              className="gap-2"
              aria-label={t.swap}
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              {t.swap}
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-3">
            <Label
              htmlFor="toUnit"
              id="toUnit-label"
              className="text-base font-medium"
            >
              {t.toUnit}
            </Label>
            <Select
              value={toUnit}
              onValueChange={(value: LengthUnit) => setToUnit(value)}
            >
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="toUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {t.metricUnits}
                </div>
                {METRIC_UNITS.map(renderUnitOption)}
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                  {t.imperialUnits}
                </div>
                {IMPERIAL_UNITS.map(renderUnitOption)}
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

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.result}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  {validation.valid && numericValue > 0
                    ? formatConversionValue(result.outputValue)
                    : '--'}
                </div>
                <div className="text-2xl font-medium opacity-90">
                  {getUnitAbbr(toUnit)}
                </div>
              </div>
              {validation.valid && numericValue > 0 && (
                <div className="mt-3 text-sm opacity-80">
                  {formatConversionValue(result.inputValue)} {getUnitAbbr(fromUnit)}{' '}
                  <ArrowDown className="inline h-3 w-3 mx-1" aria-hidden="true" />
                  {formatConversionValue(result.outputValue)} {getUnitAbbr(toUnit)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Factor Info */}
          {validation.valid && numericValue > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  {t.conversionFactor}
                </div>
                <div className="font-mono text-lg">
                  1 {getUnitAbbr(fromUnit)} = {formatConversionValue(result.conversionFactor)}{' '}
                  {getUnitAbbr(toUnit)}
                </div>
                {isCrossSystem && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {getUnitSystem(fromUnit) === 'metric'
                      ? `${t.metricUnits} → ${t.imperialUnits}`
                      : `${t.imperialUnits} → ${t.metricUnits}`}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All Conversions */}
          {validation.valid && numericValue > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {t.allConversions}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Metric Units */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t.metricUnits}
                    </div>
                    {allConversions.conversions
                      .filter((c) => METRIC_UNITS.includes(c.unit))
                      .map((conversion) => (
                        <div
                          key={conversion.unit}
                          className={`flex justify-between items-center p-2 rounded ${
                            conversion.unit === fromUnit
                              ? 'bg-primary/10 font-medium'
                              : 'bg-muted/50'
                          }`}
                        >
                          <span className="text-muted-foreground">
                            {getUnitAbbr(conversion.unit)}
                          </span>
                          <span className="font-mono">
                            {formatConversionValue(conversion.value)}
                          </span>
                        </div>
                      ))}
                  </div>
                  {/* Imperial Units */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t.imperialUnits}
                    </div>
                    {allConversions.conversions
                      .filter((c) => IMPERIAL_UNITS.includes(c.unit))
                      .map((conversion) => (
                        <div
                          key={conversion.unit}
                          className={`flex justify-between items-center p-2 rounded ${
                            conversion.unit === fromUnit
                              ? 'bg-primary/10 font-medium'
                              : 'bg-muted/50'
                          }`}
                        >
                          <span className="text-muted-foreground">
                            {getUnitAbbr(conversion.unit)}
                          </span>
                          <span className="font-mono">
                            {formatConversionValue(conversion.value)}
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

      {/* Common Conversions Reference */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.commonConversions}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COMMON_CONVERSIONS.map((conv, index) => (
              <div
                key={index}
                className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
              >
                <div className="font-mono text-sm">
                  {conv.fromValue} {getUnitAbbr(conv.fromUnit)}
                </div>
                <div className="text-muted-foreground text-xs my-1">=</div>
                <div className="font-mono text-sm font-medium">
                  {formatNumber(conv.toValue)} {getUnitAbbr(conv.toUnit)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
