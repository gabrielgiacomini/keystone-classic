declare module 'i' {
	interface Inflect {
		camelize(value: string, lowercaseFirstLetter?: boolean): string;
		pluralize(value: string): string;
		singularize(value: string): string;
	}

	function createInflect(attach?: boolean): Inflect;

	export = createInflect;
}
