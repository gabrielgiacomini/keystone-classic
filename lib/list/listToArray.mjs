/** Converts a space/comma-delimited string (or existing array) to a trimmed, filtered string array. */
export default function listToArray (str) {
	if (Array.isArray(str)) return str;
	if (!str || typeof str !== 'string') return [];
	return str.replace(/,/g, ' ').split(' ').map(s => s.trim()).filter(Boolean);
}
