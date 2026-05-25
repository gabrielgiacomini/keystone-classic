/**
 * ContentType.
 */
export class ContentType {
	path: string;
	options: Record<string, unknown>;

	
	constructor (path: string, options: Record<string, unknown>) {
		this.path = path;
		this.options = options;
	}

	
	getDefaultValue (): unknown {
		const defaultValue = this.options.default;
		if (typeof defaultValue === 'function') {
			return (defaultValue as () => unknown).call(this);
		}
		return defaultValue === undefined ? null : defaultValue;
	}

	
	populate (value: unknown): unknown {
		if (value === undefined || value === null) {
			return this.clean(this.getDefaultValue());
		}
		return this.clean(value);
	}

	
	validateInput (_value: unknown): boolean {
		return true;
	}

	
	validateRequiredInput (value: unknown): boolean {
		return value !== undefined && value !== null && value !== '';
	}

	
	clean (value: unknown): unknown {
		return value;
	}
}

export default ContentType;
