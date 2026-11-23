// Mock implementation. Backend team: replace with api<T>('/owner/...') from ./client.
import { ACCS, CATS, DEMO, FACS, OCCUPY, PROVS, VERS, campsites } from '../mocks/data'
import { bookedOn, bookingView, bookings, minLeft, monthDays, rating, site } from '../mocks/derive'
import type { BookingView } from '../types/models'
import { addDays, nightsBetween } from '../utils/format'

const mySites = () => campsites.filter((s) => s.ownerId === DEMO.ownerId)
const myBookings = () => {
  const ids = mySites().map((s) => s.id)
  return bookings.filter((b) => ids.includes(b.siteId))
}
const week = () => Array.from({ length: 7 }, (_, i) => addDays(i))
const bookedThisWeek = (siteId: string) => week().reduce((n, d) => n + bookedOn(siteId, d), 0)

export async function listMySiteOptions() {
  return mySites().map((s) => ({ id: s.id, name: s.name }))
}

export async function getOwnerDashboard() {
  const sites = mySites()
  const bks = myBookings()
  const today = addDays(0)
  const confirmed = bks.filter((b) => ['confirmed', 'arrived', 'checkedin'].includes(b.status))
  const totalCap = sites.reduce((n, s) => n + s.cap * 7, 0)
  const totalBooked = sites.reduce((n, s) => n + bookedThisWeek(s.id), 0)
  return {
    sites: sites.map((s) => ({
      ...s, ...rating(s.id),
      bookedWeek: bookedThisWeek(s.id),
      closedDates: (DEMO.closed[s.id] ?? []).length,
    })),
    pending: bks.filter((b) => b.status === 'pending').map((b) => ({ ...bookingView(b), placesLeft: minLeft(b.siteId, b.from, b.to, b.id) })),
    confirmedCount: confirmed.length,
    guestsExpected: confirmed.reduce((n, b) => n + b.guests, 0),
    occupancyPct: totalCap ? Math.round((totalBooked / totalCap) * 100) : 0,
    arrivals: confirmed.filter((b) => b.from >= today && b.from <= addDays(14)).sort((a, b) => (a.from < b.from ? -1 : 1)).slice(0, 4).map(bookingView),
    chart: [['Jun', 11], ['Jul', 18], ['Aug', 9], ['Sep', 14], ['Oct', 16], ['Nov', 21]] as [string, number][],
    activity: [...bks].sort((a, b) => (a.created < b.created ? 1 : -1)).slice(0, 5).map(bookingView),
  }
}

export async function listOwnerCampsites() {
  const today = addDays(0)
  return {
    sites: mySites().map((s) => ({ ...s, bookedTonight: bookedOn(s.id, today) })),
    confirmedCount: myBookings().filter((b) => ['confirmed', 'arrived', 'checkedin'].includes(b.status)).length,
    lastConfirmed: addDays(-62),
  }
}

export async function getCampsiteForm(id?: string) {
  const s = id ? site(id) : null
  return {
    site: s,
    docs: s ? (VERS().find((v) => v.siteId === s.id)?.docs ?? []) : [],
    options: { provinces: PROVS, facilities: FACS, accessibility: ACCS, categories: CATS },
  }
}

export async function getOwnerAvailability(siteId: string | null, month: string) {
  const sites = mySites()
  const s = sites.find((x) => x.id === siteId) ?? sites[0]
  const days = monthDays(s.id, month)
  return {
    sites: sites.map((x) => ({ id: x.id, name: x.name })),
    site: { id: s.id, name: s.name, cap: s.cap },
    days,
    closedCount: (DEMO.closed[s.id] ?? []).length,
    /** bookings holding capacity at this campsite (the page shows those on the selected date) */
    bookings: bookings.filter((b) => b.siteId === s.id && OCCUPY[b.status]).map(bookingView),
  }
}

export async function listOwnerBookings(): Promise<BookingView[]> {
  return myBookings().sort((a, b) => (a.from < b.from ? -1 : 1)).map(bookingView)
}

/** Bookings within three days of `date` (or spanning it) for the check-in desk. */
export async function getCheckinDesk(date: string) {
  const near = (from: string, to: string) =>
    Math.min(Math.abs(nightsBetween(from, date) || nightsBetween(date, from)), Math.abs(nightsBetween(to, date) || nightsBetween(date, to))) <= 3 ||
    (date >= from && date < to)
  return {
    siteCount: mySites().length,
    bookings: myBookings().filter((b) => ['confirmed', 'arrived', 'checkedin', 'completed'].includes(b.status) && near(b.from, b.to)).map(bookingView),
  }
}

export async function getVerification(siteId: string | null) {
  const sites = mySites()
  const s = sites.find((x) => x.id === siteId) ?? sites[0]
  return {
    sites: sites.map((x) => ({ id: x.id, name: x.name })),
    site: { id: s.id, name: s.name },
    request: VERS().find((v) => v.siteId === s.id) ?? null,
    nextReconfirmation: addDays(28),
  }
}

export async function getOwnerSiteCount() {
  return mySites().length
}
