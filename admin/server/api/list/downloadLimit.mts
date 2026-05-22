export const DEFAULT_DOWNLOAD_LIMIT = 50000;
export const DOWNLOAD_LIMIT_OPTION = 'download limit';

interface KeystoneLike {
	get(key: string): unknown;
}

interface LimitableQuery {
	limit(count: number): unknown;
}

function normalizeDownloadLimit(value: unknown): number {
	const numericValue = typeof value === 'string' && value.trim() !== ''
		? Number(value)
		: value;

	if (typeof numericValue !== 'number' || !Number.isFinite(numericValue)) {
		return DEFAULT_DOWNLOAD_LIMIT;
	}

	const limit = Math.floor(numericValue);
	if (limit <= 0) {
		return DEFAULT_DOWNLOAD_LIMIT;
	}

	return limit;
}

export function resolveDownloadLimit(keystone: KeystoneLike): number {
	return normalizeDownloadLimit(keystone.get(DOWNLOAD_LIMIT_OPTION));
}

export function applyDownloadLimit(query: LimitableQuery, limit: number): void {
	query.limit(limit + 1);
}

export function isDownloadLimitExceeded(results: { length: number }, limit: number): boolean {
	return results.length > limit;
}

export function createDownloadLimitError(limit: number): { error: string; limit: number; message: string } {
	return {
		error: 'download limit exceeded',
		limit,
		message: 'Download matched more than ' + limit + ' items. Narrow the filters or raise the `' + DOWNLOAD_LIMIT_OPTION + '` option.',
	};
}
