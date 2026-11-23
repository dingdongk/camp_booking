// Mock implementation. Real login goes through Supabase Auth (see ../auth/supabase.ts).
import { CREDS } from '../mocks/data'

export async function getDemoCredentials() {
  return CREDS
}
