# Mishaum Point house app

This is the real, permanently-hosted version of the house app — same features
as before (calendar, holds, maintenance ledger, message board, house info),
now backed by a Supabase database instead of the Claude artifact's storage.

## What you need to do with this folder

1. Unzip it.
2. On GitHub, open your `mishaum-house` repository.
3. Click **"uploading an existing file"** (or **Add file → Upload files**).
4. Drag in **everything inside this unzipped folder** — all the files and the
   `src` folder together — then click **Commit changes**.
5. Do **not** upload the `node_modules` folder if you happen to see one —
   there isn't one in this zip, but if it ever reappears, skip it. Vercel
   builds that automatically.

That's it for GitHub. From there, continue with Phase 4 and Phase 5 of the
setup tracker (importing into Vercel, then adding the two Environment
Variables — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

## What's inside

- `src/App.jsx` — the whole app (calendar, maintenance, board, house info).
  Same code as the Claude artifact version, with only the storage layer swapped.
- `src/supabaseStore.js` — translates the app's save/load calls into
  Supabase database calls. This is the only real "new" logic.
- `src/supabaseClient.js` — connects to your Supabase project using the two
  Environment Variables you'll set in Vercel.
- Everything else (`package.json`, `vite.config.js`, `index.html`, `main.jsx`)
  is standard scaffolding that makes this a real, buildable website.
