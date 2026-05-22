import type { Keystone } from '../../index.mjs';
import { getAdminLegacyPath } from './adminSurfacePathUtils.mjs';

export default function wrapHTMLError(this: Keystone, title: string, err?: string): string {
	return '<html><head><meta charset=\'utf-8\'><title>Error</title>'
		+ '<link rel=\'stylesheet\' href=\'' + getAdminLegacyPath(this) + '/styles/error.css\'>'
		+ '</head><body><div class=\'error\'><h1 class=\'error-title\'>' + title + '</h1>'
		+ '<div class="error-message">' + (err || '') + '</div></div></body></html>';
}
