const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

/**
 * Backend-uploaded files (e.g. `/uploads/pdfs/xxx.pdf`) live on the API origin, not the
 * frontend origin — anything else (frontend `public/` assets, full URLs) is left as-is.
 */
export function resolveFileUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path
    if (path.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${path}`
    return path
}
