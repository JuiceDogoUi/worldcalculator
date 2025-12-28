# Calculator Development Guide

Step-by-step guide for adding calculators to World Calculator. Follow the **loan calculator** pattern in `src/features/finance/loan/` as your reference.

---

## Quick Start (5 Minutes)

Adding a simple calculator (e.g., percentage, BMI):
1. Create feature folder: `src/features/[category]/[name]/`
2. Add types, calculations, component
3. Create page: `src/app/[locale]/calculators/[category]/[name]/page.tsx`
4. Register in `src/config/calculators.ts`
5. Add translations (6 languages)
6. Build and test

For complex calculators with research/validation needs, use the specialized agents.

---

## File Structure

```
src/
├── features/[category]/[name]/           # Calculator logic
│   ├── types.ts                          # TypeScript interfaces
│   ├── calculations.ts                   # Pure calculation functions
│   ├── [Name]Calculator.tsx              # Main component
│   └── ConversationalSummary.tsx         # Optional: Results display
│
├── app/[locale]/calculators/[category]/[name]/
│   └── page.tsx                          # Page with metadata
│
├── messages/[locale]/calculators/[category]/
│   └── [name].json                       # Translations (x6 languages)
│
└── config/
    └── calculators.ts                    # Registry entry
```

---

## Step-by-Step: Adding a New Calculator

### Step 1: Plan & Research (15 min - 4 hours)

**Time allocation**:
- Simple calculator (percentage, BMI): 15-30 minutes
- Medium complexity (loan, investment): 1-2 hours
- Complex calculator (tax, retirement, medical): 2-4 hours

**MANDATORY: Research competitors first** (use `calculator-market-researcher` agent):

1. **Find top 5 implementations**:
   - Search "[calculator type] calculator" on Google
   - Analyze: calculator.net, omnicalculator.com, calculatorsoup.com
   - Document URL, key features, unique approaches

2. **Input/Output Analysis**:
   - What inputs do they require? (required vs optional)
   - How do they validate? (real-time vs on submit)
   - What outputs do they show? (charts, tables, breakdowns)
   - What additional features? (sharing, printing, comparisons)

3. **Formula Validation** (CRITICAL):
   - Cross-check formulas across 3+ competitor implementations
   - Find authoritative source (SEC, IRS, IEEE, WHO, government agencies)
   - Document formula with citations
   - Test with known correct examples from authoritative sources

4. **UX Patterns**:
   - How do they handle edge cases?
   - What error messages do they show?
   - Mobile experience quality?
   - Any innovative features to adopt?

**Research output checklist**:
- [ ] Competitor feature comparison matrix
- [ ] Validated formula with authoritative citations
- [ ] Edge cases documented (tested on competitors)
- [ ] SEO keyword list with search volumes
- [ ] UX patterns to adopt or avoid

**Use specialized agents**:
```bash
# Research competitors and validate formula (recommended for ALL calculators)
calculator-market-researcher

# Design architecture
calculator-architect
```

---

### Step 2: Create Feature Folder (2 min)

```bash
mkdir -p src/features/[category]/[name]
```

Example: `src/features/math/percentage/`

---

### Step 3: Define Types (5 min)

**File**: `src/features/[category]/[name]/types.ts`

**Template**:
```typescript
// Inputs
export interface [Name]Inputs {
  field1: number;
  field2: number;
  optionalField?: string;
}

// Results
export interface [Name]Result {
  primaryResult: number;
  secondaryResult?: number;
  breakdown?: {
    label: string;
    value: number;
  }[];
}

// Validation errors (optional but recommended)
export interface [Name]Validation {
  field1?: string;
  field2?: string;
}
```

**Example** (Percentage Calculator):
```typescript
export interface PercentageInputs {
  base: number;
  percentage: number;
}

export interface PercentageResult {
  result: number;
  calculation: string;
}
```

---

### Step 4: Implement Calculations (10-20 min)

**File**: `src/features/[category]/[name]/calculations.ts`

**Template**:
```typescript
import { [Name]Inputs, [Name]Result } from './types';

// Helper for rounding (financial calculations)
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculate[Name](inputs: [Name]Inputs): [Name]Result {
  const { field1, field2 } = inputs;

  // Edge case handling
  if (field1 === 0) {
    return { primaryResult: 0 };
  }

  // Main calculation
  const result = (field1 * field2) / 100;

  return {
    primaryResult: roundToCents(result),
  };
}
```

**Key principles**:
- ✅ Pure functions (no side effects)
- ✅ Handle edge cases (zero, negative, very large numbers)
- ✅ Use `roundToCents()` for financial calculations
- ✅ Return all needed outputs

**Common edge cases**:
- Division by zero
- Zero interest rates (financial)
- Negative values (when invalid)
- Very large numbers (overflow)
- Final balance in amortization (adjust to exactly $0.00)

---

### Step 5: Create Validation (10 min)

**Use**: `calculator-validation-expert` agent OR create manually

**File**: `src/features/[category]/[name]/types.ts` (add to existing file)

**Recommended Pattern** (matches loan calculator):
```typescript
// Update validation interface
export interface [Name]Validation {
  valid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

// Validation function with field-level errors
export function validate[Name](inputs: Partial<[Name]Inputs>): [Name]Validation {
  const errors: [Name]Validation['errors'] = [];

  // Validate each field
  if (!inputs.field1 || inputs.field1 <= 0) {
    errors.push({ field: 'field1', message: 'Must be greater than zero' });
  }

  if (!inputs.field2 || inputs.field2 < 0) {
    errors.push({ field: 'field2', message: 'Cannot be negative' });
  }

  // Add more validations as needed
  if (inputs.field1 && inputs.field1 > 1000000) {
    errors.push({ field: 'field1', message: 'Value too large' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

**Alternative: Using Zod** (optional, not used in reference implementation):
```typescript
import { z } from 'zod';

export const [Name]Schema = z.object({
  field1: z.number()
    .positive('Must be a positive number')
    .min(0.01, 'Must be at least 0.01'),
  field2: z.number()
    .nonnegative('Cannot be negative'),
});

export function validate[Name]WithZod(
  inputs: Partial<[Name]Inputs>
): [Name]Validation {
  try {
    [Name]Schema.parse(inputs);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: String(err.path[0]),
        message: err.message,
      }));
      return { valid: false, errors };
    }
    return { valid: false, errors: [] };
  }
}
```

**Validation Best Practices**:
- Validate on blur (not on every keystroke)
- Clear errors immediately when user corrects input
- Show field-level errors near the input
- Only validate required empty fields on form submit

---

### Step 6: Build React Component (20-30 min)

**File**: `src/features/[category]/[name]/[Name]Calculator.tsx`

**Study**: `src/features/finance/loan/LoanCalculator.tsx` as reference

**Key patterns** (updated for Next.js 15 static export):
```typescript
'use client';

import { useState, useMemo, useCallback } from 'react';
import { calculate[Name] } from './calculations';
import { [Name]Inputs, [Name]Result, validate[Name] } from './types';

interface [Name]CalculatorProps {
  locale: string;
  currency: string;
  translations: {
    field1: string;
    field2: string;
    resultsTitle: string;
    // ... all needed translations
  };
}

export function [Name]Calculator({
  locale,
  currency,
  translations: t
}: [Name]CalculatorProps) {
  // State
  const [inputs, setInputs] = useState<[Name]Inputs>({
    field1: 0,
    field2: 0,
  });

  const [validation, setValidation] = useState(validate[Name]({}));

  // Memoized calculation
  const result = useMemo(() => {
    if (!validation.valid) return null;
    return calculate[Name](inputs);
  }, [inputs, validation.valid]);

  // Memoized event handlers
  const handleFieldChange = useCallback((field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));

    // Re-validate on change
    const newInputs = { ...inputs, [field]: value };
    setValidation(validate[Name](newInputs));
  }, [inputs]);

  const handleReset = useCallback(() => {
    setInputs({ field1: 0, field2: 0 });
    setValidation(validate[Name]({}));
  }, []);

  // Helper to get field-specific errors
  const getFieldError = useCallback((field: string) => {
    return validation.errors.find(e => e.field === field)?.message;
  }, [validation.errors]);

  return (
    <div className="space-y-6">
      {/* Input form */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="field1">{t.field1}</Label>
          <Input
            id="field1"
            type="number"
            inputMode="decimal"
            value={inputs.field1}
            onChange={(e) => handleFieldChange('field1', Number(e.target.value))}
            aria-invalid={!!getFieldError('field1')}
            className="min-h-[44px]"
          />
          {getFieldError('field1') && (
            <span role="alert" className="text-sm text-destructive">
              {getFieldError('field1')}
            </span>
          )}
        </div>
        {/* More inputs... */}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold">{t.resultsTitle}</h3>
          <div className="text-4xl font-bold text-primary">
            {result.primaryResult}
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `Result: ${result.primaryResult}`}
      </div>
    </div>
  );
}
```

**Component checklist**:
- [ ] `'use client'` directive
- [ ] Translations received as props (not useTranslations hook)
- [ ] useState for inputs and validation
- [ ] useMemo for calculations (performance)
- [ ] useCallback for event handlers
- [ ] Validation feedback (inline errors with role="alert")
- [ ] Accessible (ARIA labels, live regions, 44px touch targets)
- [ ] Helper function to get field errors

#### **Step 6.1: MANDATORY 2-Column Grid Layout (CRITICAL)**

**All financial calculators MUST use the same 2-column grid layout as the loan calculator.**

**Layout Structure** (src/features/finance/loan/LoanCalculator.tsx lines 316-850):

```typescript
return (
  <div className="space-y-6">
    {/* Screen reader live regions */}
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {result && `${getPaymentLabel()}: ${formatCurrency(result.periodicPayment, locale, currency)}`}
    </div>

    {/* 2-COLUMN GRID - MANDATORY */}
    <div className="grid gap-6 md:grid-cols-2">

      {/* LEFT COLUMN - ALL INPUTS */}
      <div className="space-y-6">
        {/* Input Field 1 with Label, Input, Slider */}
        <div className="space-y-3">
          <Label htmlFor="field1" className="flex items-center gap-2 text-base">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {t.field1}
          </Label>
          <Input className="text-lg h-12" />
          <Slider />
        </div>

        {/* More inputs... */}
        {/* Advanced Options (collapsible) */}
      </div>

      {/* RIGHT COLUMN - ALL RESULTS */}
      <div className="space-y-6">
        {/* 1. HERO RESULT CARD - Large, gradient, prominent */}
        <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <CardContent className="p-6">
            <div className="text-sm font-medium opacity-90 mb-2">
              {getPaymentLabel()}
            </div>
            <div className="text-5xl md:text-6xl font-bold tracking-tight">
              {result ? formatCurrency(result.periodicPayment, locale, currency) : '--'}
            </div>
            <div className="mt-3 text-sm opacity-80">
              {totalMonths} months • {payoffDate}
            </div>
          </CardContent>
        </Card>

        {/* 2. Conversational Summary (optional) */}
        {result && t.summary && (
          <Card>
            <CardContent className="p-6">
              <ConversationalSummary result={result} translations={t.summary} />
            </CardContent>
          </Card>
        )}

        {/* 3. Payment Breakdown */}
        {result && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                {t.breakdown}
              </div>

              {/* Visual bar (horizontal) */}
              <div className="h-5 rounded-full overflow-hidden flex bg-muted">
                <div className="bg-primary" style={{ width: `${principalPct}%` }} />
                <div className="bg-chart-interest" style={{ width: `${interestPct}%` }} />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Principal: {formatCurrency(principal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-interest" />
                  <span>Interest: {formatCurrency(interest)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    {/* BELOW GRID - FULL WIDTH */}
    {/* Amortization Schedule, Charts, etc. */}
    {showSchedule && (
      <Card>
        <CardContent>
          {/* Table or chart */}
        </CardContent>
      </Card>
    )}
  </div>
)
```

**Key Layout Rules:**

1. **Grid Container**: `<div className="grid gap-6 md:grid-cols-2">`
   - 2 columns on medium screens and up (md breakpoint)
   - Single column on mobile (stacks vertically)
   - 6-unit gap between columns

2. **Left Column**: `<div className="space-y-6">`
   - Contains ALL inputs
   - Inputs use larger sizes: `h-12` for inputs, `text-lg` for text
   - Sliders for numeric inputs
   - Advanced options in collapsible section at bottom
   - Icons with each label for visual hierarchy

3. **Right Column**: `<div className="space-y-6">`
   - **MUST START** with Hero Result Card
   - Hero card: Gradient background, 5xl-6xl font size, prominent
   - Optional: Conversational Summary component (natural language)
   - Payment/cost breakdown with visual bar chart
   - Result cards stack vertically with 6-unit spacing

4. **Below Grid (Full Width)**:
   - Amortization schedules
   - Comparison tables
   - Charts and visualizations
   - Any content that needs full width

**Hero Result Card Pattern:**
```typescript
<Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
  <CardContent className="p-6">
    <div className="text-sm font-medium opacity-90 mb-2">
      {resultLabel}
    </div>
    <div className="text-5xl md:text-6xl font-bold tracking-tight">
      {formattedValue}
    </div>
    {metadata && (
      <div className="mt-3 text-sm opacity-80">
        {metadata}
      </div>
    )}
  </CardContent>
</Card>
```

**Common Mistakes to Avoid:**
- ❌ Single column layout (stacked)
- ❌ Inputs and results mixed together
- ❌ Results above inputs
- ❌ Small result cards instead of prominent hero
- ❌ Missing gradient on hero card
- ❌ Forgetting mobile responsive (grid collapses to single column)

**Layout Checklist**:
- [ ] 2-column grid (`md:grid-cols-2`) as container
- [ ] Left column contains ALL inputs with icons
- [ ] Right column starts with Hero Result Card (gradient, large text)
- [ ] Inputs use `h-12`, `text-lg` sizing
- [ ] Sliders for numeric inputs where appropriate
- [ ] Advanced options collapsible at bottom of left column
- [ ] Visual breakdown with horizontal bar chart in results
- [ ] Full-width sections (tables, charts) below the grid
- [ ] Mobile responsive (single column stack)

---

### Step 7: Create Page Component (10 min)

**File**: `src/app/[locale]/calculators/[category]/[name]/page.tsx`

**Template**:
```typescript
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { [Name]Calculator } from '@/features/[category]/[name]/[Name]Calculator';
import { locales, localeConfigs } from '@/i18n/locales';

// CRITICAL for Next.js 15 static export
export const dynamic = 'force-static';
export const dynamicParams = false;

// Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params; // ← MUST await params in Next.js 15!
  const t = await getTranslations({ locale, namespace: 'calculators.[category].[name]' });

  return {
    title: t('seo.metaTitle'),
    description: t('seo.metaDescription'),
    keywords: t('seo.keywords'),
    alternates: {
      canonical: `/${locale}/calculators/[category]/[name]`,
      languages: {
        en: '/en/calculators/[category]/[name]',
        es: '/es/calculators/[category]/[name]',
        fr: '/fr/calculators/[category]/[name]',
        de: '/de/calculators/[category]/[name]',
        pt: '/pt/calculators/[category]/[name]',
        it: '/it/calculators/[category]/[name]',
      },
    },
    openGraph: {
      title: t('seo.metaTitle'),
      description: t('seo.metaDescription'),
      type: 'website',
      url: `/${locale}/calculators/[category]/[name]`,
    },
  };
}

// Static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function [Name]Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // ← MUST await params in Next.js 15!
  const config = localeConfigs[locale as keyof typeof localeConfigs];

  return (
    <div className="container mx-auto py-8">
      <[Name]Calculator locale={locale} currency={config.currency} />
    </div>
  );
}
```

**⚠️ Next.js 15 Breaking Change**: Params are now async and must be awaited. See Common Pitfalls #8 below.

---

### Step 8: Register Calculator (2 min)

**File**: `src/config/calculators.ts`

**Add entry**:
```typescript
import { Calculator } from '@/types/calculator';
import { Calculator as CalculatorIcon } from 'lucide-react'; // Choose appropriate icon

export const calculators: Calculator[] = [
  // ... existing calculators
  {
    id: '[name]',
    name: '[Name] Calculator',
    category: '[category-id]',
    path: '/calculators/[category]/[name]',
    icon: CalculatorIcon,
    featured: false, // Set to true for homepage
  },
];
```

---

### Step 9: Add Translations (30-60 min)

**Use**: `i18n-translation-specialist` agent OR create manually

**Create files** (6 languages):
```
src/messages/en/calculators/[category]/[name].json
src/messages/es/calculators/[category]/[name].json
src/messages/fr/calculators/[category]/[name].json
src/messages/de/calculators/[category]/[name].json
src/messages/pt/calculators/[category]/[name].json
src/messages/it/calculators/[category]/[name].json
```

**Template** (English reference):
```json
{
  "[name]": {
    "title": "[Name] Calculator",
    "description": "Brief description of what this calculator does",

    "inputs": {
      "field1": {
        "label": "Field 1",
        "placeholder": "Enter value"
      },
      "field2": {
        "label": "Field 2",
        "placeholder": "Enter value"
      }
    },

    "results": {
      "title": "Results",
      "primaryResult": "Primary Result"
    },

    "seo": {
      "metaTitle": "Free [Name] Calculator | Calculate [Thing]",
      "metaDescription": "Calculate [thing] easily with our free online calculator. Accurate results in seconds.",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    },

    "faqs": [
      {
        "question": "What is [concept]?",
        "answer": "Detailed answer explaining the concept..."
      }
      // 8-10 FAQs total
    ],

    "howTo": {
      "title": "How to Use the [Name] Calculator",
      "steps": [
        {
          "title": "Step 1: Enter [input]",
          "text": "Detailed instruction..."
        }
        // 5 steps total
      ]
    }
  }
}
```

**Validation**:
```bash
npm run validate:translations
```

Fix any structural errors before continuing.

---

### Step 10: Add SEO & Content (Recommended)

**Use agents** for comprehensive SEO:
```bash
# Create structured data schemas and metadata
seo-structured-data-specialist

# Write FAQs and HowTo guides (6 languages)
content-localization-writer
```

**Full pattern** (matching loan calculator):
```typescript
import { getTranslations } from 'next-intl/server';
import { [Name]Calculator } from '@/features/[category]/[name]/[Name]Calculator';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { localeConfigs } from '@/i18n/locales';

export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function [Name]Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const config = localeConfigs[locale as keyof typeof localeConfigs];
  const t = await getTranslations({ locale, namespace: 'calculators.[category].[name]' });

  // Prepare translations for client component
  const calculatorTranslations = {
    field1: t('inputs.field1.label'),
    field2: t('inputs.field2.label'),
    resultsTitle: t('results.title'),
    // ... all needed translations
  };

  // Prepare FAQs
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  // Prepare HowTo steps
  const howToSteps = Array.from({ length: 5 }, (_, i) => ({
    title: t(`howTo.steps.${i}.title`),
    text: t(`howTo.steps.${i}.text`),
  }));

  // Generate structured data schemas
  const calculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t('title'),
    description: t('description'),
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: config.currency,
    },
    operatingSystem: 'Web',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howTo.title'),
    step: howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `/${locale}/calculators` },
      { '@type': 'ListItem', position: 3, name: t('title'), item: `/${locale}/calculators/[category]/[name]` },
    ],
  };

  const structuredData = [calculatorSchema, faqSchema, howToSchema, breadcrumbSchema];

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Calculator with layout */}
      <CalculatorLayout
        title={t('title')}
        description={t('description')}
        faqs={faqs}
        howTo={{ title: t('howTo.title'), steps: howToSteps }}
      >
        <[Name]Calculator
          locale={locale}
          currency={config.currency}
          translations={calculatorTranslations}
        />
      </CalculatorLayout>
    </>
  );
}
```

**Key SEO elements**:
- ✅ Multiple JSON-LD schemas (SoftwareApplication, FAQ, HowTo, Breadcrumb)
- ✅ Translations prepared server-side
- ✅ CalculatorLayout wrapper (handles FAQ and HowTo sections)
- ✅ Structured data optimized for Google rich snippets
- ✅ All content ready for AI/LLM indexing

---

### Step 11: Complete Page Template (MANDATORY - 30-60 min)

**⚠️ CRITICAL**: All calculators MUST follow the complete loan calculator page template. A basic calculator component is not enough - you need the full page structure with SEO content.

#### Required Page Structure

Every calculator page must include these sections in order:

```
1. JSON-LD Structured Data (4 schemas)
2. CalculatorLayout wrapper
   ├── Breadcrumbs
   ├── Title + Description
   ├── Calculator Component (in Card)
   ├── CalculatorDisclaimer
   ├── CalculatorWidget (sources, likes, share)
   ├── SEO Content Component (9 sections) ← MANDATORY
   └── Related Calculators (optional)
```

**Reference**: Study `src/app/[locale]/calculators/finance/loan/page.tsx` and `src/features/finance/loan/LoanSEOContent.tsx`

#### 11.1: Create SEO Content Component

**File**: `src/features/[category]/[name]/[Name]SEOContent.tsx`

This component renders 9 standardized SEO sections that provide comprehensive content for users and search engines.

**Component Template**:
```typescript
interface [Name]SEOContentTranslations {
  // Section 1: What is this calculator?
  whatIsTitle: string
  whatIsContent: string

  // Section 2: When to use
  whenToUseTitle: string
  whenToUseIntro: string
  whenToUsePoint1: string
  whenToUsePoint2: string
  whenToUsePoint3: string
  whenToUsePoint4: string
  whenToUsePoint5: string

  // Section 3: Types/Categories
  typesTitle: string
  type1: string
  type2: string
  type3: string
  type4: string
  type5: string

  // Section 4: Benefits
  benefitsTitle: string
  benefit1: string
  benefit2: string
  benefit3: string
  benefit4: string
  benefit5: string

  // Section 5: How to use
  howToUseTitle: string
  howToUseStep1: string
  howToUseStep2: string
  howToUseStep3: string
  howToUseStep4: string
  howToUseStep5: string

  // Section 6: Understanding results
  resultsTitle: string
  resultsPayment: string
  resultsTotalPayment: string
  resultsTotalInterest: string
  resultsAmortization: string

  // Section 7: Formula
  formulaTitle: string
  formulaContent: string
  formulaExample: string

  // Section 8: Tips
  tipsTitle: string
  tip1: string
  tip2: string
  tip3: string
  tip4: string
  tip5: string
  tip6: string
  tip7: string
  tip8: string

  // Section 9: FAQs
  faqTitle: string
  faq1Question: string
  faq1Answer: string
  faq2Question: string
  faq2Answer: string
  // ... faq3-9
}

interface [Name]SEOContentProps {
  translations: [Name]SEOContentTranslations
}

export function [Name]SEOContent({ translations: t }: [Name]SEOContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
      {/* Section 1: What is this? */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground">{t.whatIsContent}</p>
      </section>

      {/* Section 2: When to use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whenToUseTitle}</h2>
        <p className="mb-4">{t.whenToUseIntro}</p>
        <ul className="list-disc list-inside space-y-2">
          <li>{t.whenToUsePoint1}</li>
          <li>{t.whenToUsePoint2}</li>
          <li>{t.whenToUsePoint3}</li>
          <li>{t.whenToUsePoint4}</li>
          <li>{t.whenToUsePoint5}</li>
        </ul>
      </section>

      {/* Section 3: Types */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.typesTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p>{t.type1}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.type2}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.type3}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.type4}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.type5}</p>
          </div>
        </div>
      </section>

      {/* Section 4: Benefits */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.benefitsTitle}</h2>
        <div className="space-y-4">
          {[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: How to use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToUseTitle}</h2>
        <ol className="list-decimal list-inside space-y-3">
          <li>{t.howToUseStep1}</li>
          <li>{t.howToUseStep2}</li>
          <li>{t.howToUseStep3}</li>
          <li>{t.howToUseStep4}</li>
          <li>{t.howToUseStep5}</li>
        </ol>
      </section>

      {/* Section 6: Understanding results */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.resultsTitle}</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <p>{t.resultsPayment}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.resultsTotalPayment}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.resultsTotalInterest}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p>{t.resultsAmortization}</p>
          </div>
        </div>
      </section>

      {/* Section 7: Formula */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulaTitle}</h2>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <code className="text-sm">{t.formulaContent}</code>
        </div>
        <p className="text-sm text-muted-foreground">{t.formulaExample}</p>
      </section>

      {/* Section 8: Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>{t.tip1}</li>
          <li>{t.tip2}</li>
          <li>{t.tip3}</li>
          <li>{t.tip4}</li>
          <li>{t.tip5}</li>
          <li>{t.tip6}</li>
          <li>{t.tip7}</li>
          <li>{t.tip8}</li>
        </ul>
      </section>

      {/* Section 9: FAQs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="border-b pb-4 last:border-0">
              <h3 className="font-semibold mb-2 text-lg">
                {t[`faq${num}Question` as keyof typeof t]}
              </h3>
              <p className="text-muted-foreground">
                {t[`faq${num}Answer` as keyof typeof t]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

#### 11.2: Update Translations with SEO Keys

Add ~150 keys to your translation files under the `seo` namespace:

```json
{
  "seo": {
    "whatIsTitle": "What is a [Name] Calculator?",
    "whatIsContent": "Detailed 200-300 word explanation...",

    "whenToUseTitle": "When Should You Use This Calculator?",
    "whenToUseIntro": "Introduction paragraph...",
    "whenToUsePoint1": "Specific use case 1...",
    "whenToUsePoint2": "Specific use case 2...",
    "whenToUsePoint3": "Specific use case 3...",
    "whenToUsePoint4": "Specific use case 4...",
    "whenToUsePoint5": "Specific use case 5...",

    "typesTitle": "[Category] Types",
    "type1": "Type 1 description (1-2 sentences)...",
    "type2": "Type 2 description...",
    "type3": "Type 3 description...",
    "type4": "Type 4 description...",
    "type5": "Type 5 description...",

    "benefitsTitle": "Why Use a [Name] Calculator?",
    "benefit1": "Benefit 1 explanation...",
    "benefit2": "Benefit 2 explanation...",
    "benefit3": "Benefit 3 explanation...",
    "benefit4": "Benefit 4 explanation...",
    "benefit5": "Benefit 5 explanation...",

    "howToUseTitle": "How to Use This Calculator",
    "howToUseStep1": "Step 1 instructions...",
    "howToUseStep2": "Step 2 instructions...",
    "howToUseStep3": "Step 3 instructions...",
    "howToUseStep4": "Step 4 instructions...",
    "howToUseStep5": "Step 5 instructions...",

    "resultsTitle": "Understanding Your Results",
    "resultsPayment": "Payment explanation...",
    "resultsTotalPayment": "Total payment explanation...",
    "resultsTotalInterest": "Interest explanation...",
    "resultsAmortization": "Amortization explanation...",

    "formulaTitle": "The Formula",
    "formulaContent": "M = P × [r(1+r)^n] / [(1+r)^n-1]",
    "formulaExample": "Where M = monthly payment, P = principal...",

    "tipsTitle": "Tips for Best Results",
    "tip1": "Tip 1...",
    "tip2": "Tip 2...",
    "tip3": "Tip 3...",
    "tip4": "Tip 4...",
    "tip5": "Tip 5...",
    "tip6": "Tip6...",
    "tip7": "Tip 7...",
    "tip8": "Tip 8...",

    "faqTitle": "Frequently Asked Questions",
    "faq1Question": "Question 1?",
    "faq1Answer": "Answer 1...",
    "faq2Question": "Question 2?",
    "faq2Answer": "Answer 2...",
    // ... faq3-9
  }
}
```

**Use the `content-localization-writer` agent** to create this SEO content in all 6 languages.

#### 11.3: Update Page Component with Complete Structure

**File**: `src/app/[locale]/calculators/[category]/[name]/page.tsx`

**Complete Template**:
```typescript
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { [Name]Calculator } from '@/features/[category]/[name]/[Name]Calculator'
import { [Name]SEOContent } from '@/features/[category]/[name]/[Name]SEOContent'
import { locales } from '@/i18n/locales'
import { getCurrencyForLocale } from '@/lib/formatters'
import { getCalculatorBySlug } from '@/config/calculators'
import {
  generateCalculatorSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
} from '@/lib/structuredData'

export const dynamic = 'force-static'
export const dynamicParams = false

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.[category].[name]' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/[category]/[name]`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/[category]/[name]`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/[category]/[name]`,
    },
  }
}

export default async function [Name]CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.[category].[name]' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/[category]/[name]`
  const currency = getCurrencyForLocale(locale)

  // Get calculator config for last updated date
  const calculatorConfig = getCalculatorBySlug('[name]')
  const lastUpdated = calculatorConfig?.lastModified
    ? new Date(calculatorConfig.lastModified).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  // Prepare calculator translations (90+ keys)
  const calculatorTranslations = {
    field1: t('inputs.field1'),
    field2: t('inputs.field2'),
    resultsTitle: t('outputs.title'),
    // ... all calculator UI translations
  }

  // Prepare disclaimer translations
  const disclaimerTranslations = {
    text: t('disclaimer.text'),
    note: t('disclaimer.note'),
  }

  // Prepare SEO content translations (150+ keys)
  const seoTranslations = {
    whatIsTitle: t('seo.whatIsTitle'),
    whatIsContent: t('seo.whatIsContent'),
    whenToUseTitle: t('seo.whenToUseTitle'),
    whenToUseIntro: t('seo.whenToUseIntro'),
    whenToUsePoints: [
      t('seo.whenToUsePoint1'),
      t('seo.whenToUsePoint2'),
      t('seo.whenToUsePoint3'),
      t('seo.whenToUsePoint4'),
      t('seo.whenToUsePoint5'),
    ],
    // ... all SEO translations
  }

  // Generate structured data schemas
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/[category]/[name]`,
      applicationCategory: 'FinanceApplication',
      offers: { price: '0', priceCurrency: currency },
    },
    { siteName: 'World Calculator', siteUrl, locale }
  )

  const faqSchema = generateFAQSchema(
    Array.from({ length: 9 }, (_, i) => ({
      question: t(`seo.faq${i + 1}Question`),
      answer: t(`seo.faq${i + 1}Answer`),
    }))
  )

  const howToSchema = generateHowToSchema(
    t('seo.howToUseTitle'),
    Array.from({ length: 5 }, (_, i) => ({
      name: `Step ${i + 1}`,
      text: t(`seo.howToUseStep${i + 1}`),
    }))
  )

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `${siteUrl}/${locale}` },
      { name: tCategories('[category].name'), url: `${siteUrl}/${locale}/calculators/[category]` },
      { name: t('title'), url: calculatorUrl },
    ],
    siteUrl
  )

  // Sources for CalculatorWidget
  const sources = [
    { title: 'Source 1', url: 'https://...' },
    { title: 'Source 2', url: 'https://...' },
    { title: 'Source 3', url: 'https://...' },
  ]

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([calculatorSchema, faqSchema, howToSchema, breadcrumbSchema]),
        }}
      />

      {/* Calculator Layout */}
      <CalculatorLayout
        title={t('title')}
        description={t('description')}
        categorySlug="[category]"
        categoryName={tCategories('[category].name')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={0}
            initialHelpful={0}
          />
        }
        seoContent={<[Name]SEOContent translations={seoTranslations} />}
      >
        {/* Calculator Component */}
        <[Name]Calculator
          locale={locale}
          currency={currency}
          translations={calculatorTranslations}
        />

        {/* Disclaimer */}
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
```

**Key components of complete structure**:
1. ✅ Four JSON-LD schemas (Calculator, FAQ, HowTo, Breadcrumb)
2. ✅ CalculatorLayout wrapper with all props
3. ✅ Calculator component with translations
4. ✅ CalculatorDisclaimer below calculator
5. ✅ CalculatorWidget with sources
6. ✅ SEO Content component (9 sections) ← **MANDATORY**
7. ✅ Last updated date from registry
8. ✅ All translations prepared server-side

**Without the SEO Content component, your calculator is incomplete!**

---

### Step 12: Build & Test (5 min)

```bash
# Build with translation validation
npm run build

# Check output
ls -la out/en/calculators/[category]/[name]/

# Test in development
npm run dev
# Visit: http://localhost:3000/en/calculators/[category]/[name]
```

**Test checklist**:
- [ ] Calculator renders correctly
- [ ] Inputs accept values
- [ ] Calculation produces correct results
- [ ] Validation shows errors appropriately
- [ ] All 6 languages work
- [ ] SEO metadata present (view source)
- [ ] Build succeeds without errors

---

## Copy-Paste Templates

### Minimal Calculator (Percentage Example)

**types.ts**:
```typescript
export interface PercentageInputs {
  base: number;
  percentage: number;
}

export interface PercentageResult {
  result: number;
}
```

**calculations.ts**:
```typescript
import { PercentageInputs, PercentageResult } from './types';

export function calculatePercentage(inputs: PercentageInputs): PercentageResult {
  const { base, percentage } = inputs;
  const result = (base * percentage) / 100;
  return { result: Math.round(result * 100) / 100 };
}
```

**PercentageCalculator.tsx** (minimal):
```typescript
'use client';

import { useState, useMemo } from 'react';
import { calculatePercentage } from './calculations';
import { PercentageInputs } from './types';

export function PercentageCalculator() {
  const [inputs, setInputs] = useState<PercentageInputs>({ base: 100, percentage: 10 });
  const result = useMemo(() => calculatePercentage(inputs), [inputs]);

  return (
    <div>
      <input
        type="number"
        value={inputs.base}
        onChange={(e) => setInputs({ ...inputs, base: Number(e.target.value) })}
      />
      <input
        type="number"
        value={inputs.percentage}
        onChange={(e) => setInputs({ ...inputs, percentage: Number(e.target.value) })}
      />
      <p>Result: {result.result}</p>
    </div>
  );
}
```

---

## Common Pitfalls

### 1. Floating-Point Precision
❌ `0.1 + 0.2 === 0.3` → `false` (0.30000000000000004)
✅ Use `roundToCents()` or `roundToDecimalPlaces()`

### 2. Missing Edge Cases
❌ Division by zero causes `Infinity`
✅ Check for zero before dividing

### 3. Translation Structure Mismatch
❌ Spanish missing `faqs.3.question`
✅ Run `npm run validate:translations` before build

### 4. Forgot to Register Calculator
❌ Calculator works in dev but missing from nav/homepage
✅ Add to `src/config/calculators.ts`

### 5. Not Using generateStaticParams
❌ Pages not pre-rendered for all locales
✅ Always include `generateStaticParams()` in page.tsx

### 6. Client/Server Component Confusion
❌ `useTranslations` in Server Component
✅ `useTranslations` in Client, `getTranslations` in Server

### 7. Final Payment Not Balancing
❌ Amortization ends at $0.03 instead of $0.00
✅ Adjust final payment to consume remaining balance exactly

### 8. Async Params in Next.js 15 (CRITICAL)
❌ `const { locale } = params` → Breaks in Next.js 15!
✅ `const { locale } = await params` → Correct pattern

**Why**: Next.js 15 made params async to improve performance. You MUST await params in both `generateMetadata` and page components, otherwise you'll get runtime errors during build.

```typescript
// ❌ WRONG (will break):
export async function generateMetadata({ params: { locale } }: PageProps) { ... }

// ✅ CORRECT:
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  ...
}
```

### 9. Not Using useCallback for Functions
❌ Recreating functions on every render
✅ Use `useCallback` for event handlers and helper functions

**Impact**: Performance degradation, unnecessary re-renders of child components

---

## Performance Optimization

### Memoization
Always memoize calculations:
```typescript
const result = useMemo(() => calculate[Name](inputs), [inputs]);
```

### useCallback for Functions (IMPORTANT)
Memoize event handlers and helper functions to prevent unnecessary re-renders:
```typescript
import { useCallback } from 'react';

// Event handlers
const handleReset = useCallback(() => {
  setInputs(defaultInputs);
}, []);

const handleFieldChange = useCallback((field: string, value: number) => {
  setInputs(prev => ({ ...prev, [field]: value }));
}, []);

// Helper functions
const getFieldError = useCallback((field: string): string | undefined => {
  return validation.errors.find(e => e.field === field)?.message;
}, [validation.errors]);
```

**Why**: Without `useCallback`, these functions are recreated on every render, causing child components to re-render unnecessarily even if their props haven't changed.

### Debouncing (Optional - for intensive calculations)
```typescript
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const debouncedInputs = useDebouncedValue(inputs, 300);
const result = useMemo(() => calculate[Name](debouncedInputs), [debouncedInputs]);
```

**Note**: Most calculators don't need debouncing. Financial calculators should calculate instantly. Only use for very intensive calculations (e.g., complex statistical analysis, Monte Carlo simulations).

### Code Splitting
For heavy calculators with charts:
```typescript
import dynamic from 'next/dynamic';

const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <Skeleton />,
});
```

---

## Server/Client Component Split Pattern

World Calculator uses Next.js 15 static export, which requires a specific pattern for translations:

### The Problem
`useTranslations` hook doesn't work in static export. We must prepare translations in Server Components and pass them as props.

### The Solution (Loan Calculator Pattern)

**1. Server Component (page.tsx)** - Prepares translations:
```typescript
export default async function LoanCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calculators.finance.loan' });

  // Prepare all translations into a plain object
  const calculatorTranslations = {
    loanAmount: t('inputs.loanAmount'),
    interestRate: t('inputs.interestRate'),
    loanTerm: t('inputs.loanTerm'),
    // ... all needed translations
  };

  // Pass to Client Component
  return <LoanCalculator translations={calculatorTranslations} locale={locale} currency={config.currency} />;
}
```

**2. Client Component (Calculator.tsx)** - Receives translations:
```typescript
'use client';

interface LoanCalculatorProps {
  locale: string;
  currency: string;
  translations: {
    loanAmount: string;
    interestRate: string;
    // ... all translations
  };
}

export function LoanCalculator({ locale, currency, translations: t }: LoanCalculatorProps) {
  // Use plain object, not useTranslations hook
  return (
    <Input label={t.loanAmount} ... />
  );
}
```

**Why this pattern?**
- ✅ Works with Next.js 15 static export
- ✅ Translations are fully static (no runtime overhead)
- ✅ Type-safe with TypeScript
- ❌ Don't use `useTranslations` in client components for static export

---

## Accessibility Patterns (WCAG 2.2)

### Touch Target Sizes
**Minimum**: 44x44px for all interactive elements (24x24 CSS pixels for WCAG 2.2 Level AA)

```typescript
// Buttons and inputs
<Button className="min-h-[44px] min-w-[44px]">Calculate</Button>
<input className="min-h-[44px]" />
```

### ARIA Live Regions
Announce calculation results to screen readers:

```typescript
// Results announcement (loan calculator pattern)
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {result && `${getPaymentLabel()}: ${formatCurrency(result.periodicPayment, locale, currency)}`}
</div>
```

### Validation Error Announcements
```typescript
// Error announcements
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {!validation.valid && validation.errors.length > 0 &&
    `Validation error: ${validation.errors.map(e => e.message).join('. ')}`
  }
</div>
```

### Proper Input Labels
```typescript
<div>
  <label id="loanAmount-label" htmlFor="loanAmount">
    {t.loanAmount}
  </label>
  <Input
    id="loanAmount"
    aria-labelledby="loanAmount-label"
    aria-invalid={!!getFieldError('loanAmount')}
    aria-describedby={getFieldError('loanAmount') ? 'loanAmount-error' : undefined}
  />
  {getFieldError('loanAmount') && (
    <span id="loanAmount-error" role="alert">
      {getFieldError('loanAmount')}
    </span>
  )}
</div>
```

### Keyboard Navigation
- **Tab**: Move between inputs
- **Enter**: Calculate (or auto-calculate on input change)
- **Escape**: Clear/reset calculator
- **Arrow keys**: Adjust numeric values (for range inputs)

```typescript
const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleReset();
  }
}, [handleReset]);
```

### Skip to Results Link
```typescript
<a href="#results" className="sr-only focus:not-sr-only">
  Skip to results
</a>

<div id="results" tabIndex={-1}>
  {/* Results content */}
</div>
```

---

## Validation Timing Best Practices

### Validation Rules (from industry research)

1. **On blur** (when user leaves field):
   - Validate required fields
   - Show error if invalid
   - Don't validate on every keystroke (annoying)

2. **On submit** (when user clicks Calculate):
   - Validate all fields
   - Show all errors at once
   - Focus first error field

3. **Clear errors immediately**:
   - When user starts typing in field with error
   - Remove error message right away
   - Show success indicator when valid

4. **Success indicators**:
   - Green checkmark for valid fields
   - Only after field has been touched/validated

### Implementation Pattern

```typescript
const [touched, setTouched] = useState<Set<string>>(new Set());
const [validation, setValidation] = useState<ValidationResult>({ valid: true, errors: [] });

// Validate on blur
const handleBlur = useCallback((field: string) => {
  setTouched(prev => new Set(prev).add(field));
  const result = validateInputs(inputs);
  setValidation(result);
}, [inputs]);

// Clear error when user starts typing
const handleChange = useCallback((field: string, value: any) => {
  setInputs(prev => ({ ...prev, [field]: value }));

  // Clear error for this field immediately
  if (validation.errors.some(e => e.field === field)) {
    setValidation(prev => ({
      ...prev,
      errors: prev.errors.filter(e => e.field !== field),
    }));
  }
}, [validation.errors]);

// Show error only if field was touched
const getFieldError = useCallback((field: string) => {
  if (!touched.has(field)) return undefined;
  return validation.errors.find(e => e.field === field)?.message;
}, [touched, validation.errors]);
```

---

## Input Field UX Patterns

### Numeric Input Optimization

```typescript
<input
  type="number"
  inputMode="decimal"  // Mobile numeric keyboard with decimal
  min={0}
  max={1000000}
  step={0.01}  // For percentages
  placeholder="10,000"  // Realistic example
  className="min-h-[44px]"  // Touch target size
/>
```

### Input Masking (Currency)
```typescript
import { formatCurrency } from '@/lib/formatters';

const [displayValue, setDisplayValue] = useState('');

const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(rawValue) || 0;

  setInputs(prev => ({ ...prev, amount: numericValue }));
  setDisplayValue(formatCurrency(numericValue, locale, currency));
};

<Input
  value={displayValue}
  onChange={handleCurrencyInput}
  helperText="Enter the loan amount"  // Helper text below input
/>
```

### Unit Indicators
```typescript
<div className="relative">
  <Input type="number" className="pr-12" />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
    %
  </span>
</div>
```

### Helper Text Pattern
```typescript
<div>
  <Label>{t.interestRate}</Label>
  <Input />
  <p className="text-sm text-muted-foreground mt-1">
    Annual interest rate (APR). Example: 3.5 for 3.5%
  </p>
</div>
```

---

## Results Presentation Best Practices

### Visual Hierarchy
```typescript
{/* Primary result - prominent */}
<div className="text-4xl font-bold text-primary">
  {formatCurrency(result.monthlyPayment, locale, currency)}
</div>
<p className="text-muted-foreground">Monthly Payment</p>

{/* Secondary results - smaller */}
<div className="mt-6 grid grid-cols-2 gap-4">
  <div>
    <div className="text-2xl font-semibold">
      {formatCurrency(result.totalInterest, locale, currency)}
    </div>
    <p className="text-sm text-muted-foreground">Total Interest</p>
  </div>
  {/* More secondary results */}
</div>
```

### Contextual Explanations
```typescript
<div>
  <h3>What does this mean?</h3>
  <p>
    Your monthly payment of {formatCurrency(result.monthlyPayment)} includes both
    principal and interest. Over {loanTerm} years, you'll pay a total of{' '}
    {formatCurrency(result.totalPayment)}, of which{' '}
    {formatCurrency(result.totalInterest)} is interest.
  </p>
</div>
```

### Breakdown Tables (Collapsible)
```typescript
import { Accordion } from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="schedule">
    <AccordionTrigger>View Amortization Schedule</AccordionTrigger>
    <AccordionContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment #</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((payment) => (
            <TableRow key={payment.period}>
              <TableCell>{payment.period}</TableCell>
              <TableCell>{formatCurrency(payment.principal)}</TableCell>
              <TableCell>{formatCurrency(payment.interest)}</TableCell>
              <TableCell>{formatCurrency(payment.balance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Result Sharing & Persistence

### URL Parameter Sharing
```typescript
import { useRouter, useSearchParams } from 'next/navigation';

// Save inputs to URL
const updateURL = useCallback(() => {
  const params = new URLSearchParams();
  params.set('amount', inputs.amount.toString());
  params.set('rate', inputs.rate.toString());
  params.set('term', inputs.term.toString());

  router.push(`?${params.toString()}`, { scroll: false });
}, [inputs, router]);

// Load inputs from URL on mount
useEffect(() => {
  const amount = searchParams.get('amount');
  const rate = searchParams.get('rate');
  const term = searchParams.get('term');

  if (amount && rate && term) {
    setInputs({
      amount: parseFloat(amount),
      rate: parseFloat(rate),
      term: parseInt(term),
    });
  }
}, [searchParams]);
```

### Copy Results to Clipboard
```typescript
const copyResults = useCallback(async () => {
  const text = `
Monthly Payment: ${formatCurrency(result.monthlyPayment)}
Total Payment: ${formatCurrency(result.totalPayment)}
Total Interest: ${formatCurrency(result.totalInterest)}
  `.trim();

  await navigator.clipboard.writeText(text);
  toast.success('Results copied to clipboard!');
}, [result]);

<Button onClick={copyResults}>
  <Copy className="mr-2 h-4 w-4" />
  Copy Results
</Button>
```

### Print Functionality
```typescript
const handlePrint = useCallback(() => {
  window.print();
}, []);

{/* Add print styles */}
<style jsx>{`
  @media print {
    .no-print { display: none; }
    .print-only { display: block; }
  }
`}</style>

<Button onClick={handlePrint} className="no-print">
  <Printer className="mr-2 h-4 w-4" />
  Print Results
</Button>
```

---

## Progressive Disclosure Patterns

### Conditional Field Visibility
```typescript
const [showAdvanced, setShowAdvanced] = useState(false);

<div>
  {/* Basic inputs always visible */}
  <Input label="Loan Amount" />
  <Input label="Interest Rate" />
  <Input label="Loan Term" />

  {/* Advanced options hidden by default */}
  <Button variant="ghost" onClick={() => setShowAdvanced(!showAdvanced)}>
    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
  </Button>

  {showAdvanced && (
    <div className="mt-4 space-y-4">
      <Input label="Origination Fee" />
      <Input label="Down Payment" />
      <Input label="Extra Monthly Payment" />
    </div>
  )}
</div>
```

### Accordion for Grouped Options
```typescript
<Accordion type="multiple">
  <AccordionItem value="fees">
    <AccordionTrigger>Fees & Costs</AccordionTrigger>
    <AccordionContent>
      <Input label="Origination Fee" />
      <Input label="Processing Fee" />
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="extra">
    <AccordionTrigger>Extra Payments</AccordionTrigger>
    <AccordionContent>
      <Input label="Extra Monthly Payment" />
      <Input label="One-time Extra Payment" />
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Multi-Step for Complex Calculators
```typescript
const [step, setStep] = useState(1);

{step === 1 && (
  <div>
    <h2>Step 1: Basic Information</h2>
    <Input label="Loan Amount" />
    <Button onClick={() => setStep(2)}>Next</Button>
  </div>
)}

{step === 2 && (
  <div>
    <h2>Step 2: Loan Terms</h2>
    <Input label="Interest Rate" />
    <Input label="Loan Term" />
    <Button onClick={() => setStep(1)}>Back</Button>
    <Button onClick={() => setStep(3)}>Next</Button>
  </div>
)}

{step === 3 && (
  <div>
    <h2>Step 3: Results</h2>
    {/* Show results */}
  </div>
)}
```

---

## Mobile-First Optimization

### Touch Target Sizes
**Minimum**: 44x44px for all interactive elements
```typescript
<Button className="min-h-[44px] min-w-[44px]">Calculate</Button>
```

### Thumb-Zone Optimization
Place primary actions in the lower third of the screen on mobile:
```typescript
<div className="md:mt-6 fixed md:relative bottom-0 left-0 right-0 p-4 bg-background border-t md:border-0">
  <Button className="w-full" size="lg">
    Calculate
  </Button>
</div>
```

### Sticky Calculate Button
```typescript
<div className="sticky bottom-0 p-4 bg-background border-t md:hidden">
  <Button className="w-full" size="lg">
    Calculate Payment
  </Button>
</div>
```

### Collapsible Results on Mobile
```typescript
<div className="md:grid md:grid-cols-2 md:gap-6">
  {/* On mobile: accordion, on desktop: side-by-side */}
  <Accordion type="single" collapsible className="md:hidden">
    <AccordionItem value="breakdown">
      <AccordionTrigger>View Detailed Breakdown</AccordionTrigger>
      <AccordionContent>
        {/* Detailed results */}
      </AccordionContent>
    </AccordionItem>
  </Accordion>

  {/* Desktop: always visible */}
  <div className="hidden md:block">
    {/* Detailed results */}
  </div>
</div>
```

### Mobile Input Keyboards
```typescript
{/* Numeric keyboard */}
<input type="number" inputMode="numeric" />

{/* Decimal keyboard */}
<input type="number" inputMode="decimal" />

{/* Telephone keyboard */}
<input type="tel" inputMode="tel" />

{/* Email keyboard */}
<input type="email" inputMode="email" />
```

---

## Advanced Patterns

### Hydration Safety (Date Formatting)
Prevent server/client date formatting mismatches:

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Safe date rendering
{isMounted ? (
  payoffDate.toLocaleDateString(locale)
) : (
  '...'  // Server-side placeholder
)}
```

**Why**: Server and client may format dates differently (timezone, locale), causing hydration errors.

### Locale-Specific Business Logic
Adapt terminology and calculations per locale:

```typescript
function getRateLabels(locale: string): { nominal: string; effective: string } {
  const lang = locale.split('-')[0].toLowerCase();
  switch (lang) {
    case 'es':
      return { nominal: 'TIN', effective: 'TAE' };
    case 'fr':
    case 'pt':
    case 'it':
      return { nominal: 'TAN', effective: 'TAEG' };
    case 'de':
      return { nominal: 'Nominalzins', effective: 'Eff. Jahreszins' };
    default:
      return { nominal: 'APR', effective: 'Eff. Rate' };
  }
}

// Use in component
const rateLabels = getRateLabels(locale);
<Label>{rateLabels.nominal}</Label>
```

**Examples of locale-specific adaptations**:
- Interest rate terminology (APR vs TIN/TAE)
- Tax calculations (US vs EU)
- Payment frequencies (biweekly in US, monthly in EU)
- Date formats (MM/DD/YYYY vs DD/MM/YYYY)

---

## Quality Checklist

Before submitting calculator as complete:

**Code Quality**:
- [ ] TypeScript strict mode compliant (no `any` types)
- [ ] Pure calculation functions (no side effects)
- [ ] Edge cases handled and tested
- [ ] Proper precision handling (financial = roundToCents)
- [ ] Memoization for performance (useMemo)
- [ ] useCallback for event handlers and helper functions
- [ ] No magic numbers (use named constants)
- [ ] Input validation at multiple layers
- [ ] Formula validated against 2+ authoritative sources

**Structure**:
- [ ] Follows feature-based folder structure
- [ ] Types, calculations, component separated
- [ ] Page component with metadata
- [ ] Registered in calculator registry
- [ ] `dynamic = 'force-static'` and `dynamicParams = false` exports
- [ ] Async params pattern used (`await params`)

**Internationalization**:
- [ ] Translations in all 6 languages
- [ ] Translation validation passes (`npm run validate:translations`)
- [ ] Locale-specific formatting (currency, numbers, dates)
- [ ] Terminology adapted per locale (APR vs TAN/TAE)
- [ ] Server/Client split: translations passed as props
- [ ] Locale-specific business logic implemented (if needed)

**SEO**:
- [ ] Meta title (50-60 chars) in all languages
- [ ] Meta description (150-160 chars) in all languages
- [ ] Keywords defined per language
- [ ] Hreflang tags configured
- [ ] Canonical URL set
- [ ] Open Graph metadata
- [ ] JSON-LD structured data (SoftwareApplication minimum)
- [ ] Breadcrumb schema included
- [ ] 8-10 FAQs with FAQ schema
- [ ] 5-step HowTo with HowTo schema

**Accessibility (WCAG 2.2)**:
- [ ] Touch targets minimum 44x44px (24x24 CSS pixels)
- [ ] ARIA labels on all inputs
- [ ] ARIA live regions for result announcements
- [ ] ARIA live regions for validation errors (assertive)
- [ ] Proper input label associations (id/htmlFor)
- [ ] Error messages with role="alert"
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Skip-to-results link for keyboard users
- [ ] Focus indicators visible and meet contrast requirements
- [ ] Screen reader testing completed (VoiceOver/NVDA)

**UX & Validation**:
- [ ] Validation on blur (not on keystroke)
- [ ] Errors clear immediately when user corrects
- [ ] Success indicators for valid fields
- [ ] Helper text below complex inputs
- [ ] Placeholder examples provided
- [ ] Input type optimization (number, inputMode decimal)
- [ ] Unit indicators adjacent to inputs (%, $, years)
- [ ] Realistic min/max/step attributes

**Results Presentation**:
- [ ] Primary result prominent (32px+ font size)
- [ ] Visual hierarchy clear (primary vs secondary results)
- [ ] Contextual explanations provided
- [ ] Breakdown tables collapsible (if complex)
- [ ] Results formatted per locale

**Sharing & Persistence** (recommended):
- [ ] URL parameter sharing (optional but recommended)
- [ ] Print functionality (window.print())
- [ ] Copy results to clipboard (optional)

**Mobile-First**:
- [ ] Touch targets 44x44px minimum
- [ ] Mobile input keyboards optimized (inputMode)
- [ ] Thumb-zone optimization (actions in lower third)
- [ ] Collapsible sections on mobile
- [ ] Responsive layout (sm/md/lg breakpoints)
- [ ] Mobile-responsive tested on real devices

**Performance**:
- [ ] First Load JS < 100KB (verify with bundle analyzer)
- [ ] Lighthouse Performance score > 90
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] useMemo for calculations
- [ ] useCallback for functions
- [ ] Code splitting for heavy components (if needed)

**Testing**:
- [ ] Calculation produces correct results
- [ ] Cross-validated against 3+ competitor implementations
- [ ] Edge cases tested (zero, negative, max values)
- [ ] Validation shows appropriate errors
- [ ] All 6 locales render correctly
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Safari, Firefox
- [ ] Mobile tested on iOS and Android

---

## Getting Help

### Use Specialized Agents

**Research needed?**
→ `calculator-market-researcher`

**Architecture complex?**
→ `calculator-architect`

**Formula validation?**
→ `calculator-validation-expert`

**Translation management?**
→ `i18n-translation-specialist`

**SEO optimization?**
→ `seo-structured-data-specialist`

**Content creation?**
→ `content-localization-writer`

**Build issues?**
→ `nextjs-static-export-optimizer`

See `.claude/AGENT_DEPLOYMENT_EXAMPLES.md` for usage examples.

---

## Reference Implementation

**Study the loan calculator** as your gold standard:

📁 `src/features/finance/loan/` - Complete implementation
📄 `src/app/[locale]/calculators/finance/loan/page.tsx` - Page structure
🌐 `src/messages/*/calculators/finance/loan.json` - Translation pattern
⚙️ `src/config/calculators.ts` - Registry entry

Copy its patterns and adapt to your calculator's needs.

---

**You're ready to build calculators! Start simple (percentage, BMI) and gradually tackle more complex ones (mortgages, investments).**
