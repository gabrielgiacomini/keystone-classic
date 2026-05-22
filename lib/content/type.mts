/**
 * ContentType.
 */
export class ContentType {
	path: string;
	options: Record<string, unknown>;

	/**
	 * Documentation placeholder.
	 * @param path - Description
	 * @param options - Description
	 */
	constructor (path: string, options: Record<string, unknown>) {
		this.path = path;
		this.options = options;
	}

	/**
	 * Documentation placeholder.
	 * @returns The return value.
	 */
	getDefaultValue (): unknown {
		const defaultValue = this.options.default;
		if (typeof defaultValue === 'function') {
			return (defaultValue as () => unknown).call(this);
		}
		return defaultValue === undefined ? null : defaultValue;
	}

	/**
	 * Description.
	 * @param value - Description
	 * @returns The return value.
	 */
	populate (value: unknown): unknown {
		if (value === undefined || value === null) {
			return this.clean(this.getDefaultValue());
		}
		return this.clean(value);
	}

	/**
	 * Description.
	 * @param _value - Description
	 * @returns The return value.
	 */
	validateInput (_value: unknown): boolean {
		return true;
	}

	/**
	 * Description.
	 * @param value - Description
	 * @returns The return value.
	 */
	validateRequiredInput (value: unknown): boolean {
		return value !== undefined && value !== null && value !== '';
	}

	/**
	 * Description.
	 * @param value - Description
	 * @returns The return value.
	 */
	clean (value: unknown): unknown {
		return value;
	}
}

export default ContentType;
