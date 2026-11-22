# VietCamp - scaffold the 4 service folders (frontend, backend, ai, database) in this repo.
#
# Put this file in the root of the cloned repo, then run (one command):
#   powershell -ExecutionPolicy Bypass -File .\setup-services.ps1
#
# Optional: point to the planning folder that holds database-schema.sql etc.
#   powershell -ExecutionPolicy Bypass -File .\setup-services.ps1 -PlanningDir "C:\path\to\planning"
#
# Requires: Node 22.12+ (or 24 LTS), uv (Python 3.12). Docker is only needed later for `npm run start` in database.
# This script does not run any git commands.

param(
  [string]$PlanningDir = (Join-Path $PSScriptRoot 'planning')
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
Set-Location $Root

# ---------------------------------------------------------------- helpers
function Assert-Ok([string]$What) {
  if ($LASTEXITCODE -ne 0) { throw "$What failed (exit code $LASTEXITCODE)" }
}

# Writes UTF-8 without BOM, creates parent folders; path is relative to the current folder
function Write-File([string]$Path, [string]$Content) {
  $full = Join-Path (Get-Location).Path $Path
  New-Item -ItemType Directory -Force -Path (Split-Path $full) | Out-Null
  [IO.File]::WriteAllText($full, $Content.TrimStart("`r", "`n"), (New-Object Text.UTF8Encoding $false))
}

# Creates folders; empty ones get a .gitkeep so git keeps the structure
function New-Dirs([string[]]$Paths) {
  foreach ($p in $Paths) {
    New-Item -ItemType Directory -Force -Path $p | Out-Null
    if (-not (Get-ChildItem -Force -Path $p)) { New-Item -ItemType File -Path (Join-Path $p '.gitkeep') | Out-Null }
  }
}

function Write-Step([string]$Text) { Write-Host "`n== $Text ==" -ForegroundColor Cyan }

# ---------------------------------------------------------------- prerequisites
Write-Step 'checking prerequisites'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js is not installed' }
$nodeVersion = [version]((node -v).TrimStart('v'))
if ($nodeVersion -lt [version]'22.12.0') {
  throw "Node $nodeVersion found. Vite 8 needs Node 22.12+ - install the latest Node 22 or 24 LTS first."
}
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  throw 'uv is not installed - see https://docs.astral.sh/uv/getting-started/installation/'
}
foreach ($dir in 'frontend', 'backend', 'ai', 'database') {
  if (Test-Path $dir) { throw "'$dir' already exists in $Root - remove it first, nothing was changed." }
}
$schemaFiles = 'database-schema.sql', 'database-schema.dbml', 'database-schema.drawio', 'database-schema.drawio.png', 'database-schema.test.mjs'
$hasPlanning = $true
foreach ($f in $schemaFiles) { if (-not (Test-Path (Join-Path $PlanningDir $f))) { $hasPlanning = $false } }
if (-not $hasPlanning) {
  Write-Warning "Schema files not found in '$PlanningDir'. database/ will be created without the migration, docs and test - copy them in later."
}
Write-Host "node $nodeVersion, $(uv --version)" -ForegroundColor Green

# ---------------------------------------------------------------- root .gitignore
$rootIgnore = @('planning/', 'node_modules/', '.env', '.DS_Store', 'Thumbs.db')
$existing = if (Test-Path '.gitignore') { Get-Content '.gitignore' } else { @() }
$missing = $rootIgnore | Where-Object { $existing -notcontains $_ }
if ($missing) { Add-Content -Path '.gitignore' -Value ($missing -join "`r`n") }

# ================================================================= frontend
Write-Step 'frontend'
Set-Location $Root
npx --yes create-vite@latest frontend --template react-ts --no-interactive --no-immediate; Assert-Ok 'create-vite'
Set-Location (Join-Path $Root 'frontend')
npm install; Assert-Ok 'npm install'
npm install react-router-dom @supabase/supabase-js leaflet react-leaflet; Assert-Ok 'npm install (deps)'
npm install -D tailwindcss @tailwindcss/vite @types/leaflet; Assert-Ok 'npm install (dev deps)'

Remove-Item -Force src\App.tsx, src\App.css, src\index.css
Remove-Item -Recurse -Force src\assets

New-Dirs @('src/auth', 'src/api', 'src/layouts', 'src/components/ui', 'src/components/campsite',
           'src/components/booking', 'src/components/map', 'src/components/chat', 'src/types', 'src/utils')

Write-File 'vite.config.ts' @'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
'@

Write-File 'index.html' @'
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
    <title>VietCamp</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

# Theme tokens ported from the prototype
Write-File 'src/styles/index.css' @'
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", ui-serif, Georgia, serif;

  --color-forest-50: #f1f8f3;  --color-forest-100: #dceee2; --color-forest-200: #b9dcc6;
  --color-forest-300: #8cc3a2; --color-forest-400: #5ba47c; --color-forest-500: #38855e;
  --color-forest-600: #276b4a; --color-forest-700: #1f543b; --color-forest-800: #1a4331;
  --color-forest-900: #143428; --color-forest-950: #0b1f17;

  --color-clay-50: #faf6f1;  --color-clay-100: #f2e8dc; --color-clay-200: #e4d0b9;
  --color-clay-300: #d2b18f; --color-clay-400: #be8f65; --color-clay-500: #a97548;
  --color-clay-600: #8d5c39; --color-clay-700: #704831; --color-clay-800: #5b3c2c;
  --color-clay-900: #4a3226;

  --color-sand-50: #fdfbf7; --color-sand-100: #f8f4ec; --color-sand-200: #f1eadd;
  --color-sand-300: #e6dcc9; --color-sand-400: #d6c8ae;

  --color-ink-500: #5b6b63; --color-ink-600: #44534c; --color-ink-700: #2e3a34;
  --color-ink-800: #1d2822; --color-ink-900: #111a15;
}

body {
  @apply bg-sand-50 font-sans text-ink-800;
}
'@

# 33 pages from the prototype: role folder, component name, route
$pages = @(
  @('public', 'HomePage', '/'), @('public', 'SearchPage', '/search'), @('public', 'MapPage', '/map'),
  @('public', 'CampsiteDetailPage', '/campsites/:id'), @('public', 'ChatPage', '/chat'),
  @('public', 'LoginPage', '/login'), @('public', 'RegisterPage', '/register'),
  @('public', 'ForgotPasswordPage', '/forgot-password'),
  @('camper', 'BookingPage', '/campsites/:id/book'), @('camper', 'BookingConfirmationPage', '/bookings/:id/confirmation'),
  @('camper', 'DashboardPage', '/me'), @('camper', 'MyBookingsPage', '/me/bookings'),
  @('camper', 'BookingDetailPage', '/me/bookings/:id'), @('camper', 'FavoritesPage', '/me/favorites'),
  @('camper', 'MyReviewsPage', '/me/reviews'), @('camper', 'MyReportsPage', '/me/reports'),
  @('camper', 'ProfilePage', '/me/profile'),
  @('owner', 'DashboardPage', '/owner'), @('owner', 'MyCampsitesPage', '/owner/campsites'),
  @('owner', 'CampsiteFormPage', '/owner/campsites/new'), @('owner', 'AvailabilityPage', '/owner/availability'),
  @('owner', 'BookingsPage', '/owner/bookings'), @('owner', 'BookingDetailPage', '/owner/bookings/:id'),
  @('owner', 'CheckInPage', '/owner/check-in'), @('owner', 'VerificationPage', '/owner/verification'),
  @('owner', 'ProfilePage', '/owner/profile'),
  @('admin', 'DashboardPage', '/admin'), @('admin', 'UsersPage', '/admin/users'),
  @('admin', 'CampsitesPage', '/admin/campsites'), @('admin', 'VerificationPage', '/admin/verification'),
  @('admin', 'ReportsPage', '/admin/reports'), @('admin', 'ReviewModerationPage', '/admin/reviews'),
  @('admin', 'AnnouncementsPage', '/admin/announcements')
)

$imports = @()
$routes = @()
foreach ($p in $pages) {
  $role = $p[0]; $name = $p[1]; $path = $p[2]
  $alias = (Get-Culture).TextInfo.ToTitleCase($role) + $name
  Write-File "src/pages/$role/$name.tsx" ("export default function $alias() {`n" +
    "  return <h1 className=`"p-8 text-2xl font-semibold`">$role / $name</h1>`n}`n")
  $imports += "import $alias from './pages/$role/$name'"
  $routes += "  { path: '$path', element: <$alias /> },"
}
$routes += "  { path: '/owner/campsites/:id/edit', element: <OwnerCampsiteFormPage /> },"

Write-File 'src/router.tsx' (
  "import { createBrowserRouter } from 'react-router-dom'`n" + ($imports -join "`n") + "`n`n" +
  "// TODO: wrap each role area in its layout + RequireRole guard`n" +
  "export const router = createBrowserRouter([`n" + ($routes -join "`n") + "`n])`n")

Write-File 'src/main.tsx' @'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './styles/index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
'@

Write-File 'src/auth/supabase.ts' @'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
'@

Write-File 'src/api/client.ts' @'
import { supabase } from '../auth/supabase'

const BASE_URL = import.meta.env.VITE_API_URL

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (data.session) headers.set('Authorization', `Bearer ${data.session.access_token}`)

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? res.statusText)
  return res.json() as Promise<T>
}
'@

Write-File '.env.example' @'
VITE_API_URL=http://localhost:4000/api/v1
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=
'@
Copy-Item .env.example .env
Add-Content -Path .gitignore -Value "`r`n.env"

Write-File 'README.md' @'
# frontend

React + TypeScript + Vite + Tailwind CSS v4 SPA (Public, Camper, Owner, Admin areas).

```powershell
npm install
npm run dev     # http://localhost:5173
npm run build
```

Fill `VITE_SUPABASE_ANON_KEY` in `.env` from `npm run status` in `database/`.
'@

# ================================================================= backend
Write-Step 'backend'
Set-Location $Root
New-Item -ItemType Directory -Path backend | Out-Null
Set-Location (Join-Path $Root 'backend')
npm init -y | Out-Null; Assert-Ok 'npm init'
npm pkg set name=backend private=true type=module "scripts.dev=tsx watch src/server.ts" `
  "scripts.build=tsc" "scripts.start=node dist/server.js" "scripts.test=vitest run" "scripts.typecheck=tsc --noEmit"
Assert-Ok 'npm pkg set'
npm pkg delete main; Assert-Ok 'npm pkg delete'
npm install express cors helmet pg @supabase/supabase-js jose zod; Assert-Ok 'npm install (deps)'
npm install -D typescript tsx vitest supertest @types/node @types/express @types/cors @types/pg @types/supertest
Assert-Ok 'npm install (dev deps)'

New-Dirs @('src/db', 'src/middleware', 'src/utils',
           'src/modules/campsites', 'src/modules/owner', 'src/modules/bookings', 'src/modules/community',
           'src/modules/admin', 'src/modules/chat', 'src/modules/tools', 'src/modules/profile',
           'src/modules/notifications')

Write-File 'tsconfig.json' @'
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
'@

Write-File 'src/config/env.ts' @'
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
'@

Write-File 'src/types/express.d.ts' @'
import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: 'camper' | 'owner' | 'admin'; status: 'active' | 'suspended' }
  }
}
'@

Write-File 'src/app.ts' @'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})
'@

Write-File 'src/server.ts' @'
import { app } from './app.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {
  console.log(`backend listening on http://localhost:${env.PORT}`)
})
'@

Write-File 'tests/health.test.ts' @'
import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../src/app.js'

test('GET /health', async () => {
  const res = await request(app).get('/health')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ ok: true })
})
'@

Write-File '.env.example' @'
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=
AI_SERVICE_URL=http://localhost:8080
AI_SERVICE_TOKEN=change-me
TOOL_API_TOKEN=change-me-too
'@
Copy-Item .env.example .env

Write-File '.gitignore' @'
node_modules
dist
coverage
.env
*.log
'@

Write-File 'README.md' @'
# backend

Node.js + Express + TypeScript REST API: auth middleware, domain services,
chat session service and the built-in tool catalog used by the AI service.

```powershell
npm install
npm run dev        # http://localhost:4000/health
npm run typecheck
npm test
```

Imports between source files use the `.js` extension (`import { app } from './app.js'`), required by Node ESM.
'@

# ================================================================= ai
Write-Step 'ai'
Set-Location $Root
New-Item -ItemType Directory -Path ai | Out-Null
Set-Location (Join-Path $Root 'ai')
uv init --bare --name vietcamp-ai --python 3.12; Assert-Ok 'uv init'
uv add google-adk fastapi "uvicorn[standard]" httpx pydantic; Assert-Ok 'uv add'
uv add --dev pytest; Assert-Ok 'uv add --dev'
Add-Content -Path pyproject.toml -Value "`r`n[tool.pytest.ini_options]`r`npythonpath = [`".`"]"

Write-File 'app/__init__.py' ''
Write-File 'app/main.py' @'
from fastapi import FastAPI

app = FastAPI(title="VietCamp AI service")


@app.get("/health")
def health() -> dict:
    return {"ok": True}
'@
Write-File 'app/agent.py' @'
# Google ADK LlmAgent: Gemini on Vertex AI + tools from app/tools.py
'@
Write-File 'app/tools.py' @'
# search_campsites, get_campsite, get_availability -> backend /internal/tools/*
'@
Write-File 'app/runner.py' @'
# Builds an in-memory ADK session from the history sent by the backend (stateless per request)
'@
Write-File 'app/schemas.py' @'
from pydantic import BaseModel


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    history: list[ChatTurn]
    message: str


class ChatResponse(BaseModel):
    reply: str
    filters: dict = {}
    campsite_ids: list[str] = []
'@
Write-File 'app/instructions.md' @'
You are the VietCamp assistant. Turn the user's request into search filters and call the tools.
Only recommend campsites returned by the tools. Never invent campsites, prices or availability.
'@
Write-File 'tests/test_health.py' @'
from fastapi.testclient import TestClient

from app.main import app


def test_health():
    assert TestClient(app).get("/health").json() == {"ok": True}
'@

Write-File 'Dockerfile' @'
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY app ./app
ENV PORT=8080
CMD ["sh", "-c", "uv run --no-sync uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
'@
Write-File '.dockerignore' @'
.venv
.env
tests
__pycache__
'@

Write-File '.env.example' @'
PORT=8080
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=asia-southeast1
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GEMINI_MODEL=
AI_SERVICE_TOKEN=change-me
BACKEND_TOOLS_URL=http://localhost:4000/internal/tools
TOOL_API_TOKEN=change-me-too
'@
Copy-Item .env.example .env

Write-File '.gitignore' @'
.venv
__pycache__/
*.pyc
.pytest_cache
.env
'@

Write-File 'README.md' @'
# ai

Stateless Python AI service (Google ADK + Gemini on Vertex AI), deployed to Cloud Run.

```powershell
uv sync
uv run uvicorn app.main:app --reload --port 8080   # http://localhost:8080/health
uv run pytest
```

Deploy: `gcloud run deploy vietcamp-ai --source . --region asia-southeast1` (service account with the Vertex AI User role).
'@

# ================================================================= database
Write-Step 'database'
Set-Location $Root
New-Item -ItemType Directory -Path database | Out-Null
Set-Location (Join-Path $Root 'database')
npm init -y | Out-Null; Assert-Ok 'npm init'
npm pkg set name=database private=true type=module `
  "scripts.test=node tests/schema.test.mjs supabase/migrations/20261123000000_initial_schema.sql" `
  "scripts.start=supabase start" "scripts.stop=supabase stop" "scripts.reset=supabase db reset" "scripts.status=supabase status"
Assert-Ok 'npm pkg set'
npm pkg delete main; Assert-Ok 'npm pkg delete'
npm install -D supabase @electric-sql/pglite; Assert-Ok 'npm install'
npx supabase init; Assert-Ok 'supabase init'

New-Dirs @('supabase/migrations', 'docs', 'tests')
if ($hasPlanning) {
  Copy-Item (Join-Path $PlanningDir 'database-schema.sql')        'supabase\migrations\20261123000000_initial_schema.sql'
  Copy-Item (Join-Path $PlanningDir 'database-schema.dbml')       'docs\schema.dbml'
  Copy-Item (Join-Path $PlanningDir 'database-schema.drawio')     'docs\schema.drawio'
  Copy-Item (Join-Path $PlanningDir 'database-schema.drawio.png') 'docs\schema.drawio.png'
  Copy-Item (Join-Path $PlanningDir 'database-schema.test.mjs')   'tests\schema.test.mjs'
  Remove-Item -Force 'supabase\migrations\.gitkeep', 'docs\.gitkeep', 'tests\.gitkeep'
}
Write-File 'supabase/seed.sql' @'
-- Demo data ported from the prototype (campsites, users, bookings, reviews ...)
'@

Write-File '.gitignore' @'
node_modules
.env
supabase/.temp
supabase/.branches
'@

Write-File 'README.md' @'
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
'@

# ================================================================= docker
Write-Step 'docker'

# --- frontend: static build served by nginx (Vite env values are baked in at build time)
Set-Location (Join-Path $Root 'frontend')
Write-File 'Dockerfile' @'
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL VITE_SUPABASE_URL=$VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
'@
Write-File 'nginx.conf' @'
server {
  listen 80;
  root /usr/share/nginx/html;
  location / {
    try_files $uri /index.html;
  }
}
'@
Write-File '.dockerignore' @'
node_modules
dist
.env
'@

# --- backend: compile TypeScript, run with production dependencies only
Set-Location (Join-Path $Root 'backend')
Write-File 'Dockerfile' @'
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]
'@
Write-File '.dockerignore' @'
node_modules
dist
tests
.env
'@

# --- ai: Dockerfile was written above (also used for Cloud Run)

# --- database: one-shot container that applies migrations + seed to the Supabase Postgres
Set-Location (Join-Path $Root 'database')
Write-File 'Dockerfile' @'
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY supabase ./supabase
CMD ["sh", "-c", "npx supabase db push --remote=\"$DATABASE_URL\" --include-seed --yes"]
'@
Write-File '.dockerignore' @'
node_modules
docker
docs
tests
.env
'@

# --- Supabase self-hosting stack (official files from github.com/supabase/supabase/docker)
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'git is needed to download the Supabase docker files' }
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("supabase-docker-" + [guid]::NewGuid().ToString('N'))
git clone --depth 1 --filter=blob:none --sparse https://github.com/supabase/supabase.git $tmp; Assert-Ok 'git clone supabase'
git -C $tmp sparse-checkout set docker; Assert-Ok 'git sparse-checkout'
Copy-Item -Recurse (Join-Path $tmp 'docker') (Join-Path $Root 'database\docker')
Remove-Item -Recurse -Force $tmp

# Local secrets: Supabase demo values + VietCamp values. Change them before any shared deployment.
$envLines = Get-Content (Join-Path $Root 'database\docker\.env.example')
$envLines = $envLines -replace '^SITE_URL=.*', 'SITE_URL=http://localhost:5173'
$extra = @(
  '', '############', '# VietCamp services', '############',
  'AI_SERVICE_TOKEN=change-me', 'TOOL_API_TOKEN=change-me-too',
  'GOOGLE_CLOUD_PROJECT=', 'GOOGLE_CLOUD_LOCATION=asia-southeast1', 'GEMINI_MODEL=',
  '# gcloud config folder holding application_default_credentials.json (gcloud auth application-default login)',
  'GCLOUD_CONFIG_DIR=${APPDATA}/gcloud'
)
Set-Location $Root
[IO.File]::WriteAllLines((Join-Path $Root '.env.example'), [string[]]($envLines + $extra))
[IO.File]::WriteAllLines((Join-Path $Root '.env'), [string[]]($envLines + $extra))
[IO.File]::WriteAllLines((Join-Path $Root 'database\docker\.env'), [string[]]$envLines)

# --- root compose: Supabase stack + migrations + backend + ai + frontend
Write-File 'docker-compose.yml' @'
name: vietcamp

include:
  - database/docker/docker-compose.yml

services:
  migrate:
    build: ./database
    environment:
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable
    depends_on:
      db:
        condition: service_healthy
      auth:
        condition: service_healthy
      storage:
        condition: service_healthy
    restart: "no"

  backend:
    build: ./backend
    environment:
      PORT: 4000
      CORS_ORIGIN: http://localhost:5173
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable
      SUPABASE_URL: http://kong:8000
      SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY}
      AI_SERVICE_URL: http://ai:8080
      AI_SERVICE_TOKEN: ${AI_SERVICE_TOKEN}
      TOOL_API_TOKEN: ${TOOL_API_TOKEN}
    ports:
      - "4000:4000"
    depends_on:
      migrate:
        condition: service_completed_successfully

  ai:
    build: ./ai
    environment:
      PORT: 8080
      GOOGLE_GENAI_USE_VERTEXAI: "TRUE"
      GOOGLE_CLOUD_PROJECT: ${GOOGLE_CLOUD_PROJECT}
      GOOGLE_CLOUD_LOCATION: ${GOOGLE_CLOUD_LOCATION}
      GEMINI_MODEL: ${GEMINI_MODEL}
      GOOGLE_APPLICATION_CREDENTIALS: /gcp/application_default_credentials.json
      AI_SERVICE_TOKEN: ${AI_SERVICE_TOKEN}
      TOOL_API_TOKEN: ${TOOL_API_TOKEN}
      BACKEND_TOOLS_URL: http://backend:4000/internal/tools
    volumes:
      - ${GCLOUD_CONFIG_DIR}:/gcp:ro
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:4000/api/v1
        VITE_SUPABASE_URL: http://localhost:${KONG_HTTP_PORT}
        VITE_SUPABASE_ANON_KEY: ${ANON_KEY}
    ports:
      - "5173:80"
    depends_on:
      - backend
'@

$rootIgnore = @('database/docker/volumes/db/data/', 'database/docker/volumes/storage/')
$existing = Get-Content '.gitignore'
$missing = $rootIgnore | Where-Object { $existing -notcontains $_ }
if ($missing) { Add-Content -Path '.gitignore' -Value ($missing -join "`r`n") }

# ================================================================= verify
Write-Step 'verifying'
Set-Location (Join-Path $Root 'backend');  npm run typecheck; Assert-Ok 'backend typecheck'; npm test; Assert-Ok 'backend test'
Set-Location (Join-Path $Root 'ai');       uv run pytest -q; Assert-Ok 'ai test'
if ($hasPlanning) { Set-Location (Join-Path $Root 'database'); npm test; Assert-Ok 'database schema test' }
Set-Location (Join-Path $Root 'frontend'); npm run build; Assert-Ok 'frontend build'

Set-Location $Root
Write-Host "`nDone: frontend/, backend/, ai/, database/ are ready." -ForegroundColor Green
Write-Host @'
Run the whole system (Docker Desktop must be running), from this folder:
  docker compose up --build

  frontend  http://localhost:5173
  backend   http://localhost:4000/health
  ai        http://localhost:8080/health
  Supabase  http://localhost:8000  (Studio login: DASHBOARD_USERNAME / DASHBOARD_PASSWORD in .env)

Before the AI chat works: fill GOOGLE_CLOUD_PROJECT and GEMINI_MODEL in .env and run
  gcloud auth application-default login

Then review and commit:  git add . ; git commit -m "chore: scaffold services and docker setup" ; git push
'@
