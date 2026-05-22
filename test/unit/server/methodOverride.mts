import { expect } from 'chai';
import express from 'express';
import request from 'supertest';
import createMethodOverrideMiddleware from '../../../server/methodOverride.mts';

function createApp(): express.Express {
	const app = express();
	app.use(createMethodOverrideMiddleware());
	app.all('/resource', (req, res) => {
		res.json({
			method: req.method,
			originalMethod: Reflect.get(req, 'originalMethod') ?? null,
		});
	});
	return app;
}

describe('method override middleware', function () {
	it('overrides POST requests from X-HTTP-Method-Override', async function () {
		const response = await request(createApp())
			.post('/resource')
			.set('X-HTTP-Method-Override', 'DELETE')
			.expect(200);

		expect(response.body).to.deep.equal({
			method: 'DELETE',
			originalMethod: 'POST',
		});
	});

	it('does not override non-POST requests', async function () {
		const response = await request(createApp())
			.get('/resource')
			.set('X-HTTP-Method-Override', 'DELETE')
			.expect(200);

		expect(response.body).to.deep.equal({
			method: 'GET',
			originalMethod: null,
		});
	});

	it('ignores unsupported override methods', async function () {
		const response = await request(createApp())
			.post('/resource')
			.set('X-HTTP-Method-Override', 'CONNECT')
			.expect(200);

		expect(response.body).to.deep.equal({
			method: 'POST',
			originalMethod: null,
		});
	});
});
