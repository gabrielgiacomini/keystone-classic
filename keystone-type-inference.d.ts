import { KeystoneDocument, KeystoneFieldOptions, KeystoneTypeConstructor } from './index';
import * as mongoose from 'mongoose';

// A mapping from Keystone Field Types to TypeScript primitive types
type KeystoneFieldTypeMap = {
    Text: string;
    Number: number;
    Boolean: boolean;
    Date: Date;
    Datetime: Date;
    Html: string;
    Textarea: string;
    Url: string;
    Key: string;
    Color: string;
    Password: string;
    Email: string;
    TextArray: string[];
    NumberArray: number[];
    DateArray: Date[];
    Relationship: mongoose.Types.ObjectId; // Base type is a single ObjectId
    // Add other field types here...
    [key: string]: any;
};

// A helper type to get the base TypeScript type from a Keystone field type constructor
type GetBaseType<T extends KeystoneTypeConstructor> = T['properName'] extends keyof KeystoneFieldTypeMap
    ? KeystoneFieldTypeMap[T['properName']]
    : any;

// A helper type to resolve the final type based on field options
type ResolveKeystoneFieldType<TFieldOptions extends KeystoneFieldOptions> =
    // Handle Relationship fields with the 'many' option
    TFieldOptions['type']['properName'] extends 'Relationship'
        ? TFieldOptions['many'] extends true
            ? GetBaseType<TFieldOptions['type']>[]
            : GetBaseType<TFieldOptions['type']>
        : GetBaseType<TFieldOptions['type']>;

// A helper type to determine if a field is nullable
type IsNullable<TFieldOptions extends KeystoneFieldOptions> =
    TFieldOptions['required'] extends true
        ? false
        : TFieldOptions['default'] extends undefined
            ? true
            : false;

// The main configuration object type
type KeystoneListConfig<TFields, TMethods> = {
    fields: { [K in keyof TFields]: KeystoneFieldOptions & { type: KeystoneTypeConstructor } };
    methods?: TMethods;
};

// The core inference utility
export type InferKeystoneDocument<T extends KeystoneListConfig<any, any>> = {
    // Map over the fields and apply the type resolution and nullability logic
    [K in keyof T['fields']]: IsNullable<T['fields'][K]> extends true
        ? ResolveKeystoneFieldType<T['fields'][K]> | undefined
        : ResolveKeystoneFieldType<T['fields'][K]>;
} & {
    // Map over the methods
    [K in keyof T['methods']]: T['methods'][K];
} & KeystoneDocument;
