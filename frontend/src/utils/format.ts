const DAY = 86400000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Date n days from today as YYYY-MM-DD (noon avoids timezone day shifts). */
export function addDays(n: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  return iso(new Date(d.getTime() + n * DAY))
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

export function fmtDate(s?: string): string {
  if (!s) return '--'
  const d = parseDate(s)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function nightsBetween(a?: string, b?: string): number {
  if (!a || !b) return 0
  return Math.max(0, Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / DAY))
}

export function vnd(n: number): string {
  return `${Number(n || 0).toLocaleString('en-US')} ₫`
}

export function initials(s: string): string {
  const p = s.trim().split(/\s+/)
  return (p[0]?.[0] ?? '') + (p[p.length - 1]?.[0] ?? '')
}

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** 'YYYY-MM' of the current month */
export function currentMonth(): string {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}

export function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + by, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Empty cells before day 1 so the month grid starts on Monday. */
export function leadingBlanks(month: string): number {
  const [y, m] = month.split('-').map(Number)
  return (new Date(y, m - 1, 1).getDay() + 6) % 7
}

export function monthTitle(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}
