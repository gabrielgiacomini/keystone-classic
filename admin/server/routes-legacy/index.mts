import ejs from 'ejs';
import path from 'path';
import cloudinary from '../../../lib/cloudinaryClient.mjs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { Request, Response } from 'express';
import {
	getAdminApiPath,
	getAdminLegacyApiAliasEnabled,
	getAdminLegacyApiAliasPath,
	getAdminLegacyPath,
} from '../../../lib/core/adminSurfacePathUtils.mjs';
import { hasOptionalPackage } from '../../../lib/optionalPackage.mjs';
import type { KeystoneList } from '../../../types/express.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatePath = path.resolve(__dirname, '../templates-legacy/index.html');
const devAssetVersion = Date.now().toString(36);

function getLegacyAssetVersion(req: Request): string {
	const keystone = req.keystone;
	if (!keystone) return devAssetVersion;
	const baseVersion = keystone.createKeystoneHash();
	return keystone.get('cache admin bundles') === false
		? `${baseVersion}-${devAssetVersion}`
		: baseVersion;
}

/** Runtime-typed CSRF module shape as exposed on `keystone.security`. */
interface CsrfModule {
	csrf: { CSRF_HEADER_KEY: string; getToken(req: Request, res: Response): string };
}

/**
 * Renders the main Admin UI shell page (index.html EJS template).
 * Passes list metadata, CSRF token, Cloudinary/WYSIWYG config and user info as locals.
 * With `auth: true`, `keystoneAuth` normally runs before this route and populates `req.user`.
 * If `req.user` is missing, the handler throws (same outcome as the previous `req.user.id` access).
 * @param req - Express request with Keystone context.
 * @param res - Express response used to send the rendered shell.
 */
export default function IndexRoute(req: Request, res: Response): void {
	if (!req.keystone) return;
	const keystone = req.keystone;
	// JUSTIFIED: Keystone.lists values are KeystoneList at runtime; the interface uses `Record<string, KeystoneList>` which is assignable.
	const ksLists = keystone.lists as Record<string, KeystoneList | undefined>;
	const lists: Record<string, Record<string, unknown>> = {};
	Object.entries(ksLists).forEach(function ([key, list]) {
		if (list !== undefined) {
			lists[key] = list.getOptions();
		}
	});

	const UserList = ksLists[keystone.get('user model') as string];
	// JUSTIFIED: orphanedLists returns opaque unknown[]; we know the shape from Keystone Classic source
	const orphanedLists = (keystone.getOrphanedLists() as Array<{ key?: unknown; label?: unknown; path?: unknown }>).map(function (list) {
		return {
			key: list.key,
			label: list.label,
			path: list.path,
		};
	});

	const user = req.user;
	if (user == null) {
		const label = user === null ? 'null' : 'undefined';
		throw new TypeError(`Cannot read properties of ${label} (reading 'id')`);
	}

	const backUrl: string = (keystone.get('back url') as string | undefined) ?? '/';

	const csrf: { header: Record<string, string> } = { header: {} };
	// JUSTIFIED: security is typed as `{ csrf: typeof csrf }` but the runtime shape also exposes CSRF_HEADER_KEY / getToken
	const csrfSecurity = keystone.security as unknown as CsrfModule;
	csrf.header[csrfSecurity.csrf.CSRF_HEADER_KEY] = csrfSecurity.csrf.getToken(req, res);

	const keystoneData: Record<string, unknown> = {
		adminLegacyPath: getAdminLegacyPath(keystone),
		adminApiPath: getAdminLegacyApiAliasEnabled(keystone)
			? getAdminLegacyApiAliasPath(keystone)
			: getAdminApiPath(keystone),
		appversion: keystone.get('appversion'),
		backUrl: backUrl,
		brand: keystone.get('brand'),
		csrf,
		devMode: !!process.env.KEYSTONE_DEV,
		lists: lists,
		// JUSTIFIED: nav is attached at runtime via initNav(); not in the static interface
		nav: (keystone as unknown as Record<string, unknown>)['nav'],
		orphanedLists: orphanedLists,
		signoutUrl: keystone.get('signout url'),
		user: {
			id: user.id,
			name: UserList?.getDocumentName(user as Record<string, unknown>) ?? '(no name)',
		},
		userList: UserList?.key,
		// JUSTIFIED: version is attached at module init; typed as `version!: string` in Keystone class
		version: (keystone as unknown as Record<string, unknown>)['version'],
		wysiwyg: { options: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			enableS3Uploads: keystone.get('wysiwyg s3 images') ? true : false,
			additionalButtons: (keystone.get('wysiwyg additional buttons') as string | undefined) ?? '',
			additionalPlugins: (keystone.get('wysiwyg additional plugins') as string | undefined) ?? '',
			additionalOptions: (keystone.get('wysiwyg additional options') as Record<string, unknown> | undefined) ?? {},
			overrideToolbar: keystone.get('wysiwyg override toolbar'),
			skin: (keystone.get('wysiwyg skin') as string | undefined) ?? 'keystone',
			menubar: keystone.get('wysiwyg menubar'),
			importcss: (keystone.get('wysiwyg importcss') as string | undefined) ?? '',
		} },
	};

	const codemirrorPath = keystone.get('codemirror url path')
		? '/' + String(keystone.get('codemirror url path'))
		: getAdminLegacyPath(keystone) + '/js/lib/codemirror';

	const locals: Record<string, unknown> = {
		adminLegacyPath: keystoneData['adminLegacyPath'],
		assetVersion: getLegacyAssetVersion(req),
		cloudinaryScript: false,
		codemirrorPath: codemirrorPath,
		cspNonce: String(res.locals['cspNonce'] ?? ''),
		env: keystone.get('env'),
		fieldTypes: keystone.fieldTypes,
		ga: {
			property: keystone.get('ga property'),
			domain: keystone.get('ga domain'),
		},
		keystone: keystoneData,
		tinymceScriptAvailable: hasOptionalPackage('tinymce'),
		title: (keystone.get('name') as string | undefined) ?? 'Keystone',
	};

	const cloudinaryConfig = keystone.get('cloudinary config');
	if (cloudinaryConfig) {
		const cloudinaryUpload = cloudinary.uploader.direct_upload();
		const cloudConfig = keystone.get('cloudinary config') as { cloud_name: string; api_key: string };
		keystoneData['cloudinary'] = {
			cloud_name: cloudConfig.cloud_name,
			api_key: cloudConfig.api_key,
			timestamp: (cloudinaryUpload as { hidden_fields: { timestamp: string; signature: string } }).hidden_fields.timestamp,
			signature: (cloudinaryUpload as { hidden_fields: { timestamp: string; signature: string } }).hidden_fields.signature,
		};
		locals['cloudinaryScript'] = cloudinary.cloudinary_js_config();
	}

	ejs.renderFile(templatePath, locals, { delimiter: '%' }, function (err, str) {
		if (err) {
			console.error('Could not render Admin UI Index Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Admin UI', err.message));
		}
		return res.send(str);
	});
}
