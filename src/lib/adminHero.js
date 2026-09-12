import { HERO_ID } from "./hero";

const BUCKET = "post-files";

export async function saveHeroCampaign(
  supabase,
  { active, kicker, headline, body, background, imageFile }
) {
  const updates = {
    id: HERO_ID,
    active,
    kicker: kicker || null,
    headline: headline || null,
    body: body || null,
    background: background || null,
  };

  if (imageFile) {
    const path = `hero/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, imageFile);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    updates.image_url = data.publicUrl;
  }

  const { error } = await supabase.from("hero_campaign").upsert(updates);
  if (error) throw error;
}
