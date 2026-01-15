'use client'

import { useState, useMemo, useCallback } from 'react'
import { ArrowRightLeft, Copy, Check, Scale, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateWeightConversion,
  validateWeightInputs,
  getMetricUnits,
  getImperialUnits,
  getCommonConversions,
  formatWeightValue,
} from './calculations'
import type { WeightUnit, WeightConverterTranslations } from './types'

interface WeightConverterProps {
  locale: string
  translations: WeightConverterTranslations
}

export function WeightConverter({
  locale,
  translations: t,
}: WeightConverterProps) {
  // Input state
  const [inputValue, setInputValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState<WeightUnit>('kg')
  const [toUnit, setToUnit] = useState<WeightUnit>('lb')
  const [copied, setCopied] = useState(false)

  // Parse input value as number
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue)
    return isNaN(parsed) ? 0 : parsed
  }, [inputValue])

  // Validate inputs
  const validation = useMemo(() => {
    return validateWeightInputs({
      value: numericValue,
      fromUnit,
      toUnit,
    })
  }, [numericValue, fromUnit, toUnit])

  // Calculate conversion (0 is a valid value)
  const result = useMemo(() => {
    if (!validation.valid) return null

    return calculateWeightConversion(
      { value: numericValue, fromUnit, toUnit },
      locale
    )
  }, [numericValue, fromUnit, toUnit, validation.valid, locale])

  // Get common conversions
  const commonConversions = useMemo(() => {
    return getCommonConversions()
  }, [])

  // Handle swap units
  const handleSwap = useCallback(() => {
    const tempFrom = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempFrom)
    // Also set input to the result value for continuity
    if (result) {
      setInputValue(result.outputValue.toString())
    }
  }, [fromUnit, toUnit, result])

  // Handle reset
  const handleReset = useCallback(() => {
    setInputValue('1')
    setFromUnit('kg')
    setToUnit('lb')
  }, [])

  // Handle copy to clipboard
  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.outputValue.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  // Handle common conversion click
  const handleCommonConversion = useCallback(
    (from: WeightUnit, to: WeightUnit, value: number) => {
      setFromUnit(from)
      setToUnit(to)
      setInputValue(value.toString())
    },
    []
  )

  // Get unit label with abbreviation
  const getUnitLabel = useCallback(
    (unit: WeightUnit) => {
      const unitInfo = t.units[unit]
      return `${unitInfo.name} (${unitInfo.abbr})`
    },
    [t.units]
  )

  // Get unit abbreviation only
  const getUnitAbbr = useCallback(
    (unit: WeightUnit) => {
      return t.units[unit].abbr
    },
    [t.units]
  )

  const metricUnits = getMetricUnits()
  const imperialUnits = getImperialUnits()

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${result.inputValue} ${getUnitAbbr(result.inputUnit)} = ${result.formattedOutput} ${getUnitAbbr(result.outputUnit)}`}
      </div>

      {/* Main Converter Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* From Value Input */}
          <div className="space-y-3">
            <Label htmlFor="fromValue" className="flex items-center gap-2 text-base">
              <Scale className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.fromValue}
            </Label>
            <Input
              id="fromValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg h-12"
              min={0}
              step="any"
              aria-label={t.fromValue}
            />
          </div>

          {/* From Unit Select */}
          <div className="space-y-3">
            <Label htmlFor="fromUnit" className="text-base">
              {t.fromUnit}
            </Label>
            <Select value={fromUnit} onValueChange={(v: WeightUnit) => setFromUnit(v)}>
              <SelectTrigger className="h-12 text-base" id="fromUnit">
                <SelectValue>{getUnitLabel(fromUnit)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t.metricUnits}</SelectLabel>
                  {metricUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {getUnitLabel(unit)}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>{t.imperialUnits}</SelectLabel>
                  {imperialUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {getUnitLabel(unit)}
                    </SelectItem>
                  ))}
                </SelectGroup>
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
              <ArrowRightLeft className="h-5 w-5" />
              {t.swap}
            </Button>
          </div>

          {/* To Unit Select */}
          <div className="space-y-3">
            <Label htmlFor="toUnit" className="text-base">
              {t.toUnit}
            </Label>
            <Select value={toUnit} onValueChange={(v: WeightUnit) => setToUnit(v)}>
              <SelectTrigger className="h-12 text-base" id="toUnit">
                <SelectValue>{getUnitLabel(toUnit)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t.metricUnits}</SelectLabel>
                  {metricUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {getUnitLabel(unit)}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>{t.imperialUnits}</SelectLabel>
                  {imperialUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {getUnitLabel(unit)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="space-y-6">
          {/* Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">{t.result}</div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  {result ? result.formattedOutput : '0'}
                </div>
                <div className="text-2xl font-medium opacity-90">
                  {getUnitAbbr(toUnit)}
                </div>
              </div>
              {result && (
                <div className="mt-4 text-sm opacity-80">
                  {formatWeightValue(result.inputValue, locale)} {getUnitAbbr(fromUnit)}{' '}
                  = {result.formattedOutput} {getUnitAbbr(toUnit)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Copy Button */}
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!result}
            className="w-full h-12 gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t.copy}
              </>
            )}
          </Button>

          {/* Conversion Display */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4 text-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatWeightValue(result.inputValue, locale)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {t.units[fromUnit].name}
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {result.formattedOutput}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {t.units[toUnit].name}
                    </div>
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commonConversions.map((conv, index) => (
              <button
                key={index}
                onClick={() => handleCommonConversion(conv.from, conv.to, conv.fromValue)}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              >
                <span className="text-sm">
                  <span className="font-medium">{conv.fromValue}</span>{' '}
                  <span className="text-muted-foreground">{getUnitAbbr(conv.from)}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">
                    {formatWeightValue(conv.toValue, locale)}
                  </span>{' '}
                  <span className="text-muted-foreground">{getUnitAbbr(conv.to)}</span>
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
