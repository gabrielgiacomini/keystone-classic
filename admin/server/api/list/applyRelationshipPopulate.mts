interface PopulateResult {
	ok: boolean;
	invalid: string[];
}

interface PopulatableList {
	fields?: Record<string, { type?: string; path?: string }>;
	relationshipFields?: Array<{ path?: unknown }>;
}

interface PopulatableQuery {
	populate(path: string): this;
}

function relationshipPathsForList(list: PopulatableList): Set<string> {
	const allowed = new Set<string>();
	const fields = list.fields ?? {};
	for (const [key, field] of Object.entries(fields)) {
		if (field.type === 'relationship') {
			allowed.add(field.path ?? key);
		}
	}
	for (const field of list.relationshipFields ?? []) {
		if (typeof field.path === 'string') {
			allowed.add(field.path);
		}
	}
	return allowed;
}

function populatePathsFromValue(populate: unknown): string[] | null {
	if (typeof populate === 'string') {
		return populate.split(/[,\s]+/).map((path) => path.trim()).filter(Boolean);
	}
	if (Array.isArray(populate)) {
		const paths: string[] = [];
		for (const item of populate) {
			const itemPaths = populatePathsFromValue(item);
			if (!itemPaths) return null;
			paths.push(...itemPaths);
		}
		return paths;
	}
	if (populate && typeof populate === 'object' && typeof (populate as { path?: unknown }).path === 'string') {
		return populatePathsFromValue((populate as { path: string }).path);
	}
	return null;
}

export default function applyRelationshipPopulate(list: PopulatableList, query: PopulatableQuery, populate: unknown): PopulateResult {
	if (!populate) {
		return { ok: true, invalid: [] };
	}
	const paths = populatePathsFromValue(populate);
	if (!paths || !paths.length) {
		return { ok: false, invalid: ['populate'] };
	}
	const allowed = relationshipPathsForList(list);
	const uniquePaths = [...new Set(paths)];
	const invalid = uniquePaths.filter((path) => !allowed.has(path));
	if (invalid.length) {
		return { ok: false, invalid };
	}
	for (const path of uniquePaths) {
		query.populate(path);
	}
	return { ok: true, invalid: [] };
}
