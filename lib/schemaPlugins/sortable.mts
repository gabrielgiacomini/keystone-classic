import type { KeystoneList } from '../list.mjs';

/**
 * Minimal interface for the Mongoose document inside a schema.pre hook.
 * Provides the properties that `sortable` actually accesses on the document
 * at hook time, without coupling to the full Mongoose Document generics.
 */
interface SortableDoc {
	/** The sortOrder field value as set on the document. */
	sortOrder?: number;
	/** True when this is a new (unsaved) document. */
	isNew: boolean;
}

/**
 * Mongoose schema plugin that adds a `sortOrder` field and a `reorderItems`
 * static method to the schema.  Applied by `lib/list/register.mts` when
 * `list.get('sortable')` is truthy.
 */
export default function sortable(this: KeystoneList): void {
	const list = this;

	this.add({ sortOrder: { type: Number, index: true, hidden: true } });

	this.schema.pre('save', function (this: SortableDoc, next: () => void) {
		if (typeof this.sortOrder === 'number') { return next(); }

		const item = this;

		const addLast = function (done: () => void) {
			// JUSTIFIED: list.model is typed over DocumentFor<TFields> at the list level,
			// but sortable is a generic plugin that does not know TFields.  We access
			// model as unknown first to avoid an unsafe cross-shape cast.
			const model = list.model as unknown as {
				findOne(): { sort(s: string): { exec(): Promise<{ sortOrder?: number } | null> } };
				where(s: string): { updateMany(q: Record<string, unknown>): { exec(): Promise<unknown> } };
			};
			model.findOne().sort('-sortOrder').exec().then(function (max) {
				item.sortOrder = (max?.sortOrder) ? max.sortOrder + 1 : 1;
				done();
			}, function () {
				item.sortOrder = 1;
				done();
			});
		};

		if (list.get('sortable') === 'unshift') {
			const model = list.model as unknown as {
				where(s: string): { updateMany(q: Record<string, unknown>): { exec(): Promise<unknown> } };
			};
			model.where('sortOrder').updateMany({ $inc: { sortOrder: 1 } })
				.exec()
				.then(function () {
					item.sortOrder = 1;
					next();
				}, function (err: unknown) {
					console.log('err', err);
					return addLast(next);
				});
		} else {
			addLast(next);
		}
	});

	this.schema.statics['reorderItems'] = function reorderItems(id: string, prevOrder: number, newOrder: number, cb: (err: unknown, doc?: unknown) => void) {
		prevOrder = parseFloat(String(prevOrder));
		newOrder = parseFloat(String(newOrder));

		const whichWay = (newOrder > prevOrder) ? -1 : 1;
		const gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		const lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;

		return list.model
			.bulkWrite([
				{
					updateMany: {
						filter: { sortOrder: { $gte: gte, $lte: lte } } as Record<string, unknown>,
						update: { $inc: { sortOrder: whichWay } },
					},
				},
				{
					updateOne: {
						filter: { _id: id } as Record<string, unknown>,
						update: { $set: { sortOrder: newOrder } },
					},
				},
			] as Parameters<typeof list.model.bulkWrite>[0], { ordered: true })
			.then(function () {
				return (list.model as unknown as { findOne(q: Record<string, unknown>): { exec(): Promise<unknown> } }).findOne({ _id: id }).exec();
			})
			.then(function (doc: unknown) { cb(null, doc); }, function (err: unknown) {
				console.log('err', err);
				cb(err);
			});
	};
}
