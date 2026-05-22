import type { Keystone } from '../../index.mjs';
import { keyToLabel, keyToPath } from '../utils/string.mjs';

/**
 * Type guard: checks if a value is a non-null object or function.
 * @param value - The value to check.
 * @returns Whether the value is an object or function.
 */
function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

interface NavListEntry { key: string; label: string; path: string; external?: boolean }
interface NavSection { key: string; label: string; lists: NavListEntry[] }
export interface NavResult {
	sections: NavSection[];
	by: { list: Record<string, NavSection>; section: Record<string, NavSection> };
	flat?: boolean;
}

/**
 * Builds the admin UI navigation structure from configured sections.
 * @param sections - Optional map of section names to list paths.
 * @returns The computed navigation result with sections and lookup indexes.
 */
export default function initNav(this: Keystone, sections?: Record<string, unknown>): NavResult {
	const keystone = this;

	const nav: NavResult = {
		sections: [],
		by: {
			list: {},
			section: {},
		},
	};

	if (!sections) {
		sections = {};
		(nav as NavResult & { flat?: boolean }).flat = true;
		const flatSections = sections;
		Object.values(this.lists).forEach(function (list) {
			if (list.get('hidden')) return;
			flatSections[list.path] = [list.path];
		});
	}

	Object.entries(sections).forEach(function ([key, rawSection]) {
		const sectionLists: unknown[] = typeof rawSection === 'string'
			? [rawSection]
			: Array.isArray(rawSection) ? rawSection : [];

		const firstEntry = sectionLists[0];
		const section: NavSection = {
			lists: [],
			label: (nav as NavResult & { flat?: boolean }).flat
				? ((keystone.lists[String(firstEntry)] ?? keystone.lists[keystone.paths[String(firstEntry)] ?? ''])?.label ?? keyToLabel(String(firstEntry)))
				: keyToLabel(key),
			key: key,
		};

		section.lists = sectionLists.map(function (i: unknown): NavListEntry {
			if (typeof i === 'string') {
				const list = keystone.lists[i] ?? keystone.lists[keystone.paths[i] ?? ''];
				if (!list) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n');
				}
				if (list.get('hidden')) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' is hidden.\n');
				}
				nav.by.list[list.key] = section;
				return {
					key: list.key,
					label: list.label,
					path: list.path,
				};
			} else if (isObject(i)) {
				const obj = i as { key?: string; label?: string; path?: string; external?: boolean };
				if (!Object.prototype.hasOwnProperty.call(obj, 'key')) {
					throw new Error('Invalid Keystone Option (nav): object ' + JSON.stringify(obj) + ' requires a "key" property.\n');
				}
				obj.label = obj.label ?? keyToLabel(obj.key ?? '');
				obj.path = obj.path ?? keyToPath(obj.key ?? '');
				obj.external = true;
				nav.by.list[obj.key ?? ''] = section;
				return obj as NavListEntry;
			}
			throw new Error('Invalid Keystone Option (nav): ' + String(i) + ' is in an unrecognized format.\n');
		});

		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});

	return nav;
}
