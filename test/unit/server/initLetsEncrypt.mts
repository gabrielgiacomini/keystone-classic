import { expect } from 'chai';
import type { Application } from 'express';

import initLetsEncrypt from 'keystone/server/initLetsEncrypt';

function createKeystoneMock(options: Record<string, unknown>) {
	return {
		get(key: string) {
			return options[key];
		},
		set(key: string, value: unknown) {
			options[key] = value;
			return this;
		},
	};
}

function createAppMock(): Application {
	return {
		use() {
			return this;
		},
	} as unknown as Application;
}

describe('initLetsEncrypt', function () {
	it('does not require greenlock-express when letsencrypt is not configured', function () {
		expect(() => initLetsEncrypt(createKeystoneMock({ ssl: false }) as never, createAppMock())).to.not.throw();
	});

	it('throws an actionable optional-package error when letsencrypt is configured without greenlock-express', function () {
		expect(() => initLetsEncrypt(createKeystoneMock({
			ssl: true,
			letsencrypt: {
				email: 'admin@example.com',
				domains: ['example.com'],
				tos: true,
			},
		}) as never, createAppMock())).to.throw('install the optional package `greenlock-express`');
	});
});
