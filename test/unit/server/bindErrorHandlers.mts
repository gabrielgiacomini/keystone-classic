import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { expect } from 'chai';
import request from 'supertest';

import type { Keystone } from 'keystone';
import bindErrorHandlers from 'keystone/server/bindErrorHandlers';

function createKeystoneMock(): Keystone {
	const options: Record<string, unknown> = {
		'404': undefined,
		'500': undefined,
		'env': 'development',
		'logger': false,
	};

	return {
		get(key: string) {
			return options[key];
		},
		wrapHTMLError(title: string, err?: string) {
			return `<h1>${title}</h1><section>${err ?? ''}</section>`;
		},
	} as unknown as Keystone;
}

describe('bindErrorHandlers', function () {
	it('escapes development error messages and preserves line breaks in HTML responses', async function () {
		const app = express();
		app.get('/boom', (_req: Request, _res: Response, next: NextFunction) => {
			next(new Error('<script>alert("x")</script>\nTom & Ada'));
		});
		bindErrorHandlers(createKeystoneMock(), app);

		const response = await request(app).get('/boom').expect(500);

		expect(response.text).to.contain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;<br>Tom &amp; Ada');
		expect(response.text).to.not.contain('<script>alert');
	});
});
