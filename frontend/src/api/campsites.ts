// Mock implementation. Backend team: replace each body with api<T>('/campsites...') from ./client.
import { ACCS, CATS, DEMO, FACS, PROVS, REVIEWS, UNREG, USERS, campsites } from '../mocks/data'
import { monthDays, rating, site, summary } from '../mocks/derive'
import type { CampsiteSummary, MapPoint } from '../types/models'
import { addDays } from '../utils/format'

export interface SearchParams {
  from: string
  to: string
  guests: number
}

export const DEFAULT_SEARCH: SearchParams = { from: addDays(6), to: addDays(8), guests: 4 }

const listed = () => campsites.filter((s) => s.listing === 'listed')

export async function getFilterOptions() {
  return { provinces: PROVS, facilities: FACS, accessibility: ACCS, categories: CATS }
}

export async function listCampsites(p: SearchParams = DEFAULT_SEARCH): Promise<CampsiteSummary[]> {
  return listed()
    .map((s) => summary(s, p.from, p.to))
    .sort((a, b) => Number(b.ver === 'approved') - Number(a.ver === 'approved') || b.rating - a.rating)
}

export async function getHome() {
  const p = DEFAULT_SEARCH
  const users = USERS()
  const all = listed().map((s) => summary(s, p.from, p.to))
  const testimonials = REVIEWS()
    .filter((r) => r.status === 'visible' && r.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((r) => ({ ...r, author: users.find((u) => u.id === r.userId)?.name ?? '', siteName: site(r.siteId).name }))
  return {
    featured: [...all].sort((a, b) => b.rating - a.rating).slice(0, 3),
    recommended: all.filter((s) => !DEMO.favorites.includes(s.id)).slice(0, 3),
    destinations: PROVS.map((name) => ({ name, count: campsites.filter((s) => s.prov === name).length })),
    testimonials,
    siteCount: all.length,
    provCount: PROVS.length,
  }
}

export async function getCampsiteDetail(id: string, month: string, p: SearchParams = DEFAULT_SEARCH) {
  const s = summary(site(id), p.from, p.to)
  const users = USERS()
  const owner = users.find((u) => u.id === s.ownerId) ?? users[1]
  const similar = listed()
    .filter((x) => x.id !== s.id && (x.cat === s.cat || x.prov === s.prov))
    .sort((a, b) => {
      const ka = (a.cat === s.cat ? 2 : 0) + (a.prov === s.prov ? 1 : 0)
      const kb = (b.cat === s.cat ? 2 : 0) + (b.prov === s.prov ? 1 : 0)
      return kb - ka || b.rating - a.rating
    })
    .slice(0, 4)
    .map((x) => summary(x, p.from, p.to))
  const reviews = REVIEWS()
    .filter((r) => r.siteId === s.id && r.status === 'visible')
    .map((r) => ({ ...r, author: users.find((u) => u.id === r.userId)?.name ?? '' }))
  return {
    site: s,
    owner: { name: owner.name, joined: owner.joined, siteCount: campsites.filter((x) => x.ownerId === s.ownerId).length },
    reviews,
    similar,
    calendar: monthDays(s.id, month),
  }
}

export async function getMapPoints(): Promise<MapPoint[]> {
  const registered = campsites
    .filter((s) => s.listing !== 'draft')
    .map((s): MapPoint => ({
      id: s.id, name: s.name, addr: `${s.addr} · ${s.prov}`, prov: s.prov, lat: s.lat, lng: s.lng, hue: s.hue,
      kind: s.ver === 'approved' ? 'v' : 'p', registered: true, ver: s.ver,
      info: `${s.price.toLocaleString('en-US')} ₫ / night · up to ${s.cap} guests · ★ ${rating(s.id).rating.toFixed(1)}`,
    }))
  const spots = UNREG.map((u): MapPoint => ({
    ...u, hue: '#5E6B62', kind: 'u', registered: false, ver: 'unregistered',
  }))
  return [...registered, ...spots]
}
