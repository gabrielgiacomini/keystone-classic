export default function bindFunctions (functions) {
	functions.forEach(f => {
		const fn = this[f];
		if (typeof fn === 'function') {
			this[f] = fn.bind(this);
		}
	});
}
