'use client'

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  UnitSystem,
  GravelType,
  GravelResult,
} from './types'
import { calculateGravel } from './calculations'

interface GravelCalculatorProps {
  locale: string
  translations: {
    unitSystem: string
    units: {
      imperial: string
      metric: string
      ft: string
      m: string
      inches: string
      cm: string
      sqft: string
      sqm: string
      cuft: string
      cuyd: string
      cum: string
      lbs: string
      tons: string
      kg: string
      metricTons: string
      bags: string
    }
    inputs: {
      length: string
      width: string
      depth: string
      gravelType: string
      compactionFactor: string
    }
    gravelTypes: {
      'pea-gravel': string
      'crushed-stone': string
      'river-rock': string
      'decomposed-granite': string
      'lava-rock': string
      'base-gravel': string
    }
    actions: {
      calculate: string
      reset: string
    }
    results: {
      title: string
      area: string
      volume: string
      weight: string
      bags50lb: string
      estimatedCost: string
      materialCost: string
      deliveryCost: string
      totalCost: string
    }
    validation: {
      lengthRequired: string
      widthRequired: string
      depthRequired: string
    }
  }
}

const GRAVEL_TYPES: GravelType[] = [
  'pea-gravel',
  'crushed-stone',
  'river-rock',
  'decomposed-granite',
  'lava-rock',
  'base-gravel',
]

// Conversion factor for sq ft to sq m
const SQ_FT_TO_SQ_M = 0.092903

export function GravelCalculator({
  locale,
  translations: t,
}: GravelCalculatorProps) {
  // Input state (numbers for auto-calculation)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [length, setLength] = useState<number>(10)
  const [width, setWidth] = useState<number>(10)
  const [depth, setDepth] = useState<number>(3)
  const [gravelType, setGravelType] = useState<GravelType>('pea-gravel')
  const [compactionFactor, setCompactionFactor] = useState<number>(10)

  // Unit labels
  const lengthUnit = unitSystem === 'imperial' ? t.units.ft : t.units.m
  const depthUnit = unitSystem === 'imperial' ? t.units.inches : t.units.cm
  const areaUnit = unitSystem === 'imperial' ? t.units.sqft : t.units.sqm
  const volumeUnit = unitSystem === 'imperial' ? t.units.cuyd : t.units.cum
  const weightUnit = unitSystem === 'imperial' ? t.units.tons : t.units.metricTons

  // Auto-calculate result using useMemo
  const result: GravelResult | null = useMemo(() => {
    if (length <= 0 || width <= 0 || depth <= 0) return null

    return calculateGravel({
      unitSystem,
      length,
      width,
      depth,
      gravelType,
      compactionFactor,
    })
  }, [unitSystem, length, width, depth, gravelType, compactionFactor])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('imperial')
    setLength(10)
    setWidth(10)
    setDepth(3)
    setGravelType('pea-gravel')
    setCompactionFactor(10)
  }, [])

  // Format currency
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }, [locale])

  // Format number
  const formatNumber = useCallback((value: number, decimals: number = 2) => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }, [locale])

  // Calculate display area (convert to metric if needed)
  const displayArea = useMemo(() => {
    if (!result) return 0
    if (unitSystem === 'metric') {
      return result.area * SQ_FT_TO_SQ_M
    }
    return result.area
  }, [result, unitSystem])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Gravel needed: ${formatNumber(
            unitSystem === 'imperial' ? result.volumeCubicYards : result.volumeCubicMeters
          )} ${volumeUnit}`}
      </div>

      {/* Inputs */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Unit System */}
          <div className="space-y-2">
            <Label htmlFor="unitSystem">{t.unitSystem}</Label>
            <Select
              value={unitSystem}
              onValueChange={(value: UnitSystem) => setUnitSystem(value)}
            >
              <SelectTrigger id="unitSystem">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">{t.units.imperial}</SelectItem>
                <SelectItem value="metric">{t.units.metric}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">
                {t.inputs.length} ({lengthUnit})
              </Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value) || 0)}
                min="0"
                step="0.1"
                aria-invalid={length <= 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">
                {t.inputs.width} ({lengthUnit})
              </Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                min="0"
                step="0.1"
                aria-invalid={width <= 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">
                {t.inputs.depth} ({depthUnit})
              </Label>
              <Input
                id="depth"
                type="number"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value) || 0)}
                min="0"
                step="0.5"
                aria-invalid={depth <= 0}
              />
            </div>
          </div>

          {/* Gravel Type */}
          <div className="space-y-2">
            <Label htmlFor="gravelType">{t.inputs.gravelType}</Label>
            <Select
              value={gravelType}
              onValueChange={(value: GravelType) => setGravelType(value)}
            >
              <SelectTrigger id="gravelType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRAVEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t.gravelTypes[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compaction Factor */}
          <div className="space-y-4">
            <Label id="compactionLabel" className="flex justify-between">
              <span>{t.inputs.compactionFactor}</span>
              <span className="text-muted-foreground">
                {compactionFactor}%
              </span>
            </Label>
            <Slider
              value={[compactionFactor]}
              onValueChange={(value) => setCompactionFactor(value[0])}
              min={0}
              max={30}
              step={5}
              className="w-full"
              aria-labelledby="compactionLabel"
              aria-valuetext={`${compactionFactor} percent`}
            />
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full">
            {t.actions.reset}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{t.results.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Area */}
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t.results.area}</span>
              <span className="font-medium">
                {formatNumber(displayArea)} {areaUnit}
              </span>
            </div>

            {/* Volume */}
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t.results.volume}</span>
              <span className="font-medium">
                {formatNumber(
                  unitSystem === 'imperial'
                    ? result.volumeCubicYards
                    : result.volumeCubicMeters
                )}{' '}
                {volumeUnit}
              </span>
            </div>

            {/* Weight */}
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t.results.weight}</span>
              <span className="font-medium">
                {formatNumber(
                  unitSystem === 'imperial'
                    ? result.weightTons
                    : result.weightMetricTons
                )}{' '}
                {weightUnit}
              </span>
            </div>

            {/* Bags */}
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t.results.bags50lb}</span>
              <span className="font-medium">
                {result.bags50lb} {t.units.bags}
              </span>
            </div>

            {/* Cost Section */}
            <div className="pt-4">
              <h4 className="font-semibold mb-3">{t.results.estimatedCost}</h4>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">
                    {t.results.materialCost}
                  </span>
                  <span>{formatCurrency(result.materialCost)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">
                    {t.results.deliveryCost}
                  </span>
                  <span>{formatCurrency(result.deliveryCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-t font-semibold">
                  <span>{t.results.totalCost}</span>
                  <span className="text-primary">
                    {formatCurrency(result.totalCost)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
