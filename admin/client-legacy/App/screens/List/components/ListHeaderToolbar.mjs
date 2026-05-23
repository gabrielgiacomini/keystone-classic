import React from 'react';
import PropTypes from 'prop-types';
import {
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	ResponsiveText,
} from '../../../elemental/index.mjs';
import theme from '../../../../theme.mjs';

import ListColumnsForm from './ListColumnsForm.mjs';
import ListDownloadForm from './ListDownloadForm.mjs';
import ListHeaderSearch from './ListHeaderSearch.mjs';

import ListFiltersAdd from './Filtering/ListFiltersAdd.mjs';

function ButtonDivider ({ style, ...props }) {
	props.style = {
		borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
		paddingLeft: '0.75em',
		...style,
	};

	return <div {...props} />;
};

function CreateButton ({ listName, onClick, ...props }) {
	return (
		<GlyphButton
			block
			color="success"
			data-list-create
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
 * The main toolbar for the list screen. Composes search, filter, column
 * selector, download, expand, and create-item controls into a single responsive
 * inline group.
 * @param {object} props - Component props.
 * @param {function(object): void} props.dispatch - Redux dispatch function passed to child controls.
 * @param {object} [props.list] - The current Keystone list descriptor.
 * @param {boolean} [props.expandIsActive] - Whether the expanded-width mode is active.
 * @param {function(): void} props.expandOnClick - Called when the expand-width button is clicked.
 * @param {boolean} [props.createIsAvailable] - Whether the create-item button should be shown.
 * @param {string} [props.createListName] - The list name used in the create button label.
 * @param {function(): void} props.createOnClick - Called when the create-item button is clicked.
 * @param {function(Event): void} props.searchHandleChange - Change handler for the search input.
 * @param {function(): void} props.searchHandleClear - Handler to clear the search input.
 * @param {function(Event): void} props.searchHandleKeyup - Keyup handler for the search input.
 * @param {string} [props.searchValue] - Current value of the search input.
 * @param {object[]} [props.filtersActive] - Currently active filters.
 * @param {object[]} [props.filtersAvailable] - All filters available to add.
 * @param {object[]} [props.columnsAvailable] - All columns available for display.
 * @param {object[]} [props.columnsActive] - Currently visible columns.
 * @returns {React.Element} The full toolbar element.
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

const tabletGrowStyles = {
	[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
		flexGrow: 1,
	},
};

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

export default ListHeaderToolbar;
