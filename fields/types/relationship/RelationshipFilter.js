import _ from 'lodash';
import async from 'async';

/**
 * @fileoverview
 * This file defines the `RelationshipFilter` component, which is used to filter
 * `Relationship` fields in the KeystoneJS Admin UI.
 *
 * It provides a search input to find related items, and it supports inverting
 * the filter.
 */
import PropTypes from 'prop-types';

import React from 'react';
import { findDOMNode } from 'react-dom';
import xhr from 'xhr';

import {
	FormField,
	FormInput,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

import PopoutList from '../../../admin/client/App/shared/Popout/PopoutList';

const INVERTED_OPTIONS = [
	{ label: 'Linked To', value: false },
	{ label: 'NOT Linked To', value: true },
];

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		value: [],
	};
}

/**
 * The `RelationshipFilter` component.
 * @extends React.Component
 */
class RelationshipFilter extends React.Component {
    static propTypes = {
		field: PropTypes.object,
		filter: PropTypes.shape({
			inverted: PropTypes.bool,
			value: PropTypes.array,
		}),
		onHeightChange: PropTypes.func,
	};

    static getDefaultValue = getDefaultValue;

    static defaultProps = {
        filter: getDefaultValue(),
    };

    /**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
    state = {
        searchIsLoading: false,
        searchResults: [],
        searchString: '',
        selectedItems: [],
        valueIsLoading: true,
    };

    componentDidMount() {
		this._itemsCache = {};
		this.loadSearchResults(true);
	}

    /**
	 * Handles the component receiving new props.
	 * @param {Object} nextProps The new props.
	 */
    UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.filter.value !== this.props.filter.value) {
			this.populateValue(nextProps.filter.value);
		}
	}

    /**
	 * Returns whether the component is loading.
	 * @returns {boolean} Whether the component is loading.
	 */
    isLoading = () => {
		return this.state.searchIsLoading || this.state.valueIsLoading;
	};

    /**
	 * Populates the value of the filter.
	 * @param {Array} value The value to populate.
	 */
    populateValue = (value) => {
		async.map(value, (id, next) => {
			if (this._itemsCache[id]) return next(null, this._itemsCache[id]);
			xhr({
				url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '/' + id + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return next(err);
				this.cacheItem(data);
				next(err, data);
			});
		}, (err, items) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
			}
			this.setState({
				valueIsLoading: false,
				selectedItems: items || [],
			}, () => {
				findDOMNode(this.refs.focusTarget).focus();
			});
		});
	};

    /**
	 * Caches an item.
	 * @param {Object} item The item to cache.
	 */
    cacheItem = (item) => {
		this._itemsCache[item.id] = item;
	};

    /**
	 * Builds the filters for the query.
	 * @returns {string} The filter string.
	 */
    buildFilters = () => {
		var filters = {};
		_.forEach(this.props.field.filters, function (value, key) {
			if (value[0] === ':') return;
			filters[key] = value;
		}, this);

		var parts = [];
		_.forEach(filters, function (val, key) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		});

		return parts.join('&');
	};

    /**
	 * Loads the search results.
	 * @param {boolean} thenPopulateValue Whether to populate the value after loading the results.
	 */
    loadSearchResults = (thenPopulateValue) => {
		const searchString = this.state.searchString;
		const filters = this.buildFilters();
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
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
		if (this.props.onHeightChange) {
			this.props.onHeightChange(this.refs.container.offsetHeight);
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
	 * @param {Object} e The event object.
	 */
    updateSearch = (e) => {
		this.setState({ searchString: e.target.value }, this.loadSearchResults);
	};

    /**
	 * Selects an item.
	 * @param {Object} item The item to select.
	 */
    selectItem = (item) => {
		const value = this.props.filter.value.concat(item.id);
		this.updateFilter({ value });
	};

    /**
	 * Removes an item from the filter.
	 * @param {Object} item The item to remove.
	 */
    removeItem = (item) => {
		const value = this.props.filter.value.filter(i => { return i !== item.id; });
		this.updateFilter({ value });
	};

    /**
	 * Updates the filter with a new value.
	 * @param {Object} value The new value.
	 */
    updateFilter = (value) => {
		this.props.onChange({ ...this.props.filter, ...value });
	};

    /**
	 * Renders a list of items.
	 * @param {Array} items The items to render.
	 * @param {boolean} selected Whether the items are selected.
	 * @returns {React.Element} The rendered items.
	 */
    renderItems = (items, selected) => {
		const itemIconHover = selected ? 'x' : 'check';

		return items.map((item, i) => {
			return (
				<PopoutList.Item
					key={`item-${i}-${item.id}`}
					icon="dash"
					iconHover={itemIconHover}
					label={item.name}
					onClick={() => {
						if (selected) this.removeItem(item);
						else this.selectItem(item);
					}}
				/>
			);
		});
	};

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
		return (
			<div ref="container">
				<FormField>
					<SegmentedControl equalWidthSegments options={INVERTED_OPTIONS} value={this.props.filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<FormInput autoFocus ref="focusTarget" value={this.state.searchString} onChange={this.updateSearch} placeholder={placeholder} />
				</FormField>
				{selectedItems.length ? (
					<PopoutList>
						<PopoutList.Heading>Selected</PopoutList.Heading>
						{this.renderItems(selectedItems, true)}
					</PopoutList>
				) : null}
				{searchResults.length ? (
					<PopoutList>
						<PopoutList.Heading style={selectedItems.length ? { marginTop: '2em' } : null}>Items</PopoutList.Heading>
						{this.renderItems(searchResults)}
					</PopoutList>
				) : null}
			</div>
		);
	}
}

export default RelationshipFilter;
