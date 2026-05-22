import type { KeystoneList } from '../list.mjs';

type FieldWithOptions = { path: string; hidden?: unknown; getOptions(): Record<string, unknown> };
type UiElementField = { type: 'field'; field: FieldWithOptions };
type UiElementHeading = { type: 'heading'; heading: string; options?: unknown };
type UiElement = UiElementField | UiElementHeading | { type: string; [key: string]: unknown };

export default function getOptions(this: KeystoneList): Record<string, unknown> {
	const self = this as KeystoneList & {
		initialFields: FieldWithOptions[];
		nameField?: FieldWithOptions;
		nameFieldIsFormHeader?: boolean;
		nameIsInitial?: boolean;
		nameIsVirtual?: boolean;
		tracking?: unknown;
		autokey?: unknown;
	};
	const ops: Record<string, unknown> = {
		autocreate: this.options.autocreate,
		autokey: self.autokey,
		defaultColumns: this.options.defaultColumns,
		defaultSort: this.options.defaultSort,
		fields: {},
		hidden: this.options.hidden,
		initialFields: self.initialFields.map((field: FieldWithOptions) => field.path),
		key: this.key,
		label: this.label,
		nameField: self.nameField ? self.nameField.getOptions() : null,
		nameFieldIsFormHeader: self.nameFieldIsFormHeader,
		nameIsInitial: self.nameIsInitial,
		nameIsVirtual: self.nameIsVirtual,
		namePath: this.namePath,
		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		noedit: this.options.noedit,
		path: this.path,
		perPage: this.options.perPage,
		plural: this.plural,
		searchFields: this.options.searchFields,
		singular: this.singular,
		sortable: this.options.sortable,
		sortContext: this.options.sortContext,
		track: this.options.track,
		tracking: self.tracking,
		relationships: this.relationships,
		uiElements: [] as Record<string, unknown>[],
	};
	(this.uiElements as UiElement[]).forEach(function (el: UiElement) {
		switch (el.type) {
			case 'field': {
				const fieldEl = el as UiElementField;
				(ops['fields'] as Record<string, unknown>)[fieldEl.field.path] = fieldEl.field.getOptions();
				if (fieldEl.field.hidden) {
					return;
				}
				(ops['uiElements'] as Record<string, unknown>[]).push({ type: 'field', field: fieldEl.field.path });
				break;
			}
			case 'heading': {
				const headEl = el as UiElementHeading;
				(ops['uiElements'] as Record<string, unknown>[]).push({ type: 'heading', content: headEl.heading, options: headEl.options });
				break;
			}
		}
	});
	return ops;
}
