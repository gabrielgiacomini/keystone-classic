import { spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

if (args.has('--help')) {
	printHelp();
	process.exit(0);
}

const commands: Array<[string, string[]]> = [
	['npm', ['run', 'admin-parity:ledger']],
	['npm', ['run', 'lint']],
	['npm', ['run', 'typecheck']],
	['npm', ['run', 'build-dev']],
	['npm', ['run', 'build']],
	['npm', ['run', 'test:unit']],
	['npm', ['run', 'test:e2e-api']],
	['npm', ['run', 'admin-parity']],
	['npm', ['run', 'package:verify']],
	['npm', ['run', 'admin-parity:soak']],
];

for (const [command, commandArgs] of commands) {
	console.log(formatCommand([command, ...commandArgs]));
	if (dryRun) {
		continue;
	}

	const result = spawnSync(command, commandArgs, {
		stdio: 'inherit',
	});
	if (result.error) {
		console.error(result.error.message);
		process.exit(1);
	}
	if (result.status !== 0) {
		process.exit(result.status || 1);
	}
}

function formatCommand(parts: string[]): string {
	return parts.map((part) => {
		if (/^[A-Za-z0-9_./:-]+$/.test(part)) {
			return part;
		}
		return `'${part.split("'").join("'\\''")}'`;
	}).join(' ');
}

function printHelp() {
	console.log(`Usage: jiti scripts/admin-parity-final-gate.ts [options]

Run the final P4 admin-parity closeout gates in the required order.
The admin-parity:ledger step verifies that every parity ledger row is Complete
or Out of scope before final stabilization starts.
The lint/typecheck/build-dev/build/unit/package steps mirror the convergence Definition
of Done before the e2e parity, visual identity, and soak gates run.
The final admin-parity:soak step verifies branch protection or an active branch ruleset plus the 14-day green window.
Use npm run admin-parity:protect:status to inspect the required-check source without running e2e gates.

Options:
  --dry-run   Print the command order without running any gate.
  --help      Show this help.
`);
}
