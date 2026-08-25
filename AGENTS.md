# Mishaum Point — house calendar app (two households)

Shared calendar + finance app for the Mishaum Point house. Tracks who has the
main house when, exclusive nights per household (JFP / MRP), room assignments,
maintenance/operating ledger, message board, and house info. React 18 + Vite,
Supabase backend. Two large base64 images (HERO_IMG painting, BURGEE_IMG
yacht-club burgee) are embedded in `src/App.jsx` (~400KB raw).

## Deployed stack (from Claude Cowork notes, see docs/)
- Repo: github.com/haraldparker-cyber/mishaum-house (public)
- Hosting: Vercel `mishaum-house` → live at mishaum-house.vercel.app; pushes to `main` auto-deploy
- Data: Supabase project `mishaum-house` (ref `bkycchgazaszgljjwvqf`); tables: bookings, maintenance, board, houseinfo, settings
- Env vars (Vercel only): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — see `.env.example`; do NOT store the anon key in this repo's tracked files

## Key files
- `src/App.jsx` — whole app in one file (calendar, finance, board, house info)
- `src/supabaseStore.js` — app-shape ↔ SQL column mapping + sync logic
- `src/supabaseClient.js` — Supabase client from env vars
- `finance-redesign-preview.html` — standalone HTML preview used before shipping the v29 finance redesign
- `docs/mishaum-app-infra.md` — full infra + deploy path (which worked best, pitfalls)
- `docs/mishaum-app-conventions.md` — UI conventions Harald settled on (day-click modal, act-button icons, hero framing, tab structure, finance page layout)

## Dev
`npm install && npm run dev` — local Vite server. `npm run build` to verify a
clean production build before shipping. Node 24 / npm 11 on this machine.
