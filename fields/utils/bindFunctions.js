/**
 * @fileoverview
 * This file defines the `bindFunctions` function, which is used to bind
 * multiple functions to a component's `this` context.
 *
 * It is a utility function that helps to reduce boilerplate code in React
 * components.
 */
/*
	Tidier binding for component methods to Classes
	===============================================

	constructor() {
		super();
		bindFunctions.call(this, ['handleClick', 'handleOther']);
	}
*/
module.exports = function bindFunctions (functions) {
	functions.forEach(f => (this[f] = this[f].bind(this)));
};
