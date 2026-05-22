import type { Request, Response, NextFunction } from 'express';
import { getAdminLegacyPath } from '../../../lib/core/adminSurfacePathUtils.mjs';

function acceptsJsonResponse(req: Request): boolean {
	const accept = req.headers.accept;
	const values: string[] = Array.isArray(accept) ? accept : accept ? [accept] : [];
	return values.some(function (value) {
		return value.split(',').some(function (part) {
			return /^\s*(?:application\/json|[^;/]+\/[^;,+]+\+json)\s*(?:;|$)/i.test(part);
		});
	});
}

/**
 * Express middleware that resolves the `:list` route param to a Keystone List
 * and attaches it as `req.list`. Responds 404 if the list key is unknown.
 */
export default function initList(req: Request, res: Response, next: NextFunction): void {
	const keystone = req.keystone;
	if (!keystone) {
		return res.status(500).json({ error: 'keystone not initialised' }) as never;
	}
	const listParam = req.params['list'] ?? '';
	req.list = keystone.lists[listParam] ?? keystone.lists[keystone.paths[listParam] ?? ''];
	if (!req.list) {
		if (acceptsJsonResponse(req)) {
			return res.status(404).json({ error: 'invalid list path' }) as never;
		}
		req.flash('error', 'List ' + req.params['list'] + ' could not be found.');
		return res.redirect(getAdminLegacyPath(keystone));
	}
	next();
}
