import keystone from 'keystone';
import assert from 'node:assert';
import sinon from 'sinon';
import paginate from 'keystone/lib/list/paginate';
import '../../../models/Post.mts';

const Post = (keystone as unknown as { list(key: string): KsList }).list('Post');

interface KsList {
	model: {
		find(q?: Record<string, unknown>): unknown;
		deleteMany(q?: Record<string, unknown>): Promise<unknown>;
		new(data?: Record<string, unknown>): { save(): Promise<unknown> };
	};
	paginate(opts: Record<string, unknown>, cb?: (err: unknown, results: PaginateResult) => void): PaginateQuery;
	getPages(result: Record<string, unknown>, maxPages?: number): void;
}

interface PaginateResult {
	currentPage: number;
	totalPages: number;
	pages: number[];
	previous: number | null;
	next: number | null;
	results: unknown[];
}

interface PaginateQuery {
	sort(s: Record<string, unknown> | string): PaginateQuery;
	where(field: string): PaginateQuery;
	exec(): Promise<PaginateResult>;
}

const testData: {
	posts: Array<{ title: string; content: string }>;
	expectedPages?: number[];
	perPage?: number;
} = {
	posts: [
		{ title: 'Test Post 1', content: 'keyword' },
		{ title: 'Test Post 2', content: 'keyword keyword' },
		{ title: 'Test Post 3', content: 'keyword keyword keyword' },
		{ title: 'Test Post 4', content: 'keyword keyword keyword keyword' },
		{ title: 'Test Post 5', content: 'keyword keyword keyword keyword keyword' },
		{ title: 'Test Post 6', content: 'keyword keyword keyword keyword keyword keyword' },
		{ title: 'Test Post 7', content: 'keyword keyword keyword keyword keyword keyword keyword' },
	],
};

describe('When paginating results', function () {

	beforeEach(function (done) {
		Post.model.deleteMany({}).then(function () {
			return Promise.all(testData.posts.map(function (post: { title: string; content: string }) {
				return new Post.model(post).save();
			}));
		}).then(function () { done(); }, done);
	});

	after(function (done) {
		Post.model.deleteMany({}).then(function () { done(); }, done);
	});

	describe('without an optional expression', function () {
		it('should return results plus pagination metadata', async function () {
			const regressionTestData = Object.assign(testData, { expectedPages: [1, 2, 3, 4], perPage: 2 });
			await Promise.all(regressionTestData.expectedPages.map(async function (pageNumber: number) {
				const results = await Post.paginate({ page: pageNumber, perPage: regressionTestData.perPage, select: 'title' })
					.sort({ title: 'asc' })
					.exec();
				assert.equal(results.currentPage, pageNumber);
				assert.equal(results.totalPages, regressionTestData.expectedPages!.length);
				assert.deepStrictEqual(results.pages, regressionTestData.expectedPages);
				if (regressionTestData.expectedPages![0] === pageNumber) {
					assert(!results.previous); assert(results.next);
				} else if (regressionTestData.expectedPages![regressionTestData.expectedPages!.length - 1] === pageNumber) {
					assert(results.previous); assert(!results.next);
				} else {
					assert(results.previous); assert(results.next);
				}
				assert(results.results.length <= regressionTestData.perPage!);
			}));
		});
	});

	describe('with an optional expression', function () {
		it('should return results plus query metadata and pagination metadata', async function () {
			const searchTestData = Object.assign(testData, { expectedPages: [1, 2], perPage: 5 });
			await Promise.all(searchTestData.expectedPages.map(async function (pageNumber: number) {
				const results = await Post.paginate({
					page: pageNumber,
					perPage: searchTestData.perPage,
					filters: { $text: { $search: 'keyword' } },
					optionalExpression: { score: { $meta: 'textScore' } },
				}).sort({ score: { $meta: 'textScore' } }).exec();
				results.results.forEach(function (result: unknown) {
					const score = (result as { get(path: string): unknown }).get('score');
					assert.notEqual(score, undefined);
				});
				assert.equal(results.currentPage, pageNumber);
				assert.equal(results.totalPages, searchTestData.expectedPages!.length);
				assert.deepStrictEqual(results.pages, searchTestData.expectedPages);
				if (searchTestData.expectedPages![0] === pageNumber) {
					assert(!results.previous); assert(results.next);
				} else if (searchTestData.expectedPages![searchTestData.expectedPages!.length - 1] === pageNumber) {
					assert(results.previous); assert(!results.next);
				} else {
					assert(results.previous); assert(results.next);
				}
				assert(results.results.length <= searchTestData.perPage!);
			}));
		});
	});

	describe('query wrapper behavior', function () {
		it('does not patch the underlying Mongoose query methods', async function () {
			const results = [{ title: 'Wrapped result' }];
			const query = {
				select: sinon.stub().returnsThis(),
				sort: sinon.stub().returnsThis(),
				where: sinon.stub().returnsThis(),
				limit: sinon.stub().returnsThis(),
				skip: sinon.stub().returnsThis(),
				exec: sinon.stub().resolves(results),
			};
			const countExec = sinon.stub().resolves(1);
			const countQuery = { countDocuments: sinon.stub().returns({ exec: countExec }) };
			const list = {
				model: {
					find: sinon.stub().onFirstCall().returns(query).onSecondCall().returns(countQuery),
				},
				getPages: sinon.stub().callsFake((paginationResult: Record<string, unknown>) => {
					paginationResult['pages'] = [1];
				}),
			};
			const originalSelect = query.select;
			const originalSort = query.sort;
			const originalExec = query.exec;

			const paginationQuery = paginate.call(list, { page: 1, perPage: 5, select: 'title' });
			const page = await paginationQuery.where('title').sort({ title: 'asc' }).exec();

			assert.equal(query.select, originalSelect);
			assert.equal(query.sort, originalSort);
			assert.equal(query.exec, originalExec);
			assert(query.select.calledWith('title'));
			assert(query.where.calledWith('title'));
			assert(query.sort.calledWith({ title: 'asc' }));
			assert(query.limit.calledWith(5));
			assert(query.skip.calledWith(0));
			assert.deepStrictEqual(page.results, results);
			assert.deepStrictEqual(page.pages, [1]);
		});

		it('supports the legacy callback form', function (done) {
			Post.paginate({ page: 1, perPage: 2 }, function (err: unknown, results: PaginateResult) {
				if (err) return done(err);
				try {
					assert.equal(results.currentPage, 1);
					assert(results.results.length <= 2);
					done();
				} catch (assertionErr) {
					done(assertionErr);
				}
			});
		});
	});
});
