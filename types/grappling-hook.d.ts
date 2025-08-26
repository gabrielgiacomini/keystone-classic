declare module "grappling-hook" {
	export class Hook {
		callHook(name: string, ...args: any[]): void;
		addHook(name: string, fn: (...args: any[]) => void): void;
	}
}
