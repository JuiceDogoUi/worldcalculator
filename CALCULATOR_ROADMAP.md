# World Calculator - Calculator Roadmap

## Current State

| Category | Calculators | Count |
|----------|-------------|-------|
| Finance | Loan, Mortgage | 2/5 |
| Math | Percentage | 1/5 |

**Goal:** 5 calculators per category

---

## Finance Category (Need 3 More)

### 1. Compound Interest Calculator
**Priority:** P1 - HIGHEST

| Attribute | Details |
|-----------|---------|
| Keywords | "compound interest calculator", "savings calculator", "interest calculator" |
| Search Volume | Very High (investor.gov calls it their "most popular quiz") |
| Complexity | Medium |
| User Need | Calculate how savings/investments grow over time |

**Features:**
- [ ] Principal amount input
- [ ] Interest rate (annual)
- [ ] Compounding frequency (daily, monthly, quarterly, annually)
- [ ] Time period (years/months)
- [ ] Optional: Regular contributions
- [ ] Growth chart visualization
- [ ] Breakdown: Principal vs Interest earned

**Formula:** `A = P(1 + r/n)^(nt)`

---

### 2. Savings Goal Calculator
**Priority:** P2 - HIGH

| Attribute | Details |
|-----------|---------|
| Keywords | "savings goal calculator", "how much to save", "savings calculator" |
| Search Volume | High (especially January - New Year resolutions) |
| Complexity | Medium |
| User Need | Calculate monthly savings needed to reach a goal |

**Features:**
- [ ] Target amount (goal)
- [ ] Current savings
- [ ] Time to reach goal
- [ ] Expected interest rate
- [ ] Two modes: "How long?" vs "How much per month?"
- [ ] Progress visualization
- [ ] Milestone breakdown

---

### 3. ROI Calculator (Return on Investment)
**Priority:** P3 - HIGH

| Attribute | Details |
|-----------|---------|
| Keywords | "ROI calculator", "return on investment", "investment return calculator" |
| Search Volume | High (steady year-round) |
| Complexity | Easy |
| User Need | Calculate investment profitability |

**Features:**
- [ ] Initial investment
- [ ] Final value (or gain amount)
- [ ] Investment period (optional, for annualized ROI)
- [ ] ROI percentage result
- [ ] Dollar return result
- [ ] Comparison mode (multiple investments)

**Formula:** `ROI = ((Final Value - Initial Value) / Initial Value) × 100`

---

## Math Category (Need 4 More)

### 1. Fraction Calculator
**Priority:** P1 - HIGHEST

| Attribute | Details |
|-----------|---------|
| Keywords | "fraction calculator", "add fractions", "simplify fractions" |
| Search Volume | Very High (essential for students) |
| Complexity | Medium |
| User Need | Perform operations on fractions |

**Features:**
- [ ] Four operations: Add, Subtract, Multiply, Divide
- [ ] Proper fractions, improper fractions, mixed numbers
- [ ] Auto-simplification of results
- [ ] Step-by-step explanation
- [ ] Visual fraction representation
- [ ] Convert between mixed/improper

**Operations:**
- Addition: Find LCM, convert, add numerators
- Subtraction: Find LCM, convert, subtract numerators
- Multiplication: Multiply numerators and denominators
- Division: Multiply by reciprocal

---

### 2. Standard Deviation Calculator
**Priority:** P2 - HIGH

| Attribute | Details |
|-----------|---------|
| Keywords | "standard deviation calculator", "variance calculator", "statistics calculator" |
| Search Volume | High (academic + professional) |
| Complexity | Medium |
| User Need | Calculate descriptive statistics for data sets |

**Features:**
- [ ] Input: Comma or space-separated numbers
- [ ] Population standard deviation (σ)
- [ ] Sample standard deviation (s)
- [ ] Variance (σ² and s²)
- [ ] Mean, Median, Mode
- [ ] Range, Min, Max
- [ ] Count (n)
- [ ] Step-by-step calculation
- [ ] Formula display

**Formulas:**
- Population: `σ = √(Σ(x - μ)² / N)`
- Sample: `s = √(Σ(x - x̄)² / (n-1))`

---

### 3. GCD/LCM Calculator
**Priority:** P3 - HIGH

| Attribute | Details |
|-----------|---------|
| Keywords | "GCD calculator", "LCM calculator", "greatest common divisor", "least common multiple" |
| Search Volume | High (essential for math students) |
| Complexity | Medium |
| User Need | Find GCD and LCM for multiple numbers |

**Features:**
- [ ] Input: 2-6 integers
- [ ] Calculate GCD (Greatest Common Divisor)
- [ ] Calculate LCM (Least Common Multiple)
- [ ] Show prime factorization
- [ ] Step-by-step Euclidean algorithm
- [ ] Educational explanation

**Methods:**
- Prime Factorization method
- Euclidean Algorithm (for GCD)
- LCM = (a × b) / GCD(a, b)

---

### 4. Scientific Calculator
**Priority:** P4 - MEDIUM-HIGH

| Attribute | Details |
|-----------|---------|
| Keywords | "scientific calculator", "online calculator", "calculator with sin cos tan" |
| Search Volume | Very High (students forget physical calculators) |
| Complexity | Hard |
| User Need | Advanced math functions without physical calculator |

**Features:**
- [ ] Basic operations (+, -, ×, ÷)
- [ ] Trigonometric: sin, cos, tan (and inverses)
- [ ] Logarithms: log, ln
- [ ] Exponents: x², x³, xʸ, √, ³√
- [ ] Constants: π, e
- [ ] Factorial: n!
- [ ] Parentheses and order of operations
- [ ] Degree/Radian toggle
- [ ] Memory functions (M+, M-, MR, MC)
- [ ] History of calculations

---

## Implementation Priority Matrix

| # | Calculator | Category | Complexity | Priority | Status |
|---|------------|----------|------------|----------|--------|
| 1 | Compound Interest | Finance | Medium | P1 | Pending |
| 2 | Fraction | Math | Medium | P1 | Pending |
| 3 | Savings Goal | Finance | Medium | P2 | Pending |
| 4 | Standard Deviation | Math | Medium | P2 | Pending |
| 5 | ROI | Finance | Easy | P3 | Pending |
| 6 | GCD/LCM | Math | Medium | P3 | Pending |
| 7 | Scientific | Math | Hard | P4 | Pending |

---

## Suggested Build Order

### Week 1-2
1. **Compound Interest Calculator** - Highest ROI, fundamental finance tool
2. **Fraction Calculator** - Essential student tool, high volume

### Week 3-4
3. **Savings Goal Calculator** - Complements compound interest
4. **Standard Deviation Calculator** - Academic and professional demand

### Week 5-6
5. **ROI Calculator** - Quick win, easy implementation
6. **GCD/LCM Calculator** - Academic demand, moderate complexity

### Future
7. **Scientific Calculator** - High complexity but very high volume

---

## SEO Requirements (Per Calculator)

Each calculator must include:

- [ ] Meta title, description, keywords (all 6 languages)
- [ ] 8-10 FAQs with detailed answers
- [ ] 5-step HowTo guide
- [ ] JSON-LD structured data (SoftwareApplication, FAQ, HowTo, Breadcrumb)
- [ ] Educational content explaining the concept
- [ ] Formula explanations with examples
- [ ] Related calculators cross-links

---

## Competitive Landscape

| Site | Monthly Visits | Calculators | Strength |
|------|---------------|-------------|----------|
| calculator.net | 29M | ~200 | SEO authority, simple UI |
| omnicalculator.com | 10M+ | 3,776 | Massive library, explanations |
| calculatorsoup.com | 5M+ | ~150 | Step-by-step solutions |

**Our Differentiators:**
1. Multi-language (6 languages from day 1)
2. Modern UI/UX with mobile-first design
3. Comprehensive educational content
4. Fast, static-generated pages
5. Accessibility-focused

---

## Success Metrics

Track for each calculator:

| Metric | Target (3 months) |
|--------|-------------------|
| Monthly organic visits | 1,000+ |
| Google ranking | Page 1 (top 10) |
| Avg. time on page | > 2 minutes |
| Bounce rate | < 60% |
| Return visitors | > 15% |

---

## Notes

- All calculators should follow the existing architecture pattern (see `src/features/`)
- Use centralized formatters from `@/lib/formatters.ts`
- Implement Zod validation for all inputs
- Include step-by-step explanations where applicable
- Charts/visualizations boost engagement significantly

---

*Last updated: 2024-12-29*
