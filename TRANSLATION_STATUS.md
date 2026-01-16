# Time & Date Calculator Translations Status

## Overview
Creating comprehensive translation files for 6 Time & Date calculators across 6 languages (36 files total).

## Calculators
1. **age** - Age Calculator
2. **date-calculator** - Date Calculator
3. **time-duration** - Time Duration Calculator
4. **business-days** - Business Days Calculator
5. **birthday** - Birthday Calculator
6. **week-number** - Week Number Calculator

## Translation Progress

### English (en) - ✅ COMPLETE
- [x] age.json
- [x] date-calculator.json
- [x] time-duration.json
- [x] business-days.json
- [x] birthday.json
- [x] week-number.json

### Spanish (es) - ✅ COMPLETE
- [x] age.json
- [x] date-calculator.json
- [x] time-duration.json
- [x] business-days.json
- [x] birthday.json
- [x] week-number.json

### French (fr) - ⏳ IN PROGRESS
- [x] age.json
- [x] date-calculator.json
- [ ] time-duration.json
- [ ] business-days.json
- [ ] birthday.json
- [ ] week-number.json

### German (de) - ⏳ PENDING
- [ ] age.json
- [ ] date-calculator.json
- [ ] time-duration.json
- [ ] business-days.json
- [ ] birthday.json
- [ ] week-number.json

### Portuguese (pt) - ⏳ PENDING
- [ ] age.json
- [ ] date-calculator.json
- [ ] time-duration.json
- [ ] business-days.json
- [ ] birthday.json
- [ ] week-number.json

### Italian (it) - ⏳ PENDING
- [ ] age.json
- [ ] date-calculator.json
- [ ] time-duration.json
- [ ] business-days.json
- [ ] birthday.json
- [ ] week-number.json

## Required Translation Keys

Each calculator must include:
- `title`, `description`
- `meta` (title, description, keywords - meta title < 60 chars)
- `inputs`, `actions`, `results`
- `validation` messages
- `seo` section with:
  - `whatIsTitle`, `whatIsContent`
  - `howItWorksTitle`, `howItWorksContent`
  - `features` (4 items with title/description)
  - `useCases` (4 items with title/description)
  - `tips` (4 items with title/description)
  - `howToUseTitle`, `howToStepName1-5`, `howToUseStep1-5`
  - `faqTitle`, `faq1-8` (question and answer pairs)
- `disclaimer` section (text and note)

### Calculator-Specific Keys

**Age Calculator:**
- `zodiacSigns` (aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces)
- `generations` (silent, babyBoomer, genX, millennial, genZ, genAlpha)
- `daysOfWeek` (sunday-saturday)

**Date Calculator:**
- `modes` (difference, addSubtract)
- `operations` (add, subtract)

**Time Duration Calculator:**
- `crossesMidnight` toggle
- `decimalHours` for payroll

**Business Days Calculator:**
- `excludeWeekends`, `excludeHolidays` toggles
- `calendarDays`, `weekendDays`, `holidaysExcluded` results

**Birthday Calculator:**
- `daysOfWeek`, `upcomingMilestones`, `totalDaysLived`
- Milestone definitions (10th, 13th, 16th, 18th, 21st, 25th, 30th, 40th, 50th, 60th, 65th, 70th, 75th, 80th, 90th, 100th)

**Week Number Calculator:**
- `isoYear`, `dayOfYear`, `quarter`, `weekRange`
- `daysOfWeek` (monday-sunday)

## Translation Guidelines

1. **Meta titles** must be under 60 characters
2. Use **native-sounding translations**, not literal word-for-word
3. Include **descriptive HowTo step names** (not generic "Step 1", "Step 2")
4. Adapt **terminology** to local standards (APR vs TAN/TAE)
5. Use appropriate **cultural references** and examples
6. Maintain exact **JSON structure** across all languages

## Files Created So Far

```
src/messages/
├── en/calculators/time-date/
│   ├── age.json ✅
│   ├── date-calculator.json ✅
│   ├── time-duration.json ✅
│   ├── business-days.json ✅
│   ├── birthday.json ✅
│   └── week-number.json ✅
├── es/calculators/time-date/
│   ├── age.json ✅
│   ├── date-calculator.json ✅
│   ├── time-duration.json ✅
│   ├── business-days.json ✅
│   ├── birthday.json ✅
│   └── week-number.json ✅
├── fr/calculators/time-date/
│   ├── age.json ✅
│   └── date-calculator.json ✅
├── de/calculators/time-date/ (pending)
├── pt/calculators/time-date/ (pending)
└── it/calculators/time-date/ (pending)
```

## Next Steps

1. Complete remaining French translations (4 files)
2. Create all German translations (6 files)
3. Create all Portuguese translations (6 files)
4. Create all Italian translations (6 files)
5. Run translation validation: `npm run validate:translations`
6. Test all calculators in dev server across all 6 locales
7. Update registry files if needed

## Validation

After all translations are complete, run:
```bash
npm run validate:translations
```

This will verify:
- All locale folders exist
- All required files present
- No missing keys (compared to English)
- No extra keys (not in English)
- Structural consistency
- Proper JSON syntax
