export default async function safeRequire(library: string, feature: string): Promise<unknown> {
	try {
		return await import(library);
	} catch (error: unknown) {
		const code = (error as NodeJS.ErrnoException).code;
		if (code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND') {
			console.error('\nTo use ' + feature + ' install ' + library);
			process.exit(1);
		}
		throw error;
	}
}
