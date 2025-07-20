/**
 * @fileoverview This file contains the ListManagement component, which is used
 * to render the list management controls.
 */
import React, { PropTypes } from 'react';
import {
	Button,
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	Spinner,
} from '../../../elemental';

/**
 * Renders the list management controls.
 *
 * @param {object} props The properties for the component.
 * @param {number} props.checkedItemCount The number of checked items.
 * @param {function} props.handleDelete The function to call when the delete button is clicked.
 * @param {function} props.handleSelect The function to call when a select button is clicked.
 * @param {function} props.handleToggle The function to call when the toggle button is clicked.
 * @param {boolean} props.isOpen Whether the list management controls are open.
 * @param {number} props.itemCount The number of items in the list.
 * @param {number} props.itemsPerPage The number of items per page.
 * @param {boolean} props.nodelete Whether to hide the delete button.
 * @param {boolean} props.noedit Whether to hide the edit button.
 * @param {boolean} props.selectAllItemsLoading Whether all items are being selected.
 * @returns {React.Element} The rendered component.
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
			<span style={{ color: '#666', display: 'inline-block', lineHeight: '2.4em', margin: 1 }}>
				{checkedItemCount} selected
			</span>
		</Section>
	) : null;

	// put it all together
	return (
		<div>
			<Group style={{ float: 'left', marginRight: '.75em', marginBottom: 0 }}>
				<Section>
					<Button active={isOpen} onClick={() => handleToggle(!isOpen)}>
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

module.exports = ListManagement;
