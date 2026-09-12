export function formatPostDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
