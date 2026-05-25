/**
 * @file
 * This file defines the `RelationshipField` component, which is used to render
 * a relationship field in the KeystoneJS Admin UI.
 *
 * It provides a select input to choose a related item from a list, and it
 * can be configured to allow creating new related items inline.
 */
import Field from '../Field.mjs';
import { listsByKey } from '../../../admin/client-legacy/utils/lists.mjs';
import React from 'react';
import Select from '../../../admin/client-legacy/compat/shared/Select.mjs';
import { legacyApiRequest } from '../../../admin/shared/api/legacyRequest.mjs';
import Button from '../../../admin/client-legacy/compat/elemental/Button.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import CreateForm from '../../../admin/client-legacy/compat/shared/CreateForm.mjs';

function getAdminApiPath () {
	return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}

function releaseBodyScrollLock () {
	if (typeof document === 'undefined') return;
	document.body.style.paddingRight = '';
	document.body.style.overflow = '';
	document.body.style.overflowY = '';
	window.dispatchEvent(new Event('resize'));
	window.dispatchEvent(new Event('scroll'));
}

/**
 * Compares two arrays of values.
 * @param {Array} current The first array.
 * @param {Array} next The second array.
 * @returns {boolean} Whether the arrays are equal.
 */
function compareValues (current, next) {
	const currentLength = current ? current.length : 0;
	const nextLength = next ? next.length : 0;
	if (currentLength !== nextLength) return false;
	for (let i = 0; i < currentLength; i++) {
		if (current[i] !== next[i]) return false;
	}
	return true;
}

/**
 * The `RelationshipField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'RelationshipField',
	statics: {
		type: 'Relationship',
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			value: null,
			createIsOpen: false,
		};
	},
	/**
	 * Initializes the component.
	 */
	componentDidMount () {
		this._itemsCache = {};
		this.loadValue(this.props.value);
		this.__isMounted = true;
	},
	/**
	 * Unmounts the component.
	 */
	componentWillUnmount () {
		this.__isMounted = false;
	},
	/**
	 * Handles externally supplied value changes.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate (prevProps) {
		if (this.props.value === prevProps.value || this.props.many && compareValues(prevProps.value, this.props.value)) return;
		this.loadValue(this.props.value);
	},
	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	shouldCollapse () {
		if (this.props.many) {
			// many:true relationships have an Array for a value
			return this.props.collapse && !this.props.value.length;
		}
		return this.props.collapse && !this.props.value;
	},
	/**
	 * Builds the filters for the query.
	 * @returns {string} The filter string.
	 */
	buildFilters () {
		const filters = {};

		Object.entries(this.props.filters || {}).forEach(([key, value]) => {
			if (typeof value === 'string' && value[0] === ':') {
				const fieldName = value.slice(1);

				const val = this.props.values[fieldName];
				if (val) {
					filters[key] = val;
					return;
				}

				// check if filtering by id and item was already saved
				if (fieldName === '_id' && Keystone.item) {
					filters[key] = Keystone.item.id;
					return;
				}
			} else {
				filters[key] = value;
			}
		});

		const parts = [];

		Object.entries(filters).forEach(function ([key, val]) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		});

		return parts.join('&');
	},
	/**
	 * Caches an item.
	 * @param {object} item The item to cache.
	 */
	cacheItem (item) {
		item.href = Keystone.adminLegacyPath + '/' + this.props.refList.path + '/' + item.id;
		this._itemsCache[item.id] = item;
	},
	/**
	 * Loads the value of the field.
	 * @param {Array|string|null} values The value(s) to load — an array of IDs, a comma-separated string of IDs, or null/falsy to clear.
	 * @returns {void}
	 */
	loadValue (values) {
		if (!values) {
			return this.setState({
				loading: false,
				value: null,
			});
		};
		values = Array.isArray(values) ? values : values.split(',');
		const cachedValues = values.map(i => this._itemsCache[i]).filter(i => i);
		if (cachedValues.length === values.length) {
			this.setState({
				loading: false,
				value: this.props.many ? cachedValues : cachedValues[0],
			});
			return;
		}
		this.setState({
			loading: true,
			value: null,
		});
			Promise.all(values.map((value) => new Promise((resolve, reject) => {
				legacyApiRequest({
					url: getAdminApiPath() + '/' + this.props.refList.path + '/' + value + '?basic',
					responseType: 'json',
				}, (err, resp, data) => {
				if (err || !data) return reject(err);
				this.cacheItem(data);
				resolve(data);
			});
		}))).then((expanded) => {
			if (!this.__isMounted) return;
			if (this.props.onValuesLoaded && typeof this.props.onValuesLoaded === 'function') {
				this.props.onValuesLoaded(this.props.path);
			}
			this.setState({
				loading: false,
				value: this.props.many ? expanded : expanded[0],
			});
		});
	},
	// NOTE: this seems like the wrong way to add options to the Select
	loadOptionsCallback: {},
	/**
	 * Loads options for the select input.
	 * @param {string} input The search input.
	 * @param {(err: Error|null, result: {options: Array, complete: boolean}|null) => void} callback The callback to call with the options.
	 */
	loadOptions (input, callback) {
		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback = callback;
			const filters = this.buildFilters();
			legacyApiRequest({
				url: getAdminApiPath() + '/' + this.props.refList.path + '?basic&search=' + input + '&' + filters,
				responseType: 'json',
			}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return callback(null, []);
			}
			data.results.forEach(this.cacheItem);
			callback(null, {
				options: data.results,
				complete: data.results.length === data.count,
			});
		});
	},
	/**
	 * Handles a change in the value of the field.
	 * @param {string|Array|null} value The new value — a single ID string, an array of IDs, or null to clear.
	 */
	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	/**
	 * Opens the create modal.
	 */
	openCreate () {
		this.setState({
			createIsOpen: true,
		});
	},
	/**
	 * Closes the create modal.
	 */
	closeCreate () {
		this.setState({
			createIsOpen: false,
		}, releaseBodyScrollLock);
	},
	/**
	 * Handles the creation of a new item.
	 * @param {object} item The new item.
	 */
	onCreate (item) {
		this.cacheItem(item);
		this.setState({
			createIsOpen: false,
		}, () => {
			releaseBodyScrollLock();
			if (Array.isArray(this.state.value)) {
				// For many relationships, append the new item to the end
				const values = this.state.value.map((item) => item.id);
				values.push(item.id);
				this.valueChanged(values.join(','));
			} else {
				this.valueChanged(item.id);
			}

			// NOTE: this seems like the wrong way to add options to the Select
			this.loadOptionsCallback(null, {
				complete: true,
				options: Object.keys(this._itemsCache).map((k) => this._itemsCache[k]),
			});
		});
	},
	/**
	 * Renders the select input.
	 * @param {boolean} noedit Whether the input is editable.
	 * @returns {React.Element} The rendered select input.
	 */
	renderSelect (noedit) {
		const inputName = this.getInputName(this.props.path);
		const emptyValueInput = (this.props.many && (!this.state.value || !this.state.value.length) || (!this.props.many && !this.state.value))
			? React.createElement('input', { type: 'hidden', name: inputName, value: '' }) : null;
		return React.createElement(
			'div',
			null,
			emptyValueInput,
			React.createElement('input', {
				type: 'text',
				style: { position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 },
				tabIndex: '-1',
			}),
			React.createElement(Select.Async, {
				multi: this.props.many,
				disabled: noedit,
				loadOptions: this.loadOptions,
				labelKey: 'name',
				name: inputName,
				onChange: this.valueChanged,
				simpleValue: true,
				value: this.state.value,
				valueKey: 'id',
			})
		);
	},
	/**
	 * Renders the input group.
	 * @returns {React.Element} The rendered input group.
	 */
	renderInputGroup () {
		return React.createElement(
			'div',
			{ style: { alignItems: 'stretch', display: 'flex', gap: '0.75em' } },
			React.createElement(
				'div',
				{ style: { flex: '1 1 0', minWidth: 0 } },
				this.renderSelect()
			),
			React.createElement(
				'div',
				{ style: { flex: '0 0 auto' } },
				React.createElement(Button, {
					onClick: this.openCreate,
					'data-field-relationship-create-inline': true,
				}, '+')
			),
			React.createElement(CreateForm, {
				list: listsByKey[this.props.refList.key],
				isOpen: this.state.createIsOpen,
				onCreate: this.onCreate,
				onCancel: this.closeCreate,
			})
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const { many } = this.props;
		const { value } = this.state;
		const props = {
			children: value ? value.name : null,
			component: value ? 'a' : 'span',
			href: value ? value.href : null,
			noedit: true,
		};

		return many ? this.renderSelect(true) : React.createElement(FormInput, props);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		if (this.props.createInline) {
			return this.renderInputGroup();
		} else {
			return this.renderSelect();
		}
	},

});
