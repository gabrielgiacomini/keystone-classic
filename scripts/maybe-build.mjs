#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const initCwd = process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD) : '';

if (initCwd === root) {
	console.log('[maybe-build] Running in source repo; skipping prepare build.');
	process.exit(0);
}

if (existsSync(path.join(root, 'dist', 'index.mjs'))) {
	console.log('[maybe-build] dist already exists; skipping prepare build.');
	process.exit(0);
}

console.log('[maybe-build] Installed as git dependency; running build...');
execSync('npm run build', { cwd: root, stdio: 'inherit' });
console.log('[maybe-build] Build complete.');
