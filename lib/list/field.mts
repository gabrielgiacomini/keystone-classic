import type { KeystoneList } from '../list.mjs';

type FieldOptionsInput = Record<string, unknown> & { type?: unknown; noedit?: boolean; note?: string; wysiwyg?: unknown };

function formatFieldConstructor(value: unknown): string {
	if (typeof value === 'function') return value.name || value.toString();
	return Object.prototype.toString.call(value);
}

export default function field(this: KeystoneList, path: string, options?: FieldOptionsInput): unknown {
	const Field = this.keystone.Field as unknown as { Types: Record<string, new (...a: unknown[]) => unknown>; new (...a: unknown[]): unknown };
	if (arguments.length === 1) {
		return this.fields[path];
	}
	if (typeof options === 'function') {
		options = { type: options };
	}
	if (this.get('noedit')) {
		(options as FieldOptionsInput).noedit = true;
	}
	if (!(options as FieldOptionsInput).note && this.get('notes')) {
		(options as FieldOptionsInput).note = (this.get('notes') as Record<string, string>)[path];
	}
	if (typeof (options as FieldOptionsInput).type !== 'function') {
		throw new Error('Fields must be specified with a type function');
	}
	const optType = (options as FieldOptionsInput).type as new (...a: unknown[]) => unknown;
	if (!(optType.prototype instanceof (Field as unknown as { new (...a: unknown[]): unknown }))) {
		if ((options as FieldOptionsInput).type === String) {
			(options as FieldOptionsInput).type = Field.Types['Text'];
		} else if ((options as FieldOptionsInput).type === Number) {
			(options as FieldOptionsInput).type = Field.Types['Number'];
		} else if ((options as FieldOptionsInput).type === Boolean) {
			(options as FieldOptionsInput).type = Field.Types['Boolean'];
			} else if ((options as FieldOptionsInput).type === Date) {
				(options as FieldOptionsInput).type = Field.Types['Datetime'];
			} else {
				throw new Error('Unrecognised field constructor: ' + formatFieldConstructor((options as FieldOptionsInput).type));
			}
		}
	const resolvedType = (options as FieldOptionsInput).type as { typeName?: string; name?: string; properName?: string };
	const rawTypeName = resolvedType.typeName || resolvedType.name;
	const typeName = rawTypeName ? (rawTypeName.endsWith('_') ? rawTypeName.slice(0, -1) : rawTypeName) : '';
	this.fieldTypes[typeName] = resolvedType.properName;
	if (typeName === 'html' && (options as FieldOptionsInput).wysiwyg) {
		this.fieldTypes['wysiwyg'] = true;
	}
	const TypeCtor = (options as FieldOptionsInput).type as new (list: KeystoneList, path: string, opts: FieldOptionsInput) => { type: string };
	const f = new TypeCtor(this, path, options as FieldOptionsInput);
	(this.fields as Record<string, unknown>)[path] = f;
	this.fieldsArray.push(f);
	if (f.type === 'relationship') {
		this.relationshipFields.push(f as unknown as { path: string; [key: string]: unknown });
	}
	return f;
}
