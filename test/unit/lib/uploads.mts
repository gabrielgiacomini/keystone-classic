import { expect } from 'chai';
import { createUploadFileFilter } from 'keystone/lib/uploads';

type TestFileFilter = (
	req: unknown,
	file: { originalname: string },
	callback: (err?: Error | null, acceptFile?: boolean) => void,
) => void;

describe('lib/uploads', function () {
	it('accepts safe upload extensions through the default fileFilter', async function () {
		const fileFilter = createUploadFileFilter() as TestFileFilter;
		const result = await new Promise<boolean>((resolve, reject) => {
			fileFilter({}, { originalname: 'report.pdf' }, function (err, acceptFile) {
				if (err) return reject(err);
				resolve(Boolean(acceptFile));
			});
		});

		expect(result).to.equal(true);
	});

	it('rejects unsafe upload extensions through the default fileFilter', async function () {
		const fileFilter = createUploadFileFilter() as TestFileFilter;
		const err = await new Promise<Error | null>((resolve) => {
			fileFilter({}, { originalname: 'shell.php' }, function (filterErr) {
				resolve(filterErr as Error | null);
			});
		});

		expect(err).to.be.instanceOf(Error);
		expect(err?.message).to.equal('Unsupported upload file extension: .php');
	});

	it('honors operator-provided extension overrides', async function () {
		const fileFilter = createUploadFileFilter(['.svg']) as TestFileFilter;
		const result = await new Promise<boolean>((resolve, reject) => {
			fileFilter({}, { originalname: 'diagram.svg' }, function (err, acceptFile) {
				if (err) return reject(err);
				resolve(Boolean(acceptFile));
			});
		});

		expect(result).to.equal(true);
	});
});
