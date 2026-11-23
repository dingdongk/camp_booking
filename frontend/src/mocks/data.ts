// Prototype mock data (planning/prototype/Main.dc.html). Only src/api/* may import this folder.
import type {
  Announcement, Booking, BookingStatus, Campsite, DemoCredential, Report, Review,
  UnregisteredSpot, User, VerificationRequest,
} from '../types/models'
import { addDays, fmtDate } from '../utils/format'

type GeoInfo = Pick<Campsite, 'lat' | 'lng' | 'district' | 'zoom' | 'near' | 'stay'>
type BaseCampsite = Omit<Campsite, keyof GeoInfo>

export const OCCUPY: Partial<Record<BookingStatus, 1>> = { pending: 1, confirmed: 1, arrived: 1, checkedin: 1 };
export const FACS = ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'BBQ area', 'Tent rental', 'Wi-Fi', 'Parking', 'Campfire area', 'On-site shop', 'Lifeguard on duty'];
export const ACCS = ['Vehicle access to pitch', 'Step-free washrooms', 'Family friendly', 'Wheelchair accessible path'];
export const PROVS = ['Lam Dong (Da Lat)', 'Ba Vi (Ha Noi)', 'Ninh Binh', 'Ha Giang', 'Quang Ninh', 'Da Nang', 'Vung Tau', 'Binh Thuan'];
export const CATS = ['Forest & mountain', 'Beachfront', 'Lakeside', 'Glamping', 'Family friendly'];
/* Demo credentials for the prototype only — no real authentication anywhere. */
export const CREDS: DemoCredential[] = [
  { role: 'camper', name: 'Camper', ab: 'CA', email: 'camper@camping.vn', pw: 'Camper123!', page: 'dash',
    note: 'Discover campsites, send booking requests, review completed stays.', dash: 'Camper dashboard',
    bg: '#EFE3D4', fg: '#7A5230' },
  { role: 'owner', name: 'Campsite owner', ab: 'OW', email: 'owner@camping.vn', pw: 'Owner123!', page: 'oDash',
    note: 'Manage campsites, availability, booking requests and verification.', dash: 'Owner dashboard',
    bg: '#DCEBE2', fg: '#13412E' },
  { role: 'admin', name: 'Administrator', ab: 'AD', email: 'admin@camping.vn', pw: 'Admin123!', page: 'aDash',
    note: 'Manage users, listings, verification, reports and announcements.', dash: 'Admin dashboard',
    bg: '#DEEAF2', fg: '#1A587F' }
];
export const DOWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* Real coordinates, districts, nearby landmarks and camping options per campsite.
   Kept separate from SITES() so the original records stay intact. */
export const GEO: Record<string, GeoInfo> = {
  s1: { lat: 11.8878, lng: 108.4075, district: 'Ward 3, Da Lat', zoom: 13,
    near: ['Tuyen Lam Lake pier · 1.2 km', 'Truc Lam Zen Monastery · 2.6 km', 'Robin Hill cable car · 4.1 km', 'Da Lat central market · 8.5 km'],
    stay: [['Own tent pitch', 'Flat grass platform, fire ring, picnic table', 650000], ['Rental dome tent (2 pax)', 'Mattress, bedding and lantern included', 980000], ['Group pitch (up to 12)', 'Large terrace with two fire rings', 1750000]] },
  s2: { lat: 11.8921, lng: 108.4162, district: 'Ward 4, Da Lat', zoom: 13,
    near: ['Tuyen Lam Lake pontoon · on site', 'Clay Tunnel · 3.4 km', 'Da Lat flower garden · 9.2 km'],
    stay: [['Lakeside pitch', 'Water’s edge, kayak slot included', 850000], ['Glamping bell tent', 'Real bed, rug, reading light', 1450000]] },
  s3: { lat: 10.4098, lng: 107.2089, district: 'Long Hai, Long Dat', zoom: 13,
    near: ['Dam Trau beach · on site', 'Long Hai fishing port · 2.8 km', 'Minh Dam war base · 6.5 km', 'Dinh Co temple · 7.9 km'],
    stay: [['Beach pitch', 'Behind the dune line, sea breeze', 550000], ['Rental tent (4 pax)', 'Tent, mats and cool box', 820000]] },
  s4: { lat: 20.2244, lng: 105.9345, district: 'Hoa Lu, Ninh Binh', zoom: 13,
    near: ['Tam Coc boat wharf · 1.6 km', 'Mua Cave steps · 3.2 km', 'Bich Dong pagoda · 4.8 km', 'Hoa Lu ancient capital · 9.4 km'],
    stay: [['Rice field pitch', 'Bicycles included, field views', 700000], ['Family pitch (up to 8)', 'Shaded corner beside the canal', 1250000]] },
  s5: { lat: 22.8686, lng: 105.1472, district: 'Yen Minh, Ha Giang', zoom: 12,
    near: ['Du Gia waterfall · 1.1 km', 'Du Gia village market · 2.0 km', 'Mau Due pass viewpoint · 14 km'],
    stay: [['Terrace pitch', 'Shared dinner at the long table', 450000], ['Rental tent + bedding', 'Thick quilts for cold nights', 690000]] },
  s6: { lat: 10.7064, lng: 107.9875, district: 'Ham Thuan Nam, Binh Thuan', zoom: 13,
    near: ['Ke Ga lighthouse · 0.9 km by boat', 'Tidal rock pools · on site', 'Thuan Quy beach · 5.3 km'],
    stay: [['Cape pitch', 'Rocky headland, sunrise over the sea', 600000]] },
  s7: { lat: 12.0231, lng: 108.5614, district: 'Lac Duong, Lam Dong', zoom: 12,
    near: ['Bidoup Nui Ba trailhead · at the gate', 'Lang Biang peak · 18 km', 'Da Nhim reservoir · 6.7 km'],
    stay: [['Safari tent (2 pax)', 'Beds, heater and hot breakfast', 950000], ['Safari tent (4 pax)', 'Two bedrooms, private deck', 1600000]] },
  s8: { lat: 10.3875, lng: 107.2334, district: 'Phuoc Hai, Long Dat', zoom: 13,
    near: ['Phuoc Hai fishing village · 1.4 km', 'Phuoc Hai dunes · on site', 'Ho Tram beach · 11 km'],
    stay: [['Dune pitch', 'Open sand terrace, kite friendly', 500000]] },
  s9: { lat: 20.2372, lng: 105.9412, district: 'Hoa Lu, Ninh Binh', zoom: 13,
    near: ['Mua Cave steps · 0.6 km', 'Tam Coc boat wharf · 2.9 km', 'Trang An landscape complex · 7.1 km'],
    stay: [['Paddy pitch', 'Between the fields, bicycles included', 620000], ['Rental tent (2 pax)', 'Tent, mats and breakfast pho', 880000]] },
  s10: { lat: 23.1316, lng: 105.4079, district: 'Meo Vac, Ha Giang', zoom: 12,
    near: ['Ma Pi Leng pass viewpoint · 7.5 km', 'Nho Que river boat pier · 1.0 km', 'Meo Vac market · 12 km'],
    stay: [['River bank pitch', 'Steep access track, porter available', 520000]] },
  s11: { lat: 21.0758, lng: 105.3661, district: 'Ba Vi, Ha Noi', zoom: 13,
    near: ['Ba Vi National Park gate · 2.2 km', 'French colonial ruins · 5.8 km', 'Khoang Xanh springs · 9.3 km', 'Suoi Hai lake · 12 km'],
    stay: [['Pine terrace pitch', 'Weekend escape 60 km from Ha Noi', 580000], ['Rental tent (4 pax)', 'Tent, mats, BBQ grill', 860000]] },
  s12: { lat: 16.1142, lng: 108.2967, district: 'Son Tra, Da Nang', zoom: 13,
    near: ['Son Tra peninsula road · on site', 'Ban Co peak · 4.4 km', 'Bai But beach · 3.1 km', 'Linh Ung pagoda · 6.0 km'],
    stay: [['Forest pitch', 'Monkey-proof lockers provided', 720000], ['Sea view pitch', 'Cliff edge terrace, 6 pitches only', 950000]] },
  s13: { lat: 20.9951, lng: 107.4536, district: 'Van Don, Quang Ninh', zoom: 12,
    near: ['Bai Tu Long bay pier · 1.8 km', 'Cong Do island · boat 40 min', 'Van Don beach · 2.5 km'],
    stay: [['Bay view pitch', 'Limestone islands on the horizon', 780000], ['Rental tent (2 pax)', 'Tent, mats, kayak slot', 1050000]] }
};
export function EXTRA(): BaseCampsite[] {
  return [
    { id: 's11', name: 'Ba Vi Pine Camp', prov: 'Ba Vi (Ha Noi)', addr: 'Yen Bai commune, Ba Vi, Ha Noi', ownerId: 'o6', owner: 'Ba Vi Outdoor Club', price: 580000, cap: 55, rating: 4.5, nrev: 88, clean: 4.5, infra: 4.4, ver: 'approved', listing: 'listed', active: true, cat: 'Forest & mountain', area: '2.8 ha', hue: '#35603F', since: 'May 2025',
      desc: 'Pine terraces on the eastern slope of Ba Vi, an hour and a half from central Ha Noi.\nThe camp fills every Saturday in autumn; weekdays are empty and the fog sits in the valley until mid morning.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'BBQ area', 'Tent rental', 'Parking', 'Campfire area', 'On-site shop'], srv: ['BBQ sets', 'Firewood delivery', 'Shuttle from Ba Vi gate'], acc: ['Vehicle access to pitch', 'Step-free washrooms', 'Family friendly'] },
    { id: 's12', name: 'Son Tra Forest Camp', prov: 'Da Nang', addr: 'Son Tra peninsula, Tho Quang, Da Nang', ownerId: 'o7', owner: 'Son Tra Eco Camping', price: 720000, cap: 40, rating: 4.7, nrev: 64, clean: 4.7, infra: 4.6, ver: 'approved', listing: 'listed', active: true, cat: 'Forest & mountain', area: '1.5 ha', hue: '#246B4F', since: 'Mar 2026',
      desc: 'A permitted clearing inside the Son Tra nature reserve, with the bay on one side and the forest on the other.\nRed-shanked douc langurs pass through at dawn; food must stay in the lockers provided.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'Wi-Fi', 'Parking', 'Campfire area'], srv: ['Guided wildlife walk', 'Breakfast mi quang', 'Lockers'], acc: ['Vehicle access to pitch', 'Step-free washrooms'] },
    { id: 's13', name: 'Bai Tu Long Bay Camp', prov: 'Quang Ninh', addr: 'Hai Long, Van Don, Quang Ninh', ownerId: 'o8', owner: 'Van Don Bay Camping', price: 780000, cap: 35, rating: 4.4, nrev: 41, clean: 4.3, infra: 4.2, ver: 'pending', listing: 'listed', active: true, cat: 'Beachfront', area: '1.9 ha', hue: '#1E5E73', since: 'Sep 2026',
      desc: 'Pitches on a quiet cove in Bai Tu Long, the bay next to Ha Long with a fraction of the boats.\nKayaks reach two uninhabited beaches within half an hour.',
      fac: ['Toilets', 'Drinking water', 'BBQ area', 'Tent rental', 'Parking', 'Lifeguard on duty'], srv: ['Kayak hire', 'Squid fishing trip', 'Seafood BBQ sets'], acc: ['Vehicle access to pitch', 'Family friendly'] }
  ];
}
export function gmapsView(s: { lat: number; lng: number }) { return 'https://www.google.com/maps/search/?api=1&query=' + s.lat + ',' + s.lng; }
export function gmapsDir(s: { lat: number; lng: number }) { return 'https://www.google.com/maps/dir/?api=1&destination=' + s.lat + ',' + s.lng; }
export function SITES(): BaseCampsite[] {
  return [
    { id: 's1', name: 'Pine Hill Camping', prov: 'Lam Dong (Da Lat)', addr: 'Tuyen Lam Lake, Ward 3, Da Lat', ownerId: 'o1', owner: 'Pine Hill Camping', price: 650000, cap: 60, rating: 4.8, nrev: 126, clean: 4.9, infra: 4.6, ver: 'approved', listing: 'listed', active: true, cat: 'Forest & mountain', area: '2.4 ha', hue: '#2F5D3A', since: 'Mar 2024',
      desc: 'A terraced pine forest campsite on the north shore of Tuyen Lam Lake, 20 minutes from central Da Lat.\nPitches sit on flat grass platforms between the pines, each with its own fire ring and picnic table. Mornings are cold and misty; the lake path is a five minute walk downhill.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'BBQ area', 'Tent rental', 'Parking', 'Campfire area'], srv: ['Firewood delivery', 'Breakfast banh mi', 'Equipment hire', 'Local guide on request'],
      acc: ['Vehicle access to pitch', 'Step-free washrooms', 'Family friendly'] },
    { id: 's2', name: 'Tuyen Lam Lakeside', prov: 'Lam Dong (Da Lat)', addr: 'Zone 7, Tuyen Lam Lake, Da Lat', ownerId: 'o1', owner: 'Pine Hill Camping', price: 850000, cap: 40, rating: 4.6, nrev: 84, clean: 4.7, infra: 4.5, ver: 'approved', listing: 'listed', active: true, cat: 'Lakeside', area: '1.6 ha', hue: '#24596B', since: 'Jul 2024',
      desc: 'Lakeside glamping bells and tent pitches right on the water, with kayaks and a floating pontoon.\nThe site is quiet after 22:00 and suits couples and small groups.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'BBQ area', 'Wi-Fi', 'Parking'], srv: ['Kayak hire', 'Lake breakfast', 'Laundry'], acc: ['Vehicle access to pitch', 'Step-free washrooms'] },
    { id: 's3', name: 'Dam Trau Beach Camp', prov: 'Vung Tau', addr: 'Dam Trau Beach, Long Hai, Vung Tau', ownerId: 'o2', owner: 'Hoang Sa Coastal Camping', price: 550000, cap: 80, rating: 4.4, nrev: 61, clean: 4.2, infra: 4.3, ver: 'pending', listing: 'listed', active: true, cat: 'Beachfront', area: '3.1 ha', hue: '#1F6B6B', since: 'Jan 2025',
      desc: 'A wide beachfront site behind the dunes, 90 minutes from Ho Chi Minh City.\nSea breeze all night, sunrise straight over the water, and a lifeguard on duty at weekends.',
      fac: ['Toilets', 'Drinking water', 'BBQ area', 'Tent rental', 'Parking', 'Lifeguard on duty'], srv: ['Seafood BBQ sets', 'Beach volleyball', 'Shower tokens'], acc: ['Vehicle access to pitch', 'Family friendly'] },
    { id: 's4', name: 'Tam Coc Valley Camp', prov: 'Ninh Binh', addr: 'Tam Coc, Hoa Lu, Ninh Binh', ownerId: 'o3', owner: 'Valley Camp Ninh Binh', price: 700000, cap: 35, rating: 4.7, nrev: 93, clean: 4.8, infra: 4.4, ver: 'approved', listing: 'listed', active: true, cat: 'Family friendly', area: '1.2 ha', hue: '#3C6B2E', since: 'Oct 2024',
      desc: 'Pitches among the rice fields under the Tam Coc karst cliffs, with bicycles included.\nThe valley is silent at night apart from the goats on the ridge.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'Wi-Fi', 'Parking', 'Campfire area'], srv: ['Bicycle hire', 'Sampan boat booking', 'Home cooked dinner'], acc: ['Step-free washrooms', 'Family friendly', 'Wheelchair accessible path'] },
    { id: 's5', name: 'Du Gia Mountain Camp', prov: 'Ha Giang', addr: 'Du Gia, Yen Minh, Ha Giang', ownerId: 'o4', owner: 'Du Gia Highland Stays', price: 450000, cap: 25, rating: 4.9, nrev: 47, clean: 4.8, infra: 4.2, ver: 'approved', listing: 'listed', active: true, cat: 'Forest & mountain', area: '0.9 ha', hue: '#4A5E2A', since: 'Apr 2025',
      desc: 'A small terraced camp on the Du Gia loop, above the waterfall and the rice terraces.\nCold nights, enormous stars, and the owner cooks dinner for everyone at one long table.',
      fac: ['Toilets', 'Drinking water', 'Campfire area', 'Tent rental'], srv: ['Shared dinner', 'Motorbike parking', 'Hot tea all night'], acc: ['Family friendly'] },
    { id: 's6', name: 'Ke Ga Lighthouse Camp', prov: 'Binh Thuan', addr: 'Ke Ga Cape, Ham Thuan Nam, Binh Thuan', ownerId: 'o5', owner: 'Ke Ga Camping Co-op', price: 600000, cap: 50, rating: 4.3, nrev: 52, clean: 4.1, infra: 4.0, ver: 'none', listing: 'listed', active: true, cat: 'Beachfront', area: '2.0 ha', hue: '#8A6A2E', since: 'Feb 2026',
      desc: 'Rocky cape camping opposite the 19th century Ke Ga lighthouse, with tidal pools to swim in.\nThe owner has not submitted verification documents yet, so details are self-declared.',
      fac: ['Toilets', 'Drinking water', 'BBQ area', 'Parking'], srv: ['Boat trip to the lighthouse', 'Ice and water delivery'], acc: ['Vehicle access to pitch'] },
    { id: 's7', name: 'Bidoup Pine Ridge', prov: 'Lam Dong (Da Lat)', addr: 'Da Nhim, Lac Duong, Lam Dong', ownerId: 'o1', owner: 'Pine Hill Camping', price: 950000, cap: 30, rating: 4.5, nrev: 38, clean: 4.6, infra: 4.5, ver: 'approved', listing: 'listed', active: true, cat: 'Glamping', area: '1.1 ha', hue: '#2B4A3C', since: 'Nov 2025',
      desc: 'Safari tents on a ridge at the edge of Bidoup Nui Ba national park, at 1,650 m.\nIncludes beds, heaters and a hot breakfast; the trailhead starts at the gate.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'Wi-Fi', 'Parking', 'On-site shop'], srv: ['Hot breakfast', 'Guided sunrise hike', 'Heater rental'], acc: ['Vehicle access to pitch', 'Step-free washrooms'] },
    { id: 's8', name: 'Long Hai Dune Camp', prov: 'Vung Tau', addr: 'Phuoc Hai, Long Dat, Vung Tau', ownerId: 'o2', owner: 'Hoang Sa Coastal Camping', price: 500000, cap: 45, rating: 4.1, nrev: 29, clean: 3.9, infra: 4.0, ver: 'rejected', listing: 'listed', active: false, cat: 'Beachfront', area: '1.8 ha', hue: '#7A6A3C', since: 'Jun 2025',
      desc: 'Dune camping behind a fishing village, popular for kite flying in the dry season.\nVerification was rejected because the fire safety certificate had expired.',
      fac: ['Toilets', 'Drinking water', 'Parking'], srv: ['Kite hire', 'Fresh fish delivery'], acc: ['Vehicle access to pitch'] },
    { id: 's9', name: 'Mua Cave Rice Field Camp', prov: 'Ninh Binh', addr: 'Khe Dau Ha, Hoa Lu, Ninh Binh', ownerId: 'o3', owner: 'Valley Camp Ninh Binh', price: 620000, cap: 30, rating: 4.5, nrev: 71, clean: 4.4, infra: 4.3, ver: 'pending', listing: 'listed', active: true, cat: 'Family friendly', area: '1.0 ha', hue: '#49703A', since: 'Aug 2025',
      desc: 'Flat pitches between the rice paddies at the foot of the Mua Cave steps.\nBest in late May when the fields turn gold.',
      fac: ['Hot showers', 'Toilets', 'Electricity', 'Drinking water', 'Parking', 'Campfire area'], srv: ['Bicycle hire', 'Breakfast pho'], acc: ['Step-free washrooms', 'Family friendly'] },
    { id: 's10', name: 'Nho Que River Camp', prov: 'Ha Giang', addr: 'Ta Lung, Meo Vac, Ha Giang', ownerId: 'o4', owner: 'Du Gia Highland Stays', price: 520000, cap: 20, rating: 4.6, nrev: 33, clean: 4.5, infra: 4.1, ver: 'none', listing: 'draft', active: true, cat: 'Forest & mountain', area: '0.7 ha', hue: '#3A5E57', since: 'Oct 2026',
      desc: 'River bank pitches below the Ma Pi Leng pass, reached by a steep track.\nStill being prepared: the listing is a draft and not yet visible in search.',
      fac: ['Toilets', 'Drinking water', 'Campfire area'], srv: ['Boat trip on the Nho Que', 'Porter service'], acc: ['Family friendly'] }
  ];
}
export const UNREG: UnregisteredSpot[] = [
  { id: 'u1', name: 'Hon Nghe headland', prov: 'Binh Thuan', addr: 'Community reported spot, Ham Thuan Nam', lat: 10.8312, lng: 107.8044, info: 'Reported by campers. No owner account, no facilities and no booking.' },
  { id: 'u2', name: 'Trang An north bank', prov: 'Ninh Binh', addr: 'Community reported spot, Hoa Lu', lat: 20.2615, lng: 105.8972, info: 'Wild camping area. No capacity information available.' },
  { id: 'u3', name: 'Lang Biang north face', prov: 'Lam Dong (Da Lat)', addr: 'Community reported spot, Lac Duong', lat: 12.0442, lng: 108.4411, info: 'Permit required from the forest station. Not bookable on VietCamp.' },
  { id: 'u4', name: 'Dong Mo reservoir shore', prov: 'Ba Vi (Ha Noi)', addr: 'Community reported spot, Son Tay', lat: 21.0612, lng: 105.4553, info: 'Popular free spot. Owner has not registered the land on VietCamp.' },
  { id: 'u5', name: 'Co To east beach', prov: 'Quang Ninh', addr: 'Community reported spot, Co To island', lat: 20.9769, lng: 107.7694, info: 'Island beach camping. Ferry access only, no registered owner.' }
];
export function USERS(): User[] {
  return [
    { id: 'c1', name: 'Nguyen Minh Anh', email: 'camper@camping.vn', phone: '0905 214 778', role: 'Camper', joined: 'Feb 2025', st: 'Active', seen: '2 hours ago', color: '#7A5230' },
    { id: 'o1', name: 'Le Thanh Hung', email: 'owner@camping.vn', phone: '0918 442 019', role: 'Owner', joined: 'Mar 2024', st: 'Active', seen: '18 minutes ago', color: '#13412E' },
    { id: 'o2', name: 'Tran Hoang Nam', email: 'nam@hoangsacamping.vn', phone: '0937 110 284', role: 'Owner', joined: 'Jan 2025', st: 'Active', seen: 'Yesterday', color: '#1F6B4A' },
    { id: 'o3', name: 'Pham Thu Huong', email: 'huong@valleycamp.vn', phone: '0912 773 560', role: 'Owner', joined: 'Oct 2024', st: 'Active', seen: '3 days ago', color: '#1F6B4A' },
    { id: 'o4', name: 'Vu Dinh Khoa', email: 'khoa@dugiastays.vn', phone: '0944 208 311', role: 'Owner', joined: 'Apr 2025', st: 'Active', seen: 'Today', color: '#1F6B4A' },
    { id: 'o5', name: 'Do Khanh Linh', email: 'linh@kegacamping.vn', phone: '0966 517 402', role: 'Owner', joined: 'Feb 2026', st: 'Active', seen: '5 days ago', color: '#1F6B4A' },
    { id: 'o6', name: 'Nguyen Van Tuan', email: 'tuan@bavioutdoor.vn', phone: '0982 445 700', role: 'Owner', joined: 'May 2025', st: 'Active', seen: 'Today', color: '#1F6B4A' },
    { id: 'o7', name: 'Huynh Gia Bao', email: 'bao@sontraeco.vn', phone: '0905 882 316', role: 'Owner', joined: 'Mar 2026', st: 'Active', seen: 'Yesterday', color: '#1F6B4A' },
    { id: 'o8', name: 'Bui Minh Quan', email: 'quan@vandonbay.vn', phone: '0915 603 228', role: 'Owner', joined: 'Sep 2026', st: 'Active', seen: '4 days ago', color: '#1F6B4A' },
    { id: 'c2', name: 'Hoang Bao Chau', email: 'chau.hoang@gmail.com', phone: '0903 661 927', role: 'Camper', joined: 'Jun 2025', st: 'Active', seen: 'Today', color: '#7A5230' },
    { id: 'c3', name: 'Nguyen Thi Lan', email: 'lan.nguyen@gmail.com', phone: '0988 304 115', role: 'Camper', joined: 'Sep 2025', st: 'Suspended', seen: '2 weeks ago', color: '#A8231C' },
    { id: 'a1', name: 'Vo Quoc Dat', email: 'admin@camping.vn', phone: '0901 000 118', role: 'Administrator', joined: 'Jan 2024', st: 'Active', seen: 'Now', color: '#1A587F' }
  ];
}
export function BOOKINGS(): Booking[] {
  return [
    { id: 'b1', ref: 'VC-2026-0481', siteId: 's1', camperId: 'c1', from: addDays(6), to: addDays(8), guests: 4, status: 'pending', created: addDays(-1), arrival: '14:00 - 17:00', gear: 'I bring my own tent', note: 'Two adults and two children, arriving by car.', arrived: false, checkedIn: false, checkedOut: false, reviewed: false },
    { id: 'b2', ref: 'VC-2026-0462', siteId: 's4', camperId: 'c1', from: addDays(12), to: addDays(14), guests: 2, status: 'confirmed', created: addDays(-5), arrival: 'Before 14:00', gear: 'I need to rent a tent', note: 'Please reserve a pitch near the field path.', arrived: false, checkedIn: false, checkedOut: false, reviewed: false },
    { id: 'b3', ref: 'VC-2026-0399', siteId: 's2', camperId: 'c1', from: addDays(-14), to: addDays(-12), guests: 3, status: 'completed', created: addDays(-24), arrival: '17:00 - 20:00', gear: 'I bring my own tent', note: '', arrived: true, checkedIn: true, checkedOut: true, reviewed: true },
    { id: 'b4', ref: 'VC-2026-0355', siteId: 's5', camperId: 'c1', from: addDays(-40), to: addDays(-38), guests: 2, status: 'completed', created: addDays(-52), arrival: '14:00 - 17:00', gear: 'Campervan / car', note: 'Motorbike loop group of two.', arrived: true, checkedIn: true, checkedOut: true, reviewed: false },
    { id: 'b5', ref: 'VC-2026-0301', siteId: 's3', camperId: 'c1', from: addDays(-62), to: addDays(-60), guests: 4, status: 'cancelled', created: addDays(-70), arrival: 'After 20:00', gear: 'I bring my own tent', note: 'Cancelled because of a storm warning.', arrived: false, checkedIn: false, checkedOut: false, reviewed: false },
    { id: 'b6', ref: 'VC-2026-0288', siteId: 's1', camperId: 'c1', from: addDays(-74), to: addDays(-72), guests: 2, status: 'rejected', created: addDays(-80), arrival: 'Before 14:00', gear: 'I bring my own tent', note: '', arrived: false, checkedIn: false, checkedOut: false, reviewed: false, reason: 'The campsite was closed for maintenance on those dates.' },
    { id: 'b7', ref: 'VC-2026-0478', siteId: 's1', camperId: 'c2', from: addDays(0), to: addDays(2), guests: 6, status: 'arrived', created: addDays(-4), arrival: '14:00 - 17:00', gear: 'I bring my own tent', note: 'Group of six university friends.', arrived: true, checkedIn: false, checkedOut: false, reviewed: false },
    { id: 'b8', ref: 'VC-2026-0475', siteId: 's2', camperId: 'c3', from: addDays(-1), to: addDays(1), guests: 8, status: 'checkedin', created: addDays(-7), arrival: 'Before 14:00', gear: 'Campervan / car', note: 'Two campervans, need electricity.', arrived: true, checkedIn: true, checkedOut: false, reviewed: false },
    { id: 'b9', ref: 'VC-2026-0470', siteId: 's1', camperId: 'c2', from: addDays(-3), to: addDays(-1), guests: 5, status: 'checkedin', created: addDays(-11), arrival: '17:00 - 20:00', gear: 'I bring my own tent', note: '', arrived: true, checkedIn: true, checkedOut: true, reviewed: false },
    { id: 'b10', ref: 'VC-2026-0486', siteId: 's7', camperId: 'c3', from: addDays(9), to: addDays(11), guests: 10, status: 'pending', created: addDays(0), arrival: '14:00 - 17:00', gear: 'I bring my own tent', note: 'Company team building, 10 people.', arrived: false, checkedIn: false, checkedOut: false, reviewed: false },
    { id: 'b11', ref: 'VC-2026-0455', siteId: 's1', camperId: 'c3', from: addDays(5), to: addDays(7), guests: 20, status: 'confirmed', created: addDays(-9), arrival: 'Before 14:00', gear: 'I bring my own tent', note: 'School trip, 20 students with two teachers.', arrived: false, checkedIn: false, checkedOut: false, reviewed: false }
  ];
}
export function REVIEWS(): Review[] {
  return [
    { id: 'r1', bookingId: 'b3', siteId: 's2', userId: 'c1', rating: 5, clean: 5, infra: 4, date: addDays(-11), status: 'visible', flagged: false, text: 'The lakeside pitches are worth the extra cost. Showers were hot at 6am, the pontoon is lovely at sunrise and the owner lent us a kayak for free. One power socket per pitch only.' },
    { id: 'r2', bookingId: 'b9', siteId: 's1', userId: 'c2', rating: 4, clean: 4, infra: 4, date: addDays(-1), status: 'visible', flagged: false, text: 'Great pine forest site, very cold at night so bring a proper sleeping bag. The fire ring and firewood delivery made the evening. Washrooms were clean but queued at 7am.' },
    { id: 'r3', bookingId: 'b0', siteId: 's1', userId: 'c3', rating: 2, clean: 2, infra: 3, date: addDays(-20), status: 'visible', flagged: true, text: 'Far more crowded than the capacity suggested and the toilets ran out of water on the second morning. The owner disputes this review.' },
    { id: 'r4', bookingId: 'b00', siteId: 's4', userId: 'c2', rating: 5, clean: 5, infra: 5, date: addDays(-30), status: 'visible', flagged: false, text: 'Waking up inside the rice fields with the karst cliffs behind is unforgettable. Bicycles included, home cooked dinner was excellent value.' },
    { id: 'r5', bookingId: 'b000', siteId: 's5', userId: 'c3', rating: 5, clean: 5, infra: 4, date: addDays(-45), status: 'hidden', flagged: true, text: 'Hidden by moderation: the text contained a phone number and an off-platform offer.' }
  ];
}
export function REPORTS(): Report[] {
  return [
    { id: 'rp1', ref: 'RP-2026-114', siteId: 's6', userId: 'c1', cat: 'Inaccurate information', date: addDays(-3), status: 'pending', file: 'ke-ga-signboard.jpg', text: 'The listing says hot showers are available but there is only a cold water tank. The capacity on the signboard at the gate is 30, not 50.', reply: '' },
    { id: 'rp2', ref: 'RP-2026-108', siteId: 's8', userId: 'c2', cat: 'Inactive campsite', date: addDays(-12), status: 'resolved', file: 'closed-gate.jpg', text: 'Drove down on Saturday and the site was closed with a chain across the track. Nobody answered the phone number on the listing.', reply: 'Confirmed with the owner: the campsite is closed for dune repairs. The listing has been set to inactive and the verification was rejected until the fire safety certificate is renewed.' },
    { id: 'rp3', ref: 'RP-2026-111', siteId: 's3', userId: 'c3', cat: 'Overcrowding', date: addDays(-6), status: 'info', file: 'beach-crowd.jpg', text: 'Around 120 people on the beach section on Sunday night, well above the 80 guest capacity shown.', reply: 'We have asked the reporter for the exact date and time so the booking records can be checked.' },
    { id: 'rp4', ref: 'RP-2026-101', siteId: 's9', userId: 'c1', cat: 'Other', date: addDays(-21), status: 'rejected', file: 'none', text: 'A dog on the site barked all night.', reply: 'Not a platform matter. We passed the comment to the owner as feedback.' }
  ];
}
export function VERS(): VerificationRequest[] {
  return [
    { id: 'v1', siteId: 's3', date: addDays(-4), status: 'pending', reason: '', docs: [
      { name: 'Business registration 0312-BR-2025.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-4)) + ' · 1.8 MB', status: 'pending' },
      { name: 'Fire safety certificate 2026.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-4)) + ' · 0.9 MB', status: 'pending' },
      { name: 'Owner identity card.jpg', ext: 'JPG', meta: 'Submitted ' + fmtDate(addDays(-4)) + ' · 2.4 MB', status: 'pending' } ] },
    { id: 'v2', siteId: 's9', date: addDays(-2), status: 'pending', reason: '', docs: [
      { name: 'Land use document NB-0912.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-2)) + ' · 2.1 MB', status: 'pending' },
      { name: 'Business registration 0774-BR-2025.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-2)) + ' · 1.2 MB', status: 'pending' } ] },
    { id: 'v3', siteId: 's8', date: addDays(-26), status: 'rejected', reason: 'The fire safety certificate expired in August 2026. Renew it and resubmit with a current capacity declaration.', docs: [
      { name: 'Fire safety certificate 2024.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-26)) + ' · 0.8 MB', status: 'rejected' },
      { name: 'Business registration 0561-BR-2025.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-26)) + ' · 1.4 MB', status: 'approved' } ] },
    { id: 'v4', siteId: 's1', date: addDays(-240), status: 'approved', reason: '', docs: [
      { name: 'Business registration 0118-BR-2024.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-236)) + ' · 1.6 MB', status: 'approved' },
      { name: 'Fire safety certificate 2026.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-236)) + ' · 1.0 MB', status: 'approved' },
      { name: 'Land use document LD-2291.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-236)) + ' · 2.6 MB', status: 'approved' } ] },
    { id: 'v5', siteId: 's2', date: addDays(-150), status: 'approved', reason: '', docs: [
      { name: 'Business registration 0118-BR-2024.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-146)) + ' · 1.6 MB', status: 'approved' },
      { name: 'Environmental permit LD-0042.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-146)) + ' · 1.1 MB', status: 'approved' } ] },
    { id: 'v6', siteId: 's7', date: addDays(-60), status: 'approved', reason: '', docs: [
      { name: 'Business registration 0118-BR-2024.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-56)) + ' · 1.6 MB', status: 'approved' } ] },
    { id: 'v7', siteId: 's13', date: addDays(-1), status: 'pending', reason: '', docs: [
      { name: 'Business registration 1204-BR-2026.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-1)) + ' · 1.9 MB', status: 'pending' },
      { name: 'Water safety declaration QN-2026.pdf', ext: 'PDF', meta: 'Submitted ' + fmtDate(addDays(-1)) + ' · 0.7 MB', status: 'pending' },
      { name: 'Island land lease Van Don.jpg', ext: 'JPG', meta: 'Submitted ' + fmtDate(addDays(-1)) + ' · 3.1 MB', status: 'pending' } ] },
    { id: 'v8', siteId: 's11', date: addDays(-120), status: 'approved', reason: '', docs: [
      { name: 'Business registration 0907-BR-2025.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-116)) + ' · 1.5 MB', status: 'approved' },
      { name: 'Forest park camping permit.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-116)) + ' · 0.9 MB', status: 'approved' } ] },
    { id: 'v9', siteId: 's12', date: addDays(-70), status: 'approved', reason: '', docs: [
      { name: 'Nature reserve camping permit.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-66)) + ' · 1.2 MB', status: 'approved' },
      { name: 'Business registration 0455-BR-2026.pdf', ext: 'PDF', meta: 'Approved ' + fmtDate(addDays(-66)) + ' · 1.4 MB', status: 'approved' } ] }
  ];
}
export function ANNS(): Announcement[] {
  return [
    { id: 'an1', title: 'Rainy season safety reminder', aud: 'All users', date: addDays(-8), status: 'published', body: 'The south west monsoon brings sudden storms to the central highlands between June and October.\nCheck the forecast before you travel, pitch away from dry river beds, and contact your campsite owner if a storm warning is issued. Owners may close dates at short notice for safety.' },
    { id: 'an2', title: 'Three-month activity confirmation is now required', aud: 'Campsite owners', date: addDays(-20), status: 'published', body: 'Every approved campsite must confirm it is still active once every three months.\nYou will see a reminder on your dashboard. Campsites that are not confirmed lose the approved badge until the owner confirms again.' },
    { id: 'an3', title: 'New review categories: cleanliness and infrastructure', aud: 'Campers', date: addDays(-2), status: 'draft', body: 'From next month, reviews of completed stays will ask for a cleanliness rating and an infrastructure rating alongside the overall score.\nOnly one verified review per completed booking is allowed.' }
  ];
}

export const campsites: Campsite[] = [...SITES(), ...EXTRA()].map((s) => ({ ...s, ...GEO[s.id] }))

/** Demo session state from the prototype: signed-in camper/owner, saved favorites, closed days. */
export const DEMO = {
  camperId: 'c1',
  ownerId: 'o1',
  adminId: 'a1',
  favorites: ['s2', 's5'],
  closed: { s1: [addDays(16), addDays(17)], s2: [addDays(21)] } as Record<string, string[]>,
}
