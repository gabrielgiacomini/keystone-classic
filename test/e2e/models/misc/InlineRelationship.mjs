import keystone from '../../../../index.mjs';
const Types = keystone.Field.Types;

const InlineRelationship = new keystone.List('InlineRelationship', {});

InlineRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', createInline: true },
});

InlineRelationship.register();
export default InlineRelationship;
