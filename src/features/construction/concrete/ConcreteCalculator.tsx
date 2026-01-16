'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Ruler,
  Package,
  Truck,
  Layers,
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
  calculateConcrete,
  validateConcreteInputs,
  formatVolume,
  formatBagCount,
} from './calculations'
import type {
  ProjectType,
  UnitSystem,
  ConcreteResult,
  ConcreteValidation,
} from './types'

interface ConcreteCalculatorTranslations {
  projectType: string
  projectTypes: {
    slab: string
    footing: string
    column: string
    stairs: string
    custom: string
  }
  unitSystem: string
  units: {
    imperial: string
    metric: string
    ft: string
    m: string
    in: string
    cm: string
    cubicFeet: string
    cubicYards: string
    cubicMeters: string
    bags: string
    lbs: string
  }
  inputs: {
    length: string
    width: string
    thickness: string
    depth: string
    diameter: string
    height: string
    quantity: string
    platformWidth: string
    platformDepth: string
    riseHeight: string
    runDepth: string
    stepWidth: string
    numberOfSteps: string
    volume: string
    wastePercent: string
  }
  actions: {
    calculate: string
    reset: string
  }
  results: {
    title: string
    volume: string
    volumeWithWaste: string
    bags: string
    bagOption: string
    bagsNeeded: string
    totalWeight: string
    preMixed: string
    truckLoads: string
    recommendation: string
    smallProject: string
    largeProject: string
  }
  validation: {
    projectTypeRequired: string
    lengthRequired: string
    widthRequired: string
    thicknessRequired: string
    depthRequired: string
    diameterRequired: string
    heightRequired: string
    quantityRequired: string
    platformWidthRequired: string
    platformDepthRequired: string
    riseHeightRequired: string
    runDepthRequired: string
    stepWidthRequired: string
    numberOfStepsRequired: string
    volumeRequired: string
  }
}

interface ConcreteCalculatorProps {
  locale?: string
  translations: ConcreteCalculatorTranslations
}

export function ConcreteCalculator({
  locale = 'en-US',
  translations: t,
}: ConcreteCalculatorProps) {
  // Input state
  const [projectType, setProjectType] = useState<ProjectType>('slab')
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [wastePercent, setWastePercent] = useState(10)

  // Slab inputs
  const [slabLength, setSlabLength] = useState(10)
  const [slabWidth, setSlabWidth] = useState(10)
  const [slabThickness, setSlabThickness] = useState(4)

  // Footing inputs
  const [footingLength, setFootingLength] = useState(20)
  const [footingWidth, setFootingWidth] = useState(1)
  const [footingDepth, setFootingDepth] = useState(1)

  // Column inputs
  const [columnDiameter, setColumnDiameter] = useState(1)
  const [columnHeight, setColumnHeight] = useState(3)
  const [columnQuantity, setColumnQuantity] = useState(4)

  // Stairs inputs
  const [platformWidth, setPlatformWidth] = useState(4)
  const [platformDepth, setPlatformDepth] = useState(4)
  const [riseHeight, setRiseHeight] = useState(7)
  const [runDepth, setRunDepth] = useState(11)
  const [stepWidth, setStepWidth] = useState(4)
  const [numberOfSteps, setNumberOfSteps] = useState(5)

  // Custom input
  const [customVolume, setCustomVolume] = useState(10)

  // Build inputs based on project type
  const inputs = useMemo(() => {
    const conversionFactor = unitSystem === 'metric' ? 3.28084 : 1

    switch (projectType) {
      case 'slab':
        return {
          projectType: 'slab' as const,
          length: slabLength * conversionFactor,
          width: slabWidth * conversionFactor,
          thickness: unitSystem === 'metric' ? slabThickness / 2.54 : slabThickness, // Convert cm to inches
        }
      case 'footing':
        return {
          projectType: 'footing' as const,
          length: footingLength * conversionFactor,
          width: footingWidth * conversionFactor,
          depth: footingDepth * conversionFactor,
        }
      case 'column':
        return {
          projectType: 'column' as const,
          diameter: columnDiameter * conversionFactor,
          height: columnHeight * conversionFactor,
          quantity: columnQuantity,
        }
      case 'stairs':
        return {
          projectType: 'stairs' as const,
          platformWidth: platformWidth * conversionFactor,
          platformDepth: platformDepth * conversionFactor,
          riseHeight: unitSystem === 'metric' ? riseHeight / 2.54 : riseHeight,
          runDepth: unitSystem === 'metric' ? runDepth / 2.54 : runDepth,
          stepWidth: stepWidth * conversionFactor,
          numberOfSteps,
        }
      case 'custom':
        return {
          projectType: 'custom' as const,
          cubicFeet: unitSystem === 'metric' ? customVolume * 35.3147 : customVolume,
        }
    }
  }, [
    projectType,
    unitSystem,
    slabLength,
    slabWidth,
    slabThickness,
    footingLength,
    footingWidth,
    footingDepth,
    columnDiameter,
    columnHeight,
    columnQuantity,
    platformWidth,
    platformDepth,
    riseHeight,
    runDepth,
    stepWidth,
    numberOfSteps,
    customVolume,
  ])

  // Validation
  const validation: ConcreteValidation = useMemo(() => {
    return validateConcreteInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: ConcreteResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateConcrete(inputs, wastePercent)
  }, [inputs, validation.valid, wastePercent])

  // Handle reset
  const handleReset = useCallback(() => {
    setProjectType('slab')
    setUnitSystem('imperial')
    setWastePercent(10)
    setSlabLength(10)
    setSlabWidth(10)
    setSlabThickness(4)
    setFootingLength(20)
    setFootingWidth(1)
    setFootingDepth(1)
    setColumnDiameter(1)
    setColumnHeight(3)
    setColumnQuantity(4)
    setPlatformWidth(4)
    setPlatformDepth(4)
    setRiseHeight(7)
    setRunDepth(11)
    setStepWidth(4)
    setNumberOfSteps(5)
    setCustomVolume(10)
  }, [])

  const lengthUnit = unitSystem === 'imperial' ? t.units.ft : t.units.m
  const smallUnit = unitSystem === 'imperial' ? t.units.in : t.units.cm

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Volume: ${formatVolume(result.cubicYards, 'cubicYards', locale)} ${t.units.cubicYards}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Project Type */}
          <div className="space-y-3">
            <Label
              htmlFor="projectType"
              className="flex items-center gap-2 text-base"
            >
              <Box className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.projectType}
            </Label>
            <Select
              value={projectType}
              onValueChange={(v) => setProjectType(v as ProjectType)}
            >
              <SelectTrigger className="h-12 text-base" id="projectType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slab">{t.projectTypes.slab}</SelectItem>
                <SelectItem value="footing">{t.projectTypes.footing}</SelectItem>
                <SelectItem value="column">{t.projectTypes.column}</SelectItem>
                <SelectItem value="stairs">{t.projectTypes.stairs}</SelectItem>
                <SelectItem value="custom">{t.projectTypes.custom}</SelectItem>
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

          {/* Slab Inputs */}
          {projectType === 'slab' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="slabLength">{t.inputs.length}</Label>
                  <div className="relative">
                    <Input
                      id="slabLength"
                      type="number"
                      value={slabLength}
                      onChange={(e) => setSlabLength(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="slabWidth">{t.inputs.width}</Label>
                  <div className="relative">
                    <Input
                      id="slabWidth"
                      type="number"
                      value={slabWidth}
                      onChange={(e) => setSlabWidth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="slabThickness">{t.inputs.thickness}</Label>
                <div className="relative">
                  <Input
                    id="slabThickness"
                    type="number"
                    value={slabThickness}
                    onChange={(e) => setSlabThickness(Number(e.target.value))}
                    className="pr-10 h-12"
                    min={1}
                    step={0.5}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {smallUnit}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Footing Inputs */}
          {projectType === 'footing' && (
            <>
              <div className="space-y-3">
                <Label htmlFor="footingLength">{t.inputs.length}</Label>
                <div className="relative">
                  <Input
                    id="footingLength"
                    type="number"
                    value={footingLength}
                    onChange={(e) => setFootingLength(Number(e.target.value))}
                    className="pr-10 h-12"
                    min={0.1}
                    step={0.5}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {lengthUnit}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="footingWidth">{t.inputs.width}</Label>
                  <div className="relative">
                    <Input
                      id="footingWidth"
                      type="number"
                      value={footingWidth}
                      onChange={(e) => setFootingWidth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.25}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="footingDepth">{t.inputs.depth}</Label>
                  <div className="relative">
                    <Input
                      id="footingDepth"
                      type="number"
                      value={footingDepth}
                      onChange={(e) => setFootingDepth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.25}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Column Inputs */}
          {projectType === 'column' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="columnDiameter">{t.inputs.diameter}</Label>
                  <div className="relative">
                    <Input
                      id="columnDiameter"
                      type="number"
                      value={columnDiameter}
                      onChange={(e) => setColumnDiameter(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.25}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="columnHeight">{t.inputs.height}</Label>
                  <div className="relative">
                    <Input
                      id="columnHeight"
                      type="number"
                      value={columnHeight}
                      onChange={(e) => setColumnHeight(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="columnQuantity">{t.inputs.quantity}</Label>
                <Input
                  id="columnQuantity"
                  type="number"
                  value={columnQuantity}
                  onChange={(e) => setColumnQuantity(Number(e.target.value))}
                  className="h-12"
                  min={1}
                  step={1}
                />
              </div>
            </>
          )}

          {/* Stairs Inputs */}
          {projectType === 'stairs' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="platformWidth">{t.inputs.platformWidth}</Label>
                  <div className="relative">
                    <Input
                      id="platformWidth"
                      type="number"
                      value={platformWidth}
                      onChange={(e) => setPlatformWidth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="platformDepth">{t.inputs.platformDepth}</Label>
                  <div className="relative">
                    <Input
                      id="platformDepth"
                      type="number"
                      value={platformDepth}
                      onChange={(e) => setPlatformDepth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="riseHeight">{t.inputs.riseHeight}</Label>
                  <div className="relative">
                    <Input
                      id="riseHeight"
                      type="number"
                      value={riseHeight}
                      onChange={(e) => setRiseHeight(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {smallUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="runDepth">{t.inputs.runDepth}</Label>
                  <div className="relative">
                    <Input
                      id="runDepth"
                      type="number"
                      value={runDepth}
                      onChange={(e) => setRunDepth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {smallUnit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="stepWidth">{t.inputs.stepWidth}</Label>
                  <div className="relative">
                    <Input
                      id="stepWidth"
                      type="number"
                      value={stepWidth}
                      onChange={(e) => setStepWidth(Number(e.target.value))}
                      className="pr-10 h-12"
                      min={0.1}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {lengthUnit}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="numberOfSteps">{t.inputs.numberOfSteps}</Label>
                  <Input
                    id="numberOfSteps"
                    type="number"
                    value={numberOfSteps}
                    onChange={(e) => setNumberOfSteps(Number(e.target.value))}
                    className="h-12"
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            </>
          )}

          {/* Custom Input */}
          {projectType === 'custom' && (
            <div className="space-y-3">
              <Label htmlFor="customVolume">{t.inputs.volume}</Label>
              <div className="relative">
                <Input
                  id="customVolume"
                  type="number"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(Number(e.target.value))}
                  className="pr-16 h-12"
                  min={0.1}
                  step={1}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {unitSystem === 'imperial' ? t.units.cubicFeet : t.units.cubicMeters}
                </span>
              </div>
            </div>
          )}

          {/* Waste Percentage */}
          <div className="space-y-3">
            <Label id="wastePercentLabel" className="flex items-center justify-between">
              <span>{t.inputs.wastePercent}</span>
              <span className="text-muted-foreground">{wastePercent}%</span>
            </Label>
            <Slider
              value={[wastePercent]}
              onValueChange={([value]) => setWastePercent(value)}
              max={20}
              min={0}
              step={1}
              className="py-2"
              aria-labelledby="wastePercentLabel"
              aria-valuetext={`${wastePercent} percent`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
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
          {/* Main Volume Result */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-primary mb-2">
                {t.results.volumeWithWaste}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {result ? formatVolume(result.cubicYardsWithWaste, 'cubicYards', locale) : '--'}
              </div>
              <div className="text-lg text-primary/80 mt-1">{t.units.cubicYards}</div>
              {result && (
                <div className="text-sm text-muted-foreground mt-2">
                  {formatVolume(result.cubicFeetWithWaste, 'cubicFeet', locale)} {t.units.cubicFeet} |{' '}
                  {formatVolume(result.cubicMetersWithWaste, 'cubicMeters', locale)} {t.units.cubicMeters}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bag Options */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 font-medium mb-4">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  {t.results.bags}
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'bag40lb', label: '40 lb', data: result.bags.bag40lb },
                    { key: 'bag60lb', label: '60 lb', data: result.bags.bag60lb },
                    { key: 'bag80lb', label: '80 lb', data: result.bags.bag80lb },
                  ].map(({ key, label, data }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{label} {t.results.bagOption}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatBagCount(data.totalWeight, locale)} {t.units.lbs} total
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatBagCount(data.bagsNeeded, locale)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {t.units.bags}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pre-Mixed Delivery */}
          {result && result.cubicYardsWithWaste > 1 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 font-medium mb-4">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  {t.results.preMixed}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.results.truckLoads}</div>
                    <div className="text-sm text-muted-foreground">10 yd³ trucks</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.truckLoads}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendation */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 font-medium mb-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  {t.results.recommendation}
                </div>
                <p className="text-muted-foreground">
                  {result.cubicYardsWithWaste < 1
                    ? t.results.smallProject
                    : t.results.largeProject}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
