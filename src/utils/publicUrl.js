/**
 * Prefix `public/` asset paths with Vite `base` (needed for GitHub Pages project URLs).
 */
export function publicUrl(path) {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
