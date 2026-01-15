'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Scale,
  AlertCircle,
  Info,
  User,
  TrendingUp,
  TrendingDown,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  calculateIdealWeight,
  validateIdealWeightInputs,
  formatWeight,
  formatWeightRange,
  getDisplayWeight,
} from './calculations'
import type {
  IdealWeightInputs,
  IdealWeightResult,
  IdealWeightValidation,
  UnitSystem,
  Gender,
  BodyFrame,
  FormulaName,
} from './types'
import { FORMULA_COLORS } from './types'

interface IdealWeightCalculatorTranslations {
  unitSystem: string
  metric: string
  imperial: string
  gender: string
  male: string
  female: string
  height: string
  heightCm: string
  heightFeet: string
  heightInches: string
  currentWeight: string
  currentWeightKg: string
  currentWeightLbs: string
  currentWeightOptional: string
  bodyFrame: string
  frameSmall: string
  frameMedium: string
  frameLarge: string
  calculate: string
  reset: string
  results: {
    title: string
    averageIdealWeight: string
    bmiBasedRange: string
    weightToLose: string
    weightToGain: string
    atIdealWeight: string
    formulaComparison: string
    adjustedForFrame: string
  }
  formulas: {
    devine: string
    robinson: string
    miller: string
    hamwi: string
  }
  formulaDescriptions: {
    devine: string
    robinson: string
    miller: string
    hamwi: string
  }
  units: {
    cm: string
    ft: string
    in: string
    kg: string
    lbs: string
  }
  validation: {
    genderRequired: string
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
    weightInvalid: string
    weightPositive: string
    weightTooLow: string
    weightTooHigh: string
  }
}

interface IdealWeightCalculatorProps {
  locale?: string
  translations: IdealWeightCalculatorTranslations
}

export function IdealWeightCalculator({
  locale = 'en-US',
  translations: t,
}: IdealWeightCalculatorProps) {
  // Input state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<Gender>('male')
  const [heightCm, setHeightCm] = useState<number>(175)
  const [heightFeet, setHeightFeet] = useState<number>(5)
  const [heightInches, setHeightInches] = useState<number>(9)
  const [currentWeightKg, setCurrentWeightKg] = useState<number | undefined>(undefined)
  const [currentWeightLbs, setCurrentWeightLbs] = useState<number | undefined>(undefined)
  const [bodyFrame, setBodyFrame] = useState<BodyFrame>('medium')

  // Build inputs object based on unit system
  const inputs: IdealWeightInputs = useMemo(() => {
    if (unitSystem === 'metric') {
      return {
        gender,
        unitSystem: 'metric',
        heightCm,
        currentWeightKg,
        bodyFrame,
      }
    } else {
      return {
        gender,
        unitSystem: 'imperial',
        heightFeet,
        heightInches,
        currentWeightLbs,
        bodyFrame,
      }
    }
  }, [unitSystem, gender, heightCm, heightFeet, heightInches, currentWeightKg, currentWeightLbs, bodyFrame])

  // Validate inputs
  const validation: IdealWeightValidation = useMemo(() => {
    return validateIdealWeightInputs(inputs)
  }, [inputs])

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined
      const key = error.message.replace('validation.', '') as keyof typeof t.validation
      return t.validation[key] || error.message
    },
    [validation.errors, t.validation]
  )

  // Calculate ideal weight result
  const result: IdealWeightResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateIdealWeight(inputs)
  }, [inputs, validation.valid])

  // Handle unit system change with value conversion
  const handleUnitSystemChange = useCallback((value: UnitSystem) => {
    setUnitSystem(value)
    if (value === 'imperial') {
      // Convert metric to imperial
      const totalInches = heightCm / 2.54
      setHeightFeet(Math.floor(totalInches / 12))
      setHeightInches(Math.round(totalInches % 12))
      if (currentWeightKg !== undefined) {
        setCurrentWeightLbs(Math.round(currentWeightKg * 2.20462))
      }
    } else {
      // Convert imperial to metric
      const totalInches = heightFeet * 12 + heightInches
      setHeightCm(Math.round(totalInches * 2.54))
      if (currentWeightLbs !== undefined) {
        setCurrentWeightKg(Math.round(currentWeightLbs * 0.453592))
      }
    }
  }, [heightCm, heightFeet, heightInches, currentWeightKg, currentWeightLbs])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('metric')
    setGender('male')
    setHeightCm(175)
    setHeightFeet(5)
    setHeightInches(9)
    setCurrentWeightKg(undefined)
    setCurrentWeightLbs(undefined)
    setBodyFrame('medium')
  }, [])

  // Get formula label
  const getFormulaLabel = (name: FormulaName): string => {
    return t.formulas[name] || name
  }

  // Get max weight for chart scaling
  const maxChartWeight = useMemo(() => {
    if (!result) return 100
    const allWeights = result.formulas.map(f => f.adjustedWeight)
    if (result.currentWeightKg) allWeights.push(result.currentWeightKg)
    allWeights.push(result.bmiRange.maxWeight)
    return Math.max(...allWeights) * 1.1
  }, [result])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `${t.results.averageIdealWeight}: ${formatWeight(result.averageIdealWeight, unitSystem, locale)}`}
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Gender Selection */}
          <div className="space-y-3">
            <Label htmlFor="gender" className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.gender}
            </Label>
            <Select value={gender} onValueChange={(value: Gender) => setGender(value)}>
              <SelectTrigger className="h-12 text-base" id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t.male}</SelectItem>
                <SelectItem value="female">{t.female}</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                  min={100}
                  max={250}
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
                max={220}
                min={140}
                step={1}
                className="py-2"
                aria-label={t.heightCm}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>140 {t.units.cm}</span>
                <span>220 {t.units.cm}</span>
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
                      min={3}
                      max={8}
                      step={1}
                      aria-label={t.heightFeet}
                      aria-invalid={!!getFieldError('heightFeet')}
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
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t.units.in}
                    </span>
                  </div>
                </div>
              </div>
              {getFieldError('heightFeet') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightFeet')}
                </p>
              )}
              {getFieldError('heightInches') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightInches')}
                </p>
              )}
            </div>
          )}

          {/* Body Frame Selection */}
          <div className="space-y-3">
            <Label htmlFor="bodyFrame" className="flex items-center gap-2 text-base">
              {t.bodyFrame}
            </Label>
            <Select value={bodyFrame} onValueChange={(value: BodyFrame) => setBodyFrame(value)}>
              <SelectTrigger className="h-12 text-base" id="bodyFrame">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t.frameSmall}</SelectItem>
                <SelectItem value="medium">{t.frameMedium}</SelectItem>
                <SelectItem value="large">{t.frameLarge}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Weight - Metric (Optional) */}
          {unitSystem === 'metric' && (
            <div className="space-y-3">
              <Label htmlFor="currentWeightKg" className="flex items-center gap-2 text-base">
                <Scale className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.currentWeightKg}
                <span className="text-sm text-muted-foreground">({t.currentWeightOptional})</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentWeightKg"
                  type="number"
                  value={currentWeightKg ?? ''}
                  onChange={(e) => setCurrentWeightKg(e.target.value ? Number(e.target.value) : undefined)}
                  className={`pr-12 text-lg h-12 ${getFieldError('currentWeightKg') ? 'border-destructive' : ''}`}
                  min={20}
                  max={300}
                  step={0.1}
                  placeholder="--"
                  aria-invalid={!!getFieldError('currentWeightKg')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.kg}
                </span>
              </div>
              {getFieldError('currentWeightKg') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('currentWeightKg')}
                </p>
              )}
            </div>
          )}

          {/* Current Weight - Imperial (Optional) */}
          {unitSystem === 'imperial' && (
            <div className="space-y-3">
              <Label htmlFor="currentWeightLbs" className="flex items-center gap-2 text-base">
                <Scale className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.currentWeightLbs}
                <span className="text-sm text-muted-foreground">({t.currentWeightOptional})</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentWeightLbs"
                  type="number"
                  value={currentWeightLbs ?? ''}
                  onChange={(e) => setCurrentWeightLbs(e.target.value ? Number(e.target.value) : undefined)}
                  className={`pr-12 text-lg h-12 ${getFieldError('currentWeightLbs') ? 'border-destructive' : ''}`}
                  min={44}
                  max={661}
                  step={1}
                  placeholder="--"
                  aria-invalid={!!getFieldError('currentWeightLbs')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.lbs}
                </span>
              </div>
              {getFieldError('currentWeightLbs') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('currentWeightLbs')}
                </p>
              )}
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
          {/* Hero Result Card */}
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {t.results.averageIdealWeight}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
                {result ? formatWeight(result.averageIdealWeight, unitSystem, locale) : '--'}
              </div>
              {result && bodyFrame !== 'medium' && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {t.results.adjustedForFrame} ({bodyFrame === 'small' ? '-10%' : '+10%'})
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weight Difference Card (if current weight provided) */}
          {result && result.weightDifference && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  {result.weightDifference.direction === 'ideal' ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{t.results.atIdealWeight}</div>
                      </div>
                    </>
                  ) : result.weightDifference.direction === 'lose' ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-orange-600" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-semibold">{t.results.weightToLose}</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatWeight(result.weightDifference.amount, unitSystem, locale)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-semibold">{t.results.weightToGain}</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatWeight(result.weightDifference.amount, unitSystem, locale)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* BMI-Based Range */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-medium">{t.results.bmiBasedRange}</div>
                    <div className="text-muted-foreground">
                      {formatWeightRange(result.bmiRange.minWeight, result.bmiRange.maxWeight, unitSystem, locale)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      (BMI 18.5 - 24.9)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formula Comparison Chart */}
          {result && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t.results.formulaComparison}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.formulas.map((formula) => {
                  const displayWeight = getDisplayWeight(formula.adjustedWeight, unitSystem)
                  const barWidth = (formula.adjustedWeight / maxChartWeight) * 100
                  return (
                    <div key={formula.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{getFormulaLabel(formula.name)}</span>
                        <span className="text-muted-foreground">
                          {displayWeight} {unitSystem === 'metric' ? t.units.kg : t.units.lbs}
                        </span>
                      </div>
                      <div className="h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: FORMULA_COLORS[formula.name],
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t.formulaDescriptions[formula.name]}
                      </p>
                    </div>
                  )
                })}

                {/* Current weight marker if provided */}
                {result.currentWeightKg && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{t.currentWeight}</span>
                      <span className="text-muted-foreground">
                        {getDisplayWeight(result.currentWeightKg, unitSystem)}{' '}
                        {unitSystem === 'metric' ? t.units.kg : t.units.lbs}
                      </span>
                    </div>
                    <div className="h-6 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-slate-500 transition-all duration-300"
                        style={{
                          width: `${(result.currentWeightKg / maxChartWeight) * 100}%`,
                        }}
                      />
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
