/**
 * @fileoverview The list view is a paginated table of all items in the list.
 * It can show a variety of information about the individual items in columns.
 */
import React from 'react';
// import { findDOMNode } from 'react-dom'; // TODO re-implement focus when ready
import numeral from 'numeral';
import { connect } from 'react-redux';

import {
	BlankState,
	Center,
	Container,
	Glyph,
	GlyphButton,
	Pagination,
	Spinner,
} from '../../elemental';

import ListFilters from './components/Filtering/ListFilters';
import ListHeaderTitle from './components/ListHeaderTitle';
import ListHeaderToolbar from './components/ListHeaderToolbar';
import ListManagement from './components/ListManagement';

import ConfirmationDialog from '../../shared/ConfirmationDialog';
import CreateForm from '../../shared/CreateForm';
import FlashMessages from '../../shared/FlashMessages';
import ItemsTable from './components/ItemsTable/ItemsTable';
import UpdateForm from './components/UpdateForm';
import { plural as pluralize } from '../../../utils/string';
import { listsByPath } from '../../../utils/lists';
import { checkForQueryChange } from '../../../utils/queryParams';

import {
	deleteItems,
	setActiveSearch,
	setActiveSort,
	setCurrentPage,
	selectList,
	clearCachedQuery,
} from './actions';

import {
	deleteItem,
} from '../Item/actions';

const ESC_KEY_CODE = 27;

/**
 * The list view.
 *
 * @param {object} props The properties for the component.
 * @returns {React.Element} The rendered component.
 */
const ListView = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			confirmationDialog: {
				isOpen: false,
			},
			checkedItems: {},
			constrainTableWidth: true,
			manageMode: false,
			showCreateForm: false,
			showUpdateForm: false,
		};
	},
	componentWillMount () {
		// When we directly navigate to a list without coming from another client
		// side routed page before, we need to initialize the list and parse
		// possibly specified query parameters

		this.props.dispatch(selectList(this.props.params.listId));

		const isNoCreate = this.props.lists.data[this.props.params.listId].nocreate;
		const shouldOpenCreate = this.props.location.search === '?create';

		this.setState({
			showCreateForm: (shouldOpenCreate && !isNoCreate) || Keystone.createFormErrors,
		});

	},
	componentWillReceiveProps (nextProps) {
		// We've opened a new list from the client side routing, so initialize
		// again with the new list id
		const isReady = this.props.lists.ready && nextProps.lists.ready;
		if (isReady && checkForQueryChange(nextProps, this.props)) {
			this.props.dispatch(selectList(nextProps.params.listId));
		}
	},
	componentWillUnmount () {
		this.props.dispatch(clearCachedQuery());
	},

	// ==============================
	// HEADER
	// ==============================
	/**
	 * Called when a new item is created.
	 *
	 * @param {object} item The new item.
	 */
	onCreate (item) {
		// Hide the create form
		this.toggleCreateModal(false);
		// Redirect to newly created item path
		const list = this.props.currentList;
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	/**
	 * Creates a new item with autocreate.
	 */
	createAutocreate () {
		const list = this.props.currentList;
		list.createItem(null, (err, data) => {
			if (err) {
				// TODO Proper error handling
				alert('Something went wrong, please try again!');
				console.log(err);
			} else {
				this.context.router.push(`${Keystone.adminPath}/${list.path}/${data.id}`);
			}
		});
	},
	/**
	 * Updates the search string.
	 *
	 * @param {Event} e The event object.
	 */
	updateSearch (e) {
		this.props.dispatch(setActiveSearch(e.target.value));
	},
	/**
	 * Handles clearing the search.
	 */
	handleSearchClear () {
		this.props.dispatch(setActiveSearch(''));

		// TODO re-implement focus when ready
		// findDOMNode(this.refs.listSearchInput).focus();
	},
	/**
	 * Handles a key press in the search input.
	 *
	 * @param {Event} e The event object.
	 */
	handleSearchKey (e) {
		// clear on esc
		if (e.which === ESC_KEY_CODE) {
			this.handleSearchClear();
		}
	},
	/**
	 * Handles a page select.
	 *
	 * @param {number} i The page number.
	 */
	handlePageSelect (i) {
		// If the current page index is the same as the index we are intending to pass to redux, bail out.
		if (i === this.props.lists.page.index) return;
		return this.props.dispatch(setCurrentPage(i));
	},
	/**
	 * Toggles the manage mode.
	 *
	 * @param {boolean} filter Whether to filter the list.
	 */
	toggleManageMode (filter = !this.state.manageMode) {
		this.setState({
			manageMode: filter,
			checkedItems: {},
		});
	},
	/**
	 * Toggles the update modal.
	 *
	 * @param {boolean} filter Whether to filter the list.
	 */
	toggleUpdateModal (filter = !this.state.showUpdateForm) {
		this.setState({
			showUpdateForm: filter,
		});
	},
	/**
	 * Mass updates the items.
	 */
	massUpdate () {
		// TODO: Implement update multi-item
		console.log('Update ALL the things!');
	},
	/**
	 * Mass deletes the items.
	 */
	massDelete () {
		const { checkedItems } = this.state;
		const list = this.props.currentList;
		const itemCount = pluralize(checkedItems, ('* ' + list.singular.toLowerCase()), ('* ' + list.plural.toLowerCase()));
		const itemIds = Object.keys(checkedItems);

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: (
					<div>
						Are you sure you want to delete {itemCount}?
						<br />
						<br />
						This cannot be undone.
					</div>
				),
				onConfirmation: () => {
					this.props.dispatch(deleteItems(itemIds));
					this.toggleManageMode();
					this.removeConfirmationDialog();
				},
			},
		});
	},
	/**
	 * Handles a management select.
	 *
	 * @param {string} selection The selection.
	 */
	handleManagementSelect (selection) {
		if (selection === 'all') this.checkAllItems();
		if (selection === 'none') this.uncheckAllTableItems();
		if (selection === 'visible') this.checkAllTableItems();
		return false;
	},
	/**
	 * Renders the confirmation dialog.
	 *
	 * @returns {React.Element} The rendered confirmation dialog.
	 */
	renderConfirmationDialog () {
		const props = this.state.confirmationDialog;
		return (
			<ConfirmationDialog
				confirmationLabel={props.label}
				isOpen={props.isOpen}
				onCancel={this.removeConfirmationDialog}
				onConfirmation={props.onConfirmation}
			>
				{props.body}
			</ConfirmationDialog>
		);
	},
	/**
	 * Renders the management controls.
	 *
	 * @returns {React.Element} The rendered management controls.
	 */
	renderManagement () {
		const { checkedItems, manageMode, selectAllItemsLoading } = this.state;
		const { currentList } = this.props;

		return (
			<ListManagement
				checkedItemCount={Object.keys(checkedItems).length}
				handleDelete={this.massDelete}
				handleSelect={this.handleManagementSelect}
				handleToggle={() => this.toggleManageMode(!manageMode)}
				isOpen={manageMode}
				itemCount={this.props.items.count}
				itemsPerPage={this.props.lists.page.size}
				nodelete={currentList.nodelete}
				noedit={currentList.noedit}
				selectAllItemsLoading={selectAllItemsLoading}
			/>
		);
	},
	/**
	 * Renders the pagination.
	 *
	 * @returns {React.Element} The rendered pagination.
	 */
	renderPagination () {
		const items = this.props.items;
		if (this.state.manageMode || !items.count) return;

		const list = this.props.currentList;
		const currentPage = this.props.lists.page.index;
		const pageSize = this.props.lists.page.size;

		return (
			<Pagination
				currentPage={currentPage}
				onPageSelect={this.handlePageSelect}
				pageSize={pageSize}
				plural={list.plural}
				singular={list.singular}
				style={{ marginBottom: 0 }}
				total={items.count}
				limit={10}
			/>
		);
	},
	/**
	 * Renders the header.
	 *
	 * @returns {React.Element} The rendered header.
	 */
	renderHeader () {
		const items = this.props.items;
		const { autocreate, nocreate, plural, singular } = this.props.currentList;

		return (
			<Container style={{ paddingTop: '2em' }}>
				<ListHeaderTitle
					activeSort={this.props.active.sort}
					availableColumns={this.props.currentList.columns}
					handleSortSelect={this.handleSortSelect}
					title={`
						${numeral(items.count).format()}
						${pluralize(items.count, ' ' + singular, ' ' + plural)}
					`}
				/>
				<ListHeaderToolbar
					// common
					dispatch={this.props.dispatch}
					list={listsByPath[this.props.params.listId]}

					// expand
					expandIsActive={!this.state.constrainTableWidth}
					expandOnClick={this.toggleTableWidth}

					// create
					createIsAvailable={!nocreate}
					createListName={singular}
					createOnClick={autocreate
						? this.createAutocreate
						: this.openCreateModal}

					// search
					searchHandleChange={this.updateSearch}
					searchHandleClear={this.handleSearchClear}
					searchHandleKeyup={this.handleSearchKey}
					searchValue={this.props.active.search}

					// filters
					filtersActive={this.props.active.filters}
					filtersAvailable={this.props.currentList.columns.filter((col) => (
						col.field && col.field.hasFilterMethod) || col.type === 'heading'
					)}

					// columns
					columnsActive={this.props.active.columns}
					columnsAvailable={this.props.currentList.columns}
				/>
				<ListFilters
					dispatch={this.props.dispatch}
					filters={this.props.active.filters}
				/>
			</Container>
		);
	},

	// ==============================
	// TABLE
	// ==============================

	/**
	 * Checks an item in the table.
	 *
	 * @param {object} item The item to check.
	 * @param {Event} e The event object.
	 */
	checkTableItem (item, e) {
		e.preventDefault();
		const newCheckedItems = { ...this.state.checkedItems };
		const itemId = item.id;
		if (this.state.checkedItems[itemId]) {
			delete newCheckedItems[itemId];
		} else {
			newCheckedItems[itemId] = true;
		}
		this.setState({
			checkedItems: newCheckedItems,
		});
	},
	/**
	 * Checks all items in the table.
	 */
	checkAllTableItems () {
		const checkedItems = {};
		this.props.items.results.forEach(item => {
			checkedItems[item.id] = true;
		});
		this.setState({
			checkedItems: checkedItems,
		});
	},
	/**
	 * Checks all items.
	 */
	checkAllItems () {
		const checkedItems = { ...this.state.checkedItems };
		// Just in case this API call takes a long time, we'll update the select all button with
		// a spinner.
		this.setState({ selectAllItemsLoading: true });
		var self = this;
		this.props.currentList.loadItems({ expandRelationshipFilters: false, filters: {} }, function (err, data) {
			data.results.forEach(item => {
				checkedItems[item.id] = true;
			});
			self.setState({
				checkedItems: checkedItems,
				selectAllItemsLoading: false,
			});
		});
	},
	/**
	 * Unchecks all items in the table.
	 */
	uncheckAllTableItems () {
		this.setState({
			checkedItems: {},
		});
	},
	/**
	 * Deletes an item in the table.
	 *
	 * @param {object} item The item to delete.
	 * @param {Event} e The event object.
	 */
	deleteTableItem (item, e) {
		if (e.altKey) {
			this.props.dispatch(deleteItem(item.id));
			return;
		}

		e.preventDefault();

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: (
					<div>
						Are you sure you want to delete <strong>{item.name}</strong>?
						<br />
						<br />
						This cannot be undone.
					</div>
				),
				onConfirmation: () => {
					this.props.dispatch(deleteItem(item.id));
					this.removeConfirmationDialog();
				},
			},
		});
	},
	/**
	 * Removes the confirmation dialog.
	 */
	removeConfirmationDialog () {
		this.setState({
			confirmationDialog: {
				isOpen: false,
			},
		});
	},
	/**
	 * Toggles the table width.
	 */
	toggleTableWidth () {
		this.setState({
			constrainTableWidth: !this.state.constrainTableWidth,
		});
	},

	// ==============================
	// COMMON
	// ==============================

	/**
	 * Handles a sort select.
	 *
	 * @param {string} path The path of the sort.
	 * @param {boolean} inverted Whether the sort is inverted.
	 */
	handleSortSelect (path, inverted) {
		if (inverted) path = '-' + path;
		this.props.dispatch(setActiveSort(path));
	},
	/**
	 * Toggles the create modal.
	 *
	 * @param {boolean} visible Whether the modal is visible.
	 */
	toggleCreateModal (visible) {
		this.setState({
			showCreateForm: visible,
		});
	},
	/**
	 * Opens the create modal.
	 */
	openCreateModal () {
		this.toggleCreateModal(true);
	},
	/**
	 * Closes the create modal.
	 */
	closeCreateModal () {
		this.toggleCreateModal(false);
	},
	/**
	 * Shows the blank state.
	 *
	 * @returns {boolean} Whether to show the blank state.
	 */
	showBlankState () {
		return !this.props.loading
				&& !this.props.items.results.length
				&& !this.props.active.search
				&& !this.props.active.filters.length;
	},
	/**
	 * Renders the blank state.
	 *
	 * @returns {React.Element} The rendered blank state.
	 */
	renderBlankState () {
		const { currentList } = this.props;

		if (!this.showBlankState()) return null;

		// create and nav directly to the item view, or open the create modal
		const onClick = currentList.autocreate
			? this.createAutocreate
			: this.openCreateModal;

		// display the button if create allowed
		const button = !currentList.nocreate ? (
			<GlyphButton color="success" glyph="plus" position="left" onClick={onClick} data-e2e-list-create-button="no-results">
				Create {currentList.singular}
			</GlyphButton>
		) : null;

		return (
			<Container>
				{(this.props.error) ? (
					<FlashMessages
						messages={{ error: [{
							title: "There is a problem with the network, we're trying to reconnect...",
						}] }}
					/>
				) : null}
				<BlankState heading={`No ${this.props.currentList.plural.toLowerCase()} found...`} style={{ marginTop: 40 }}>
					{button}
				</BlankState>
			</Container>
		);
	},
	/**
	 * Renders the active state.
	 *
	 * @returns {React.Element} The rendered active state.
	 */
	renderActiveState () {
		if (this.showBlankState()) return null;

		const containerStyle = {
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};
		if (!this.state.constrainTableWidth) {
			containerStyle.maxWidth = '100%';
		}
		return (
			<div>
				{this.renderHeader()}
				<Container>
					<div style={{ height: 35, marginBottom: '1em', marginTop: '1em' }}>
						{this.renderManagement()}
						{this.renderPagination()}
						<span style={{ clear: 'both', display: 'table' }} />
					</div>
				</Container>
				<Container style={containerStyle}>
					{(this.props.error) ? (
						<FlashMessages
							messages={{ error: [{
								title: "There is a problem with the network, we're trying to reconnect..",
							}] }}
						/>
					) : null}
					{(this.props.loading) ? (
						<Center height="50vh">
							<Spinner />
						</Center>
					) : (
						<div>
							<ItemsTable
								activeSort={this.props.active.sort}
								checkedItems={this.state.checkedItems}
								checkTableItem={this.checkTableItem}
								columns={this.props.active.columns}
								deleteTableItem={this.deleteTableItem}
								handleSortSelect={this.handleSortSelect}
								items={this.props.items}
								list={this.props.currentList}
								manageMode={this.state.manageMode}
								rowAlert={this.props.rowAlert}
								currentPage={this.props.lists.page.index}
								pageSize={this.props.lists.page.size}
								drag={this.props.lists.drag}
								dispatch={this.props.dispatch}
							/>
							{this.renderNoSearchResults()}
						</div>
					)}
				</Container>
			</div>
		);
	},
	/**
	 * Renders the no search results message.
	 *
	 * @returns {React.Element} The rendered message.
	 */
	renderNoSearchResults () {
		if (this.props.items.results.length) return null;
		let matching = this.props.active.search;
		if (this.props.active.filters.length) {
			matching += (matching ? ' and ' : '') + pluralize(this.props.active.filters.length, '* filter', '* filters');
		}
		matching = matching ? ' found matching ' + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<Glyph
					name="search"
					size="medium"
					style={{ marginBottom: 20 }}
				/>
				<h2 style={{ color: 'inherit' }}>
					No {this.props.currentList.plural.toLowerCase()}{matching}
				</h2>
			</BlankState>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		if (!this.props.ready) {
			return (
				<Center height="50vh" data-screen-id="list">
					<Spinner />
				</Center>
			);
		}
		return (
			<div data-screen-id="list">
				{this.renderBlankState()}
				{this.renderActiveState()}
				<CreateForm
					err={Keystone.createFormErrors}
					isOpen={this.state.showCreateForm}
					list={this.props.currentList}
					onCancel={this.closeCreateModal}
					onCreate={this.onCreate}
				/>
				<UpdateForm
					isOpen={this.state.showUpdateForm}
					itemIds={Object.keys(this.state.checkedItems)}
					list={this.props.currentList}
					onCancel={() => this.toggleUpdateModal(false)}
				/>
				{this.renderConfirmationDialog()}
			</div>
		);
	},
});

module.exports = connect((state) => {
	return {
		lists: state.lists,
		loading: state.lists.loading,
		error: state.lists.error,
		currentList: state.lists.currentList,
		items: state.lists.items,
		page: state.lists.page,
		ready: state.lists.ready,
		rowAlert: state.lists.rowAlert,
		active: state.active,
	};
})(ListView);
