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