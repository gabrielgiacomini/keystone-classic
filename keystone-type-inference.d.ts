import { KeystoneDocument, KeystoneFieldOptions, KeystoneTypeConstructor } from './index';
import * as mongoose from 'mongoose';

// A mapping from Keystone Field Types to TypeScript types
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
    // For relationships, we'll use ObjectId for now as discussed.
    Relationship: mongoose.Types.ObjectId | mongoose.Types.ObjectId[];
    // Add other field types here...
    [key: string]: any;
};

// A helper type to get the TypeScript type from a Keystone field type constructor
type GetTypeFromConstructor<T extends KeystoneTypeConstructor> = T['properName'] extends keyof KeystoneFieldTypeMap
    ? KeystoneFieldTypeMap[T['properName']]
    : any;

// The main configuration object type
type KeystoneListConfig<TFields, TMethods> = {
    fields: { [K in keyof TFields]: KeystoneFieldOptions & { type: KeystoneTypeConstructor } };
    methods?: TMethods;
};

// The core inference utility
export type InferKeystoneDocument<T extends KeystoneListConfig<any, any>> = {
    [K in keyof T['fields']]: GetTypeFromConstructor<T['fields'][K]['type']>;
} & {
    [K in keyof T['methods']]: T['methods'][K];
} & KeystoneDocument;
