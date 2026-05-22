export default function bindFunctions (this: Record<string, unknown>, functions: string[]) {
	functions.forEach(f => {
		const fn = this[f];
		if (typeof fn === 'function') {
			this[f] = (fn as (...a: unknown[]) => unknown).bind(this);
		}
	});
}
