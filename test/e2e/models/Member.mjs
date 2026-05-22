import keystone from '../../../index.mjs';
import User from './User.mjs';

const Member = new keystone.List('Member', {
	inherits: User,
	track: true,
});

Member.register();

export default Member;
