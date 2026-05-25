import { ContentType } from '../type.mjs';

/**
 * ContentTextType.
 */
class ContentTextType extends ContentType {
	
	override validateInput (value: unknown): boolean {
		const max = typeof this.options.max === 'number' ? this.options.max : undefined;
		const min = typeof this.options.min === 'number' ? this.options.min : undefined;
		if (value === undefined || value === null) return true;
		if (typeof value !== 'string') return false;
		if (max !== undefined && value.length > max) return false;
		if (min !== undefined && value.length < min) return false;
		return true;
	}

	
	override clean (value: unknown): string | null {
		return typeof value === 'string' ? value : null;
	}
}

export default ContentTextType;
