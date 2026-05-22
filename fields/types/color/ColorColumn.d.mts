/**
 * @file Hand-authored TypeScript declaration for fields/types/color/ColorColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the ColorColumn list-view cell component. */
export interface ColorColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a color field value (colour swatch + hex string) in the list view. */
declare const ColorColumn: React.ComponentClass<ColorColumnProps>;

export default ColorColumn;
