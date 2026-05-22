import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Resolves the installed package directory for a dependency specifier.
 * @param specifier Package name or package subpath to resolve.
 * @returns Absolute directory containing the resolved package entry.
 */
export function resolvePackageDir(specifier: string): string {
	return path.dirname(require.resolve(specifier));
}

/**
 * Resolves an optional package directory when installed.
 * @param specifier Package name or package subpath to resolve.
 * @returns Absolute package directory, or `null` when the package is absent.
 */
export function resolveOptionalPackageDir(specifier: string): string | null {
	try {
		return resolvePackageDir(specifier);
	} catch (error) {
		const code = (error as { code?: unknown }).code;
		if (code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND') {
			return null;
		}
		throw error;
	}
}

/**
 * Checks whether an optional package can be resolved by the current package.
 * @param specifier Package name or package subpath to resolve.
 * @returns Whether the optional package is installed and resolvable.
 */
export function hasOptionalPackage(specifier: string): boolean {
	return resolveOptionalPackageDir(specifier) !== null;
}
