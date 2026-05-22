import type { Request } from 'express';
import type { KeystoneList } from './list.mjs';

/** Minimal Mongoose document shape used by UpdateHandler. */
interface UpdateHandlerDoc {
	id?: unknown;
	[key: string]: unknown;
}

/**
 * Options accepted by both the UpdateHandler constructor and process().
 * Constructor-level options become the base; process() options are merged on top.
 */
export interface UpdateHandlerOptions {
	/** Subset of fields to update; if omitted, all editable fields are updated. */
	fields?: string | string[];
	/** The authenticated user; defaults to `req.user` if not supplied. */
	user?: unknown;
	/** Override the noedit flag for all fields. */
	ignoreNoEdit?: boolean;
	/**
	 * Uploaded files keyed by fieldname.
	 * Defaults to `req.files` if not supplied.
	 */
	files?: Record<string, Express.Multer.File | Express.Multer.File[]> 
	/**
	 * When `true`, flash all error types. When `'validation'`, flash only
	 * validation errors. When `'update'`, flash only field/update errors.
	 * When falsy (default), no flash messages are emitted.
	 */
	flashErrors?: boolean | 'validation' | 'update';
	/** Custom error message title used in flash messages. */
	errorMessage?: string;
	/** When truthy, logs errors to the console. */
	logErrors?: unknown;
	/** Passed through to `list.updateItem` as `required` option. */
	required?: string | string[] | Record<string, boolean>;
	/** Passed through to `list.updateItem` as `requiredMessages` option. */
	requiredMessages?: Record<string, string>;
	/** Passed through to `list.updateItem` as `invalidMessages` option. */
	invalidMessages?: Record<string, string>;
}

/**
 * Shape of a structured flash error message that Keystone passes to
 * `req.flash`. The `types/express.d.ts` Request augmentation widens the
 * connect-flash overload to accept `string | KeystoneFlashError` so callers
 * can pass rich objects without casts.
 */
export interface KeystoneFlashError {
	type: 'ValidationError' | 'UpdateError';
	title: string;
	list?: string[] 
}

/** Structured error object produced by `list.updateItem`. */
interface UpdateItemError {
	error?: string;
	name?: string;
	detail?: unknown;
	errors?: Record<string, { message: string }>;
}

/**
 * Callback passed to `process()`.  The `err` argument is `undefined` on
 * success and an `UpdateItemError`-shaped value on failure.
 */
export type ProcessCallback = (err?: UpdateItemError) => void;

/** Processes form submission for a list item, validating and updating fields. */
export class UpdateHandler {
	list: KeystoneList;
	item: UpdateHandlerDoc;
	req: Request;
	options: UpdateHandlerOptions;

/**
 * Creates an UpdateHandler for processing form submissions.
 * @param list - The Keystone list.
 * @param item - The Mongoose document to update.
 * @param req - The Express request.
 * @param options - Optional update options.
 */
	constructor (
		list: KeystoneList,
		item: UpdateHandlerDoc,
		req: Request,
		options?: UpdateHandlerOptions
	) {
		this.list = list;
		this.item = item;
		this.req = req;
		this.options = options || {};
	}

/**
 * Processes form submission data, validating and updating fields.
 * @param data - The submitted form data.
 * @param optionsOrCallback - Update options or completion callback.
 * @param callback - Optional completion callback.
 */
	process (
		data: Record<string, unknown>,
		optionsOrCallback?: UpdateHandlerOptions | ProcessCallback,
		callback?: ProcessCallback
	): void {

		let resolvedCallback: ProcessCallback;
		let resolvedOptions: UpdateHandlerOptions;

		if (typeof optionsOrCallback === 'function') {
			resolvedCallback = optionsOrCallback;
			resolvedOptions = {};
		} else {
			if (!callback) throw new TypeError('UpdateHandler.process: callback is required when first argument is options');
			resolvedCallback = callback;
			resolvedOptions = optionsOrCallback || {};
		}

		const item = this.item;
		const list = this.list;
		const req = this.req;
			const options: UpdateHandlerOptions = Object.assign({}, this.options, resolvedOptions);

			if (!options.user) {
				options.user = req.user;
			}

			if (!options.files) {
				options.files = req.files;
			}

		function flashErrors(err: UpdateItemError): void {
			const errorMessage = options.errorMessage || 'There was a problem saving your changes';
			function flashObject(msg: KeystoneFlashError): void {
				req.flash('error', msg);
			}
			if (err.error === 'validation errors') {
				if (options.flashErrors === true || options.flashErrors === 'validation') {
					const detail = err.detail as Array<{ error: string }> | undefined;
					flashObject({
						type: 'ValidationError',
						title: errorMessage,
						list: detail ? detail.map((d) => d.error) : undefined,
					});
				}
			} else if (err.name === 'ValidationError') {
				if (options.flashErrors === true || options.flashErrors === 'validation') {
					flashObject({
						type: 'ValidationError',
						title: errorMessage,
						list: err.errors ? Object.values(err.errors).map((e) => e.message) : undefined,
					});
				}
			} else if (err.error === 'field errors') {
				if (options.flashErrors === true || options.flashErrors === 'update') {
					const detail = err.detail as Array<{ error: string }> | undefined;
					flashObject({
						type: 'UpdateError',
						title: errorMessage,
						list: detail ? detail.map((d) => d.error) : undefined,
					});
				}
			} else {
				if (options.flashErrors === true || options.flashErrors === 'update') {
					const errors: string[] = [];
					if (typeof err.error === 'string') {
						errors.push(err.error);
					}
					if (typeof (err as { detail?: unknown }).detail === 'string') {
						errors.push((err as { detail: string }).detail);
					}
					flashObject({
						type: 'UpdateError',
						title: errorMessage,
						list: errors.length ? errors : undefined,
					});
				}
			}
		}

		this.list.updateItem(this.item, data, options as Parameters<KeystoneList['updateItem']>[2], function (err: unknown) {
			const typedErr = err as UpdateItemError | undefined;
			if (typedErr) {
				if (options.logErrors) {
					console.log('Error saving changes to ' + list.singular + ' ' + (item.id as string | undefined) + ':', typedErr);
				}
				if (options.flashErrors) {
					flashErrors(typedErr);
				}
			}
			resolvedCallback(typedErr);
		});

	}
}

export default UpdateHandler;
