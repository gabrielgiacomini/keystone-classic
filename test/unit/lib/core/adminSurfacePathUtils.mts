import { expect } from 'chai';
import {
	assertDistinctAdminSurfacePaths,
	getAdminApiEnabled,
	getAdminSurfacePaths,
	getAdminClientMode,
	getAdminLegacyApiAliasEnabled,
	getAdminLegacyApiAliasPath,
} from 'keystone/lib/core/adminSurfacePathUtils';

function keystoneWith(options: Record<string, unknown> = {}): import('keystone').Keystone {
	return {
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

	it('accepts false, legacy, next, and both as admin ui modes', function () {
		for (const value of [false, 'legacy', 'next', 'both']) {
			expect(getAdminClientMode(keystoneWith({ 'admin ui': value }))).to.equal(value);
		}
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
});
