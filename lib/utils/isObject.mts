/**
 * Checks whether a value has the same object shape accepted by Keystone's
 * legacy `keystone-utils.isObject` helper.
 *
 * @param value - Value to inspect.
 * @returns True when the value reports `[object Object]`.
 */
export default function isObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === '[object Object]';
}
