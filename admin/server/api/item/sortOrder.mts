import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';
import listGet from '../list/get.mjs';

/**
 * Reorders a list item after verifying the CSRF token, then re-fetches the updated list.
 * Expects `sortOrder` and `newOrder` route params.
 */
export default function itemSortOrder(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to reorder ' + list.key + ' ' + req.params.id + '; CSRF failure');
		res.apiError(403, 'invalid csrf');
		return;
	}
	// reorderItems is a Keystone-specific static added to sortable list models at runtime.
	const sortableModel = list.model as typeof list.model & {
		reorderItems(id: string, sortOrder: string, newOrder: string, callback: (err: unknown) => void): void;
	};
	sortableModel.reorderItems(req.params['id'] ?? '', req.params['sortOrder'] ?? '', req.params['newOrder'] ?? '', function (err: unknown) {
		if (err) { res.apiError('database error', err); return; }
		void listGet(req, res);
	});
}
