import { api } from './fetch.js';
import type { FieldMeta } from '../fields/types.js';

export interface ListItem {
  id: string;
  name?: string;
  fields?: Record<string, unknown>;
  [key: string]: unknown;
}
export interface ListResponse { results: ListItem[]; count: number }
export interface ItemResponse { item: ListItem }

export interface AdminFieldOption {
  value: string | number;
  label: string;
}

export interface AdminFieldMeta {
  path: string;
  label: string;
  fieldType: FieldMeta['fieldType'] | string;
  options?: AdminFieldOption[];
  refList?: string;
  required?: boolean;
  noedit?: boolean;
  nocol?: boolean;
  nosort?: boolean;
  hidden?: boolean;
  initial?: boolean;
  defaultValue?: unknown;
  many?: boolean;
  numeric?: boolean;
  emptyOption?: boolean;
  [key: string]: unknown;
}

export type AdminColumnMeta =
  | string
  | {
      path?: string;
      field?: string;
      key?: string;
      label?: string;
      [key: string]: unknown;
    };

export type AdminUiElement =
  | { type: 'field'; field: string | AdminFieldMeta; [key: string]: unknown }
  | { type: 'heading'; content: string; options?: Record<string, unknown>; [key: string]: unknown }
  | { type: string; [key: string]: unknown };

export interface RelationshipMeta {
  path: string;
  ref: string;
  refPath: string;
  label?: string;
  [key: string]: unknown;
}

export interface AdminListMeta {
  key: string;
  path: string;
  label: string;
  singular?: string;
  plural?: string;
  namePath?: string;
  nameField?: AdminFieldMeta | null;
  fields: Record<string, AdminFieldMeta>;
  columns?: AdminColumnMeta[];
  defaultColumns?: string | string[];
  initialFields?: string[];
  uiElements?: AdminUiElement[];
  relationships?: Record<string, RelationshipMeta>;
  nocreate?: boolean;
  nodelete?: boolean;
  noedit?: boolean;
  perPage?: number;
  [key: string]: unknown;
}

export interface AdminNavListMeta {
  key: string;
  path: string;
  label: string;
  external?: boolean;
  [key: string]: unknown;
}

export interface AdminNavSectionMeta {
  key: string;
  label: string;
  lists: AdminNavListMeta[];
  [key: string]: unknown;
}

export interface AdminNavMeta {
  flat?: boolean;
  sections?: AdminNavSectionMeta[];
  by?: {
    list?: Record<string, AdminNavSectionMeta>;
    section?: Record<string, AdminNavSectionMeta>;
  };
  [key: string]: unknown;
}

export interface AdminMetaResponse {
  lists: Record<string, AdminListMeta> | AdminListMeta[];
  nav: AdminNavMeta;
  orphanedLists: AdminNavListMeta[];
}

export interface ListFetchOptions {
  fields?: string[];
  expandRelationshipFields?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function withQuery(path: string, params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  return query ? `${path}?${query}` : path;
}

function normalizeListItem(value: unknown): ListItem {
  if (!isRecord(value)) return { id: '' };

  const rawId = value['id'] ?? value['_id'];
  const id = typeof rawId === 'string' ? rawId : rawId == null ? '' : String(rawId);
  const fields = isRecord(value['fields']) ? value['fields'] : undefined;

  return {
    ...value,
    id,
    ...(fields === undefined ? {} : { fields }),
  };
}

function normalizeItemResponse(value: unknown): ItemResponse {
  const item = isRecord(value) && isRecord(value['item'])
    ? value['item']
    : value;

  return { item: normalizeListItem(item) };
}

function normalizeCount(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeListResponse(value: unknown): ListResponse {
  if (Array.isArray(value)) {
    return { results: value.map(normalizeListItem), count: value.length };
  }

  if (!isRecord(value)) return { results: [], count: 0 };

  const results = Array.isArray(value['results'])
    ? value['results'].map(normalizeListItem)
    : [];

  return {
    results,
    count: normalizeCount(value['count'], results.length),
  };
}

function normalizeAdminMeta(value: unknown): AdminMetaResponse {
  if (!isRecord(value)) {
    return { lists: {}, nav: {}, orphanedLists: [] };
  }

  const lists = Array.isArray(value['lists']) || isRecord(value['lists'])
    ? value['lists'] as AdminMetaResponse['lists']
    : {};
  const nav = isRecord(value['nav']) ? value['nav'] as AdminNavMeta : {};
  const orphanedLists = Array.isArray(value['orphanedLists'])
    ? value['orphanedLists'].filter(isRecord) as AdminNavListMeta[]
    : [];

  return { lists, nav, orphanedLists };
}

function appendListFetchOptions(
  params: Record<string, string>,
  options: ListFetchOptions = {},
): Record<string, string> {
  if (options.fields !== undefined && options.fields.length > 0) {
    params['fields'] = options.fields.join(',');
  }
  if (options.expandRelationshipFields === true) {
    params['expandRelationshipFields'] = 'true';
  }
  return params;
}

export const fetchAdminMeta = () =>
  api<unknown>('').then(normalizeAdminMeta);

export const fetchList = (
  listKey: string,
  params: Record<string, string>,
  options: ListFetchOptions = {},
) =>
  api<unknown>(
    withQuery(`/${encodeURIComponent(listKey)}`, appendListFetchOptions(params, options)),
  ).then(normalizeListResponse);

export const fetchItem = (listKey: string, id: string, options: ListFetchOptions = {}) =>
  api<unknown>(
    withQuery(
      `/${encodeURIComponent(listKey)}/${encodeURIComponent(id)}`,
      appendListFetchOptions({}, options),
    ),
  ).then(normalizeItemResponse);

export const createItem = (listKey: string, data: Record<string, unknown>) =>
  api<unknown>(`/${encodeURIComponent(listKey)}/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalizeItemResponse);

export const updateItem = (listKey: string, id: string, data: Record<string, unknown>) =>
  api<unknown>(`/${encodeURIComponent(listKey)}/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalizeItemResponse);

export const deleteItems = (listKey: string, ids: string[]) =>
  api<{ ok?: boolean; ids?: string[]; count?: number }>(`/${encodeURIComponent(listKey)}/delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });

export const fetchCounts = () => api<{ counts: Record<string, number> }>('/counts');

export function getAdminLists(meta: AdminMetaResponse | undefined): AdminListMeta[] {
  if (meta === undefined) return [];
  return Array.isArray(meta.lists) ? meta.lists : Object.values(meta.lists);
}

export function resolveListMeta(
  meta: AdminMetaResponse | undefined,
  routeList: string,
): AdminListMeta | undefined {
  return getAdminLists(meta).find((list) => list.key === routeList || list.path === routeList);
}

export function getAdminListRoutePaths(meta: AdminMetaResponse | undefined): string[] {
  const seen = new Set<string>();
  const add = (value: unknown) => {
    if (typeof value === 'string' && value.length > 0) seen.add(value);
  };

  for (const section of meta?.nav.sections ?? []) {
    for (const list of section.lists ?? []) {
      if (list.external !== true) add(list.path || list.key);
    }
  }

  if (seen.size === 0) {
    for (const list of getAdminLists(meta)) {
      add(list.path || list.key);
    }
  }

  return [...seen];
}

export function getItemFieldValue(item: ListItem | undefined, fieldPath: string): unknown {
  if (item === undefined) return undefined;
  if (item.fields !== undefined && hasOwn(item.fields, fieldPath)) {
    return item.fields[fieldPath];
  }
  if (hasOwn(item, fieldPath)) {
    return item[fieldPath];
  }
  return undefined;
}

export function resolveAdminField(
  list: AdminListMeta,
  field: string | AdminFieldMeta | AdminColumnMeta | undefined,
): AdminFieldMeta | undefined {
  if (field === undefined) return undefined;
  if (typeof field === 'string') return list.fields[field];
  if (!isRecord(field)) return undefined;

  const path = typeof field['path'] === 'string'
    ? field['path']
    : typeof field['field'] === 'string'
      ? field['field']
      : typeof field['key'] === 'string'
        ? field['key']
        : undefined;

  if (path === undefined) return undefined;

  const fieldMeta = list.fields[path];
  if (fieldMeta !== undefined) {
    return {
      ...fieldMeta,
      label: typeof field['label'] === 'string' ? field['label'] : fieldMeta.label,
    };
  }

  if (typeof field['fieldType'] === 'string') {
    return field as AdminFieldMeta;
  }

  return undefined;
}

export function toFieldMeta(field: AdminFieldMeta): FieldMeta {
  const fieldType = field.fieldType || 'text';
  const options = Array.isArray(field.options) ? field.options : [];
  const refList = typeof field.refList === 'string' ? field.refList : '';

  return {
    ...field,
    fieldType,
    label: field.label || field.path,
    path: field.path,
    ...(fieldType === 'select' ? {
      options,
      numeric: field.numeric === true,
      emptyOption: field.emptyOption !== false,
    } : {}),
    ...(fieldType === 'relationship' ? { refList, many: field.many === true } : {}),
  } as FieldMeta;
}

function stringifyUnknown(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function normalizeTextObject(value: unknown, keys: string[]): Record<string, string> {
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(
    keys.map((key) => [key, stringifyUnknown(source[key])]),
  );
}

function normalizeRelationshipValue(value: unknown): { id: string; label?: string } | null {
  if (value === null || value === undefined || value === '') return null;

  if (Array.isArray(value)) {
    const labels = value
      .map((item) => normalizeRelationshipValue(item))
      .filter((item): item is { id: string; label?: string } => item !== null)
      .map((item) => item.label ?? item.id);

    return labels.length === 0
      ? null
      : { id: labels.join(', '), label: labels.join(', ') };
  }

  if (isRecord(value)) {
    const rawId = value['id'] ?? value['_id'];
    const rawLabel = value['label'] ?? value['name'];
    const id = stringifyUnknown(rawId ?? rawLabel);
    const label = rawLabel === undefined ? undefined : stringifyUnknown(rawLabel);
    return id || label ? { id, label } : null;
  }

  return { id: stringifyUnknown(value), label: stringifyUnknown(value) };
}

function normalizeRelationshipValues(value: unknown): Array<{ id: string; label?: string }> {
  if (!Array.isArray(value)) {
    const normalized = normalizeRelationshipValue(value);
    return normalized === null ? [] : [normalized];
  }
  return value
    .map((item) => normalizeRelationshipValue(item))
    .filter((item): item is { id: string; label?: string } => item !== null);
}

function normalizeCoordinate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeGeopointValue(value: unknown): { lat: number | null; lng: number | null } {
  if (Array.isArray(value)) {
    return {
      lng: normalizeCoordinate(value[0]),
      lat: normalizeCoordinate(value[1]),
    };
  }

  if (isRecord(value)) {
    return {
      lat: normalizeCoordinate(value['lat']),
      lng: normalizeCoordinate(value['lng'] ?? value['lon']),
    };
  }

  return { lat: null, lng: null };
}

function normalizeDateInputValue(value: unknown): string {
  const text = stringifyUnknown(value);
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}

function normalizeDatetimeInputValue(value: unknown): string {
  const text = stringifyUnknown(value);
  if (!text) return '';
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime()) && /(?:Z|[+-]\d{2}:?\d{2})$/.test(text)) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  const match = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  return match ? `${match[1]}T${match[2]}` : text;
}

function normalizeDateArrayValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeDateInputValue).filter((item) => item.length > 0);
}

function normalizeStringArrayValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(stringifyUnknown).filter((item) => item.length > 0);
}

function normalizeNumberArrayValue(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'number' ? item : Number(item)))
    .filter((item) => Number.isFinite(item));
}

export function getFieldComponentValue(field: AdminFieldMeta, value: unknown): unknown {
  switch (field.fieldType) {
    case 'boolean':
      return Boolean(value);
    case 'cloudinary':
      return field.multiple === true
        ? Array.isArray(value) ? value : []
        : isRecord(value) ? value : null;
    case 'cloudinaryimages':
      return Array.isArray(value) ? value : [];
    case 'cloudinaryimage':
    case 'file':
    case 'localfile':
      return isRecord(value) ? value : null;
    case 'geopoint':
      return normalizeGeopointValue(value);
    case 'location':
      return isRecord(value) ? value : {};
    case 'markdown':
      return isRecord(value) ? { md: stringifyUnknown(value['md']) } : { md: stringifyUnknown(value) };
    case 'name':
      return normalizeTextObject(value, ['first', 'last']);
    case 'password':
      return Boolean(value);
    case 'relationship':
      return field.many === true
        ? normalizeRelationshipValues(value)
        : normalizeRelationshipValue(value);
    case 'date':
      return normalizeDateInputValue(value);
    case 'datearray':
      return normalizeDateArrayValue(value);
    case 'datetime':
      return normalizeDatetimeInputValue(value);
    case 'code':
    case 'color':
    case 'email':
    case 'html':
    case 'key':
    case 'select':
    case 'text':
    case 'textarea':
    case 'url':
      return stringifyUnknown(value);
    case 'number':
    case 'money':
      return value ?? '';
    case 'numberarray':
      return normalizeNumberArrayValue(value);
    case 'textarray':
      return normalizeStringArrayValue(value);
    default:
      return value === null || value === undefined ? '' : value;
  }
}

function relationshipSubmissionValue(field: AdminFieldMeta, value: unknown): unknown {
  if (field.many === true) {
    return normalizeRelationshipValues(value).map((item) => item.id);
  }
  return normalizeRelationshipValue(value)?.id ?? null;
}

function geopointSubmissionValue(value: unknown): unknown {
  const { lat, lng } = normalizeGeopointValue(value);
  return lat === null || lng === null ? '' : [lng, lat];
}

function passwordSubmissionEntries(field: AdminFieldMeta, value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return { [field.path]: value };

  const password = stringifyUnknown(value['password']);
  const confirm = stringifyUnknown(value['confirm']);
  return {
    [field.path]: password,
    [`${field.path}_confirm`]: confirm,
  };
}

function markdownSubmissionValue(value: unknown): unknown {
  return isRecord(value) && hasOwn(value, 'md')
    ? stringifyUnknown(value['md'])
    : value;
}

export function prepareItemData(fields: AdminFieldMeta[], data: Record<string, unknown>): Record<string, unknown> {
  const fieldsByPath = new Map(fields.map((field) => [field.path, field]));
  const prepared: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(data)) {
    const field = fieldsByPath.get(path);
    if (field?.fieldType === 'relationship') {
      prepared[path] = relationshipSubmissionValue(field, value);
    } else if (field?.fieldType === 'geopoint') {
      prepared[path] = geopointSubmissionValue(value);
    } else if (field?.fieldType === 'password') {
      Object.assign(prepared, passwordSubmissionEntries(field, value));
    } else if (field?.fieldType === 'markdown') {
      prepared[path] = markdownSubmissionValue(value);
    } else {
      prepared[path] = value;
    }
  }

  return prepared;
}

export function getFallbackTextField(path: string): AdminFieldMeta {
  return {
    path,
    label: path,
    fieldType: 'text',
  };
}

// ---------------------------------------------------------------------------
// Date formatting helpers — match the legacy admin's "May 1st 2026" output
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getOrdinalSuffix(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Formats a date as `"May 1st 2026"`, matching the legacy admin's moment
 * `MMMM Do YYYY` format. Returns an empty string for falsy/invalid input.
 * @param value Date input (string, Date, or number).
 */
export function formatOrdinalDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return '';
  const month = MONTH_NAMES[date.getMonth()] ?? '';
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
}

/**
 * Formats a datetime as `"May 1st 2026, 3:04:05 pm"`, matching the legacy
 * admin's moment `MMMM Do YYYY, h:mm:ss a` format.
 */
export function formatOrdinalDatetime(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = formatOrdinalDate(date);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const meridiem = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${datePart}, ${hours}:${minutes}:${seconds} ${meridiem}`;
}
