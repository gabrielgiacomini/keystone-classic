/**
 * Document method that calls `getRelated` and assigns each populated
 * relationship result directly onto the document instance for serialisation.
 *
 * Typed as a function with `this` bound to a Mongoose document shape that
 * includes `getRelated`.  See `getRelated.mts` for the full signature.
 */

interface PopulateRelatedDoc {
	getRelated(
		rel: string | string[],
		callback: (err: unknown, results?: Record<string, unknown>) => void,
		nocollapse?: boolean
	): void;
	[key: string]: unknown;
}

export default function populateRelated(
	this: PopulateRelatedDoc,
	rel: string | string[],
	callback: (err: unknown, results?: Record<string, unknown>) => void
): void {
	if (typeof callback !== 'function') {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	const item = this;
	this.getRelated(rel, function (err: unknown, results?: Record<string, unknown>) {
		if (results) {
			Object.entries(results).forEach(function ([key, data]) {
				item[key] = data;
			});
		}
		callback(err, results);
	}, true);
}
