// Ambient stub for the untyped `disc` package (surface used in admin/server/middleware/browserify.mts).
declare module 'disc' {
	interface DiscOptions {
		header?: string;
		button?: string;
		footer?: string;
		mode?: 'size' | 'realSize' | 'counts';
	}

	interface DiscBundle {
		/**
		 * Generate an interactive HTML visualisation from a browserify bundle.
		 * The two-argument form (no opts) is used in browserify.mts.
		 */
		bundle(
			bundles: Buffer | string | (Buffer | string)[],
			callback: (err: Error | null, html: string) => void,
		): void;
		bundle(
			bundles: Buffer | string | (Buffer | string)[],
			opts: DiscOptions,
			callback: (err: Error | null, html: string) => void,
		): void;
	}

	const disc: DiscBundle;
	export default disc;
	export = disc;
}
