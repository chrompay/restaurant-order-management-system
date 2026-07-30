// Uploaded files (food images, avatars) are stored on the API server and
// referenced by the relative path Multer/express.static serve them at
// (e.g. "/uploads/foods/xyz.jpg"). Rendered as-is, that path resolves
// against the Vite dev server's own origin, not the API's, and 404s.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/api\/?$/, "");

export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
