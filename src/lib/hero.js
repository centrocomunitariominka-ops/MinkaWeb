export const HERO_ID = "main";

export async function getHeroCampaign(supabase) {
  const { data, error } = await supabase
    .from("hero_campaign")
    .select("*")
    .eq("id", HERO_ID)
    .maybeSingle();
  if (error) throw error;
  return data;
}
