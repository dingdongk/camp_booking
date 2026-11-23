// Mock implementation. Backend team: replace with api<T>('/bookings'), api<T>('/me/bookings') ... from ./client.
import { DEMO, REPORTS, REVIEWS } from '../mocks/data'
import { bookingTimeline, bookingView, bookings, minLeft, site, summary, user } from '../mocks/derive'
import type { BookingView } from '../types/models'
import { addDays, nightsBetween } from '../utils/format'
import { DEFAULT_SEARCH } from './campsites'

const mine = () => bookings.filter((b) => b.camperId === DEMO.camperId)
const byId = (id: string) => bookings.find((b) => b.id === id) ?? bookings[0]

/** Booking request form: campsite, availability for the default dates, camper contact details. */
export async function getBookingDraft(siteId: string) {
  const me = user(DEMO.camperId)
  return {
    site: summary(site(siteId), DEFAULT_SEARCH.from, DEFAULT_SEARCH.to),
    search: DEFAULT_SEARCH,
    contact: { name: me.name, phone: me.phone, email: me.email },
  }
}

export async function getBooking(id: string): Promise<BookingView> {
  return bookingView(byId(id))
}

export async function getBookingDetail(id: string) {
  const b = byId(id)
  return { booking: bookingView(b), timeline: bookingTimeline(b), placesLeft: minLeft(b.siteId, b.from, b.to, b.id) }
}

export async function listMyBookings(): Promise<BookingView[]> {
  return mine().sort((a, b) => (a.from < b.from ? 1 : -1)).map(bookingView)
}

export async function getCamperDashboard() {
  const all = mine()
  const upcoming = all.filter((b) => ['confirmed', 'arrived', 'checkedin'].includes(b.status))
  const completed = all.filter((b) => b.status === 'completed')
  const latest = [...all].sort((a, b) => (b.created < a.created ? -1 : 1))[0]
  return {
    upcoming: upcoming.map(bookingView),
    pending: all.filter((b) => b.status === 'pending').length,
    completed: completed.length,
    reviewable: completed.filter((b) => !b.reviewed).length,
    favorites: DEMO.favorites.map((id) => summary(site(id), DEFAULT_SEARCH.from, DEFAULT_SEARCH.to)),
    chart: [['Jun', 2], ['Jul', 4], ['Aug', 0], ['Sep', 3], ['Oct', 2], ['Nov', 4]] as [string, number][],
    total: all.length,
    nights: completed.reduce((n, b) => n + nightsBetween(b.from, b.to), 0),
    reviews: REVIEWS().filter((r) => r.userId === DEMO.camperId).length,
    reports: REPORTS().filter((r) => r.userId === DEMO.camperId).length,
    activity: [
      { text: `Booking request ${latest?.ref ?? ''} sent to ${latest ? site(latest.siteId).name : ''}`, when: addDays(-1), done: true },
      { text: 'Tuyen Lam Lakeside review published', when: addDays(-11), done: true },
      { text: 'Du Gia Mountain Camp stay completed', when: addDays(-38), done: true },
      { text: 'Saved Du Gia Mountain Camp to favorites', when: addDays(-39), done: false },
    ],
  }
}
