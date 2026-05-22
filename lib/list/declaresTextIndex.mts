import type { KeystoneList } from '../list.mjs';

export default function declaresTextIndex(this: KeystoneList): boolean {
	const indexes = this.schema.indexes();
	for (const index of indexes) {
		const fields = index[0];
		const fieldNames = Object.keys(fields);
		for (const fieldName of fieldNames) {
			const val = fields[fieldName];
			if (typeof val === 'string' && val.toLowerCase() === 'text') return true;
		}
	}
	return false;
}
