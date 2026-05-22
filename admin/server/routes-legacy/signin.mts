import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { Request, Response } from 'express';
import {
	getAdminApiPath,
	getAdminLegacyApiAliasEnabled,
	getAdminLegacyApiAliasPath,
	getAdminLegacyPath,
} from '../../../lib/core/adminSurfacePathUtils.mjs';
import { userCanAccessKeystone } from '../../../lib/canAccessKeystone.mjs';
import type { KeystoneList } from '../../../types/express.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatePath = path.resolve(__dirname, '../templates-legacy/signin.html');

/** Runtime-typed CSRF module shape as exposed on `keystone.security`. */
interface CsrfModule {
	csrf: { CSRF_HEADER_KEY: string; getToken(req: Request, res: Response): string };
}

/**
 * Renders the Admin UI sign-in page (signin.html EJS template).
 * Passes CSRF token, brand, logo and current user info as locals.
 */
export default function SigninRoute(req: Request, res: Response): void {
	if (!req.keystone) return;
	const keystone = req.keystone;
	const UserList = (keystone.lists as Record<string, KeystoneList | undefined>)[keystone.get('user model') as string];
	const rawFrom = req.query['from'];
	const from = typeof rawFrom === 'string' && rawFrom.startsWith('/') ? rawFrom : getAdminLegacyPath(keystone);

	const csrf: { header: Record<string, string> } = { header: {} };
	// JUSTIFIED: security is typed as `{ csrf: typeof csrf }` but the runtime shape also exposes CSRF_HEADER_KEY / getToken
	const csrfSecurity = keystone.security as unknown as CsrfModule;
	csrf.header[csrfSecurity.csrf.CSRF_HEADER_KEY] = csrfSecurity.csrf.getToken(req, res);

	const locals: Record<string, unknown> = {
		adminLegacyPath: getAdminLegacyPath(keystone),
		adminApiPath: getAdminLegacyApiAliasEnabled(keystone)
			? getAdminLegacyApiAliasPath(keystone)
			: getAdminApiPath(keystone),
		brand: keystone.get('brand'),
		csrf,
		cspNonce: String(res.locals['cspNonce'] ?? ''),
		from,
		logo: keystone.get('signin logo'),
		redirect: keystone.get('signin redirect'),
		user: req.user ? {
			id: req.user.id,
			name: UserList?.getDocumentName(req.user as Record<string, unknown>) ?? '(no name)',
		} : undefined,
		userCanAccessKeystone: userCanAccessKeystone(req.user),
	};

	ejs.renderFile(templatePath, locals, { delimiter: '%' }, function (err, str) {
		if (err) {
			console.error('Could not render Admin UI Signin Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Signin', err.message));
		}
		return res.send(str);
	});
}
