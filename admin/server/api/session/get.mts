import type { Request, Response } from 'express';
import { projectSessionUserFor } from '../../../../lib/sessionUserProjection.mjs';

/**
 * Returns the currently authenticated user from the session as `{ user }`.
 * `user` is the client-safe projection (`id`, `name`, `email`, `canAccessKeystone`),
 * not the raw user document.
 */
function get(req: Request, res: Response): void {
	const keystone = req.keystone as { security?: { csrf?: { getToken(req: Request, res: Response): unknown } } } | undefined;
	if (keystone?.security?.csrf) {
		keystone.security.csrf.getToken(req, res);
	}
	// Signed-out requests keep their existing shape (`null` / omitted).
	res.json({ user: req.user ? projectSessionUserFor(req.keystone, req.user) : req.user });
}

export default get;
