// Shapes follow the prototype mock data; the backend REST API should return the same fields.

export type VerificationStatus = 'approved' | 'pending' | 'rejected' | 'none'
export type ListingStatus = 'listed' | 'draft' | 'hidden'
export type BookingStatus = 'pending' | 'confirmed' | 'arrived' | 'checkedin' | 'completed' | 'rejected' | 'cancelled'
export type UserRole = 'Camper' | 'Owner' | 'Administrator'

export interface Campsite {
  id: string
  name: string
  prov: string
  addr: string
  ownerId: string
  owner: string
  price: number
  cap: number
  rating: number
  nrev: number
  clean: number
  infra: number
  ver: VerificationStatus
  listing: ListingStatus
  active: boolean
  cat: string
  area: string
  hue: string
  since: string
  desc: string
  fac: string[]
  srv: string[]
  acc: string[]
  lat: number
  lng: number
  district: string
  zoom: number
  near: string[]
  /** [name, description, price per night] */
  stay: [string, string, number][]
}

export interface UnregisteredSpot {
  id: string
  name: string
  prov: string
  addr: string
  lat: number
  lng: number
  info: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  joined: string
  st: 'Active' | 'Suspended'
  seen: string
  color: string
}

export interface Booking {
  id: string
  ref: string
  siteId: string
  camperId: string
  from: string
  to: string
  guests: number
  status: BookingStatus
  created: string
  arrival: string
  gear: string
  note: string
  arrived: boolean
  checkedIn: boolean
  checkedOut: boolean
  reviewed: boolean
  reason?: string
}

export interface Review {
  id: string
  bookingId: string
  siteId: string
  userId: string
  rating: number
  clean: number
  infra: number
  date: string
  status: 'visible' | 'hidden'
  flagged: boolean
  text: string
}

export interface Report {
  id: string
  ref: string
  siteId: string
  userId: string
  cat: string
  date: string
  status: 'pending' | 'info' | 'resolved' | 'rejected'
  file: string
  text: string
  reply: string
}

export interface VerificationDoc {
  name: string
  ext: string
  meta: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface VerificationRequest {
  id: string
  siteId: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string
  docs: VerificationDoc[]
}

export interface Announcement {
  id: string
  title: string
  aud: string
  date: string
  status: 'published' | 'draft'
  body: string
}

export interface DemoCredential {
  role: 'camper' | 'owner' | 'admin'
  name: string
  ab: string
  email: string
  pw: string
  /** prototype page key of the role's dashboard */
  page: string
  note: string
  dash: string
  bg: string
  fg: string
}

/** Campsite plus values the API computes (rating from visible reviews, places left for the searched dates). */
export interface CampsiteSummary extends Campsite {
  placesLeft: number
}

export interface MapPoint {
  id: string
  name: string
  addr: string
  prov: string
  lat: number
  lng: number
  hue: string
  kind: 'v' | 'p' | 'u'
  registered: boolean
  info: string
  ver: VerificationStatus | 'unregistered'
}

/** Booking as the API returns it: joined campsite/camper info plus the actions the current user may take. */
export interface BookingView extends Booking {
  site: Pick<Campsite, 'id' | 'name' | 'addr' | 'prov' | 'hue' | 'ver' | 'owner' | 'price' | 'cap' | 'rating'>
  ownerPhone: string
  camper: Pick<User, 'id' | 'name' | 'phone' | 'email'> & { completedStays: number }
  nights: number
  total: number
  actions: { cancel: boolean; arrive: boolean; checkout: boolean; review: boolean; rebook: boolean; checkin: boolean; complete: boolean }
}

export interface TimelineStep {
  title: string
  note: string
  state: 'done' | 'current' | 'todo'
}

export interface CalendarDay {
  date: string
  day: number
  cap: number
  booked: number
  left: number
  closed: boolean
  past: boolean
  kind: 'free' | 'part' | 'full' | 'off'
}
