'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Scale,
  User,
  Activity,
  Target,
  Utensils,
  AlertCircle,
  Flame,
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
  calculateMacros,
  validateMacroInputs,
  formatCalories,
  formatGrams,
  formatPercentage,
} from './calculations'
import type {
  MacroInputs,
  MacroResult,
  MacroValidation,
  UnitSystem,
  Gender,
  ActivityLevel,
  Goal,
  DietPreset,
} from './types'
import { MACRO_COLORS, MACRO_BG_COLORS } from './types'

interface MacroCalculatorTranslations {
  unitSystem: string
  metric: string
  imperial: string
  gender: string
  male: string
  female: string
  age: string
  height: string
  heightCm: string
  heightFeet: string
  heightInches: string
  weight: string
  weightKg: string
  weightLbs: string
  activityLevel: string
  activityLevels: {
    sedentary: string
    lightlyActive: string
    moderatelyActive: string
    veryActive: string
    extremelyActive: string
  }
  goal: string
  goals: {
    lose: string
    maintain: string
    gain: string
  }
  dietPreset: string
  dietPresets: {
    balanced: string
    lowCarb: string
    highProtein: string
    keto: string
    custom: string
  }
  customMacros: {
    title: string
    carbs: string
    protein: string
    fat: string
  }
  reset: string
  results: {
    title: string
    dailyCalories: string
    bmr: string
    tdee: string
    calorieAdjustment: string
    macroBreakdown: string
    protein: string
    carbs: string
    fat: string
    grams: string
    calories: string
  }
  units: {
    cm: string
    ft: string
    in: string
    kg: string
    lbs: string
    years: string
    kcal: string
    g: string
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
    ageRequired: string
    ageInvalid: string
    ageTooLow: string
    ageTooHigh: string
    genderRequired: string
    activityRequired: string
    goalRequired: string
    dietPresetRequired: string
    customMacrosRequired: string
    customMacrosSumTo100: string
  }
}

interface MacroCalculatorProps {
  locale?: string
  translations: MacroCalculatorTranslations
}

export function MacroCalculator({
  locale = 'en-US',
  translations: t,
}: MacroCalculatorProps) {
  // Input state with sensible defaults
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState<number>(30)
  const [heightCm, setHeightCm] = useState<number>(175)
  const [heightFeet, setHeightFeet] = useState<number>(5)
  const [heightInches, setHeightInches] = useState<number>(9)
  const [weightKg, setWeightKg] = useState<number>(75)
  const [weightLbs, setWeightLbs] = useState<number>(165)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderatelyActive')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [dietPreset, setDietPreset] = useState<DietPreset>('balanced')
  const [customCarbsPercent, setCustomCarbsPercent] = useState<number>(40)
  const [customProteinPercent, setCustomProteinPercent] = useState<number>(30)
  const [customFatPercent, setCustomFatPercent] = useState<number>(30)

  // Build inputs object based on unit system
  const inputs: MacroInputs = useMemo(() => {
    const baseInputs = {
      gender,
      age,
      activityLevel,
      goal,
      dietPreset,
      customCarbsPercent,
      customProteinPercent,
      customFatPercent,
    }

    if (unitSystem === 'metric') {
      return {
        ...baseInputs,
        unitSystem: 'metric' as const,
        heightCm,
        weightKg,
      }
    } else {
      return {
        ...baseInputs,
        unitSystem: 'imperial' as const,
        heightFeet,
        heightInches,
        weightLbs,
      }
    }
  }, [
    unitSystem,
    gender,
    age,
    heightCm,
    weightKg,
    heightFeet,
    heightInches,
    weightLbs,
    activityLevel,
    goal,
    dietPreset,
    customCarbsPercent,
    customProteinPercent,
    customFatPercent,
  ])

  // Validate inputs
  const validation: MacroValidation = useMemo(() => {
    return validateMacroInputs(inputs)
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

  // Calculate result
  const result: MacroResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateMacros(inputs)
  }, [inputs, validation.valid])

  // Handle unit system change
  const handleUnitSystemChange = useCallback(
    (value: UnitSystem) => {
      setUnitSystem(value)
      // Convert values when switching units
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
    },
    [heightCm, weightKg, heightFeet, heightInches, weightLbs]
  )

  // Handle reset
  const handleReset = useCallback(() => {
    setUnitSystem('metric')
    setGender('male')
    setAge(30)
    setHeightCm(175)
    setHeightFeet(5)
    setHeightInches(9)
    setWeightKg(75)
    setWeightLbs(165)
    setActivityLevel('moderatelyActive')
    setGoal('maintain')
    setDietPreset('balanced')
    setCustomCarbsPercent(40)
    setCustomProteinPercent(30)
    setCustomFatPercent(30)
  }, [])

  // Calculate pie chart segments
  const pieChartData = useMemo(() => {
    if (!result) return null

    const total = result.protein.percentage + result.carbs.percentage + result.fat.percentage
    const carbsAngle = (result.carbs.percentage / total) * 360
    const proteinAngle = (result.protein.percentage / total) * 360
    const fatAngle = (result.fat.percentage / total) * 360

    return {
      carbs: { angle: carbsAngle, start: 0 },
      protein: { angle: proteinAngle, start: carbsAngle },
      fat: { angle: fatAngle, start: carbsAngle + proteinAngle },
    }
  }, [result])

  // SVG pie chart path generator
  const generatePieSlice = (startAngle: number, endAngle: number, radius: number = 80) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = 100 + radius * Math.cos(startRad)
    const y1 = 100 + radius * Math.sin(startRad)
    const x2 = 100 + radius * Math.cos(endRad)
    const y2 = 100 + radius * Math.sin(endRad)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Daily calories: ${formatCalories(result.targetCalories, locale)} kcal.
           Protein: ${formatGrams(result.protein.grams, locale)}g.
           Carbs: ${formatGrams(result.carbs.grams, locale)}g.
           Fat: ${formatGrams(result.fat.grams, locale)}g.`}
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 lg:grid-cols-2">
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
            {getFieldError('gender') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('gender')}
              </p>
            )}
          </div>

          {/* Age Input */}
          <div className="space-y-3">
            <Label htmlFor="age" className="flex items-center gap-2 text-base">
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
                step={1}
                aria-invalid={!!getFieldError('age')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {t.units.years}
              </span>
            </div>
            {getFieldError('age') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('age')}
              </p>
            )}
            <Slider
              value={[age]}
              onValueChange={([value]) => setAge(value)}
              max={100}
              min={15}
              step={1}
              className="py-2"
              aria-label={t.age}
            />
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
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.cm}
                </span>
              </div>
              {getFieldError('heightCm') && (
                <p className="text-sm text-destructive flex items-center gap-1">
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
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {t.units.ft}
                  </span>
                </div>
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
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {t.units.in}
                  </span>
                </div>
              </div>
              {(getFieldError('heightFeet') || getFieldError('heightInches')) && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightFeet') || getFieldError('heightInches')}
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
                  min={20}
                  max={500}
                  step={0.1}
                  aria-invalid={!!getFieldError('weightKg')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.kg}
                </span>
              </div>
              {getFieldError('weightKg') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('weightKg')}
                </p>
              )}
              <Slider
                value={[weightKg]}
                onValueChange={([value]) => setWeightKg(value)}
                max={200}
                min={20}
                step={1}
                className="py-2"
                aria-label={t.weightKg}
              />
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
                  min={44}
                  max={1100}
                  step={1}
                  aria-invalid={!!getFieldError('weightLbs')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.lbs}
                </span>
              </div>
              {getFieldError('weightLbs') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('weightLbs')}
                </p>
              )}
              <Slider
                value={[weightLbs]}
                onValueChange={([value]) => setWeightLbs(value)}
                max={440}
                min={44}
                step={1}
                className="py-2"
                aria-label={t.weightLbs}
              />
            </div>
          )}

          {/* Activity Level */}
          <div className="space-y-3">
            <Label htmlFor="activityLevel" className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.activityLevel}
            </Label>
            <Select
              value={activityLevel}
              onValueChange={(value: ActivityLevel) => setActivityLevel(value)}
            >
              <SelectTrigger className="h-12 text-base" id="activityLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">{t.activityLevels.sedentary}</SelectItem>
                <SelectItem value="lightlyActive">{t.activityLevels.lightlyActive}</SelectItem>
                <SelectItem value="moderatelyActive">{t.activityLevels.moderatelyActive}</SelectItem>
                <SelectItem value="veryActive">{t.activityLevels.veryActive}</SelectItem>
                <SelectItem value="extremelyActive">{t.activityLevels.extremelyActive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div className="space-y-3">
            <Label htmlFor="goal" className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.goal}
            </Label>
            <Select value={goal} onValueChange={(value: Goal) => setGoal(value)}>
              <SelectTrigger className="h-12 text-base" id="goal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">{t.goals.lose}</SelectItem>
                <SelectItem value="maintain">{t.goals.maintain}</SelectItem>
                <SelectItem value="gain">{t.goals.gain}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diet Preset */}
          <div className="space-y-3">
            <Label htmlFor="dietPreset" className="flex items-center gap-2 text-base">
              <Utensils className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.dietPreset}
            </Label>
            <Select value={dietPreset} onValueChange={(value: DietPreset) => setDietPreset(value)}>
              <SelectTrigger className="h-12 text-base" id="dietPreset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">{t.dietPresets.balanced}</SelectItem>
                <SelectItem value="lowCarb">{t.dietPresets.lowCarb}</SelectItem>
                <SelectItem value="highProtein">{t.dietPresets.highProtein}</SelectItem>
                <SelectItem value="keto">{t.dietPresets.keto}</SelectItem>
                <SelectItem value="custom">{t.dietPresets.custom}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Macro Inputs */}
          {dietPreset === 'custom' && (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <p className="text-sm font-medium">{t.customMacros.title}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="customCarbs" className="text-sm">
                      {t.customMacros.carbs}
                    </Label>
                    <div className="relative">
                      <Input
                        id="customCarbs"
                        type="number"
                        value={customCarbsPercent}
                        onChange={(e) => setCustomCarbsPercent(Number(e.target.value))}
                        className="pr-8 h-10"
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customProtein" className="text-sm">
                      {t.customMacros.protein}
                    </Label>
                    <div className="relative">
                      <Input
                        id="customProtein"
                        type="number"
                        value={customProteinPercent}
                        onChange={(e) => setCustomProteinPercent(Number(e.target.value))}
                        className="pr-8 h-10"
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customFat" className="text-sm">
                      {t.customMacros.fat}
                    </Label>
                    <div className="relative">
                      <Input
                        id="customFat"
                        type="number"
                        value={customFatPercent}
                        onChange={(e) => setCustomFatPercent(Number(e.target.value))}
                        className="pr-8 h-10"
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                {getFieldError('customMacros') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {getFieldError('customMacros')}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Total: {customCarbsPercent + customProteinPercent + customFatPercent}%
                  {Math.abs(customCarbsPercent + customProteinPercent + customFatPercent - 100) <= 1 && (
                    <span className="text-green-600 ml-2">Valid</span>
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reset Button */}
          <div className="pt-2">
            <Button onClick={handleReset} variant="outline" className="w-full h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card - Daily Calories */}
          <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                <Flame className="h-4 w-4" />
                {t.results.dailyCalories}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
                {result ? formatCalories(result.targetCalories, locale) : '--'}
              </div>
              <div className="text-lg text-muted-foreground mt-1">{t.units.kcal}</div>
            </CardContent>
          </Card>

          {/* BMR and TDEE Info */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t.results.bmr}</div>
                        <div className="text-lg font-semibold">
                          {formatCalories(result.bmr, locale)} {t.units.kcal}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t.results.tdee}</div>
                        <div className="text-lg font-semibold">
                          {formatCalories(result.tdee, locale)} {t.units.kcal}
                        </div>
                      </div>
                    </div>
                    {result.calorieAdjustment !== 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-muted-foreground">{t.results.calorieAdjustment}</div>
                        <div className={`text-lg font-semibold ${result.calorieAdjustment > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {result.calorieAdjustment > 0 ? '+' : ''}{result.calorieAdjustment} {t.units.kcal}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Macro Breakdown with Pie Chart */}
          {result && pieChartData && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t.results.macroBreakdown}</h3>

                {/* Pie Chart */}
                <div className="flex justify-center mb-6">
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="drop-shadow-md"
                    role="img"
                    aria-label={`${t.results.macroBreakdown}: ${result.carbs.percentage}% ${t.results.carbs}, ${result.protein.percentage}% ${t.results.protein}, ${result.fat.percentage}% ${t.results.fat}`}
                  >
                    <title>{t.results.macroBreakdown}</title>
                    {/* Carbs slice */}
                    <path
                      d={generatePieSlice(
                        pieChartData.carbs.start,
                        pieChartData.carbs.start + pieChartData.carbs.angle
                      )}
                      fill={MACRO_COLORS.carbs}
                    />
                    {/* Protein slice */}
                    <path
                      d={generatePieSlice(
                        pieChartData.protein.start,
                        pieChartData.protein.start + pieChartData.protein.angle
                      )}
                      fill={MACRO_COLORS.protein}
                    />
                    {/* Fat slice */}
                    <path
                      d={generatePieSlice(
                        pieChartData.fat.start,
                        pieChartData.fat.start + pieChartData.fat.angle
                      )}
                      fill={MACRO_COLORS.fat}
                    />
                    {/* Center circle for donut effect */}
                    <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-900" />
                    {/* Center text */}
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      className="text-sm fill-muted-foreground"
                    >
                      {t.results.calories}
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      className="text-lg font-bold fill-foreground"
                    >
                      {formatCalories(result.targetCalories, locale)}
                    </text>
                  </svg>
                </div>

                {/* Macro Details */}
                <div className="space-y-3">
                  {/* Protein */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: MACRO_BG_COLORS.protein }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: MACRO_COLORS.protein }}
                        />
                        <span className="font-medium">{t.results.protein}</span>
                      </div>
                      <span className="font-bold text-lg">
                        {formatGrams(result.protein.grams, locale)}{t.units.g}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCalories(result.protein.calories, locale)} {t.units.kcal}</span>
                      <span>{formatPercentage(result.protein.percentage, locale)}%</span>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: MACRO_BG_COLORS.carbs }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: MACRO_COLORS.carbs }}
                        />
                        <span className="font-medium">{t.results.carbs}</span>
                      </div>
                      <span className="font-bold text-lg">
                        {formatGrams(result.carbs.grams, locale)}{t.units.g}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCalories(result.carbs.calories, locale)} {t.units.kcal}</span>
                      <span>{formatPercentage(result.carbs.percentage, locale)}%</span>
                    </div>
                  </div>

                  {/* Fat */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: MACRO_BG_COLORS.fat }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: MACRO_COLORS.fat }}
                        />
                        <span className="font-medium">{t.results.fat}</span>
                      </div>
                      <span className="font-bold text-lg">
                        {formatGrams(result.fat.grams, locale)}{t.units.g}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCalories(result.fat.calories, locale)} {t.units.kcal}</span>
                      <span>{formatPercentage(result.fat.percentage, locale)}%</span>
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
