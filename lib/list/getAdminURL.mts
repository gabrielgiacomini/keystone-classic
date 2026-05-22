import { getAdminLegacyPath } from '../core/adminSurfacePathUtils.mjs';
import type { KeystoneList } from '../list.mjs';

export default function getAdminURL(this: KeystoneList, item?: { id?: unknown }): string {
	return getAdminLegacyPath(this.keystone) + '/' + this.path + (item ? '/' + String(item.id) : '');
}
