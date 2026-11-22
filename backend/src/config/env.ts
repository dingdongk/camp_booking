import { z } from 'zod'

try { process.loadEnvFile() } catch { /* no .env file: use real environment */ }

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  AI_SERVICE_URL: z.string().optional(),
  AI_SERVICE_TOKEN: z.string().optional(),
  TOOL_API_TOKEN: z.string().optional(),
})

export const env = schema.parse(process.env)