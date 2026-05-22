/**
 * @file Centralised selectors for the admin legacy React-15 UI.
 *
 * Several DOM patterns recur across multiple specs (the react-select
 * v1 dropdown trigger, the list-view row checkboxes, the manage
 * toolbar). Putting them here means a CSS rename in `admin/client-legacy/`
 * has one place to update instead of four. Keep this file thin —
 * spec-local selectors stay in the spec.
 */

/**
 * react-select v1 single-value control. `.Select--single` selects the
 * wrapper; `.Select-control` inside is the click target that opens the
 * dropdown. Multiple `.Select--single` elements appear on an item-edit
 * page (one per Select / Relationship field), so callers index by .nth().
 */
export const SELECT_SINGLE_CONTROL = '.Select--single .Select-control';

/**
 * react-select v1 multi-value control (used for `many: true`
 * relationships). There's typically one per page on a Post detail
 * (the Editors picker).
 */
export const SELECT_MULTI_CONTROL = '.Select--multi .Select-control';

/** react-select v1 dropdown menu options (visible only when open). */
export const SELECT_MENU_OPTION = '.Select-option';

/** Sign-out icon in the top-right primary nav. */
export const SIGNOUT_LINK = 'a[title="Sign Out"], a[href*="/signout"]';

/** Manage-mode toggle button in the list-view toolbar. */
export const MANAGE_BUTTON = 'button:has-text("Manage")';

/**
 * "Create Post" / "Create User" button in the list-view toolbar.
 * @param singularLabel - Model singular label as shown in the UI (e.g. `Post`).
 * @returns Locator selector string for the create button (`button:has-text("Create …")`).
 */
export function createButton (singularLabel: string): string {
	return `button:has-text("Create ${singularLabel}")`;
}
