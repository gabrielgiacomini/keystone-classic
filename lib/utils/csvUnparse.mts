interface CsvUnparseInput {
	data: Record<string, unknown>[];
	fields?: string[];
}

interface CsvUnparseOpts {
	delimiter?: string;
}

/**
 * Converts a structured data object to a CSV string.
 * Inlined replacement for babyparse/papaparse unparse().
 */
export default function csvUnparse (input: CsvUnparseInput | Record<string, unknown>[], opts?: CsvUnparseOpts): string {
	const delimiter = opts?.delimiter || ',';
	const data: Record<string, unknown>[] = Array.isArray(input) ? input : (input).data;
	const fields: string[] = (!Array.isArray(input) && (input).fields)
		? (input).fields
		: (data[0] ? Object.keys(data[0]) : []);

	function escapeCell (val: unknown): string {
		if (val === null || val === undefined) return '';
		const str = String(val); // eslint-disable-line @typescript-eslint/no-base-to-string
		if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
			return '"' + str.replace(/"/g, '""') + '"';
		}
		return str;
	}

	const rows = [fields.map(escapeCell).join(delimiter)];
	for (const row of data) {
		rows.push(fields.map(f => escapeCell(row[f])).join(delimiter));
	}
	return rows.join('\r\n');
}
