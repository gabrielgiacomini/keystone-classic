import listToArray from './listToArray.mjs';
import type { KeystoneList } from '../list.mjs';
import type { FieldInstanceFor, FieldSpec } from '../../fields/types/FieldSpec.mjs';

export default function expandPaths(this: KeystoneList, paths: string | string[]): { path: string; field: FieldInstanceFor<FieldSpec> | undefined }[] {
	const self = this;
	return listToArray(paths).map(function (path: string) {
		if (path === '__name__') {
			path = self.mappings.name ?? path;
		}
		return { path: path, field: self.fields[path] as FieldInstanceFor<FieldSpec> | undefined };
	});
}
