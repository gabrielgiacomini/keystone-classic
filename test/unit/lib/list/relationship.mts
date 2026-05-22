import { expect } from 'chai';
import relationship from 'keystone/lib/list/relationship';
import type { KeystoneList } from 'keystone/lib/list';

interface RelationshipHarness {
	key: string;
	keystone: {
		lists: Record<string, unknown>;
	};
	relationships: Record<string, unknown>;
	relationship(def: string | RelationshipInput): RelationshipHarness;
}

interface RelationshipInput {
	ref: string;
	refPath?: string;
	path?: string;
	label?: string;
	[key: string]: unknown;
}

interface RegisteredRelationship {
	ref: string;
	refPath: string;
	path: string;
	label: string;
	refList: unknown;
	isValid: boolean;
}

function createHarness(key = 'BlogPost'): RelationshipHarness {
	const harness = {
		key,
		keystone: {
			lists: {},
		},
		relationships: {},
		relationship(def: string | RelationshipInput) {
			return relationship.call(this as unknown as KeystoneList, def);
		},
	};
	return harness as RelationshipHarness;
}

describe('List.relationship', function () {
	it('derives legacy refPath, path, and label defaults', function () {
		const list = createHarness('BlogPost');

		relationship.call(list as unknown as KeystoneList, 'Comment');

		expect(list.relationships).to.have.property('comments');
		expect(list.relationships['comments']).to.include({
			ref: 'Comment',
			refPath: 'blogPost',
			path: 'comments',
			label: 'Comments',
		});
	});

	it('preserves explicit relationship path and label values', function () {
		const list = createHarness('BlogPost');

		relationship.call(list as unknown as KeystoneList, {
			ref: 'Comment',
			path: 'reviewItems',
			label: 'Review Items',
		});

		expect(list.relationships).to.have.property('reviewItems');
		expect(list.relationships['reviewItems']).to.include({
			ref: 'Comment',
			refPath: 'blogPost',
			path: 'reviewItems',
			label: 'Review Items',
		});
	});

	it('preserves explicit inverse refPath values for admin relationship panels', function () {
		const list = createHarness('BlogPost');

		relationship.call(list as unknown as KeystoneList, {
			ref: 'Comment',
			refPath: 'canonicalPost',
			path: 'relatedComments',
			label: 'Related Comments',
		});

		expect(list.relationships).to.have.property('relatedComments');
		expect(list.relationships['relatedComments']).to.include({
			ref: 'Comment',
			refPath: 'canonicalPost',
			path: 'relatedComments',
			label: 'Related Comments',
		});
	});

	it('keeps refList and isValid dynamic against the Keystone list registry', function () {
		const list = createHarness('BlogPost');
		const commentList = { key: 'Comment' };

		relationship.call(list as unknown as KeystoneList, 'Comment');
		const inverseRelationship = list.relationships['comments'] as RegisteredRelationship;

		expect(inverseRelationship.isValid).to.equal(false);
		expect(inverseRelationship.refList).to.equal(undefined);

		list.keystone.lists.Comment = commentList;

		expect(inverseRelationship.isValid).to.equal(true);
		expect(inverseRelationship.refList).to.equal(commentList);
	});
});
