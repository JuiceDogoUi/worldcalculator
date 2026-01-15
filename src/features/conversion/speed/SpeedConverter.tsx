'use client'

import { useState, useMemo, useCallback } from 'react'
import { ArrowRightLeft, Gauge, Info } from 'lucide-react'
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
import type { SpeedUnit } from './types'
import { SPEED_UNITS } from './types'
import {
  calculateSpeedConversion,
  validateSpeedInputs,
  getClosestContext,
  convertSpeed,
} from './calculations'

interface SpeedConverterTranslations {
  value: string
  fromUnit: string
  toUnit: string
  result: string
  swap: string
  reset: string
  allConversions: string
  contextTitle: string
  units: {
    kmh: string
    mph: string
    ms: string
    fts: string
    knots: string
  }
  contexts: {
    walking: string
    running: string
    cycling: string
    cityDriving: string
    highwayDriving: string
    lightWind: string
    strongWind: string
    commercialAircraft: string
    fastTrain: string
    speedOfSound: string
  }
  validation?: {
    required?: string
    negative?: string
    invalid?: string
  }
}

interface SpeedConverterProps {
  locale?: string
  translations: SpeedConverterTranslations
}

export function SpeedConverter({
  locale = 'en-US',
  translations: t,
}: SpeedConverterProps) {
  // Input state
  const [inputValue, setInputValue] = useState<string>('100')
  const [fromUnit, setFromUnit] = useState<SpeedUnit>('kmh')
  const [toUnit, setToUnit] = useState<SpeedUnit>('mph')

  // Parse input value
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue)
    return isNaN(parsed) ? 0 : parsed
  }, [inputValue])

  // Validate inputs
  const validation = useMemo(() => {
    return validateSpeedInputs(numericValue)
  }, [numericValue])

  // Calculate conversion result (0 is a valid value)
  const result = useMemo(() => {
    if (!validation.valid) return null
    return calculateSpeedConversion(numericValue, fromUnit, toUnit)
  }, [numericValue, fromUnit, toUnit, validation.valid])

  // Get speed in m/s for context matching
  const speedInMs = useMemo(() => {
    if (!validation.valid) return 0
    return convertSpeed(numericValue, fromUnit, 'ms')
  }, [numericValue, fromUnit, validation.valid])

  // Get closest context example
  const closestContext = useMemo(() => {
    return getClosestContext(speedInMs)
  }, [speedInMs])

  // Handle swap units
  const handleSwapUnits = useCallback(() => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }, [fromUnit, toUnit])

  // Handle reset
  const handleReset = useCallback(() => {
    setInputValue('100')
    setFromUnit('kmh')
    setToUnit('mph')
  }, [])

  // Format number for display based on locale
  const formatNumber = useCallback(
    (value: number): string => {
      if (value === 0) return '0'

      // For very large numbers, use fewer decimals
      if (Math.abs(value) >= 10000) {
        return value.toLocaleString(locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      }

      // For very small numbers, show more precision
      if (Math.abs(value) < 0.01 && value !== 0) {
        return value.toExponential(2)
      }

      return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      })
    },
    [locale]
  )

  // Get unit name from translations
  const getUnitName = useCallback(
    (unit: SpeedUnit): string => {
      return t.units[unit]
    },
    [t.units]
  )

  // Get context translation
  const getContextName = useCallback(
    (contextId: string): string => {
      const contextKey = contextId as keyof typeof t.contexts
      return t.contexts[contextKey] || contextId
    },
    [t.contexts]
  )

  // Unit options for dropdown
  const unitOptions: SpeedUnit[] = ['kmh', 'mph', 'ms', 'fts', 'knots']

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${formatNumber(result.inputValue)} ${getUnitName(result.inputUnit)} equals ${formatNumber(result.outputValue)} ${getUnitName(result.outputUnit)}`}
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Input Value */}
          <div className="space-y-3">
            <Label
              htmlFor="speedValue"
              id="speedValue-label"
              className="flex items-center gap-2 text-base"
            >
              <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.value}
            </Label>
            <Input
              id="speedValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`text-lg h-12 ${!validation.valid && inputValue ? 'border-destructive' : ''}`}
              min={0}
              step="any"
              aria-labelledby="speedValue-label"
              aria-invalid={!validation.valid}
              aria-describedby={!validation.valid ? 'speedValue-error' : undefined}
            />
            {!validation.valid && inputValue && (
              <p
                id="speedValue-error"
                className="text-sm text-destructive flex items-center gap-1"
              >
                {validation.errors[0]?.message}
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
              onValueChange={(value: SpeedUnit) => setFromUnit(value)}
            >
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="fromUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitName(unit)} ({SPEED_UNITS[unit].abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapUnits}
              className="gap-2"
              aria-label={t.swap}
            >
              <ArrowRightLeft className="h-4 w-4" />
              {t.swap}
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-3">
            <Label htmlFor="toUnit" id="toUnit-label" className="text-base">
              {t.toUnit}
            </Label>
            <Select
              value={toUnit}
              onValueChange={(value: SpeedUnit) => setToUnit(value)}
            >
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="toUnit-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {getUnitName(unit)} ({SPEED_UNITS[unit].abbreviation})
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

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">{t.result}</div>
              <div className="text-4xl md:text-5xl font-bold tracking-tight">
                {result ? formatNumber(result.outputValue) : '--'}
              </div>
              <div className="mt-2 text-lg opacity-90">
                {result
                  ? `${SPEED_UNITS[result.outputUnit].abbreviation}`
                  : '--'}
              </div>
              {result && (
                <div className="mt-3 text-sm opacity-80">
                  {formatNumber(result.inputValue)}{' '}
                  {SPEED_UNITS[result.inputUnit].abbreviation} ={' '}
                  {formatNumber(result.outputValue)}{' '}
                  {SPEED_UNITS[result.outputUnit].abbreviation}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Context Example Card */}
          {closestContext && speedInMs > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.contextTitle}
                    </div>
                    <p className="text-foreground">
                      {getContextName(closestContext.id)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Conversions Card */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {t.allConversions}
                </div>
                <div className="space-y-3">
                  {unitOptions.map((unit) => (
                    <div
                      key={unit}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        unit === toUnit
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <span className="text-muted-foreground">
                        {getUnitName(unit)}
                      </span>
                      <span className="font-medium">
                        {formatNumber(result.allConversions[unit])}{' '}
                        <span className="text-muted-foreground text-sm">
                          {SPEED_UNITS[unit].abbreviation}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
