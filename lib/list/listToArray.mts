/**
 * Converts a space/comma-delimited string (or existing array) to a trimmed, filtered string array.
 */
export default function listToArray (str: unknown): string[] {
	if (Array.isArray(str)) return str as string[];
	if (!str || typeof str !== 'string') return [];
	return str.replace(/,/g, ' ').split(' ').map(s => s.trim()).filter(Boolean);
}
