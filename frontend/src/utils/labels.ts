import type { BookingStatus, ListingStatus, VerificationStatus } from '../types/models'

/** [badge class, label] per status, as in the prototype */
export const ST: Record<BookingStatus, [string, string]> = {
  pending: ['bg wa', 'Pending'], confirmed: ['bg in', 'Confirmed'], arrived: ['bg in', 'Arrival confirmed'],
  checkedin: ['bg ok', 'Checked in'], completed: ['bg ok', 'Completed'], rejected: ['bg er', 'Rejected'],
  cancelled: ['bg mu', 'Cancelled']
};
export const VER: Record<VerificationStatus, [string, string]> = {
  approved: ['bg ok', 'Approved'], pending: ['bg wa', 'Pending review'],
  rejected: ['bg er', 'Rejected'], none: ['bg mu', 'Not submitted']
};
export const LST: Record<ListingStatus, [string, string]> = { listed: ['bg ok', 'Listed'], draft: ['bg mu', 'Draft'], hidden: ['bg er', 'Hidden'] };
