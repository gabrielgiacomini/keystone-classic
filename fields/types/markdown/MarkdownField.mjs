/**
 * @file
 * This file defines the `MarkdownField` component, which is used to render a
 * markdown field in the KeystoneJS Admin UI.
 *
 * It provides a WYSIWYG editor for markdown, and it can be configured to
 * show a preview of the rendered HTML.
 */
import Field from '../Field.mjs';
import React from 'react';
import { FormInput } from '../../../admin/client-legacy/App/elemental';

/**
 * TODO:
 * - Remove dependency on jQuery
 */

// Scope jQuery and the bootstrap-markdown editor so it will mount
import $ from 'jquery';
import './lib/bootstrap-markdown.mjs';

/**
 * Toggles a heading on the selected text.
 * @param {object} e The event object.
 * @param {string} level The heading level.
 */
// Append/remove ### surround the selection
// Source: https://github.com/toopay/bootstrap-markdown/blob/master/js/bootstrap-markdown.js#L909
const toggleHeading = function (e, level) {
	let chunk;
	let cursor;
	const selected = e.getSelection();
	const content = e.getContent();
	let pointer;
	let prevChar;

	if (selected.length === 0) {
		// Give extra word
		chunk = e.__localize('heading text');
	} else {
		chunk = selected.text + '\n';
	}

	// transform selection and set the cursor into chunked text
	if ((pointer = level.length + 1, content.slice(selected.start - pointer, selected.start) === level + ' ')
		|| (pointer = level.length, content.slice(selected.start - pointer, selected.start) === level)) {
		e.setSelection(selected.start - pointer, selected.end);
		e.replaceSelection(chunk);
		cursor = selected.start - pointer;
	} else if (selected.start > 0 && (prevChar = content.slice(selected.start - 1, selected.start), !!prevChar && prevChar !== '\n')) {
		e.replaceSelection('\n\n' + level + ' ' + chunk);
		cursor = selected.start + level.length + 3;
	} else {
		// Empty string before element
		e.replaceSelection(level + ' ' + chunk);
		cursor = selected.start + level.length + 1;
	}

	// Set the cursor
	e.setSelection(cursor, cursor + chunk.length);
};

/**
 * Renders the markdown editor.
 * @param {React.Component} component The component to render the editor on.
 */
const renderMarkdown = function (component) {
	// dependsOn means that sometimes the component is mounted as a null, so account for that & noop
	if (!component.refs.markdownTextarea) {
		return;
	}

	const options = {
		autofocus: false,
		savable: false,
		resize: 'vertical',
		height: component.props.height,
		hiddenButtons: ['Heading'],

		// Heading buttons
		additionalButtons: [{
			name: 'groupHeaders',
			data: [{
				name: 'cmdH1',
				title: 'Heading 1',
				btnText: 'H1',
				callback: function (e) {
					toggleHeading(e, '#');
				},
			}, {
				name: 'cmdH2',
				title: 'Heading 2',
				btnText: 'H2',
				callback: function (e) {
					toggleHeading(e, '##');
				},
			}, {
				name: 'cmdH3',
				title: 'Heading 3',
				btnText: 'H3',
				callback: function (e) {
					toggleHeading(e, '###');
				},
			}, {
				name: 'cmdH4',
				title: 'Heading 4',
				btnText: 'H4',
				callback: function (e) {
					toggleHeading(e, '####');
				},
			}],
		}],

		// Insert Header buttons into the toolbar
		reorderButtonGroups: ['groupFont', 'groupHeaders', 'groupLink', 'groupMisc', 'groupUtil'],
	};

	if (component.props.toolbarOptions.hiddenButtons) {
		const hiddenButtons = (typeof component.props.toolbarOptions.hiddenButtons === 'string')
			? component.props.toolbarOptions.hiddenButtons.split(',')
			: component.props.toolbarOptions.hiddenButtons;

		options.hiddenButtons = options.hiddenButtons.concat(hiddenButtons);
	}

	$(component.refs.markdownTextarea).markdown(options);
};

/**
 * Escapes HTML for rendering.
 * @param {string} html The HTML to escape.
 * @returns {string} The escaped HTML.
 */
// Simple escaping of html tags and replacing newlines for displaying the raw markdown string within an html doc
const escapeHtmlForRender = function (html) {
	return html
		.replace(/\&/g, '&amp;')
		.replace(/\</g, '&lt;')
		.replace(/\>/g, '&gt;')
		.replace(/\n/g, '<br />');
};

/**
 * The `MarkdownField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'MarkdownField',
	statics: {
		type: 'Markdown',
		getDefaultValue: () => ({}),
	},

	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	// override `shouldCollapse` to check the markdown field correctly
	shouldCollapse () {
		return this.props.collapse && !this.props.value.md;
	},

	/**
	 * Renders the markdown editor when the component mounts.
	 */
	// only have access to `refs` once component is mounted
	componentDidMount () {
		if (this.props.wysiwyg) {
			renderMarkdown(this);
		}
	},

	/**
	 * Renders the markdown editor when the component updates.
	 */
	// only have access to `refs` once component is mounted
	componentDidUpdate  () {
		if (this.props.wysiwyg) {
			renderMarkdown(this);
		}
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const styles = {
			padding: 8,
			height: this.props.height,
		};
		const defaultValue = (
			this.props.value !== undefined
			&& this.props.value.md !== undefined
		)
			? this.props.value.md
			: '';

		return (
			<textarea
				className="md-editor__input code"
				defaultValue={defaultValue}
				name={this.getInputName(this.props.paths.md)}
				ref="markdownTextarea"
				style={styles}
			/>
		);
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		// We want to render the raw markdown string, without parsing it to html
		// The markdown string *itself* may include html though so we need to escape it first
		const innerHtml = (this.props.value && this.props.value.md)
			? escapeHtmlForRender(this.props.value.md)
			: '';

		return (
			<FormInput
				dangerouslySetInnerHTML={{ __html: innerHtml }}
				multiline
				noedit
			/>
		);
	},
});
