const BUCKET = "post-files";

export async function createPost(supabase, { title, excerpt, body, imageFile, pdfFile }) {
  const [imageUrl, pdfUrl] = await Promise.all([
    imageFile ? uploadFile(supabase, imageFile, "images") : null,
    pdfFile ? uploadFile(supabase, pdfFile, "pdfs") : null,
  ]);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      excerpt,
      body,
      image_url: imageUrl,
      pdf_url: pdfUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updatePost(supabase, id, { title, excerpt, body, imageFile, pdfFile }) {
  const updates = { title, excerpt, body };
  if (imageFile) {
    updates.image_url = await uploadFile(supabase, imageFile, "images");
  }
  if (pdfFile) {
    updates.pdf_url = await uploadFile(supabase, pdfFile, "pdfs");
  }

  const { error } = await supabase.from("posts").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deletePost(supabase, id, { imageUrl, pdfUrl } = {}) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;

  const paths = [imageUrl, pdfUrl].map(extractStoragePath).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }
}

async function uploadFile(supabase, file, folder) {
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function extractStoragePath(publicUrl) {
  if (!publicUrl) return null;
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
