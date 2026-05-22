import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { expect } from 'chai';
import request from 'supertest';

import metaGet from 'keystone/admin/server/api/meta';
import type { Keystone } from '../../../../../index.mjs';

type MetaListBody = Record<string, unknown> & {
	columns?: Array<Record<string, unknown>>;
	fields?: Record<string, Record<string, unknown>>;
};

type MetaBody = Record<string, unknown> & {
	lists: Record<string, MetaListBody>;
	nav: unknown;
	orphanedLists: unknown;
};

async function getMetaBody (keystone: Keystone): Promise<MetaBody> {
	const app = express();

	app.use('/keystone-api', function (req: Request, _res: Response, next: NextFunction) {
		req.keystone = keystone;
		next();
	});
	app.get('/keystone-api', metaGet);

	const res = await request(app)
		.get('/keystone-api')
		.expect(200)
		.expect('content-type', /json/);
	return res.body as MetaBody;
}

function createKeystoneMock (): Keystone {
	const relatedList: { key: string; self?: unknown } = { key: 'Author' };
	relatedList.self = relatedList;

	return {
		lists: {
			Post: {
				getOptions () {
					return {
						key: 'Post',
						label: 'Posts',
						path: 'posts',
						defaultColumns: 'title,author,virtual',
						schema: { shouldNotLeak: true },
						model () {},
						fields: {
							title: {
								type: 'text',
								label: 'Title',
							},
							hiddenText: {
								type: 'text',
								label: 'Hidden Text',
								hidden: true,
								noedit: true,
								nocreate: true,
								nocol: true,
								nosort: true,
								model () {},
							},
							author: {
								type: 'relationship',
								refList: relatedList,
								many: false,
							},
							state: {
								fieldType: 'select',
								ops: [
									{ value: 'draft', label: 'Draft' },
								],
								emptyOption: false,
							},
							priority: {
								type: 'select',
								numeric: true,
								ops: [
									{ value: 1, label: 'One' },
									{ value: 2, label: 'Two' },
								],
							},
						},
					};
				},
				expandColumns () {
					return [
						{
							path: 'title',
							label: 'Title',
							fieldType: 'text',
							format: function formatTitle () {},
						},
						{
							path: 'author',
							label: 'Author',
							fieldType: 'relationship',
							refList: relatedList,
							hidden: false,
							format: function formatAuthor () {},
						},
					];
				},
			},
		},
		nav: {
			sections: [
				{ label: 'Content', lists: ['Post'] },
			],
		},
		getOrphanedLists () {
			return [
				{ key: 'Author', label: 'Authors', path: 'authors', internal: true },
			];
		},
	} as unknown as Keystone;
}

describe('Admin metadata API', function () {
	it('returns 500 when the Keystone request context is missing', async function () {
		const app = express();

		app.get('/keystone-api', metaGet);

		await request(app)
			.get('/keystone-api')
			.expect(500)
			.expect('content-type', /json/)
			.expect(function (res) {
				expect(res.body).to.deep.equal({ error: 'keystone context missing' });
			});
	});

	it('returns lists as a serializable object keyed by list key', async function () {
		const body = await getMetaBody(createKeystoneMock());
		const post = body.lists.Post!;

		expect(body.lists).to.be.an('object').and.not.an('array');
		expect(Object.keys(body.lists)).to.deep.equal(['Post']);
		expect(post).to.include({
			key: 'Post',
			label: 'Posts',
			path: 'posts',
			defaultColumns: 'title,author,virtual',
		});
	});

	it('serializes nav and strips orphaned list internals', async function () {
		const body = await getMetaBody(createKeystoneMock());

		expect(body.nav).to.deep.equal({
			sections: [
				{ label: 'Content', lists: ['Post'] },
			],
		});
		expect(body.orphanedLists).to.deep.equal([
			{ key: 'Author', label: 'Authors', path: 'authors' },
		]);
	});

	it('serializes expanded columns without functions or live refs', async function () {
		const body = await getMetaBody(createKeystoneMock());
		const post = body.lists.Post!;

		expect(post.columns).to.deep.equal([
			{
				path: 'title',
				label: 'Title',
				fieldType: 'text',
			},
			{
				path: 'author',
				label: 'Author',
				fieldType: 'relationship',
				refList: 'Author',
				hidden: false,
			},
		]);
	});

	it('preserves field flags used by admin next rendering', async function () {
		const body = await getMetaBody(createKeystoneMock());
		const post = body.lists.Post!;

		expect(post.fields!.hiddenText).to.deep.equal({
			type: 'text',
			label: 'Hidden Text',
			hidden: true,
			noedit: true,
			nocreate: true,
			nocol: true,
			nosort: true,
			fieldType: 'text',
		});
	});

	it('normalizes relationship refs and select options', async function () {
		const body = await getMetaBody(createKeystoneMock());
		const post = body.lists.Post!;

		expect(post.fields!.author).to.deep.equal({
			type: 'relationship',
			refList: 'Author',
			many: false,
			fieldType: 'relationship',
		});
		expect(post.fields!.state).to.deep.equal({
			fieldType: 'select',
			ops: [
				{ value: 'draft', label: 'Draft' },
			],
			emptyOption: false,
			options: [
				{ value: 'draft', label: 'Draft' },
			],
		});
		expect(post.fields!.priority).to.deep.equal({
			type: 'select',
			numeric: true,
			ops: [
				{ value: 1, label: 'One' },
				{ value: 2, label: 'Two' },
			],
			fieldType: 'select',
			options: [
				{ value: 1, label: 'One' },
				{ value: 2, label: 'Two' },
			],
		});
	});

	it('omits functions, schemas, models, and circular references', async function () {
		const body = await getMetaBody(createKeystoneMock());
		const post = body.lists.Post!;
		const json = JSON.stringify(body);

		expect(json).to.be.a('string');
		expect(json).not.to.contain('shouldNotLeak');
		expect(json).not.to.contain('schema');
		expect(json).not.to.contain('model');
		expect(json).not.to.contain('self');
		expect(post.schema).to.equal(undefined);
		expect(post.model).to.equal(undefined);
		expect(post.fields!.hiddenText!.model).to.equal(undefined);
		expect(post.columns![1]!.format).to.equal(undefined);
	});
});
