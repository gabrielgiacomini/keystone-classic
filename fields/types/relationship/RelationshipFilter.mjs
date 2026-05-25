/**
 * @file
 * This file defines the `RelationshipFilter` component, which is used to filter
 * `Relationship` fields in the KeystoneJS Admin UI.
 *
 * It provides a search input to find related items, and it supports inverting
 * the filter.
 */
import React from 'react';
import { legacyApiRequest } from '../../../admin/shared/api/legacyRequest.mjs';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

import PopoutList from '../../../admin/client-legacy/App/shared/Popout/PopoutList.mjs';

const INVERTED_OPTIONS = [
	{ label: 'Linked To', value: false },
	{ label: 'NOT Linked To', value: true },
];

function getAdminApiPath () {
	return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		value: [],
	};
}

/**
 * The `RelationshipFilter` component.
 * @augments React.Component
 */
class RelationshipFilter extends React.Component {

	static defaultProps = {
		filter: getDefaultValue(),
	};

	static getDefaultValue = getDefaultValue;

	constructor(props) {
		super(props);
		this.state = {
			searchIsLoading: false,
			searchResults: [],
			searchString: '',
			selectedItems: [],
			valueIsLoading: true,
		};
	}

	componentDidMount() {
		this._itemsCache = {};
		this.loadSearchResults(true);
	}

	/**
	 * Handles externally supplied filter value changes.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate(prevProps) {
		if (this.props.filter.value !== prevProps.filter.value) {
			this.populateValue(this.props.filter.value);
		}
	}

	/**
	 * Returns whether the component is loading.
	 * @returns {boolean} Whether the component is loading.
	 */
	isLoading() {
		return this.state.searchIsLoading || this.state.valueIsLoading;
	}

	focusTarget = () => {
		if (this.focusTargetRef) this.focusTargetRef.focus();
	};

	/**
	 * Populates the value of the filter.
	 * @param {Array} value The value to populate.
	 */
	populateValue(value) {
		Promise.all(value.map((id) => {
				if (this._itemsCache[id]) return Promise.resolve(this._itemsCache[id]);
				return new Promise((resolve, reject) => {
					legacyApiRequest({
						url: getAdminApiPath() + '/' + this.props.field.refList.path + '/' + id + '?basic',
						responseType: 'json',
					}, (err, resp, data) => {
					if (err || !data) return reject(err);
					this.cacheItem(data);
					resolve(data);
				});
			});
		})).then((items) => {
			this.setState({
				valueIsLoading: false,
				selectedItems: items || [],
			}, () => {
				this.focusTarget();
			});
		}, (err) => {
			// TODO: Handle errors better
			console.error('Error loading items:', err);
		});
	}

	/**
	 * Caches an item.
	 * @param {object} item The item to cache.
	 */
	cacheItem = (item) => {
		this._itemsCache[item.id] = item;
	};

	/**
	 * Builds the filters for the query.
	 * @returns {string} The filter string.
	 */
	buildFilters() {
		const filters = {};
		Object.entries(this.props.field.filters || {}).forEach(function ([key, value]) {
			if (value[0] === ':') return;
			filters[key] = value;
		});

		const parts = [];
		Object.entries(filters).forEach(function ([key, val]) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		});

		return parts.join('&');
	}

	/**
	 * Loads the search results.
	 * @param {boolean} thenPopulateValue Whether to populate the value after loading the results.
	 */
	loadSearchResults = (thenPopulateValue) => {
			const searchString = this.state.searchString;
			const filters = this.buildFilters();
			legacyApiRequest({
				url: getAdminApiPath() + '/' + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
				responseType: 'json',
			}, (err, resp, data) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
				this.setState({
					searchIsLoading: false,
				});
				return;
			}
			data.results.forEach(this.cacheItem);
			if (thenPopulateValue) {
				this.populateValue(this.props.filter.value);
			}
			if (searchString !== this.state.searchString) return;
			this.setState({
				searchIsLoading: false,
				searchResults: data.results,
			}, this.updateHeight);
		});
	};

	/**
	 * Updates the height of the component.
	 */
	updateHeight = () => {
		if (this.props.onHeightChange && this.containerRef) {
			this.props.onHeightChange(this.containerRef.offsetHeight);
		}
	};

	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */
	toggleInverted = (inverted) => {
		this.updateFilter({ inverted });
	};

	/**
	 * Handles a change in the search input.
	 * @param {object} e The event object.
	 */
	updateSearch = (e) => {
		this.setState({ searchString: e.target.value }, this.loadSearchResults);
	};

	/**
	 * Selects an item.
	 * @param {object} item The item to select.
	 */
	selectItem(item) {
		const value = this.props.filter.value.concat(item.id);
		this.updateFilter({ value });
	}

	/**
	 * Removes an item from the filter.
	 * @param {object} item The item to remove.
	 */
	removeItem(item) {
		const value = this.props.filter.value.filter(i => { return i !== item.id; });
		this.updateFilter({ value });
	}

	/**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter(value) {
		this.props.onChange({ ...this.props.filter, ...value });
	}

	/**
	 * Renders a list of items.
	 * @param {Array} items The items to render.
	 * @param {boolean} selected Whether the items are selected.
	 * @returns {React.Element} The rendered items.
	 */
	renderItems(items, selected) {
		const itemIconHover = selected ? 'x' : 'check';

		return items.map((item, i) => {
			return React.createElement(PopoutList.Item, {
				key: `item-${i}-${item.id}`,
				icon: 'dash',
				iconHover: itemIconHover,
				label: item.name,
				onClick: () => {
					if (selected) this.removeItem(item);
					else this.selectItem(item);
				},
			});
		});
	}

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const selectedItems = this.state.selectedItems;
		const searchResults = this.state.searchResults.filter(i => {
			return this.props.filter.value.indexOf(i.id) === -1;
		});
		const placeholder = this.isLoading() ? 'Loading...' : 'Find a ' + this.props.field.label + '...';
		return React.createElement(
			'div',
			{ ref: (container) => { this.containerRef = container; } },
			React.createElement(
				FormField,
				null,
				React.createElement(SegmentedControl, {
					equalWidthSegments: true,
					options: INVERTED_OPTIONS,
					value: this.props.filter.inverted,
					onChange: this.toggleInverted,
				})
			),
			React.createElement(
				FormField,
				{ style: { borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' } },
				React.createElement(FormInput, {
					autoFocus: true,
					ref: (input) => { this.focusTargetRef = input; },
					value: this.state.searchString,
					onChange: this.updateSearch,
					placeholder,
				})
			),
			selectedItems.length ? React.createElement(
				PopoutList,
				null,
				React.createElement(PopoutList.Heading, null, 'Selected'),
				this.renderItems(selectedItems, true)
			) : null,
			searchResults.length ? React.createElement(
				PopoutList,
				null,
				React.createElement(
					PopoutList.Heading,
					{ style: selectedItems.length ? { marginTop: '2em' } : null },
					'Items'
				),
				this.renderItems(searchResults)
			) : null
		);
	}
}

export default RelationshipFilter;
