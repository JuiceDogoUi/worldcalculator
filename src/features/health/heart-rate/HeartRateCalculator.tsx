'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Heart,
  Activity,
  AlertCircle,
  Info,
  Target,
  Clock,
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
  calculateHeartRate,
  validateHeartRateInputs,
  formatIntensityRange,
} from './calculations'
import type {
  HeartRateInputs,
  HeartRateResult,
  HeartRateValidation,
  TrainingGoal,
  HeartRateZoneId,
} from './types'

interface HeartRateCalculatorTranslations {
  age: string
  ageYears: string
  restingHeartRate: string
  restingHRBpm: string
  restingHRHelp: string
  trainingGoal: string
  trainingGoalOptional: string
  goals: {
    none: string
    'general-fitness': string
    'fat-burn': string
    cardio: string
    performance: string
  }
  reset: string
  results: {
    title: string
    maxHeartRate: string
    heartRateReserve: string
    trainingZones: string
    recommendedZone: string
    intensity: string
    heartRateRange: string
  }
  zones: {
    zone1: { name: string; description: string; benefits: string }
    zone2: { name: string; description: string; benefits: string }
    zone3: { name: string; description: string; benefits: string }
    zone4: { name: string; description: string; benefits: string }
    zone5: { name: string; description: string; benefits: string }
  }
  units: {
    bpm: string
    years: string
  }
  validation: {
    ageRequired: string
    ageInvalid: string
    agePositive: string
    ageTooLow: string
    ageTooHigh: string
    restingHRRequired: string
    restingHRInvalid: string
    restingHRPositive: string
    restingHRTooLow: string
    restingHRTooHigh: string
    restingHRExceedsMax: string
  }
}

interface HeartRateCalculatorProps {
  locale?: string
  translations: HeartRateCalculatorTranslations
}

export function HeartRateCalculator({
  translations: t,
}: HeartRateCalculatorProps) {
  // Input state with reasonable defaults
  const [age, setAge] = useState<number>(30)
  const [restingHeartRate, setRestingHeartRate] = useState<number>(70)
  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal | undefined>(undefined)

  // Build inputs object
  const inputs: HeartRateInputs = useMemo(() => {
    return {
      age,
      restingHeartRate,
      trainingGoal,
    }
  }, [age, restingHeartRate, trainingGoal])

  // Validate inputs
  const validation: HeartRateValidation = useMemo(() => {
    return validateHeartRateInputs(inputs)
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
  const result: HeartRateResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateHeartRate(inputs)
  }, [inputs, validation.valid])

  // Get zone translation
  const getZoneTranslation = useCallback(
    (zoneId: HeartRateZoneId) => {
      return t.zones[zoneId]
    },
    [t.zones]
  )

  // Handle reset
  const handleReset = useCallback(() => {
    setAge(30)
    setRestingHeartRate(70)
    setTrainingGoal(undefined)
  }, [])

  // Handle goal change
  const handleGoalChange = useCallback((value: string) => {
    if (value === 'none') {
      setTrainingGoal(undefined)
    } else {
      setTrainingGoal(value as TrainingGoal)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `Maximum Heart Rate: ${result.maxHeartRate} bpm, Heart Rate Reserve: ${result.heartRateReserve} bpm`}
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Age Input */}
          <div className="space-y-3">
            <Label htmlFor="age" className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.ageYears}
            </Label>
            <div className="relative">
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`pr-16 text-lg h-12 ${getFieldError('age') ? 'border-destructive' : ''}`}
                min={10}
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
            <Slider
              value={[age]}
              onValueChange={([value]) => setAge(value)}
              max={100}
              min={10}
              step={1}
              className="py-2"
              aria-label={t.age}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10 {t.units.years}</span>
              <span>100 {t.units.years}</span>
            </div>
          </div>

          {/* Resting Heart Rate Input */}
          <div className="space-y-3">
            <Label htmlFor="restingHeartRate" className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.restingHRBpm}
            </Label>
            <div className="relative">
              <Input
                id="restingHeartRate"
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                className={`pr-16 text-lg h-12 ${getFieldError('restingHeartRate') ? 'border-destructive' : ''}`}
                min={30}
                max={120}
                step={1}
                aria-invalid={!!getFieldError('restingHeartRate')}
                aria-describedby={getFieldError('restingHeartRate') ? 'restingHR-error restingHR-help' : 'restingHR-help'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {t.units.bpm}
              </span>
            </div>
            {getFieldError('restingHeartRate') && (
              <p id="restingHR-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('restingHeartRate')}
              </p>
            )}
            <p id="restingHR-help" className="text-sm text-muted-foreground flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              {t.restingHRHelp}
            </p>
            <Slider
              value={[restingHeartRate]}
              onValueChange={([value]) => setRestingHeartRate(value)}
              max={120}
              min={30}
              step={1}
              className="py-2"
              aria-label={t.restingHeartRate}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 {t.units.bpm}</span>
              <span>120 {t.units.bpm}</span>
            </div>
          </div>

          {/* Training Goal Select */}
          <div className="space-y-3">
            <Label htmlFor="trainingGoal" className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.trainingGoalOptional}
            </Label>
            <Select
              value={trainingGoal || 'none'}
              onValueChange={handleGoalChange}
            >
              <SelectTrigger className="h-12 text-base" id="trainingGoal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t.goals.none}</SelectItem>
                <SelectItem value="general-fitness">{t.goals['general-fitness']}</SelectItem>
                <SelectItem value="fat-burn">{t.goals['fat-burn']}</SelectItem>
                <SelectItem value="cardio">{t.goals.cardio}</SelectItem>
                <SelectItem value="performance">{t.goals.performance}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Max Heart Rate */}
            <Card className="overflow-hidden border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-red-600 mb-1">
                  {t.results.maxHeartRate}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  {result ? result.maxHeartRate : '--'}
                </div>
                <div className="text-sm text-red-500">{t.units.bpm}</div>
              </CardContent>
            </Card>

            {/* Heart Rate Reserve */}
            <Card className="overflow-hidden border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-blue-600 mb-1">
                  {t.results.heartRateReserve}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {result ? result.heartRateReserve : '--'}
                </div>
                <div className="text-sm text-blue-500">{t.units.bpm}</div>
              </CardContent>
            </Card>
          </div>

          {/* Training Zones Visual */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
                  {t.results.trainingZones}
                </h3>

                {/* Visual Zone Bar */}
                <div className="relative mb-6" role="presentation" aria-hidden="true">
                  <div className="h-8 rounded-full overflow-hidden flex">
                    {result.zones.map((zone) => (
                      <div
                        key={zone.id}
                        className="h-full flex-1 relative"
                        style={{ backgroundColor: zone.color }}
                      >
                        {result.recommendedZone === zone.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Zone labels below the bar */}
                  <div className="flex mt-2">
                    {result.zones.map((zone, index) => (
                      <div key={zone.id} className="flex-1 text-center">
                        <span className="text-xs font-medium">Z{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zone Details */}
                <div className="space-y-3">
                  {result.zones.map((zone, index) => {
                    const zoneTranslation = getZoneTranslation(zone.id)
                    const isRecommended = result.recommendedZone === zone.id

                    return (
                      <div
                        key={zone.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isRecommended
                            ? 'border-primary shadow-md'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: zone.bgColor }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: zone.color }}
                              />
                              <span className="font-semibold">
                                Zone {index + 1}: {zoneTranslation.name}
                              </span>
                              {isRecommended && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                  <Target className="h-3 w-3" />
                                  {t.results.recommendedZone}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {zoneTranslation.description}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              {zoneTranslation.benefits}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-medium" style={{ color: zone.color }}>
                              {formatIntensityRange(zone.minIntensity, zone.maxIntensity)}
                            </div>
                            <div className="text-lg font-bold">
                              {zone.minHR} - {zone.maxHR}
                            </div>
                            <div className="text-xs text-muted-foreground">{t.units.bpm}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
