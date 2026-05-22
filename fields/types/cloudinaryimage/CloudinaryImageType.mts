import CloudinaryType from '../cloudinary/CloudinaryType.mjs';
import type { KeystoneFieldOptionsForCloudinaryType } from '../cloudinary/CloudinaryType.mjs';
import type { KeystoneList } from '../Type.mjs';

class CloudinaryImageType extends CloudinaryType {
	static override readonly properName = 'CloudinaryImage';
	static override readonly typeName = 'cloudinaryimage';

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForCloudinaryType) {
		process.emitWarning(
			'Types.CloudinaryImage is deprecated; use Types.Cloudinary with multiple: false (default).',
			{ code: 'KS_DEPRECATED' },
		);
		super(list, path, { ...options, multiple: false });
	}
}

export default CloudinaryImageType;

// ---------------------------------------------------------------------------
// Re-export public types for backward compatibility (B1h)
// ---------------------------------------------------------------------------

export type { KeystoneFieldOptionsForCloudinaryType as KeystoneFieldOptionsForCloudinaryImageType } from '../cloudinary/CloudinaryType.mjs';
export type { KeystoneFieldForCloudinaryType as KeystoneFieldForCloudinaryImageType } from '../cloudinary/CloudinaryType.mjs';
export type { KeystoneTypeConstructorForCloudinaryType as KeystoneTypeConstructorForCloudinaryImageType } from '../cloudinary/CloudinaryType.mjs';
