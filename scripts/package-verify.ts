import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const packageLockPath = path.join(root, 'package-lock.json');
const require = createRequire(import.meta.url);

type ConditionalExport = {
	default: string;
	import: string;
	require?: string;
	types: string;
};

type PackageJson = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	exports: Record<string, ConditionalExport | string>;
	files: string[];
	main: string;
	name: string;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<string, { optional?: boolean }>;
	type: string;
	types: string;
};

type PackageLock = {
	packages?: Record<string, {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	}>;
};

const pkg = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;
const lock = JSON.parse(await readFile(packageLockPath, 'utf8')) as PackageLock;
const lockRoot = lock.packages?.[''] ?? {};

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

function assertNoRuntimeDependency(name: string): void {
	assert(pkg.dependencies?.[name] === undefined, `package.json must not ship ${name} as a runtime dependency`);
	assert(lockRoot.dependencies?.[name] === undefined, `package-lock root must not ship ${name} as a runtime dependency`);
}

function assertNoDirectDependency(name: string): void {
	assertNoRuntimeDependency(name);
	assert(pkg.devDependencies?.[name] === undefined, `package.json must not ship ${name} as a direct dev dependency`);
	assert(lockRoot.devDependencies?.[name] === undefined, `package-lock root must not ship ${name} as a direct dev dependency`);
}

async function assertFile(relativePath: string): Promise<void> {
	await access(path.join(root, relativePath));
}

function assertDistTarget(exportKey: string, condition: string, target: string): void {
	assert(typeof target === 'string' && target.length > 0, `${exportKey}.${condition} must be a non-empty string`);
	assert(!target.includes('..'), `${exportKey}.${condition} must not traverse outside the package`);
	assert(target.startsWith('./dist/'), `${exportKey}.${condition} must point at dist`);

	if (condition === 'types') {
		assert(target.endsWith('.d.mts'), `${exportKey}.${condition} must point at a declaration file`);
		return;
	}

	if (condition === 'require') {
		assert(target.endsWith('.cjs'), `${exportKey}.${condition} must point at a CommonJS file`);
		return;
	}

	assert(target.endsWith('.mjs'), `${exportKey}.${condition} must point at an emitted runtime file`);
}

async function assertExportFile(exportKey: string, condition: string, target: string): Promise<void> {
	assertDistTarget(exportKey, condition, target);
	if (target.includes('*')) {
		return;
	}
	await assertFile(target.slice('./'.length));
}

assert(pkg.type === 'module', 'package.json must keep "type": "module"');
assert(typeof pkg.main === 'string' && pkg.main.length > 0, 'package.json must declare "main"');
assert(typeof pkg.types === 'string' && pkg.types.length > 0, 'package.json must declare "types"');
assert(pkg.main === 'dist/index.mjs', 'package.json "main" must point at dist/index.mjs');
assert(pkg.types === 'dist/index.d.mts', 'package.json "types" must point at dist/index.d.mts');
assert(Array.isArray(pkg.files) && pkg.files.length === 1 && pkg.files[0] === 'dist', 'package files must publish dist only');
assertNoRuntimeDependency('cloudinary');
assert(pkg.peerDependencies?.cloudinary === '^2.0.0', 'package.json must expose cloudinary as a v2 peer dependency');
assert(pkg.peerDependenciesMeta?.cloudinary?.optional === true, 'package.json must mark the cloudinary peer dependency as optional');
assert(pkg.devDependencies?.cloudinary === '^2.10.0', 'package.json must keep cloudinary as a local dev dependency for build/test');
assertNoRuntimeDependency('keystone-utils');
assert(pkg.devDependencies?.['keystone-utils'] === '^0.4.0', 'package.json must keep keystone-utils as a dev-only parity dependency');
assert(lockRoot.devDependencies?.['keystone-utils'] === '^0.4.0', 'package-lock root must keep keystone-utils as a dev-only parity dependency');
assertNoDirectDependency('method-override');
assertNoDirectDependency('keystone-storage-namefunctions');
assert(pkg.exports && typeof pkg.exports === 'object' && !Array.isArray(pkg.exports), 'package.json must declare an exports map');
const rootExport = pkg.exports['.'];
assert(rootExport && typeof rootExport === 'object' && !Array.isArray(rootExport), 'root export must use conditional object form');
assert(rootExport.import === './dist/index.mjs', 'root export import must point at dist/index.mjs');
assert(rootExport.require === './dist/index.cjs', 'root export require must point at dist/index.cjs');
assert(rootExport.types === './dist/index.d.mts', 'root export types must point at dist/index.d.mts');

for (const [exportKey, exportValue] of Object.entries(pkg.exports)) {
	if (exportKey === './package.json') {
		assert(exportValue === './package.json', './package.json export must point at package.json');
		continue;
	}

	assert(
		exportValue && typeof exportValue === 'object' && !Array.isArray(exportValue),
		`${exportKey} export must use conditional object form`,
	);
	assert(typeof exportValue.types === 'string', `${exportKey} export must declare types`);
	assert(typeof exportValue.import === 'string', `${exportKey} export must declare import`);
	assert(typeof exportValue.default === 'string', `${exportKey} export must declare default`);
	assert(exportValue.import === exportValue.default, `${exportKey} import/default targets must match`);

	await assertExportFile(exportKey, 'types', exportValue.types);
	await assertExportFile(exportKey, 'import', exportValue.import);
	await assertExportFile(exportKey, 'default', exportValue.default);
	if (exportValue.require !== undefined) {
		await assertExportFile(exportKey, 'require', exportValue.require);
	}
}

await assertFile(pkg.main);
await assertFile(pkg.types);
await assertFile('dist/index.cjs');
await assertFile('dist/package.json');
await assertFile('dist/admin/server/index.mjs');
await assertFile('dist/admin/server/templates-legacy/index.html');
await assertFile('dist/admin/public-next/index.html');
await assertFile('dist/admin/public-legacy/styles/keystone.less');
await assertFile('dist/admin/public-legacy/js/admin.js');
await assertFile('dist/admin/public-legacy/js/fields.js');
await assertFile('dist/admin/public-legacy/js/packages.js');
await assertFile('dist/admin/public-legacy/js/signin.js');
await assertFile('dist/admin/client-legacy/App/index.mjs');
await assertFile('dist/fields/types/markdown/less/bootstrap-markdown.less');

const rootModule = await import(pkg.name);
assert(rootModule.default, 'root package import must expose a default Keystone singleton');
assert(typeof rootModule.Keystone === 'function', 'root package import must expose Keystone constructor');
assert(typeof rootModule.default.Types === 'object', 'root package import must expose default.Types');
assert(
	rootModule.default.Types === rootModule.Types,
	'root package import default.Types must match the named Types export',
);
assert(
	typeof rootModule.default.Admin?.Server?.createAdminNextStaticRouter === 'function',
	'root package import must expose Admin.Server.createAdminNextStaticRouter',
);
assert(
	typeof rootModule.default.Admin?.Server?.createStaticRouter === 'function',
	'root package import must expose Admin.Server.createStaticRouter',
);
assert(
	typeof rootModule.default.Admin?.Server?.createDynamicRouter === 'function',
	'root package import must expose Admin.Server.createDynamicRouter',
);
assert(typeof rootModule.default.utils?.keyToLabel === 'function', 'root package import must expose default.utils.keyToLabel');
assert(
	rootModule.default.utils.keyToLabel('fieldName') === 'Field Name',
	'root package import default.utils.keyToLabel must preserve Keystone utility behavior',
);
const legacyStaticRouter = rootModule.default.Admin.Server.createStaticRouter(rootModule.default);
assert(
	typeof legacyStaticRouter === 'function' && typeof legacyStaticRouter.use === 'function',
	'root package import must create the legacy admin static router',
);

type RequiredKeystoneRoot = {
	default?: RequiredKeystoneRoot;
	Admin?: {
		Server?: {
			createDynamicRouter?: unknown;
			createStaticRouter?: unknown;
		};
	};
	Field?: { Types?: unknown };
	Keystone?: unknown;
	List?: unknown;
	Types?: unknown;
	utils?: { keyToPath?: unknown };
};

const requiredRoot = require(pkg.name) as RequiredKeystoneRoot;
const requiredDefault: RequiredKeystoneRoot = requiredRoot.default ?? requiredRoot;
assert(requiredRoot === requiredDefault, 'root package require must return the Keystone singleton directly');
assert(typeof requiredDefault.Keystone === 'function', 'root package require must expose default.Keystone');
assert(typeof requiredDefault.List === 'function', 'root package require must expose default.List');
assert(typeof requiredDefault.Types === 'object', 'root package require must expose default.Types');
assert(typeof requiredDefault.Field?.Types === 'object', 'root package require must expose default.Field.Types');
assert(typeof requiredDefault.utils?.keyToPath === 'function', 'root package require must expose default.utils.keyToPath');
assert(requiredDefault.utils.keyToPath('FieldName', true) === 'field-names', 'root package require default.utils.keyToPath must work');
assert(
	typeof requiredDefault.Admin?.Server?.createStaticRouter === 'function',
	'root package require must expose Admin.Server.createStaticRouter',
);
assert(
	typeof requiredDefault.Admin?.Server?.createDynamicRouter === 'function',
	'root package require must expose Admin.Server.createDynamicRouter',
);
const requiredLegacyStaticRouter = requiredDefault.Admin.Server.createStaticRouter(requiredDefault as typeof rootModule.default);
assert(
	typeof requiredLegacyStaticRouter === 'function' && typeof requiredLegacyStaticRouter.use === 'function',
	'root package require must create the legacy admin static router',
);
const requiredLegacyDynamicRouter = requiredDefault.Admin.Server.createDynamicRouter(requiredDefault as typeof rootModule.default);
assert(
	typeof requiredLegacyDynamicRouter === 'function' && typeof requiredLegacyDynamicRouter.use === 'function',
	'root package require must create the legacy admin dynamic router',
);

const adminServer = await import(`${pkg.name}/admin/server`);
assert(
	typeof adminServer.createAdminNextStaticRouter === 'function',
	'admin/server import must expose createAdminNextStaticRouter',
);
assert(
	typeof adminServer.default?.createAdminNextStaticRouter === 'function',
	'admin/server default import must expose createAdminNextStaticRouter',
);
assert(
	typeof adminServer.default?.createStaticRouter === 'function',
	'admin/server default import must expose createStaticRouter',
);
assert(
	typeof adminServer.default?.createDynamicRouter === 'function',
	'admin/server default import must expose createDynamicRouter',
);

const requiredAdminServer = require(`${pkg.name}/admin/server`) as {
	createAdminNextStaticRouter?: unknown;
	createDynamicRouter?: unknown;
	createStaticRouter?: unknown;
	default?: {
		createDynamicRouter?: unknown;
		createStaticRouter?: unknown;
	};
};
assert(
	typeof requiredAdminServer.createAdminNextStaticRouter === 'function',
	'admin/server require must expose createAdminNextStaticRouter',
);
assert(
	typeof requiredAdminServer.createStaticRouter === 'function',
	'admin/server require must expose createStaticRouter',
);
assert(
	typeof requiredAdminServer.createDynamicRouter === 'function',
	'admin/server require must expose createDynamicRouter',
);
assert(
	requiredAdminServer.default === requiredAdminServer,
	'admin/server require default must point at the CommonJS admin server object',
);
assert(
	typeof requiredAdminServer.default?.createStaticRouter === 'function',
	'admin/server require default must expose createStaticRouter',
);

const fieldTypes = await import(`${pkg.name}/lib/fieldTypes`);
assert(typeof fieldTypes.default === 'object', 'lib/fieldTypes subpath must import from dist');

const textType = await import(`${pkg.name}/fields/types/text/TextType`);
assert(typeof textType.default === 'function', 'field type subpath must import from dist');

const storageNameFunctions = await import(`${pkg.name}/lib/storage/nameFunctions`);
assert(
	typeof storageNameFunctions.randomFilename === 'function',
	'storage nameFunctions subpath must expose randomFilename',
);
assert(
	typeof storageNameFunctions.ensureCallback === 'function',
	'storage nameFunctions subpath must expose ensureCallback',
);

console.log('package verification ok');
