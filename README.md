# World Calculator

A modern, multi-language calculator platform built with Next.js 15 and React 19. Features 6 calculator categories based on global user demand research, comprehensive SEO optimization, and static site generation for optimal performance.

## Calculator Categories

Based on comprehensive market research analyzing search volumes and global user demand:

| Priority | Category | Description |
|----------|----------|-------------|
| 1 | **Finance** | Mortgage, loans, savings, investment calculators |
| 2 | **Health & Fitness** | BMI, calorie, body fat, fitness calculators |
| 3 | **Math** | Percentage, fractions, GPA, average calculators |
| 4 | **Conversion** | Unit, currency, temperature converters |
| 5 | **Time & Date** | Age, date difference, countdown calculators |
| 6 | **Construction** | Square footage, paint, materials calculators |

## Internationalization

Supports 6 languages with locale-based routing:

| Language | Code | Flag |
|----------|------|------|
| English | en | US |
| Spanish | es | ES |
| French | fr | FR |
| German | de | DE |
| Portuguese | pt | PT |
| Italian | it | IT |

Each locale includes:
- Full UI translations
- Category-specific calculator translations
- Locale-aware number, currency, and date formatting

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.11 | Framework (App Router, Static Export) |
| React | 19 | UI Library |
| TypeScript | 5.6.3 | Type Safety (Strict Mode) |
| Tailwind CSS | 3.4.15 | Styling |
| Shadcn UI | - | UI Component Library |
| next-intl | 3.25.0 | Internationalization |
| Zod | 3.22.4 | Runtime Validation |
| Lucide React | 0.454.0 | Icons |

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Locale-based routing
│   │   ├── calculators/     # Calculator pages
│   │   │   ├── [category]/  # Category listing pages
│   │   │   └── [category]/[slug]/  # Individual calculators
│   │   ├── layout.tsx       # Root layout with providers
│   │   └── page.tsx         # Home page
│   ├── robots.ts            # Dynamic robots.txt
│   ├── sitemap.ts           # Dynamic sitemap generation
│   └── globals.css          # Global styles
│
├── components/
│   ├── ui/                  # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── slider.tsx
│   ├── calculator/          # Calculator-specific components
│   │   ├── CalculatorLayout.tsx
│   │   ├── CalculatorInput.tsx
│   │   ├── CalculatorOutput.tsx
│   │   └── ResultCard.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── providers/           # Context providers
│   └── sections/            # Page section components
│
├── features/                # Calculator logic by category
│   ├── math/
│   ├── finance/
│   ├── health/
│   ├── conversion/
│   ├── time-date/
│   └── construction/
│
├── hooks/                   # Custom React hooks
│   ├── useCalculatorState.ts    # Combined state management
│   ├── useCalculatorHistory.ts  # Calculation history
│   ├── useLocalStorage.ts       # Persistence
│   └── useUrlParams.ts          # URL parameter sync
│
├── i18n/                    # Internationalization
│   ├── locales.ts           # Locale configurations
│   ├── request.ts           # Dynamic message loading
│   ├── routing.ts           # Routing setup
│   └── middleware.ts        # Locale middleware
│
├── messages/                # Translation files (JSON)
│   ├── en/
│   │   ├── common.json
│   │   └── calculators/
│   │       ├── math.json
│   │       ├── finance.json
│   │       └── ...
│   ├── es/
│   ├── fr/
│   ├── de/
│   ├── pt/
│   └── it/
│
├── lib/                     # Utilities
│   ├── structuredData.ts    # JSON-LD schema generation
│   ├── formatters.ts        # Data formatting
│   ├── validation.ts        # Zod validation schemas
│   └── utils.ts             # Helper functions
│
├── types/                   # TypeScript definitions
│   ├── calculator.ts        # Calculator interfaces
│   ├── category.ts          # Category types
│   └── translations.ts      # Translation key types
│
└── config/                  # Configuration
    ├── calculators.ts       # Calculator registry
    ├── categories.ts        # Category definitions
    └── site.ts              # Site configuration
```

## Key Features

### Calculator System
- **Modular Architecture** - Feature-based organization by category
- **Calculator Registry** - Centralized metadata (slug, category, icon, difficulty, time estimate)
- **Flexible Inputs** - Support for number, select, slider, radio, and text inputs
- **Rich Outputs** - Results with formulas, explanations, charts, and tables

### User Experience
- **URL Parameter Sharing** - Share calculator results via URL with encoded inputs
- **Calculation History** - LocalStorage-based history with search and retrieval
- **Saved Calculations** - Save favorite calculations with timestamps
- **User Preferences** - Persistent unit and format preferences
- **Responsive Design** - Mobile-first with Tailwind CSS

### SEO & Structured Data
- **JSON-LD Schemas** - Organization, WebSite, BreadcrumbList, SoftwareApplication, Article, FAQ, HowTo
- **Dynamic Sitemaps** - Generated for all locales and categories
- **Multi-language SEO** - hreflang tags, canonical URLs, alternates
- **Open Graph & Twitter Cards** - Social sharing optimization

### Performance
- **Static Export** - Pre-rendered pages for fast loading
- **Console Removal** - Production builds strip console.log
- **Bundle Analysis** - Optional bundle size analysis

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (validates translations first) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run validate:translations` | Validate translation completeness |
| `npm run analyze` | Analyze bundle size |

## Development Guide

### Adding a New Calculator

1. **Create feature folder:**
   ```
   src/features/[category]/[calculator-name]/
   ```

2. **Define calculator logic and types**

3. **Register in calculator config:**
   ```typescript
   // src/config/calculators.ts
   {
     id: 'your-calculator',
     slug: 'your-calculator',
     category: 'math',
     icon: 'Calculator',
     difficulty: 'easy',
     estimatedTime: '1 min'
   }
   ```

4. **Add translations** in all 6 language files:
   ```
   src/messages/[locale]/calculators/[category].json
   ```

5. **Create calculator page component**

6. **Use `useCalculatorState` hook** for state management

7. **Validate and build:**
   ```bash
   npm run validate:translations
   npm run build
   ```

### Adding a New Language

1. **Update locale configuration:**
   ```typescript
   // src/i18n/locales.ts
   // Add to locales array and localeConfigs
   ```

2. **Create translation files:**
   ```
   src/messages/[new-lang]/
   ├── common.json
   └── calculators/
       ├── math.json
       ├── finance.json
       └── ...
   ```

3. **Copy and translate** from English versions

### State Management Hooks

| Hook | Purpose |
|------|---------|
| `useCalculatorState` | Combined state (URL, localStorage, history, preferences) |
| `useCalculatorHistory` | Calculation history with localStorage |
| `useLocalStorage` | Saved calculations and preferences |
| `useUrlParams` | URL parameter sync for sharing |

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Static export, image optimization, compiler settings |
| `tsconfig.json` | TypeScript: ES2020, strict mode, path aliases |
| `tailwind.config.ts` | Theming, CSS variables, dark mode, animations |
| `components.json` | Shadcn UI configuration |
| `.eslintrc.json` | ESLint: Next.js core web vitals |
| `middleware.ts` | next-intl locale detection and routing |

## Architecture Decisions

- **Static Export** - Chosen for SEO, performance, and simple hosting
- **Feature-based Organization** - Calculators grouped by category for maintainability
- **Server Components** - Used for layouts and metadata; client components for interactivity
- **Type-safe Translations** - Compile-time validation of translation keys
- **URL State Sync** - Enables shareable calculator results

## Known Issues

See `ACTION_ITEMS.md` for tracked issues including:
- Deprecated `substr()` usage (replace with `substring()`)
- Missing absolute URLs in canonical links
- Missing Open Graph images
- Core assets needed (logo, favicon)

## License

This project is private and proprietary.

## Contributing

This is a private project. Contributions are managed internally.
