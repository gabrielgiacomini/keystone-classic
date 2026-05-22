import type { NextFunction, Request, RequestHandler, Response } from 'express';
import fs from 'node:fs/promises';
import less from 'less';
import path from 'node:path';

interface LessMiddlewareOptions extends Record<string, unknown> {
	render?: Record<string, unknown>;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toRenderOptions(options: LessMiddlewareOptions, sourcePath: string): Less.Options {
	const { render, ...topLevel } = options;
	const renderOptions = {
		...topLevel,
		...(isObject(render) ? render : {}),
	} as Less.Options;
	const configuredPaths = Array.isArray(renderOptions.paths) ? renderOptions.paths : [];
	renderOptions.paths = [path.dirname(sourcePath), ...configuredPaths];
	renderOptions.filename = sourcePath;
	return renderOptions;
}

function resolveLessPath(root: string, requestPath: string): { sourcePath: string; minified: boolean } | null {
	const pathname = requestPath.split('?')[0] ?? '';
	if (!pathname.endsWith('.css')) return null;

	let decodedPath: string;
	try {
		decodedPath = decodeURIComponent(pathname);
	} catch (_err) {
		return null;
	}

	const minified = decodedPath.endsWith('.min.css');
	const cssRelativePath = path.normalize(decodedPath).replace(/^[/\\]+/, '');
	const lessRelativePath = cssRelativePath.replace(/(?:\.min)?\.css$/, '.less');
	const sourcePath = path.resolve(root, lessRelativePath);
	const rootPrefix = root.endsWith(path.sep) ? root : root + path.sep;

	if (sourcePath !== root && !sourcePath.startsWith(rootPrefix)) return null;
	return { sourcePath, minified };
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error;
}

export default function createLessMiddleware(rootPath: string, options: LessMiddlewareOptions = {}): RequestHandler {
	const root = path.resolve(rootPath);
	return function lessCompiler(req: Request, res: Response, next: NextFunction): void {
		void compileLess(root, options, req, res, next);
	};
}

async function compileLess(root: string, options: LessMiddlewareOptions, req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			next();
			return;
		}

		const resolved = resolveLessPath(root, req.path);
		if (!resolved) {
			next();
			return;
		}

		try {
			const lessSource = await fs.readFile(resolved.sourcePath, 'utf8');
			const output = await less.render(lessSource, toRenderOptions(options, resolved.sourcePath));
			res.type('css').send(output.css);
		} catch (err: unknown) {
			if (isErrnoException(err) && err.code === 'ENOENT') {
				next();
				return;
			}
			next(err);
		}
}
