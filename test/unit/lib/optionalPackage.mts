import { expect } from 'chai';
import { hasOptionalPackage, resolveOptionalPackageDir } from 'keystone/lib/optionalPackage';

describe('lib/optionalPackage', function () {
	it('resolves installed package directories', function () {
		const expressPath = resolveOptionalPackageDir('express');
		expect(expressPath).to.be.a('string');
		expect(expressPath).to.match(/node_modules\/express$/);
	});

	it('returns null for optional packages that are not installed', function () {
		expect(resolveOptionalPackageDir('tinymce')).to.equal(null);
		expect(hasOptionalPackage('tinymce')).to.equal(false);
	});
});
