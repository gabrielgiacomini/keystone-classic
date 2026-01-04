function definePrototypeGetter (Constructor, key, getter) {
	Object.defineProperty(Constructor.prototype, key, {
		get: getter,
	});
}

function definePrototypeGetters (Constructor, getterObj) {
	Object.keys(getterObj).map(function (key) {
		definePrototypeGetter(Constructor, key, getterObj[key]);
	});
}

module.exports = definePrototypeGetters;
module.exports.definePrototypeGetter = definePrototypeGetter;
