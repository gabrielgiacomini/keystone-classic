import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';

/**
 * Creates a new list document from the request body after verifying the CSRF token.
 * Returns the created item's data on success.
 */
export default function create(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}
	if (!keystone.security.csrf.validate(req)) {
		res.apiError(403, 'invalid csrf');
		return;
	}

	const item = new list.model();
	list.updateItem(item, req.body, {
		files: req.files,
		ignoreNoEdit: true,
		user: req.user,
	}, function (err: unknown) {
		if (err) {
			const e = err as Record<string, unknown>;
			if (e['error'] === 'validation errors') {
				res.apiError(400, err);
				return;
			}
			if (e['error'] === 'database error') {
				res.apiError('database error', e['detail']);
				return;
			}
			res.apiError(500, err);
			return;
		}
		res.json(list.getData(item));
	});
}
