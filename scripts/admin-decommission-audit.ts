import { accessSync, readdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argSet = new Set(args);

if (argSet.has('--help')) {
	printHelp();
	process.exit(0);
}

const root = path.resolve(valueArg('--root') ?? process.cwd());
const forbiddenPaths = [
	'admin/client-legacy/App',
	'admin/client-legacy/Signin',
	'admin/client-legacy/packages.mjs',
	'admin/server/templates-legacy',
	'admin/server/routes-legacy',
	'admin/public-legacy',
	'dist/admin/client-legacy/App',
	'dist/admin/client-legacy/Signin',
	'dist/admin/client-legacy/packages.mjs',
	'dist/admin/server/templates-legacy',
	'dist/admin/server/routes-legacy',
	'dist/admin/public-legacy',
];
const serverFieldRoot = 'fields/types';
const stableModernFieldRoots = [
	'admin/client-next/src/fields',
	'admin/client/src/fields',
	'admin/shared/fields',
];

const present = forbiddenPaths.filter((relativePath) => pathExists(path.join(root, relativePath)));
const serverFieldTypeFiles = listFiles(path.join(root, serverFieldRoot))
	.filter((file) => file.endsWith('Type.mts'));
const modernFieldRoot = stableModernFieldRoots.find((relativePath) => pathExists(path.join(root, relativePath)));

if (present.length > 0) {
	console.error(`legacy client decommission audit found ${present.length} legacy path(s):`);
	for (const relativePath of present) {
		console.error(`- ${relativePath}`);
	}
	console.error('Remove or isolate these legacy browser/server roots before final decommission.');
	process.exit(1);
}

if (serverFieldTypeFiles.length === 0) {
	console.error(`legacy client decommission audit found no server/model field classes under ${serverFieldRoot}`);
	console.error('Keep server/model field classes such as fields/types/*Type.mts during admin client decommission.');
	process.exit(1);
}

if (!modernFieldRoot) {
	console.error('legacy client decommission audit found no stable modern browser field root.');
	console.error(`Expected one of: ${stableModernFieldRoots.join(', ')}`);
	process.exit(1);
}

console.log(`legacy client decommission audit passed for ${root}`);
console.log(`server/model field classes: ${serverFieldTypeFiles.length}`);
console.log(`modern browser field root: ${modernFieldRoot}`);

function valueArg(name: string): string | undefined {
	const index = args.indexOf(name);
	if (index === -1) {
		return undefined;
	}
	const value = args[index + 1];
	if (!value || value.startsWith('--')) {
		throw new Error(`${name} requires a value`);
	}
	return value;
}

function pathExists(absolutePath: string): boolean {
	try {
		accessSync(absolutePath);
		return true;
	} catch {
		return false;
	}
}

function listFiles(absolutePath: string): string[] {
	try {
		const entries = readdirSync(absolutePath, { withFileTypes: true });
		return entries.flatMap((entry) => {
			const childPath = path.join(absolutePath, entry.name);
			if (entry.isDirectory()) {
				return listFiles(childPath);
			}
			return [childPath];
		});
	} catch {
		return [];
	}
}

function printHelp(): void {
	console.log(`Usage: jiti scripts/admin-decommission-audit.ts [options]

Verify that legacy browser/server roots named by the convergence plan have been
removed or isolated from source and dist package output before final legacy
client decommission. Also verifies that server/model field classes remain and
modern browser field code has a stable root.

Options:
  --root PATH  Repository root to audit. Defaults to the current working directory.
  --help       Show this help.
`);
}
