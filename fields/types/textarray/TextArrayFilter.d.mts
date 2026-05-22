/**
 * @file Hand-authored TypeScript declaration for fields/types/textarray/TextArrayFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Text Array Filter Value component. */
/** Value shape for the TextArrayFilter component. */
export interface TextArrayFilterValue {
  mode: 'contains' | 'exactly' | 'beginsWith' | 'endsWith';
  presence: 'some' | 'none';
  value: string;
}

/** Text Array Filter Props component. */
/** Props for the TextArrayFilter component. */
export interface TextArrayFilterProps {
  /** The current filter value. */
  filter: TextArrayFilterValue;
  /** Callback invoked when the filter value changes. */
  onChange: (value: TextArrayFilterValue) => void;
}

/** The TextArrayFilter component. */
declare const TextArrayFilter: React.ComponentClass<TextArrayFilterProps>;
export default TextArrayFilter;
