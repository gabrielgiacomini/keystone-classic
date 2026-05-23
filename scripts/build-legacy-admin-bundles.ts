import browserify from 'browserify';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import swcify from 'swcify';
import { minify } from 'terser';
import packages from '../admin/client-legacy/packages.mjs';

type BrowserifyBundle = {
	bundle(callback: (err: Error | null, buff: Buffer) => void): void;
};

const root = process.cwd();
const distRoot = path.join(root, 'dist');
const bundleRoot = await pathExists(path.join(distRoot, 'admin', 'client-legacy', 'App', 'index.mjs'))
	? distRoot
	: root;
const outDirs = [
	path.join(root, 'admin', 'public-legacy', 'js'),
];
if (await pathExists(path.join(distRoot, 'admin', 'public-legacy'))) {
	outDirs.push(path.join(distRoot, 'admin', 'public-legacy', 'js'));
}
const clientLegacyDir = path.join(bundleRoot, 'admin', 'client-legacy');
const fieldTypesDir = path.join(bundleRoot, 'fields', 'types');
const production = process.env.NODE_ENV === 'production';
const packageNames = packages as string[];

const browserifyAliases: Record<string, string> = {
	marked: 'marked/marked.min.js',
};

async function pathExists(target: string): Promise<boolean> {
	try {
		await fs.access(target);
		return true;
	} catch {
		return false;
	}
}

async function bundle(browserifyInstance: BrowserifyBundle): Promise<string> {
	return new Promise((resolve, reject) => {
		browserifyInstance.bundle((err, buff) => {
			if (err) {
				reject(err);
			} else {
				resolve(buff.toString('utf8'));
			}
		});
	});
}

async function writeOutput(fileName: string, source: string, shouldMinify = false): Promise<void> {
	let code = source;
	if (shouldMinify) {
		const result = await minify(code, {
			compress: true,
			mangle: true,
			format: {
				beautify: false,
				semicolons: true,
			},
		});
		code = result.code ?? code;
	}
	for (const outDir of outDirs) {
		const target = path.join(outDir, fileName);
		await fs.mkdir(path.dirname(target), { recursive: true });
		await fs.writeFile(target, code, 'utf8');
		console.log(`wrote ${path.relative(root, target)}`);
	}
}

async function buildPackagesBundle() {
	const b = browserify({
		debug: !production,
	});
	b.transform(swcify);
	packageNames.forEach((packageName) => {
		b.require(browserifyAliases[packageName] ?? packageName, { expose: packageName });
	});
	await writeOutput('packages.js', await bundle(b), production);
}

async function listBuiltInFieldTypes(): Promise<Record<string, string>> {
	const entries = await fs.readdir(fieldTypesDir, { withFileTypes: true });
	const fieldTypes: Record<string, string> = {};
	await Promise.all(entries.map(async (entry) => {
		if (!entry.isDirectory()) return;
		const dir = path.join(fieldTypesDir, entry.name);
		const files = await fs.readdir(dir);
		const typeFile = files.find((file) => file.endsWith('Type.mjs') || file.endsWith('Type.mts'));
		if (!typeFile) return;
		const properName = typeFile.replace(/Type\.m[jt]s$/, '');
		const requiredComponents = ['Column', 'Field', 'Filter'].map((kind) => `${properName}${kind}.mjs`);
		if (requiredComponents.every((file) => files.includes(file))) {
			fieldTypes[entry.name] = properName;
		}
	}));
	return Object.fromEntries(Object.entries(fieldTypes).sort(([a], [b]) => a.localeCompare(b)));
}

function buildFieldTypesStream(fieldTypes: Record<string, string>): Readable {
	const lines: string[] = [];
	const imports: string[] = [];
	const types = Object.keys(fieldTypes);
	['Column', 'Field', 'Filter'].forEach((kind) => {
		types.forEach((type) => {
			const binding = `${type}$${kind}`;
			imports.push(`import ${binding} from "../../fields/types/${type}/${fieldTypes[type]}${kind}.mjs";`);
		});
	});
	imports.push('import id$Column from "../../fields/components/columns/IdColumn.mjs";');
	imports.push('import unrecognised$Column from "../../fields/components/columns/InvalidColumn.mjs";');
	lines.push(...imports, '');
	['Column', 'Field', 'Filter'].forEach((kind) => {
		lines.push(`export const ${kind}s = {`);
		types.forEach((type) => {
			lines.push(`\t${type}: ${type}$${kind},`);
		});
		if (kind === 'Column') {
			lines.push('\tid: id$Column,');
			lines.push('\t__unrecognised__: unrecognised$Column,');
		}
		lines.push('};');
	});
	return Readable.from(`${lines.join('\n')}\n`);
}

function createAppBundle(file: string) {
	const b = browserify(file, {
		basedir: clientLegacyDir,
		debug: !production,
	});
	b.transform(swcify);
	b.exclude('FieldTypes');
	packageNames.forEach((packageName) => b.exclude(packageName));
	return b;
}

function createFieldTypesBundle(fieldTypes: Record<string, string>) {
	const b = browserify({
		basedir: clientLegacyDir,
		debug: !production,
	});
	b.require(buildFieldTypesStream(fieldTypes), { expose: 'FieldTypes' });
	b.transform(swcify);
	b.exclude('FieldTypes');
	packageNames.forEach((packageName) => b.exclude(packageName));
	return b;
}

await buildPackagesBundle();
const fieldTypes = await listBuiltInFieldTypes();
await writeOutput('fields.js', await bundle(createFieldTypesBundle(fieldTypes)));
await writeOutput('signin.js', await bundle(createAppBundle('./Signin/index.mjs')));
await writeOutput('admin.js', await bundle(createAppBundle('./App/index.mjs')));
