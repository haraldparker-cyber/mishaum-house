import { supabase } from "./supabaseClient";

/* Field-name translation between the app's shape (used throughout the React
   component, unchanged from the original Claude-artifact version) and the
   SQL column names created by the setup script. Keeping this mapping in one
   place means the rest of the app never has to know it's talking to Supabase. */

const bookingToRow = (b) => ({
  id: b.id,
  family: b.family,
  type: b.type,
  status: b.status || "confirmed",
  start_date: b.start,
  end_date: b.end,
  rooms: b.rooms || [],
  members: b.members || [],
  people: b.people ?? (b.members ? b.members.length : 1),
  guests: b.guests ?? 0,
  notes: b.notes || "",
  assignments: b.assignments || {},
});
const rowToBooking = (r) => ({
  id: r.id, family: r.family, type: r.type, status: r.status,
  start: r.start_date, end: r.end_date, rooms: r.rooms || [],
  members: r.members || [],
  people: r.people, guests: r.guests, notes: r.notes || "",
  assignments: r.assignments || {},
});

const maintToRow = (m) => ({
  id: m.id, date: m.date, description: m.desc, amount: m.amount,
  payer: m.payer, category: m.category, shared: !!m.shared, notes: m.notes || "",
});
const rowToMaint = (r) => ({
  id: r.id, date: r.date, desc: r.description, amount: Number(r.amount),
  payer: r.payer, category: r.category, shared: r.shared, notes: r.notes || "",
});

const boardToRow = (p) => ({ id: p.id, body: p.text, posted_at: p.at });
const rowToBoard = (r) => ({ id: r.id, text: r.body, at: r.posted_at });

const infoToRow = (i) => ({ id: i.id, label: i.label, value: i.value });
const rowToInfo = (r) => ({ id: r.id, label: r.label, value: r.value });

const TABLES = {
  bookings: { toRow: bookingToRow, fromRow: rowToBooking },
  maintenance: { toRow: maintToRow, fromRow: rowToMaint },
  board: { toRow: boardToRow, fromRow: rowToBoard },
  houseinfo: { toRow: infoToRow, fromRow: rowToInfo },
};

// Replaces the full contents of a table with `items`, matching the old
// "overwrite the whole array" behavior of window.storage.set. Fine at this
// scale (a handful of households' worth of rows).
async function syncTable(table, items, toRow) {
  const rows = items.map(toRow);
  const ids = rows.map((r) => r.id);

  if (ids.length > 0) {
    const { error: delErr } = await supabase
      .from(table)
      .delete()
      .not("id", "in", `(${ids.map((id) => `"${String(id).replace(/"/g, '\\"')}"`).join(",")})`);
    if (delErr) throw delErr;
  } else {
    const { error: delAllErr } = await supabase.from(table).delete().neq("id", "");
    if (delAllErr) throw delAllErr;
  }

  if (rows.length > 0) {
    const { error: upErr } = await supabase.from(table).upsert(rows, { onConflict: "id" });
    if (upErr) throw upErr;
  }
}

export const store = {
  async load(key, fallback) {
    try {
      if (key === "settings") {
        const { data, error } = await supabase.from("settings").select("rate, allowance").eq("id", 1).maybeSingle();
        if (error || !data) return fallback;
        return { rate: data.rate, allowance: data.allowance };
      }
      const table = TABLES[key];
      if (!table) return fallback;
      const { data, error } = await supabase.from(key).select("*");
      if (error) { console.error(`Supabase load(${key}) failed:`, error.message); return fallback; }
      if (!data || data.length === 0) return fallback; // matches prior "seed with examples when empty" behavior
      return data.map(table.fromRow);
    } catch (e) {
      console.error(`store.load(${key}) error:`, e);
      return fallback;
    }
  },

  async save(key, value) {
    try {
      if (key === "settings") {
        const { error } = await supabase
          .from("settings")
          .upsert({ id: 1, rate: value.rate, allowance: value.allowance }, { onConflict: "id" });
        if (error) throw error;
        return true;
      }
      const table = TABLES[key];
      if (!table) return true;
      await syncTable(key, value, table.toRow);
      return true;
    } catch (e) {
      console.error(`store.save(${key}) error:`, e);
      return false;
    }
  },
};
