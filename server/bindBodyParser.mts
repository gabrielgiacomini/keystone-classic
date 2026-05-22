import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import express from 'express';
import * as uploads from '../lib/uploads.mjs';

export default function bindBodyParser(keystone: Keystone, app: Application): void {
	const bodyParserParams: { limit?: string | number; extended?: boolean } = {};
	const fileLimit = keystone.get('file limit');
	if (fileLimit) {
		bodyParserParams.limit = fileLimit;
	}

	app.use(express.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(express.urlencoded(bodyParserParams));

	if (keystone.get('handle uploads')) {
		uploads.configure(app, keystone.get('multer options'));
	}
}
