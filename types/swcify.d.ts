// Ambient stub for the untyped `swcify` package (surface used in admin/server/middleware/browserify.mts).
declare module 'swcify' {
	/**
	 * A browserify transform factory. Returns a function that, given a filename and
	 * optional opts, returns a Node.js Transform stream — exactly what
	 * `browserify.BrowserifyObject.transform()` expects.
	 */
	const swcify: (filename: string, opts?: Record<string, unknown>) => NodeJS.ReadWriteStream;
	export default swcify;
	export = swcify;
}
