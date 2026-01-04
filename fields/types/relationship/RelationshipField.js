/**
 * @fileoverview
 * This file defines the `RelationshipField` component, which is used to render
 * a relationship field in the KeystoneJS Admin UI.
 *
 * It provides a select input to choose a related item from a list, and it
 * can be configured to allow creating new related items inline.
 */
import async from 'async';
import Field from '../Field';
import { listsByKey } from '../../../admin/client/utils/lists';
import React from 'react';
import Select from 'react-select';
import xhr from 'xhr';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';
import _ from 'lodash';
import CreateForm from '../../../admin/client/App/shared/CreateForm';

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
 * @extends Field
 */
export default Field.create({
	displayName: 'RelationshipField',
	statics: {
		type: 'Relationship',
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
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
	 * Handles the component receiving new props.
	 * @param {Object} nextProps The new props.
	 */
	UNSAFE_componentWillReceiveProps (nextProps) {
		if (nextProps.value === this.props.value || nextProps.many && compareValues(this.props.value, nextProps.value)) return;
		this.loadValue(nextProps.value);
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
		var filters = {};

		_.forEach(this.props.filters, (value, key) => {
			if (typeof value === 'string' && value[0] === ':') {
				var fieldName = value.slice(1);

				var val = this.props.values[fieldName];
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
		}, this);

		var parts = [];

		_.forEach(filters, function (val, key) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		});

		return parts.join('&');
	},
	/**
	 * Caches an item.
	 * @param {Object} item The item to cache.
	 */
	cacheItem (item) {
		item.href = Keystone.adminPath + '/' + this.props.refList.path + '/' + item.id;
		this._itemsCache[item.id] = item;
	},
	/**
	 * Loads the value of the field.
	 * @param {*} values The value(s) to load.
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
		async.map(values, (value, done) => {
			xhr({
				url: Keystone.adminPath + '/api/' + this.props.refList.path + '/' + value + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return done(err);
				this.cacheItem(data);
				done(err, data);
			});
		}, (err, expanded) => {
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
	 * @param {function} callback The callback to call with the options.
	 */
	loadOptions (input, callback) {
		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback = callback;
		const filters = this.buildFilters();
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.refList.path + '?basic&search=' + input + '&' + filters,
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
	 * @param {*} value The new value.
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
		});
	},
	/**
	 * Handles the creation of a new item.
	 * @param {Object} item The new item.
	 */
	onCreate (item) {
		this.cacheItem(item);
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
		this.closeCreate();
	},
	/**
	 * Renders the select input.
	 * @param {boolean} noedit Whether the input is editable.
	 * @returns {React.Element} The rendered select input.
	 */
	renderSelect (noedit) {
		const inputName = this.getInputName(this.props.path);
		const emptyValueInput = (this.props.many && (!this.state.value || !this.state.value.length) || (!this.props.many && !this.state.value))
			? <input type="hidden" name={inputName} value="" /> : null;
		return (
			<div>
				{/* This input ensures that an empty value is submitted when no related items are selected */}
				{emptyValueInput}
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<Select.Async
					multi={this.props.many}
					disabled={noedit}
					loadOptions={this.loadOptions}
					labelKey="name"
					name={inputName}
					onChange={this.valueChanged}
					simpleValue
					value={this.state.value}
					valueKey="id"
				/>
			</div>
		);
	},
	/**
	 * Renders the input group.
	 * @returns {React.Element} The rendered input group.
	 */
	renderInputGroup () {
		return (
			<Group block>
				<Section grow>
					{this.renderSelect()}
				</Section>
				<Section>
					<Button onClick={this.openCreate}>+</Button>
				</Section>
				<CreateForm
					list={listsByKey[this.props.refList.key]}
					isOpen={this.state.createIsOpen}
					onCreate={this.onCreate}
					onCancel={this.closeCreate} />
			</Group>
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

		return many ? this.renderSelect(true) : <FormInput {...props} />;
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
