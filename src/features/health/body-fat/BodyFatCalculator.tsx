'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Ruler,
  Scale,
  AlertCircle,
  Info,
  User,
  Circle,
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
  calculateBodyFat,
  validateBodyFatInputs,
  formatBodyFatPercentage,
  formatWeight,
  getCategoryColor,
  getCategoryBgColor,
  getBodyFatScalePosition,
  getCategoryThresholdPositions,
  inchesToCm,
  cmToInches,
  lbsToKg,
  kgToLbs,
} from './calculations'
import type {
  BodyFatInputs,
  BodyFatResult,
  BodyFatValidation,
  UnitSystem,
  Gender,
} from './types'
import { BODY_FAT_THRESHOLDS, BODY_FAT_CATEGORY_COLORS } from './types'

interface BodyFatCalculatorTranslations {
  gender: string
  male: string
  female: string
  age: string
  unitSystem: string
  metric: string
  imperial: string
  height: string
  heightCm: string
  heightInches: string
  weight: string
  weightKg: string
  weightLbs: string
  neck: string
  neckCm: string
  neckInches: string
  waist: string
  waistCm: string
  waistInches: string
  hip: string
  hipCm: string
  hipInches: string
  hipNote: string
  calculate: string
  reset: string
  results: {
    title: string
    bodyFatPercentage: string
    category: string
    bodyFatMass: string
    leanBodyMass: string
    idealRange: string
    fatToLose: string
    inRange: string
  }
  categories: {
    essential: string
    athletic: string
    fitness: string
    acceptable: string
    obese: string
  }
  scale: {
    essential: string
    athletic: string
    fitness: string
    acceptable: string
    obese: string
  }
  units: {
    cm: string
    in: string
    kg: string
    lbs: string
    years: string
  }
  validation: {
    genderRequired: string
    ageRequired: string
    agePositive: string
    ageTooLow: string
    ageTooHigh: string
    heightRequired: string
    heightPositive: string
    heightTooLow: string
    heightTooHigh: string
    weightRequired: string
    weightPositive: string
    weightTooLow: string
    weightTooHigh: string
    neckRequired: string
    neckPositive: string
    neckTooLow: string
    neckTooHigh: string
    waistRequired: string
    waistPositive: string
    waistTooLow: string
    waistTooHigh: string
    hipRequired: string
    hipPositive: string
    hipTooLow: string
    hipTooHigh: string
    waistMustBeGreaterThanNeck: string
  }
}

interface BodyFatCalculatorProps {
  locale?: string
  translations: BodyFatCalculatorTranslations
}

export function BodyFatCalculator({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale = 'en-US',
  translations: t,
}: BodyFatCalculatorProps) {
  // Input state with sensible defaults
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState<number>(30)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')

  // Metric inputs
  const [heightCm, setHeightCm] = useState<number>(175)
  const [weightKg, setWeightKg] = useState<number>(75)
  const [neckCm, setNeckCm] = useState<number>(38)
  const [waistCm, setWaistCm] = useState<number>(85)
  const [hipCm, setHipCm] = useState<number>(100)

  // Imperial inputs (synchronized with metric)
  const [heightInches, setHeightInches] = useState<number>(69)
  const [weightLbs, setWeightLbs] = useState<number>(165)
  const [neckInches, setNeckInches] = useState<number>(15)
  const [waistInches, setWaistInches] = useState<number>(33.5)
  const [hipInches, setHipInches] = useState<number>(39.4)

  // Build inputs object based on unit system
  const inputs: BodyFatInputs = useMemo(() => {
    if (unitSystem === 'metric') {
      return {
        gender,
        age,
        unitSystem: 'metric',
        heightCm,
        weightKg,
        neckCm,
        waistCm,
        hipCm: gender === 'female' ? hipCm : undefined,
      }
    } else {
      return {
        gender,
        age,
        unitSystem: 'imperial',
        heightInches,
        weightLbs,
        neckInches,
        waistInches,
        hipInches: gender === 'female' ? hipInches : undefined,
      }
    }
  }, [
    gender,
    age,
    unitSystem,
    heightCm,
    weightKg,
    neckCm,
    waistCm,
    hipCm,
    heightInches,
    weightLbs,
    neckInches,
    waistInches,
    hipInches,
  ])

  // Validate inputs
  const validation: BodyFatValidation = useMemo(() => {
    return validateBodyFatInputs(inputs)
  }, [inputs])

  // Get error for a specific field
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

  // Calculate body fat result
  const result: BodyFatResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateBodyFat(inputs)
  }, [inputs, validation.valid])

  // Get category translation
  const getCategoryLabel = (category: string): string => {
    return t.categories[category as keyof typeof t.categories] || category
  }

  // Handle unit system change with conversion
  const handleUnitSystemChange = useCallback(
    (value: UnitSystem) => {
      setUnitSystem(value)
      if (value === 'imperial') {
        // Convert metric to imperial
        setHeightInches(Math.round(cmToInches(heightCm) * 10) / 10)
        setWeightLbs(Math.round(kgToLbs(weightKg)))
        setNeckInches(Math.round(cmToInches(neckCm) * 10) / 10)
        setWaistInches(Math.round(cmToInches(waistCm) * 10) / 10)
        setHipInches(Math.round(cmToInches(hipCm) * 10) / 10)
      } else {
        // Convert imperial to metric
        setHeightCm(Math.round(inchesToCm(heightInches)))
        setWeightKg(Math.round(lbsToKg(weightLbs)))
        setNeckCm(Math.round(inchesToCm(neckInches)))
        setWaistCm(Math.round(inchesToCm(waistInches)))
        setHipCm(Math.round(inchesToCm(hipInches)))
      }
    },
    [heightCm, weightKg, neckCm, waistCm, hipCm, heightInches, weightLbs, neckInches, waistInches, hipInches]
  )

  // Handle reset
  const handleReset = useCallback(() => {
    setGender('male')
    setAge(30)
    setUnitSystem('metric')
    setHeightCm(175)
    setWeightKg(75)
    setNeckCm(38)
    setWaistCm(85)
    setHipCm(100)
    setHeightInches(69)
    setWeightLbs(165)
    setNeckInches(15)
    setWaistInches(33.5)
    setHipInches(39.4)
  }, [])

  // Get threshold positions for visual scale
  const thresholds = useMemo(
    () => getCategoryThresholdPositions(gender),
    [gender]
  )

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Body Fat: ${formatBodyFatPercentage(result.bodyFatPercentage)}, ${getCategoryLabel(result.category)}`}
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
            <Select
              value={gender}
              onValueChange={(value: Gender) => setGender(value)}
            >
              <SelectTrigger className="h-12 text-base" id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t.male}</SelectItem>
                <SelectItem value="female">{t.female}</SelectItem>
              </SelectContent>
            </Select>
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
                min={18}
                max={120}
                step={1}
                aria-invalid={!!getFieldError('age')}
                aria-describedby={getFieldError('age') ? 'age-error' : undefined}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {t.units.years}
              </span>
            </div>
            {getFieldError('age') && (
              <p id="age-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('age')}
              </p>
            )}
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

          {/* Height Input */}
          {unitSystem === 'metric' ? (
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
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="heightInches" className="flex items-center gap-2 text-base">
                <Ruler className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.heightInches}
              </Label>
              <div className="relative">
                <Input
                  id="heightInches"
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('heightInches') ? 'border-destructive' : ''}`}
                  min={39}
                  max={98}
                  step={0.5}
                  aria-invalid={!!getFieldError('heightInches')}
                  aria-describedby={getFieldError('heightInches') ? 'heightInches-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.in}
                </span>
              </div>
              {getFieldError('heightInches') && (
                <p id="heightInches-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('heightInches')}
                </p>
              )}
              <Slider
                value={[heightInches]}
                onValueChange={([value]) => setHeightInches(value)}
                max={87}
                min={55}
                step={0.5}
                className="py-2"
                aria-label={t.heightInches}
              />
            </div>
          )}

          {/* Weight Input */}
          {unitSystem === 'metric' ? (
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
                  min={30}
                  max={300}
                  step={0.5}
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
                min={40}
                step={1}
                className="py-2"
                aria-label={t.weightKg}
              />
            </div>
          ) : (
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
                  min={66}
                  max={661}
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
                min={88}
                step={1}
                className="py-2"
                aria-label={t.weightLbs}
              />
            </div>
          )}

          {/* Neck Circumference */}
          {unitSystem === 'metric' ? (
            <div className="space-y-3">
              <Label htmlFor="neckCm" className="flex items-center gap-2 text-base">
                <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.neckCm}
              </Label>
              <div className="relative">
                <Input
                  id="neckCm"
                  type="number"
                  value={neckCm}
                  onChange={(e) => setNeckCm(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('neckCm') ? 'border-destructive' : ''}`}
                  min={20}
                  max={60}
                  step={0.5}
                  aria-invalid={!!getFieldError('neckCm')}
                  aria-describedby={getFieldError('neckCm') ? 'neckCm-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.cm}
                </span>
              </div>
              {getFieldError('neckCm') && (
                <p id="neckCm-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('neckCm')}
                </p>
              )}
              <Slider
                value={[neckCm]}
                onValueChange={([value]) => setNeckCm(value)}
                max={55}
                min={25}
                step={0.5}
                className="py-2"
                aria-label={t.neckCm}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="neckInches" className="flex items-center gap-2 text-base">
                <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.neckInches}
              </Label>
              <div className="relative">
                <Input
                  id="neckInches"
                  type="number"
                  value={neckInches}
                  onChange={(e) => setNeckInches(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('neckInches') ? 'border-destructive' : ''}`}
                  min={8}
                  max={24}
                  step={0.25}
                  aria-invalid={!!getFieldError('neckInches')}
                  aria-describedby={getFieldError('neckInches') ? 'neckInches-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.in}
                </span>
              </div>
              {getFieldError('neckInches') && (
                <p id="neckInches-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('neckInches')}
                </p>
              )}
              <Slider
                value={[neckInches]}
                onValueChange={([value]) => setNeckInches(value)}
                max={22}
                min={10}
                step={0.25}
                className="py-2"
                aria-label={t.neckInches}
              />
            </div>
          )}

          {/* Waist Circumference */}
          {unitSystem === 'metric' ? (
            <div className="space-y-3">
              <Label htmlFor="waistCm" className="flex items-center gap-2 text-base">
                <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.waistCm}
              </Label>
              <div className="relative">
                <Input
                  id="waistCm"
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('waistCm') ? 'border-destructive' : ''}`}
                  min={40}
                  max={200}
                  step={0.5}
                  aria-invalid={!!getFieldError('waistCm')}
                  aria-describedby={getFieldError('waistCm') ? 'waistCm-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.cm}
                </span>
              </div>
              {getFieldError('waistCm') && (
                <p id="waistCm-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('waistCm')}
                </p>
              )}
              <Slider
                value={[waistCm]}
                onValueChange={([value]) => setWaistCm(value)}
                max={150}
                min={50}
                step={0.5}
                className="py-2"
                aria-label={t.waistCm}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="waistInches" className="flex items-center gap-2 text-base">
                <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {t.waistInches}
              </Label>
              <div className="relative">
                <Input
                  id="waistInches"
                  type="number"
                  value={waistInches}
                  onChange={(e) => setWaistInches(Number(e.target.value))}
                  className={`pr-12 text-lg h-12 ${getFieldError('waistInches') ? 'border-destructive' : ''}`}
                  min={16}
                  max={79}
                  step={0.25}
                  aria-invalid={!!getFieldError('waistInches')}
                  aria-describedby={getFieldError('waistInches') ? 'waistInches-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {t.units.in}
                </span>
              </div>
              {getFieldError('waistInches') && (
                <p id="waistInches-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('waistInches')}
                </p>
              )}
              <Slider
                value={[waistInches]}
                onValueChange={([value]) => setWaistInches(value)}
                max={60}
                min={20}
                step={0.25}
                className="py-2"
                aria-label={t.waistInches}
              />
            </div>
          )}

          {/* Hip Circumference (Women Only) */}
          {gender === 'female' && (
            <>
              {unitSystem === 'metric' ? (
                <div className="space-y-3">
                  <Label htmlFor="hipCm" className="flex items-center gap-2 text-base">
                    <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {t.hipCm}
                  </Label>
                  <p className="text-sm text-muted-foreground">{t.hipNote}</p>
                  <div className="relative">
                    <Input
                      id="hipCm"
                      type="number"
                      value={hipCm}
                      onChange={(e) => setHipCm(Number(e.target.value))}
                      className={`pr-12 text-lg h-12 ${getFieldError('hipCm') ? 'border-destructive' : ''}`}
                      min={50}
                      max={200}
                      step={0.5}
                      aria-invalid={!!getFieldError('hipCm')}
                      aria-describedby={getFieldError('hipCm') ? 'hipCm-error' : undefined}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t.units.cm}
                    </span>
                  </div>
                  {getFieldError('hipCm') && (
                    <p id="hipCm-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {getFieldError('hipCm')}
                    </p>
                  )}
                  <Slider
                    value={[hipCm]}
                    onValueChange={([value]) => setHipCm(value)}
                    max={150}
                    min={60}
                    step={0.5}
                    className="py-2"
                    aria-label={t.hipCm}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="hipInches" className="flex items-center gap-2 text-base">
                    <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {t.hipInches}
                  </Label>
                  <p className="text-sm text-muted-foreground">{t.hipNote}</p>
                  <div className="relative">
                    <Input
                      id="hipInches"
                      type="number"
                      value={hipInches}
                      onChange={(e) => setHipInches(Number(e.target.value))}
                      className={`pr-12 text-lg h-12 ${getFieldError('hipInches') ? 'border-destructive' : ''}`}
                      min={20}
                      max={79}
                      step={0.25}
                      aria-invalid={!!getFieldError('hipInches')}
                      aria-describedby={getFieldError('hipInches') ? 'hipInches-error' : undefined}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t.units.in}
                    </span>
                  </div>
                  {getFieldError('hipInches') && (
                    <p id="hipInches-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {getFieldError('hipInches')}
                    </p>
                  )}
                  <Slider
                    value={[hipInches]}
                    onValueChange={([value]) => setHipInches(value)}
                    max={60}
                    min={24}
                    step={0.25}
                    className="py-2"
                    aria-label={t.hipInches}
                  />
                </div>
              )}
            </>
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
                {t.results.bodyFatPercentage}
              </div>
              <div
                className="text-5xl md:text-6xl font-bold tracking-tight"
                style={{ color: result ? getCategoryColor(result.category) : undefined }}
              >
                {result ? formatBodyFatPercentage(result.bodyFatPercentage) : '--%'}
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

          {/* Body Fat Visual Scale */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Scale Bar */}
                  <div
                    className="relative"
                    role="img"
                    aria-label={`${t.results.bodyFatPercentage}: ${result.bodyFatPercentage}% - ${getCategoryLabel(result.category)}`}
                  >
                    {/* Colored segments */}
                    <div className="h-6 rounded-full overflow-hidden flex" aria-hidden="true">
                      {/* Essential */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.essential}%`,
                          backgroundColor: BODY_FAT_CATEGORY_COLORS.essential,
                        }}
                      />
                      {/* Athletic */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.athletic - thresholds.essential}%`,
                          backgroundColor: BODY_FAT_CATEGORY_COLORS.athletic,
                        }}
                      />
                      {/* Fitness */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.fitness - thresholds.athletic}%`,
                          backgroundColor: BODY_FAT_CATEGORY_COLORS.fitness,
                        }}
                      />
                      {/* Acceptable */}
                      <div
                        className="h-full"
                        style={{
                          width: `${thresholds.acceptable - thresholds.fitness}%`,
                          backgroundColor: BODY_FAT_CATEGORY_COLORS.acceptable,
                        }}
                      />
                      {/* Obese */}
                      <div
                        className="h-full flex-1"
                        style={{
                          backgroundColor: BODY_FAT_CATEGORY_COLORS.obese,
                        }}
                      />
                    </div>

                    {/* Position indicator */}
                    <div
                      className="absolute top-0 w-1 h-8 -mt-1 bg-foreground rounded transform -translate-x-1/2"
                      style={{
                        left: `${getBodyFatScalePosition(result.bodyFatPercentage)}%`,
                      }}
                    />
                  </div>

                  {/* Scale labels */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>{BODY_FAT_THRESHOLDS[gender].athletic.max}%</span>
                    <span>{BODY_FAT_THRESHOLDS[gender].fitness.max}%</span>
                    <span>{BODY_FAT_THRESHOLDS[gender].acceptable.max}%</span>
                    <span>50%</span>
                  </div>

                  {/* Category Legend */}
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BODY_FAT_CATEGORY_COLORS.essential }}
                      />
                      <span>{t.scale.essential}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BODY_FAT_CATEGORY_COLORS.athletic }}
                      />
                      <span>{t.scale.athletic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BODY_FAT_CATEGORY_COLORS.fitness }}
                      />
                      <span>{t.scale.fitness}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BODY_FAT_CATEGORY_COLORS.acceptable }}
                      />
                      <span>{t.scale.acceptable}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BODY_FAT_CATEGORY_COLORS.obese }}
                      />
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
                {/* Body Fat Mass */}
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-medium">{t.results.bodyFatMass}</div>
                    <div className="text-muted-foreground">
                      {formatWeight(result.bodyFatMass, result.unit)}
                    </div>
                  </div>
                </div>

                {/* Lean Body Mass */}
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-medium">{t.results.leanBodyMass}</div>
                    <div className="text-muted-foreground">
                      {formatWeight(result.leanBodyMass, result.unit)}
                    </div>
                  </div>
                </div>

                {/* Ideal Range */}
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-medium">{t.results.idealRange}</div>
                    <div className="text-muted-foreground">
                      {result.idealBodyFatRange.min}% - {result.idealBodyFatRange.max}%
                    </div>
                  </div>
                </div>

                {/* Fat to Lose (if applicable) */}
                {result.fatToLose > 0 ? (
                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-orange-500 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium">{t.results.fatToLose}</div>
                      <div className="text-muted-foreground">
                        {formatWeight(result.fatToLose, result.unit)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-green-500 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-green-600">{t.results.inRange}</div>
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
