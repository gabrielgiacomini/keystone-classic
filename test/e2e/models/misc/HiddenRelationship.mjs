import keystone from '../../../../index.mjs';
const Types = keystone.Field.Types;

const HiddenRelationship = new keystone.List('HiddenRelationship', {});

HiddenRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', initial: true, hidden: true },
});

HiddenRelationship.register();
export default HiddenRelationship;
