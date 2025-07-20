/**
 * @fileoverview This file contains the ListHeaderToolbar component, which is
 * used to render the toolbar in the list header.
 */
import React, { PropTypes } from 'react';
import {
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	ResponsiveText,
} from '../../../elemental';
import theme from '../../../../theme';

import ListColumnsForm from './ListColumnsForm';
import ListDownloadForm from './ListDownloadForm';
import ListHeaderSearch from './ListHeaderSearch';

import ListFiltersAdd from './Filtering/ListFiltersAdd';

/**
 * Renders a button divider.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.style The style for the component.
 * @returns {React.Element} The rendered component.
 */
function ButtonDivider ({ style, ...props }) {
	props.style = {
		borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
		paddingLeft: '0.75em',
		...style,
	};

	return <div {...props} />;
};

/**
 * Renders a create button.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.listName The name of the list.
 * @param {function} props.onClick The function to call when the button is clicked.
 * @returns {React.Element} The rendered component.
 */
function CreateButton ({ listName, onClick, ...props }) {
	return (
		<GlyphButton
			block
			color="success"
			data-e2e-list-create-button="header"
			glyph="plus"
			onClick={onClick}
			position="left"
			title={`Create ${listName}`}
			{...props}
		>
			<ResponsiveText
				visibleSM="Create"
				visibleMD="Create"
				visibleLG={`Create ${listName}`}
			/>
		</GlyphButton>
	);
};

/**
 * Renders the toolbar in the list header.
 *
 * @param {object} props The properties for the component.
 * @param {function} props.dispatch The dispatch function.
 * @param {object} props.list The list object.
 * @param {boolean} props.expandIsActive Whether the expand button is active.
 * @param {function} props.expandOnClick The function to call when the expand button is clicked.
 * @param {boolean} props.createIsAvailable Whether the create button is available.
 * @param {string} props.createListName The name of the list to create.
 * @param {function} props.createOnClick The function to call when the create button is clicked.
 * @param {function} props.searchHandleChange The function to call when the search input changes.
 * @param {function} props.searchHandleClear The function to call when the clear button is clicked.
 * @param {function} props.searchHandleKeyup The function to call when a key is released.
 * @param {string} props.searchValue The value of the search input.
 * @param {array} props.filtersActive The active filters.
 * @param {array} props.filtersAvailable The available filters.
 * @param {array} props.columnsAvailable The available columns.
 * @param {array} props.columnsActive The active columns.
 * @returns {React.Element} The rendered component.
 */
function ListHeaderToolbar ({
	// common
	dispatch,
	list,

	// expand
	expandIsActive,
	expandOnClick,

	// list
	createIsAvailable,
	createListName,
	createOnClick,

	// search
	searchHandleChange,
	searchHandleClear,
	searchHandleKeyup,
	searchValue,

	// filters
	filtersActive,
	filtersAvailable,

	// columns
	columnsAvailable,
	columnsActive,

	...props
}) {
	return (
		<Group block cssStyles={classes.wrapper}>
			<Section grow cssStyles={classes.search}>
				<ListHeaderSearch
					handleChange={searchHandleChange}
					handleClear={searchHandleClear}
					handleKeyup={searchHandleKeyup}
					value={searchValue}
				/>
			</Section>
			<Section grow cssStyles={classes.buttons}>
				<Group block>
					<Section cssStyles={classes.filter}>
						<ListFiltersAdd
							dispatch={dispatch}
							activeFilters={filtersActive}
							availableFilters={filtersAvailable}
						/>
					</Section>
					<Section cssStyles={classes.columns}>
						<ListColumnsForm
							availableColumns={columnsAvailable}
							activeColumns={columnsActive}
							dispatch={dispatch}
						/>
					</Section>
					<Section cssStyles={classes.download}>
						<ListDownloadForm
							activeColumns={columnsActive}
							dispatch={dispatch}
							list={list}
						/>
					</Section>
					<Section cssStyles={classes.expand}>
						<ButtonDivider>
							<GlyphButton
								active={expandIsActive}
								glyph="mirror"
								onClick={expandOnClick}
								title="Expand table width"
							/>
						</ButtonDivider>
					</Section>
					{createIsAvailable && <Section cssStyles={classes.create}>
						<ButtonDivider>
							<CreateButton
								listName={createListName}
								onClick={createOnClick}
							/>
						</ButtonDivider>
					</Section>}
				</Group>
			</Section>
		</Group>
	);
};

ListHeaderToolbar.propTypes = {
	columnsActive: PropTypes.array,
	columnsAvailable: PropTypes.array,
	createIsAvailable: PropTypes.bool,
	createListName: PropTypes.string,
	createOnClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	expandIsActive: PropTypes.bool,
	expandOnClick: PropTypes.func.isRequired,
	filtersActive: PropTypes.array,
	filtersAvailable: PropTypes.array,
	list: PropTypes.object,
	searchHandleChange: PropTypes.func.isRequired,
	searchHandleClear: PropTypes.func.isRequired,
	searchHandleKeyup: PropTypes.func.isRequired,
	searchValue: PropTypes.string,
};

/**
 * The styles for the tablet grow.
 */
const tabletGrowStyles = {
	[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
		flexGrow: 1,
	},
};

/**
 * The styles for the component.
 */
const classes = {
	// main wrapper
	wrapper: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			flexWrap: 'wrap',
		},
	},

	// button wrapper
	buttons: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
		},
	},

	// cols
	expand: {
		[`@media (max-width: ${theme.breakpoint.desktopMax})`]: {
			display: 'none',
		},
	},
	filter: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
			flexGrow: 1,
		},
	},
	columns: tabletGrowStyles,
	create: tabletGrowStyles,
	download: tabletGrowStyles,
	search: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			marginBottom: '0.75em',
			minWidth: '100%',
		},
	},
};

module.exports = ListHeaderToolbar;
