import type { KeystoneList } from '../list.mjs';

type MongooseQuery = { select(fields: string): void; populate(path: string, subpaths: string): void };

/**
 * Applies field selection and relationship population to a Mongoose query
 * based on an array of expanded column descriptors.
 */
export default function selectColumns(this: KeystoneList, q: MongooseQuery, cols: { path: string; populate?: { path: string; subpath: string } }[]): void {
	const select: string[] = [];
	const populate: Record<string, string[]> = {};
	cols.forEach(function (col) {
		select.push(col.path);
		if (col.populate) {
			const key = col.populate.path;
			const bucket = populate[key] ?? (populate[key] = []);
			bucket.push(col.populate.subpath);
		}
	});
	q.select(select.join(' '));
	for (const path in populate) {
		if (populate.hasOwnProperty(path)) {
			const subpaths = populate[path];
			if (subpaths) q.populate(path, subpaths.join(' '));
		}
	}
}
