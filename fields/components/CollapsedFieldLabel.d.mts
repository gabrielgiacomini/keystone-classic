/**
 * @file Hand-authored declaration for fields/components/CollapsedFieldLabel.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface CollapsedFieldLabelProps {
	/** Additional inline styles merged with the defaults. */
	style?: React.CSSProperties;
	[key: string]: unknown;
}

declare const CollapsedFieldLabel: React.FC<CollapsedFieldLabelProps>;
export default CollapsedFieldLabel;
