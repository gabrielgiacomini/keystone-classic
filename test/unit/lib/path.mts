import { expect } from 'chai';
import Path from 'keystone/lib/path';

describe('Path', function () {
	describe('new', function () {
		it('must be an instance of Path', function () {
			expect(new Path('')).to.be.an.instanceof(Path);
		});
	});

	describe('.prototype.addTo', function () {
		it('must return an hierarchical object from path', function () {
			const path = new Path('foo.example.dir.file');
			const obj = path.addTo({}, 42);
			expect(obj).to.eql({ foo: { example: { dir: { file: 42 } } } });
		});

		it('must merge given an existing hierarchy', function () {
			const path = new Path('foo.example.dir.file');
			const obj = path.addTo({ foo: { example: { link: 69 } } }, 42);
			expect(obj).to.eql({ foo: { example: { link: 69, dir: { file: 42 } } } });
		});
	});

	describe('.prototype.get', function () {
		it('must return a simple value', function () {
			const path = new Path('foo');
			expect(path.get({ foo: 42 })).to.equal(42);
		});
		it('must return a nested value', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ foo: { example: { dir: 42 } } })).to.equal(42);
		});
		it('must return undefined when a nested value isn\'t present', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({})).to.be.undefined;
		});
		it('must return a flat nested value', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ 'foo.example.dir': 42 })).to.equal(42);
		});
		it('must return an appended sub path', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ foo: { example: { dir_ext: 42 } } }, '_ext')).to.equal(42);
		});
		it('must return a flat appended sub path', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ 'foo.example.dir_ext': 42 }, '_ext')).to.equal(42);
		});
		it('must return a nested sub path', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ foo: { example: { dir: { ext: 42 } } } }, '.ext')).to.equal(42);
		});
		it('must return a flat nested sub path', function () {
			const path = new Path('foo.example.dir');
			expect(path.get({ 'foo.example.dir.ext': 42 }, '.ext')).to.equal(42);
		});
	});
});
