import type { Request, Response } from 'express';
import type mongoose from 'mongoose';
import type { Keystone } from '../../../../index.mjs';

/**
 * Deletes one or more list documents by id after verifying the CSRF token.
 * Rejects if the list has `nodelete` set or if the current user tries to delete themselves.
 */
export default function listDelete(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to delete ' + list.key + ' items; CSRF failure');
		res.apiError(403, 'invalid csrf');
		return;
	}
	if (list.get('nodelete')) {
		console.log('Refusing to delete ' + list.key + ' items; List.nodelete is true');
		res.apiError(400, 'nodelete');
		return;
	}
	const reqBody = req.body as Record<string, unknown>;
	let ids: unknown = reqBody['ids'] ?? reqBody['id'] ?? req.params['id'];
	if (typeof ids === 'string') {
		ids = ids.split(',');
	}
	if (!Array.isArray(ids)) {
		ids = [ids];
	}

	if (req.user) {
		const checkResourceId = (keystone.get('user model') === list.key);
		const userId = req.user.id;
		if (checkResourceId && (ids as unknown[]).some(function (id) { return id === userId; })) {
			console.log('Refusing to delete ' + list.key + ' items; ids contains current User id');
			res.apiError(403, 'not allowed', 'You can not delete yourself');
			return;
		}
	}

	let deletedCount = 0;
	const deletedIds: string[] = [];
	void (async function () {
		try {
			const results = await (list.model.find({ _id: { $in: ids as unknown[] } }).exec() as Promise<Array<mongoose.Document & { id: string; _req_user?: unknown }>>);
			await Promise.all(results.map(function (item: mongoose.Document & { id: string; _req_user?: unknown }) {
				item._req_user = req.user;
				return item.deleteOne().then(function () {
					deletedCount++;
					deletedIds.push(String(item.id));
				});
			}));
			return res.json({
				success: true,
				ids: deletedIds,
				count: deletedCount,
			});
		} catch (err: unknown) {
			console.log('Error deleting ' + list.key + ' items:', err);
			return res.apiError('database error', err);
		}
	})();
}
