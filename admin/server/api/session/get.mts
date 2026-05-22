import type { Request, Response } from 'express';

/** Returns the currently authenticated user from the session as `{ user }`. */
function get(req: Request, res: Response): void {
	const keystone = req.keystone as { security?: { csrf?: { getToken(req: Request, res: Response): unknown } } } | undefined;
	if (keystone?.security?.csrf) {
		keystone.security.csrf.getToken(req, res);
	}
	res.json({ user: req.user });
}

export default get;
