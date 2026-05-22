import { expect } from 'chai';
import sinon from 'sinon';
import applyRelationshipPopulate from 'keystone/admin/server/api/list/applyRelationshipPopulate';

function createList() {
	return {
		fields: {
			author: { type: 'relationship', path: 'author' },
			owner: { type: 'relationship' },
			title: { type: 'text', path: 'title' },
		},
		relationshipFields: [
			{ path: 'editor' },
		],
	};
}

describe('admin list populate guard', function () {
	it('populates only declared relationship paths', function () {
		const query = { populate: sinon.spy() };
		const result = applyRelationshipPopulate(createList(), query, 'author editor,owner author');

		expect(result).to.deep.equal({ ok: true, invalid: [] });
		sinon.assert.calledThrice(query.populate);
		sinon.assert.calledWith(query.populate.getCall(0), 'author');
		sinon.assert.calledWith(query.populate.getCall(1), 'editor');
		sinon.assert.calledWith(query.populate.getCall(2), 'owner');
	});

	it('rejects non-relationship and unknown populate paths', function () {
		const query = { populate: sinon.spy() };
		const result = applyRelationshipPopulate(createList(), query, ['title', 'secret']);

		expect(result).to.deep.equal({ ok: false, invalid: ['title', 'secret'] });
		sinon.assert.notCalled(query.populate);
	});

	it('supports object populate values with a relationship path', function () {
		const query = { populate: sinon.spy() };
		const result = applyRelationshipPopulate(createList(), query, { path: 'author' });

		expect(result).to.deep.equal({ ok: true, invalid: [] });
		sinon.assert.calledOnce(query.populate);
		sinon.assert.calledWithExactly(query.populate, 'author');
	});

	it('rejects unsupported populate value shapes', function () {
		const query = { populate: sinon.spy() };
		const result = applyRelationshipPopulate(createList(), query, { select: 'passwordHash' });

		expect(result).to.deep.equal({ ok: false, invalid: ['populate'] });
		sinon.assert.notCalled(query.populate);
	});
});
