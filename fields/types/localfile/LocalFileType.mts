type DeferredBooleanCallback = (result: boolean) => void;
type UploadCallback = (err?: Error | null, data?: unknown) => void;

class LocalFileType {
	static properName = 'LocalFile';

	constructor (_list: unknown, _path: string, _options: unknown) {
		throw new Error('The LocalFile field type has been removed. Please use File instead.'
			+ '\n\nSee https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide\n');
	}

	addToSchema (): void {}
	format (): string { return ''; }
	hasFormatter (): boolean { return false; }
	href (): string { return ''; }
	isModified (): boolean { return false; }
	validateInput (_data: unknown, callback: DeferredBooleanCallback): void {
		process.nextTick(callback, true);
	}
	validateRequiredInput (_item: unknown, _data: unknown, callback: DeferredBooleanCallback): void {
		process.nextTick(callback, false);
	}
	inputIsValid (): boolean { return true; }
	updateItem (_item: unknown, _data: unknown, callback: () => void): void {
		process.nextTick(callback);
	}
	uploadFile (_item: unknown, _file: unknown, update: boolean | UploadCallback, callback?: UploadCallback): void {
		const cb = typeof update === 'function' ? update : callback;
		if (cb) cb(new Error('LocalFile field type has been removed'));
	}
	getRequestHandler (_item: unknown, _req: unknown, _paths?: unknown, _callback?: unknown): () => void {
		return function () {};
	}
}

export default LocalFileType;
