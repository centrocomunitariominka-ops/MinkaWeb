export const STATS_ID = "main";

export const DEFAULT_STATS = [
  { value: "+140", label: "familias acompañadas" },
  { value: "+12", label: "barrios alcanzados" },
  { value: "+13", label: "talleres activos" },
  { value: "+30", label: "voluntarios sumados" },
  { value: "+50", label: "bolsones entregados" },
];

export async function getSiteStats(supabase) {
  const { data, error } = await supabase
    .from("site_stats")
    .select("items")
    .eq("id", STATS_ID)
    .maybeSingle();
  if (error) throw error;
  return data?.items ?? null;
}
