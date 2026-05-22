// Ambient declarations for greenlock-express v2, which ships without bundled types.
// The published @types/greenlock-express describes the v4 API and does not match
// the v2.x runtime used by this project (see package.json). This file shadows that
// @types package and provides accurate v2 typings. Replace when upgrading to v4.
declare module 'greenlock-express' {
	import type { RequestHandler } from 'express';
	import type { ServerOptions } from 'https';

	interface GreenlockOptions {
		server: string;
		approveDomains: string | string[];
		agreeTos: boolean;
		email: string;
		[key: string]: unknown;
	}

	interface GreenlockInstance {
		httpsOptions: ServerOptions;
		middleware: () => RequestHandler;
	}

	function create(opts: GreenlockOptions): GreenlockInstance;

	export { create };
	export default { create };
}
