import { expect } from 'chai';
import keystone from 'keystone';

const content = keystone.content;

function makePage() {
	return new content.Page('home', {}).add({
		'content.title': { type: String, required: true },
		'content.body': { type: content.Types.Html },
	});
}

describe('Content', function () {
	let originalPages: unknown;
	let originalAppContent: unknown;

	beforeEach(function () {
		originalPages = content.pages;
		originalAppContent = content.AppContent;
		content.pages = {} as typeof content.pages;
		content.AppContent = null;
	});

	afterEach(function () {
		content.pages = originalPages as typeof content.pages;
		content.AppContent = originalAppContent as typeof content.AppContent;
	});

	it('cleans values down to registered content fields', function () {
		const page = makePage();

		expect(page.clean({
			content: {
				title: 'Hello',
				body: '<p>Body</p>',
				extra: 'drop',
			},
			extra: 'drop',
		})).to.eql({
			content: {
				title: 'Hello',
				body: '<p>Body</p>',
			},
		});

		expect(page.clean({ 'content.title': 'Flat title' })).to.eql({
			content: { title: 'Flat title' },
		});
	});

	it('populates registered fields with defaults for missing values', function () {
		const page = new content.Page('home', {}).add({
			'hero.title': { type: String, default: 'Untitled' },
			'hero.body': { type: content.Types.Html },
		});

		expect(page.populate({})).to.eql({
			hero: {
				title: 'Untitled',
				body: null,
			},
		});
	});

	it('validates required and typed content field input', function () {
		const page = makePage();

		expect(() => page.validate({ content: { body: '<p>Only body</p>' } }))
			.to.throw('required field "content.title" is missing');
		expect(() => page.validate({ content: { title: 42 } }))
			.to.throw('invalid value for field "content.title"');
		expect(page.validate({ content: { title: 'Hello' }, extra: 'drop' })).to.eql({
			content: { title: 'Hello' },
		});
	});

	it('bounds all-page fetches to registered page keys', function (done) {
		const page = makePage();
		let capturedFilter: unknown;
		let capturedLimit: unknown;
		content.pages = { home: page };
		content.AppContent = {
			find(filter: unknown) {
				capturedFilter = filter;
				return {
					limit(limit: number) {
						capturedLimit = limit;
						return this;
					},
					exec() {
						return Promise.resolve([
							{ key: 'home', content: { data: { content: { title: 'Hello', body: '<p>Body</p>' } } } },
						]);
					},
				};
			},
		} as unknown as typeof content.AppContent;

		content.fetch(null, function (err: unknown, data: unknown) {
			try {
				expect(err).to.equal(null);
				expect(capturedFilter).to.eql({ key: { $in: ['home'] } });
				expect(capturedLimit).to.equal(1);
				expect(data).to.eql({
					home: { content: { title: 'Hello', body: '<p>Body</p>' } },
				});
				done();
			} catch (error) {
				done(error);
			}
		});
	});

	it('supports callback-only all-page fetches', function (done) {
		const page = makePage();
		let capturedFilter: unknown;
		content.pages = { home: page };
		content.AppContent = {
			find(filter: unknown) {
				capturedFilter = filter;
				return {
					limit() {
						return this;
					},
					exec() {
						return Promise.resolve([
							{ key: 'home', content: { data: { content: { title: 'Hello', body: '<p>Body</p>' } } } },
						]);
					},
				};
			},
		} as unknown as typeof content.AppContent;

		content.fetch(function (err: unknown, data: unknown) {
			try {
				expect(err).to.equal(null);
				expect(capturedFilter).to.eql({ key: { $in: ['home'] } });
				expect(data).to.eql({
					home: { content: { title: 'Hello', body: '<p>Body</p>' } },
				});
				done();
			} catch (error) {
				done(error);
			}
		});
	});

	it('preserves existing nested content values during partial stores', function (done) {
		const page = makePage();
		const existingDoc = {
			content: { data: { content: { title: 'Old', body: '<p>Existing</p>' } } },
			history: [] as unknown[],
			lastChangeDate: 0,
			save() {
				return Promise.resolve(this);
			},
		};
		content.pages = { home: page };
		content.AppContent = {
			findOne(filter: unknown) {
				expect(filter).to.eql({ key: 'home' });
				return {
					exec() {
						return Promise.resolve(existingDoc);
					},
				};
			},
		} as unknown as typeof content.AppContent;

		content.store('home', { content: { title: 'New' } }, function (err: unknown) {
			try {
				expect(err).to.equal(null);
				expect(existingDoc.history).to.eql([
					{ data: { content: { title: 'Old', body: '<p>Existing</p>' } } },
				]);
				expect(existingDoc.content.data).to.eql({
					content: { title: 'New', body: '<p>Existing</p>' },
				});
				done();
			} catch (error) {
				done(error);
			}
		});
	});

	it('reports validation failures through the store callback', function (done) {
		const page = makePage();
		content.pages = { home: page };
		content.AppContent = {
			findOne() {
				throw new Error('findOne should not run for invalid content');
			},
		} as unknown as typeof content.AppContent;

		content.store('home', { content: { body: '<p>Missing title</p>' } }, function (err: unknown) {
			try {
				expect(err).to.be.instanceOf(Error);
				expect((err as Error).message).to.contain('required field "content.title" is missing');
				done();
			} catch (error) {
				done(error);
			}
		});
	});
});
