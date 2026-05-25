function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}

export default function evalDependsOn (dependsOn, values) {
	if (!isObject(dependsOn) || !Object.keys(dependsOn).length) {
		return true;
	}
	const vals = values || {};
	return Object.keys(dependsOn).every(function (key) {
		const expected = dependsOn[key];
		const actual = vals[key];
		if (Array.isArray(expected)) return expected.includes(actual);
		return actual === expected;
	});
}
