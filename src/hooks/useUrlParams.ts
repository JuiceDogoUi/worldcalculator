'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Hook for managing URL search parameters
 * Enables sharing calculator results via URL
 *
 * @example
 * ```tsx
 * const { params, setParam, setParams, clearParams } = useUrlParams()
 *
 * // Set a single parameter
 * setParam('amount', '1000')
 *
 * // Set multiple parameters at once
 * setParams({ amount: '1000', rate: '5' })
 *
 * // Get a parameter value
 * const amount = params.get('amount')
 *
 * // Clear all parameters
 * clearParams()
 * ```
 */
export function useUrlParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Set a single URL parameter
   */
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  /**
   * Set multiple URL parameters at once
   */
  const setParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value)
      })
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  /**
   * Remove a single URL parameter
   */
  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      const queryString = params.toString()
      router.push(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false }
      )
    },
    [searchParams, pathname, router]
  )

  /**
   * Clear all URL parameters
   */
  const clearParams = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  /**
   * Get the current URL with parameters (for sharing)
   */
  const getShareableUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    const queryString = searchParams.toString()
    return queryString
      ? `${window.location.origin}${pathname}?${queryString}`
      : `${window.location.origin}${pathname}`
  }, [pathname, searchParams])

  return {
    params: searchParams,
    setParam,
    setParams,
    removeParam,
    clearParams,
    getShareableUrl,
  }
}

/**
 * Validation constants for URL parameters
 */
const MAX_STRING_LENGTH = 500 // Prevent excessively long strings
const MAX_NUMBER_VALUE = Number.MAX_SAFE_INTEGER
const MIN_NUMBER_VALUE = Number.MIN_SAFE_INTEGER

/**
 * Validate and sanitize a numeric value from URL
 */
function parseNumericParam(value: string, defaultValue: number): number {
  const parsed = parseFloat(value)

  // Check for invalid numbers
  if (isNaN(parsed) || !isFinite(parsed)) {
    return defaultValue
  }

  // Check bounds
  if (parsed > MAX_NUMBER_VALUE || parsed < MIN_NUMBER_VALUE) {
    return defaultValue
  }

  return parsed
}

/**
 * Validate and sanitize a string value from URL
 */
function parseStringParam(value: string, defaultValue: string): string {
  // Limit string length
  if (value.length > MAX_STRING_LENGTH) {
    return defaultValue
  }

  // Basic XSS prevention: remove any HTML-like patterns
  const sanitized = value.replace(/<[^>]*>/g, '')

  return sanitized || defaultValue
}

/**
 * Parse a boolean value from URL
 */
function parseBooleanParam(value: string, defaultValue: boolean): boolean {
  const lower = value.toLowerCase()
  if (lower === 'true' || lower === '1') return true
  if (lower === 'false' || lower === '0') return false
  return defaultValue
}

/**
 * Hook for managing calculator input state in URL
 * Automatically syncs calculator inputs with URL parameters
 * Includes validation and sanitization to prevent malicious input
 *
 * @example
 * ```tsx
 * const [inputs, setInputs] = useCalculatorUrlState({
 *   amount: 1000,
 *   rate: 5
 * })
 *
 * // Update a single input
 * setInputs({ amount: 2000 })
 *
 * // All inputs are automatically reflected in the URL
 * ```
 */
export function useCalculatorUrlState<T extends Record<string, unknown>>(
  defaultValues: T
): [T, (updates: Partial<T>) => void, () => void] {
  const { params, setParams, clearParams } = useUrlParams()

  // Parse current values from URL or use defaults with validation
  const currentValues = Object.keys(defaultValues).reduce((acc, key) => {
    const urlValue = params.get(key)
    const defaultValue = defaultValues[key]

    if (urlValue !== null) {
      // Parse and validate based on type
      if (typeof defaultValue === 'number') {
        ;(acc as Record<string, unknown>)[key] = parseNumericParam(
          urlValue,
          defaultValue
        )
      } else if (typeof defaultValue === 'boolean') {
        ;(acc as Record<string, unknown>)[key] = parseBooleanParam(
          urlValue,
          defaultValue
        )
      } else if (typeof defaultValue === 'string') {
        ;(acc as Record<string, unknown>)[key] = parseStringParam(
          urlValue,
          defaultValue
        )
      } else {
        ;(acc as Record<string, unknown>)[key] = defaultValue
      }
    } else {
      ;(acc as Record<string, unknown>)[key] = defaultValue
    }
    return acc
  }, {} as T)

  // Update values in URL
  const updateValues = useCallback(
    (updates: Partial<T>) => {
      const newParams: Record<string, string> = {}
      Object.entries(updates).forEach(([key, value]) => {
        newParams[key] = String(value)
      })
      setParams(newParams)
    },
    [setParams]
  )

  // Reset to defaults
  const resetValues = useCallback(() => {
    clearParams()
  }, [clearParams])

  return [currentValues, updateValues, resetValues]
}
