'use client'

import { useState, useCallback } from 'react'
import { generateId } from '@/lib/id'

/**
 * Hook for managing state in localStorage
 * Automatically syncs state with localStorage and handles SSR
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is in localStorage
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [name, setName, removeName] = useLocalStorage('user-name', 'Guest')
 *
 * // Update value (automatically saves to localStorage)
 * setName('John')
 *
 * // Remove from localStorage
 * removeName()
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Use functional update to avoid including storedValue in dependencies
        setStoredValue((prevValue) => {
          // Allow value to be a function so we have same API as useState
          const valueToStore =
            value instanceof Function ? value(prevValue) : value

          if (typeof window !== 'undefined') {
            try {
              window.localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch (storageError) {
              // Handle QuotaExceededError
              if (
                storageError instanceof DOMException &&
                (storageError.name === 'QuotaExceededError' ||
                  storageError.name === 'NS_ERROR_DOM_QUOTA_REACHED')
              ) {
                console.warn(
                  `localStorage quota exceeded for key "${key}". Attempting to clear old data...`
                )

                // Try to clear this specific key and retry
                try {
                  window.localStorage.removeItem(key)
                  window.localStorage.setItem(key, JSON.stringify(valueToStore))
                  console.info(`Successfully saved after clearing key "${key}"`)
                } catch (retryError) {
                  console.error(
                    `Failed to save to localStorage even after clearing key "${key}":`,
                    retryError
                  )
                  // Still return the value to update state, even if storage failed
                }
              } else {
                console.warn(`Error accessing localStorage for key "${key}":`, storageError)
              }
            }
          }

          return valueToStore
        })
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // Remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing calculator-specific saved calculations
 * Stores calculations with metadata (timestamp, inputs, results)
 *
 * @param calculatorId - Unique identifier for the calculator
 * @param maxSaved - Maximum number of saved calculations (default: 10)
 *
 * @example
 * ```tsx
 * const { savedCalculations, saveCalculation, removeCalculation, clearAll } =
 *   useSavedCalculations('bmi-calculator', 5)
 *
 * // Save a calculation
 * saveCalculation({
 *   inputs: { weight: 70, height: 175 },
 *   results: { bmi: 22.86, category: 'Normal' }
 * })
 *
 * // Remove a specific calculation
 * removeCalculation(calculationId)
 *
 * // Clear all saved calculations
 * clearAll()
 * ```
 */
export interface SavedCalculation {
  id: string
  timestamp: number
  inputs: Record<string, unknown>
  results: Record<string, unknown>
}

export function useSavedCalculations(
  calculatorId: string,
  maxSaved: number = 10
) {
  const storageKey = `calculator-${calculatorId}-saved`

  const [savedCalculations, setSavedCalculations, clearSavedCalculations] =
    useLocalStorage<SavedCalculation[]>(storageKey, [])


  /**
   * Save a new calculation
   */
  const saveCalculation = useCallback(
    (data: { inputs: Record<string, unknown>; results: Record<string, unknown> }) => {
      const newCalculation: SavedCalculation = {
        id: generateId(),
        timestamp: Date.now(),
        inputs: data.inputs,
        results: data.results,
      }

      setSavedCalculations((prev) => {
        // Add new calculation at the beginning
        const updated = [newCalculation, ...prev]
        // Limit to maxSaved
        return updated.slice(0, maxSaved)
      })

      return newCalculation.id
    },
    [setSavedCalculations, maxSaved]
  )

  /**
   * Remove a specific calculation
   */
  const removeCalculation = useCallback(
    (id: string) => {
      setSavedCalculations((prev) => prev.filter((calc) => calc.id !== id))
    },
    [setSavedCalculations]
  )

  /**
   * Clear all saved calculations
   */
  const clearAll = useCallback(() => {
    clearSavedCalculations()
  }, [clearSavedCalculations])

  /**
   * Get a specific calculation by ID
   */
  const getCalculation = useCallback(
    (id: string) => {
      return savedCalculations.find((calc) => calc.id === id)
    },
    [savedCalculations]
  )

  return {
    savedCalculations,
    saveCalculation,
    removeCalculation,
    clearAll,
    getCalculation,
  }
}

/**
 * Hook for managing calculator preferences
 * Stores user preferences like default values, units, etc.
 *
 * @param calculatorId - Unique identifier for the calculator
 * @param defaultPreferences - Default preferences object
 *
 * @example
 * ```tsx
 * const { preferences, updatePreferences, resetPreferences } =
 *   useCalculatorPreferences('bmi-calculator', {
 *     unit: 'metric',
 *     showDetails: true
 *   })
 *
 * // Update preferences
 * updatePreferences({ unit: 'imperial' })
 *
 * // Reset to defaults
 * resetPreferences()
 * ```
 */
export function useCalculatorPreferences<T extends Record<string, unknown>>(
  calculatorId: string,
  defaultPreferences: T
) {
  const storageKey = `calculator-${calculatorId}-preferences`

  const [preferences, setPreferences, clearPreferences] = useLocalStorage<T>(
    storageKey,
    defaultPreferences
  )

  /**
   * Update specific preferences
   */
  const updatePreferences = useCallback(
    (updates: Partial<T>) => {
      setPreferences((prev) => ({ ...prev, ...updates }))
    },
    [setPreferences]
  )

  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    clearPreferences()
  }, [clearPreferences])

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  }
}
