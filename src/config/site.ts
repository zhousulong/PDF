/**
 * Canonical site origin. All user-facing URLs and assets live on www.9ump.com.
 */

export const SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/$/, '') ||
  'https://www.9ump.com'

export function siteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
