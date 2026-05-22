import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';

/**
 * Updates a single list item after verifying the CSRF token.
 * Returns the full updated item data on success.
 */
export default function itemUpdate(req: Request, res: Response): void {
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
	void list.model.findById(req.params.id).exec().then(function (item: unknown): void {
		if (!item) { res.status(404).json({ error: 'not found', id: req.params.id }); return; }
		list.updateItem(item, req.body, { files: req.files, user: req.user }, function (err: unknown): void {
			if (err) {
				const e = err as Record<string, unknown>;
				if (e.error === 'validation errors') {
					res.apiError(400, err);
					return;
				}
				if (e.error === 'database error') {
					res.apiError('database error', e.detail);
					return;
				}
				res.apiError(500, err); return;
			}
			void list.model.findById(req.params.id).exec().then(function (updatedItem: unknown): void {
				res.json(list.getData(updatedItem));
			}, function (dbErr: unknown): void {
				res.logError('admin/server/api/item/update', 'database error finding updated item', dbErr);
				res.apiError('database error', dbErr);
			});
		});
	}, function (err: unknown): void {
		res.logError('admin/server/api/item/update', 'database error finding item', err);
		res.apiError('database error', err);
	});
}
