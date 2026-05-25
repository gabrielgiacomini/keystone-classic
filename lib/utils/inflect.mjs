const IRREGULAR_SINGULAR_TO_PLURAL = new Map([
	['person', 'people'],
	['child', 'children'],
]);

const IRREGULAR_PLURAL_TO_SINGULAR = new Map(
	Array.from(IRREGULAR_SINGULAR_TO_PLURAL.entries()).map(([singular, plural]) => [plural, singular]),
);

const UNCOUNTABLE = new Set(['fish', 'news']);

function preserveCase(source, replacement) {
	if (source.toUpperCase() === source) {
		return replacement.toUpperCase();
	}
	if (source.charAt(0).toUpperCase() === source.charAt(0)) {
		return replacement.charAt(0).toUpperCase() + replacement.slice(1);
	}
	return replacement;
}

function replaceLastWord(value, replacer) {
	const match = value.match(/([A-Za-z]+)$/);
	if (!match?.[1]) {
		return value;
	}
	const word = match[1];
	return value.slice(0, -word.length) + replacer(word);
}

function pluralizeWord(word) {
	if (!word) {
		return '';
	}
	const lower = word.toLowerCase();
	if (UNCOUNTABLE.has(lower)) {
		return word;
	}
	if (IRREGULAR_PLURAL_TO_SINGULAR.has(lower)) {
		return word;
	}
	if (/ies$/i.test(word)) {
		return word;
	}
	if (/s$/i.test(word) && !/(ss|status)$/i.test(word)) {
		return word;
	}
	const irregular = IRREGULAR_SINGULAR_TO_PLURAL.get(lower);
	if (irregular) {
		return preserveCase(word, irregular);
	}
	if (/[^aeiou]y$/i.test(word)) {
		return word.slice(0, -1) + (word.charAt(word.length - 1) === 'Y' ? 'IES' : 'ies');
	}
	if (/(s|x|z|ch|sh)$/i.test(word)) {
		return word + 'es';
	}
	return word + 's';
}

function singularizeWord(word) {
	if (!word) {
		return '';
	}
	const lower = word.toLowerCase();
	if (UNCOUNTABLE.has(lower)) {
		return word;
	}
	const irregular = IRREGULAR_PLURAL_TO_SINGULAR.get(lower);
	if (irregular) {
		return preserveCase(word, irregular);
	}
	if (/[^aeiou]ies$/i.test(word)) {
		return word.slice(0, -3) + (word.charAt(word.length - 3) === 'I' ? 'Y' : 'y');
	}
	if (/(s|x|z|ch|sh)es$/i.test(word)) {
		return word.slice(0, -2);
	}
	if (/s$/i.test(word)) {
		return word.slice(0, -1);
	}
	return word;
}

export function pluralize(value) {
	return replaceLastWord(String(value), pluralizeWord);
}

export function singularize(value) {
	return replaceLastWord(String(value), singularizeWord);
}

export function camelize(value, uppercaseFirst = true) {
	const text = String(value);
	const camelized = text.replace(/_+([A-Za-z0-9])/g, (_match, char) => char.toUpperCase());
	if (!camelized.length) {
		return '';
	}
	return (uppercaseFirst ? camelized.charAt(0).toUpperCase() : camelized.charAt(0).toLowerCase()) + camelized.slice(1);
}
