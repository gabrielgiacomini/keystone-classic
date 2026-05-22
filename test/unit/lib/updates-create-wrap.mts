/**
 * Unit tests for the update loader's `.create` auto-wrap logic.
 *
 * Covers the fix: when an update module exports a function AND .create,
 * the function must take precedence (`.create` is ignored). Only when the
 * module does NOT export a function should the .create declarative runner
 * be used.
 *
 * Mirrors the condition in lib/updates.mts applyUpdate():
 *
 *   if (typeof update !== 'function' && update.create !== null &&
 *       (typeof update.create === 'object' || typeof update.create === 'function')) {
 *     update = function (done) { keystone.createItems(...) }
 *   }
 */

import { expect } from 'chai';

/**
 * Simulate the exact wrapping logic from lib/updates.mts so we can unit-test
 * the branch without pulling in keystone, mongoose, or the filesystem.
 */
function resolveUpdateFn(
	exportedUpdate: unknown,
	createItemsStub: (items: unknown, ops: unknown, cb: (err: Error | null) => void) => void
): (done: (err: Error | null) => void) => void {
	let update = exportedUpdate;

	if (
		typeof update !== 'function' &&
		(update as Record<string, unknown>)['create'] !== null &&
		(
			typeof (update as Record<string, unknown>)['create'] === 'object' ||
			typeof (update as Record<string, unknown>)['create'] === 'function'
		)
	) {
		const items = (update as Record<string, unknown>)['create'];
		const ops = (update as Record<string, unknown>)['options'] ?? {};
		update = function (done: (err: Error | null) => void) {
			createItemsStub(items, ops, function (err: Error | null) {
				done(err);
			});
		};
	}

	return update as (done: (err: Error | null) => void) => void;
}

// A typed helper to create a function-with-properties (module-like) test fixture.
type UpdateModuleWithCreate = ((cb: (err: Error | null) => void) => void) & {
	create?: Record<string, unknown[]>;
};

describe('lib/updates applyUpdate – .create auto-wrap', function () {
	describe('when the update module exports a function AND .create', function () {
		it('uses the exported function and does NOT call createItems', function (done) {
			let createItemsCalled = false;
			const createItemsStub = () => { createItemsCalled = true; };

			// Simulate a module like 0.2.1021-admin-agent.js that exports both
			const updateModule: UpdateModuleWithCreate = function (cb: (err: Error | null) => void) {
				cb(null);
			};
			updateModule.create = { 'User': [{ name: 'Admin' }] };

			const fn = resolveUpdateFn(updateModule, createItemsStub as unknown as Parameters<typeof resolveUpdateFn>[1]);

			// The resolved fn must be the original function, not the wrapper
			expect(fn).to.equal(updateModule, 'should preserve the original function export');

			fn(function (err) {
				expect(err).to.be.null;
				expect(createItemsCalled).to.equal(false, 'createItems must not be called when update is already a function');
				done();
			});
		});
	});

	describe('when the update module exports only .create (no function)', function () {
		it('replaces the update with a createItems wrapper', function (done) {
			const itemsToCreate: Record<string, unknown[]> = { 'User': [{ name: 'Seeded User' }] };
			let capturedItems: unknown = null;
			const createItemsStub = (items: unknown, _ops: unknown, cb: (err: Error | null) => void) => {
				capturedItems = items;
				cb(null);
			};

			const updateModule: Record<string, unknown> = { create: itemsToCreate };

			const fn = resolveUpdateFn(updateModule, createItemsStub as unknown as Parameters<typeof resolveUpdateFn>[1]);

			// The resolved fn must be a NEW wrapper function, not the original object
			expect(typeof fn).to.equal('function', 'should produce a wrapper function');
			expect(fn).to.not.equal(updateModule, 'should not be the original module object');

			fn(function (err) {
				expect(err).to.be.null;
				expect(capturedItems).to.equal(itemsToCreate, 'createItems should receive the .create value');
				done();
			});
		});
	});

	describe('when the update module exports only a function (no .create)', function () {
		it('uses the exported function as-is', function (done) {
			let createItemsCalled = false;
			const createItemsStub = () => { createItemsCalled = true; };

			let fnCalled = false;
			const updateModule: UpdateModuleWithCreate = function (cb: (err: Error | null) => void) {
				fnCalled = true;
				cb(null);
			};
			// No .create property

			const fn = resolveUpdateFn(updateModule, createItemsStub as unknown as Parameters<typeof resolveUpdateFn>[1]);

			expect(fn).to.equal(updateModule, 'should preserve the original function');

			fn(function (err) {
				expect(err).to.be.null;
				expect(fnCalled).to.equal(true, 'the original function must have run');
				expect(createItemsCalled).to.equal(false, 'createItems must not be called');
				done();
			});
		});
	});
});
