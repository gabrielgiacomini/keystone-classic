/**
 * @fileoverview
 * A utility for binding methods to a component's instance. This is a tidier
 * way to bind methods in a component's constructor.
 *
 * @example
 * constructor() {
 *   super();
 *   bindFunctions.call(this, ['handleClick', 'handleOther']);
 * }
 *
 * @param {string[]} functions An array of function names to bind to the component instance.
 */
module.exports = function bindFunctions (functions) {
	functions.forEach(f => (this[f] = this[f].bind(this)));
};
