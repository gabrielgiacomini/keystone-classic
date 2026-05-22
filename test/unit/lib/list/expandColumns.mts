import { expect } from 'chai';
import type { KeystoneList } from 'keystone';
import expandColumns from 'keystone/lib/list/expandColumns';

describe('List.expandColumns', function () {
	it('expands strings and object descriptors with local legacy-compatible helpers', function () {
		const refList = {
			namePath: 'name',
			fields: {
				email: { label: 'Email' },
				authorSlug: undefined,
			},
		};
		const list = {
			namePath: 'title',
			fields: {
				title: { path: 'title', type: 'text', label: 'Title' },
				author: { path: 'author', type: 'relationship', label: 'Author', refList },
			},
			model: {
				schema: {
					paths: {
						publishedAt: {},
					},
					virtuals: {
						computedScore: {},
					},
				},
			},
		} as unknown as KeystoneList;

		const columns = expandColumns.call(list, [
			'author:email|20%',
			{ path: 'publishedAt', label: 'Published' },
			'computedScore',
		]);

		expect(columns.map(column => column.path)).to.deep.equal(['title', 'author', 'publishedAt', 'computedScore']);
		expect(columns[0]).to.include({
			field: list.fields['title'],
			isName: true,
			label: 'Title',
			path: 'title',
			type: 'text',
		});
		expect(columns[1]).to.include({
			field: list.fields['author'],
			label: 'Author: Email',
			path: 'author',
			refList,
			refPath: 'email',
			subField: refList.fields.email,
			type: 'relationship',
			width: '20%',
		});
		expect(columns[1]?.populate).to.deep.equal({ path: 'author', subpath: 'email' });
		expect(columns[2]).to.include({ label: 'Published', path: 'publishedAt' });
		expect(columns[3]).to.include({ label: 'Computed Score', path: 'computedScore' });
	});

	it('throws for invalid column definitions', function () {
		const list = {
			namePath: 'title',
			fields: {},
			model: { schema: { paths: {}, virtuals: {} } },
		} as unknown as KeystoneList;

		expect(() => expandColumns.call(list, { path: 'title' } as unknown as string[])).to.throw(
			'List.expandColumns: cols must be an array.',
		);
		expect(() => expandColumns.call(list, [null as unknown as string])).to.throw(
			'List.expandColumns: column definition must contain a path.',
		);
	});

	it('parses long Cloom-style defaultColumns strings with width tokens', function () {
		const list = {
			namePath: 'state',
			fields: {
				state: { path: 'state', type: 'select', label: 'State' },
				extractionConfigSchemaName: { path: 'extractionConfigSchemaName', type: 'text', label: 'Schema' },
				extractionConfigTargetUrl: { path: 'extractionConfigTargetUrl', type: 'url', label: 'Target URL' },
				extractionParsedResponseCreditsUsed: { path: 'extractionParsedResponseCreditsUsed', type: 'number', label: 'Credits' },
				processingDurationMs: { path: 'processingDurationMs', type: 'number', label: 'Duration' },
				errorMessage: { path: 'errorMessage', type: 'textarea', label: 'Error' },
				pipelineExecution: { path: 'pipelineExecution', type: 'relationship', label: 'Pipeline Execution' },
				processingStartedAt: { path: 'processingStartedAt', type: 'datetime', label: 'Started' },
			},
			model: { schema: { paths: {}, virtuals: {} } },
		} as unknown as KeystoneList;

		const columns = expandColumns.call(
			list,
			'state, extractionConfigSchemaName, extractionConfigTargetUrl|30%, extractionParsedResponseCreditsUsed, processingDurationMs, errorMessage|20%, pipelineExecution, processingStartedAt',
		);

		expect(columns.map(column => column.path)).to.deep.equal([
			'state',
			'extractionConfigSchemaName',
			'extractionConfigTargetUrl',
			'extractionParsedResponseCreditsUsed',
			'processingDurationMs',
			'errorMessage',
			'pipelineExecution',
			'processingStartedAt',
		]);
		expect(columns[2]?.width).to.equal('30%');
		expect(columns[5]?.width).to.equal('20%');
		expect(columns[0]?.isName).to.equal(true);
	});
});
