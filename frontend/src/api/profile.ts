// Mock implementation. Backend team: replace with api<T>('/me/profile') and api<T>('/me/owner-profile') from ./client.

export async function getCamperProfile() {
  return {
    name: 'Nguyen Minh Anh', dob: '1998-04-12', email: 'camper@camping.vn', phone: '0905 214 778',
    city: 'Ho Chi Minh City', bio: 'Weekend camper, mostly in the central highlands. Always travelling with a hammock.',
    since: 'February 2025',
    notifications: ['Booking status changes', 'Owner messages', 'Review reminders'],
  }
}

export async function getOwnerProfile() {
  return {
    biz: 'Pine Hill Camping', name: 'Le Thanh Hung', email: 'owner@camping.vn', phone: '0918 442 019',
    addr: 'Tuyen Lam Lake, Ward 3, Da Lat, Lam Dong', tax: '5801234567',
    about: 'Family run camping business on Tuyen Lam Lake since 2024, three campsites around Da Lat.',
    notifications: ['New booking requests', 'Cancellations', 'Verification decisions', 'New reviews'],
  }
}
