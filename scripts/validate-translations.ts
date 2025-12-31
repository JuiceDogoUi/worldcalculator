#!/usr/bin/env ts-node

/**
 * Translation Validation Script
 *
 * Validates that all locale translation files have the same structure
 * and keys as the default English locale.
 *
 * Checks:
 * - common.json (shared UI translations)
 * - pages.json (About, Contact, Privacy page translations)
 * - calculators/*.json (category-specific calculator translations)
 */

import * as fs from 'fs'
import * as path from 'path'

const locales = ['en', 'es', 'fr', 'de', 'pt', 'it'] as const
const messagesDir = path.join(__dirname, '../src/messages')

const CALCULATOR_CATEGORIES = [
  'math',
  'finance',
  'health',
  'conversion',
  'time-date',
  'construction',
] as const

interface TranslationStructure {
  [key: string]: string | TranslationStructure
}

/**
 * Recursively get all translation keys from an object
 */
function getKeys(obj: TranslationStructure, prefix = ''): string[] {
  return Object.keys(obj).reduce((keys: string[], key) => {
    // Skip internal metadata keys
    if (key.startsWith('_')) return keys

    const keyPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return keys.concat(getKeys(value as TranslationStructure, keyPath))
    }
    return keys.concat(keyPath)
  }, [])
}

/**
 * Load translation file for a locale
 */
function loadTranslations(locale: string, file: string): TranslationStructure | null {
  const filePath = path.join(messagesDir, locale, file)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Validate a single translation file across all locales
 */
function validateFile(file: string, isRequired: boolean = true): { hasErrors: boolean; hasWarnings: boolean } {
  console.log(`Checking ${file}:`)

  let hasErrors = false
  let hasWarnings = false

  // Load English (default) translations
  const enTranslations = loadTranslations('en', file)

  if (!enTranslations) {
    if (isRequired) {
      console.error(`  ❌ English file not found: ${file}`)
      return { hasErrors: true, hasWarnings: false }
    } else {
      console.log(`  ⏭️  File not found, skipping: ${file}`)
      return { hasErrors: false, hasWarnings: false }
    }
  }

  const enKeys = new Set(getKeys(enTranslations))
  console.log(`  ✓ English has ${enKeys.size} translation keys\n`)

  // Validate each locale against English
  for (const locale of locales) {
    if (locale === 'en') continue

    const translations = loadTranslations(locale, file)

    if (!translations) {
      if (isRequired) {
        console.error(`  ❌ ${locale}: File not found`)
        hasErrors = true
      } else {
        console.log(`  ⏭️  ${locale}: File not found (optional)`)
      }
      continue
    }

    const keys = new Set(getKeys(translations))

    // Check for missing keys
    const missing = [...enKeys].filter(k => !keys.has(k))

    // Check for extra keys (typos or outdated)
    const extra = [...keys].filter(k => !enKeys.has(k))

    if (missing.length > 0) {
      console.error(`  ❌ ${locale}: Missing ${missing.length} key(s):`)
      missing.forEach(k => console.error(`     - ${k}`))
      hasErrors = true
    }

    if (extra.length > 0) {
      console.warn(`  ⚠️  ${locale}: Extra ${extra.length} key(s) (not in English):`)
      extra.forEach(k => console.warn(`     - ${k}`))
      hasWarnings = true
    }

    if (missing.length === 0 && extra.length === 0) {
      console.log(`  ✓ ${locale}: ${keys.size} keys (complete)`)
    }
  }

  console.log('')
  return { hasErrors, hasWarnings }
}

/**
 * Main validation logic
 */
function validateTranslations(): boolean {
  console.log('🔍 Validating translations...\n')

  let hasErrors = false
  let hasWarnings = false

  // Validate common.json (required)
  const commonResult = validateFile('common.json', true)
  hasErrors = hasErrors || commonResult.hasErrors
  hasWarnings = hasWarnings || commonResult.hasWarnings

  // Validate pages.json (required)
  const pagesResult = validateFile('pages.json', true)
  hasErrors = hasErrors || pagesResult.hasErrors
  hasWarnings = hasWarnings || pagesResult.hasWarnings

  // Validate calculator category files
  console.log('📁 Calculator category translations:\n')

  for (const category of CALCULATOR_CATEGORIES) {
    const categoryResult = validateFile(`calculators/${category}.json`, false)
    hasErrors = hasErrors || categoryResult.hasErrors
    hasWarnings = hasWarnings || categoryResult.hasWarnings
  }

  if (hasWarnings && !hasErrors) {
    console.log('⚠️  Validation passed with warnings (extra keys found)\n')
  }

  return !hasErrors
}

// Run validation
try {
  const isValid = validateTranslations()

  if (isValid) {
    console.log('✅ All translations are valid!\n')
    process.exit(0)
  } else {
    console.error('❌ Translation validation failed!\n')
    console.error('Please fix the missing or mismatched translation keys above.')
    process.exit(1)
  }
} catch (error) {
  console.error('💥 Fatal error during validation:')
  console.error(error)
  process.exit(1)
}
