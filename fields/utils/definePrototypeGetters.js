/**
 * @fileoverview
 * This file defines the `definePrototypeGetters` function, which is used to
 * define multiple getters on a constructor's prototype at once.
 */

/**
 * Defines a getter on the Field prototype
 *
 * @param  {function} Constructor The constructor to define the getter on.
 * @param  {string}   key    The key the getter should be at
 * @param  {function} getter The getter itself
 */
function definePrototypeGetter (Constructor, key, getter) {
	Object.defineProperty(Constructor.prototype, key, {
		get: getter,
	});
}

/**
 * Define multiple getters on the Field prototype at once
 *
 * @param  {function} Constructor The constructor to define the getters on.
 * @param  {object} getterObj The getters with a getter at the key
 */
function definePrototypeGetters (Constructor, getterObj) {
	Object.keys(getterObj).map(function (key) {
		definePrototypeGetter(Constructor, key, getterObj[key]);
	});
}

module.exports = definePrototypeGetters;
module.definePrototypeGetter = definePrototypeGetter;
