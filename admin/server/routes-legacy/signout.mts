import type { Request, Response } from 'express';
import { getAdminLegacyPath } from '../../../lib/core/adminSurfacePathUtils.mjs';

/**
 * Signs out of the legacy admin and redirects to the configured destination.
 * @param req - Express request with Keystone context.
 * @param res - Express response used for the redirect.
 */
export default function SignoutRoute(req: Request, res: Response): void {
	const keystone = req.keystone;
	if (!keystone) {
		res.status(500).json({ error: 'keystone not initialised' });
		return;
	}
	keystone.session.signout(req, res, function () {
		const redirect = keystone.get('signout redirect');
		if (typeof redirect === 'string') {
			return res.redirect(redirect);
		} else if (typeof redirect === 'function') {
			return (redirect as (req: Request, res: Response) => void)(req, res);
		} else {
			return res.redirect(getAdminLegacyPath(keystone) + '/signin?signedout');
		}
	});
}
