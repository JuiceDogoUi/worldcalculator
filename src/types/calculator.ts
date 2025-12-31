export type CalculatorCategory =
  | 'finance'
  | 'health'
  | 'math'
  | 'conversion'
  | 'time-date'
  | 'construction'
  | 'statistics'

export interface Calculator {
  id: string
  slug: string
  category: CalculatorCategory
  translationKey: string
  icon: string
  featured: boolean
  difficulty: 'easy' | 'medium' | 'advanced'
  estimatedTime: number // in seconds
  relatedCalculators: string[]
  /** ISO date string for last content update (YYYY-MM-DD) */
  lastModified?: string
}

export interface CalculatorInput {
  id: string
  label: string
  type: 'number' | 'select' | 'slider' | 'radio' | 'text'
  defaultValue: number | string
  min?: number
  max?: number
  step?: number
  unit?: string
  required: boolean
  validation?: (value: number | string) => string | null
  helpText?: string
  options?: Array<{ label: string; value: string | number }>
}

export interface CalculatorOutput {
  id: string
  label: string
  value: number | string
  unit?: string
  format?: 'currency' | 'percentage' | 'number' | 'decimal'
  precision?: number
  highlight?: boolean
}

export interface CalculatorResult {
  outputs: CalculatorOutput[]
  formula?: string
  explanation?: string
  chartData?: Record<string, unknown>
  tableData?: Array<Record<string, unknown>>
}

export interface CalculatorConfig<TInputs = Record<string, unknown>> {
  inputs: CalculatorInput[]
  calculate: (inputs: TInputs) => CalculatorResult
  validate: (inputs: TInputs) => Record<string, string>
  defaultValues: TInputs
}
