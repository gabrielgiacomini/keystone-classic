/**
 * @fileoverview
 * This utility defines getters on a constructor's prototype. It's used to
 * add getters to the Field class.
 */

/**
 * Defines a getter on the constructor's prototype.
 *
 * @param {function} Constructor The constructor to add the getter to.
 * @param {string} key The key the getter should be at.
 * @param {function} getter The getter function.
 */
function definePrototypeGetter (Constructor, key, getter) {
	Object.defineProperty(Constructor.prototype, key, {
		get: getter,
	});
}

/**
 * Define multiple getters on the constructor's prototype at once.
 *
 * @param {function} Constructor The constructor to add the getters to.
 * @param {object} getterObj An object where the keys are the getter names
 * and the values are the getter functions.
 */
function definePrototypeGetters (Constructor, getterObj) {
	Object.keys(getterObj).map(function (key) {
		definePrototypeGetter(Constructor, key, getterObj[key]);
	});
}

module.exports = definePrototypeGetters;
module.definePrototypeGetter = definePrototypeGetter;
