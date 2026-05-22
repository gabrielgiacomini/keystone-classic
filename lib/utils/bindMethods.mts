/**
 * A bound underscore-method leaf.
 */
export type BoundMethod = (...args: unknown[]) => unknown;

/**
 * A recursive underscore-method tree with bound function leaves.
 */
export interface BoundMethodNode {
	[key: string]: BoundMethod | BoundMethodNode;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Recursively binds enumerable method leaves to a scope using Keystone's
 * historical `keystone-utils.bindMethods` behavior.
 *
 * @param obj Method tree to bind.
 * @param scope Scope used as `this` for function leaves.
 * @returns A new tree containing only bound functions and nested object nodes.
 */
export default function bindMethods(obj: Record<string, unknown>, scope: object): BoundMethodNode {
	const bound: BoundMethodNode = {};
	for (const prop in obj) {
		const value = obj[prop];
		if (typeof value === 'function') {
			bound[prop] = value.bind(scope) as BoundMethod;
		} else if (isObject(value)) {
			bound[prop] = bindMethods(value, scope);
		}
	}
	return bound;
}
