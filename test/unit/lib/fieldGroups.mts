import { expect } from 'chai';
import sinon from 'sinon';

import {
	addFieldGroups,
	addFieldGroupsToKeystoneList,
	flattenFieldGroups,
	transformFieldGroupsToFields,
	type KeystoneFieldGroup,
	type KeystoneFieldGroupsConstraint,
	type KeystoneFieldGroupsDocumentConstraint,
	type KeystoneFieldGroupsToFields,
	type KeystoneFieldGroupList,
} from '../../../lib/fieldGroups.mts';

const groups = [
	{
		heading: 'Content',
		dependsOn: { status: ['draft'] },
		fields: {
			title: { type: String, required: true },
			meta: {
				score: { type: Number },
			},
		},
	},
	{
		fields: {
			status: { type: String, default: 'draft' },
			title: { type: String, label: 'Override title' },
		},
	},
] as const satisfies readonly KeystoneFieldGroup[];
type GroupDocumentFields = {
	title: string;
	status?: string;
};
const constrainedGroups: KeystoneFieldGroupsConstraint<KeystoneFieldGroupsToFields<typeof groups>> = groups;
const documentConstrainedGroups: KeystoneFieldGroupsDocumentConstraint<GroupDocumentFields> = groups;

describe('fieldGroups', function () {
	describe('flattenFieldGroups', function () {
		it('flattens grouped field maps and lets later groups override earlier fields', function () {
			expect(flattenFieldGroups(groups)).to.deep.equal({
				title: { type: String, label: 'Override title' },
				meta: {
					score: { type: Number },
				},
				status: { type: String, default: 'draft' },
			});
		});

		it('keeps the cloom-style flatten alias as a thin wrapper', function () {
			expect(transformFieldGroupsToFields(groups)).to.deep.equal(flattenFieldGroups(groups));
			expect(constrainedGroups).to.equal(groups);
			expect(documentConstrainedGroups).to.equal(groups);
		});
	});

	describe('addFieldGroups', function () {
		it('adds groups with headings as sectioned list.add calls', function () {
			const add = sinon.stub();
			const list = { add } as unknown as KeystoneFieldGroupList;

			const result = addFieldGroups(list, groups);

			expect(result).to.equal(list);
			sinon.assert.calledTwice(add);
			expect(add.firstCall.args).to.have.length(2);
			expect(add.firstCall.args[0]).to.deep.equal({ heading: 'Content' });
			expect(add.firstCall.args[1]).to.equal(groups[0].fields);
		});

		it('adds groups without headings as plain field maps', function () {
			const add = sinon.stub();
			const list = { add } as unknown as KeystoneFieldGroupList;

			addFieldGroups(list, groups);

			expect(add.secondCall.args).to.deep.equal([groups[1].fields]);
		});

		it('keeps the cloom-style add alias as a thin wrapper', function () {
			const add = sinon.stub();
			const list = { add } as unknown as KeystoneFieldGroupList;

			const result = addFieldGroupsToKeystoneList(list, groups);

			expect(result).to.equal(list);
			sinon.assert.calledTwice(add);
			expect(add.firstCall.args[0]).to.deep.equal({ heading: 'Content' });
		});
	});
});
