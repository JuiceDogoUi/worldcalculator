# Agent Deployment Quick Reference

Practical examples for deploying World Calculator agents. For detailed agent capabilities, see `.claude/agents/*.md`.

---

## Quick Reference Table

| Agent | Use When | Typical Output |
|-------|----------|----------------|
| calculator-architect | Designing/implementing calculators | Types, components, implementation |
| calculator-market-researcher | Need competitor analysis or formula validation | Research report with sources |
| calculator-validation-expert | Creating validation or testing accuracy | Zod schemas, unit tests |
| i18n-translation-specialist | Managing translations across 6 languages | Translation JSON files |
| seo-structured-data-specialist | Creating SEO metadata and schemas | Meta tags, JSON-LD schemas |
| content-localization-writer | Writing FAQs, guides, descriptions | Multi-language content |
| nextjs-static-export-optimizer | Build issues or performance optimization | Analysis and fixes |

---

## Basic Agent Call Pattern

```
<Uses Task tool>
subagent_type: [agent-name]
prompt: [Clear task description]

[Specific requirements]
[Context/constraints]
[Expected deliverables]
</Task>
```

---

## Essential Examples

### 1. Research New Calculator
```
<Task>
subagent_type: calculator-market-researcher
prompt: Research BMI calculator:
- Analyze top 5 competitor implementations
- Validate BMI formula from authoritative sources (CDC, WHO)
- Document best practices for input/output
- Provide SEO keyword research in 6 languages
</Task>
```

### 2. Design Calculator
```
<Task>
subagent_type: calculator-architect
prompt: Design mortgage calculator following loan calculator pattern:
- Types: MortgageInputs, MortgageResult, MortgageValidation
- Calculation: PITI breakdown, amortization schedule
- Component: Input form, results visualization
- Edge cases: zero down payment, zero interest
- Registry integration
</Task>
```

### 3. Create Validation
```
<Task>
subagent_type: calculator-validation-expert
prompt: Create validation for investment calculator:
- Zod schema for inputs (principal, rate, term, contributions)
- Handle negative returns (loss scenarios)
- Precision handling with roundToCents
- Unit tests with edge cases
</Task>
```

### 4. Add Translations
```
<Task>
subagent_type: i18n-translation-specialist
prompt: Add translations for percentage calculator in all 6 languages.
Ensure locale-specific terminology and number formatting. Run validation script.
</Task>
```

### 5. Create SEO Metadata
```
<Task>
subagent_type: seo-structured-data-specialist
prompt: Create SEO for currency converter:
- Meta tags (title, description, keywords) in 6 languages
- JSON-LD schemas: SoftwareApplication, FAQ, HowTo
- Hreflang tags and canonical URLs
</Task>
```

### 6. Write Content
```
<Task>
subagent_type: content-localization-writer
prompt: Create content for loan calculator in 6 languages:
- 8 FAQs (What is APR? How to calculate payment? etc.)
- 5-step HowTo guide
- 300-word description
Culturally adapt for each locale (APR vs TAN/TAE terminology).
</Task>
```

### 7. Optimize Build
```
<Task>
subagent_type: nextjs-static-export-optimizer
prompt: Build taking 5 minutes, optimize to < 2 minutes:
- Run bundle analyzer
- Identify large dependencies
- Implement code splitting
- Optimize translation validation script
</Task>
```

---

## Parallel Deployment Pattern

**Run agents in parallel** by using multiple Task calls in a **single message**:

### Example: Research + Design Phase
```
<Task> <!-- Agent 1 -->
subagent_type: calculator-market-researcher
prompt: Research retirement calculator competitors and validate formulas
</Task>

<Task> <!-- Agent 2 - same message -->
subagent_type: calculator-architect
prompt: Design retirement calculator architecture with types and components
</Task>
```

### Example: SEO + Content Phase
```
<Task>
subagent_type: seo-structured-data-specialist
prompt: Create SEO metadata for BMI calculator in 6 languages
</Task>

<Task> <!-- Same message -->
subagent_type: content-localization-writer
prompt: Write FAQs and HowTo guide for BMI calculator in 6 languages
</Task>
```

---

## Complete Workflow: Add New Calculator

**Step 1: Research & Design** (Parallel)
```
calculator-market-researcher + calculator-architect
```

**Step 2: Implementation** (Parallel)
```
calculator-architect + calculator-validation-expert
```

**Step 3: Translations**
```
i18n-translation-specialist
```

**Step 4: SEO & Content** (Parallel)
```
seo-structured-data-specialist + content-localization-writer
```

**Step 5: Build & Validate**
```
nextjs-static-export-optimizer
```

---

## Common Patterns

### Formula Validation
```
<Task>
subagent_type: calculator-market-researcher
prompt: Validate compound interest formula from authoritative sources (SEC, financial regulations). Document standard formula with variables, edge cases, and implementation notes.
</Task>
```

### Fix Translation Errors
```
<Task>
subagent_type: i18n-translation-specialist
prompt: Build failing with translation validation errors in Spanish and French. Fix missing keys and structural inconsistencies.
</Task>
```

### SEO Audit
```
<Task>
subagent_type: seo-structured-data-specialist
prompt: Audit all calculator pages for SEO compliance. Check meta tags, structured data validity, hreflang implementation. Provide prioritized improvement list.
</Task>
```

### Performance Issues
```
<Task>
subagent_type: nextjs-static-export-optimizer
prompt: First load JS is 150KB, target < 100KB. Analyze bundle, identify optimization opportunities, implement code splitting and tree-shaking.
</Task>
```

---

## Best Practices

### 1. Be Specific
❌ "Add a calculator"
✅ "Design mortgage calculator with PITI breakdown following loan calculator pattern"

### 2. Provide Context
Always mention:
- Reference implementation (loan calculator)
- Constraints (6 languages, static export)
- Expected deliverables

### 3. Use Parallel When Possible
- Research + Design → Same time
- SEO + Content → Same time
- Implementation + Validation → Same time

### 4. Sequential for Dependencies
- Research → THEN Implementation
- Implementation → THEN Optimization
- Types → THEN Validation

### 5. Reference Existing Patterns
Mention loan calculator as reference for:
- File structure
- Type definitions
- Calculation patterns
- Component architecture
- SEO implementation

---

## Agent Combinations

| Task | Agents | Order |
|------|--------|-------|
| New calculator | market-researcher + architect → i18n → seo + content → optimizer | Sequential phases |
| Optimize existing | seo + optimizer (+ content if needed) | Parallel |
| Translation expansion | i18n + content + seo | Sequential |
| Fix build | optimizer (+ architect if code refactor needed) | Sequential |
| Validate accuracy | validation-expert + market-researcher | Parallel |

---

**For detailed agent capabilities, see `.claude/agents/*.md`**
**For calculator development guide, see `CALCULATOR_GUIDE.md`**
