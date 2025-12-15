/**
 * Unified ID generation utilities
 * Provides consistent, high-entropy ID generation across the application
 */

/**
 * Generate a unique ID with high entropy
 * Uses crypto.randomUUID() when available, falls back to secure random generation
 *
 * @returns A unique string identifier
 *
 * @example
 * ```ts
 * const id = generateId()
 * // => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' (UUID format)
 * // or '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p' (hex format as fallback)
 * ```
 */
export function generateId(): string {
  // Prefer crypto.randomUUID() for best entropy (available in modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback: Use crypto.getRandomValues for better entropy than Math.random()
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    // Convert to hex string
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  // Final fallback: Enhanced Math.random() with timestamp
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const morePart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}-${morePart}`
}

/**
 * Generate a timestamped ID for entries that need chronological sorting
 * Combines timestamp with random suffix for uniqueness
 *
 * @returns A timestamped unique string identifier
 *
 * @example
 * ```ts
 * const id = generateTimestampedId()
 * // => '1702665600000-a1b2c3d4e'
 * ```
 */
export function generateTimestampedId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}
