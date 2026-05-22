function deepClone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value ?? {})) as T;
}

/**
 * Builds the legacy Keystone option map keyed by each option's `value`.
 *
 * @param options Option records that contain a `value` property.
 * @param property Optional property name to map instead of the whole option.
 * Pass `true` here to clone option records, matching the legacy overload.
 * @param clone Whether whole option records should be cloned.
 * @returns Object keyed by option values.
 */
export function optionsMap<TOption extends { value: string | number }>(
	options: readonly TOption[],
	property?: keyof TOption | true,
	clone = false,
): Record<string | number, unknown> {
	let propertyName: keyof TOption | undefined;
	let shouldClone = clone;
	if (property === true) {
		shouldClone = true;
	} else {
		propertyName = property;
	}
	const map: Record<string | number, unknown> = {};
	for (const option of options) {
		let mappedValue: unknown = propertyName ? option[propertyName] : option;
		if (shouldClone) {
			mappedValue = deepClone(mappedValue);
		}
		map[option.value] = mappedValue;
	}
	return map;
}
