/**
 * @file Hand-authored declaration for fields/components/ItemsTableValue.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface ItemsTableValueProps {
	/** Cell content. */
	children?: React.ReactNode;
	/** Additional CSS class names. */
	className?: string;
	/** Fallback element type or React component when no link destination is given. Defaults to `'div'`. */
	component?: React.ElementType;
	/** Applies the empty link style when true. */
	empty?: boolean;
	/** Marks the link as pointing to an external destination. */
	exterior?: boolean;
	/** Field name used to generate a BEM modifier class. */
	field?: string;
	/** @deprecated Use `to` instead. */
	href?: string;
	/** Marks the link as pointing to an internal destination. */
	interior?: boolean;
	/** Applies additional padding to the link. */
	padded?: boolean;
	/** React Router destination path; renders a `<Link>` when set. */
	to?: string;
	/** Truncates overflowing text when true. Defaults to `true`. */
	truncate?: boolean;
	[key: string]: unknown;
}

declare const ItemsTableValue: React.FC<ItemsTableValueProps>;
export default ItemsTableValue;
