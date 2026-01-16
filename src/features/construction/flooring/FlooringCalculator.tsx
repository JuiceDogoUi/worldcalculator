'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Package,
  Layers,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateFlooring,
  formatArea,
} from './calculations'
import type {
  UnitSystem,
  FlooringType,
  FlooringResult,
} from './types'
import { FLOORING_CONVERSIONS } from './types'

interface FlooringCalculatorTranslations {
  unitSystem: string
  units: {
    imperial: string
    metric: string
    ft: string
    m: string
    sqft: string
    sqm: string
    boxes: string
  }
  inputs: {
    roomLength: string
    roomWidth: string
    flooringType: string
    wastePercent: string
  }
  flooringTypes: {
    hardwood: string
    laminate: string
    vinyl: string
    tile: string
    carpet: string
  }
  actions: {
    calculate: string
    reset: string
  }
  results: {
    title: string
    floorArea: string
    wasteArea: string
    totalArea: string
    boxesNeeded: string
    coveragePerBox: string
    materialCost: string
    installationCost: string
    costRange: string
  }
  validation: {
    roomLengthRequired: string
    roomWidthRequired: string
    flooringTypeRequired: string
    wastePercentInvalid: string
  }
}

interface FlooringCalculatorProps {
  locale?: string
  translations: FlooringCalculatorTranslations
}

export function FlooringCalculator({
  locale = 'en-US',
  translations: t,
}: FlooringCalculatorProps) {
  // Input state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [roomLength, setRoomLength] = useState<number>(12)
  const [roomWidth, setRoomWidth] = useState<number>(10)
  const [flooringType, setFlooringType] = useState<FlooringType>('hardwood')
  const [wastePercent, setWastePercent] = useState<number>(10)

  // Build inputs with unit conversion
  const inputs = useMemo(() => {
    const conversionFactor = unitSystem === 'metric' ? FLOORING_CONVERSIONS.metersToFeet : 1

    return {
      roomLength: roomLength * conversionFactor,
      roomWidth: roomWidth * conversionFactor,
      flooringType,
      wastePercent,
    }
  }, [unitSystem, roomLength, roomWidth, flooringType, wastePercent])

  // Calculate result
  const result: FlooringResult | null = useMemo(() => {
    if (roomLength <= 0 || roomWidth <= 0) return null
    return calculateFlooring(inputs)
  }, [inputs, roomLength, roomWidth])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('imperial')
    setRoomLength(12)
    setRoomWidth(10)
    setFlooringType('hardwood')
    setWastePercent(10)
  }, [])

  const lengthUnit = unitSystem === 'imperial' ? t.units.ft : t.units.m
  const areaUnit = unitSystem === 'imperial' ? t.units.sqft : t.units.sqm

  // Format area value based on unit system
  const formatDisplayArea = (sqft: number) => {
    if (unitSystem === 'metric') {
      return formatArea(sqft * FLOORING_CONVERSIONS.sqFtToSqM, 'sqm', locale)
    }
    return formatArea(sqft, 'sqft', locale)
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Flooring needed: ${result.boxesNeeded} ${t.units.boxes}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Unit System */}
          <div className="space-y-3">
            <Label
              htmlFor="unitSystem"
              className="flex items-center gap-2 text-base"
            >
              <Ruler className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.unitSystem}
            </Label>
            <Select
              value={unitSystem}
              onValueChange={(v) => setUnitSystem(v as UnitSystem)}
            >
              <SelectTrigger className="h-12 text-base" id="unitSystem">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">{t.units.imperial}</SelectItem>
                <SelectItem value="metric">{t.units.metric}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Dimensions */}
          <div className="space-y-3">
            <Label htmlFor="roomLength" className="flex items-center gap-2 text-base">
              {t.inputs.roomLength}
            </Label>
            <div className="relative">
              <Input
                id="roomLength"
                type="number"
                value={roomLength}
                onChange={(e) => setRoomLength(Number(e.target.value))}
                className="pr-12 text-lg h-12"
                min={0.1}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {lengthUnit}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="roomWidth" className="flex items-center gap-2 text-base">
              {t.inputs.roomWidth}
            </Label>
            <div className="relative">
              <Input
                id="roomWidth"
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(Number(e.target.value))}
                className="pr-12 text-lg h-12"
                min={0.1}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {lengthUnit}
              </span>
            </div>
          </div>

          {/* Flooring Type */}
          <div className="space-y-3">
            <Label htmlFor="flooringType" className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.inputs.flooringType}
            </Label>
            <Select
              value={flooringType}
              onValueChange={(v) => setFlooringType(v as FlooringType)}
            >
              <SelectTrigger className="h-12 text-base" id="flooringType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardwood">{t.flooringTypes.hardwood}</SelectItem>
                <SelectItem value="laminate">{t.flooringTypes.laminate}</SelectItem>
                <SelectItem value="vinyl">{t.flooringTypes.vinyl}</SelectItem>
                <SelectItem value="tile">{t.flooringTypes.tile}</SelectItem>
                <SelectItem value="carpet">{t.flooringTypes.carpet}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Waste Percentage */}
          <div className="space-y-3">
            <Label id="wastePercentLabel" className="flex items-center gap-2 text-base">
              {t.inputs.wastePercent}: {wastePercent}%
            </Label>
            <Slider
              min={5}
              max={20}
              step={1}
              value={[wastePercent]}
              onValueChange={(v) => setWastePercent(v[0])}
              className="w-full"
              aria-labelledby="wastePercentLabel"
              aria-valuetext={`${wastePercent} percent`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.actions.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Main Result - Boxes Needed */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-primary mb-2">
                {t.results.boxesNeeded}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {result ? result.boxesNeeded : '--'}
              </div>
              <div className="text-lg text-primary/80 mt-1">{t.units.boxes}</div>
              {result && (
                <div className="mt-2 text-sm text-primary/70">
                  {result.coveragePerBox} {t.units.sqft}/{t.units.boxes}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Area Breakdown */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t.results.floorArea}</span>
                    <span className="font-semibold">
                      {formatDisplayArea(result.floorArea)} {areaUnit}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t.results.wasteArea} ({wastePercent}%)</span>
                    <span className="font-semibold">
                      +{formatDisplayArea(result.wasteArea)} {areaUnit}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">{t.results.totalArea}</span>
                    <span className="font-bold text-lg">
                      {formatDisplayArea(result.totalArea)} {areaUnit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Estimates */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Package
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.materialCost}</div>
                    <div className="text-muted-foreground">
                      {t.results.costRange}: ${result.estimatedCost.low} - ${result.estimatedCost.high}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.installationCost}</div>
                    <div className="text-muted-foreground">
                      {t.results.costRange}: ${result.installationCost.low} - ${result.installationCost.high}
                    </div>
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
