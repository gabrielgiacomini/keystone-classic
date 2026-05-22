import { expect } from 'chai';
import {
	assertAllowedUploadExtension,
	isAllowedUploadExtension,
	normalizeUploadExtension,
} from 'keystone/lib/security/uploadPolicy';

describe('lib/security/uploadPolicy', function () {
	it('normalizes upload extensions case-insensitively', function () {
		expect(normalizeUploadExtension('Report.PDF')).to.equal('.pdf');
	});

	it('allows common safe upload extensions by default', function () {
		expect(isAllowedUploadExtension('field-complete-upload.txt')).to.equal(true);
		expect(isAllowedUploadExtension('image.PNG')).to.equal(true);
	});

	it('rejects executable or extensionless upload names by default', function () {
		expect(isAllowedUploadExtension('shell.php')).to.equal(false);
		expect(isAllowedUploadExtension('README')).to.equal(false);
		expect(() => assertAllowedUploadExtension('shell.php')).to.throw('Unsupported upload file extension: .php');
	});

	it('supports explicit operator extension overrides', function () {
		expect(isAllowedUploadExtension('diagram.svg', ['.svg'])).to.equal(true);
	});
});
