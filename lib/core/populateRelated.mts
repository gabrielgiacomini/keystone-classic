import type { Keystone } from '../../index.mjs';
import type { Callback } from '../../types/keystone-callbacks.js';

interface PopulateRelatedDoc {
	populateRelated(relationships: unknown, callback: Callback): void;
}

export default function populateRelated(this: Keystone, docs: PopulateRelatedDoc | PopulateRelatedDoc[] | null | undefined, relationships: unknown, callback: Callback): Keystone {
	if (Array.isArray(docs)) {
		Promise.all(docs.map(function (doc: PopulateRelatedDoc) {
			return new Promise<void>(function (resolve, reject) {
				doc.populateRelated(relationships, function (err: Error | null) {
					if (err) reject(err); else resolve();
				});
			});
		})).then(function () { callback(null); }, callback as (err: unknown) => void);
	} else if (docs?.populateRelated) {
		docs.populateRelated(relationships, callback);
	} else {
		callback(null);
	}
	return this;
}
