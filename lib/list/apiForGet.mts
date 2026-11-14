import type { Request, Response, RequestHandler } from 'express';
import type { KeystoneList } from '../list.mjs';
import { toJSONWithoutSecretFields } from '../security/secretFieldRedaction.mjs';

type ApiForGetOptions = {
	id?: string;
	query?: ((query: unknown, req: Request) => unknown) | Record<string, unknown>;
	transform?: (item: unknown, req: Request, res: Response) => unknown;
};

/**
 * Returns JSON API middleware for a `GET /:id` endpoint. The response is
 * `{ data: item }` with secret fields (Password-type fields and fields declared
 * with `secret: true`) removed from the item and from any populated
 * relationship, so mounting it on a user list never sends a password hash or
 * a reset key.
 *
 * Redaction is keyed on the registered field paths and runs after `transform`.
 * A `transform` that copies a secret value under a different key is not
 * detected: do not do that.
 *
 * A failed query answers `500 { err: 'database error' }`; the error itself is
 * logged on the server and never sent to the client.
 *
 * @param options - Optional id param name, query modifier and transform.
 * @returns The express request handler.
 */
export default function apiForGet(this: KeystoneList, options: ApiForGetOptions = {}): RequestHandler {
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
			return res.json({ data: toJSONWithoutSecretFields(List, item) });
		}, function (err: unknown) {
			// The raw error (driver message, stack, `keyValue`, ...) stays in the server log.
			console.error('List.apiForGet() database error on \'' + List.key + '\':\n', err);
			return res.status(500).json({ err: 'database error' });
		});
	};
}
