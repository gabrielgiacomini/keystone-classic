/**
 * @file Hand-authored declaration for fields/components/HiddenFileInput.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface HiddenFileInputProps {
	/** Called when the user selects a file. Required. */
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	/** Additional inline styles merged with the off-screen positioning. */
	style?: React.CSSProperties;
	[key: string]: unknown;
}

/** Instance interface exposing the imperative API available via refs. */
export interface HiddenFileInputInstance {
	/** Resets the underlying file input value so the same file can be selected again. */
	clearValue(): void;
	/** Programmatically clicks the hidden file input to open the file picker. */
	clickDomNode(): void;
	/** Returns whether the file input currently holds a selected value. */
	hasValue(): boolean;
}

declare const HiddenFileInput: React.ComponentClass<HiddenFileInputProps> & {
	new (props: HiddenFileInputProps): React.Component<HiddenFileInputProps> & HiddenFileInputInstance;
};
export default HiddenFileInput;
