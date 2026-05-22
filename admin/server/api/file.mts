import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Request, Response } from 'express';
import type { Keystone } from '../../../index.mjs';
import { assertAllowedUploadExtension } from '../../../lib/security/uploadPolicy.mjs';

function firstUploadedFile(req: Request): Express.Multer.File | undefined {
	const file = req.files?.file;
	return Array.isArray(file) ? file[0] : file;
}

function safeFilename(value: unknown): string {
	const raw = typeof value === 'string' && value.trim() ? value.trim() : 'upload';
	return raw.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
}

/** Uploads a file and returns the metadata shape accepted by Types.File. */
export function upload(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;

	if (!keystone.security.csrf.validate(req)) {
		res.status(403).send({ error: { message: 'invalid csrf' } });
		return;
	}

	const file = firstUploadedFile(req);
	if (!file?.path) {
		res.status(400).json({ error: { message: 'No file selected' } });
		return;
	}

	try {
		assertAllowedUploadExtension(file.originalname);
	} catch (err: unknown) {
		res.status(400).json({ error: { message: err instanceof Error ? err.message : String(err) } });
		return;
	}
	const originalname = safeFilename(file.originalname);
	const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${originalname}`;
	const uploadDir = path.join(os.tmpdir(), 'keystone-admin-api-uploads');
	fs.mkdirSync(uploadDir, { recursive: true });
	fs.copyFileSync(file.path, path.join(uploadDir, filename));

	res.json({
		filename,
		originalname,
		path: '/admin-api-uploads',
		size: file.size || 0,
		mimetype: typeof file.mimetype === 'string' ? file.mimetype : 'application/octet-stream',
		url: `/admin-api-uploads/${filename}`,
	});
}

export default { upload };
