import path from 'node:path';

export const DEFAULT_ALLOWED_UPLOAD_EXTENSIONS = Object.freeze([
	'.7z',
	'.avif',
	'.bmp',
	'.csv',
	'.doc',
	'.docx',
	'.eps',
	'.gif',
	'.gz',
	'.heic',
	'.heif',
	'.ico',
	'.jpeg',
	'.jpg',
	'.json',
	'.md',
	'.mov',
	'.mp3',
	'.mp4',
	'.mpeg',
	'.odp',
	'.ods',
	'.odt',
	'.pdf',
	'.png',
	'.ppt',
	'.pptx',
	'.ps',
	'.rtf',
	'.tar',
	'.tif',
	'.tiff',
	'.txt',
	'.wav',
	'.webm',
	'.webp',
	'.xls',
	'.xlsx',
	'.zip',
] as const);

export type UploadExtensionList = Iterable<string>;

export function normalizeUploadExtension(filename: unknown): string {
	return path.extname(typeof filename === 'string' ? filename : '').toLowerCase();
}

export function isAllowedUploadExtension(
	filename: unknown,
	allowedExtensions: UploadExtensionList = DEFAULT_ALLOWED_UPLOAD_EXTENSIONS,
): boolean {
	const extension = normalizeUploadExtension(filename);
	const allowed = new Set([...allowedExtensions].map((item) => item.toLowerCase()));
	return extension.length > 0 && allowed.has(extension);
}

export function assertAllowedUploadExtension(
	filename: unknown,
	allowedExtensions: UploadExtensionList = DEFAULT_ALLOWED_UPLOAD_EXTENSIONS,
): void {
	if (!isAllowedUploadExtension(filename, allowedExtensions)) {
		const extension = normalizeUploadExtension(filename) || '(none)';
		throw new Error(`Unsupported upload file extension: ${extension}`);
	}
}
