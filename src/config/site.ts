/**
 * Site / CDN origins for the dual-domain deployment:
 * - www.9ump.com  → main site (HTML, SEO, SW, user-facing URLs)
 * - pdf.yunno.net → static asset CDN (JS/CSS/fonts/workers with hash)
 *
 * Asset base is controlled at build time via VITE_ASSET_BASE
 * (e.g. https://pdf.yunno.net/). Do not use CDN origin for canonical/SEO.
 */

export const SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/$/, '') ||
  'https://www.9ump.com'

/** CDN origin used only for documentation / runtime CDN checks */
export const CDN_ORIGIN =
  (import.meta.env.VITE_CDN_ORIGIN as string | undefined)?.replace(/\/$/, '') ||
  'https://pdf.yunno.net'

export function siteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
