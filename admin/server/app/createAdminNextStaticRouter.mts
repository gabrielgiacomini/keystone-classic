import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter } from 'express';
import express from 'express';
import type { Request, Response } from 'express';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import pkg from '../../../package.json' with { type: 'json' };
import { getAdminApiPath, getAdminNextPath, getAdminLegacyPath } from '../../../lib/core/adminSurfacePathUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicNextDir = path.resolve(__dirname, '../../public-next');
const publicNextIndexPath = path.join(publicNextDir, 'index.html');

function assertPublicNextBuildExists() {
	if (existsSync(publicNextIndexPath)) {
		return;
	}

	throw new Error(
		`Keystone admin next build is missing: ${publicNextIndexPath}. Run \`npm run admin-next:build\` before serving admin next.`
	);
}

function escapeForScriptJson(value: unknown): string {
	return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeHtmlAttribute(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nonEmptyString(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Derives a human-readable display name for the signed-in user.
 *
 * Mirrors the historical legacy admin resolution, which delegated to
 * `UserList.getDocumentName(user)` — that path invokes the configured
 * `nameField.format(user)` (e.g. the Name field's virtual `full`, "Test Admin").
 * Falls back to a plain `user.name` (string or `{first, last}` object), then to
 * email, then to the user `_id`. Returns `undefined` when no user is on the
 * request or no usable label exists.
 */
function getSignedInUserLabel(keystone: Keystone, req: Request): string | undefined {
	const user = req.user;
	if (!user) return undefined;

	const userModelKey = nonEmptyString(keystone.get('user model'));
	if (userModelKey) {
		try {
			const userList: (typeof keystone.lists)[string] | undefined = keystone.lists[userModelKey];
			const fromList = userList ? userList.getDocumentName(user) : undefined;
			const trimmed = nonEmptyString(typeof fromList === 'string' ? fromList : undefined);
			if (trimmed) return trimmed;
		} catch {
			// Fall through to the local resolution chain below.
		}
	}

	const name = user.name;
	if (typeof name === 'string') {
		const trimmed = name.trim();
		if (trimmed.length > 0) return trimmed;
	} else if (name !== null && typeof name === 'object' && !Array.isArray(name)) {
		const nameObj = name as Record<string, unknown>;
		const first = typeof nameObj.first === 'string' ? nameObj.first.trim() : '';
		const last = typeof nameObj.last === 'string' ? nameObj.last.trim() : '';
		const combined = `${first} ${last}`.trim();
		if (combined.length > 0) return combined;
	}

	const email = nonEmptyString(user.email);
	if (email) return email;

	if (typeof user._id === 'string') return user._id;
	if (typeof user._id === 'number' || typeof user._id === 'boolean' || typeof user._id === 'bigint') return String(user._id);
	if (typeof user._id === 'object' && user._id !== null && 'toString' in user._id) {
		const id = (user._id as { toString(): string }).toString();
		if (id !== '[object Object]') return id;
	}
	return user.id;

}

function resolveBrand(keystone: Keystone): string {
	const fromBrand = nonEmptyString(keystone.get('brand'));
	if (fromBrand) return fromBrand;
	const fromAppName = nonEmptyString(keystone.get('app name'));
	if (fromAppName) return fromAppName;
	return 'Keystone';
}

function resolveBackUrl(keystone: Keystone): string {
	const value = keystone.get('back url');
	const trimmed = nonEmptyString(value);
	return trimmed ?? '/';
}

function normalizeScriptUrls(value: unknown): string[] {
	const values = Array.isArray(value) ? value : [value];
	return values.flatMap((entry) => {
		const trimmed = nonEmptyString(entry);
		return trimmed ? [trimmed] : [];
	});
}

function resolveCustomFieldScripts(keystone: Keystone): string[] {
	return normalizeScriptUrls(keystone.get('admin next custom field scripts'));
}

function buildCustomFieldScriptTags(keystone: Keystone, nonceAttr: string): string {
	return resolveCustomFieldScripts(keystone)
		.map((src) => `<script type="module"${nonceAttr} src="${escapeHtmlAttribute(src)}"></script>`)
		.join('\n');
}

function injectHeadScripts(html: string, scripts: string): string {
	const appEntryScriptPattern = /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["'][^"']*\/assets\/)[^>]*><\/script>/;
	if (appEntryScriptPattern.test(html)) {
		return html.replace(appEntryScriptPattern, `${scripts}\n    $&`);
	}
	return html.replace('</head>', `${scripts}\n  </head>`);
}

function sendIndex(keystone: Keystone, req: Request, res: Response): void {
	assertPublicNextBuildExists();
	const html = readFileSync(publicNextIndexPath, 'utf8');
	const nonce = String(res.locals['cspNonce'] ?? '');
	const nonceAttr = nonce ? ` nonce="${escapeHtmlAttribute(nonce)}"` : '';
	const mountedAdminNextPath = nonEmptyString(req.baseUrl) ?? getAdminNextPath(keystone);
	const payload: Record<string, string> = {
		adminLegacyPath: getAdminLegacyPath(keystone),
		adminNextPath: mountedAdminNextPath,
		adminApiPath: getAdminApiPath(keystone),
		brand: resolveBrand(keystone),
		version: pkg.version,
		backUrl: resolveBackUrl(keystone),
	};
	const signedInUser = getSignedInUserLabel(keystone, req);
	if (signedInUser !== undefined) {
		payload.signedInUser = signedInUser;
	}
	const configScript = `<script${nonceAttr}>window.Keystone=${escapeForScriptJson(payload)};</script>`;
	const customFieldScripts = buildCustomFieldScriptTags(keystone, nonceAttr);
	const headScripts = [configScript, customFieldScripts].filter(Boolean).join('\n');
	res.type('html').send(injectHeadScripts(html, headScripts));
}

/**
 * Static-assets router for the admin-next SPA bundle.
 *
 * Serves only the built JS/CSS/image assets from `publicNextDir`. Does NOT
 * serve `index.html` or any SPA fallback. Mount this BEFORE session middleware
 * so unauthenticated users (e.g. the sign-in page) can load the bundle.
 */
export default function createAdminNextStaticRouter(keystone: Keystone): ExpressRouter {
	assertPublicNextBuildExists();
	void keystone; // intentionally unused — kept for symmetry with the index router
	const router = express.Router();
	router.use(express.static(publicNextDir, { index: false }));
	return router;
}

/**
 * Index/HTML router for the admin-next SPA.
 *
 * Serves `index.html` for `/`, `/index.html`, and SPA fallback paths. Mount
 * this AFTER `bindSessionMiddleware` so `req.user` is populated when
 * `sendIndex()` builds the `window.Keystone` payload (the inline script must
 * include `signedInUser` for authenticated requests).
 */
export function createAdminNextIndexRouter(keystone: Keystone): ExpressRouter {
	assertPublicNextBuildExists();

	const router = express.Router();

	router.get('/index.html', (req, res) => {
		sendIndex(keystone, req, res);
	});

	// SPA HTML5 history fallback — send index.html for unmatched UI paths only.
	// Asset-looking requests are passed through so downstream middleware can
	// handle them instead of receiving index.html.
	router.use((req, res, next) => {
		if (
			req.path === '/api' ||
			req.path.startsWith('/api/') ||
			req.path.includes('.')
		) {
			return next();
		}
		sendIndex(keystone, req, res);
	});

	return router;
}
