import path from 'node:path';
import { build } from 'vite';

interface BuildOptions {
	entry?: string;
	outDir: string;
	fileName: string;
	emptyOutDir: boolean;
}

const root = process.cwd();

function printHelp(): void {
	console.log(`Usage: jiti scripts/build-admin-next-custom-fields.ts --entry <file> [options]

Builds a deployment-owned admin-next custom field module script.

Options:
  --entry <file>       Required. Entry module that populates window.Keystone.fieldComponents
                       or window.Keystone.legacyFieldComponents.
  --outDir <dir>      Output directory. Defaults to admin/public-next/custom-fields.
  --fileName <name>   Output JavaScript file name. Defaults to custom-fields.js.
  --emptyOutDir       Clear the output directory before writing.
  --help              Show this message.
`);
}

function readOption(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	if (index === -1) return undefined;
	const value = args[index + 1];
	if (value === undefined || value.startsWith('--')) {
		throw new Error(`${name} requires a value`);
	}
	return value;
}

function readOptions(args: string[]): BuildOptions {
	if (args.includes('--help') || args.includes('-h')) {
		printHelp();
		process.exit(0);
	}

	const entry = readOption(args, '--entry');
	return {
		entry,
		outDir: path.resolve(root, readOption(args, '--outDir') ?? 'admin/public-next/custom-fields'),
		fileName: readOption(args, '--fileName') ?? 'custom-fields.js',
		emptyOutDir: args.includes('--emptyOutDir'),
	};
}

function assertOptions(options: BuildOptions): asserts options is BuildOptions & { entry: string } {
	if (!options.entry) {
		throw new Error('Missing required --entry <file>');
	}
	if (!options.fileName.endsWith('.js')) {
		throw new Error('--fileName must end with .js');
	}
}

const options = readOptions(process.argv.slice(2));
assertOptions(options);

const entry = path.resolve(root, options.entry);

await build({
	configFile: false,
	root,
	publicDir: false,
	logLevel: 'warn',
	build: {
		emptyOutDir: options.emptyOutDir,
		outDir: options.outDir,
		rollupOptions: {
			input: entry,
			output: {
				entryFileNames: options.fileName,
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash][extname]',
			},
		},
	},
});

console.log(`wrote ${path.relative(root, path.join(options.outDir, options.fileName))}`);
