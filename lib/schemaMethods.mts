import type { KeystoneDocument } from '../fields/types/Type.mjs';
import type { KeystoneListSchema, KeystoneSchemaMethod } from './list.mjs';

type KeystoneSchemaMethodRegistrationTarget = {
	schema: {
		methods: Record<string, unknown>;
	};
};

type SchemaDocumentFor<TList> =
	TList extends KeystoneSchemaMethodRegistrationList<infer TDocument>
		? TDocument
		: KeystoneDocument;

/**
 * Instance-first schema method shape accepted by Keystone's schema-method helper.
 *
 * @template TDocument - Keystone document instance passed as the first argument.
 * @template TArgs - Additional method arguments after the instance argument.
 * @template TReturn - Method return type.
 */
export type KeystoneInstanceFirstSchemaMethod<
	TDocument extends KeystoneDocument = KeystoneDocument,
	TArgs extends unknown[] = unknown[],
	TReturn = unknown,
> = (instance: TDocument, ...args: TArgs) => TReturn;

/**
 * Converts instance-first schema methods to Mongoose/Keystone `this`-bound methods.
 *
 * @template TMethods - Object map of instance-first schema methods.
 */
export type KeystoneInstanceMethodsToSchemaMethods<
	TMethods extends Record<string, unknown>,
> = {
	[TKey in keyof TMethods]: TMethods[TKey] extends (
		instance: infer TDocument,
		...args: infer TArgs
	) => infer TReturn
		? TDocument extends KeystoneDocument
			? (this: TDocument, ...args: TArgs) => TReturn
			: KeystoneSchemaMethod
		: never;
};

/**
 * Optional form of {@link KeystoneInstanceMethodsToSchemaMethods}.
 *
 * @template TMethods - Object map of instance-first schema methods.
 */
export type KeystoneOptionalSchemaMethods<
	TMethods extends Record<string, unknown>,
> = Partial<KeystoneInstanceMethodsToSchemaMethods<TMethods>>;

/**
 * Minimal Keystone list shape needed to register schema methods.
 *
 * @template TDocument - Document instance type bound to `schema.methods`.
 */
export type KeystoneSchemaMethodRegistrationList<
	TDocument extends KeystoneDocument = KeystoneDocument,
> = {
	schema: Pick<KeystoneListSchema<TDocument>, 'methods'>;
};

/**
 * Adds instance-first methods to a Keystone list as `this`-bound schema methods.
 *
 * @param list - Keystone list whose schema receives method wrappers.
 * @param schemaMethods - Object containing instance-first method functions only.
 * @returns The original list for fluent setup chains.
 */
export function addSchemaMethods<
	TList extends KeystoneSchemaMethodRegistrationTarget,
>(
	list: TList,
	schemaMethods: Record<string, unknown>,
): TList {
	const methods = schemaMethods;

	for (const methodName of Object.keys(methods)) {
		const method = methods[methodName];

		if (typeof method !== 'function') {
			throw new TypeError(
				`addSchemaMethods expected functions only; '${methodName}' is not a function`,
			);
		}

		const instanceFirstMethod = method as KeystoneInstanceFirstSchemaMethod<
			SchemaDocumentFor<TList>
		>;

		list.schema.methods[methodName] = function schemaMethodWrapper(
			this: SchemaDocumentFor<TList>,
			...args: unknown[]
		): unknown {
			return instanceFirstMethod(this, ...args);
		} as KeystoneSchemaMethod<SchemaDocumentFor<TList>>;
	}

	return list;
}

/**
 * Cloom-style alias for {@link addSchemaMethods}.
 *
 * @param list - Keystone list whose schema receives method wrappers.
 * @param schemaMethods - Object containing instance-first method functions only.
 * @returns The original list for fluent setup chains.
 */
export function addSchemaMethodsToKeystoneList<
	TList extends KeystoneSchemaMethodRegistrationTarget,
>(
	list: TList,
	schemaMethods: Record<string, unknown>,
): TList {
	return addSchemaMethods(list, schemaMethods);
}
