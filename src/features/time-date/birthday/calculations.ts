import type { BirthdayInputs, BirthdayResult, BirthdayMilestone, BirthdayValidation } from './types'

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const MILESTONE_AGES = [18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 90, 100]

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function validateBirthdayInputs(inputs: Partial<BirthdayInputs>): BirthdayValidation {
  const errors: BirthdayValidation['errors'] = []
  if (!inputs.birthDate) {
    errors.push({ field: 'birthDate', message: 'validation.birthDateRequired' })
  } else if (inputs.birthDate > new Date()) {
    errors.push({ field: 'birthDate', message: 'validation.birthDateFuture' })
  }
  return { valid: errors.length === 0, errors }
}

export function calculateBirthday(inputs: BirthdayInputs): BirthdayResult | null {
  if (!inputs.birthDate) return null

  const now = new Date()
  const birthDate = inputs.birthDate
  const currentYear = now.getFullYear()
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()

  // Calculate next birthday
  let nextBirthday = new Date(currentYear, birthMonth, birthDay)
  if (birthMonth === 1 && birthDay === 29 && !isLeapYear(currentYear)) {
    nextBirthday = new Date(currentYear, 1, 28)
  }

  // Check if birthday is today
  const isBirthdayToday =
    now.getMonth() === birthMonth && now.getDate() === birthDay

  // If birthday has passed, use next year
  if (nextBirthday < now && !isBirthdayToday) {
    const nextYear = currentYear + 1
    nextBirthday = new Date(nextYear, birthMonth, birthDay)
    if (birthMonth === 1 && birthDay === 29 && !isLeapYear(nextYear)) {
      nextBirthday = new Date(nextYear, 1, 28)
    }
  }

  const diffMs = nextBirthday.getTime() - now.getTime()
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const hoursUntil = Math.ceil(diffMs / (1000 * 60 * 60))
  const minutesUntil = Math.ceil(diffMs / (1000 * 60))
  const nextAge = nextBirthday.getFullYear() - birthDate.getFullYear()

  const totalDaysLived = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate upcoming milestones
  const currentAge = now.getFullYear() - birthDate.getFullYear() -
    (now < new Date(now.getFullYear(), birthMonth, birthDay) ? 1 : 0)

  const upcomingMilestones: BirthdayMilestone[] = MILESTONE_AGES
    .filter(age => age > currentAge)
    .slice(0, 5)
    .map(age => {
      const year = birthDate.getFullYear() + age
      let date = new Date(year, birthMonth, birthDay)
      if (birthMonth === 1 && birthDay === 29 && !isLeapYear(year)) {
        date = new Date(year, 1, 28)
      }
      return {
        age,
        date,
        dayOfWeek: DAYS_OF_WEEK[date.getDay()],
        isPast: date < now,
      }
    })

  return {
    birthDate,
    nextBirthday,
    daysUntil: isBirthdayToday ? 0 : daysUntil,
    hoursUntil: isBirthdayToday ? 0 : hoursUntil,
    minutesUntil: isBirthdayToday ? 0 : minutesUntil,
    nextAge,
    dayOfWeekBorn: DAYS_OF_WEEK[birthDate.getDay()],
    nextBirthdayDayOfWeek: DAYS_OF_WEEK[nextBirthday.getDay()],
    totalDaysLived,
    isBirthdayToday,
    upcomingMilestones,
  }
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(date)
}

export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}
