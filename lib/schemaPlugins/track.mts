import keystoneSingleton from '../../index.mjs';
import type { KeystoneList } from '../list.mjs';

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

/**
 * Mongoose document shape as seen by the track plugin's pre-save hook.
 * Provides only the properties and methods that `track` actually accesses.
 */
interface TrackDoc {
	/** True when this document has not yet been saved to the database. */
	isNew: boolean;
	/** True when any field has been modified since the last save. */
	isModified(): boolean;
	/** Get a field value by path. */
	get(path: string): unknown;
	/** Set a field value by path. */
	set(path: string, value: unknown): void;
	/** The user making the request (attached by Keystone middleware). */
	_req_user?: { _id?: unknown; id?: unknown };
}

export default function track(this: KeystoneList): void {
	const keystone = keystoneSingleton;
	const Types = keystone.Field.Types;

	const list = this;
	let options = list.get('track') as boolean | Record<string, boolean | string> | undefined;
	const userModel = keystone.get('user model');

	if (!options) { return; }

	const defaultOptions: Record<string, boolean | string> = {
		createdAt: false,
		createdBy: false,
		updatedAt: false,
		updatedBy: false,
	};
	const fields: Record<string, Record<string, unknown>> = {};

	if (typeof options !== 'boolean' && !isObject(options)) {
		throw new Error(
			'Invalid List "track" option for ' + list.key + '\n'
			+ '"track" must be a boolean or an object.\n\n'
			+ 'See http://v4.keystonejs.com/docs/database/#lists-options for more information.'
		);
	}

	if (typeof options === 'boolean') {
		options = { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true };
	}

	if (!options['createdAt'] && !options['createdBy'] && !options['updatedAt'] && !options['updatedBy']) {
		return;
	}

	options = Object.assign({}, defaultOptions, options) as Record<string, boolean | string>;

	Object.entries(options).forEach(function ([key, value]) {
		let fieldName: string;

		if (Object.prototype.hasOwnProperty.call(list.fields, key)) {
			throw new Error(
				'Invalid List "track" option for ' + list.key + '\n'
				+ '"' + key + '" is already defined in the Schema.'
			);
		}

		if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {
			if (typeof value !== 'boolean' && typeof value !== 'string') {
				throw new Error(
					'Invalid List "track" option for ' + list.key + '\n'
					+ '"' + key + '" must be a boolean or a string.\n\n'
					+ 'See http://v4.keystonejs.com/docs/database/#lists-options for more information.'
				);
			}

			if (value) {
				fieldName = value === true ? key : value;
				(options as Record<string, boolean | string>)[key] = fieldName;
				list.map(key, fieldName);

				switch (key) {
					case 'createdAt':
					case 'updatedAt':
						fields[fieldName] = { type: Date, noedit: true, collapse: true, index: true };
						break;
					case 'createdBy':
					case 'updatedBy':
						fields[fieldName] = { type: Types.Relationship, ref: userModel, noedit: true, collapse: true, index: true };
						break;
				}
			}
		} else {
			throw new Error(
				'Invalid List "track" option for ' + list.key + '\n'
				+ 'valid field options are "createdAt", "createdBy", "updatedAt", an "updatedBy".\n\n'
				+ 'See http://v4.keystonejs.com/docs/database/#lists-options for more information.'
			);
		}
	});

	list.add('Meta', fields as Parameters<typeof list.add>[0]);
	list.tracking = options;

	list.schema.pre('save', function (this: TrackDoc, next: () => void) {
		const now = new Date();
		const opts = options as Record<string, string | boolean>;
		if (this.isNew) {
			if (opts['createdAt'] && !this.get(String(opts['createdAt']))) { this.set(String(opts['createdAt']), now); }
			if (opts['createdBy'] && this._req_user && !this.get(String(opts['createdBy']))) { this.set(String(opts['createdBy']), this._req_user._id); }
		}
		if (this.isNew || this.isModified()) {
			if (opts['updatedAt']) { this.set(String(opts['updatedAt']), now); }
			if (opts['updatedBy'] && this._req_user) { this.set(String(opts['updatedBy']), this._req_user._id); }
		}
		next();
	});
}
