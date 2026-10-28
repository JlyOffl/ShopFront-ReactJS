import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/** Turns any RTK Query error (FetchBaseQueryError | SerializedError) into one user-facing sentence. */
export const toErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') return 'Something went wrong. Please try again.';

  if ('status' in error) {
    const { status } = error as FetchBaseQueryError;
    if (status === 'FETCH_ERROR') return 'We could not reach the server. Check your connection and try again.';
    if (status === 'PARSING_ERROR') return 'The server sent an unexpected response.';
    if (status === 'TIMEOUT_ERROR') return 'The request timed out. Please try again.';
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
    return `Request failed (${String(status)}).`;
  }

  // Thrown by the gateway's schema validation (transformResponse)
  if ('name' in error && error.name === 'ZodError') return 'The server sent an unexpected response.';

  if ('message' in error && typeof error.message === 'string') return error.message;
  return 'Something went wrong. Please try again.';
};
