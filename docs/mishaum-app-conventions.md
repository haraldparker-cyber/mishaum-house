---
name: mishaum-app-conventions
description: "UI conventions for the Mishaum Point house app (calendar, icons, hero)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1a477f84-0918-4ef4-87ed-191c14e8a6b8
---

Conventions Harald has settled on for the Mishaum Point app (see [[mishaum-app-infra]]):

- Calendar day click: clicking anywhere on a day (a stay chip OR the empty cell) opens ONE unified `DayModal` — "Who's staying" (each overlapping household with dates, rooms, names; holds flagged) on top, then "Room availability", then "Add a stay". He disliked earlier versions where different click zones gave different views. Editing/deleting stays happens only in the Stays list below the calendar, not from the calendar modal.
- Row edit/delete icons use `<button className="act">` with Pencil/Trash2 at size 16, styled by `.mp .stay .act` / `.mp .infocard .act` (transparent, muted, hover). Keep new sections consistent with this.
- Hero banner: desktop uses `background-position:center 50%; min-height:250px` to show the full painting; mobile (`@media max-width:560px`) is pinned to `min-height:150px; center 42%` and he considers the mobile framing perfect — don't change mobile.
- Tabs are Calendar / Finance / Board / House Info. The "Finance" tab was formerly "Maintenance" (page var is still `page === "maintenance"`). The calendar page is full-width with no sidebar; finances are only on the Finance tab (Harald didn't want them visible on every calendar glance).
- Finance page REBUILT from first principles in v29 (2026-07-11, Harald approved a standalone HTML preview first, then had it shipped). Structure top-to-bottom: year pills (All time + each year) → dark **snapshot** (all-in cost, per-household, reserve balance, settle-up line) → **operating budget** by bucket (property tax / insurance / maintenance / utilities / association) with a stacked bar + capital callout → **reserve fund** (sinking fund: balance, sparkline trajectory, movement, runway warn <$25k) → **settle-up** (operating shared only, netted 50/50) → **usage pot** (bed-nights from bookings × rate) → **multi-year history** stacked bar chart + big-projects list → ledger rows. Driven entirely off the existing `maintenance` table via a category→kind model: `catKind()` maps category to operating / capital / reserve; `CAPITAL_CATS`={Capital project, Improvement}, `RESERVE_CATS`={Reserve contribution}; `OP_BUCKETS` rolls operating cats into 5 display buckets. Capital is reserve-funded so it's excluded from settle-up; reserve balance = Σ reserve contributions − Σ capital. No schema change. Example 2019–2026 data is seeded in Supabase (100 rows, ids `seed-0xx`, descriptions prefixed "(example)"). The old house-ledger dark card (exclusive-nights allowance meters) was removed; exclusive-night tally now shows compactly inside each usage-pot household card (`ex/allowance`).
- He tests on both desktop and the phone; verify visual changes on desktop at ~1060px hero width before shipping.
- Shipped v28 (2026-07-06, full code review pass): all deletes now `window.confirm` (shared multi-user data); pending holds never hard-block rooms in the stay form (shown as "on hold — TAG", still clickable — matches roomClashes); confirming a hold checks clashes first; `refresh()` re-pulls Supabase on visibilitychange (guarded by pendingSaves ref + open-modal ref, because persistTo whole-table sync would delete other households' newer rows if run on stale state); save failures show a banner; ids quoted in the store's not-in delete filter.
