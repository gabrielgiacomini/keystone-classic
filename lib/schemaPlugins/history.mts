import keystoneSingleton from '../../index.mjs';
import type { KeystoneList } from '../list.mjs';

const historyModelSuffix = '_revisions';

/**
 * Minimal schema interface used by the history plugin.
 * Provides loosely-typed `pre`/`add` hooks sufficient for the history plugin
 * without coupling to the full Mongoose Schema generic machinery.
 */
interface HistorySchema {
	add(def: Record<string, unknown>): void;
	pre(event: 'save', fn: (this: HistoryDoc, next: (err?: unknown) => void) => void): void;
	pre(event: 'deleteOne', options: { document: true; query: false }, fn: (this: HistoryDoc, next: (err?: unknown) => void) => void): void;
}

function getHistoryModelName(list: KeystoneList): string {
	const opts = list.options as { schema: { collection: string } };
	return opts.schema.collection + historyModelSuffix;
}

interface HistoryMongoose {
	Schema: {
		new(def: Record<string, unknown>, opts?: Record<string, unknown>): HistorySchema & {
			add(def: Record<string, unknown>): void;
		};
		Types: { ObjectId: unknown; Mixed: unknown };
	};
	models: Record<string, unknown>;
	model(name: string, schema: HistorySchema, collection: string): { new(doc: Record<string, unknown>): { save(): Promise<unknown> } };
}

function getHistoryModel(
	list: KeystoneList,
	userModel: string | undefined,
	keystone: typeof keystoneSingleton
): { new(doc: Record<string, unknown>): { save(): Promise<unknown> } } {
	const mg = keystone.mongoose as unknown as HistoryMongoose;
	const collection = getHistoryModelName(list);
	const schema = new mg.Schema({
		i: { type: mg.Schema.Types.ObjectId, ref: collection },
		t: { type: Date, index: true, required: true },
		o: { type: String, index: true, required: true },
		c: { type: [String], index: true },
		d: { type: mg.Schema.Types.Mixed, required: true },
	}, { id: true, versionKey: false });

	if (userModel) {
		schema.add({ u: { type: mg.Schema.Types.ObjectId, ref: userModel } });
	}
	return mg.model(collection, schema, collection);
}

/**
 * Mongoose document shape as seen by the history plugin's pre hooks.
 */
interface HistoryDoc {
	/** Internal revision counter, incremented on each save. */
	__rev?: number;
	/** Document _id as a string. */
	id?: string;
	/** True when this document has not yet been saved to the database. */
	isNew: boolean;
	/** Returns true if a specific path has been modified. */
	isModified(path: string): boolean;
	/** Returns a plain-object snapshot of the document. */
	toObject(): Record<string, unknown>;
	/** The user making the request (attached by Keystone middleware). */
	_req_user?: { _id?: unknown; id?: unknown };
}

export default function history(this: KeystoneList): void {
	const keystone = keystoneSingleton;
	const list = this;
	const collectionName = getHistoryModelName(list);
	const mg = keystone.mongoose as unknown as HistoryMongoose;

	if (list.get('inherits')
		&& collectionName.includes(historyModelSuffix, collectionName.length - historyModelSuffix.length)
		&& collectionName in mg.models) {
		console.log('List/model already exists for ' + collectionName + '.\nWon\'t re-create, keystone continuing.');
		return;
	}

	const userModel = keystone.get('user model') as string | undefined;
	const HistoryModel = getHistoryModel(this, userModel, keystone);

	// Attach the history model to the list so it can be accessed externally.
	(list as KeystoneList & Record<string, unknown>)['HistoryModel'] = HistoryModel;

	// Cast list.schema to the loosely-typed HistorySchema so that the typed
	// pre() and add() calls below compile without fighting Mongoose generics.
	// JUSTIFIED: list.schema is a fully valid Mongoose Schema at runtime;
	// this cast only relaxes the overload resolution for hook registration.
	const schema = list.schema as unknown as HistorySchema;
	schema.add({ __rev: Number } as Record<string, unknown>);

	schema.pre('save', function (this: HistoryDoc, next: (err?: unknown) => void) {
		this.__rev = (typeof this.__rev === 'number') ? this.__rev + 1 : 1;
		const data = this.toObject();
		delete data['_id'];
		delete data['__v'];
		delete data['__rev'];

		const doc: Record<string, unknown> = {
			i: this.id,
			t: Date.now(),
			o: this.isNew ? 'c' : 'u',
			c: [],
			d: data,
		};

		for (const path in list.fields) {
			if (this.isModified(path)) { (doc['c'] as string[]).push(path); }
		}
		if (list.autokey) {
			const autokeyPath = (list.autokey as { path: string }).path;
			if (this.isModified(autokeyPath)) { (doc['c'] as string[]).push(autokeyPath); }
		}
		if (userModel && this._req_user) { doc['u'] = this._req_user._id || this._req_user.id || null; }

		new HistoryModel(doc).save().then(function () { next(); }, next);
	});

	schema.pre('deleteOne', { document: true, query: false }, function (this: HistoryDoc, next: (err?: unknown) => void) {
		const data = this.toObject();
		data['__v'] = undefined;
		const doc: Record<string, unknown> = { t: Date.now(), o: 'd', d: data };
		if (userModel && this._req_user) { doc['u'] = this._req_user._id || this._req_user.id || null; }
		new HistoryModel(doc).save().then(function () { next(); }, next);
	});
}
