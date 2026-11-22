# database

Supabase project: migrations, seed data, schema docs and schema tests.

```powershell
npm install
npm test          # PGlite schema test (no Docker needed)
npm run start     # local Supabase in Docker: API :54321, DB :54322, Studio :54323
npm run status    # URLs and keys (anon key -> frontend .env, service_role key -> backend .env)
npm run reset     # re-apply migrations + seed.sql
```

Schema changes go in a new file under `supabase/migrations/` - never edit an applied migration.