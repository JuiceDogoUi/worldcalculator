'use client'

import { useState, useMemo, useCallback } from 'react'
import { ArrowRightLeft, Copy, Check, ArrowDown } from 'lucide-react'
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
  convertVolume,
  convertToAllUnits,
  validateVolumeInputs,
  formatVolumeValue,
  getVolumeUnitsBySystem,
  getVolumeUnitInfo,
  VOLUME_UNITS,
} from './calculations'
import type { VolumeUnit, MeasurementSystem } from './types'

interface UnitTranslations {
  milliliter: string
  liter: string
  'cubic-meter': string
  'teaspoon-us': string
  'tablespoon-us': string
  'fluid-ounce-us': string
  'cup-us': string
  'pint-us': string
  'quart-us': string
  'gallon-us': string
  'fluid-ounce-uk': string
  'pint-uk': string
  'quart-uk': string
  'gallon-uk': string
  'cubic-inch': string
  'cubic-foot': string
}

interface VolumeConverterTranslations {
  title: string
  description: string
  fromUnit: string
  toUnit: string
  value: string
  result: string
  swap: string
  reset: string
  copy: string
  copied: string
  allConversions: string
  showAllConversions: string
  hideAllConversions: string
  // Unit group labels
  metricUnits: string
  usImperialUnits: string
  ukImperialUnits: string
  otherUnits: string
  // Unit names
  units: UnitTranslations
  // Validation messages
  validation: {
    enterValue: string
    invalidNumber: string
    negativeValue: string
    valueTooLarge: string
  }
  // US vs UK comparison
  comparison: {
    title: string
    usGallon: string
    ukGallon: string
    note: string
  }
}

interface VolumeConverterProps {
  translations: VolumeConverterTranslations
  locale?: string
}

export function VolumeConverter({
  translations: t,
}: VolumeConverterProps) {
  // Input state
  const [inputValue, setInputValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState<VolumeUnit>('liter')
  const [toUnit, setToUnit] = useState<VolumeUnit>('gallon-us')

  // UI state
  const [showAllConversions, setShowAllConversions] = useState(false)
  const [copied, setCopied] = useState(false)

  // Parse input value
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue)
    return isNaN(parsed) ? 0 : parsed
  }, [inputValue])

  // Validate inputs
  const validation = useMemo(() => {
    return validateVolumeInputs(numericValue, fromUnit, toUnit)
  }, [numericValue, fromUnit, toUnit])

  // Calculate conversion result (0 is a valid value)
  const result = useMemo(() => {
    if (!validation.valid) return null

    return convertVolume({
      value: numericValue,
      fromUnit,
      toUnit,
    })
  }, [numericValue, fromUnit, toUnit, validation.valid])

  // Calculate all conversions when expanded (0 is valid)
  const allConversions = useMemo(() => {
    if (!showAllConversions || !validation.valid) return null

    return convertToAllUnits(numericValue, fromUnit)
  }, [numericValue, fromUnit, showAllConversions, validation.valid])

  // Get unit name with fallback
  const getUnitName = useCallback(
    (unitId: VolumeUnit): string => {
      const key = unitId as keyof UnitTranslations
      return t.units[key] || unitId
    },
    [t.units]
  )

  // Get unit abbreviation
  const getUnitAbbr = useCallback((unitId: VolumeUnit): string => {
    return getVolumeUnitInfo(unitId).abbreviation
  }, [])

  // Get system label
  const getSystemLabel = useCallback(
    (system: MeasurementSystem): string => {
      switch (system) {
        case 'metric':
          return t.metricUnits
        case 'us-imperial':
          return t.usImperialUnits
        case 'uk-imperial':
          return t.ukImperialUnits
        default:
          return t.otherUnits
      }
    },
    [t]
  )

  // Swap units
  const handleSwap = useCallback(() => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
  }, [fromUnit, toUnit])

  // Reset
  const handleReset = useCallback(() => {
    setInputValue('1')
    setFromUnit('liter')
    setToUnit('gallon-us')
    setShowAllConversions(false)
  }, [])

  // Copy result to clipboard
  const handleCopy = useCallback(async () => {
    if (!result) return

    const text = `${formatVolumeValue(result.inputValue)} ${getUnitAbbr(result.inputUnit)} = ${formatVolumeValue(result.outputValue)} ${getUnitAbbr(result.outputUnit)}`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result, getUnitAbbr])

  // Render unit select options grouped by system
  const renderUnitOptions = () => {
    const systems: MeasurementSystem[] = ['metric', 'us-imperial', 'uk-imperial', 'other']

    return systems.map((system) => {
      const units = getVolumeUnitsBySystem(system)
      if (units.length === 0) return null

      return (
        <SelectGroup key={system}>
          <SelectLabel>{getSystemLabel(system)}</SelectLabel>
          {units.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {getUnitName(unit.id)} ({unit.abbreviation})
            </SelectItem>
          ))}
        </SelectGroup>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${formatVolumeValue(result.inputValue)} ${getUnitName(result.inputUnit)} equals ${formatVolumeValue(result.outputValue)} ${getUnitName(result.outputUnit)}`}
      </div>

      {/* Converter Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Input Value */}
          <div className="space-y-3">
            <Label htmlFor="inputValue" className="text-base">
              {t.value}
            </Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg h-12"
              min={0}
              step="any"
              aria-invalid={!validation.valid}
              aria-describedby={!validation.valid ? 'inputValue-error' : undefined}
            />
          </div>

          {/* From Unit */}
          <div className="space-y-3">
            <Label htmlFor="fromUnit" className="text-base">
              {t.fromUnit}
            </Label>
            <Select value={fromUnit} onValueChange={(value: VolumeUnit) => setFromUnit(value)}>
              <SelectTrigger className="h-12 text-base" id="fromUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{renderUnitOptions()}</SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full h-10 w-10"
              aria-label={t.swap}
            >
              <ArrowRightLeft className="h-4 w-4 rotate-90" />
            </Button>
          </div>

          {/* To Unit */}
          <div className="space-y-3">
            <Label htmlFor="toUnit" className="text-base">
              {t.toUnit}
            </Label>
            <Select value={toUnit} onValueChange={(value: VolumeUnit) => setToUnit(value)}>
              <SelectTrigger className="h-12 text-base" id="toUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{renderUnitOptions()}</SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <Button variant="outline" onClick={handleReset} className="w-full h-12">
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Result */}
        <div className="space-y-6">
          {/* Main Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">{t.result}</div>

              {result ? (
                <>
                  <div className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {formatVolumeValue(result.outputValue)}
                  </div>
                  <div className="text-lg opacity-90">
                    {getUnitName(result.outputUnit)} ({getUnitAbbr(result.outputUnit)})
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary-foreground/20 text-sm opacity-80">
                    {formatVolumeValue(result.inputValue)} {getUnitAbbr(result.inputUnit)} ={' '}
                    {formatVolumeValue(result.outputValue)} {getUnitAbbr(result.outputUnit)}
                  </div>
                </>
              ) : (
                <div className="text-3xl md:text-4xl font-bold tracking-tight opacity-50">--</div>
              )}
            </CardContent>
          </Card>

          {/* Copy Button */}
          {result && (
            <Button variant="outline" onClick={handleCopy} className="w-full h-12">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  {t.copy}
                </>
              )}
            </Button>
          )}

          {/* US vs UK Comparison Card */}
          {result && (fromUnit === 'gallon-us' || toUnit === 'gallon-us' || fromUnit === 'gallon-uk' || toUnit === 'gallon-uk') && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-3">{t.comparison.title}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t.comparison.usGallon}</div>
                    <div className="font-medium">
                      {formatVolumeValue(result.litersValue / VOLUME_UNITS['gallon-us'].toLiters)} gal
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.comparison.ukGallon}</div>
                    <div className="font-medium">
                      {formatVolumeValue(result.litersValue / VOLUME_UNITS['gallon-uk'].toLiters)} gal
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  {t.comparison.note}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Show All Conversions Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowAllConversions(!showAllConversions)}
        className="w-full"
        aria-expanded={showAllConversions}
        aria-controls="all-conversions"
      >
        <ArrowDown className={`h-4 w-4 mr-2 transition-transform ${showAllConversions ? 'rotate-180' : ''}`} />
        {showAllConversions ? t.hideAllConversions : t.showAllConversions}
      </Button>

      {/* All Conversions Table */}
      {showAllConversions && allConversions && (
        <Card id="all-conversions">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">{t.allConversions}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formatVolumeValue(allConversions.inputValue)} {getUnitName(allConversions.inputUnit)} =
              </p>
            </div>

            <div className="divide-y">
              {/* Metric Units */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {t.metricUnits}
                </h4>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(['milliliter', 'liter', 'cubic-meter'] as VolumeUnit[]).map((unit) => (
                    <div key={unit} className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{getUnitAbbr(unit)}</span>
                      <span className="font-medium">
                        {formatVolumeValue(allConversions.conversions[unit])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* US Imperial Units */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {t.usImperialUnits}
                </h4>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {(['teaspoon-us', 'tablespoon-us', 'fluid-ounce-us', 'cup-us', 'pint-us', 'quart-us', 'gallon-us'] as VolumeUnit[]).map((unit) => (
                    <div key={unit} className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{getUnitAbbr(unit)}</span>
                      <span className="font-medium">
                        {formatVolumeValue(allConversions.conversions[unit])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UK Imperial Units */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {t.ukImperialUnits}
                </h4>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {(['fluid-ounce-uk', 'pint-uk', 'quart-uk', 'gallon-uk'] as VolumeUnit[]).map((unit) => (
                    <div key={unit} className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{getUnitAbbr(unit)}</span>
                      <span className="font-medium">
                        {formatVolumeValue(allConversions.conversions[unit])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Units */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {t.otherUnits}
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(['cubic-inch', 'cubic-foot'] as VolumeUnit[]).map((unit) => (
                    <div key={unit} className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{getUnitAbbr(unit)}</span>
                      <span className="font-medium">
                        {formatVolumeValue(allConversions.conversions[unit])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
