import PasswordField from '../PasswordField.mjs';
import PasswordFilter from '../PasswordFilter.mjs';

export default {
	Field: PasswordField,
	Filter: PasswordFilter,
	section: 'Miscellaneous',
	spec: {
		label: 'Password',
		path: 'password',
		paths: {
			confirm: 'password_confirm',
		},
		value: undefined,
	},
};
