// Mock implementation. Backend team: replace with api<T>('/me/favorites'), '/me/reviews', '/me/reports' from ./client.
import { DEMO, REPORTS, REVIEWS } from '../mocks/data'
import { bookingView, bookings, site, summary } from '../mocks/derive'
import { DEFAULT_SEARCH } from './campsites'

export async function getFavoriteIds(): Promise<string[]> {
  return [...DEMO.favorites]
}

export async function listFavorites() {
  return DEMO.favorites.map((id) => summary(site(id), DEFAULT_SEARCH.from, DEFAULT_SEARCH.to))
}

export async function listMyReviews() {
  const reviews = REVIEWS()
    .filter((r) => r.userId === DEMO.camperId)
    .map((r) => {
      const s = site(r.siteId)
      return { ...r, siteName: s.name, siteAddr: `${s.addr} · ${s.prov}`, bookingRef: bookings.find((b) => b.id === r.bookingId)?.ref ?? 'VC-archive' }
    })
  const awaiting = bookings
    .filter((b) => b.camperId === DEMO.camperId && b.status === 'completed' && !b.reviewed)
    .map(bookingView)
  return { reviews, awaiting }
}

export async function listMyReports() {
  return REPORTS()
    .filter((r) => r.userId === DEMO.camperId)
    .map((r) => ({ ...r, siteName: site(r.siteId).name }))
}
