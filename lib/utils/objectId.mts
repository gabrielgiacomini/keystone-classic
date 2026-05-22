const OBJECT_ID_REGEXP = /^[0-9a-fA-F]+$/;

/**
 * Checks whether a value has Keystone's historical MongoDB ObjectId shape.
 *
 * Keystone v4 treated both 12-character and 24-character hex strings as valid
 * ObjectId search input.
 *
 * @param value Candidate ObjectId value.
 * @returns True when `value` is a 12- or 24-character hexadecimal string.
 */
export function isValidObjectId(value: string): boolean {
	const length = value.length;
	return (length === 12 || length === 24) && OBJECT_ID_REGEXP.test(value);
}
