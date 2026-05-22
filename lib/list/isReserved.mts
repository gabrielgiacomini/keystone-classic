const reservedPaths = [
	'_', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__',
	'__proto__', '_id', 'hasOwnProperty', 'id', 'isPrototypeOf', 'list',
	'propertyIsEnumerable', 'prototype', 'toLocaleString', 'toString', 'valueOf',
];

export default function isReserved(path: string): boolean {
	return reservedPaths.includes(path);
}
