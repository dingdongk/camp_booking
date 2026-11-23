import type { BookingStatus, ListingStatus, VerificationStatus } from '../../types/models'
import { LST, ST, VER } from '../../utils/labels'

export function VerBadge({ ver }: { ver: VerificationStatus }) {
  return <span className={VER[ver][0]}>{VER[ver][1]}</span>
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  return <span className={ST[status][0]}>{ST[status][1]}</span>
}

export function ListingBadge({ listing }: { listing: ListingStatus }) {
  return <span className={LST[listing][0]}>{LST[listing][1]}</span>
}
