'use client'

import { useState, useMemo, useCallback } from 'react'
import { Thermometer, RotateCcw, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  convertTemperature,
  validateTemperature,
  getTemperatureRange,
  TEMPERATURE_RANGE_COLORS,
  TEMPERATURE_RANGE_BG_COLORS,
} from './calculations'
import type { TemperatureUnit, TemperatureResult } from './types'
import { REFERENCE_POINTS } from './types'

interface TemperatureConverterTranslations {
  celsius: string
  fahrenheit: string
  kelvin: string
  reset: string
  results: {
    title: string
    celsius: string
    fahrenheit: string
    kelvin: string
  }
  units: {
    celsius: string
    fahrenheit: string
    kelvin: string
  }
  referencePoints: {
    title: string
    absoluteZero: string
    waterFreezing: string
    roomTemperature: string
    bodyTemperature: string
    waterBoiling: string
  }
  validation: {
    required: string
    invalid: string
    belowAbsoluteZero: string
  }
}

interface TemperatureConverterProps {
  locale?: string
  translations: TemperatureConverterTranslations
}

export function TemperatureConverter({
  locale = 'en-US',
  translations: t,
}: TemperatureConverterProps) {
  // Input state - default to room temperature (20C)
  const [celsius, setCelsius] = useState<string>('20')
  const [fahrenheit, setFahrenheit] = useState<string>('68')
  const [kelvin, setKelvin] = useState<string>('293.15')
  const [lastModified, setLastModified] = useState<TemperatureUnit>('celsius')
  const [error, setError] = useState<string | null>(null)

  // Get current numeric values
  const currentValues = useMemo(() => {
    return {
      celsius: celsius === '' ? null : parseFloat(celsius),
      fahrenheit: fahrenheit === '' ? null : parseFloat(fahrenheit),
      kelvin: kelvin === '' ? null : parseFloat(kelvin),
    }
  }, [celsius, fahrenheit, kelvin])

  // Calculate result based on last modified field
  const result: TemperatureResult | null = useMemo(() => {
    const value = currentValues[lastModified]
    if (value === null || isNaN(value)) return null

    const validation = validateTemperature(value, lastModified)
    if (!validation.valid) return null

    return convertTemperature(value, lastModified)
  }, [currentValues, lastModified])

  // Get temperature range for visual feedback
  const temperatureRange = useMemo(() => {
    if (!result) return 'moderate'
    return getTemperatureRange(result.celsius)
  }, [result])

  // Handle Celsius input change
  const handleCelsiusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setCelsius(value)
      setLastModified('celsius')
      setError(null)

      if (value === '' || value === '-') {
        setFahrenheit('')
        setKelvin('')
        return
      }

      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        const validation = validateTemperature(numValue, 'celsius')
        if (!validation.valid && validation.error) {
          setError(t.validation[validation.error.replace('validation.', '') as keyof typeof t.validation])
          return
        }
        const converted = convertTemperature(numValue, 'celsius')
        setFahrenheit(converted.fahrenheit.toString())
        setKelvin(converted.kelvin.toString())
      }
    },
    [t.validation]
  )

  // Handle Fahrenheit input change
  const handleFahrenheitChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFahrenheit(value)
      setLastModified('fahrenheit')
      setError(null)

      if (value === '' || value === '-') {
        setCelsius('')
        setKelvin('')
        return
      }

      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        const validation = validateTemperature(numValue, 'fahrenheit')
        if (!validation.valid && validation.error) {
          setError(t.validation[validation.error.replace('validation.', '') as keyof typeof t.validation])
          return
        }
        const converted = convertTemperature(numValue, 'fahrenheit')
        setCelsius(converted.celsius.toString())
        setKelvin(converted.kelvin.toString())
      }
    },
    [t.validation]
  )

  // Handle Kelvin input change
  const handleKelvinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setKelvin(value)
      setLastModified('kelvin')
      setError(null)

      if (value === '' || value === '-') {
        setCelsius('')
        setFahrenheit('')
        return
      }

      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        const validation = validateTemperature(numValue, 'kelvin')
        if (!validation.valid && validation.error) {
          setError(t.validation[validation.error.replace('validation.', '') as keyof typeof t.validation])
          return
        }
        const converted = convertTemperature(numValue, 'kelvin')
        setCelsius(converted.celsius.toString())
        setFahrenheit(converted.fahrenheit.toString())
      }
    },
    [t.validation]
  )

  // Handle reset
  const handleReset = useCallback(() => {
    setCelsius('20')
    setFahrenheit('68')
    setKelvin('293.15')
    setLastModified('celsius')
    setError(null)
  }, [])

  // Format number for display in reference table
  const formatNumber = useCallback(
    (value: number) => {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value)
    },
    [locale]
  )

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${formatNumber(result.celsius)} Celsius equals ${formatNumber(result.fahrenheit)} Fahrenheit and ${formatNumber(result.kelvin)} Kelvin`}
      </div>

      {/* Main Converter Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Celsius Input */}
          <div className="space-y-3">
            <Label
              htmlFor="celsius"
              className="flex items-center gap-2 text-base"
            >
              <Thermometer
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.celsius}
            </Label>
            <div className="relative">
              <Input
                id="celsius"
                type="number"
                value={celsius}
                onChange={handleCelsiusChange}
                className={`pr-12 text-lg h-12 ${lastModified === 'celsius' && error ? 'border-destructive' : ''}`}
                step="any"
                aria-invalid={lastModified === 'celsius' && !!error}
                aria-describedby={
                  lastModified === 'celsius' && error ? 'celsius-error' : undefined
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {t.units.celsius}
              </span>
            </div>
          </div>

          {/* Fahrenheit Input */}
          <div className="space-y-3">
            <Label
              htmlFor="fahrenheit"
              className="flex items-center gap-2 text-base"
            >
              <Thermometer
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.fahrenheit}
            </Label>
            <div className="relative">
              <Input
                id="fahrenheit"
                type="number"
                value={fahrenheit}
                onChange={handleFahrenheitChange}
                className={`pr-12 text-lg h-12 ${lastModified === 'fahrenheit' && error ? 'border-destructive' : ''}`}
                step="any"
                aria-invalid={lastModified === 'fahrenheit' && !!error}
                aria-describedby={
                  lastModified === 'fahrenheit' && error
                    ? 'fahrenheit-error'
                    : undefined
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {t.units.fahrenheit}
              </span>
            </div>
          </div>

          {/* Kelvin Input */}
          <div className="space-y-3">
            <Label
              htmlFor="kelvin"
              className="flex items-center gap-2 text-base"
            >
              <Thermometer
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.kelvin}
            </Label>
            <div className="relative">
              <Input
                id="kelvin"
                type="number"
                value={kelvin}
                onChange={handleKelvinChange}
                className={`pr-12 text-lg h-12 ${lastModified === 'kelvin' && error ? 'border-destructive' : ''}`}
                step="any"
                min="0"
                aria-invalid={lastModified === 'kelvin' && !!error}
                aria-describedby={
                  lastModified === 'kelvin' && error ? 'kelvin-error' : undefined
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {t.units.kelvin}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && lastModified && (
            <p
              id={`${lastModified}-error`}
              className="text-sm text-destructive flex items-center gap-1"
            >
              {error}
            </p>
          )}

          {/* Reset Button */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 h-12"
            >
              <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Result Card */}
          <Card
            className="overflow-hidden"
            style={{
              backgroundColor: result
                ? TEMPERATURE_RANGE_BG_COLORS[temperatureRange]
                : undefined,
              borderColor: result
                ? TEMPERATURE_RANGE_COLORS[temperatureRange]
                : undefined,
              borderWidth: result ? '2px' : undefined,
            }}
          >
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-4">
                {t.results.title}
              </div>
              <div className="space-y-4">
                {/* Celsius Result */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t.results.celsius}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: result
                        ? TEMPERATURE_RANGE_COLORS[temperatureRange]
                        : undefined,
                    }}
                  >
                    {result ? `${formatNumber(result.celsius)} ${t.units.celsius}` : '--'}
                  </span>
                </div>

                {/* Fahrenheit Result */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t.results.fahrenheit}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: result
                        ? TEMPERATURE_RANGE_COLORS[temperatureRange]
                        : undefined,
                    }}
                  >
                    {result
                      ? `${formatNumber(result.fahrenheit)} ${t.units.fahrenheit}`
                      : '--'}
                  </span>
                </div>

                {/* Kelvin Result */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t.results.kelvin}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: result
                        ? TEMPERATURE_RANGE_COLORS[temperatureRange]
                        : undefined,
                    }}
                  >
                    {result ? `${formatNumber(result.kelvin)} ${t.units.kelvin}` : '--'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Points Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">{t.referencePoints.title}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium"></th>
                      <th className="text-right py-2 font-medium">{t.units.celsius}</th>
                      <th className="text-right py-2 font-medium">{t.units.fahrenheit}</th>
                      <th className="text-right py-2 font-medium">{t.units.kelvin}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFERENCE_POINTS.map((point) => (
                      <tr key={point.name} className="border-b last:border-0">
                        <td className="py-2 text-muted-foreground">
                          {t.referencePoints[point.name as keyof typeof t.referencePoints]}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {formatNumber(point.celsius)}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {formatNumber(point.fahrenheit)}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {formatNumber(point.kelvin)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
