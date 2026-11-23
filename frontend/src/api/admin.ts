// Mock implementation. Backend team: replace with api<T>('/admin/...') from ./client.
import { ANNS, REPORTS, REVIEWS, VERS, campsites } from '../mocks/data'
import { bookings, rating, site, user, users } from '../mocks/derive'
import type { User } from '../types/models'
import { addDays } from '../utils/format'

function activity(u: User) {
  if (u.role === 'Camper') return `${bookings.filter((b) => b.camperId === u.id).length} bookings`
  if (u.role === 'Owner') return `${campsites.filter((s) => s.ownerId === u.id).length} campsites`
  return 'Platform administration'
}

export async function getAdminDashboard() {
  const vers = VERS()
  const reports = REPORTS()
  const pendVer = vers.filter((v) => v.status === 'pending')
  const openRep = reports.filter((r) => r.status === 'pending' || r.status === 'info')
  const statusDefs = [['pending', 'Pending', '#8F4F12'], ['confirmed', 'Confirmed', '#1A587F'], ['completed', 'Completed', '#17703F'], ['cancelled', 'Cancelled', '#6B7A72'], ['rejected', 'Rejected', '#A8231C']]
  return {
    users: users.length,
    campers: users.filter((u) => u.role === 'Camper').length,
    owners: users.filter((u) => u.role === 'Owner').length,
    sites: campsites.length,
    approved: campsites.filter((s) => s.ver === 'approved').length,
    pendingVerifications: pendVer.length,
    openReports: openRep.length,
    flaggedReviews: REVIEWS().filter((r) => r.flagged).length,
    draftAnnouncements: ANNS().filter((a) => a.status === 'draft').length,
    oldestVerification: pendVer[0] ? { date: pendVer[0].date, site: site(pendVer[0].siteId).name } : null,
    latestReport: openRep[0] ? { cat: openRep[0].cat, site: site(openRep[0].siteId).name } : null,
    chart: [['Jun', 38], ['Jul', 52], ['Aug', 31], ['Sep', 44], ['Oct', 57], ['Nov', 63]] as [string, number][],
    bookingStatus: statusDefs.map(([key, label, color]) => {
      const n = bookings.filter((b) => (key === 'confirmed' ? ['confirmed', 'arrived', 'checkedin'].includes(b.status) : b.status === key)).length
      return { label, color, n, pct: Math.round((n / Math.max(1, bookings.length)) * 100) }
    }),
    activity: [
      { text: `Verification submitted · ${site('s9').name}`, when: addDays(-2), state: 'current' as const },
      { text: 'Report RP-2026-114 filed against Ke Ga Lighthouse Camp', when: addDays(-3), state: 'current' as const },
      { text: 'Review flagged on Pine Hill Camping', when: addDays(-5), state: 'todo' as const },
      { text: 'Long Hai Dune Camp verification rejected', when: addDays(-26), state: 'done' as const },
      { text: 'Announcement published: three-month activity confirmation', when: addDays(-20), state: 'done' as const },
      { text: '12 new camper accounts this week', when: addDays(-7), state: 'done' as const },
    ],
  }
}

export async function listUsers() {
  return users.map((u) => ({ ...u, activity: activity(u) }))
}

export async function listAllCampsites() {
  return campsites.map((s) => ({ ...s, ...rating(s.id) }))
}

export async function listVerificationRequests() {
  return VERS().map((v) => {
    const s = site(v.siteId)
    const owner = user(s.ownerId)
    return { ...v, siteName: s.name, prov: s.prov, ownerName: s.owner, ownerEmail: owner.email }
  })
}

export async function listReports() {
  return REPORTS().map((r) => {
    const s = site(r.siteId)
    const reporter = user(r.userId)
    return { ...r, siteName: s.name, owner: s.owner, reporter: reporter.name, reporterEmail: reporter.email }
  })
}

export async function listReviews() {
  return REVIEWS().map((r) => {
    const s = site(r.siteId)
    const author = user(r.userId)
    return { ...r, siteName: s.name, prov: s.prov, author: author.name, email: author.email, bookingRef: bookings.find((b) => b.id === r.bookingId)?.ref ?? 'archived booking' }
  })
}

export async function listAnnouncements() {
  return ANNS()
}
