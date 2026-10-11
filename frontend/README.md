# ThreatTrace
AI-Assisted Multi-Stage Cyberattack Reconstruction & Lateral Movement Detection — SOC/DFIR frontend.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```
Click **Continue with Demo Investigation** on `/login` to load the synthetic PC-03 → PC-05 → FILE-SERVER scenario.

## Production
```bash
npm run build && npm start
```

## Backend contract
All calls go through `src/lib/api.ts` (typed, Zod-validated uploads, timeout + friendly errors):
`POST /api/v1/ingest`, `POST /api/v1/analyze`, `GET /api/v1/dashboard`, `/incidents`, `/incidents/{id}`, `/incidents/{id}/timeline|graph|mitre|lateral-movement|next-targets`, `/hosts`, `/events`, `POST /api/v1/reports/{id}/generate`, `GET /api/v1/reports/{id}`.
Response types live in `src/lib/types.ts`. In demo mode the same functions are served from `src/lib/demo.ts`.

## Notes
- UI primitives in `src/components/ui.tsx` are shadcn-style (Tailwind, no CLI needed).
- Timeline/events are server-paginated (25/page); graph supports type filters, hide-normal, and path focus.
- Auth: no auth endpoint was specified, so sign-in is a session stub. Wire it in `src/app/login/page.tsx`.
- Investigation notes/status/bookmarks persist in browser localStorage until a backend endpoint exists.
