import CloudinaryType from '../cloudinary/CloudinaryType.mjs';
import type { KeystoneFieldOptionsForCloudinaryType } from '../cloudinary/CloudinaryType.mjs';
import type { KeystoneList } from '../Type.mjs';

class CloudinaryImagesType extends CloudinaryType {
	static override readonly properName = 'CloudinaryImages';
	static override readonly typeName = 'cloudinaryimages';

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForCloudinaryType) {
		process.emitWarning(
			'Types.CloudinaryImages is deprecated; use Types.Cloudinary with multiple: true.',
			{ code: 'KS_DEPRECATED' },
		);
		super(list, path, { ...options, multiple: true });
	}
}

export default CloudinaryImagesType;

// ---------------------------------------------------------------------------
// Re-export public types for backward compatibility (B1h)
// ---------------------------------------------------------------------------

export type { KeystoneFieldOptionsForCloudinaryType as KeystoneFieldOptionsForCloudinaryImagesType } from '../cloudinary/CloudinaryType.mjs';
export type { KeystoneFieldForCloudinaryType as KeystoneFieldForCloudinaryImagesType } from '../cloudinary/CloudinaryType.mjs';
export type { KeystoneTypeConstructorForCloudinaryType as KeystoneTypeConstructorForCloudinaryImagesType } from '../cloudinary/CloudinaryType.mjs';
