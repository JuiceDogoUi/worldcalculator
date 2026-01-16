'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Paintbrush,
  Ruler,
  DoorOpen,
  SquareStack,
  Layers,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculatePaint,
  formatArea,
  formatPaintQuantity,
} from './calculations'
import type {
  UnitSystem,
  PaintResult,
} from './types'
import { PAINT_CONVERSIONS } from './types'

interface PaintCalculatorTranslations {
  unitSystem: string
  units: {
    imperial: string
    metric: string
    ft: string
    m: string
    sqft: string
    sqm: string
    gallons: string
    liters: string
    quarts: string
  }
  inputs: {
    roomLength: string
    roomWidth: string
    wallHeight: string
    numberOfDoors: string
    numberOfWindows: string
    includeCeiling: string
    numberOfCoats: string
  }
  actions: {
    calculate: string
    reset: string
  }
  results: {
    title: string
    totalWallArea: string
    deductions: string
    ceilingArea: string
    paintableArea: string
    paintNeeded: string
    gallons: string
    liters: string
    quarts: string
    coats: string
    coverage: string
    estimatedCost: string
    costRange: string
  }
  validation: {
    roomLengthRequired: string
    roomWidthRequired: string
    wallHeightRequired: string
    numberOfDoorsInvalid: string
    numberOfWindowsInvalid: string
    numberOfCoatsInvalid: string
  }
}

interface PaintCalculatorProps {
  locale?: string
  translations: PaintCalculatorTranslations
}

export function PaintCalculator({
  locale = 'en-US',
  translations: t,
}: PaintCalculatorProps) {
  // Input state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [roomLength, setRoomLength] = useState<number>(12)
  const [roomWidth, setRoomWidth] = useState<number>(10)
  const [wallHeight, setWallHeight] = useState<number>(8)
  const [numberOfDoors, setNumberOfDoors] = useState<number>(1)
  const [numberOfWindows, setNumberOfWindows] = useState<number>(2)
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false)
  const [numberOfCoats, setNumberOfCoats] = useState<number>(2)

  // Build inputs with unit conversion
  const inputs = useMemo(() => {
    const conversionFactor = unitSystem === 'metric' ? PAINT_CONVERSIONS.metersToFeet : 1

    return {
      roomLength: roomLength * conversionFactor,
      roomWidth: roomWidth * conversionFactor,
      wallHeight: wallHeight * conversionFactor,
      numberOfDoors,
      numberOfWindows,
      includeCeiling,
      numberOfCoats,
    }
  }, [unitSystem, roomLength, roomWidth, wallHeight, numberOfDoors, numberOfWindows, includeCeiling, numberOfCoats])

  // Calculate result
  const result: PaintResult | null = useMemo(() => {
    if (roomLength <= 0 || roomWidth <= 0 || wallHeight <= 0) return null
    return calculatePaint(inputs)
  }, [inputs, roomLength, roomWidth, wallHeight])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('imperial')
    setRoomLength(12)
    setRoomWidth(10)
    setWallHeight(8)
    setNumberOfDoors(1)
    setNumberOfWindows(2)
    setIncludeCeiling(false)
    setNumberOfCoats(2)
  }, [])

  const lengthUnit = unitSystem === 'imperial' ? t.units.ft : t.units.m
  const areaUnit = unitSystem === 'imperial' ? t.units.sqft : t.units.sqm

  // Format area value based on unit system
  const formatDisplayArea = (sqft: number) => {
    if (unitSystem === 'metric') {
      return formatArea(sqft * PAINT_CONVERSIONS.sqFtToSqM, 'sqm', locale)
    }
    return formatArea(sqft, 'sqft', locale)
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Paint needed: ${result.gallonsNeeded} ${t.units.gallons}`}
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

          <div className="space-y-3">
            <Label htmlFor="wallHeight" className="flex items-center gap-2 text-base">
              {t.inputs.wallHeight}
            </Label>
            <div className="relative">
              <Input
                id="wallHeight"
                type="number"
                value={wallHeight}
                onChange={(e) => setWallHeight(Number(e.target.value))}
                className="pr-12 text-lg h-12"
                min={0.1}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {lengthUnit}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="numberOfDoors" className="flex items-center gap-2 text-base">
                <DoorOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.inputs.numberOfDoors}
              </Label>
              <Input
                id="numberOfDoors"
                type="number"
                value={numberOfDoors}
                onChange={(e) => setNumberOfDoors(Math.max(0, Number(e.target.value)))}
                className="text-lg h-12"
                min={0}
                step={1}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="numberOfWindows" className="flex items-center gap-2 text-base">
                <SquareStack className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.inputs.numberOfWindows}
              </Label>
              <Input
                id="numberOfWindows"
                type="number"
                value={numberOfWindows}
                onChange={(e) => setNumberOfWindows(Math.max(0, Number(e.target.value)))}
                className="text-lg h-12"
                min={0}
                step={1}
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="includeCeiling" className="flex items-center gap-2 text-base cursor-pointer">
              <SquareStack className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.inputs.includeCeiling}
            </Label>
            <Switch
              id="includeCeiling"
              checked={includeCeiling}
              onCheckedChange={setIncludeCeiling}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="numberOfCoats" className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.inputs.numberOfCoats}
            </Label>
            <Select
              value={numberOfCoats.toString()}
              onValueChange={(v) => setNumberOfCoats(Number(v))}
            >
              <SelectTrigger className="h-12 text-base" id="numberOfCoats">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {t.results.coats}</SelectItem>
                <SelectItem value="2">2 {t.results.coats}</SelectItem>
                <SelectItem value="3">3 {t.results.coats}</SelectItem>
                <SelectItem value="4">4 {t.results.coats}</SelectItem>
              </SelectContent>
            </Select>
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
          {/* Main Result - Paint Needed */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-primary mb-2">
                {t.results.paintNeeded}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {result ? Math.ceil(result.gallonsNeeded) : '--'}
              </div>
              <div className="text-lg text-primary/80 mt-1">{t.results.gallons}</div>
              {result && (
                <div className="mt-2 text-sm text-primary/70">
                  {formatPaintQuantity(result.litersNeeded, locale)} {t.units.liters} / {result.quartsNeeded} {t.units.quarts}
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
                    <span className="text-muted-foreground">{t.results.totalWallArea}</span>
                    <span className="font-semibold">
                      {formatDisplayArea(result.totalWallArea)} {areaUnit}
                    </span>
                  </div>

                  {result.totalDeductions > 0 && (
                    <div className="flex justify-between items-center text-destructive/80">
                      <span>{t.results.deductions}</span>
                      <span>-{formatDisplayArea(result.totalDeductions)} {areaUnit}</span>
                    </div>
                  )}

                  {result.ceilingArea > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.results.ceilingArea}</span>
                      <span className="font-semibold">
                        +{formatDisplayArea(result.ceilingArea)} {areaUnit}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">{t.results.paintableArea}</span>
                    <span className="font-bold text-lg">
                      {formatDisplayArea(result.totalPaintableArea)} {areaUnit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coverage Info */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Paintbrush
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.coverage}</div>
                    <div className="text-muted-foreground">
                      {result.coverageRateUsed} {t.units.sqft}/{t.units.gallons}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {result.numberOfCoats} {t.results.coats}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Layers
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.estimatedCost}</div>
                    <div className="text-muted-foreground">
                      {t.results.costRange}: ${result.estimatedCostRange.low} - ${result.estimatedCostRange.high} {result.estimatedCostRange.currency}
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
