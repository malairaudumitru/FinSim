import type { TFunction } from 'i18next'
import type { NormalizedApiError } from '../api/apiClient'

// The backend returns fixed strings (mixed EN/RO) for expected business errors.
// Map each one to an i18n key so the user sees it in the interface language.
const BACKEND_MESSAGE_KEYS: Record<string, string> = {
    'Invalid email or password': 'auth.error_invalid_credentials',
    'Email already in use': 'auth.error_email_in_use',
    'Cod invalid sau expirat': 'auth.error_code_invalid_or_expired',
    'Too many attempts': 'auth.error_code_too_many_attempts',
    'Current password is incorrect': 'profile.error_current_password_wrong',
}

/** Localized text for a backend validation error, or undefined when the message is unknown
 *  (callers then fall back to their own localized generic message instead of raw backend text). */
export function apiErrorMessage(error: NormalizedApiError, t: TFunction): string | undefined {
    const key = error.message ? BACKEND_MESSAGE_KEYS[error.message] : undefined
    return key ? t(key) : undefined
}
