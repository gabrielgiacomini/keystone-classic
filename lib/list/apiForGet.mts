import type { Request, Response, RequestHandler } from 'express';
import type { KeystoneList } from '../list.mjs';

type ApiForGetOptions = {
	id?: string;
	query?: ((query: unknown, req: Request) => unknown) | Record<string, unknown>;
	transform?: (item: unknown, req: Request, res: Response) => unknown;
};

export default function apiForGet(this: KeystoneList, options: ApiForGetOptions): RequestHandler {
	const idParam = options.id || 'id';
	const List = this;
	return function (req: Request, res: Response) {
		const id = req.params[idParam];
		const query = List.model.findById(id) as {
			where(q: Record<string, unknown>): void;
			exec(): Promise<unknown>;
		};
		if (typeof options.query === 'function') {
			const result = options.query(query, req);
			if (result === false) return;
		} else if (typeof options.query === 'object') {
			query.where(options.query);
		}
		(query.exec() as Promise<unknown>).then(function (item: unknown) {
			if (!item) return res.status(404).json({ err: 'not found', id: id });
			if (options.transform) {
				item = options.transform(item, req, res);
				if (item === false) return;
			}
			return res.json({ data: item });
		}, function (err: unknown) {
			return res.status(500).json({ err: 'database error', detail: err });
		});
	};
}
