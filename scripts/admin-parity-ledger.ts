import { readFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argSet = new Set(args);
const root = process.cwd();

if (argSet.has('--help')) {
	printHelp();
	process.exit(0);
}

const ledgerPath = valueArg('--ledger') ?? 'docs/admin-modernization-parity-ledger.md';
const absoluteLedgerPath = path.resolve(root, ledgerPath);
const ledger = readFileSync(absoluteLedgerPath, 'utf8');
const rows = parseLedgerRows(ledger);
const openRows = rows.filter((row) => !isClosedStatus(row.status));

if (openRows.length > 0) {
	console.error(`admin parity ledger has ${openRows.length} open row(s):`);
	for (const row of openRows) {
		console.error(`- ${row.section}: ${row.name} is ${row.status}`);
	}
	console.error('Close each row as Complete or Out of scope before running final stabilization.');
	process.exit(1);
}

console.log(`admin parity ledger closed: ${rows.length} row(s) verified`);

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

function isClosedStatus(status: string): boolean {
	return status === 'Complete' || status === 'Out of scope';
}

type LedgerRow = {
	name: string;
	section: string;
	status: string;
};

function parseLedgerRows(source: string): LedgerRow[] {
	const rows: LedgerRow[] = [];
	let section = '';
	let activeTable: 'workflow' | 'fields' | '' = '';

	for (const line of source.split('\n')) {
		const heading = /^##\s+(.+)$/.exec(line);
		if (heading) {
			section = heading[1] ?? '';
			activeTable = '';
			continue;
		}

		if (line.startsWith('| Workflow |')) {
			activeTable = 'workflow';
			continue;
		}
		if (line.startsWith('| Field type |')) {
			activeTable = 'fields';
			continue;
		}
		if (!line.startsWith('|') || line.startsWith('| ---')) {
			continue;
		}
		if (!activeTable) {
			continue;
		}

		const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
		if (activeTable === 'workflow' && cells.length >= 4) {
			rows.push({ name: stripMarkdown(cells[0] ?? ''), section, status: stripMarkdown(cells[3] ?? '') });
		}
		if (activeTable === 'fields' && cells.length >= 7) {
			rows.push({ name: stripMarkdown(cells[0] ?? ''), section, status: stripMarkdown(cells[6] ?? '') });
		}
	}

	if (rows.length === 0) {
		throw new Error('No parity ledger rows found');
	}

	return rows;
}

function stripMarkdown(value: string): string {
	return value.replace(/`/g, '').trim();
}

function printHelp(): void {
	console.log(`Usage: jiti scripts/admin-parity-ledger.ts [options]

Verify that the admin modernization parity ledger is ready for final
stabilization. Every workflow and built-in field row must be marked Complete or
Out of scope.

Options:
  --ledger PATH  Markdown ledger path. Defaults to docs/admin-modernization-parity-ledger.md.
  --help         Show this help.
`);
}
