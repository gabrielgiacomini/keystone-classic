import type { Request, Response } from 'express';
import type { Keystone } from '../../../index.mjs';

/**
 * Returns a document count for every registered Keystone list as `{ counts: Record<listKey, number> }`.
 */
export default function counts(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	const listCounts: Record<string, number> = {};
	Promise.all(Object.values(keystone.lists).map(function (list) {
		return list.model.countDocuments().then(function (count: number) {
			listCounts[list.key] = count;
		});
	})).then(function () {
		return res.json({ counts: listCounts });
	}, function (err: unknown) {
		return res.apiError('database error', err);
	});
}
