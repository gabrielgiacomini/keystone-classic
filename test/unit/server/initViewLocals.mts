import express from 'express';
import { expect } from 'chai';

import initViewLocals from 'keystone/server/initViewLocals';
import type { Keystone } from 'keystone';

function createKeystone(values: Record<string, unknown>): Keystone {
	return {
		get(key: string) {
			return values[key];
		},
	} as unknown as Keystone;
}

describe('initViewLocals', function () {
	it('merges configured locals into Express app locals for Cloom-owned views', function () {
		const app = express();
		const utils = {
			keyToLabel(value: string) {
				return value;
			},
		};
		const keystone = createKeystone({
			env: 'development',
			locals: {
				brand: 'Cloom Core',
				utils,
			},
		});

		initViewLocals(keystone, app);

		expect(app.locals.brand).to.equal('Cloom Core');
		expect(app.locals.utils).to.equal(utils);
		expect(app.locals.pretty).to.equal(true);
	});

	it('preserves an explicitly configured pretty value from locals', function () {
		const app = express();
		const keystone = createKeystone({
			env: 'development',
			locals: {
				pretty: false,
			},
		});

		initViewLocals(keystone, app);

		expect(app.locals.pretty).to.equal(false);
	});

	it('does not enable pretty rendering by default in production', function () {
		const app = express();
		const keystone = createKeystone({
			env: 'production',
			locals: {
				brand: 'Cloom Core',
			},
		});

		initViewLocals(keystone, app);

		expect(app.locals.brand).to.equal('Cloom Core');
		expect(app.locals.pretty).to.equal(undefined);
	});

	it('ignores non-object locals without mutating existing app locals', function () {
		const app = express();
		app.locals.existing = 'kept';
		const keystone = createKeystone({
			env: 'production',
			locals: 'not-an-object',
		});

		initViewLocals(keystone, app);

		expect(app.locals.existing).to.equal('kept');
		expect(app.locals).not.to.have.property('0');
	});
});
