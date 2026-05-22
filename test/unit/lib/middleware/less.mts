import { expect } from 'chai';
import createLessMiddleware from 'keystone/lib/middleware/less';
import express from 'express';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';

describe('lib/middleware/less', function () {
	let root: string;

	beforeEach(async function () {
		root = await fs.mkdtemp(path.join(os.tmpdir(), 'keystone-less-'));
	});

	afterEach(async function () {
		await fs.rm(root, { recursive: true, force: true });
	});

	it('compiles matching .less files for .css and .min.css requests', async function () {
		await fs.writeFile(path.join(root, 'site.less'), '@brand: red; .button { color: @brand; }');
		const app = express();
		app.use('/assets', createLessMiddleware(root, {
			render: {
				modifyVars: { '@brand': 'blue' },
			},
		}));

		const css = await request(app).get('/assets/site.css').expect(200).expect('content-type', /text\/css/);
		expect(css.text).to.contain('color: blue');

		const minCss = await request(app).get('/assets/site.min.css').expect(200).expect('content-type', /text\/css/);
		expect(minCss.text).to.contain('color: blue');
	});

	it('falls through to later middleware when no matching .less file exists', async function () {
		await fs.writeFile(path.join(root, 'existing.css'), '.from-static { color: green; }');
		const app = express();
		app.use('/assets', createLessMiddleware(root));
		app.use('/assets', express.static(root));

		const res = await request(app).get('/assets/existing.css').expect(200).expect('content-type', /text\/css/);
		expect(res.text).to.contain('from-static');
	});
});
