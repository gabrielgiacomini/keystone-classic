import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import debugLib from 'debug';

const debug = debugLib('keystone:core:importer');

const SUPPORTED_EXTENSIONS = new Set(['.mjs', '.js', '.cjs', '.json']);

export default function dispatchImporter(rel__dirname: string): (from: string) => Promise<Record<string, unknown>> {

	async function importer(from: string): Promise<Record<string, unknown>> {
		debug('importing ', from);
		const imported: Record<string, unknown> = {};
		const joinPath = function (...args: string[]): string {
			return '.' + path.sep + path.join(...args);
		};

		const fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		const entries = fs.readdirSync(fsPath).sort((a, b) => a.localeCompare(b));

		await Promise.all(entries.map(async function (name: string) {
			const info = fs.statSync(path.join(fsPath, name));
			if (info.isDirectory()) {
				imported[name] = await importer(joinPath(from, name));
				return;
			}
			const ext = path.extname(name);
			const base = path.basename(name, ext);
			if (!SUPPORTED_EXTENSIONS.has(ext)) {
				debug('cannot import ', ext);
				return;
			}
			const fileUrl = pathToFileURL(path.resolve(rel__dirname, from, name)).href;
			const jsonMod = ext === '.json'
				? (await import(fileUrl, { with: { type: 'json' } })) as Record<string, unknown>
				: undefined;
			const esMod = jsonMod === undefined
				? (await import(fileUrl)) as Record<string, unknown>
				: undefined;
			let ns: unknown;
				if (jsonMod !== undefined) {
					ns = jsonMod['default'];
				} else if (esMod !== undefined) {
					ns = esMod['default'] ?? esMod;
				}
			imported[base] = ns;
		}));

		return imported;
	}

	return importer;
}
