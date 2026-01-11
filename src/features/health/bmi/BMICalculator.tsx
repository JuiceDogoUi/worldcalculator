'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Scale,
  AlertCircle,
  Info,
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
  calculateBMI,
  validateBMIInputs,
  formatBMI,
  formatWeightRange,
  getCategoryColor,
  getCategoryBgColor,
  getBMIScalePosition,
  getCategoryThresholdPositions,
} from './calculations'
import type { BMIInputs, BMIResult, BMIValidation, UnitSystem } from './types'
import { BMI_THRESHOLDS, BMI_CATEGORY_COLORS } from './types'

interface BMICalculatorTranslations {
  unitSystem: string
  metric: string
  imperial: string
  height: string
  heightCm: string
  heightFeet: string
  heightInches: string
  weight: string
  weightKg: string
  weightLbs: string
  calculate: string
  reset: string
  results: {
    title: string
    bmiValue: string
    category: string
    healthyRange: string
    distanceFromNormal: string
    underweight: string
    overweight: string
    withinRange: string
  }
  categories: {
    underweight: string
    normal: string
    overweight: string
    'obese-class-1': string
    'obese-class-2': string
    'obese-class-3': string
  }
  scale: {
    underweight: string
    normal: string
    overweight: string
    obese: string
  }
  units: {
    cm: string
    ft: string
    in: string
    kg: string
    lbs: string
  }
  validation: {
    heightRequired: string
    heightInvalid: string
    heightPositive: string
    heightTooLow: string
    heightTooHigh: string
    heightFeetRequired: string
    heightFeetInvalid: string
    heightFeetPositive: string
    heightFeetTooLow: string
    heightFeetTooHigh: string
    heightInchesRequired: string
    heightInchesInvalid: string
    heightInchesPositive: string
    heightInchesTooHigh: string
    weightRequired: string
    weightInvalid: string
    weightPositive: string
    weightTooLow: string
    weightTooHigh: string
  }
}

interface BMICalculatorProps {
  locale?: string
  translations: BMICalculatorTranslations
}

export function BMICalculator({
  locale = 'en-US',
  translations: t,
}: BMICalculatorProps) {
  // Input state - default values are synchronized
  // 170 cm = 66.93 inches = 5'6.93" ≈ 5'7"
  // 70 kg = 154.32 lbs ≈ 154 lbs
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [heightCm, setHeightCm] = useState<number>(170)
  const [heightFeet, setHeightFeet] = useState<number>(5)
  const [heightInches, setHeightInches] = useState<number>(7)
  const [weightKg, setWeightKg] = useState<number>(70)
  const [weightLbs, setWeightLbs] = useState<number>(154)

  // Build inputs object based on unit system
  const inputs: BMIInputs = useMemo(() => {
    if (unitSystem === 'metric') {
      return {
        unitSystem: 'metric',
        heightCm,
        weightKg,
      }
    } else {
      return {
        unitSystem: 'imperial',
        heightFeet,
        heightInches,
        weightLbs,
      }
    }
  }, [unitSystem, heightCm, weightKg, heightFeet, heightInches, weightLbs])

  // Validate inputs
  const validation: BMIValidation = useMemo(() => {
    return validateBMIInputs(inputs)
  }, [inputs])

  // Get error for a specific field - translates validation key to message
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      // Map validation key (e.g., 'validation.heightRequired') to translation
      const key = error.message.replace('validation.', '') as keyof typeof t.validation
      return t.validation[key] || error.message
    },
    [validation.errors, t.validation]
  )

  // Calculate BMI result
  const result: BMIResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateBMI(inputs)
  }, [inputs, validation.valid])

  // Get category translation - simple function, no memoization needed
  const getCategoryLabel = (category: string): string => {
    return t.categories[category as keyof typeof t.categories] || category
  }

  // Handle unit system change
  const handleUnitSystemChange = useCallback((value: UnitSystem) => {
    setUnitSystem(value)
    // Convert values when switching units
    if (value === 'imperial') {
      // Convert metric to imperial
      const totalInches = heightCm / 2.54
      setHeightFeet(Math.floor(totalInches / 12))
      setHeightInches(Math.round(totalInches % 12))
      setWeightLbs(Math.round(weightKg * 2.20462))
    } else {
      // Convert imperial to metric
      const totalInches = heightFeet * 12 + heightInches
      setHeightCm(Math.round(totalInches * 2.54))
      setWeightKg(Math.round(weightLbs * 0.453592))
    }
  }, [heightCm, weightKg, heightFeet, heightInches, weightLbs])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('metric')
    setHeightCm(170)
    setHeightFeet(5)
    setHeightInches(7)
    setWeightKg(70)
    setWeightLbs(154)
  }, [])

  // Get threshold positions for visual scale
  const thresholds = useMemo(() => getCategoryThresholdPositions(), [])

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `BMI: ${formatBMI(result.bmi)}, ${getCategoryLabel(result.category)}`}
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Unit System Toggle */}
          <div className="space-y-3">
            <Label htmlFor="unitSystem" className="flex items-center gap-2 text-base">
              {t.unitSystem}
            </Label>
            <Select
              value={unitSystem}
              onValueChange={(value: UnitSystem) => handleUnitSystemChange(value)}
            >
              <SelectTrigger className="h-12 text-base" id="unitSystem">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t.metric}</SelectItem>
                <SelectItem value="imperial">{t.imperial}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Height Input - Metric */}
          {unitSystem === 'metric' && (
            <div className="space-y-3">
              <Label htmlFor="heightCm" className="flex items-center gap-2 text-base">
                <Ruler className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.heightCm}
              </Label>
              <div className="relative">
                <Input
                  id="heightCm"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('heightCm') ? 'border-destructive' : ''}`}
                  min={50}
                  max={300}
                  step={1}
                  aria-invalid={!!getFieldError('heightCm')}
                  aria-describedby={getFieldError('heightCm') ? 'heightCm-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.cm}
                </span>
              </div>
              {getFieldError('heightCm') && (
                <p id="heightCm-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightCm')}
                </p>
              )}
              <Slider
                value={[heightCm]}
                onValueChange={([value]) => setHeightCm(value)}
                max={250}
                min={50}
                step={1}
                className="py-2"
                aria-label={t.heightCm}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50 {t.units.cm}</span>
                <span>250 {t.units.cm}</span>
              </div>
            </div>
          )}

          {/* Height Input - Imperial */}
          {unitSystem === 'imperial' && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Ruler className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.height}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="heightFeet" className="sr-only">
                    {t.heightFeet}
                  </Label>
                  <div className="relative">
                    <Input
                      id="heightFeet"
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('heightFeet') ? 'border-destructive' : ''}`}
                      min={1}
                      max={9}
                      step={1}
                      aria-label={t.heightFeet}
                      aria-invalid={!!getFieldError('heightFeet')}
                      aria-describedby={getFieldError('heightFeet') ? 'heightFeet-error' : undefined}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t.units.ft}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="heightInches" className="sr-only">
                    {t.heightInches}
                  </Label>
                  <div className="relative">
                    <Input
                      id="heightInches"
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className={`pr-10 text-lg h-12 ${getFieldError('heightInches') ? 'border-destructive' : ''}`}
                      min={0}
                      max={11}
                      step={1}
                      aria-label={t.heightInches}
                      aria-invalid={!!getFieldError('heightInches')}
                      aria-describedby={getFieldError('heightInches') ? 'heightInches-error' : undefined}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t.units.in}
                    </span>
                  </div>
                </div>
              </div>
              {getFieldError('heightFeet') && (
                <p id="heightFeet-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightFeet')}
                </p>
              )}
              {getFieldError('heightInches') && (
                <p id="heightInches-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightInches')}
                </p>
              )}
            </div>
          )}

          {/* Weight Input - Metric */}
          {unitSystem === 'metric' && (
            <div className="space-y-3">
              <Label htmlFor="weightKg" className="flex items-center gap-2 text-base">
                <Scale className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.weightKg}
              </Label>
              <div className="relative">
                <Input
                  id="weightKg"
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('weightKg') ? 'border-destructive' : ''}`}
                  min={10}
                  max={500}
                  step={0.1}
                  aria-invalid={!!getFieldError('weightKg')}
                  aria-describedby={getFieldError('weightKg') ? 'weightKg-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.kg}
                </span>
              </div>
              {getFieldError('weightKg') && (
                <p id="weightKg-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('weightKg')}
                </p>
              )}
              <Slider
                value={[weightKg]}
                onValueChange={([value]) => setWeightKg(value)}
                max={200}
                min={10}
                step={1}
                className="py-2"
                aria-label={t.weightKg}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 {t.units.kg}</span>
                <span>200 {t.units.kg}</span>
              </div>
            </div>
          )}

          {/* Weight Input - Imperial */}
          {unitSystem === 'imperial' && (
            <div className="space-y-3">
              <Label htmlFor="weightLbs" className="flex items-center gap-2 text-base">
                <Scale className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.weightLbs}
              </Label>
              <div className="relative">
                <Input
                  id="weightLbs"
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('weightLbs') ? 'border-destructive' : ''}`}
                  min={22}
                  max={1100}
                  step={1}
                  aria-invalid={!!getFieldError('weightLbs')}
                  aria-describedby={getFieldError('weightLbs') ? 'weightLbs-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.lbs}
                </span>
              </div>
              {getFieldError('weightLbs') && (
                <p id="weightLbs-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('weightLbs')}
                </p>
              )}
              <Slider
                value={[weightLbs]}
                onValueChange={([value]) => setWeightLbs(value)}
                max={440}
                min={22}
                step={1}
                className="py-2"
                aria-label={t.weightLbs}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>22 {t.units.lbs}</span>
                <span>440 {t.units.lbs}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card - Large and prominent */}
          <Card
            className="overflow-hidden"
            style={{
              backgroundColor: result ? getCategoryBgColor(result.category) : undefined,
              borderColor: result ? getCategoryColor(result.category) : undefined,
              borderWidth: result ? '2px' : undefined,
            }}
          >
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.results.bmiValue}
              </div>
              <div
                className="text-5xl md:text-6xl font-bold tracking-tight"
                style={{ color: result ? getCategoryColor(result.category) : undefined }}
              >
                {result ? formatBMI(result.bmi) : '--'}
              </div>
              {result && (
                <div
                  className="mt-3 text-lg font-semibold"
                  style={{ color: getCategoryColor(result.category) }}
                >
                  {getCategoryLabel(result.category)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* BMI Visual Scale */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Scale Bar */}
                  <div className="relative">
                    {/* Colored segments */}
                    <div className="h-6 rounded-full overflow-hidden flex">
                      {/* Underweight */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.underweight}%`,
                          backgroundColor: BMI_CATEGORY_COLORS.underweight,
                        }}
                      />
                      {/* Normal */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.normal - thresholds.underweight}%`,
                          backgroundColor: BMI_CATEGORY_COLORS.normal,
                        }}
                      />
                      {/* Overweight */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.overweight - thresholds.normal}%`,
                          backgroundColor: BMI_CATEGORY_COLORS.overweight,
                        }}
                      />
                      {/* Obese Class 1 */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.obeseClass1 - thresholds.overweight}%`,
                          backgroundColor: BMI_CATEGORY_COLORS['obese-class-1'],
                        }}
                      />
                      {/* Obese Class 2 */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.obeseClass2 - thresholds.obeseClass1}%`,
                          backgroundColor: BMI_CATEGORY_COLORS['obese-class-2'],
                        }}
                      />
                      {/* Obese Class 3 */}
                      <div
                        className="h-full flex-1"
                        style={{
                          backgroundColor: BMI_CATEGORY_COLORS['obese-class-3'],
                        }}
                      />
                    </div>

                    {/* Position indicator */}
                    <div
                      className="absolute top-0 w-1 h-8 -mt-1 bg-foreground rounded transform -translate-x-1/2"
                      style={{
                        left: `${getBMIScalePosition(result.bmi)}%`,
                      }}
                    />
                  </div>

                  {/* Scale labels */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10</span>
                    <span>{BMI_THRESHOLDS.underweight}</span>
                    <span>{BMI_THRESHOLDS.normalMax}</span>
                    <span>{BMI_THRESHOLDS.overweightMax}</span>
                    <span>40+</span>
                  </div>

                  {/* Category Legend */}
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BMI_CATEGORY_COLORS.underweight }} />
                      <span>{t.scale.underweight}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BMI_CATEGORY_COLORS.normal }} />
                      <span>{t.scale.normal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BMI_CATEGORY_COLORS.overweight }} />
                      <span>{t.scale.overweight}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BMI_CATEGORY_COLORS['obese-class-2'] }} />
                      <span>{t.scale.obese}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Healthy Weight Range */}
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-medium">{t.results.healthyRange}</div>
                    <div className="text-muted-foreground">
                      {formatWeightRange(result.healthyWeightRange, locale)}
                    </div>
                  </div>
                </div>

                {/* Distance from Normal */}
                {result.distanceFromNormal.direction !== 'within' && (
                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium">{t.results.distanceFromNormal}</div>
                      <div className="text-muted-foreground">
                        {result.distanceFromNormal.direction === 'under'
                          ? t.results.underweight
                          : t.results.overweight}{' '}
                        {result.distanceFromNormal.amount.toFixed(1)}{' '}
                        {result.distanceFromNormal.unit}
                      </div>
                    </div>
                  </div>
                )}

                {result.distanceFromNormal.direction === 'within' && (
                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-green-500 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-green-600">{t.results.withinRange}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
