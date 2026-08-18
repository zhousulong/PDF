/**
 * Canonical site origin. All user-facing URLs and assets live on www.9ump.com.
 * qfz.9ump.com is a stamp-only host: `/` is the tool, no homepage.
 */

export const SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/$/, '') ||
  'https://www.9ump.com'

export const STAMP_ORIGIN = 'https://qfz.9ump.com'

export const STAMP_ONLY_HOSTS = ['qfz.9ump.com']

export function getHostname(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hostname.toLowerCase()
}

export function isStampOnlyHost(hostname = getHostname()): boolean {
  return STAMP_ONLY_HOSTS.includes(hostname)
}

export function siteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
