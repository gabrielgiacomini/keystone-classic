import keystone from 'keystone';
import { expect } from 'chai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import getExpressApp from '../helpers/getExpressApp.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('Keystone "module root" setting', function () {

	before(async function () {
		await getExpressApp();
	});

	describe('default', function () {
		it('should be set to the path where keystone was required', function () {
			expect(keystone.get('module root')).to.equal(projectRoot);
		});
		it('should be used by keystone.getPath()', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			expect(keystone.getPath('views')).to.equal(path.resolve(projectRoot, viewsPath));
		});
	});

	describe('custom with relative path', function () {
		const customPath = '../..';
		before(function () { keystone.set('module root', customPath); });
		it('should return the custom configured path', function () {
			expect(keystone.get('module root')).to.equal(path.resolve(__dirname, customPath));
		});
		it('should be used by keystone.getPath() to resolve relative paths', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			expect(keystone.getPath('views')).to.equal(path.resolve(__dirname, customPath, viewsPath));
		});
	});

	describe('custom with absolute path', function () {
		const customPath = path.resolve(__dirname, '../..');
		before(function () { keystone.set('module root', customPath); });
		it('should return the custom configured path', function () {
			expect(keystone.get('module root')).to.equal(customPath);
		});
		it('should be used by keystone.getPath() to resolve relative paths', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			expect(keystone.getPath('views')).to.equal(path.resolve(customPath, viewsPath));
		});
	});
});
