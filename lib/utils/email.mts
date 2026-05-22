// eslint-disable-next-line sonarjs/regex-complexity -- Preserves the legacy keystone-utils email validator.
const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.['a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

/**
 * Checks whether a string matches Keystone's legacy email format validator.
 *
 * @param value Candidate email address.
 * @returns `true` when `value` matches the supported email pattern.
 */
export function isEmail(value: string): boolean {
	return EMAIL_REGEXP.test(value);
}
