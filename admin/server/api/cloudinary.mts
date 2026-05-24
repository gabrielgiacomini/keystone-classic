import type { Request, Response } from 'express';
import type { Keystone } from '../../../index.mjs';
import type { UploadApiOptions } from 'cloudinary';
import cloudinary from '../../../lib/cloudinaryClient.mjs';

/** Uploads a file to Cloudinary and returns the resulting image URL. */
export function upload(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;

	if (!keystone.security.csrf.validate(req)) {
		res.status(403).send({ error: { message: 'invalid csrf' } });
		return;
	}

	const uploadedFile = req.files?.file;
	const singleFile = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
	if (singleFile) {
		const options: UploadApiOptions = {};

		if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
			options.public_id = singleFile.originalname.substring(0, singleFile.originalname.lastIndexOf('.'));
		}

		if (process.env.CLOUDINARY_TEST_RUN_PREFIX) {
			options.folder = process.env.CLOUDINARY_TEST_RUN_PREFIX;
		}

		cloudinary.uploader.upload(singleFile.path, function (result) {
			const sendResult = function () {
				if (result.error) {
					res.send({ error: { message: result.error.message } });
				} else {
					res.send({
						...result,
						image: { url: (keystone.get('cloudinary secure') === true) ? result.secure_url : result.url },
					});
				}
			};

			res.format({
				html: sendResult,
				json: sendResult,
			});
		}, options);
	} else {
		res.json({ error: { message: 'No image selected' } });
	}
}

/** Lists Cloudinary resources matching an optional prefix for use in autocomplete UI. */
export function autocomplete(req: Request, res: Response): void {
	const max = req.query.max || 10;
	const prefix = req.query.prefix || '';
	const next = req.query.next || null;

	cloudinary.api.resources(function (result) {
		if (result.error) {
			res.json({ error: { message: result.error.message } });
		} else {
			res.json({
				next: result.next_cursor,
				items: result.resources,
			});
		}
	}, {
		type: 'upload',
		prefix: prefix,
		max_results: max,
		next_cursor: next,
	});
}

/** Fetches metadata for a single Cloudinary resource by public id. */
export function get(req: Request, res: Response): void {
	const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
	if (typeof id !== 'string') {
		res.json({ error: { message: 'No image selected' } });
		return;
	}

	cloudinary.api.resource(id, function (result) {
		if (result.error) {
			res.json({ error: { message: result.error.message } });
		} else {
			res.json({ item: result });
		}
	});
}

export default { upload, autocomplete, get };
