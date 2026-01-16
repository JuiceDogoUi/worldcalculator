'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  DoorOpen,
  SquareStack,
  Package,
  Layers,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateDrywall,
  formatArea,
} from './calculations'
import type {
  UnitSystem,
  SheetSize,
  DrywallResult,
} from './types'
import { DRYWALL_CONVERSIONS } from './types'

interface DrywallCalculatorTranslations {
  unitSystem: string
  units: {
    imperial: string
    metric: string
    ft: string
    m: string
    sqft: string
    sqm: string
    sheets: string
    gallons: string
    feet: string
  }
  inputs: {
    roomLength: string
    roomWidth: string
    wallHeight: string
    includeCeiling: string
    sheetSize: string
    numberOfDoors: string
    numberOfWindows: string
    wastePercent: string
  }
  sheetSizes: {
    '4x8': string
    '4x10': string
    '4x12': string
  }
  actions: {
    calculate: string
    reset: string
  }
  results: {
    title: string
    wallArea: string
    ceilingArea: string
    deductions: string
    netArea: string
    sheetsNeeded: string
    materials: string
    jointCompound: string
    tape: string
    screws: string
    cornerBead: string
    estimatedCost: string
    sheetsCost: string
    materialsCost: string
    totalCost: string
  }
  validation: {
    roomLengthRequired: string
    roomWidthRequired: string
    wallHeightRequired: string
    numberOfDoorsInvalid: string
    numberOfWindowsInvalid: string
  }
}

interface DrywallCalculatorProps {
  locale?: string
  translations: DrywallCalculatorTranslations
}

export function DrywallCalculator({
  locale = 'en-US',
  translations: t,
}: DrywallCalculatorProps) {
  // Input state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [roomLength, setRoomLength] = useState<number>(12)
  const [roomWidth, setRoomWidth] = useState<number>(10)
  const [wallHeight, setWallHeight] = useState<number>(8)
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false)
  const [sheetSize, setSheetSize] = useState<SheetSize>('4x8')
  const [numberOfDoors, setNumberOfDoors] = useState<number>(1)
  const [numberOfWindows, setNumberOfWindows] = useState<number>(2)
  const [wastePercent, setWastePercent] = useState<number>(10)

  // Build inputs with unit conversion
  const inputs = useMemo(() => {
    const conversionFactor = unitSystem === 'metric' ? DRYWALL_CONVERSIONS.metersToFeet : 1

    return {
      roomLength: roomLength * conversionFactor,
      roomWidth: roomWidth * conversionFactor,
      wallHeight: wallHeight * conversionFactor,
      includeCeiling,
      sheetSize,
      numberOfDoors,
      numberOfWindows,
      wastePercent,
    }
  }, [unitSystem, roomLength, roomWidth, wallHeight, includeCeiling, sheetSize, numberOfDoors, numberOfWindows, wastePercent])

  // Calculate result
  const result: DrywallResult | null = useMemo(() => {
    if (roomLength <= 0 || roomWidth <= 0 || wallHeight <= 0) return null
    return calculateDrywall(inputs)
  }, [inputs, roomLength, roomWidth, wallHeight])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('imperial')
    setRoomLength(12)
    setRoomWidth(10)
    setWallHeight(8)
    setIncludeCeiling(false)
    setSheetSize('4x8')
    setNumberOfDoors(1)
    setNumberOfWindows(2)
    setWastePercent(10)
  }, [])

  const lengthUnit = unitSystem === 'imperial' ? t.units.ft : t.units.m
  const areaUnit = unitSystem === 'imperial' ? t.units.sqft : t.units.sqm

  // Format area value based on unit system
  const formatDisplayArea = (sqft: number) => {
    if (unitSystem === 'metric') {
      return formatArea(sqft * DRYWALL_CONVERSIONS.sqFtToSqM, locale)
    }
    return formatArea(sqft, locale)
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Drywall sheets needed: ${result.sheetsNeeded}`}
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

          {/* Sheet Size */}
          <div className="space-y-3">
            <Label htmlFor="sheetSize" className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.inputs.sheetSize}
            </Label>
            <Select
              value={sheetSize}
              onValueChange={(v) => setSheetSize(v as SheetSize)}
            >
              <SelectTrigger className="h-12 text-base" id="sheetSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4x8">{t.sheetSizes['4x8']}</SelectItem>
                <SelectItem value="4x10">{t.sheetSizes['4x10']}</SelectItem>
                <SelectItem value="4x12">{t.sheetSizes['4x12']}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Ceiling */}
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
          {/* Main Result - Sheets Needed */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-primary mb-2">
                {t.results.sheetsNeeded}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {result ? result.sheetsNeeded : '--'}
              </div>
              <div className="text-lg text-primary/80 mt-1">{t.units.sheets}</div>
              {result && (
                <div className="mt-2 text-sm text-primary/70">
                  {sheetSize} ({result.sheetAreaUsed} {t.units.sqft} each)
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
                    <span className="text-muted-foreground">{t.results.wallArea}</span>
                    <span className="font-semibold">
                      {formatDisplayArea(result.wallArea)} {areaUnit}
                    </span>
                  </div>

                  {result.ceilingArea > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.results.ceilingArea}</span>
                      <span className="font-semibold">
                        +{formatDisplayArea(result.ceilingArea)} {areaUnit}
                      </span>
                    </div>
                  )}

                  {result.totalDeductions > 0 && (
                    <div className="flex justify-between items-center text-destructive/80">
                      <span>{t.results.deductions}</span>
                      <span>-{formatDisplayArea(result.totalDeductions)} {areaUnit}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">{t.results.netArea}</span>
                    <span className="font-bold text-lg">
                      {formatDisplayArea(result.netArea)} {areaUnit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Materials */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="font-medium">{t.results.materials}</div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.jointCompound}</span>
                  <span className="font-semibold">{result.jointCompoundGallons} {t.units.gallons}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.tape}</span>
                  <span className="font-semibold">{result.tapeFeet} {t.units.feet}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.screws}</span>
                  <span className="font-semibold">{result.screwsNeeded}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.cornerBead}</span>
                  <span className="font-semibold">{result.cornerBeadFeet} {t.units.feet}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Estimates */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="font-medium flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  {t.results.estimatedCost}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.sheetsCost}</span>
                  <span className="font-semibold">${result.estimatedCost.sheets}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.results.materialsCost}</span>
                  <span className="font-semibold">${result.estimatedCost.materials}</span>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="font-medium">{t.results.totalCost}</span>
                  <span className="font-bold text-lg">${result.estimatedCost.total}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
