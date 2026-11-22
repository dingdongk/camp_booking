import { createBrowserRouter } from 'react-router-dom'
import PublicHomePage from './pages/public/HomePage'
import PublicSearchPage from './pages/public/SearchPage'
import PublicMapPage from './pages/public/MapPage'
import PublicCampsiteDetailPage from './pages/public/CampsiteDetailPage'
import PublicChatPage from './pages/public/ChatPage'
import PublicLoginPage from './pages/public/LoginPage'
import PublicRegisterPage from './pages/public/RegisterPage'
import PublicForgotPasswordPage from './pages/public/ForgotPasswordPage'
import CamperBookingPage from './pages/camper/BookingPage'
import CamperBookingConfirmationPage from './pages/camper/BookingConfirmationPage'
import CamperDashboardPage from './pages/camper/DashboardPage'
import CamperMyBookingsPage from './pages/camper/MyBookingsPage'
import CamperBookingDetailPage from './pages/camper/BookingDetailPage'
import CamperFavoritesPage from './pages/camper/FavoritesPage'
import CamperMyReviewsPage from './pages/camper/MyReviewsPage'
import CamperMyReportsPage from './pages/camper/MyReportsPage'
import CamperProfilePage from './pages/camper/ProfilePage'
import OwnerDashboardPage from './pages/owner/DashboardPage'
import OwnerMyCampsitesPage from './pages/owner/MyCampsitesPage'
import OwnerCampsiteFormPage from './pages/owner/CampsiteFormPage'
import OwnerAvailabilityPage from './pages/owner/AvailabilityPage'
import OwnerBookingsPage from './pages/owner/BookingsPage'
import OwnerBookingDetailPage from './pages/owner/BookingDetailPage'
import OwnerCheckInPage from './pages/owner/CheckInPage'
import OwnerVerificationPage from './pages/owner/VerificationPage'
import OwnerProfilePage from './pages/owner/ProfilePage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminCampsitesPage from './pages/admin/CampsitesPage'
import AdminVerificationPage from './pages/admin/VerificationPage'
import AdminReportsPage from './pages/admin/ReportsPage'
import AdminReviewModerationPage from './pages/admin/ReviewModerationPage'
import AdminAnnouncementsPage from './pages/admin/AnnouncementsPage'

// TODO: wrap each role area in its layout + RequireRole guard
export const router = createBrowserRouter([
  { path: '/', element: <PublicHomePage /> },
  { path: '/search', element: <PublicSearchPage /> },
  { path: '/map', element: <PublicMapPage /> },
  { path: '/campsites/:id', element: <PublicCampsiteDetailPage /> },
  { path: '/chat', element: <PublicChatPage /> },
  { path: '/login', element: <PublicLoginPage /> },
  { path: '/register', element: <PublicRegisterPage /> },
  { path: '/forgot-password', element: <PublicForgotPasswordPage /> },
  { path: '/campsites/:id/book', element: <CamperBookingPage /> },
  { path: '/bookings/:id/confirmation', element: <CamperBookingConfirmationPage /> },
  { path: '/me', element: <CamperDashboardPage /> },
  { path: '/me/bookings', element: <CamperMyBookingsPage /> },
  { path: '/me/bookings/:id', element: <CamperBookingDetailPage /> },
  { path: '/me/favorites', element: <CamperFavoritesPage /> },
  { path: '/me/reviews', element: <CamperMyReviewsPage /> },
  { path: '/me/reports', element: <CamperMyReportsPage /> },
  { path: '/me/profile', element: <CamperProfilePage /> },
  { path: '/owner', element: <OwnerDashboardPage /> },
  { path: '/owner/campsites', element: <OwnerMyCampsitesPage /> },
  { path: '/owner/campsites/new', element: <OwnerCampsiteFormPage /> },
  { path: '/owner/availability', element: <OwnerAvailabilityPage /> },
  { path: '/owner/bookings', element: <OwnerBookingsPage /> },
  { path: '/owner/bookings/:id', element: <OwnerBookingDetailPage /> },
  { path: '/owner/check-in', element: <OwnerCheckInPage /> },
  { path: '/owner/verification', element: <OwnerVerificationPage /> },
  { path: '/owner/profile', element: <OwnerProfilePage /> },
  { path: '/admin', element: <AdminDashboardPage /> },
  { path: '/admin/users', element: <AdminUsersPage /> },
  { path: '/admin/campsites', element: <AdminCampsitesPage /> },
  { path: '/admin/verification', element: <AdminVerificationPage /> },
  { path: '/admin/reports', element: <AdminReportsPage /> },
  { path: '/admin/reviews', element: <AdminReviewModerationPage /> },
  { path: '/admin/announcements', element: <AdminAnnouncementsPage /> },
  { path: '/owner/campsites/:id/edit', element: <OwnerCampsiteFormPage /> },
])
