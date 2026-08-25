# Mishaum Point house app

Shared calendar + finance app for the Mishaum Point house (two households:
John's / JFP and Polly's / MRP). Tracks who has the main house when, exclusive
nights per household, room assignments, a finance ledger, a message board, and
house info. React 18 + Vite single-page app backed by Supabase.

Live at: **https://mishaum-house.vercel.app**

## Repo / deploy model

- **Repo:** `github.com/haraldparker-cyber/mishaum-house` (public)
- **Hosting:** Vercel project `mishaum-house`. Pushing to `main` auto-builds
  and promotes to production. Nothing else is required.
- **Data:** Supabase project `mishaum-house` (ref `bkycchgazaszgljjwvqf`).
  Tables: `bookings`, `maintenance`, `board`, `houseinfo`, `settings`.
- **Env vars (Vercel only):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  See `.env.example` for the variable names. Never commit real values; the anon
  key is intentionally a publishable key baked into the deployed bundle.

## Local development

```bash
npm install
npm run dev        # local Vite server
npm run build      # verify a clean production build before shipping
```

The app reads the two `VITE_*` vars from the environment. If you don't want to
point at production data locally, create a `.env.local` (gitignored) with the
Supabase URL and anon key.

## Shipping a change

1. Edit the code.
2. `npm run build` — confirm it compiles.
3. Commit and push to `main`:

```bash
git add -A
git commit -m "describe the change"
git push origin main
```

4. Vercel auto-deploys. Verify on the live site afterward (desktop and phone),
   especially any visual change — see `docs/mishaum-app-conventions.md`.

## Key files

- `src/App.jsx` — the entire application (calendar, finance, board, house
  info) plus the whole stylesheet as a CSS template literal. Two large base64
  images (HERO_IMG, BURGEE_IMG) are embedded here (~73% of the file). Treat
  lines 16 and 18 as opaque; never reformat this file.
- `src/supabaseStore.js` — app-shape ↔ SQL column mapping + sync logic.
- `src/supabaseClient.js` — Supabase client from env vars.
- `docs/mishaum-app-infra.md` — full infra + deploy notes and pitfalls.
- `docs/mishaum-app-conventions.md` — UI conventions (day-click modal,
  act-button icons, hero framing, finance layout).

## Notes

- The Finance tab's internal state/component/table are still named
  `maintenance` (renamed label only) — search for "maintenance", not "finance".
- Finance ledger currently contains example/seed rows marked "(example)" — see
  the Finance tab before trusting any number.
- See `docs/mishaum-app-infra.md` for deploy gotchas and known footguns.
