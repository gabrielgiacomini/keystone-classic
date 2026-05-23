/**
 * @file
 * This file defines the `HtmlField` component, which is used to render an HTML
 * field in the KeystoneJS Admin UI.
 *
 * It provides a WYSIWYG editor for HTML, and it can be configured to show a
 * preview of the rendered HTML.
 */
import Field from '../Field.mjs';
import React from 'react';
import { FormInput } from '../../../admin/client-legacy/App/elemental';
import evalDependsOn from '../../utils/evalDependsOn.mjs';

/**
 * TODO:
 * - Remove dependency on underscore
 */

let lastId = 0;

/**
 * Returns a unique ID for a component.
 * @returns {string} The unique ID.
 */
function getId () {
	return 'keystone-html-' + lastId++;
}

function getAdminApiPath () {
	return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}

function getTinyMCE () {
	return typeof window === 'undefined' ? null : window.tinymce || null;
}

// Workaround for #2834 found here https://github.com/tinymce/tinymce/issues/794#issuecomment-203701329
function removeTinyMCEInstance (editor) {
	const tinymce = getTinyMCE();
	if (!tinymce || !editor) return;

	const oldLength = tinymce.editors.length;
	tinymce.remove(editor);
	if (oldLength === tinymce.editors.length) {
		tinymce.editors.remove(editor);
	}
}

/**
 * The `HtmlField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'HtmlField',
	statics: {
		type: 'Html',
	},

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			id: getId(),
			isFocused: false,
			wysiwygActive: false,
		};
	},

	/**
	 * Initializes the WYSIWYG editor.
	 */
	initWysiwyg () {
		if (!this.props.wysiwyg) return;

		const tinymce = getTinyMCE();
		if (!tinymce) return;

		const self = this;
		const opts = this.getOptions();

		opts.setup = function (editor) {
			self.editor = editor;
			editor.on('change', self.valueChanged);
			editor.on('focus', self.focusChanged.bind(self, true));
			editor.on('blur', self.focusChanged.bind(self, false));
		};

		this._currentValue = this.props.value;
		tinymce.init(opts);
		if (evalDependsOn(this.props.dependsOn, this.props.values)) {
			this.setState({ wysiwygActive: true });
		}
	},

	/**
	 * Removes the WYSIWYG editor.
	 * @param {object} state The component's state.
	 */
	removeWysiwyg (state) {
		removeTinyMCEInstance(tinymce.get(state.id));
		this.setState({ wysiwygActive: false });
	},

	/**
	 * Handles the component updating.
	 * @param {object} prevProps The previous props.
	 * @param {object} prevState The previous state.
	 */
	componentDidUpdate (prevProps, prevState) {
		if (prevState.isCollapsed && !this.state.isCollapsed) {
			this.initWysiwyg();
		}

		if (this.props.wysiwyg) {
			if (evalDependsOn(this.props.dependsOn, this.props.values)) {
				if (!this.state.wysiwygActive) {
					this.initWysiwyg();
				}
			} else if (this.state.wysiwygActive) {
				this.removeWysiwyg(prevState);
			}
		}
	},

	/**
	 * Initializes the WYSIWYG editor when the component mounts.
	 */
	componentDidMount () {
		this.initWysiwyg();
	},

	/**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */
	UNSAFE_componentWillReceiveProps (nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},

	/**
	 * Handles a change in the focus of the field.
	 * @param {boolean} focused Whether the field is focused.
	 */
	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */
	valueChanged  (event) {
		let content;
		if (this.editor) {
			content = this.editor.getContent();
		} else {
			content = event.target.value;
		}

		this._currentValue = content;
		this.props.onChange({
			path: this.props.path,
			value: content,
		});
	},

	/**
	 * Gets the options for the WYSIWYG editor.
	 * @returns {object} The options.
	 */
	getOptions () {
		const plugins = ['code', 'link'];
		const options = Object.assign(
			{},
			Keystone.wysiwyg.options,
			this.props.wysiwyg
		);
		let toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
		let i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads || options.enableS3Uploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			const additionalButtons = options.additionalButtons.split(',');
			for (i = 0; i < additionalButtons.length; i++) {
				toolbar += (' | ' + additionalButtons[i]);
			}
		}
		if (options.additionalPlugins) {
			const additionalPlugins = options.additionalPlugins.split(',');
			for (i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (options.importcss) {
			plugins.push('importcss');
			const importcssOptions = {
				content_css: options.importcss,
				importcss_append: true,
				importcss_merge_classes: true,
			};

			Object.assign(options.additionalOptions, importcssOptions);
		}

		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}

		const opts = {
			selector: '#' + this.state.id,
			toolbar: toolbar,
			plugins: plugins,
			menubar: options.menubar || false,
			skin: options.skin || 'keystone',
			branding: false,
		};

			if (this.shouldRenderField()) {
				opts.uploadimage_form_url = options.enableS3Uploads ? `${getAdminApiPath()}/s3/upload` : `${getAdminApiPath()}/cloudinary/upload`;
			} else {
			Object.assign(opts, {
				mode: 'textareas',
				readonly: true,
				menubar: false,
				toolbar: 'code',
				statusbar: false,
			});
		}

		if (options.additionalOptions) {
			Object.assign(opts, options.additionalOptions);
		}

		return opts;
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const className = this.state.isFocused ? 'is-focused' : '';
		const style = {
			height: this.props.height,
		};
		return (
			<div className={className}>
				<FormInput
					id={this.state.id}
					multiline
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					className={this.props.wysiwyg ? 'wysiwyg' : 'code'}
					style={style}
					value={this.props.value}
				/>
			</div>
		);
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return (
			<FormInput multiline noedit>
				{this.props.value}
			</FormInput>
		);
	},

});
