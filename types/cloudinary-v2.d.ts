/**
 * Augments the cloudinary package's v2 uploader namespace with `direct_upload`,
 * which exists in the runtime implementation but is absent from the bundled types.
 *
 * Only the surface actually used by this codebase is declared here.
 */
declare module 'cloudinary' {
	namespace v2 {
		namespace uploader {
			/** Generates signed upload parameters for direct browser-to-Cloudinary uploads. */
			function direct_upload(
				callback_url?: string,
				options?: Record<string, unknown>,
			): { hidden_fields: Record<string, string> };
		}
	}
}
