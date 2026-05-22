import { expect } from 'chai';
import safeRequire from 'keystone/lib/safeRequire';

describe('safeRequire', function () {
	describe('given a library that is not installed', function () {
		beforeEach(function () {
			(this as unknown as { oldExit: typeof process.exit }).oldExit = process.exit.bind(process);
			process.exit = function (status?: number) {
				return expect(status).to.eql(1) as never;
			};
		});

		afterEach(function () {
			process.exit = (this as unknown as { oldExit: typeof process.exit }).oldExit;
		});

		it('throws an error highlighting that the library is not installed', async function () {
			try {
				const backupLog = console.error;
				console.error = () => null;
				await safeRequire('foobarbaz', 'foobarbaz');
				console.error = backupLog;
			} catch (e) {
				expect((e as { message: string }).message).to.contain('foobarbaz');
			}
		});
	});

	describe('given a library that exists', function () {
		it('returns the required library', async function () {
			const localChaiNs = await safeRequire('chai', 'chai') as { default?: unknown; expect?: unknown };
			const localChai = (localChaiNs.default ?? localChaiNs) as { expect(val: unknown): unknown };
			expect(() => localChai.expect(1)).to.not.throw();
		});
	});
});
