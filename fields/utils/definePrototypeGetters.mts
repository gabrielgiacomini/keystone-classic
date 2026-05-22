// The Constructor parameter uses `abstract new` to accept any concrete or
// abstract class — including those with typed constructor parameters. The
// `abstract` modifier tells TypeScript not to check constructor argument
// compatibility, which matches the actual runtime behaviour (we only access
// `.prototype`, never construct the class via this reference).
type AnyConstructor = abstract new (...args: never) => unknown;

export default function definePrototypeGetters(Constructor: AnyConstructor, getterObj: Record<string, () => unknown>): void {
	Object.keys(getterObj).forEach(function (key) {
		const getter = getterObj[key];
		if (getter) {
			definePrototypeGetter(Constructor, key, getter);
		}
	});
}

export function definePrototypeGetter(Constructor: AnyConstructor, key: string, getter: () => unknown): void {
	Object.defineProperty(Constructor.prototype, key, {
		get: getter,
	});
}
