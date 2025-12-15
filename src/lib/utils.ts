import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * @param inputs - Class values to be merged (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```ts
 * cn('px-2 py-1', condition && 'bg-blue-500')
 * cn({ 'text-red-500': isError, 'text-green-500': !isError })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
