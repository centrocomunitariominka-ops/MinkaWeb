import { STATS_ID } from "./stats";

export async function saveSiteStats(supabase, items) {
  const { error } = await supabase
    .from("site_stats")
    .upsert({ id: STATS_ID, items, updated_at: new Date().toISOString() });
  if (error) throw error;
}
