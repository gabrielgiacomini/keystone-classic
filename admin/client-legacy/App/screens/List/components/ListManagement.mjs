import React, { PropTypes } from 'react';
import {
	Button,
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	Spinner,
} from '../../../elemental/index.mjs';

/**
 * Renders the management toolbar for the list screen. Provides a Manage toggle
 * button, item-selection controls (all, page, none), a delete action, and a
 * selected-count indicator. Returns null when there are no items or when both
 * edit and delete are disabled on the list.
 * @param {object} props - Component props.
 * @param {number} [props.checkedItemCount] - Number of currently checked/selected items.
 * @param {function(): void} props.handleDelete - Called when the delete button is clicked.
 * @param {function(string): void} props.handleSelect - Called with a selection mode string ('all', 'visible', or 'none').
 * @param {function(boolean): void} props.handleToggle - Called with a boolean to open or close manage mode.
 * @param {boolean} [props.isOpen] - Whether manage mode is currently active.
 * @param {number} [props.itemCount] - Total number of items in the list.
 * @param {number} [props.itemsPerPage] - Number of items shown per page.
 * @param {boolean} [props.nodelete] - When true, the delete action is not available.
 * @param {boolean} [props.noedit] - When true, edit actions are not available.
 * @param {boolean} [props.selectAllItemsLoading] - Whether a select-all request is in progress.
 * @returns {React.Element|null} The management toolbar, or null when not applicable.
 */
function ListManagement ({
	checkedItemCount,
	handleDelete,
	handleSelect,
	handleToggle,
	isOpen,
	itemCount,
	itemsPerPage,
	nodelete,
	noedit,
	selectAllItemsLoading,
	...props
}) {
	// do not render if there's no results
	// or if edit/delete unavailable on the list
	if (!itemCount || (nodelete && noedit)) return null;

	const buttonNoteStyles = { color: '#999', fontWeight: 'normal' };

	// delete button
	const actionButtons = isOpen && (
		<Section>
			<GlyphButton
				color="cancel"
				data-list-management-delete
				disabled={!checkedItemCount}
				glyph="trashcan"
				onClick={handleDelete}
				position="left"
				variant="link"
				alt="delete">
				Delete
			</GlyphButton>
		</Section>
	);

	// select buttons
	const allVisibleButtonIsActive = checkedItemCount === itemCount;
	const pageVisibleButtonIsActive = checkedItemCount === itemsPerPage;
	const noneButtonIsActive = !checkedItemCount;
	const selectAllButton = itemCount > itemsPerPage && (
		<Section>
			<Button
				active={allVisibleButtonIsActive}
				onClick={() => handleSelect('all')}
				title="Select all rows (including those not visible)">
				{selectAllItemsLoading ? <Spinner/> : 'All'} <small style={buttonNoteStyles}>({itemCount})</small>
			</Button>
		</Section>
	);

	const selectButtons = isOpen ? (
		<Section>
			<Group contiguous>
				{selectAllButton}
				<Section>
					<Button active={pageVisibleButtonIsActive} onClick={() => handleSelect('visible')} title="Select all rows">
						{itemCount > itemsPerPage ? 'Page ' : 'All '}
						<small style={buttonNoteStyles}>({itemCount > itemsPerPage ? itemsPerPage : itemCount})</small>
					</Button>
				</Section>
				<Section>
					<Button active={noneButtonIsActive} onClick={() => handleSelect('none')} title="Deselect all rows">None</Button>
				</Section>
			</Group>
		</Section>
	) : null;

	// selected count text
	const selectedCountText = isOpen ? (
		<Section>
			<span
				data-list-management-selected-count
				style={{ color: '#666', display: 'inline-block', lineHeight: '2.4em', margin: 1 }}
			>
				{checkedItemCount} selected
			</span>
		</Section>
	) : null;

	// put it all together
	return (
		<div data-list-management>
			<Group style={{ float: 'left', marginRight: '.75em', marginBottom: 0 }}>
				<Section>
					<Button active={isOpen} data-list-management-toggle onClick={() => handleToggle(!isOpen)}>
						Manage
					</Button>
				</Section>
				{selectButtons}
				{actionButtons}
				{selectedCountText}
			</Group>
		</div>
	);
};

ListManagement.propTypes = {
	checkedItems: PropTypes.number,
	handleDelete: PropTypes.func.isRequired,
	handleSelect: PropTypes.func.isRequired,
	handleToggle: PropTypes.func.isRequired,
	isOpen: PropTypes.bool,
	itemCount: PropTypes.number,
	itemsPerPage: PropTypes.number,
	nodelete: PropTypes.bool,
	noedit: PropTypes.bool,
	selectAllItemsLoading: PropTypes.bool,
};

export default ListManagement;
