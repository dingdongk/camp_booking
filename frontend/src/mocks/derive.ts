// Calculations the backend will own (ratings, capacity, calendar). Ported from the prototype
// so the mock API can return realistic values; delete together with src/mocks/.
import type { Booking, BookingView, CalendarDay, Campsite, CampsiteSummary, TimelineStep } from '../types/models'
import { addDays, fmtDate, iso, nightsBetween, parseDate } from '../utils/format'
import { BOOKINGS, DEMO, OCCUPY, REVIEWS, USERS, campsites } from './data'

const DAY = 86400000
export const bookings = BOOKINGS()
const reviews = REVIEWS()
export const users = USERS()

export function user(id: string) {
  return users.find((u) => u.id === id) ?? users[0]
}

export function site(id: string): Campsite {
  return campsites.find((s) => s.id === id) ?? campsites[0]
}

export function rating(siteId: string) {
  const base = site(siteId)
  const rs = reviews.filter((r) => r.siteId === siteId && r.status === 'visible')
  if (!rs.length) return { rating: base.rating, nrev: base.nrev, clean: base.clean, infra: base.infra }
  const avg = (k: 'rating' | 'clean' | 'infra') => Math.round((rs.reduce((n, r) => n + r[k], 0) / rs.length) * 10) / 10
  return { rating: avg('rating'), nrev: base.nrev, clean: avg('clean'), infra: avg('infra') }
}

export function isClosed(siteId: string, date: string) {
  return (DEMO.closed[siteId] ?? []).includes(date)
}

export function bookedOn(siteId: string, date: string) {
  return bookings.reduce((n, b) => {
    if (b.siteId !== siteId || !OCCUPY[b.status]) return n
    return date >= b.from && date < b.to ? n + b.guests : n
  }, 0)
}

function leftOn(siteId: string, date: string) {
  return isClosed(siteId, date) ? 0 : Math.max(0, site(siteId).cap - bookedOn(siteId, date))
}

export function minLeft(siteId: string, from: string, to: string, ignoreBookingId?: string) {
  const dates: string[] = []
  for (let d = parseDate(from); d < parseDate(to); d = new Date(d.getTime() + DAY)) dates.push(iso(d))
  if (!dates.length) return 0
  const ignored = bookings.find((b) => b.id === ignoreBookingId)
  return Math.min(...dates.map((d) => {
    const back = ignored && OCCUPY[ignored.status] && d >= ignored.from && d < ignored.to ? ignored.guests : 0
    return isClosed(siteId, d) ? 0 : leftOn(siteId, d) + back
  }))
}

/** Prototype booking rules (which buttons each side may see). */
export function bookingView(b: Booking): BookingView {
  const s = site(b.siteId)
  const c = user(b.camperId)
  const today = addDays(0)
  const nights = nightsBetween(b.from, b.to)
  return {
    ...b,
    site: { id: s.id, name: s.name, addr: s.addr, prov: s.prov, hue: s.hue, ver: s.ver, owner: s.owner, price: s.price, cap: s.cap, rating: rating(s.id).rating },
    ownerPhone: user(s.ownerId).phone,
    camper: { id: c.id, name: c.name, phone: c.phone, email: c.email, completedStays: bookings.filter((x) => x.camperId === c.id && x.status === 'completed').length },
    nights,
    total: nights * s.price,
    actions: {
      cancel: b.status === 'pending' || (b.status === 'confirmed' && parseDate(b.from).getTime() - Date.now() > DAY),
      arrive: b.status === 'confirmed' && b.from <= today && !b.arrived,
      checkout: b.status === 'checkedin' && !b.checkedOut,
      review: b.status === 'completed' && !b.reviewed,
      rebook: b.status === 'cancelled' || b.status === 'rejected',
      checkin: b.arrived && !b.checkedIn,
      complete: b.checkedIn && b.checkedOut && b.status !== 'completed',
    },
  }
}

export function bookingTimeline(b: Booking): TimelineStep[] {
  const owner = site(b.siteId).owner
  return [
    { title: 'Request submitted', note: `${fmtDate(b.created)} · ${b.guests} guests for ${nightsBetween(b.from, b.to)} nights`, state: 'done' },
    {
      title: b.status === 'rejected' ? 'Rejected by the owner' : b.status === 'cancelled' ? 'Cancelled by the camper' : 'Owner decision',
      note: b.status === 'pending' ? 'Waiting — capacity is held until the owner answers'
        : b.status === 'rejected' ? (b.reason || 'The owner could not take this booking.')
        : b.status === 'cancelled' ? 'Capacity was released back to the campsite'
        : `Confirmed · ${owner}`,
      state: b.status === 'pending' ? 'current' : 'done',
    },
    {
      title: 'Arrival and check-in',
      note: b.checkedIn ? 'Camper arrived and the owner confirmed check-in' : b.arrived ? 'Camper confirmed arrival — waiting for the owner' : `From ${fmtDate(b.from)}`,
      state: b.checkedIn ? 'done' : b.arrived ? 'current' : 'todo',
    },
    {
      title: 'Check-out and completion',
      note: b.status === 'completed' ? `Stay completed · ${b.reviewed ? 'reviewed' : 'review available'}` : b.checkedOut ? 'Camper confirmed check-out — owner to complete' : `After ${fmtDate(b.to)}`,
      state: b.status === 'completed' ? 'done' : b.checkedOut ? 'current' : 'todo',
    },
  ]
}

export function summary(s: Campsite, from: string, to: string): CampsiteSummary {
  return { ...s, ...rating(s.id), placesLeft: minLeft(s.id, from, to) }
}

/** month: 'YYYY-MM' */
export function monthDays(siteId: string, month: string): CalendarDay[] {
  const [y, m] = month.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  const today = addDays(0)
  const cap = site(siteId).cap
  return Array.from({ length: days }, (_, i) => {
    const date = iso(new Date(y, m - 1, i + 1, 12))
    const booked = bookedOn(siteId, date)
    const closed = isClosed(siteId, date)
    const past = date < today
    const left = closed ? 0 : Math.max(0, cap - booked)
    let kind: CalendarDay['kind'] = 'free'
    if (past || closed) kind = 'off'
    else if (left <= 0) kind = 'full'
    else if (booked / Math.max(1, cap) > 0.6) kind = 'part'
    return { date, day: i + 1, cap, booked, left, closed, past, kind }
  })
}
