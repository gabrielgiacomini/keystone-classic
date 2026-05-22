import { expect } from 'chai';
import { installHooks } from 'keystone/lib/core/hooks';
import type { HookMiddleware } from 'keystone/lib/core/hooks';

describe('lib/core/hooks', function () {
	it('registers and calls middleware with explicit hook context', function (done) {
		const target = installHooks({}).allowHooks('signin');
		const context = { label: 'user' };
		const req = { steps: [] as string[] };

		target.pre('signin', (function (this: typeof context, request: typeof req, next: (err?: unknown) => void) {
			expect(this).to.equal(context);
			request.steps.push('pre:async');
			next();
		}) as unknown as HookMiddleware);
		target.pre('signin', (function (this: typeof context, request: typeof req) {
			expect(this).to.equal(context);
			request.steps.push('pre:sync');
		}) as unknown as HookMiddleware);

		target.callHook(context, 'pre:signin', req, function (err?: unknown) {
			expect(err).to.equal(undefined);
			expect(req.steps).to.deep.equal(['pre:async', 'pre:sync']);
			done();
		});
	});

	it('waits for parallel middleware before finishing a hook call', function (done) {
		const target = installHooks({}).allowHooks('updates');
		const events: string[] = [];
		let released = false;

		target.pre('updates', (function (next: (err?: unknown) => void, wait: (err?: unknown) => void) {
			events.push('parallel:start');
			next();
			setTimeout(function releaseParallelWork () {
				released = true;
				events.push('parallel:done');
				wait();
			}, 10);
		}) as unknown as HookMiddleware);
		target.pre('updates', function () {
			expect(released).to.equal(false);
			events.push('next');
		});

		target.callHook('pre:updates', function (err?: unknown) {
			expect(err).to.equal(undefined);
			expect(events).to.deep.equal(['parallel:start', 'next', 'parallel:done']);
			done();
		});
	});

	it('wraps async methods with pre and post hooks', function (done) {
		const events: string[] = [];
		const target = installHooks({
			save (value: number, callback: (err?: unknown, result?: number) => void) {
				events.push('save:' + value);
				callback(undefined, value + 1);
			},
		});

		target.addHooks('save');
		target.pre('save', (function (value: number, next: (err?: unknown) => void) {
			events.push('pre:' + value);
			next();
		}) as unknown as HookMiddleware);
		target.post('save', (function (value: number) {
			events.push('post:' + value);
		}) as unknown as HookMiddleware);

		target.save(4, function (err?: unknown, result?: number) {
			expect(err).to.equal(undefined);
			expect(result).to.equal(5);
			expect(events).to.deep.equal(['pre:4', 'save:4', 'post:4']);
			done();
		});
	});

	it('supports thenable hook registration when configured with a thenable factory', async function () {
		const target = installHooks({}, {
			createThenable: (executor) => new Promise(executor),
		}).allowHooks('signin');

		const fired = target.pre('signin');
		target.callHook('pre:signin');

		await fired;
	});

	it('rejects unsupported hooks in strict mode', function () {
		const target = installHooks({});

		expect(function registerUnknownHook () {
			target.pre('missing', function () {});
		}).to.throw('Hooks for pre:missing are not supported.');
	});
});
