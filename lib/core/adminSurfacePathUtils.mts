import type { Keystone } from '../../index.mjs';

export type AdminClientMode = false | 'legacy' | 'next' | 'both';

export interface AdminSurfacePaths {
	adminLegacyPath: string;
	adminNextPath: string;
	adminApiPath: string;
}

type KeystoneLike = Pick<Keystone, 'get'>;

export function normalizeAdminPath(value: unknown, fallback: string, optionName: string): string {
	const raw = typeof value === 'string' && value.trim() ? value.trim() : fallback;
	const normalized = raw.replace(/^\/+|\/+$/g, '');
	if (!normalized) {
		throw new Error(`Keystone: '${optionName}' must not be empty.`);
	}
	return '/' + normalized;
}

export function getAdminLegacyPath(keystone: KeystoneLike): string {
	return normalizeAdminPath(keystone.get('admin legacy path'), 'keystone', 'admin legacy path');
}

export function getAdminNextPath(keystone: KeystoneLike): string {
	return normalizeAdminPath(keystone.get('admin next path'), 'keystone-next', 'admin next path');
}

export function getAdminApiPath(keystone: KeystoneLike): string {
	return normalizeAdminPath(keystone.get('admin api path'), 'keystone-api', 'admin api path');
}

export function getAdminSurfacePaths(keystone: KeystoneLike): AdminSurfacePaths {
	return {
		adminLegacyPath: getAdminLegacyPath(keystone),
		adminNextPath: getAdminNextPath(keystone),
		adminApiPath: getAdminApiPath(keystone),
	};
}

export function getAdminLegacyApiAliasPath(keystone: KeystoneLike): string {
	return getAdminLegacyPath(keystone) + '/api';
}

export function assertDistinctAdminSurfacePaths(paths: AdminSurfacePaths): void {
	const entries: Array<[keyof AdminSurfacePaths, string]> = [
		['adminLegacyPath', paths.adminLegacyPath],
		['adminNextPath', paths.adminNextPath],
		['adminApiPath', paths.adminApiPath],
	];
	const seen = new Map<string, keyof AdminSurfacePaths>();
	for (const [name, path] of entries) {
		const key = path.toLowerCase();
		const previous = seen.get(key);
		if (previous) {
			throw new Error(
				`Keystone: '${optionLabel(previous)}' and '${optionLabel(name)}' must be distinct after path normalization (${path}).`
			);
		}
		seen.set(key, name);
	}
}

function optionLabel(name: keyof AdminSurfacePaths): string {
	if (name === 'adminLegacyPath') return 'admin legacy path';
	if (name === 'adminNextPath') return 'admin next path';
	return 'admin api path';
}

function formatOptionValue(value: unknown): string {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return String(value);
	}
	return Object.prototype.toString.call(value);
}

export function getAdminClientMode(keystone: KeystoneLike): AdminClientMode {
	const raw = (keystone.get('admin ui') ?? 'legacy') as unknown;
	if (raw === false || raw === 'legacy' || raw === 'next' || raw === 'both') {
		return raw;
	}
	throw new Error(`Keystone: unknown 'admin ui' value "${formatOptionValue(raw)}". Expected false, 'legacy', 'next', or 'both'.`);
}

export function getAdminApiEnabled(keystone: KeystoneLike, adminClientMode: AdminClientMode = getAdminClientMode(keystone)): boolean {
	const raw = keystone.get('admin api') as unknown;
	void adminClientMode;
	if (raw === undefined || raw === null) {
		return !keystone.get('headless');
	}
	if (typeof raw !== 'boolean') {
		throw new Error(`Keystone: unknown 'admin api' value "${formatOptionValue(raw)}". Expected boolean.`);
	}
	return raw;
}

export function getAdminLegacyApiAliasEnabled(keystone: KeystoneLike): boolean {
	const raw = keystone.get('admin legacy api alias') as unknown;
	if (raw === undefined || raw === null) {
		return true;
	}
	if (typeof raw !== 'boolean') {
		throw new Error(`Keystone: unknown 'admin legacy api alias' value "${formatOptionValue(raw)}". Expected boolean.`);
	}
	return raw;
}
