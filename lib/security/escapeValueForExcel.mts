const formulaTriggers = ['+', '-', '=', '@'];

export default function escapeValueForExcel(value: string | number | boolean): string {
	const str = String(value);
	if (formulaTriggers.includes(str.slice(0, 1))) {
		return ' ' + str;
	}
	return str;
}
