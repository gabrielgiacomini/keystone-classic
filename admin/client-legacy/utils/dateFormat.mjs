const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function pad(value) {
	return String(value).padStart(2, '0');
}

function ordinal(value) {
	const mod100 = value % 100;
	if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
	switch (value % 10) {
		case 1: return `${value}st`;
		case 2: return `${value}nd`;
		case 3: return `${value}rd`;
		default: return `${value}th`;
	}
}

function hour12(date) {
	const hour = date.getHours() % 12;
	return hour || 12;
}

export function formatLegacyDate(value, format) {
	const date = toDate(value);
	if (!date) return 'Invalid date';

	switch (format) {
		case 'MMM D YYYY':
			return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
		case 'MMM D YYYY h:mm:ss':
			return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${hour12(date)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
		case 'DD/MM/YYYY h:mm:ssa':
			return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${hour12(date)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${date.getHours() < 12 ? 'am' : 'pm'}`;
		case 'Do MMM YYYY':
			return `${ordinal(date.getDate())} ${MONTH_SHORT[date.getMonth()]} ${date.getFullYear()}`;
		default:
			return date.toISOString();
	}
}
