/**
 * @file Hand-authored declaration for fields/components/ItemsTableCell.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface ItemsTableCellProps {
	/** Additional CSS class names appended to `'ItemList__col'`. */
	className?: string;
	/** Cell content. */
	children?: React.ReactNode;
	[key: string]: unknown;
}

declare const ItemsTableCell: React.FC<ItemsTableCellProps>;
export default ItemsTableCell;
