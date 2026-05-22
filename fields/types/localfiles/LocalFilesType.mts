class LocalFilesType {
	static properName = 'LocalFiles';

	constructor (_list: unknown, _path: string, _options: unknown) {
		throw new Error('The LocalFiles field type has been removed. Please use File instead.'
			+ '\n\nSee https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide\n');
	}

	addToSchema (): void {}
	format (): string { return ''; }
	isModified (): boolean { return false; }
	inputIsValid (): boolean { return true; }
	updateItem (_item: unknown, _data: unknown, callback: () => void): void {
		process.nextTick(callback);
	}
	uploadFiles (_item: unknown, _files: unknown, _update: unknown, callback: () => void): void {
		process.nextTick(callback);
	}
	getRequestHandler (_item: unknown, _req: unknown, _paths?: unknown, _callback?: unknown): () => void {
		return function () {};
	}
	hasFormatter (): boolean { return false; }
	href (_file: unknown): string { return ''; }
}

export default LocalFilesType;
