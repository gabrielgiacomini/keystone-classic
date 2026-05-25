export default function classnames(...values) {
	const classes = [];
	for (const value of values) {
		if (!value) continue;
		if (typeof value === 'string' || typeof value === 'number') {
			classes.push(value);
			continue;
		}
		if (Array.isArray(value)) {
			const nested = classnames(...value);
			if (nested) classes.push(nested);
			continue;
		}
		if (typeof value === 'object') {
			Object.keys(value).forEach((key) => {
				if (value[key]) classes.push(key);
			});
		}
	}
	return classes.join(' ');
}
