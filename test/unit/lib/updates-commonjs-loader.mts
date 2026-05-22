import { expect } from 'chai';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import keystone from 'keystone';
import updates from 'keystone/lib/updates';
import getMongooseConnection from '../../helpers/getMongooseConnection.mts';

interface KeystoneOptionsAccess {
	get(key: string): unknown;
	set(key: string, value: unknown): void;
	mongoose: unknown;
}

interface UpdateRecord {
	key: string;
}

interface UpdateCollection {
	deleteMany(query: unknown): Promise<unknown>;
	find(query: unknown): { toArray(): Promise<UpdateRecord[]> };
	insertOne(document: unknown): Promise<unknown>;
}

interface MongooseTestConnection {
	connection: {
		collection(name: string): UpdateCollection;
	};
	deleteModel(name: string | RegExp): unknown;
	models: Record<string, { collection: { name: string } } | undefined>;
}

type ProcessExitCode = string | number | null | undefined;

function keystoneOptions(): KeystoneOptionsAccess {
	return keystone as unknown as KeystoneOptionsAccess;
}

function commonjsOrderedUpdateSource(key: string, orderPath: string): string {
	return [
		"'use strict';",
		"const { readFileSync, writeFileSync } = require('node:fs');",
		'module.exports = function orderedUpdate(done) {',
		'  let order = [];',
		`  try { order = JSON.parse(readFileSync(${JSON.stringify(orderPath)}, 'utf8')); } catch (_err) {}`,
		`  order.push(${JSON.stringify(key)});`,
		`  writeFileSync(${JSON.stringify(orderPath)}, JSON.stringify(order));`,
		'  done(null);',
		'};',
		'',
	].join('\n');
}

function esmOrderedUpdateSource(key: string, orderPath: string, typed: boolean): string {
	const doneType = typed ? ': (err?: Error | null) => void' : '';
	const returnType = typed ? ': void' : '';
	return [
		"import { readFileSync, writeFileSync } from 'node:fs';",
		`export default function orderedUpdate(done${doneType})${returnType} {`,
		'  let order = [];',
		`  try { order = JSON.parse(readFileSync(${JSON.stringify(orderPath)}, 'utf8')); } catch (_err) {}`,
		`  order.push(${JSON.stringify(key)});`,
		`  writeFileSync(${JSON.stringify(orderPath)}, JSON.stringify(order));`,
		'  done(null);',
		'}',
		'',
	].join('\n');
}

describe('lib/updates CommonJS loader compatibility', function () {
	let tempRoot = '';
	let markerPath = '';
	let helperMarkerPath = '';
	let orderPath = '';
	let updateKey = '';
	let trackedKeys: string[] = [];
	let runCounter = 0;
	let mongoose: MongooseTestConnection;
	let originalModuleRoot: unknown;
	let originalUpdates: unknown;
	let originalName: unknown;
	let originalModelPrefix: unknown;

	before(async function () {
		mongoose = await getMongooseConnection() as unknown as MongooseTestConnection;
		keystoneOptions().mongoose = mongoose;
	});

	beforeEach(async function () {
		const ks = keystoneOptions();
		originalModuleRoot = ks.get('module root');
		originalUpdates = ks.get('updates');
		originalName = ks.get('name');
		originalModelPrefix = ks.get('model prefix');
		mongoose.deleteModel(/^App_Update$/);

		tempRoot = await mkdtemp(path.join(os.tmpdir(), 'keystone-updates-cjs-'));
		const updatesPath = path.join(tempRoot, 'updates');
		await mkdir(updatesPath);
		await writeFile(path.join(tempRoot, 'package.json'), '{ "type": "commonjs" }\n');

		runCounter += 1;
		updateKey = `0.0.${process.pid + runCounter * 1000}-commonjs-callback`;
		trackedKeys = [updateKey];
		markerPath = path.join(tempRoot, 'commonjs-update-marker.json');
		helperMarkerPath = path.join(tempRoot, 'non-semver-helper-marker.json');
		orderPath = path.join(tempRoot, 'update-order.json');
		const updateSource = [
			"'use strict';",
			"const { writeFileSync } = require('node:fs');",
			'module.exports = function commonjsUpdate(done) {',
			`  writeFileSync(${JSON.stringify(markerPath)}, JSON.stringify({ ran: true, key: ${JSON.stringify(updateKey)} }));`,
			'  done(null);',
			'};',
			'',
		].join('\n');
		await writeFile(path.join(updatesPath, `${updateKey}.js`), updateSource);

		ks.set('module root', tempRoot);
		ks.set('updates', 'updates');
		ks.set('name', 'Update Loader Test');
	});

	afterEach(async function () {
		const ks = keystoneOptions();
		ks.set('module root', originalModuleRoot);
		ks.set('updates', originalUpdates);
		ks.set('name', originalName);
		ks.set('model prefix', originalModelPrefix);
		await mongoose.connection.collection('app_updates').deleteMany({ key: { $in: trackedKeys } });
		await rm(tempRoot, { recursive: true, force: true });
	});

	it('executes a semver-named CommonJS callback update from a CommonJS app package', async function () {
		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const marker = JSON.parse(await readFile(markerPath, 'utf8')) as { key: string; ran: boolean };
		expect(marker).to.deep.equal({ ran: true, key: updateKey });
	});

	it('filters non-semver helpers, preserves semver order, and tracks legacy update keys', async function () {
		const updatesPath = path.join(tempRoot, 'updates');
		const patchBase = process.pid + runCounter * 1000 + 10;
		const earlyKey = `0.0.${patchBase}-early`;
		const middleKey = `0.0.${patchBase + 1}-middle`;
		const lateKey = `0.0.${patchBase + 2}-late`;
		trackedKeys = [updateKey, earlyKey, middleKey, lateKey];
		await writeFile(path.join(updatesPath, `${updateKey}.js`), 'module.exports = false;\n');
		for (const key of [lateKey, earlyKey, middleKey]) {
			await writeFile(path.join(updatesPath, `${key}.js`), [
				"'use strict';",
				"const { readFileSync, writeFileSync } = require('node:fs');",
				'module.exports = function orderedUpdate(done) {',
				`  let order = [];`,
				`  try { order = JSON.parse(readFileSync(${JSON.stringify(orderPath)}, 'utf8')); } catch (_err) {}`,
				`  order.push(${JSON.stringify(key)});`,
				`  writeFileSync(${JSON.stringify(orderPath)}, JSON.stringify(order));`,
				'  done(null);',
				'};',
				'',
			].join('\n'));
		}
		await writeFile(path.join(updatesPath, 'set-autoslug-from-id.js'), [
			"'use strict';",
			"const { writeFileSync } = require('node:fs');",
			'module.exports = function nonSemverHelper(done) {',
			`  writeFileSync(${JSON.stringify(helperMarkerPath)}, 'should-not-run');`,
			'  done(null);',
			'};',
			'',
		].join('\n'));
		await writeFile(path.join(updatesPath, `${middleKey}.unit.test.ts`), [
			"import { writeFileSync } from 'node:fs';",
			`writeFileSync(${JSON.stringify(helperMarkerPath)}, 'should-not-run');`,
			"describe('update sidecar test', () => {});",
			'',
		].join('\n'));

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const order = JSON.parse(await readFile(orderPath, 'utf8')) as string[];
		const records = await mongoose.connection.collection('app_updates')
			.find({ key: { $in: [earlyKey, middleKey, lateKey] } })
			.toArray();
		const helperRan = await readFile(helperMarkerPath, 'utf8').then(() => true, () => false);
		expect(order).to.deep.equal([earlyKey, middleKey, lateKey]);
		const sortKeys = (keys: string[]): string[] => {
			const sortedKeys = [...keys];
			sortedKeys.sort((left, right) => left.localeCompare(right));
			return sortedKeys;
		};
		expect(sortKeys(records.map(record => record.key))).to.deep.equal(sortKeys([earlyKey, lateKey, middleKey]));
		expect(helperRan).to.equal(false);
	});

	it('recognizes semver-named .js, .mjs, .ts, and .mts update files with extensionless tracking keys', async function () {
		const updatesPath = path.join(tempRoot, 'updates');
		const patchBase = process.pid + runCounter * 1000 + 20;
		const jsKey = `0.0.${patchBase}-js-callback`;
		const mjsKey = `0.0.${patchBase + 1}-mjs-default`;
		const tsKey = `0.0.${patchBase + 2}-ts-default`;
		const mtsKey = `0.0.${patchBase + 3}-mts-default`;
		trackedKeys = [jsKey, mjsKey, tsKey, mtsKey];

		await writeFile(path.join(updatesPath, `${updateKey}.js`), 'module.exports = false;\n');
		await writeFile(path.join(updatesPath, `${jsKey}.js`), commonjsOrderedUpdateSource(jsKey, orderPath));
		await writeFile(path.join(updatesPath, `${mjsKey}.mjs`), esmOrderedUpdateSource(mjsKey, orderPath, false));
		await writeFile(path.join(updatesPath, `${tsKey}.ts`), esmOrderedUpdateSource(tsKey, orderPath, true));
		await writeFile(path.join(updatesPath, `${mtsKey}.mts`), esmOrderedUpdateSource(mtsKey, orderPath, true));

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const order = JSON.parse(await readFile(orderPath, 'utf8')) as string[];
		const records = await mongoose.connection.collection('app_updates')
			.find({ key: { $in: trackedKeys } })
			.toArray();
		const recordKeys = records.map(record => record.key);
		recordKeys.sort((left, right) => left.localeCompare(right));
		const expectedKeys = [...trackedKeys];
		expectedKeys.sort((left, right) => left.localeCompare(right));
		expect(order).to.deep.equal([jsKey, mjsKey, tsKey, mtsKey]);
		expect(recordKeys).to.deep.equal(expectedKeys);
	});

	it('loads semver-named ESM .js updates from a module app package', async function () {
		const updatesPath = path.join(tempRoot, 'updates');
		await writeFile(path.join(tempRoot, 'package.json'), '{ "type": "module" }\n');
		await writeFile(path.join(updatesPath, `${updateKey}.js`), [
			"import { writeFileSync } from 'node:fs';",
			'export default function esmJsUpdate(done) {',
			`  writeFileSync(${JSON.stringify(markerPath)}, JSON.stringify({ ran: true, key: ${JSON.stringify(updateKey)} }));`,
			'  done(null);',
			'}',
			'',
		].join('\n'));

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const marker = JSON.parse(await readFile(markerPath, 'utf8')) as { key: string; ran: boolean };
		expect(marker).to.deep.equal({ ran: true, key: updateKey });
	});

	it('runs promise-returning modern TypeScript update exports', async function () {
		await writeFile(path.join(tempRoot, 'updates', `${updateKey}.mts`), [
			"import { writeFileSync } from 'node:fs';",
			'export default async function asyncTypedUpdate(): Promise<void> {',
			`  writeFileSync(${JSON.stringify(markerPath)}, JSON.stringify({ ran: true, key: ${JSON.stringify(updateKey)} }));`,
			'}',
			'',
		].join('\n'));
		await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), 'module.exports = false;\n');

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const marker = JSON.parse(await readFile(markerPath, 'utf8')) as { key: string; ran: boolean };
		expect(marker).to.deep.equal({ ran: true, key: updateKey });
	});

	it('skips an already-applied update by its legacy basename key', async function () {
		await mongoose.connection.collection('app_updates').insertOne({ key: updateKey, appliedOn: new Date() });

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const markerExists = await readFile(markerPath, 'utf8').then(() => true, () => false);
		expect(markerExists).to.equal(false);
	});

	it('tracks updates in the unprefixed app_updates collection', async function () {
		const prefixedCollectionName = `cloom_${process.pid}_${runCounter}_app_updates`;
		keystoneOptions().set('model prefix', `cloom_${process.pid}_${runCounter}_`);
		trackedKeys = [updateKey];

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const updateModel = mongoose.models['App_Update'];
		expect(updateModel?.collection.name).to.equal('app_updates');
		const records = await mongoose.connection.collection('app_updates')
			.find({ key: updateKey })
			.toArray();
		const prefixedRecords = await mongoose.connection.collection(prefixedCollectionName)
			.find({ key: updateKey })
			.toArray();
		expect(records.map(record => record.key)).to.deep.equal([updateKey]);
		expect(prefixedRecords).to.have.length(0);
	});

	it('preserves extra properties on CommonJS function exports', async function () {
		await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), [
			"'use strict';",
			"const { writeFileSync } = require('node:fs');",
			'module.exports = function updateWithInternal(done) {',
			`  writeFileSync(${JSON.stringify(markerPath)}, JSON.stringify(module.exports._internal));`,
			'  done(null);',
			'};',
			"module.exports._internal = { source: 'copied-cloom-update-test', stable: true };",
			'',
		].join('\n'));

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const marker = JSON.parse(await readFile(markerPath, 'utf8')) as { source: string; stable: boolean };
		expect(marker).to.deep.equal({ source: 'copied-cloom-update-test', stable: true });
	});

	it('invokes update functions with the active Keystone singleton as context', async function () {
		await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), [
			"'use strict';",
			"const { writeFileSync } = require('node:fs');",
			'module.exports = function updateWithKeystoneContext(done) {',
			`  writeFileSync(${JSON.stringify(markerPath)}, JSON.stringify({ hasList: typeof this.list === 'function', name: this.get('name') }));`,
			'  done(null);',
			'};',
			'',
		].join('\n'));

		await new Promise<void>((resolve) => {
			void updates.apply(resolve);
		});

		const marker = JSON.parse(await readFile(markerPath, 'utf8')) as { hasList: boolean; name: string };
		expect(marker).to.deep.equal({ hasList: true, name: 'Update Loader Test' });
	});

	it('hard-fails when a CommonJS callback update reports an error', async function () {
		const originalExit = process.exit.bind(process);
		let exitCode: ProcessExitCode;
		let callbackCalled = false;
		process.exit = function testExit(code?: ProcessExitCode): never {
			exitCode = code;
			return undefined as never;
		};

		try {
			await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), [
				"'use strict';",
				'module.exports = function failingUpdate(done) {',
				"  done(new Error('copied cloom update failed'));",
				'};',
				'',
			].join('\n'));

			await updates.apply(() => {
				callbackCalled = true;
			});
			await new Promise<void>((resolve) => {
				setImmediate(resolve);
			});

			expect(callbackCalled).to.equal(false);
			expect(exitCode).to.equal(1);
			const records = await mongoose.connection.collection('app_updates')
				.find({ key: updateKey })
				.toArray();
			expect(records).to.have.length(0);
		} finally {
			process.exit = originalExit;
		}
	});

	it('hard-fails when a CommonJS callback update throws synchronously', async function () {
		const originalExit = process.exit.bind(process);
		let exitCode: ProcessExitCode;
		let callbackCalled = false;
		process.exit = function testExit(code?: ProcessExitCode): never {
			exitCode = code;
			return undefined as never;
		};

		try {
			await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), [
				"'use strict';",
				'module.exports = function throwingUpdate() {',
				"  throw new Error('copied cloom update threw');",
				'};',
				'',
			].join('\n'));

			await updates.apply(() => {
				callbackCalled = true;
			});
			await new Promise<void>((resolve) => {
				setImmediate(resolve);
			});

			expect(callbackCalled).to.equal(false);
			expect(exitCode).to.equal(1);
			const records = await mongoose.connection.collection('app_updates')
				.find({ key: updateKey })
				.toArray();
			expect(records).to.have.length(0);
		} finally {
			process.exit = originalExit;
		}
	});

	it('hard-fails when a promise-returning modern update rejects', async function () {
		const originalExit = process.exit.bind(process);
		let exitCode: ProcessExitCode;
		let callbackCalled = false;
		process.exit = function testExit(code?: ProcessExitCode): never {
			exitCode = code;
			return undefined as never;
		};

		try {
			await writeFile(path.join(tempRoot, 'updates', `${updateKey}.mts`), [
				'export default async function rejectingTypedUpdate(): Promise<void> {',
				"  throw new Error('copied cloom typed update rejected');",
				'}',
				'',
			].join('\n'));
			await writeFile(path.join(tempRoot, 'updates', `${updateKey}.js`), 'module.exports = false;\n');

			await updates.apply(() => {
				callbackCalled = true;
			});
			await new Promise<void>((resolve) => {
				setImmediate(resolve);
			});

			expect(callbackCalled).to.equal(false);
			expect(exitCode).to.equal(1);
			const records = await mongoose.connection.collection('app_updates')
				.find({ key: updateKey })
				.toArray();
			expect(records).to.have.length(0);
		} finally {
			process.exit = originalExit;
		}
	});
});
