'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Square,
  Circle,
  Triangle,
  Ruler,
  AlertCircle,
  Calculator,
  Paintbrush,
  Grid3x3,
} from 'lucide-react'
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
  calculateSquareFootage,
  validateSquareFootageInputs,
  formatArea,
} from './calculations'
import type {
  ShapeType,
  UnitSystem,
  SquareFootageResult,
  SquareFootageValidation,
} from './types'

interface SquareFootageCalculatorTranslations {
  shape: string
  shapes: {
    rectangle: string
    circle: string
    triangle: string
    'l-shape': string
    trapezoid: string
  }
  unitSystem: string
  units: {
    imperial: string
    metric: string
    ft: string
    m: string
    sqft: string
    sqm: string
    sqyd: string
    acres: string
    gallons: string
    liters: string
  }
  inputs: {
    length: string
    width: string
    diameter: string
    base: string
    height: string
    length1: string
    width1: string
    length2: string
    width2: string
    base1: string
    base2: string
  }
  actions: {
    calculate: string
    reset: string
  }
  results: {
    title: string
    squareFeet: string
    squareMeters: string
    squareYards: string
    acres: string
    materials: string
    paint: string
    paintNote: string
    flooring: string
    flooringNote: string
  }
  validation: {
    shapeRequired: string
    lengthRequired: string
    widthRequired: string
    diameterRequired: string
    baseRequired: string
    heightRequired: string
    length1Required: string
    width1Required: string
    length2Required: string
    width2Required: string
    base1Required: string
    base2Required: string
  }
}

interface SquareFootageCalculatorProps {
  locale?: string
  translations: SquareFootageCalculatorTranslations
}

// Shape icons mapping
const shapeIcons: Record<ShapeType, React.ReactNode> = {
  rectangle: <Square className="h-4 w-4" />,
  circle: <Circle className="h-4 w-4" />,
  triangle: <Triangle className="h-4 w-4" />,
  'l-shape': <Square className="h-4 w-4" />,
  trapezoid: <Square className="h-4 w-4" />,
}

export function SquareFootageCalculator({
  locale = 'en-US',
  translations: t,
}: SquareFootageCalculatorProps) {
  // Input state
  const [shape, setShape] = useState<ShapeType>('rectangle')
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')

  // Rectangle inputs
  const [length, setLength] = useState<number>(10)
  const [width, setWidth] = useState<number>(12)

  // Circle inputs
  const [diameter, setDiameter] = useState<number>(10)

  // Triangle inputs
  const [triangleBase, setTriangleBase] = useState<number>(10)
  const [triangleHeight, setTriangleHeight] = useState<number>(8)

  // L-shape inputs
  const [length1, setLength1] = useState<number>(10)
  const [width1, setWidth1] = useState<number>(8)
  const [length2, setLength2] = useState<number>(6)
  const [width2, setWidth2] = useState<number>(4)

  // Trapezoid inputs
  const [base1, setBase1] = useState<number>(12)
  const [base2, setBase2] = useState<number>(8)
  const [trapezoidHeight, setTrapezoidHeight] = useState<number>(6)

  // Build inputs based on shape
  const inputs = useMemo(() => {
    const conversionFactor = unitSystem === 'metric' ? 3.28084 : 1 // m to ft

    switch (shape) {
      case 'rectangle':
        return {
          shape: 'rectangle' as const,
          length: length * conversionFactor,
          width: width * conversionFactor,
        }
      case 'circle':
        return {
          shape: 'circle' as const,
          diameter: diameter * conversionFactor,
        }
      case 'triangle':
        return {
          shape: 'triangle' as const,
          base: triangleBase * conversionFactor,
          height: triangleHeight * conversionFactor,
        }
      case 'l-shape':
        return {
          shape: 'l-shape' as const,
          length1: length1 * conversionFactor,
          width1: width1 * conversionFactor,
          length2: length2 * conversionFactor,
          width2: width2 * conversionFactor,
        }
      case 'trapezoid':
        return {
          shape: 'trapezoid' as const,
          base1: base1 * conversionFactor,
          base2: base2 * conversionFactor,
          height: trapezoidHeight * conversionFactor,
        }
    }
  }, [
    shape,
    unitSystem,
    length,
    width,
    diameter,
    triangleBase,
    triangleHeight,
    length1,
    width1,
    length2,
    width2,
    base1,
    base2,
    trapezoidHeight,
  ])

  // Validate inputs
  const validation: SquareFootageValidation = useMemo(() => {
    return validateSquareFootageInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      const key = error.message.replace(
        'validation.',
        ''
      ) as keyof typeof t.validation
      return t.validation[key] || error.message
    },
    [validation.errors, t.validation]
  )

  // Calculate result
  const result: SquareFootageResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateSquareFootage(inputs)
  }, [inputs, validation.valid])

  // Handle reset
  const handleReset = useCallback(() => {
    setShape('rectangle')
    setUnitSystem('imperial')
    setLength(10)
    setWidth(12)
    setDiameter(10)
    setTriangleBase(10)
    setTriangleHeight(8)
    setLength1(10)
    setWidth1(8)
    setLength2(6)
    setWidth2(4)
    setBase1(12)
    setBase2(8)
    setTrapezoidHeight(6)
  }, [])

  const unitLabel = unitSystem === 'imperial' ? t.units.ft : t.units.m

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Area: ${formatArea(result.squareFeet, 'sqft', locale)} ${t.units.sqft}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Shape Selection */}
          <div className="space-y-3">
            <Label htmlFor="shape" className="flex items-center gap-2 text-base">
              <Calculator className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.shape}
            </Label>
            <Select value={shape} onValueChange={(v) => setShape(v as ShapeType)}>
              <SelectTrigger className="h-12 text-base" id="shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangle">
                  <span className="flex items-center gap-2">
                    {shapeIcons.rectangle}
                    {t.shapes.rectangle}
                  </span>
                </SelectItem>
                <SelectItem value="circle">
                  <span className="flex items-center gap-2">
                    {shapeIcons.circle}
                    {t.shapes.circle}
                  </span>
                </SelectItem>
                <SelectItem value="triangle">
                  <span className="flex items-center gap-2">
                    {shapeIcons.triangle}
                    {t.shapes.triangle}
                  </span>
                </SelectItem>
                <SelectItem value="l-shape">
                  <span className="flex items-center gap-2">
                    {shapeIcons['l-shape']}
                    {t.shapes['l-shape']}
                  </span>
                </SelectItem>
                <SelectItem value="trapezoid">
                  <span className="flex items-center gap-2">
                    {shapeIcons.trapezoid}
                    {t.shapes.trapezoid}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          {/* Rectangle Inputs */}
          {shape === 'rectangle' && (
            <>
              <div className="space-y-3">
                <Label
                  htmlFor="length"
                  className="flex items-center gap-2 text-base"
                >
                  {t.inputs.length}
                </Label>
                <div className="relative">
                  <Input
                    id="length"
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className={`pr-12 text-lg h-12 ${getFieldError('length') ? 'border-destructive' : ''}`}
                    min={0.1}
                    step={0.1}
                    aria-invalid={!!getFieldError('length')}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {unitLabel}
                  </span>
                </div>
                {getFieldError('length') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('length')}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="width" className="flex items-center gap-2 text-base">
                  {t.inputs.width}
                </Label>
                <div className="relative">
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className={`pr-12 text-lg h-12 ${getFieldError('width') ? 'border-destructive' : ''}`}
                    min={0.1}
                    step={0.1}
                    aria-invalid={!!getFieldError('width')}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {unitLabel}
                  </span>
                </div>
                {getFieldError('width') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('width')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Circle Inputs */}
          {shape === 'circle' && (
            <div className="space-y-3">
              <Label
                htmlFor="diameter"
                className="flex items-center gap-2 text-base"
              >
                {t.inputs.diameter}
              </Label>
              <div className="relative">
                <Input
                  id="diameter"
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('diameter') ? 'border-destructive' : ''}`}
                  min={0.1}
                  step={0.1}
                  aria-invalid={!!getFieldError('diameter')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {unitLabel}
                </span>
              </div>
              {getFieldError('diameter') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {getFieldError('diameter')}
                </p>
              )}
            </div>
          )}

          {/* Triangle Inputs */}
          {shape === 'triangle' && (
            <>
              <div className="space-y-3">
                <Label htmlFor="base" className="flex items-center gap-2 text-base">
                  {t.inputs.base}
                </Label>
                <div className="relative">
                  <Input
                    id="base"
                    type="number"
                    value={triangleBase}
                    onChange={(e) => setTriangleBase(Number(e.target.value))}
                    className={`pr-12 text-lg h-12 ${getFieldError('base') ? 'border-destructive' : ''}`}
                    min={0.1}
                    step={0.1}
                    aria-invalid={!!getFieldError('base')}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {unitLabel}
                  </span>
                </div>
                {getFieldError('base') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('base')}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="height"
                  className="flex items-center gap-2 text-base"
                >
                  {t.inputs.height}
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    type="number"
                    value={triangleHeight}
                    onChange={(e) => setTriangleHeight(Number(e.target.value))}
                    className={`pr-12 text-lg h-12 ${getFieldError('height') ? 'border-destructive' : ''}`}
                    min={0.1}
                    step={0.1}
                    aria-invalid={!!getFieldError('height')}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {unitLabel}
                  </span>
                </div>
                {getFieldError('height') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('height')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* L-Shape Inputs */}
          {shape === 'l-shape' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="length1"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.length1}
                  </Label>
                  <div className="relative">
                    <Input
                      id="length1"
                      type="number"
                      value={length1}
                      onChange={(e) => setLength1(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('length1') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="width1"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.width1}
                  </Label>
                  <div className="relative">
                    <Input
                      id="width1"
                      type="number"
                      value={width1}
                      onChange={(e) => setWidth1(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('width1') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="length2"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.length2}
                  </Label>
                  <div className="relative">
                    <Input
                      id="length2"
                      type="number"
                      value={length2}
                      onChange={(e) => setLength2(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('length2') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="width2"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.width2}
                  </Label>
                  <div className="relative">
                    <Input
                      id="width2"
                      type="number"
                      value={width2}
                      onChange={(e) => setWidth2(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('width2') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Trapezoid Inputs */}
          {shape === 'trapezoid' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="base1"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.base1}
                  </Label>
                  <div className="relative">
                    <Input
                      id="base1"
                      type="number"
                      value={base1}
                      onChange={(e) => setBase1(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('base1') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="base2"
                    className="flex items-center gap-2 text-base"
                  >
                    {t.inputs.base2}
                  </Label>
                  <div className="relative">
                    <Input
                      id="base2"
                      type="number"
                      value={base2}
                      onChange={(e) => setBase2(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('base2') ? 'border-destructive' : ''}`}
                      min={0.1}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="trapHeight"
                  className="flex items-center gap-2 text-base"
                >
                  {t.inputs.height}
                </Label>
                <div className="relative">
                  <Input
                    id="trapHeight"
                    type="number"
                    value={trapezoidHeight}
                    onChange={(e) => setTrapezoidHeight(Number(e.target.value))}
                    className={`pr-12 text-lg h-12 ${getFieldError('height') ? 'border-destructive' : ''}`}
                    min={0.1}
                    step={0.1}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {unitLabel}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.actions.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Main Result */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-primary mb-2">
                {t.results.title}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {result ? formatArea(result.squareFeet, 'sqft', locale) : '--'}
              </div>
              <div className="text-lg text-primary/80 mt-1">{t.units.sqft}</div>
            </CardContent>
          </Card>

          {/* Unit Conversions */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.squareMeters}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatArea(result.squareMeters, 'sqm', locale)} {t.units.sqm}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.squareYards}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatArea(result.squareYards, 'sqyd', locale)} {t.units.sqyd}
                    </div>
                  </div>
                  {result.squareFeet > 1000 && (
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">
                        {t.results.acres}
                      </div>
                      <div className="text-xl font-semibold">
                        {formatArea(result.acres, 'acres', locale)} {t.units.acres}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Material Estimates */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="font-medium">{t.results.materials}</div>

                <div className="flex items-start gap-3">
                  <Paintbrush
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.paint}</div>
                    <div className="text-muted-foreground">
                      {result.suggestedMaterials.paint.gallons} {t.units.gallons} /{' '}
                      {result.suggestedMaterials.paint.liters} {t.units.liters}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.results.paintNote}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Grid3x3
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-medium">{t.results.flooring}</div>
                    <div className="text-muted-foreground">
                      {formatArea(result.suggestedMaterials.flooring.squareFeet, 'sqft', locale)}{' '}
                      {t.units.sqft}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.results.flooringNote}
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
