'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { generateTimestampedId } from '@/lib/id'

/**
 * Calculator history entry
 */
export interface HistoryEntry {
  id: string
  timestamp: number
  inputs: Record<string, unknown>
  results: Record<string, unknown>
  calculatorId: string
}

/**
 * Hook for managing calculator history
 * Tracks all calculations across sessions with localStorage
 *
 * @param calculatorId - Unique identifier for the calculator
 * @param maxHistory - Maximum number of history entries (default: 50)
 *
 * @example
 * ```tsx
 * const {
 *   history,
 *   addToHistory,
 *   removeFromHistory,
 *   clearHistory,
 *   getRecentCalculations,
 *   searchHistory
 * } = useCalculatorHistory('bmi-calculator', 100)
 *
 * // Add a calculation to history
 * addToHistory({
 *   inputs: { weight: 70, height: 175 },
 *   results: { bmi: 22.86 }
 * })
 *
 * // Get recent calculations
 * const recent = getRecentCalculations(5)
 *
 * // Search history
 * const results = searchHistory((entry) => entry.results.bmi > 25)
 * ```
 */
export function useCalculatorHistory(
  calculatorId: string,
  maxHistory: number = 50
) {
  const storageKey = `calculator-${calculatorId}-history`

  const [history, setHistory, clearStoredHistory] = useLocalStorage<
    HistoryEntry[]
  >(storageKey, [])

  const [isLoading, setIsLoading] = useState(true)

  // Initialize loading state
  useEffect(() => {
    setIsLoading(false)
  }, [])

  /**
   * Add a calculation to history
   */
  const addToHistory = useCallback(
    (data: { inputs: Record<string, unknown>; results: Record<string, unknown> }) => {
      const entry: HistoryEntry = {
        id: generateTimestampedId(),
        timestamp: Date.now(),
        inputs: data.inputs,
        results: data.results,
        calculatorId,
      }

      setHistory((prev) => {
        const updated = [entry, ...prev]
        // Limit to maxHistory
        return updated.slice(0, maxHistory)
      })

      return entry.id
    },
    [setHistory, maxHistory, calculatorId]
  )

  /**
   * Remove a specific entry from history
   */
  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((entry) => entry.id !== id))
    },
    [setHistory]
  )

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    clearStoredHistory()
  }, [clearStoredHistory])

  /**
   * Get recent calculations
   */
  const getRecentCalculations = useCallback(
    (count: number = 10) => {
      return history.slice(0, count)
    },
    [history]
  )

  /**
   * Search history with a filter function
   */
  const searchHistory = useCallback(
    (filter: (entry: HistoryEntry) => boolean) => {
      return history.filter(filter)
    },
    [history]
  )

  /**
   * Get a specific entry by ID
   */
  const getEntry = useCallback(
    (id: string) => {
      return history.find((entry) => entry.id === id)
    },
    [history]
  )

  /**
   * Get history statistics
   */
  const getStats = useCallback(() => {
    return {
      total: history.length,
      oldest: history[history.length - 1]?.timestamp,
      newest: history[0]?.timestamp,
    }
  }, [history])

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentCalculations,
    searchHistory,
    getEntry,
    getStats,
  }
}

/**
 * Hook for managing global calculator history across all calculators
 * Useful for showing recent activity across the entire app
 *
 * @param maxHistory - Maximum number of history entries (default: 100)
 *
 * @example
 * ```tsx
 * const { globalHistory, getRecentAcrossAll, clearAllHistory } =
 *   useGlobalCalculatorHistory(100)
 *
 * // Get 10 most recent calculations across all calculators
 * const recent = getRecentAcrossAll(10)
 * ```
 */
export function useGlobalCalculatorHistory(maxHistory: number = 100) {
  const storageKey = 'calculator-global-history'

  const [globalHistory, setGlobalHistory, clearStoredHistory] =
    useLocalStorage<HistoryEntry[]>(storageKey, [])

  /**
   * Add a calculation to global history
   */
  const addToGlobalHistory = useCallback(
    (data: {
      calculatorId: string
      inputs: Record<string, unknown>
      results: Record<string, unknown>
    }) => {
      const entry: HistoryEntry = {
        id: generateTimestampedId(),
        timestamp: Date.now(),
        inputs: data.inputs,
        results: data.results,
        calculatorId: data.calculatorId,
      }

      setGlobalHistory((prev) => {
        const updated = [entry, ...prev]
        return updated.slice(0, maxHistory)
      })

      return entry.id
    },
    [setGlobalHistory, maxHistory]
  )

  /**
   * Get recent calculations across all calculators
   */
  const getRecentAcrossAll = useCallback(
    (count: number = 10) => {
      return globalHistory.slice(0, count)
    },
    [globalHistory]
  )

  /**
   * Get history for a specific calculator
   */
  const getByCalculator = useCallback(
    (calculatorId: string) => {
      return globalHistory.filter((entry) => entry.calculatorId === calculatorId)
    },
    [globalHistory]
  )

  /**
   * Clear all global history
   */
  const clearAllHistory = useCallback(() => {
    clearStoredHistory()
  }, [clearStoredHistory])

  /**
   * Get statistics across all calculators
   */
  const getGlobalStats = useCallback(() => {
    const calculatorCounts: Record<string, number> = {}

    globalHistory.forEach((entry) => {
      calculatorCounts[entry.calculatorId] =
        (calculatorCounts[entry.calculatorId] || 0) + 1
    })

    return {
      total: globalHistory.length,
      byCalculator: calculatorCounts,
      oldest: globalHistory[globalHistory.length - 1]?.timestamp,
      newest: globalHistory[0]?.timestamp,
    }
  }, [globalHistory])

  return {
    globalHistory,
    addToGlobalHistory,
    getRecentAcrossAll,
    getByCalculator,
    clearAllHistory,
    getGlobalStats,
  }
}
