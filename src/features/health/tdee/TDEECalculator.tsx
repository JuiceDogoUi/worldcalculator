'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Scale,
  AlertCircle,
  User,
  Calendar,
  Activity,
  Flame,
  TrendingDown,
  TrendingUp,
  Minus,
  Apple,
  Beef,
  Droplet,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  calculateTDEEResult,
  validateTDEEInputs,
  formatCalories,
} from './calculations'
import type {
  TDEEInputs,
  TDEEResult,
  TDEEValidation,
  UnitSystem,
  BiologicalSex,
  ActivityLevel,
  BMRFormula,
} from './types'

interface TDEECalculatorTranslations {
  // Input labels
  unitSystem: string
  metric: string
  imperial: string
  sex: string
  male: string
  female: string
  age: string
  ageYears: string
  height: string
  heightCm: string
  heightFeet: string
  heightInches: string
  weight: string
  weightKg: string
  weightLbs: string
  activityLevel: string
  formula: string
  bodyFat: string
  bodyFatOptional: string
  // Activity levels
  activity: {
    sedentary: string
    sedentaryDesc: string
    light: string
    lightDesc: string
    moderate: string
    moderateDesc: string
    active: string
    activeDesc: string
    veryActive: string
    veryActiveDesc: string
    athlete: string
    athleteDesc: string
  }
  // Formulas
  formulas: {
    mifflin: string
    mifflinDesc: string
    harris: string
    harrisDesc: string
    katch: string
    katchDesc: string
  }
  // Actions
  calculate: string
  reset: string
  // Results
  results: {
    title: string
    bmr: string
    bmrDesc: string
    tdee: string
    tdeeDesc: string
    caloriesPerDay: string
    calorieGoals: string
    extremeLoss: string
    loss: string
    mildLoss: string
    maintain: string
    mildGain: string
    gain: string
    extremeGain: string
    macros: string
    macrosDesc: string
    protein: string
    carbs: string
    fat: string
    balanced: string
    lowCarb: string
    highProtein: string
    lowFat: string
    grams: string
    idealWeight: string
  }
  // Units
  units: {
    cm: string
    ft: string
    in: string
    kg: string
    lbs: string
    years: string
    percent: string
    kcal: string
    g: string
  }
  // Validation
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
    ageRequired: string
    ageInvalid: string
    ageTooLow: string
    ageTooHigh: string
    sexRequired: string
    sexInvalid: string
    activityRequired: string
    bodyFatInvalid: string
    bodyFatTooLow: string
    bodyFatTooHigh: string
  }
}

interface TDEECalculatorProps {
  locale?: string
  translations: TDEECalculatorTranslations
}

export function TDEECalculator({
  locale = 'en-US',
  translations: t,
}: TDEECalculatorProps) {
  // Input state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [sex, setSex] = useState<BiologicalSex>('male')
  const [age, setAge] = useState<number>(30)
  const [heightCm, setHeightCm] = useState<number>(175)
  const [heightFeet, setHeightFeet] = useState<number>(5)
  const [heightInches, setHeightInches] = useState<number>(9)
  const [weightKg, setWeightKg] = useState<number>(75)
  const [weightLbs, setWeightLbs] = useState<number>(165)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [formula, setFormula] = useState<BMRFormula>('mifflin')
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('')

  // Build inputs object
  const inputs: TDEEInputs = useMemo(() => {
    const base = {
      unitSystem,
      sex,
      age,
      activityLevel,
      formula,
      bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : undefined,
    }

    if (unitSystem === 'metric') {
      return { ...base, heightCm, weightKg }
    } else {
      return { ...base, heightFeet, heightInches, weightLbs }
    }
  }, [unitSystem, sex, age, heightCm, weightKg, heightFeet, heightInches, weightLbs, activityLevel, formula, bodyFatPercentage])

  // Validate inputs
  const validation: TDEEValidation = useMemo(() => {
    return validateTDEEInputs(inputs)
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

  // Calculate TDEE result
  const result: TDEEResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateTDEEResult(inputs)
  }, [inputs, validation.valid])

  // Handle unit system change with conversion
  const handleUnitSystemChange = useCallback((value: UnitSystem) => {
    setUnitSystem(value)
    if (value === 'imperial') {
      const totalInches = heightCm / 2.54
      setHeightFeet(Math.floor(totalInches / 12))
      setHeightInches(Math.round(totalInches % 12))
      setWeightLbs(Math.round(weightKg * 2.20462))
    } else {
      const totalInches = heightFeet * 12 + heightInches
      setHeightCm(Math.round(totalInches * 2.54))
      setWeightKg(Math.round(weightLbs * 0.453592))
    }
  }, [heightCm, weightKg, heightFeet, heightInches, weightLbs])

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('metric')
    setSex('male')
    setAge(30)
    setHeightCm(175)
    setHeightFeet(5)
    setHeightInches(9)
    setWeightKg(75)
    setWeightLbs(165)
    setActivityLevel('moderate')
    setFormula('mifflin')
    setBodyFatPercentage('')
  }, [])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `TDEE: ${formatCalories(result.tdee, locale)} calories per day`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Unit System */}
          <div className="space-y-3">
            <Label htmlFor="unitSystem" className="text-base font-medium">
              {t.unitSystem}
            </Label>
            <Select value={unitSystem} onValueChange={(v: UnitSystem) => handleUnitSystemChange(v)}>
              <SelectTrigger className="h-12" id="unitSystem">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t.metric}</SelectItem>
                <SelectItem value="imperial">{t.imperial}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sex */}
          <div className="space-y-3">
            <Label htmlFor="sex" className="flex items-center gap-2 text-base font-medium">
              <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.sex}
            </Label>
            <Select value={sex} onValueChange={(v: BiologicalSex) => setSex(v)}>
              <SelectTrigger className="h-12" id="sex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t.male}</SelectItem>
                <SelectItem value="female">{t.female}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-3">
            <Label htmlFor="age" className="flex items-center gap-2 text-base font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.age}
            </Label>
            <div className="relative">
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`pr-16 text-lg h-12 ${getFieldError('age') ? 'border-destructive' : ''}`}
                min={15}
                max={120}
                aria-invalid={!!getFieldError('age')}
                aria-describedby={getFieldError('age') ? 'age-error' : undefined}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {t.units.years}
              </span>
            </div>
            {getFieldError('age') && (
              <p id="age-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('age')}
              </p>
            )}
            <Slider
              value={[age]}
              onValueChange={([value]) => setAge(value)}
              min={15}
              max={100}
              step={1}
              className="py-2"
              aria-label={t.age}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15 {t.units.years}</span>
              <span>100 {t.units.years}</span>
            </div>
          </div>

          {/* Height - Metric */}
          {unitSystem === 'metric' && (
            <div className="space-y-3">
              <Label htmlFor="heightCm" className="flex items-center gap-2 text-base font-medium">
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
                min={100}
                max={230}
                step={1}
                className="py-2"
                aria-label={t.heightCm}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 {t.units.cm}</span>
                <span>230 {t.units.cm}</span>
              </div>
            </div>
          )}

          {/* Height - Imperial */}
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

          {/* Weight - Metric */}
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
                  min={20}
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
                min={30}
                max={200}
                step={1}
                className="py-2"
                aria-label={t.weightKg}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30 {t.units.kg}</span>
                <span>200 {t.units.kg}</span>
              </div>
            </div>
          )}

          {/* Weight - Imperial */}
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
                  min={44}
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
                min={66}
                max={440}
                step={1}
                className="py-2"
                aria-label={t.weightLbs}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>66 {t.units.lbs}</span>
                <span>440 {t.units.lbs}</span>
              </div>
            </div>
          )}

          {/* Activity Level */}
          <div className="space-y-3">
            <Label htmlFor="activityLevel" className="flex items-center gap-2 text-base font-medium">
              <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.activityLevel}
            </Label>
            <Select value={activityLevel} onValueChange={(v: ActivityLevel) => setActivityLevel(v)}>
              <SelectTrigger className="h-12" id="activityLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.sedentary}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.sedentaryDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.light}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.lightDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderate">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.moderate}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.moderateDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.active}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.activeDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="veryActive">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.veryActive}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.veryActiveDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="athlete">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.activity.athlete}</span>
                    <span className="text-xs text-muted-foreground">{t.activity.athleteDesc}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Formula Selection */}
          <div className="space-y-3">
            <Label htmlFor="formula" className="text-base font-medium">
              {t.formula}
            </Label>
            <Select value={formula} onValueChange={(v: BMRFormula) => setFormula(v)}>
              <SelectTrigger className="h-12" id="formula">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mifflin">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.formulas.mifflin}</span>
                    <span className="text-xs text-muted-foreground">{t.formulas.mifflinDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="harris">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.formulas.harris}</span>
                    <span className="text-xs text-muted-foreground">{t.formulas.harrisDesc}</span>
                  </div>
                </SelectItem>
                <SelectItem value="katch">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{t.formulas.katch}</span>
                    <span className="text-xs text-muted-foreground">{t.formulas.katchDesc}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Body Fat % (optional, for Katch-McArdle) */}
          {formula === 'katch' && (
            <div className="space-y-3">
              <Label htmlFor="bodyFat" className="text-base">
                {t.bodyFat} <span className="text-muted-foreground font-normal">({t.bodyFatOptional})</span>
              </Label>
              <div className="relative">
                <Input
                  id="bodyFat"
                  type="number"
                  value={bodyFatPercentage}
                  onChange={(e) => setBodyFatPercentage(e.target.value)}
                  className={`pr-10 text-lg h-12 ${getFieldError('bodyFatPercentage') ? 'border-destructive' : ''}`}
                  min={3}
                  max={70}
                  step={0.1}
                  placeholder="e.g., 20"
                  aria-invalid={!!getFieldError('bodyFatPercentage')}
                  aria-describedby={getFieldError('bodyFatPercentage') ? 'bodyFat-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.percent}
                </span>
              </div>
              {getFieldError('bodyFatPercentage') && (
                <p id="bodyFat-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('bodyFatPercentage')}
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
        <div className="space-y-4">
          {/* Main Results Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* BMR Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {t.results.bmr}
                </div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result ? formatCalories(result.bmr, locale) : '--'}
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                  {t.units.kcal}/day
                </div>
              </CardContent>
            </Card>

            {/* TDEE Card */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1 flex items-center gap-1">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  {t.results.tdee}
                </div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result ? formatCalories(result.tdee, locale) : '--'}
                </div>
                <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                  {t.units.kcal}/day
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calorie Goals */}
          {result && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {t.results.calorieGoals}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Weight Loss Goals */}
                <div className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />
                    <span className="text-sm">{t.results.extremeLoss}</span>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {formatCalories(result.calorieGoals.extremeLoss, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-orange-50 dark:bg-orange-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-orange-500" aria-hidden="true" />
                    <span className="text-sm">{t.results.loss}</span>
                  </div>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCalories(result.calorieGoals.loss, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-yellow-50 dark:bg-yellow-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                    <span className="text-sm">{t.results.mildLoss}</span>
                  </div>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {formatCalories(result.calorieGoals.mildLoss, locale)}
                  </span>
                </div>

                {/* Maintenance */}
                <div className="flex items-center justify-between p-2 rounded bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-green-600" aria-hidden="true" />
                    <span className="text-sm font-medium">{t.results.maintain}</span>
                  </div>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {formatCalories(result.calorieGoals.maintain, locale)}
                  </span>
                </div>

                {/* Weight Gain Goals */}
                <div className="flex items-center justify-between p-2 rounded bg-blue-50 dark:bg-blue-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span className="text-sm">{t.results.mildGain}</span>
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatCalories(result.calorieGoals.mildGain, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-indigo-50 dark:bg-indigo-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    <span className="text-sm">{t.results.gain}</span>
                  </div>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatCalories(result.calorieGoals.gain, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-purple-50 dark:bg-purple-950/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" aria-hidden="true" />
                    <span className="text-sm">{t.results.extremeGain}</span>
                  </div>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {formatCalories(result.calorieGoals.extremeGain, locale)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Macros Breakdown */}
          {result && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t.results.macros}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.results.macrosDesc}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="balanced" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="balanced" className="text-xs">{t.results.balanced}</TabsTrigger>
                    <TabsTrigger value="lowCarb" className="text-xs">{t.results.lowCarb}</TabsTrigger>
                    <TabsTrigger value="highProtein" className="text-xs">{t.results.highProtein}</TabsTrigger>
                    <TabsTrigger value="lowFat" className="text-xs">{t.results.lowFat}</TabsTrigger>
                  </TabsList>

                  {(['balanced', 'lowCarb', 'highProtein', 'lowFat'] as const).map((plan) => (
                    <TabsContent key={plan} value={plan} className="mt-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                          <Beef className="h-5 w-5 mx-auto text-red-500 mb-1" aria-hidden="true" />
                          <div className="text-xs text-muted-foreground">{t.results.protein}</div>
                          <div className="font-bold text-lg">{result.macros[plan].protein}g</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                          <Apple className="h-5 w-5 mx-auto text-amber-500 mb-1" aria-hidden="true" />
                          <div className="text-xs text-muted-foreground">{t.results.carbs}</div>
                          <div className="font-bold text-lg">{result.macros[plan].carbs}g</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                          <Droplet className="h-5 w-5 mx-auto text-yellow-500 mb-1" aria-hidden="true" />
                          <div className="text-xs text-muted-foreground">{t.results.fat}</div>
                          <div className="font-bold text-lg">{result.macros[plan].fat}g</div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Ideal Weight Range */}
          {result?.idealWeightRange && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{t.results.idealWeight}</div>
                <div className="font-semibold">
                  {result.idealWeightRange.min} - {result.idealWeightRange.max} {result.idealWeightRange.unit}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
