import fs from 'fs';
import multer from 'multer';
import os from 'os';
import type { Request, Response, NextFunction, Application } from 'express';
import { assertAllowedUploadExtension, DEFAULT_ALLOWED_UPLOAD_EXTENSIONS, type UploadExtensionList } from './security/uploadPolicy.mjs';

interface KeystoneMulterOptions extends multer.Options {
	allowedExtensions?: UploadExtensionList;
}

export function createUploadFileFilter(allowedExtensions: UploadExtensionList = DEFAULT_ALLOWED_UPLOAD_EXTENSIONS): multer.Options['fileFilter'] {
	return function uploadFileFilter(_req, file, callback) {
		try {
			assertAllowedUploadExtension(file.originalname, allowedExtensions);
			callback(null, true);
		} catch (err) {
			callback(err as Error);
		}
	};
}

function buildMulterOptions(options?: KeystoneMulterOptions): multer.Options {
	const { allowedExtensions = DEFAULT_ALLOWED_UPLOAD_EXTENSIONS, ...multerOptions } = options ?? {};
	const hasCustomStorage = Boolean(multerOptions.storage ?? multerOptions.dest);
	const fileFilter: multer.Options['fileFilter'] = typeof multerOptions.fileFilter === 'function'
		? (req, file, callback) => {
			multerOptions.fileFilter?.(req, file, callback);
		}
		: createUploadFileFilter(allowedExtensions);
	return {
		...multerOptions,
		dest: hasCustomStorage ? multerOptions.dest : os.tmpdir(),
		limits: {
			fileSize: 10 * 1024 * 1024,
			...multerOptions.limits,
		},
		fileFilter,
	};
}

export function handleUploadedFiles(req: Request, res: Response, next: NextFunction): void {
	if (!req.files || !Array.isArray(req.files)) return next();
	const originalFiles = req.files as Express.Multer.File[];
	const files: Record<string, Express.Multer.File | Express.Multer.File[]> = {};
	originalFiles.forEach(function (i) {
		const existing = files[i.fieldname];
		if (Array.isArray(existing)) {
			existing.push(i);
		} else if (existing !== undefined) {
			files[i.fieldname] = [existing, i];
		} else {
			files[i.fieldname] = i;
		}
	});
	req.files = files;
	const cleanup = function () {
		originalFiles.forEach(function (i) {
			if (i.path) {
				fs.unlink(i.path, function () {});
			}
		});
	};
	res.on('close', cleanup);
	res.on('finish', cleanup);
	next();
}

export const configure = function (app: Application, options?: KeystoneMulterOptions): void {
	const upload = multer(buildMulterOptions(options));
	app.use(upload.any());
	app.use(handleUploadedFiles);
};

export default { handleUploadedFiles, configure, createUploadFileFilter };
