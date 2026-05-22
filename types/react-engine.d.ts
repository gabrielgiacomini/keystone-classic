declare module 'react-engine' {
	interface ReactEngineServer {
		create(options: Record<string, unknown>): unknown;
	}
	interface ReactEngineModule {
		server: ReactEngineServer;
	}
	const ReactEngine: ReactEngineModule;
	export default ReactEngine;
}
declare module 'react-engine/lib/expressView.js' {
	// Express view constructor — shape opaque to Keystone, passed through as a view engine option
	const expressView: new (...args: unknown[]) => unknown;
	export default expressView;
}
