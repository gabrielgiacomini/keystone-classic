function addThousands(value) {
	const [integer = '', decimal] = String(value).split('.');
	const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return decimal === undefined ? grouped : `${grouped}.${decimal}`;
}

function trimOptionalDecimals(value) {
	return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

export function formatNumber(value, format) {
	if (typeof value !== 'number' || Number.isNaN(value)) return '';

	const pattern = format || '0,0[.][000000000000]';
	const negative = value < 0;
	const prefix = pattern.includes('$') ? '$' : '';
	let body;

	if (pattern.includes('.00')) {
		body = Math.abs(value).toFixed(2);
	} else if (pattern.includes('[.]')) {
		body = trimOptionalDecimals(String(Math.abs(value)));
	} else {
		body = String(Math.round(Math.abs(value)));
	}

	if (pattern.includes(',')) {
		body = addThousands(body);
	}

	return `${negative ? '-' : ''}${prefix}${body}`;
}
