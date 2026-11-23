import type { ComponentType } from 'react'
import { createBrowserRouter, type LoaderFunction, type RouteObject } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import CamperLayout from './layouts/CamperLayout'
import PublicLayout from './layouts/PublicLayout'
import WorkspaceLayout from './layouts/WorkspaceLayout'

import * as Home from './pages/public/HomePage'
import * as Search from './pages/public/SearchPage'
import * as MapView from './pages/public/MapPage'
import * as CampsiteDetail from './pages/public/CampsiteDetailPage'
import * as Chat from './pages/public/ChatPage'
import * as Login from './pages/public/LoginPage'
import * as Register from './pages/public/RegisterPage'
import * as ForgotPassword from './pages/public/ForgotPasswordPage'
import * as Booking from './pages/camper/BookingPage'
import * as BookingConfirmation from './pages/camper/BookingConfirmationPage'
import * as CamperDashboard from './pages/camper/DashboardPage'
import * as MyBookings from './pages/camper/MyBookingsPage'
import * as CamperBookingDetail from './pages/camper/BookingDetailPage'
import * as Favorites from './pages/camper/FavoritesPage'
import * as MyReviews from './pages/camper/MyReviewsPage'
import * as MyReports from './pages/camper/MyReportsPage'
import * as CamperProfile from './pages/camper/ProfilePage'
import * as OwnerDashboard from './pages/owner/DashboardPage'
import * as MyCampsites from './pages/owner/MyCampsitesPage'
import * as CampsiteForm from './pages/owner/CampsiteFormPage'
import * as Availability from './pages/owner/AvailabilityPage'
import * as OwnerBookings from './pages/owner/BookingsPage'
import * as OwnerBookingDetail from './pages/owner/BookingDetailPage'
import * as CheckIn from './pages/owner/CheckInPage'
import * as OwnerVerification from './pages/owner/VerificationPage'
import * as OwnerProfile from './pages/owner/ProfilePage'
import * as AdminDashboard from './pages/admin/DashboardPage'
import * as Users from './pages/admin/UsersPage'
import * as AdminCampsites from './pages/admin/CampsitesPage'
import * as AdminVerification from './pages/admin/VerificationPage'
import * as Reports from './pages/admin/ReportsPage'
import * as ReviewModeration from './pages/admin/ReviewModerationPage'
import * as Announcements from './pages/admin/AnnouncementsPage'

/** Each page module exports its component as default and, when it needs data, a `loader` that calls src/api. */
type PageModule = { default: ComponentType; loader?: LoaderFunction }

const page = (path: string | undefined, mod: PageModule): RouteObject =>
  path === undefined ? { index: true, Component: mod.default, loader: mod.loader } : { path, Component: mod.default, loader: mod.loader }

// TODO (with backend): wrap the camper / owner / admin areas in a RequireRole guard.
export const router = createBrowserRouter([
  {
    Component: AppShell,
    children: [
      {
        Component: PublicLayout,
        children: [
          page(undefined, Home),
          page('search', Search),
          page('map', MapView),
          page('campsites/:id', CampsiteDetail),
          page('chat', Chat),
          page('login', Login),
          page('register', Register),
          page('forgot-password', ForgotPassword),
        ],
      },
      {
        Component: CamperLayout,
        children: [
          page('campsites/:id/book', Booking),
          page('bookings/:id/confirmation', BookingConfirmation),
          page('me', CamperDashboard),
          page('me/bookings', MyBookings),
          page('me/bookings/:id', CamperBookingDetail),
          page('me/favorites', Favorites),
          page('me/reviews', MyReviews),
          page('me/reports', MyReports),
          page('me/profile', CamperProfile),
        ],
      },
      {
        path: 'owner',
        element: <WorkspaceLayout role="owner" />,
        children: [
          page(undefined, OwnerDashboard),
          page('campsites', MyCampsites),
          page('campsites/new', CampsiteForm),
          page('campsites/:id/edit', CampsiteForm),
          page('availability', Availability),
          page('bookings', OwnerBookings),
          page('bookings/:id', OwnerBookingDetail),
          page('check-in', CheckIn),
          page('verification', OwnerVerification),
          page('profile', OwnerProfile),
        ],
      },
      {
        path: 'admin',
        element: <WorkspaceLayout role="admin" />,
        children: [
          page(undefined, AdminDashboard),
          page('users', Users),
          page('campsites', AdminCampsites),
          page('verification', AdminVerification),
          page('reports', Reports),
          page('reviews', ReviewModeration),
          page('announcements', Announcements),
        ],
      },
    ],
  },
])
