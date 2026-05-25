const MONTH_LONG = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

function hour12(value) {
	const hour = value % 12;
	return hour || 12;
}

function parts(date, utc = false) {
	return {
		year: utc ? date.getUTCFullYear() : date.getFullYear(),
		month: utc ? date.getUTCMonth() : date.getMonth(),
		day: utc ? date.getUTCDate() : date.getDate(),
		hour: utc ? date.getUTCHours() : date.getHours(),
		minute: utc ? date.getUTCMinutes() : date.getMinutes(),
		second: utc ? date.getUTCSeconds() : date.getSeconds(),
	};
}

export function startOfToday() {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	return date;
}

export function toValidDate(value) {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (value === null || value === undefined || value === '') return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDateByFormat(value, format) {
	if (value instanceof Date) return toValidDate(value);
	if (typeof value !== 'string') return toValidDate(value);
	const trimmed = value.trim();
	let match;
	if (format === 'YYYY-MM-DD') {
		match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
		if (!match) return null;
		return buildCheckedDate(Number(match[1]), Number(match[2]), Number(match[3]));
	}
	if (format === 'DD-MM-YYYY') {
		match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
		if (!match) return null;
		return buildCheckedDate(Number(match[3]), Number(match[2]), Number(match[1]));
	}
	if (format === 'L') {
		match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
		if (!match) return null;
		return buildCheckedDate(Number(match[3]), Number(match[1]), Number(match[2]));
	}
	return toValidDate(value);
}

function buildCheckedDate(year, month, day) {
	const date = new Date(year, month - 1, day);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
	date.setHours(0, 0, 0, 0);
	return date;
}

export function formatDateByFormat(value, format, options = {}) {
	const date = toValidDate(value);
	if (!date) return 'Invalid date';
	const dateParts = parts(date, options.utc);
	if (format === 'YYYY-MM-DD') return `${dateParts.year}-${pad(dateParts.month + 1)}-${pad(dateParts.day)}`;
	if (format === 'DD-MM-YYYY') return `${pad(dateParts.day)}-${pad(dateParts.month + 1)}-${dateParts.year}`;
	if (format === 'L') return `${pad(dateParts.month + 1)}/${pad(dateParts.day)}/${dateParts.year}`;
	if (format === 'Do MMM YYYY') return `${ordinal(dateParts.day)} ${MONTH_SHORT[dateParts.month]} ${dateParts.year}`;
	if (format === 'MMMM Do YYYY') return `${MONTH_LONG[dateParts.month]} ${ordinal(dateParts.day)} ${dateParts.year}`;
	if (format === 'MMMM Do YYYY, h:mm:ss a') {
		return `${MONTH_LONG[dateParts.month]} ${ordinal(dateParts.day)} ${dateParts.year}, ${hour12(dateParts.hour)}:${pad(dateParts.minute)}:${pad(dateParts.second)} ${dateParts.hour < 12 ? 'am' : 'pm'}`;
	}
	if (format === 'h:mm:ss a') return `${hour12(dateParts.hour)}:${pad(dateParts.minute)}:${pad(dateParts.second)} ${dateParts.hour < 12 ? 'am' : 'pm'}`;
	if (format === 'Z') return options.utc ? '+00:00' : timezoneOffsetForDate(date);
	return date.toISOString();
}

export function timezoneOffsetForDate(value) {
	const date = toValidDate(value) || new Date();
	const offset = -date.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	const absolute = Math.abs(offset);
	return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

export function parseDatetimeInput(dateValue, timeValue, tzOffsetValue, options = {}) {
	const date = parseDateByFormat(dateValue, 'YYYY-MM-DD');
	if (!date || typeof timeValue !== 'string') return null;
	const time = parseTimeInput(timeValue);
	if (!time) return null;

	if (tzOffsetValue) {
		const offset = parseTimezoneOffset(tzOffsetValue);
		if (offset === null) return null;
		return new Date(Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			time.hour,
			time.minute,
			time.second,
		) - offset * 60000);
	}

	if (options.utc) {
		return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute, time.second));
	}
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute, time.second);
}

function parseTimeInput(value) {
	let match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*([ap]m)$/i.exec(value.trim());
	if (match) {
		let hour = Number(match[1]);
		const minute = Number(match[2]);
		const second = Number(match[3] ?? 0);
		const meridiem = match[4].toLowerCase();
		if (hour < 1 || hour > 12 || minute > 59 || second > 59) return null;
		if (meridiem === 'pm' && hour !== 12) hour += 12;
		if (meridiem === 'am' && hour === 12) hour = 0;
		return { hour, minute, second };
	}

	match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());
	if (!match) return null;
	const hour = Number(match[1]);
	const minute = Number(match[2]);
	const second = Number(match[3] ?? 0);
	if (hour > 23 || minute > 59 || second > 59) return null;
	return { hour, minute, second };
}

function parseTimezoneOffset(value) {
	const match = /^([+-])(\d{2}):?(\d{2})$/.exec(String(value).trim());
	if (!match) return null;
	const minutes = Number(match[2]) * 60 + Number(match[3]);
	return match[1] === '+' ? minutes : -minutes;
}

export function monthCaption(value) {
	const date = toValidDate(value) || new Date();
	return `${MONTH_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function addMonths(value, amount) {
	const date = toValidDate(value) || new Date();
	return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function buildMonthWeeks(value) {
	const month = toValidDate(value) || new Date();
	const start = new Date(month.getFullYear(), month.getMonth(), 1);
	start.setDate(start.getDate() - start.getDay());
	const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
	end.setDate(end.getDate() + (6 - end.getDay()));
	const weeks = [];
	const cursor = new Date(start);
	while (cursor <= end) {
		const week = [];
		for (let i = 0; i < 7; i++) {
			week.push(new Date(cursor));
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
	}
	return weeks;
}

export function isSameDay(left, right) {
	const leftDate = toValidDate(left);
	const rightDate = toValidDate(right);
	return Boolean(leftDate && rightDate
		&& leftDate.getFullYear() === rightDate.getFullYear()
		&& leftDate.getMonth() === rightDate.getMonth()
		&& leftDate.getDate() === rightDate.getDate());
}

export function isSameMonth(left, right) {
	const leftDate = toValidDate(left);
	const rightDate = toValidDate(right);
	return Boolean(leftDate && rightDate
		&& leftDate.getFullYear() === rightDate.getFullYear()
		&& leftDate.getMonth() === rightDate.getMonth());
}
