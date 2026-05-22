/**
 * Defers a callback with `process.nextTick`, preserving the historical
 * Keystone utility contract while keeping active source code typed locally.
 *
 * @param fn Callback to invoke on the next tick.
 * @param args Arguments forwarded to `fn`.
 */
export function defer<TArgs extends unknown[]>(fn: (...args: TArgs) => void, ...args: TArgs): void {
	process.nextTick(function deferredCallback() {
		fn(...args);
	});
}
