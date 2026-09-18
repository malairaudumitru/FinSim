import { normalizeApiError } from '../api/apiClient'

/**
 * Shows the global error modal only for a genuine backend 500 (unhandled exception,
 * carries errorKey+errorId) — network errors, 4xx validation, etc. stay local to the caller.
 */
export function reportIfServerError(err: unknown, showError: (key: string, errorId: string) => void) {
    const normalized = normalizeApiError(err)
    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
        showError(normalized.errorKey, normalized.errorId)
    }
}

/** Wraps an action call: on failure, reports a genuine 500 to the global modal, then rethrows
 *  so the caller's own local error handling (form messages, etc.) still runs. */
export async function reportingCall<T>(
    promise: Promise<T>,
    showError: (key: string, errorId: string) => void,
): Promise<T> {
    try {
        return await promise
    } catch (err) {
        reportIfServerError(err, showError)
        throw err
    }
}
