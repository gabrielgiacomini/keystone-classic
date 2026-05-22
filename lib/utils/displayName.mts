// Inlined from the abandoned 'display-name' npm package.
// CJK regex covers Chinese/Japanese/Korean Unicode blocks.
// eslint-disable-next-line no-irregular-whitespace, sonarjs/duplicates-in-character-class
const CJKRegex = /[⺀-⻾　-〾぀-ゞ゠-ヾ㇀-㇮ㇰ-ㇾ㈀-㋾㌀-㏾㐀-䶾一-鿾豈-﫾︰-﹎]|[\ud840-\ud868\ud86a-\ud86c][\udc00-\udfff]|\ud82c[\udc00-\udcfe]|\ud869[\udc00-\udede\udf00-\udfff]|\ud86d[\udc00-\udf3e\udf40-\udfff]|\ud86e[\udc00-\udc1e]|\ud87e[\udc00-\ude1e]/;

/**
 * Format a display name from first and last name, handling CJK name ordering.
 */
export default function displayName (firstName: string, lastName: string): string {
	const isFirst = typeof firstName === 'string' && firstName.length > 0;
	const isLast = typeof lastName === 'string' && lastName.length > 0;
	if (!isFirst) return isLast ? lastName : '';
	if (!isLast) return firstName;
	// isFirst/isLast above verified both strings are non-empty.
	const endCJK = CJKRegex.test(firstName[firstName.length - 1] ?? '');
	const startCJK = CJKRegex.test(lastName[0] ?? '');
	if (endCJK && startCJK) return lastName + firstName;
	if (!endCJK && startCJK) return lastName + firstName;
	if (endCJK && !startCJK) return firstName + lastName;
	return firstName + ' ' + lastName;
}
