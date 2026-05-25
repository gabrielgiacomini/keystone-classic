import { ApiError } from './fetch.js';

export type FieldErrors = Record<string, string[]>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getValidationFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError) || !isRecord(error.body)) return {};
  const detail = error.body['detail'];
  if (!isRecord(detail)) return {};

  const fieldErrors: FieldErrors = {};
  for (const [path, value] of Object.entries(detail)) {
    if (!isRecord(value)) continue;
    const message = value['error'];
    if (typeof message === 'string' && message.length > 0) {
      fieldErrors[path] = [message];
    }
  }
  return fieldErrors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
