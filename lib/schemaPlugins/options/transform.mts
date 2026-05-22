/**
 * Mongoose schema `toObject.transform` function.
 *
 * When a document has `_populatedRelationships` entries, copies the
 * in-memory populated arrays onto the plain-object output so the
 * serialised JSON carries the related documents.
 * @param doc - The original Mongoose document.
 * @param ret - The plain object being transformed.
 */
export default function transform(doc: Record<string, unknown>, ret: Record<string, unknown>): void {
	const populated = doc['_populatedRelationships'] as Record<string, boolean> | undefined;
	if (populated) {
		Object.entries(populated).forEach(function ([key, on]) {
			if (!on) return;
			ret[key] = doc[key];
		});
	}
}
