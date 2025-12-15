'use client'

import { useState, useCallback } from 'react'
import { useCalculatorUrlState } from './useUrlParams'
import { useSavedCalculations, useCalculatorPreferences } from './useLocalStorage'
import { useCalculatorHistory } from './useCalculatorHistory'

/**
 * Comprehensive calculator state management hook
 * Combines URL params, localStorage, history, and preferences
 *
 * @param config - Configuration object
 * @returns Complete calculator state management API
 *
 * @example
 * ```tsx
 * const calculator = useCalculatorState({
 *   calculatorId: 'bmi-calculator',
 *   defaultInputs: { weight: 70, height: 175 },
 *   defaultPreferences: { unit: 'metric' },
 *   enableUrlSharing: true,
 *   enableHistory: true,
 *   maxHistory: 50
 * })
 *
 * // Access inputs (synced with URL if enabled)
 * const { weight, height } = calculator.inputs
 *
 * // Update inputs
 * calculator.setInputs({ weight: 75 })
 *
 * // Calculate and save to history
 * const results = calculateBMI(calculator.inputs)
 * calculator.saveCalculation(results)
 *
 * // Get shareable URL
 * const url = calculator.getShareUrl()
 *
 * // Access history
 * const recentCalculations = calculator.history
 * ```
 */
export interface CalculatorStateConfig<
  TInputs extends Record<string, unknown> = Record<string, unknown>,
  TPreferences extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * Unique identifier for the calculator
   */
  calculatorId: string

  /**
   * Default input values
   */
  defaultInputs: TInputs

  /**
   * Default preferences (optional)
   */
  defaultPreferences?: TPreferences

  /**
   * Enable URL parameter sharing (default: true)
   */
  enableUrlSharing?: boolean

  /**
   * Enable calculation history (default: true)
   */
  enableHistory?: boolean

  /**
   * Maximum number of history entries (default: 50)
   */
  maxHistory?: number

  /**
   * Maximum number of saved calculations (default: 10)
   */
  maxSaved?: number
}

export function useCalculatorState<
  TInputs extends Record<string, unknown> = Record<string, unknown>,
  TResults extends Record<string, unknown> = Record<string, unknown>,
  TPreferences extends Record<string, unknown> = Record<string, unknown>
>(config: CalculatorStateConfig<TInputs, TPreferences>) {
  const {
    calculatorId,
    defaultInputs,
    defaultPreferences = {} as TPreferences,
    enableUrlSharing = true,
    enableHistory = true,
    maxHistory = 50,
    maxSaved = 10,
  } = config

  // URL state management (for sharing)
  const [urlInputs, setUrlInputs, resetUrlInputs] = useCalculatorUrlState(
    enableUrlSharing ? defaultInputs : {}
  )

  // Local state for inputs (used when URL sharing is disabled)
  const [localInputs, setLocalInputs] = useState<TInputs>(defaultInputs)

  // Results state
  const [results, setResults] = useState<TResults | null>(null)

  // Use URL inputs if enabled, otherwise use local inputs
  const inputs = enableUrlSharing ? (urlInputs as TInputs) : localInputs

  // Saved calculations
  const {
    savedCalculations,
    saveCalculation: saveToStorage,
    removeCalculation: removeFromStorage,
    clearAll: clearSaved,
    getCalculation,
  } = useSavedCalculations(calculatorId, maxSaved)

  // History
  const {
    history,
    isLoading: isHistoryLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentCalculations,
    searchHistory,
    getEntry,
    getStats,
  } = useCalculatorHistory(calculatorId, enableHistory ? maxHistory : 0)

  // Preferences
  const {
    preferences,
    updatePreferences,
    resetPreferences,
  } = useCalculatorPreferences(calculatorId, defaultPreferences)

  /**
   * Update calculator inputs
   */
  const setInputs = useCallback(
    (updates: Partial<TInputs>) => {
      if (enableUrlSharing) {
        setUrlInputs(updates)
      } else {
        setLocalInputs((prev) => ({ ...prev, ...updates }))
      }
    },
    [enableUrlSharing, setUrlInputs]
  )

  /**
   * Reset inputs to defaults
   */
  const resetInputs = useCallback(() => {
    if (enableUrlSharing) {
      resetUrlInputs()
    } else {
      setLocalInputs(defaultInputs)
    }
    setResults(null)
  }, [enableUrlSharing, resetUrlInputs, defaultInputs])

  /**
   * Calculate and optionally save to history
   */
  const calculate = useCallback(
    (
      calculationFn: (inputs: TInputs) => TResults,
      options?: { saveToHistory?: boolean; saveCalculation?: boolean }
    ) => {
      const newResults = calculationFn(inputs)
      setResults(newResults)

      // Save to history if enabled
      if (enableHistory && options?.saveToHistory !== false) {
        addToHistory({
          inputs,
          results: newResults,
        })
      }

      // Save to storage if requested
      if (options?.saveCalculation) {
        saveToStorage({
          inputs,
          results: newResults,
        })
      }

      return newResults
    },
    [inputs, enableHistory, addToHistory, saveToStorage]
  )

  /**
   * Save current calculation
   */
  const saveCurrentCalculation = useCallback(() => {
    if (!results) return null
    return saveToStorage({
      inputs,
      results,
    })
  }, [inputs, results, saveToStorage])

  /**
   * Load a saved calculation
   */
  const loadSavedCalculation = useCallback(
    (id: string) => {
      const calculation = getCalculation(id)
      if (calculation) {
        setInputs(calculation.inputs as Partial<TInputs>)
        setResults(calculation.results as TResults)
      }
    },
    [getCalculation, setInputs]
  )

  /**
   * Load a history entry
   */
  const loadHistoryEntry = useCallback(
    (id: string) => {
      const entry = getEntry(id)
      if (entry) {
        setInputs(entry.inputs as Partial<TInputs>)
        setResults(entry.results as TResults)
      }
    },
    [getEntry, setInputs]
  )

  /**
   * Get shareable URL (only works with URL sharing enabled)
   */
  const getShareUrl = useCallback(() => {
    if (!enableUrlSharing) {
      console.warn('URL sharing is disabled for this calculator')
      return ''
    }

    if (typeof window === 'undefined') return ''

    const params = new URLSearchParams()
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value))
    })

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }, [enableUrlSharing, inputs])

  /**
   * Copy share URL to clipboard
   */
  const copyShareUrl = useCallback(async () => {
    const url = getShareUrl()
    if (!url) return false

    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch (error) {
      console.error('Failed to copy URL:', error)
      return false
    }
  }, [getShareUrl])

  return {
    // State
    inputs,
    results,
    preferences,
    isLoading: isHistoryLoading,

    // Input management
    setInputs,
    resetInputs,

    // Calculation
    calculate,
    setResults,

    // Saved calculations
    savedCalculations,
    saveCurrentCalculation,
    loadSavedCalculation,
    removeSavedCalculation: removeFromStorage,
    clearSavedCalculations: clearSaved,

    // History
    history,
    loadHistoryEntry,
    removeHistoryEntry: removeFromHistory,
    clearHistory,
    getRecentCalculations,
    searchHistory,
    getHistoryStats: getStats,

    // Preferences
    updatePreferences,
    resetPreferences,

    // Sharing
    getShareUrl,
    copyShareUrl,

    // Metadata
    calculatorId,
  }
}
