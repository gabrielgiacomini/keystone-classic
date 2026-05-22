import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';

function toUpdateError(err: unknown): Error & Record<string, unknown> {
	if (err instanceof Error) return err as Error & Record<string, unknown>;
	if (typeof err === 'object' && err !== null) {
		const detail = err as Record<string, unknown>;
		const message = typeof detail['error'] === 'string' ? detail['error'] : 'update error';
		return Object.assign(new Error(message), detail);
	}
	return Object.assign(new Error('update error'), { detail: err }) as unknown as Error & Record<string, unknown>;
}

/**
 * Bulk-updates multiple list documents after verifying the CSRF token.
 * Expects `{ items: Array<{ id, ...fields }> }` in the request body.
 */
export default function listUpdate(req: Request, res: Response): void {
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
	const itemsData = (req.body as Record<string, unknown>)['items'] as Record<string, unknown>[];
	void Promise.all(itemsData.map(function (data: Record<string, unknown>) {
		return list.model.findById(data.id).exec().then(function (item: unknown) {
			if (!item) {
				return Promise.reject(Object.assign(new Error('not found'), { statusCode: 404, id: data.id }));
			}
				return new Promise(function (resolve, reject) {
					list.updateItem(item, data, { files: req.files, user: req.user }, function (err: unknown) {
						if (err) {
							const e = toUpdateError(err);
							e.id = data.id;
							e.statusCode = e.error === 'validation errors' ? 400 : 500;
							return reject(e);
					}
					const doc = item as Record<string, unknown>;
					resolve(req.query.returnData ? list.getData(item) : doc.id);
				});
			});
		}, function (err: unknown) {
			return Promise.reject(Object.assign(new Error('database error'), {
				error: 'database error',
				statusCode: 500,
				detail: err,
				id: data.id,
			}));
		});
	})).then(function (results: unknown[]) {
		res.json({ success: true, items: results });
	}, function (err: unknown) {
		const e = err as Record<string, unknown>;
		if (e['error'] === 'database error') {
			res.apiError('database error', e['detail']);
			return;
		}
		if (e.statusCode) {
			res.status(e.statusCode as number);
			delete e.statusCode;
		}
		res.json(e);
	});
}
