import { expect } from 'chai';
import {
	assertDistinctAdminSurfacePaths,
	getAdminApiEnabled,
	getAdminSurfacePaths,
	getAdminClientMode,
	getAdminClientModeDecision,
	getAdminLegacyApiAliasEnabled,
	getAdminLegacyApiAliasPath,
	hasCustomLegacyFieldTypes,
} from 'keystone/lib/core/adminSurfacePathUtils';

function keystoneWith(options: Record<string, unknown> = {}, fieldTypes?: Record<string, unknown>): import('keystone').Keystone {
	return {
		fieldTypes,
		get(key: string) {
			return options[key];
		},
	} as unknown as import('keystone').Keystone;
}

describe('adminSurfacePathUtils', function () {
	it('returns the default permanent admin surface paths', function () {
		expect(getAdminSurfacePaths(keystoneWith())).to.deep.equal({
			adminLegacyPath: '/keystone',
			adminNextPath: '/keystone-next',
			adminApiPath: '/keystone-api',
		});
	});

	it('normalizes leading and trailing slashes', function () {
		const paths = getAdminSurfacePaths(keystoneWith({
			'admin legacy path': '/admin/',
			'admin next path': '///admin-next',
			'admin api path': 'admin-api///',
		}));

		expect(paths).to.deep.equal({
			adminLegacyPath: '/admin',
			adminNextPath: '/admin-next',
			adminApiPath: '/admin-api',
		});
		expect(getAdminLegacyApiAliasPath(keystoneWith({ 'admin legacy path': '/admin/' }))).to.equal('/admin/api');
	});

	it('rejects path collisions after normalization', function () {
		expect(() => assertDistinctAdminSurfacePaths(getAdminSurfacePaths(keystoneWith({
			'admin legacy path': '/Admin/',
			'admin api path': 'admin',
		})))).to.throw("Keystone: 'admin legacy path' and 'admin api path' must be distinct");
	});

	it('accepts false, legacy, next, both, and auto as admin ui modes', function () {
		for (const value of [false, 'legacy', 'next', 'both'] as const) {
			expect(getAdminClientMode(keystoneWith({ 'admin ui': value }))).to.equal(value);
		}
		expect(getAdminClientMode(keystoneWith({ 'admin ui': 'auto' }))).to.equal('next');
	});

	it('rejects unknown admin ui and admin api option values', function () {
		expect(() => getAdminClientMode(keystoneWith({ 'admin ui': 'modern' }))).to.throw("unknown 'admin ui' value");
		expect(() => getAdminApiEnabled(keystoneWith({ 'admin api': 'yes' }))).to.throw("unknown 'admin api' value");
		expect(() => getAdminLegacyApiAliasEnabled(keystoneWith({ 'admin legacy api alias': 'yes' }))).to.throw("unknown 'admin legacy api alias' value");
	});

	it('defaults admin API mounting for non-headless processes and requires opt-in for headless processes', function () {
		expect(getAdminApiEnabled(keystoneWith())).to.equal(true);
		expect(getAdminApiEnabled(keystoneWith({ headless: true }))).to.equal(false);
		expect(getAdminApiEnabled(keystoneWith({ headless: true, 'admin api': true }))).to.equal(true);
		expect(getAdminApiEnabled(keystoneWith({ 'admin ui': false }))).to.equal(true);
		expect(getAdminApiEnabled(keystoneWith({ 'admin ui': false, 'admin api': true }))).to.equal(true);
		expect(getAdminApiEnabled(keystoneWith({ 'admin api': false }))).to.equal(false);
	});

	it('detects custom legacy field types for auto admin UI mode', function () {
		expect(hasCustomLegacyFieldTypes({ text: 'Text', relationship: 'Relationship' })).to.equal(false);
		expect(hasCustomLegacyFieldTypes({ text: 'Text', customText: 'CustomText' })).to.equal(true);

		expect(getAdminClientModeDecision(keystoneWith({ 'admin ui': 'auto' }, {
			text: 'Text',
			number: 'Number',
		}))).to.deep.include({
			requested: 'auto',
			mode: 'next',
		});

		expect(getAdminClientModeDecision(keystoneWith({ 'admin ui': 'auto' }, {
			text: 'Text',
			customText: 'CustomText',
		}))).to.deep.include({
			requested: 'auto',
			mode: 'legacy',
		});
	});

	it('lets KEYSTONE_ADMIN_CLIENT override the admin ui option', function () {
		const previous = process.env.KEYSTONE_ADMIN_CLIENT;
		try {
			process.env.KEYSTONE_ADMIN_CLIENT = 'both';
			expect(getAdminClientMode(keystoneWith({ 'admin ui': 'legacy' }))).to.equal('both');

			process.env.KEYSTONE_ADMIN_CLIENT = 'auto';
			expect(getAdminClientMode(keystoneWith({ 'admin ui': 'legacy' }, { custom: 'Custom' }))).to.equal('legacy');
		} finally {
			if (previous === undefined) {
				delete process.env.KEYSTONE_ADMIN_CLIENT;
			} else {
				process.env.KEYSTONE_ADMIN_CLIENT = previous;
			}
		}
	});
});
