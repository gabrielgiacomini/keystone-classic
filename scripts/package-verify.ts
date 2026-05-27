import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { promisify } from 'node:util';
import { transform as transformWithEsbuild } from 'esbuild';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const packageLockPath = path.join(root, 'package-lock.json');
const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

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
	scripts?: Record<string, string>;
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error;
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

async function assertFileIncludes(relativePath: string, expected: string, label: string): Promise<void> {
	const source = await readFile(path.join(root, relativePath), 'utf8');
	assert(source.includes(expected), `${label}: ${relativePath} must include ${JSON.stringify(expected)}`);
}

async function assertNoFile(relativePath: string, label: string): Promise<void> {
	try {
		await access(path.join(root, relativePath));
	} catch {
		return;
	}
	throw new Error(label);
}

async function listFiles(relativePath: string): Promise<string[]> {
	const absolutePath = path.join(root, relativePath);
	let entries;
	try {
		entries = await readdir(absolutePath, { withFileTypes: true });
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return [];
		}
		throw error;
	}
	const files = await Promise.all(entries.map(async (entry) => {
		const childRelativePath = path.join(relativePath, entry.name);
		if (entry.isDirectory()) {
			return listFiles(childRelativePath);
		}
		return [childRelativePath];
	}));
	return files.flat();
}

async function assertNoSourcePattern(
	relativeRoots: string[],
	pattern: RegExp,
	label: string,
	allowFile?: (file: string) => boolean,
): Promise<void> {
	const files = (await Promise.all(relativeRoots.map(listFiles)))
		.flat()
		.filter((file) => file.endsWith('.mjs'))
		.filter((file) => !allowFile?.(file));

	const matches: string[] = [];
	for (const file of files) {
		const source = await readFile(path.join(root, file), 'utf8');
		const lines = source.split('\n');
		lines.forEach((line, index) => {
			if (pattern.test(line)) {
				matches.push(`${file}:${index + 1}: ${line.trim()}`);
			}
		});
	}

	assert(matches.length === 0, `${label}:\n${matches.join('\n')}`);
}

async function assertNoSourcePatternInExtensions(
	relativeRoots: string[],
	extensions: string[],
	pattern: RegExp,
	label: string,
	allowFile?: (file: string) => boolean,
): Promise<void> {
	const files = (await Promise.all(relativeRoots.map(listFiles)))
		.flat()
		.filter((file) => extensions.some((extension) => file.endsWith(extension)))
		.filter((file) => !allowFile?.(file));

	const matches: string[] = [];
	for (const file of files) {
		const source = await readFile(path.join(root, file), 'utf8');
		const lines = source.split('\n');
		lines.forEach((line, index) => {
			if (pattern.test(line)) {
				matches.push(`${file}:${index + 1}: ${line.trim()}`);
			}
		});
	}

	assert(matches.length === 0, `${label}:\n${matches.join('\n')}`);
}

async function assertSourceParses(
	relativeRoots: string[],
	label: string,
	allowFile?: (file: string) => boolean,
): Promise<void> {
	const files = (await Promise.all(relativeRoots.map(listFiles)))
		.flat()
		.filter((file) => file.endsWith('.mjs'))
		.filter((file) => !allowFile?.(file));

	const failures: string[] = [];
	for (const file of files) {
		try {
			await execFileAsync(process.execPath, ['--check', path.join(root, file)]);
		} catch (error) {
			const failure = error as { stderr?: string; stdout?: string; message?: string };
			failures.push(`${file}\n${failure.stderr || failure.stdout || failure.message || 'syntax check failed'}`);
		}
	}

	assert(failures.length === 0, `${label}:\n${failures.join('\n')}`);
}

async function assertSourceParsesWithJsx(relativeRoots: string[], label: string): Promise<void> {
	const files = (await Promise.all(relativeRoots.map(listFiles)))
		.flat()
		.filter((file) => file.endsWith('.mjs'));

	const failures: string[] = [];
	for (const file of files) {
		try {
			const source = await readFile(path.join(root, file), 'utf8');
			await transformWithEsbuild(source, {
				format: 'esm',
				jsx: 'transform',
				loader: 'jsx',
				sourcefile: file,
				target: 'es2018',
			});
		} catch (error) {
			const failure = error as { message?: string };
			failures.push(`${file}\n${failure.message || 'JSX transform parse failed'}`);
		}
	}

	assert(failures.length === 0, `${label}:\n${failures.join('\n')}`);
}

async function assertNoFilePattern(
	relativeFiles: string[],
	pattern: RegExp,
	label: string,
	allowFile?: (file: string) => boolean,
): Promise<void> {
	const matches: string[] = [];
	for (const file of relativeFiles) {
		if (allowFile?.(file)) {
			continue;
		}
		let source: string;
		try {
			source = await readFile(path.join(root, file), 'utf8');
		} catch (error) {
			if (isNodeError(error) && error.code === 'ENOENT') {
				continue;
			}
			throw error;
		}
		const lines = source.split('\n');
		lines.forEach((line, index) => {
			if (pattern.test(line)) {
				matches.push(`${file}:${index + 1}: ${line.trim()}`);
			}
		});
	}

	assert(matches.length === 0, `${label}:\n${matches.join('\n')}`);
}

function assertDistTarget(exportKey: string, condition: string, target: string): void {
	assert(typeof target === 'string' && target.length > 0, `${exportKey}.${condition} must be a non-empty string`);
	assert(!target.includes('..'), `${exportKey}.${condition} must not traverse outside the package`);
	assert(target.startsWith('./dist/'), `${exportKey}.${condition} must point at dist`);

	if (condition === 'types') {
		assert(
			target.endsWith('.d.mts') || target.endsWith('.d.ts'),
			`${exportKey}.${condition} must point at a declaration file`,
		);
		return;
	}

	if (condition === 'require') {
		assert(target.endsWith('.cjs'), `${exportKey}.${condition} must point at a CommonJS file`);
		return;
	}

	assert(
		target.endsWith('.mjs') || target.endsWith('.js'),
		`${exportKey}.${condition} must point at an emitted runtime file`,
	);
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
assert(
	Array.isArray(pkg.files)
		&& pkg.files.length === 1
		&& pkg.files[0] === 'dist',
	'package files must only publish dist',
);
assertNoRuntimeDependency('cloudinary');
assert(pkg.peerDependencies?.cloudinary === '^2.0.0', 'package.json must expose cloudinary as a v2 peer dependency');
assert(pkg.peerDependenciesMeta?.cloudinary?.optional === true, 'package.json must mark the cloudinary peer dependency as optional');
assert(pkg.devDependencies?.cloudinary === '^2.10.0', 'package.json must keep cloudinary as a local dev dependency for build/test');
assertNoRuntimeDependency('keystone-utils');
assert(pkg.devDependencies?.['keystone-utils'] === '^0.4.0', 'package.json must keep keystone-utils as a dev-only parity dependency');
assert(lockRoot.devDependencies?.['keystone-utils'] === '^0.4.0', 'package-lock root must keep keystone-utils as a dev-only parity dependency');
assertNoDirectDependency('method-override');
assertNoDirectDependency('keystone-storage-namefunctions');
assertNoDirectDependency('react-router');
assertNoDirectDependency('react-router-redux');
assertNoDirectDependency('browserify-shim');
assertNoDirectDependency('browserify-middleware');
assertNoDirectDependency('browserify');
assertNoDirectDependency('@types/browserify');
assertNoDirectDependency('swcify');
assertNoDirectDependency('react-markdown');
assertNoDirectDependency('react-images');
assertNoDirectDependency('react-scrolllock');
assertNoDirectDependency('react-prop-toggle');
assertNoDirectDependency('react-lifecycles-compat');
assertNoDirectDependency('react-day-picker');
assertNoDirectDependency('react-input-autosize');
assertNoDirectDependency('uglify-js');
assertNoDirectDependency('disc');
assertNoDirectDependency('brfs');
assertNoDirectDependency('watchify');
assertNoDirectDependency('@types/watchify');
assertNoDirectDependency('react-engine');
assertNoDirectDependency('@swc/core');
assertNoDirectDependency('superagent');
assertNoDirectDependency('keystone-email');
assertNoDirectDependency('cloudinary-microurl');
assertNoDirectDependency('i');
assertNoDirectDependency('chalk');
assertNoDirectDependency('greenlock-express');
assertNoDirectDependency('@types/greenlock-express');
assertNoDirectDependency('react-color');
assertNoDirectDependency('@types/numeral');
assertNoDirectDependency('keystone-tinymce');
assertNoDirectDependency('@types/lodash');
assertNoDirectDependency('enzyme');
assertNoDirectDependency('@cfaester/enzyme-adapter-react-18');
assertNoDirectDependency('cheerio');
assert(pkg.devDependencies?.esbuild === '^0.21.5', 'package.json must keep esbuild as the built-in legacy admin bundle builder');
assert(
	pkg.scripts?.['admin-parity:ledger'] === 'jiti scripts/admin-parity-ledger.ts',
	'package.json must expose the parity ledger closeout verifier',
);
assert(
	pkg.scripts?.['test:e2e-ui:visual']?.includes('e2e-ui/tests/visual-identity.spec.ts'),
	'package.json must expose the admin-next visual identity e2e guard',
);
assert(
	pkg.scripts?.['admin-parity']?.includes('npm run test:e2e-ui:visual'),
	'package.json admin-parity must include the visual identity e2e guard',
);
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
await assertFile('dist/admin/public-next/index.html');
await assertFile('dist/admin/client-legacy/App/index.mjs');
await assertFile('dist/admin/client-legacy/compat/elemental/FormInput.mjs');
await assertFile('dist/admin/client-legacy/compat/shared/Select.mjs');
await assertFile('dist/admin/client-legacy/utils/lists.mjs');
await assertFile('dist/admin/client-legacy/utils/glamor.mjs');
await assertFile('dist/admin/client-legacy/Signin/index.mjs');
await assertFile('dist/admin/public-legacy/styles/keystone.min.css');
await assertFile('dist/admin/public-legacy/js/lib/jquery/jquery-1.10.2.min.js');
await assertFile('dist/admin/server/templates-legacy/index.html');
await assertFile('dist/admin/server/templates-legacy/signin.html');
await assertFile('dist/fields/types/markdown/less/bootstrap-markdown.less');
await assertFile('scripts/admin-parity-final-gate.ts');
await assertFile('scripts/admin-parity-ledger.ts');
await assertFile('e2e-ui/tests/visual-identity.spec.ts');
await assertFile('docs/admin-modernization-upgrade-guide.md');
await assertFile('docs/admin-next-custom-field-migration.md');
await assertFileIncludes(
	'README.md',
	'docs/admin-modernization-upgrade-guide.md',
	'README must link the admin modernization upgrade guide',
);
await assertFileIncludes(
	'README.md',
	'docs/admin-next-custom-field-migration.md',
	'README must link the admin-next custom field migration guide',
);
await assertFileIncludes(
	'docs/admin-next-custom-field-migration.md',
	'window.Keystone.legacyFieldComponents',
	'custom field migration guide must document the legacy adapter surface',
);
await assertFileIncludes(
	'docs/admin-next-custom-field-migration.md',
	'Not supported for admin-next',
	'custom field migration guide must document unsupported legacy surfaces',
);
await assertFileIncludes(
	'docs/admin-next-custom-field-migration.md',
	'packages.js',
	'custom field migration guide must document the historical vendor bundle policy',
);
await assertFileIncludes(
	'docs/admin-modernization-upgrade-guide.md',
	'Package Compatibility Notes',
	'admin modernization upgrade guide must document package compatibility',
);
await assertFileIncludes(
	'docs/admin-modernization-upgrade-guide.md',
	'The package now publishes only `dist`',
	'admin modernization upgrade guide must document package contents',
);
await assertFileIncludes(
	'docs/admin-modernization-upgrade-guide.md',
	'npm run admin-parity:final',
	'admin modernization upgrade guide must document the final stabilization gate',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| Field type | Legacy UI owner | Admin-next owner | Field | Filter | Column | Status | Evidence |',
	'admin parity ledger built-in field table must keep explicit status and evidence columns',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| localfile | `fields/types/localfile/*.mjs` | `admin/client-next/src/fields/localfile` | Present | Present | Present | Out of scope |',
	'admin parity ledger must classify removed LocalFile as out of scope',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| signin | `admin/client-legacy/Signin` | `admin/client-next/src/routes/signin.tsx` | Complete |',
	'admin parity ledger must keep signin workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| signout | `admin/server/routes-legacy/signout.mts` | `admin/client-next/src/routes/signout.tsx` | Complete |',
	'admin parity ledger must keep signout workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| home/dashboard | `admin/client-legacy/App/screens/Home` | `admin/client-next/src/routes/home.tsx` | Complete |',
	'admin parity ledger must keep home/dashboard workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| create modal | legacy create modal | `CreateItemModal` and create route | Complete |',
	'admin parity ledger must keep create modal workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| bulk delete | legacy list bulk action | admin-next list route | Complete |',
	'admin parity ledger must keep bulk delete workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| item delete | legacy item delete flow | admin-next confirm/delete flow | Complete |',
	'admin parity ledger must keep item delete workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| relationship select/search | legacy relationship field | admin-next relationship field | Complete |',
	'admin parity ledger must keep relationship select/search workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| inverse relationship panels | legacy item relationship panels | `InverseRelationshipPanel` | Complete |',
	'admin parity ledger must keep inverse relationship panels workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list search | legacy list reducers/sagas/API | admin-next list route + API helpers | Complete |',
	'admin parity ledger must keep list search workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list sort | legacy list reducers/sagas/API | admin-next list route + API helpers | Complete |',
	'admin parity ledger must keep list sort workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list pagination | legacy list reducers/sagas/API | admin-next list route + shared list route state | Complete |',
	'admin parity ledger must keep list pagination workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list column configuration | legacy columns UI | admin-next list route + shared list route state | Complete |',
	'admin parity ledger must keep list column configuration workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| CSV download | legacy download API/link | admin-next list route/API | Complete |',
	'admin parity ledger must keep CSV download workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| upload flows | legacy upload fields/API | admin-next upload fields/API | Complete |',
	'admin parity ledger must keep upload flows workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| field explorer | legacy field e2e harness | field-complete admin-next suite | Complete |',
	'admin parity ledger must keep field explorer workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list navigation | legacy list screen/router | `admin/client-next/src/routes/$list.tsx` | Complete |',
	'admin parity ledger must keep list navigation workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| list filters | legacy filter components | admin-next field filters | Complete |',
	'admin parity ledger must keep list filters workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| item edit | legacy item screen | `admin/client-next/src/routes/$list.$id.tsx` | Complete |',
	'admin parity ledger must keep item edit workflow complete',
);
await assertFileIncludes(
	'docs/admin-modernization-parity-ledger.md',
	'| custom field compatibility | legacy `FieldTypes` runtime bundle | `admin/shared/fields/legacyAdapters.ts` + modern registry | Complete |',
	'admin parity ledger must keep custom field compatibility workflow complete',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'lint']]",
	'final admin parity gate must include lint',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'typecheck']]",
	'final admin parity gate must include typecheck',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'build']]",
	'final admin parity gate must include build',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'build-dev']]",
	'final admin parity gate must include development build',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'test:unit']]",
	'final admin parity gate must include unit tests',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'admin-parity']]",
	'final admin parity gate must include the canonical admin-parity check',
);
await assertFileIncludes(
	'scripts/admin-parity-final-gate.ts',
	"['npm', ['run', 'package:verify']]",
	'final admin parity gate must include package verification',
);
await assertFileIncludes(
	'.github/workflows/ci.yml',
	'npm run test:e2e-ui:visual',
	'CI admin-parity job must include the visual identity guard',
);
await assertFileIncludes(
	'scripts/ci-workflow-verify.ts',
	"assertJobContains('admin-parity', 'npm run test:e2e-ui:visual')",
	'CI workflow verifier must require the visual identity guard',
);
await assertFileIncludes(
	'e2e-ui/tests/visual-identity.spec.ts',
	'Visual identity: admin next',
	'visual identity e2e spec must cover admin-next visual parity',
);
await assertFileIncludes(
	'e2e-ui/tests/visual-identity.spec.ts',
	'keeps dashboard cards and list tables on legacy Keystone tokens',
	'visual identity e2e spec must cover dashboard and list workflows',
);
await assertFileIncludes(
	'e2e-ui/tests/visual-identity.spec.ts',
	'keeps edit forms and delete dialogs aligned with legacy controls',
	'visual identity e2e spec must cover item and dialog workflows',
);
await assertSourceParses(
	['admin/client-legacy', 'fields'],
	'built-in legacy support and field .mjs source must parse without a JSX transform',
	(file) => file.startsWith('admin/client-legacy/App/') || file.startsWith('admin/client-legacy/Signin/'),
);
await assertSourceParsesWithJsx(
	['admin/client-legacy/App', 'admin/client-legacy/Signin'],
	'restored legacy admin UI source must parse with the React 18 esbuild JSX transform',
);
await assertNoSourcePatternInExtensions(
	['admin/client-next', 'admin/shared'],
	['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx', '.css'],
	/admin\/client-legacy\/App|client-legacy\/App|admin\/public-legacy|public-legacy\/styles|\.less(?:['"]|$)|from ['"]less['"]|require\(['"]less['"]\)|less\.render/,
	'built-in modern admin source must not import legacy App, legacy LESS assets, or direct Less compiler APIs',
);
await assertNoSourcePatternInExtensions(
	['fields'],
	['.mjs'],
	/admin\/client-legacy\/App/,
	'published legacy field compatibility modules must not import the deleted legacy App root',
);
await assertNoSourcePatternInExtensions(
	['admin/client-next', 'admin/shared'],
	['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx'],
	/from ['"][^'"]*fields\/(?:components|types|mixins|explorer)\/[^'"]*\.mjs['"]/,
	'built-in modern admin source must not import legacy fields/**/*.mjs browser UI components',
);
await assertNoSourcePatternInExtensions(
	['admin/client-next', 'admin/shared'],
	['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx'],
	/import\(['"][^'"]*fields\/(?:components|types|mixins|explorer)\/[^'"]*\.mjs['"]\)/,
	'built-in modern admin source must not import legacy fields/**/*.mjs browser UI components',
);
await assertNoSourcePatternInExtensions(
	['admin/client-next', 'admin/shared'],
	['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx'],
	/require\(['"][^'"]*fields\/(?:components|types|mixins|explorer)\/[^'"]*\.mjs['"]\)/,
	'built-in modern admin source must not import legacy fields/**/*.mjs browser UI components',
);
await assertNoFile(
	'admin/client-legacy/packages.mjs',
	'legacy vendor package manifest and packages.js compatibility path must stay removed',
);

await assertNoFile(
	'vendor/react17-peer-forks',
	'vendored React peer forks must stay removed',
);

await assertNoFile(
	'test/enzyme.setup.cjs',
	'Enzyme test setup must stay removed after migrating legacy component tests',
);

await assertNoSourcePattern(
	['admin/client-legacy', 'fields'],
	/findDOMNode|this\.refs|(?<!h)ref=(["'])|UNSAFE_/,
	'built-in legacy .mjs source must not reintroduce findDOMNode, string refs, this.refs, or unsafe lifecycle markers',
	(file) => file.startsWith('admin/client-legacy/App/') || file.startsWith('admin/client-legacy/Signin/'),
);

await assertNoSourcePattern(
	['admin/client-legacy', 'fields'],
	/from ['"]prop-types['"]|PropTypes/,
	'built-in legacy admin and field source must not reintroduce PropTypes',
	(file) => file.startsWith('admin/client-legacy/App/') || file.startsWith('admin/client-legacy/Signin/'),
);

await assertNoSourcePatternInExtensions(
	['admin/client-legacy', 'fields', 'test/unit'],
	['.mjs', '.mts', '.ts'],
	/describe\.skip|it\.skip|TODO fix this test/,
	'admin legacy, field, and unit coverage must not reintroduce skipped suites or tests',
);

await assertNoSourcePatternInExtensions(
	['admin/client-legacy', 'fields', 'test/unit'],
	['.mjs', '.mts', '.ts'],
	/from ['"]enzyme['"]|require\(['"]enzyme['"]\)/,
	'admin legacy, field, and unit coverage must not reintroduce Enzyme',
);

await assertNoSourcePattern(
	['admin/client-legacy', 'fields'],
	/from ['"]react-router['"]|require\(['"]react-router['"]\)/,
	'built-in legacy .mjs source must not import React Router 3 directly',
);

await assertNoFilePattern(
	['scripts/build-legacy-admin-bundles.ts'],
	/from ['"]browserify['"]|require\(['"]browserify['"]\)|browserify\(/,
	'built-in legacy admin bundle build script must not use Browserify',
);

await assertNoFilePattern(
	['admin/server/middleware/legacyRuntimeBundler.mts'],
	/KEYSTONE_WRITE_DISC/,
	'legacy runtime compatibility middleware must not reintroduce retired Browserify transform stack paths',
);
await assertNoFilePattern(
	['admin/server/middleware/legacyRuntimeBundler.mts'],
	/from ['"](disc|watchify|browserify|swcify)['"]/,
	'legacy runtime compatibility middleware must not reintroduce retired Browserify transform stack paths',
);
await assertNoFilePattern(
	['admin/server/middleware/legacyRuntimeBundler.mts'],
	/import\(['"](disc|watchify|browserify|swcify)['"]\)/,
	'legacy runtime compatibility middleware must not reintroduce retired Browserify transform stack paths',
);
await assertNoFilePattern(
	['admin/server/middleware/legacyRuntimeBundler.mts'],
	/require\(['"](disc|watchify|browserify|swcify)['"]\)/,
	'legacy runtime compatibility middleware must not reintroduce retired Browserify transform stack paths',
);

await assertNoFilePattern(
	['admin/server/app/createAdminLegacyStaticRouter.mts'],
	/middleware\/browserify\.mjs/,
	'legacy static router must use the esbuild runtime compatibility bundler',
);

await assertNoFilePattern(
	[
		'admin/shared/state/queryParsers.mjs',
		'admin/shared/state/valueGuards.mjs',
		'admin/client-legacy/utils/queryParams.mjs',
		'admin/client-legacy/App/listStateMiddleware.mjs',
		'admin/client-legacy/utils/string.mjs',
		'lib/session.mts',
		'lib/core/initExpressSession.mts',
		'lib/content/index.mts',
		'admin/server/api/item/get.mts',
		'admin/server/api/download.mts',
		'fields/types/code/CodeField.mjs',
		'fields/types/localfiles/LocalFilesField.mjs',
		'fields/types/cloudinaryimages/CloudinaryImagesField.mjs',
		'fields/types/location/LocationField.mjs',
		'fields/types/password/PasswordType.mts',
		'fields/types/geopoint/GeoPointType.mts',
		'fields/types/relationship/RelationshipType.mts',
		'fields/types/Type.mts',
		'fields/types/relationship/RelationshipField.mjs',
		'fields/types/relationship/RelationshipFilter.mjs',
		'fields/types/cloudinary/CloudinaryType.mts',
		'fields/types/location/LocationType.mts',
		'test/e2e/utils.mjs',
		'test/e2e/keystone-nightwatch/index.mjs',
		'test/e2e/keystone-nightwatch/lib/src/utils.mjs',
	],
	/from ['"]lodash(?:\/[^'"]*)?['"]|require\(['"]lodash(?:\/[^'"]*)?['"]\)/,
	'guarded legacy admin, server, and field slices must not reintroduce lodash',
);

await assertNoFilePattern(
	[
		'fields/utils/date.mjs',
		'fields/components/DateInput.mjs',
		'fields/components/DayPicker.mjs',
		'fields/types/date/DateColumn.mjs',
		'fields/types/date/DateField.mjs',
		'fields/types/date/DateFilter.mjs',
		'fields/types/datearray/DateArrayField.mjs',
		'fields/types/datearray/DateArrayFilter.mjs',
		'fields/types/datetime/DatetimeField.mjs',
		'test/e2e/server.mjs',
		'test/e2e/keystone-nightwatch/index.mjs',
		'admin/client-legacy/utils/dateFormat.mjs',
	],
	/from ['"]moment['"]|require\(['"]moment['"]\)/,
	'guarded legacy display and old e2e slices must not reintroduce moment',
);

await assertNoFilePattern(
	[
		'fields/components/test/ItemTableCell.test.mjs',
		'fields/components/test/ItemTableValue.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/Popout.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutBody.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutFooter.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutHeader.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutList.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutListHeading.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutListItem.test.mjs',
		'admin/client-legacy/App/shared/Popout/test/PopoutPane.test.mjs',
		'admin/client-legacy/App/screens/Item/components/test/AltText.test.mjs',
		'admin/client-legacy/App/screens/Item/components/test/EditFormHeader.test.mjs',
		'admin/client-legacy/App/screens/Item/components/test/FormHeading.test.mjs',
		'admin/client-legacy/App/screens/Item/components/Toolbar/test/Toolbar.test.mjs',
		'admin/client-legacy/App/screens/Item/components/Toolbar/test/ToolbarSection.test.mjs',
		'admin/client-legacy/App/screens/Home/components/test/ListTile.test.mjs',
		'admin/client-legacy/App/screens/Home/components/test/Section.test.mjs',
		'admin/client-legacy/App/screens/Home/test/Home.test.mjs',
		'admin/client-legacy/App/test/App.test.mjs',
		'admin/client-legacy/App/components/Footer/test/component.test.mjs',
		'admin/client-legacy/App/components/Navigation/Primary/test/NavItem.test.mjs',
		'admin/client-legacy/App/components/Navigation/Primary/test/PrimaryNavigation.test.mjs',
		'admin/client-legacy/App/components/Navigation/Secondary/test/NavItem.test.mjs',
		'admin/client-legacy/App/components/Navigation/Mobile/test/ListItem.test.mjs',
		'admin/client-legacy/App/components/Navigation/Mobile/test/SectionItem.test.mjs',
		'admin/client-legacy/App/screens/Home/components/test/Lists.test.mjs',
		'admin/client-legacy/App/shared/test/AlertMessages.test.mjs',
		'admin/client-legacy/App/shared/test/ConfirmationDialog.test.mjs',
		'admin/client-legacy/App/shared/test/FlashMessage.test.mjs',
		'admin/client-legacy/App/shared/test/FlashMessages.test.mjs',
		'admin/client-legacy/App/shared/test/InvalidFieldType.test.mjs',
		'admin/client-legacy/App/shared/test/Portal.test.mjs',
		'admin/client-legacy/Signin/components/test/Alert.test.mjs',
		'admin/client-legacy/Signin/components/test/Brand.test.mjs',
		'admin/client-legacy/Signin/components/test/LoginForm.test.mjs',
		'admin/client-legacy/Signin/components/test/UserInfo.test.mjs',
		'admin/client-legacy/Signin/test/Signin.test.mjs',
	],
	/from ['"]enzyme['"]|require\(['"]enzyme['"]\)/,
	'migrated legacy component tests must not reintroduce Enzyme',
);

await assertNoFilePattern(
	['fields/types/Field.d.mts'],
	/componentWillMount|componentWillReceiveProps|this\.refs|refs:/,
	'legacy field declarations must not expose unsafe lifecycle or string-ref APIs',
);

await assertNoFilePattern(
	[
		'admin/client-legacy/App/elemental/Chip/index.mjs',
		'admin/client-legacy/App/elemental/DropdownButton/index.mjs',
		'admin/client-legacy/App/elemental/BlankState/index.mjs',
		'admin/client-legacy/App/elemental/Center/index.mjs',
		'admin/client-legacy/App/elemental/GlyphField/index.mjs',
		'admin/client-legacy/App/elemental/LoadingButton/index.mjs',
		'admin/client-legacy/App/elemental/Pagination/index.mjs',
		'admin/client-legacy/App/elemental/Pagination/page.mjs',
		'admin/client-legacy/App/index.mjs',
		'admin/client-legacy/App/screens/Item/index.mjs',
		'admin/client-legacy/App/screens/Item/components/EditForm.mjs',
		'admin/client-legacy/App/screens/Item/components/FooterBar.mjs',
		'admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsList.mjs',
		'admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsListDragDrop.mjs',
		'admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsListRow.mjs',
		'admin/client-legacy/App/screens/List/index.mjs',
		'admin/client-legacy/App/screens/List/components/Filtering/Filter.mjs',
		'admin/client-legacy/App/screens/List/components/Filtering/ListFilters.mjs',
		'admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs',
		'admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs',
		'admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTable.mjs',
		'admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDrop.mjs',
		'admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZone.mjs',
		'admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZoneTarget.mjs',
		'admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableRow.mjs',
		'admin/client-legacy/App/screens/List/components/ListColumnsForm.mjs',
		'admin/client-legacy/App/screens/List/components/ListControl.mjs',
		'admin/client-legacy/App/screens/List/components/ListDownloadForm.mjs',
		'admin/client-legacy/App/screens/List/components/ListHeaderButton.mjs',
		'admin/client-legacy/App/screens/List/components/ListHeaderSearch.mjs',
		'admin/client-legacy/App/screens/List/components/ListHeaderTitle.mjs',
		'admin/client-legacy/App/screens/List/components/ListHeaderToolbar.mjs',
		'admin/client-legacy/App/screens/List/components/ListManagement.mjs',
		'admin/client-legacy/App/screens/List/components/ListSort.mjs',
		'admin/client-legacy/App/screens/List/components/UpdateForm.mjs',
		'admin/client-legacy/App/shared/dragDrop.mjs',
		'admin/client-legacy/Signin/index.mjs',
		'admin/client-legacy/utils/concatClassnames.mjs',
		'fields/components/ImageThumbnail.mjs',
		'fields/components/NestedFormField.mjs',
		'fields/components/CollapsedFieldLabel.mjs',
		'fields/components/FileChangeMessage.mjs',
		'fields/components/HiddenFileInput.mjs',
		'fields/components/Lightbox.mjs',
		'fields/components/DateInput.mjs',
		'fields/components/DayPicker.mjs',
		'fields/explorer/components/FieldSpec.mjs',
		'fields/components/columns/ArrayColumn.mjs',
		'fields/components/columns/CloudinaryImageSummary.mjs',
		'fields/components/columns/IdColumn.mjs',
		'fields/components/columns/InvalidColumn.mjs',
		'fields/mixins/ArrayField.mjs',
		'fields/types/Field.mjs',
		'fields/types/boolean/BooleanFilter.mjs',
		'fields/types/boolean/BooleanColumn.mjs',
		'fields/types/boolean/BooleanField.mjs',
		'fields/types/cloudinary/CloudinaryColumn.mjs',
		'fields/types/cloudinary/CloudinaryField.mjs',
		'fields/types/cloudinaryimage/CloudinaryImageFilter.mjs',
		'fields/types/cloudinaryimage/CloudinaryImageColumn.mjs',
		'fields/types/cloudinaryimage/CloudinaryImageField.mjs',
		'fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs',
		'fields/types/cloudinaryimages/CloudinaryImagesField.mjs',
		'fields/types/cloudinaryimages/CloudinaryImagesThumbnail.mjs',
		'fields/types/code/CodeField.mjs',
		'fields/types/color/ColorColumn.mjs',
		'fields/types/color/ColorField.mjs',
		'fields/types/date/DateColumn.mjs',
		'fields/types/date/DateField.mjs',
		'fields/types/date/DateFilter.mjs',
		'fields/types/datearray/DateArrayFilter.mjs',
		'fields/types/datetime/DatetimeField.mjs',
		'fields/types/email/EmailColumn.mjs',
		'fields/types/email/EmailField.mjs',
		'fields/types/file/FileColumn.mjs',
		'fields/types/file/FileField.mjs',
		'fields/types/geopoint/GeoPointColumn.mjs',
		'fields/types/geopoint/GeoPointField.mjs',
		'fields/types/geopoint/GeoPointFilter.mjs',
		'fields/types/html/HtmlField.mjs',
		'fields/types/localfiles/LocalFilesColumn.mjs',
		'fields/types/location/LocationColumn.mjs',
		'fields/types/location/LocationField.mjs',
		'fields/types/location/LocationFilter.mjs',
		'fields/types/localfiles/LocalFilesField.mjs',
		'fields/types/markdown/MarkdownColumn.mjs',
		'fields/types/markdown/MarkdownField.mjs',
		'fields/types/money/MoneyField.mjs',
		'fields/types/name/NameColumn.mjs',
		'fields/types/name/NameField.mjs',
		'fields/types/numberarray/NumberArrayFilter.mjs',
		'fields/types/number/NumberColumn.mjs',
		'fields/types/number/NumberFilter.mjs',
		'fields/types/number/NumberField.mjs',
		'fields/types/password/PasswordColumn.mjs',
		'fields/types/password/PasswordFilter.mjs',
		'fields/types/password/PasswordField.mjs',
		'fields/types/relationship/RelationshipColumn.mjs',
		'fields/types/relationship/RelationshipField.mjs',
		'fields/types/relationship/RelationshipFilter.mjs',
		'fields/types/select/SelectColumn.mjs',
		'fields/types/select/SelectField.mjs',
		'fields/types/select/SelectFilter.mjs',
		'fields/types/text/TextColumn.mjs',
		'fields/types/text/TextFilter.mjs',
		'fields/types/textarray/TextArrayFilter.mjs',
		'fields/types/textarea/TextareaField.mjs',
		'fields/types/url/UrlColumn.mjs',
		'fields/types/url/UrlField.mjs',
	],
	/admin\/client-legacy\/App\/elemental['"]|admin\/client-legacy\/App\/elemental\/index\.mjs/,
	'migrated field files must import direct Elemental compatibility modules instead of the legacy aggregate barrel',
	(file) => file.startsWith('admin/client-legacy/App/'),
);

await assertNoFilePattern(
	[
		'admin/client-legacy/App/index.mjs',
		'admin/client-legacy/Signin/index.mjs',
		'admin/client-legacy/utils/concatClassnames.mjs',
	],
	/<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][A-Za-z0-9-]*(?:\s|>|\/>)/,
	'migrated legacy admin entrypoints and helpers must remain JSX-free',
);

await assertNoFilePattern(
	[
		'fields/explorer/index.mjs',
		'fields/explorer/components/FieldType.mjs',
		'fields/explorer/components/Markdown.mjs',
	],
	/<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][A-Za-z0-9-]*(?:\s|>|\/>)/,
	'migrated field explorer UI files must remain JSX-free',
);

await assertNoSourcePattern(
	['fields'],
	/admin\/client-legacy\/App\/elemental['"]|admin\/client-legacy\/App\/elemental\/index\.mjs/,
	'built-in field source must not import the legacy Elemental aggregate barrel',
);

await assertNoFilePattern(
	[
		'fields/components/columns/ArrayColumn.mjs',
		'fields/components/columns/CloudinaryImageSummary.mjs',
		'fields/components/columns/IdColumn.mjs',
		'fields/components/columns/InvalidColumn.mjs',
		'fields/types/boolean/BooleanColumn.mjs',
		'fields/types/cloudinary/CloudinaryColumn.mjs',
		'fields/types/cloudinary/CloudinaryField.mjs',
		'fields/types/cloudinaryimage/CloudinaryImageColumn.mjs',
		'fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs',
		'fields/types/color/ColorColumn.mjs',
		'fields/types/date/DateColumn.mjs',
		'fields/types/email/EmailColumn.mjs',
		'fields/types/file/FileColumn.mjs',
		'fields/types/geopoint/GeoPointColumn.mjs',
		'fields/types/localfiles/LocalFilesColumn.mjs',
		'fields/types/location/LocationColumn.mjs',
		'fields/types/markdown/MarkdownColumn.mjs',
		'fields/types/name/NameColumn.mjs',
		'fields/types/number/NumberColumn.mjs',
		'fields/types/password/PasswordColumn.mjs',
		'fields/types/relationship/RelationshipColumn.mjs',
		'fields/types/select/SelectColumn.mjs',
		'fields/types/text/TextColumn.mjs',
		'fields/types/url/UrlColumn.mjs',
	],
	/<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][A-Za-z0-9-]*(?:\s|>|\/>)/,
	'migrated field column renderers must remain JSX-free',
);

await assertNoFilePattern(
	['fields/explorer/server.mjs'],
	/from ['"](browserify|swcify|brfs)['"]|require\(['"](browserify|swcify|brfs)['"]\)|browserify\(/,
	'field explorer server must use esbuild instead of the retired Browserify transform stack',
);

await assertNoFilePattern(
	['fields/explorer/server.mjs'],
	/from ['"]less['"]|require\(['"]less['"]\)|less\.render|function createLessMiddleware/,
	'field explorer server must reuse the shared Less middleware instead of owning a direct Less compiler',
);

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
const textField = await import(`${pkg.name}/fields/types/text/TextField`);
assert(typeof textField.default === 'function', 'legacy text field compatibility subpath must import from dist');
const relationshipField = await import(`${pkg.name}/fields/types/relationship/RelationshipField`);
assert(
	typeof relationshipField.default === 'function',
	'legacy relationship field compatibility subpath must import from dist',
);

const storageNameFunctions = await import(`${pkg.name}/lib/storage/nameFunctions`);
assert(
	typeof storageNameFunctions.randomFilename === 'function',
	'storage nameFunctions subpath must expose randomFilename',
);
assert(
	typeof storageNameFunctions.ensureCallback === 'function',
	'storage nameFunctions subpath must expose ensureCallback',
);

const sharedApiFetch = await import(`${pkg.name}/admin/shared/api/fetch`);
assert(typeof sharedApiFetch.api === 'function', 'admin/shared/api/fetch subpath must expose api');

const sharedLegacyRequest = await import(`${pkg.name}/admin/shared/api/legacyRequest.mjs`);
assert(
	typeof sharedLegacyRequest.legacyApiRequest === 'function',
	'admin/shared/api/legacyRequest.mjs subpath must expose legacyApiRequest',
);

const sharedFieldRegistry = await import(`${pkg.name}/admin/shared/fields/registry`);
assert(
	typeof sharedFieldRegistry.getFieldComponents === 'function',
	'admin/shared/fields/registry subpath must expose getFieldComponents',
);

const sharedFieldAdapters = await import(`${pkg.name}/admin/shared/fields/legacyAdapters`);
assert(
	typeof sharedFieldAdapters.legacyComponentsToModernFieldSet === 'function',
	'admin/shared/fields/legacyAdapters subpath must expose legacyComponentsToModernFieldSet',
);
assert(
	typeof sharedFieldAdapters.registerLegacyFieldComponents === 'function',
	'admin/shared/fields/legacyAdapters subpath must expose registerLegacyFieldComponents',
);

const sharedCustomFields = await import(`${pkg.name}/admin/shared/fields/customFields`);
assert(
	typeof sharedCustomFields.registerRuntimeCustomFieldComponents === 'function',
	'admin/shared/fields/customFields subpath must expose registerRuntimeCustomFieldComponents',
);

const sharedQueryParsers = await import(`${pkg.name}/admin/shared/state/queryParsers.mjs`);
assert(
	typeof sharedQueryParsers.filtersParser === 'function',
	'admin/shared/state/queryParsers.mjs subpath must expose filtersParser',
);

const sharedValueGuards = await import(`${pkg.name}/admin/shared/state/valueGuards.mjs`);
assert(
	typeof sharedValueGuards.deepEqual === 'function',
	'admin/shared/state/valueGuards.mjs subpath must expose deepEqual',
);

const sharedListRoute = await import(`${pkg.name}/admin/shared/state/listRoute`);
assert(
	typeof sharedListRoute.validateListSearch === 'function',
	'admin/shared/state/listRoute subpath must expose validateListSearch',
);
assert(
	typeof sharedListRoute.buildListDownloadUrl === 'function',
	'admin/shared/state/listRoute subpath must expose buildListDownloadUrl',
);

console.log('package verification ok');
