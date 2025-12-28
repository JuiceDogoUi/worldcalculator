# World Calculator - Claude AI Configuration

## Project Identity
**Name**: World Calculator
**Type**: Multi-language static calculator platform
**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, next-intl, Shadcn UI
**Languages**: 6 (English, Spanish, French, German, Portuguese, Italian)
**Deployment**: Vercel (static export)
**Purpose**: Provide free, accurate, SEO-optimized calculators across multiple categories and languages

---

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.1.11 with App Router
- **Language**: TypeScript 5.6.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.15 + Shadcn UI
- **i18n**: next-intl 3.25.0 (serverless routing)
- **Validation**: Zod 3.22.4
- **Icons**: Lucide React 0.454.0
- **Analytics**: Vercel Analytics + Speed Insights

### Calculator Categories
1. **Finance** - Loans, mortgages, investments, savings
2. **Health & Fitness** - BMI, calories, macros, heart rate
3. **Math** - Percentage, statistics, algebra, geometry
4. **Conversion** - Units, currency, temperature, time zones
5. **Time & Date** - Age, date difference, working days
6. **Construction** - Materials, area, volume, costs

### Supported Languages
- **en** (English - US) - USD currency
- **es** (Spanish - Spain/LatAm) - EUR currency
- **fr** (French - France) - EUR currency
- **de** (German - Germany) - EUR currency
- **pt** (Portuguese - Portugal/Brazil) - EUR currency
- **it** (Italian - Italy) - EUR currency

---

## Specialized Agents

World Calculator uses 7 specialized sub-agents for different aspects of development. Each agent is an expert in their domain and should be deployed strategically.

### 1. calculator-architect
**Expertise**: Calculator design, TypeScript architecture, React patterns
**Use for**:
- Designing new calculator types and implementations
- Defining TypeScript interfaces and types
- Structuring feature folders and components
- Implementing calculation logic with precision handling
- Reviewing calculator code for consistency
- Refactoring existing calculators

**Key responsibilities**:
- Type definitions (inputs, results, validation)
- Pure calculation functions
- React component architecture
- Registry integration
- Performance optimization (memoization)

**Tools**: All tools (Read, Edit, Write, Glob, Grep, Bash, LSP, Diagnostics)

---

### 2. i18n-translation-specialist
**Expertise**: Multi-language translations, locale-specific formatting, next-intl
**Use for**:
- Adding translations for new calculators
- Managing translation files across 6 languages
- Handling locale-specific formatting (currency, numbers, dates)
- Validating translation consistency
- Adding new language support
- Debugging i18n issues

**Key responsibilities**:
- Maintain translation JSON structure
- Locale-specific terminology (APR vs TAN/TAE)
- Number/currency/date formatting
- Translation validation script compliance

**Tools**: Read, Edit, Write, Glob, Grep, Bash (for validation)

---

### 3. seo-structured-data-specialist
**Expertise**: Multi-language SEO, JSON-LD schemas, rich snippets
**Use for**:
- Creating SEO metadata for calculators
- Generating JSON-LD structured data
- Optimizing for rich snippets (FAQ, HowTo, SoftwareApplication)
- Multi-language hreflang and canonical URLs
- Keyword optimization across languages
- SEO audits and improvements

**Key responsibilities**:
- Meta tags (title, description, keywords)
- JSON-LD schemas (FAQ, HowTo, SoftwareApplication, Breadcrumb)
- Hreflang tags for 6 locales
- Open Graph and Twitter Card metadata

**Tools**: Read, Edit, Write, Glob, Grep, WebSearch (keyword research)

---

### 4. nextjs-static-export-optimizer
**Expertise**: Next.js 15 App Router, static export, build optimization
**Use for**:
- Build performance optimization
- Bundle size analysis and reduction
- Static generation configuration
- App Router best practices
- Debugging build errors
- Performance monitoring

**Key responsibilities**:
- Optimize build times and bundle sizes
- Configure static export settings
- Implement Server/Client component patterns
- Debug hydration errors
- Manage middleware and routing

**Tools**: All tools (especially Bash for builds, bundle analysis)

---

### 5. calculator-validation-expert
**Expertise**: Zod validation, mathematical precision, edge case handling
**Use for**:
- Creating input validation schemas
- Ensuring calculation accuracy
- Handling edge cases (zero values, boundaries)
- Financial precision requirements
- Formula verification
- Testing calculation correctness

**Key responsibilities**:
- Zod schema design
- Floating-point precision handling (roundToCents)
- Edge case identification and handling
- Unit testing calculation functions
- Error message design

**Tools**: Read, Edit, Write, mcp__ide__executeCode (testing), Bash (run tests)

---

### 6. content-localization-writer
**Expertise**: Multi-language content creation, SEO copywriting, cultural adaptation
**Use for**:
- Writing calculator descriptions
- Creating FAQ content (8-10 per calculator)
- Writing HowTo guides (5 steps)
- Translating and culturally adapting content
- SEO keyword research
- Creating locale-specific examples

**Key responsibilities**:
- SEO-optimized content in all 6 languages
- Native-sounding translations (not literal)
- Cultural adaptation and localization
- FAQ and HowTo content structure
- Keyword integration

**Tools**: Read, Write, Edit, WebSearch, WebFetch (research)

---

### 7. calculator-market-researcher
**Expertise**: Competitor analysis, formula validation, best practices, market trends
**Use for**:
- Planning new calculator types
- Analyzing competitor implementations
- Finding and validating calculation formulas
- Researching calculator UX best practices
- Identifying trending calculator types
- SEO strategy research
- Feature gap analysis

**Key responsibilities**:
- Competitor analysis (calculator.net, omnicalculator, etc.)
- Formula validation from authoritative sources
- Best practice documentation
- Market trend analysis
- Feature benchmarking

**Tools**: WebSearch, WebFetch, Read, Grep, Glob, TodoWrite

---

## Agent Deployment Rules

### Always Deploy When:
- **New calculator planning** → calculator-market-researcher (first), then calculator-architect
- **Calculator implementation** → calculator-architect + calculator-validation-expert
- **Translation needed** → i18n-translation-specialist
- **SEO content needed** → seo-structured-data-specialist + content-localization-writer
- **Build issues** → nextjs-static-export-optimizer
- **Formula validation** → calculator-validation-expert + calculator-market-researcher
- **Content creation** → content-localization-writer

### Deploy Proactively When:
- User mentions adding a calculator → calculator-market-researcher
- User mentions competitors → calculator-market-researcher
- User mentions translations/languages → i18n-translation-specialist
- User mentions SEO or Google ranking → seo-structured-data-specialist
- User mentions accuracy or edge cases → calculator-validation-expert
- Build is slow or bundle is large → nextjs-static-export-optimizer
- User needs calculator content → content-localization-writer
- User asks about best practices → calculator-market-researcher

### Run in Parallel When:
- Research + implementation planning (market researcher + architect)
- SEO metadata + content writing (SEO specialist + content writer)
- Translation + validation (i18n specialist + validation expert)
- Multiple independent calculators (multiple architect agents)

**Important**: Use a single message with multiple Task tool calls to run agents in parallel.

---

## Standard Workflows

### Workflow 1: Adding a New Calculator (Complete)

#### Phase 1: Research & Planning
**Agents**: calculator-market-researcher, calculator-architect (parallel)

**Tasks**:
1. **Market researcher**:
   - Analyze top 5 competitor implementations
   - Validate calculation formulas from authoritative sources
   - Document best practices and feature gaps
   - Provide SEO keyword research

2. **Calculator architect**:
   - Design TypeScript types (inputs, results, validation)
   - Plan calculation logic and edge cases
   - Structure component architecture
   - Plan registry integration

**Output**: Research report + implementation plan

---

#### Phase 2: Implementation
**Agents**: calculator-architect, calculator-validation-expert (parallel)

**Tasks**:
1. **Architect**:
   - Create feature folder structure
   - Implement types and calculation functions
   - Build React component
   - Register in calculator registry
   - Create page component with metadata

2. **Validation expert**:
   - Create Zod validation schemas
   - Implement precision handling
   - Handle edge cases
   - Write unit tests

**Output**: Working calculator with validation

---

#### Phase 3: Internationalization
**Agent**: i18n-translation-specialist

**Tasks**:
- Create translation structure in English
- Copy structure to all 5 other languages
- Translate content for each locale
- Adapt terminology to local standards
- Run validation script

**Output**: Complete translations in 6 languages

---

#### Phase 4: SEO & Content
**Agents**: seo-structured-data-specialist, content-localization-writer (parallel)

**Tasks**:
1. **SEO specialist**:
   - Generate metadata for all 6 languages
   - Create JSON-LD schemas (SoftwareApplication, FAQ, HowTo, Breadcrumb)
   - Set up hreflang tags
   - Configure Open Graph metadata

2. **Content writer**:
   - Write calculator description (300-500 words)
   - Create 8-10 FAQs per language
   - Write 5-step HowTo guide per language
   - Create locale-specific examples

**Output**: Complete SEO and educational content

---

#### Phase 5: Optimization & Validation
**Agent**: nextjs-static-export-optimizer

**Tasks**:
- Run build and check for errors
- Analyze bundle size
- Optimize if needed
- Validate all pages generated
- Check Core Web Vitals

**Output**: Production-ready calculator

---

### Workflow 2: Quick Calculator Addition (Streamlined)

For simple calculators with straightforward formulas:

1. **calculator-architect**: Design and implement (skip research if formula is well-known)
2. **i18n-translation-specialist**: Add translations
3. **content-localization-writer**: Create SEO content
4. Build and deploy

---

### Workflow 3: SEO Optimization (Existing Calculator)

1. **seo-structured-data-specialist**: Audit current SEO, identify improvements
2. **content-localization-writer**: Enhance content, add FAQs/HowTo
3. **i18n-translation-specialist**: Update translations if needed
4. Deploy changes

---

### Workflow 4: Performance Optimization

1. **nextjs-static-export-optimizer**: Analyze build and bundle
2. **calculator-architect**: Refactor calculators if needed (memoization, code splitting)
3. **nextjs-static-export-optimizer**: Re-analyze and validate improvements

---

### Workflow 5: Translation Expansion (Add New Language)

1. **i18n-translation-specialist**:
   - Update locale configuration
   - Create message folder structure
   - Copy and translate all content
   - Run validation
2. **content-localization-writer**: Adapt content culturally
3. **seo-structured-data-specialist**: Add SEO metadata for new locale

---

## Development Patterns

### Calculator Implementation Checklist
- [ ] Research competitors (market-researcher)
- [ ] Validate formula (validation-expert or market-researcher)
- [ ] Design types and logic (calculator-architect)
- [ ] Implement validation (validation-expert)
- [ ] Create component (calculator-architect)
- [ ] Register calculator (calculator-architect)
- [ ] Add translations (i18n-translation-specialist) - all 6 languages
- [ ] Create SEO metadata (seo-structured-data-specialist) - all 6 languages
- [ ] Write content (content-localization-writer) - FAQs, HowTo, description
- [ ] Build and validate (nextjs-static-export-optimizer)
- [ ] Test in all languages
- [ ] Deploy

### Quality Standards
- **TypeScript**: Strict mode, 100% type coverage
- **Validation**: Zod schemas for all inputs
- **Translations**: All 6 languages, validated structure
- **SEO**: Meta tags, structured data, FAQs, HowTo in all languages
- **Precision**: Financial calculations rounded to cents
- **Edge cases**: Zero values, boundaries, invalid inputs handled
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Memoization, code splitting, < 100KB first load

---

## File Structure Reference

```
src/
├── app/[locale]/
│   ├── calculators/
│   │   ├── [category]/[name]/page.tsx  # Calculator pages
│   │   └── page.tsx                     # Calculator hub
│   └── page.tsx                         # Homepage
│
├── features/[category]/[name]/
│   ├── types.ts                         # TypeScript interfaces
│   ├── calculations.ts                  # Pure calculation functions
│   ├── [Name]Calculator.tsx             # Main component
│   └── ConversationalSummary.tsx        # Results display (optional)
│
├── components/
│   ├── ui/                              # Shadcn UI components
│   ├── calculator/                      # Shared calculator components
│   ├── layout/                          # Header, footer, nav
│   └── home/                            # Homepage sections
│
├── messages/[locale]/
│   ├── common.json                      # Shared UI strings
│   └── calculators/[category]/[name].json  # Calculator translations
│
├── lib/
│   ├── formatters.ts                    # Currency, number, date formatting
│   ├── structuredData.ts                # JSON-LD schema generation
│   ├── validation.ts                    # Shared Zod schemas
│   └── utils.ts                         # Utilities
│
├── config/
│   ├── calculators.ts                   # Calculator registry
│   ├── categories.ts                    # Category definitions
│   └── site.ts                          # Site config
│
└── i18n/
    ├── locales.ts                       # Locale configuration
    ├── routing.ts                       # next-intl routing
    ├── request.ts                       # Message loading
    └── middleware.ts                    # Locale detection
```

---

## Communication Style

### For Strategic Tasks (Planning, Architecture):
- Present 2-3 options with clear tradeoffs
- Explain "why" behind recommendations
- Reference competitor examples
- End with next steps or questions

### For Tactical Tasks (Implementation):
- Execute directly and efficiently
- Be concise
- Use TodoWrite for tracking (3+ steps)
- Mark todos completed immediately

### For Research:
- Cite authoritative sources
- Provide URLs and access dates
- Cross-reference multiple sources
- Summarize findings with actionable recommendations

### For Content:
- Write for target audience (locale-appropriate)
- Optimize for SEO naturally
- Include examples with correct locale formatting
- Provide all 6 language versions

---

## Precision Standards

### Financial Calculations
- Round to cents: `roundToCents(value)`
- Handle 0% interest edge case
- Final payment adjustment to ensure zero balance
- Use IRR for effective annual rate

### General Math
- Round to appropriate decimal places
- Handle division by zero
- Validate domain restrictions (sqrt of negative, etc.)
- Use proper precision for floating-point operations

### Number Formatting
- **English (US)**: 1,234.56
- **European**: 1.234,56
- Use `formatNumber()`, `formatCurrency()`, `formatPercentage()` from lib/formatters

---

## Reference Implementation

### Gold Standard: Loan Calculator
Study these files for best practices:
- `src/features/finance/loan/` - Complete implementation
- `src/app/[locale]/calculators/finance/loan/page.tsx` - Page structure
- `src/messages/en/calculators/finance/loan.json` - Translation structure
- `src/config/calculators.ts` - Registry pattern

### Key Patterns:
- TypeScript strict mode with full type coverage
- Zod validation with field-level errors
- Memoized calculations with useCallback/useMemo
- Locale-aware formatting throughout
- Comprehensive SEO metadata
- 8 FAQs and 5-step HowTo guide
- JSON-LD structured data

---

## Agent Configuration Files

Detailed agent documentation available in:
- `.claude/agents/calculator-architect.md`
- `.claude/agents/i18n-translation-specialist.md`
- `.claude/agents/seo-structured-data-specialist.md`
- `.claude/agents/nextjs-static-export-optimizer.md`
- `.claude/agents/calculator-validation-expert.md`
- `.claude/agents/content-localization-writer.md`
- `.claude/agents/calculator-market-researcher.md`

Refer to these for detailed agent capabilities, templates, and examples.

---

## Quick Reference

### Common Commands
```bash
npm run dev                      # Start dev server
npm run build                    # Build static export (includes translation validation)
npm run validate:translations    # Validate translation files
npm run analyze                  # Build with bundle analyzer
```

### Calculator Registry
Add new calculators to `src/config/calculators.ts`:
```typescript
{
  id: 'unique-id',
  name: 'Calculator Name',
  category: 'category-id',
  path: '/calculators/category/name',
  icon: LucideIcon,
  featured: boolean
}
```

### Translation Keys
Access in components:
```typescript
const t = useTranslations('calculators.category.name');
t('inputs.field.label');  // Field label
t('seo.metaTitle');       // SEO title
```

---

**This configuration optimizes Claude Code for World Calculator development, with specialized agents for calculator architecture, internationalization, SEO, and performance.**
