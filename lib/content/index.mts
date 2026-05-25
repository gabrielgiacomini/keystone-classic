import mongoose from 'mongoose';
import keystone from '../../index.mjs';
import { userCanAccessKeystone, type KeystoneAccessUser } from '../canAccessKeystone.mjs';
import Page from './page.mjs';
import Types from './types/index.mjs';

// ---------------------------------------------------------------------------
// Types shared within this module
// ---------------------------------------------------------------------------

/** Shape of a stored content document returned by Mongoose queries. */
interface AppContentDoc {
	key: string;
	content: { data: Record<string, unknown> };
	history: { data: Record<string, unknown> }[];
	lastChangeDate: number;
	save(): Promise<AppContentDoc>;
}

/** Minimal Mongoose Model surface used by this module. */
type AppContentModel = mongoose.Model<AppContentDoc>;

/** Callback used for fetch / store operations. */
type ContentCallback = (err: Error | { error: string; message: string } | null, data?: unknown) => void;

/** Options passed to `editable()`. */
interface EditableOptions {
	list?: string;
	id?: string;
}

/** Structural type for Page instances (page.mjs is JS, no declarations available). */
interface PageInstance {
	key: string;
	populate(data?: Record<string, unknown>): Record<string, unknown>;
	validate(data: unknown): Record<string, unknown>;
	clean(data: Record<string, unknown>): Record<string, unknown>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}
	const prototype: unknown = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}

function defaultsDeep(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
	Object.keys(source).forEach((key) => {
		const sourceValue = source[key];
		const targetValue = target[key];
		if (targetValue === undefined) {
			target[key] = sourceValue;
		} else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
			defaultsDeep(targetValue, sourceValue);
		}
	});
	return target;
}

// ---------------------------------------------------------------------------
// Content class
// ---------------------------------------------------------------------------

/**
 * Content.
 */
class Content {
	pages: Record<string, PageInstance> = {};
	AppContent: AppContentModel | null = null;
	Page!: typeof Page;
	Types!: typeof Types;


	fetch (page: string | null | undefined | ContentCallback, callback?: ContentCallback): void {
		if (typeof page === 'function') {
			callback = page;
			page = null;
		}
		if (callback == null) {
			throw new TypeError('keystone.content.fetch() requires a callback');
		}
		const cb = callback;
		const content = this;
		if (!this.AppContent) {
			return cb({ error: 'invalid page', message: 'No pages have been registered.' });
		}
		if (page) {
			const pageKey: string = page as string;
			const pageObj = this.pages[pageKey];
			if (!pageObj) {
				return cb({ error: 'invalid page', message: 'The page ' + pageKey + ' does not exist.' });
			}
			this.AppContent.findOne({ key: pageKey }).exec().then(function (result: AppContentDoc | null) {
				return cb(null, pageObj.populate(result ? result.content.data : {}));
			}, function (err: unknown) {
				return cb(err instanceof Error ? err : { error: 'unknown', message: String(err) }, null);
			});
		} else {
			const pageKeys = Object.keys(content.pages);
			if (!pageKeys.length) {
				return cb(null, {});
			}
			this.AppContent.find({ key: { $in: pageKeys } }).limit(pageKeys.length).exec().then(function (results: AppContentDoc[]) {
				const data: Record<string, unknown> = {};
				results.forEach(function (i: AppContentDoc) {
					const pg = content.pages[i.key];
					if (pg) {
						data[i.key] = pg.populate(i.content.data);
					}
				});
				Object.values(content.pages).forEach(function (i: PageInstance) {
					if (!data[i.key]) {
						data[i.key] = i.populate();
					}
				});
				return cb(null, data);
			}, function (err: unknown) {
				return cb(err instanceof Error ? err : { error: 'unknown', message: String(err) }, null);
			});
		}
	}


	store (page: string, contentData: Record<string, unknown>, callback: ContentCallback): void {
		const pageObj = this.pages[page];
		if (!pageObj) {
			return callback({ error: 'invalid page', message: 'The page ' + page + ' does not exist.' });
		}
		let validatedContent: Record<string, unknown>;
		try {
			validatedContent = pageObj.validate(contentData);
		} catch (err) {
			return callback(err instanceof Error ? err : new Error(String(err)));
		}
		const self = this;
		const pageKey = page;
		const appContent = this.AppContent;
		if (!appContent) {
			return callback({ error: 'invalid page', message: 'No pages have been registered.' });
		}
		appContent.findOne({ key: pageKey }).exec().then(function (doc: AppContentDoc | null) {
			let activeDoc: AppContentDoc;
			if (doc) {
				doc.history.push(doc.content);
				defaultsDeep(validatedContent, doc.content.data);
				activeDoc = doc;
			} else {
				activeDoc = new appContent({ key: pageKey });
			}
			const selfPage = self.pages[pageKey];
			activeDoc.content = { data: selfPage ? selfPage.clean(validatedContent) : validatedContent };
			activeDoc.lastChangeDate = Date.now();
			activeDoc.save().then(function (saved: AppContentDoc) { callback(null, saved); }, callback);
		}, callback);
	}


	page (key: string, page?: PageInstance): PageInstance {
		if (arguments.length === 1) {
			const existing = this.pages[key];
			if (!existing) {
				throw new Error('keystone.content.page() Error: page ' + key + ' cannot be retrieved before being registered.');
			}
			return existing;
		}
		this.initModel();
		if (this.pages[key]) {
			throw new Error('keystone.content.page() Error: page ' + key + ' cannot be registered more than once.');
		}
		this.pages[key] = page as unknown as PageInstance;
		return page as unknown as PageInstance;
	}


	initModel (): void {
		if (this.AppContent) return;
		const contentSchemaDef = {
			createdAt: { type: Date, default: Date.now },
			data: { type: mongoose.Schema.Types.Mixed },
		};
		const ContentSchema = new mongoose.Schema(contentSchemaDef);
		const PageSchema = new mongoose.Schema({
			key: { type: String, index: true },
			lastChangeDate: { type: Date, index: true },
			content: contentSchemaDef,
			history: [ContentSchema],
		}, { collection: 'app_content' });
		this.AppContent = mongoose.model<AppContentDoc>('App_Content', PageSchema);
	}


	editable (user: KeystoneAccessUser, options: EditableOptions): string | undefined {
		if (!userCanAccessKeystone(user)) return undefined;
		if (options.list) {
			const list = keystone.lists[options.list];
			if (!list) return JSON.stringify({ type: 'error', err: 'list not found' });
			const data: Record<string, unknown> = {
				type: 'list',
				path: list.getAdminURL(),
				singular: list.singular,
				plural: list.plural,
			};
			if (options.id) data.id = options.id;
			return JSON.stringify(data);
		}
		return undefined;
	}
}

const content = new Content();
content.Page = Page;
content.Types = Types;
export type { Content };
export default content;
