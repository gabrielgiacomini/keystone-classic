import { encodeHTMLEntities } from '../utils/html.mjs';
import type { KeystoneList } from '../list.mjs';

type MongooseDoc = { get(path: string): unknown };

export default function getDocumentName(this: KeystoneList, doc: MongooseDoc, escape?: boolean): string {
	const nameField = this.nameField as (undefined | { format(doc: MongooseDoc): string });
	const name = String(nameField ? nameField.format(doc) : doc.get(this.namePath));
	return escape ? encodeHTMLEntities(name) : name;
}
