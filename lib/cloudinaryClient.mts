import { createRequire } from 'node:module';
import type { UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from 'cloudinary';

const require = createRequire(import.meta.url);
type CloudinaryModule = typeof import('cloudinary');
type CloudinaryV2 = CloudinaryModule['v2'];
let cloudinaryV2: CloudinaryV2 | undefined;

export interface CloudinaryErrorResult {
	message?: string;
	http_code?: number;
	[key: string]: unknown;
}

/**
 * The upload result exposed to callers.  On success all SDK fields are present;
 * on error only `error` is guaranteed — hence the optional required fields.
 */
export interface CloudinaryUploadResult {
	public_id?: string;
	version?: number;
	signature?: string;
	format?: string;
	resource_type?: string;
	url?: string;
	width?: number;
	height?: number;
	secure_url?: string;
	error?: CloudinaryErrorResult;
	[key: string]: unknown;
}

type CloudinaryResult = { error?: CloudinaryErrorResult; [key: string]: unknown };
type LegacyCallback<T extends CloudinaryResult> = (result: T) => void;

function getCloudinaryV2(): CloudinaryV2 {
	if (!cloudinaryV2) {
		try {
			cloudinaryV2 = (require('cloudinary') as CloudinaryModule).v2;
		} catch (err: unknown) {
			if (err && typeof err === 'object' && (err as { code?: unknown }).code === 'MODULE_NOT_FOUND') {
				const missingPeerError = new Error(
					'The optional peer dependency "cloudinary" is required when using Keystone Cloudinary fields, '
					+ 'Cloudinary upload APIs, or the "cloudinary config" option.'
				);
				(missingPeerError as Error & { cause: unknown }).cause = err;
				throw missingPeerError;
			}
			throw err;
		}
	}
	return cloudinaryV2;
}

function normalizeError(error: unknown): CloudinaryErrorResult {
	if (error && typeof error === 'object') {
		return error as CloudinaryErrorResult;
	}
	return { message: String(error) };
}

function asUploadLegacyCallback(
	callback: LegacyCallback<CloudinaryUploadResult>,
): (err?: UploadApiErrorResponse, result?: UploadApiResponse) => void {
	return function (error?: UploadApiErrorResponse, result?: UploadApiResponse): void {
		if (error) {
			callback({ error: normalizeError(error) });
			return;
		}
		callback(result ?? {});
	};
}

function asGenericLegacyCallback<T extends CloudinaryResult>(
	callback: LegacyCallback<T>,
): (err?: unknown, result?: T) => void {
	return function (error?: unknown, result?: T): void {
		if (error) {
			callback({ error: normalizeError(error) } as T);
			return;
		}
		callback(result ?? ({} as T));
	};
}

const cloudinaryClient = {
	config(value?: unknown): Record<string, unknown> {
		return getCloudinaryV2().config(value as boolean);
	},

	url(publicId: string, options?: Record<string, unknown>): string {
		return getCloudinaryV2().url(publicId, options);
	},

	image(publicId: string, options?: Record<string, unknown>): string {
		return getCloudinaryV2().image(publicId, options);
	},

	cloudinary_js_config(): string {
		return getCloudinaryV2().cloudinary_js_config();
	},

	uploader: {
		upload(
			path: string,
			callback: LegacyCallback<CloudinaryUploadResult>,
			options: UploadApiOptions = {},
		): void {
			void getCloudinaryV2().uploader.upload(path, options, asUploadLegacyCallback(callback));
		},

		destroy(
			publicId: string,
			callback: LegacyCallback<CloudinaryResult>,
			options: { resource_type?: string; type?: string; invalidate?: boolean } = {},
		): void {
			void getCloudinaryV2().uploader.destroy(publicId, options, asGenericLegacyCallback(callback));
		},

		direct_upload(
			callbackUrl?: string,
			options: Record<string, unknown> = {},
		): { hidden_fields: Record<string, string> } {
			return getCloudinaryV2().uploader.direct_upload(callbackUrl, options);
		},
	},

	api: {
		resource(
			publicId: string,
			callback: LegacyCallback<CloudinaryUploadResult>,
			options: Record<string, unknown> = {},
		): void {
			void getCloudinaryV2().api.resource(publicId, options, asGenericLegacyCallback(callback));
		},

		resources(
			callback: LegacyCallback<CloudinaryResult>,
			options: Record<string, unknown> = {},
		): void {
			void getCloudinaryV2().api.resources(options, asGenericLegacyCallback(callback));
		},
	},
};

export default cloudinaryClient;
