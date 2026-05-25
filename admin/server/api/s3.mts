import type { Request, Response } from 'express';
import type { Keystone } from '../../../index.mjs';
import type { KeystoneOptions } from '../../../lib/core/options-types.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { PutObjectCommandInput, ObjectCannedACL, StorageClass, ServerSideEncryption, S3ClientConfig } from '@aws-sdk/client-s3';
import fs from 'node:fs';

/** Convenience alias for the typed S3 config shape from KeystoneOptions. */
type S3Config = NonNullable<KeystoneOptions['s3 config']>;

/**
 * Build the S3 upload headers from a Keystone-style `s3 config` object and a
 * file descriptor. Replaces the former `S3FileType.prototype.generateHeaders`
 * call so that the s3file field type is no longer required at runtime.
 */
function buildS3Headers(
	s3Config: S3Config,
	file: { mimetype?: string; type?: string },
): Record<string, string> {
	const filetype = file.mimetype ?? file.type ?? 'application/octet-stream';
	const headers: Record<string, string> = {
		'Content-Type': filetype,
		'x-amz-acl': 'public-read',
	};
	const defaultHeaders = s3Config['default headers'];
	if (Array.isArray(defaultHeaders)) {
		for (const header of defaultHeaders) {
			headers[header.name] = header.value;
		}
	} else if (defaultHeaders != null && typeof defaultHeaders === 'object') {
		Object.assign(headers, defaultHeaders);
	}
	return headers;
}

/**
 * Build a fresh S3 client from a Keystone-style `s3 config` object.
 */
function buildClient(s3config: S3Config): S3Client {
	const cfg: S3ClientConfig = { region: s3config.region ?? 'us-east-1' };
	if (s3config.key && s3config.secret) {
		cfg.credentials = { accessKeyId: s3config.key, secretAccessKey: s3config.secret };
	}
	if (s3config.endpoint) cfg.endpoint = s3config.endpoint;
	if (s3config.forcePathStyle) cfg.forcePathStyle = true;
	return new S3Client(cfg);
}

/**
 * Translate a flat headers object into PutObjectCommand input fields.
 */
function headersToPutInput(headers: Record<string, string>): Partial<PutObjectCommandInput> {
	const input: Partial<PutObjectCommandInput> = {};
	const metadata: Record<string, string> = {};
	for (const [key, v] of Object.entries(headers)) {
		switch (key.toLowerCase()) {
			case 'content-type': input.ContentType = v; break;
			case 'content-disposition': input.ContentDisposition = v; break;
			case 'content-encoding': input.ContentEncoding = v; break;
			case 'content-language': input.ContentLanguage = v; break;
			case 'cache-control': input.CacheControl = v; break;
			case 'expires': input.Expires = new Date(v); break;
			// ObjectCannedACL is a branded string union — 'public-read' is a valid member
			case 'x-amz-acl': input.ACL = v as ObjectCannedACL; break;
			case 'x-amz-storage-class': input.StorageClass = v as StorageClass; break;
			case 'x-amz-server-side-encryption': input.ServerSideEncryption = v as ServerSideEncryption; break;
			default:
				if (key.toLowerCase().startsWith('x-amz-meta-')) {
					metadata[key.substring('x-amz-meta-'.length)] = v;
				} else {
					metadata[key] = v;
				}
		}
	}
	if (Object.keys(metadata).length > 0) input.Metadata = metadata;
	return input;
}

/**
 * Uploads a file to S3 after verifying the CSRF token and returns the resulting image URL.
 */
export function upload(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;

	const s3Body = req.body as Record<string, unknown>;
	if (!keystone.security.csrf.validate(req, s3Body['authenticity_token'] as string | undefined)) {
		res.status(403).send({ error: { message: 'invalid csrf' } });
		return;
	}

	const uploadedFile = req.files?.file;
	const rawFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
	if (rawFile) {
		const s3Config = keystone.get('s3 config');
		if (!s3Config) {
			res.json({ error: { message: 'S3 not configured' } });
			return;
		}
		// The S3 legacy upload path mutates the file object with a `.name` field
		// derived from `filename` + extension — extend locally rather than polluting
		// the Multer.File type globally.
		const file: Express.Multer.File & { name?: string } = rawFile;
		const path = s3Config.s3path ? s3Config.s3path + '/' : '';

		if (!file.name) {
			const extension: RegExpExecArray | null = file.originalname
				? /.*(\..*)/u.exec(file.originalname)
				: null;
			file.name = file.filename + (extension ? extension[1] : '');
		}

		const headers = buildS3Headers(s3Config, file);

		const client = buildClient(s3Config);
		const Key = path + file.name;
		const Body = fs.createReadStream(file.path);
		const putInput: PutObjectCommandInput = Object.assign(
			{ Bucket: s3Config.bucket, Key, Body },
			headersToPutInput(headers)
		);

		client.send(new PutObjectCommand(putInput))
			.then(() => {
				const sendResult = () => {
					if (s3Config.root) {
						return res.send({ image: { url: s3Config.root + '/' + file.name } });
					}
					let region = 's3';
					if (s3Config.region && s3Config.region !== 'us-east-1') {
						region = 's3-' + s3Config.region;
					}
					return res.send({ image: { url: 'https://' + region + '.amazonaws.com/' + s3Config.bucket + '/' + file.name } });
				};
				res.format({ html: sendResult, json: sendResult });
			})
			.catch((err: unknown) => {
				const message = err instanceof Error ? err.message : String(err);
				res.send({ error: { message } });
			});
	} else {
		res.json({ error: { message: 'No image selected' } });
	}
}

export default { upload };
