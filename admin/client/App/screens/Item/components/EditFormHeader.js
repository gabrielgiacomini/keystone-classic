/**
 * @fileoverview This file contains the EditFormHeader component, which is used
 * to render the header of the edit form.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Toolbar from './Toolbar';
import ToolbarSection from './Toolbar/ToolbarSection';
import EditFormHeaderSearch from './EditFormHeaderSearch';
import { Link } from 'react-router';

import Drilldown from './Drilldown';
import { GlyphButton, ResponsiveText } from '../../../elemental';

/**
 * Renders the header of the edit form.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.data The data for the item.
 * @param {object} props.list The list object.
 * @param {function} props.toggleCreate The function to toggle the create form.
 * @returns {React.Element} The rendered component.
 */
export const EditFormHeader = React.createClass({
	displayName: 'EditFormHeader',
	propTypes: {
		data: React.PropTypes.object,
		list: React.PropTypes.object,
		toggleCreate: React.PropTypes.func,
	},
	getInitialState () {
		return {
			searchString: '',
		};
	},
	/**
	 * Toggles the create form.
	 *
	 * @param {boolean} visible Whether the create form should be visible.
	 */
	toggleCreate (visible) {
		this.props.toggleCreate(visible);
	},
	/**
	 * Handles a change in the search string.
	 *
	 * @param {Event} event The event object.
	 */
	searchStringChanged (event) {
		this.setState({
			searchString: event.target.value,
		});
	},
	/**
	 * Handles the escape key.
	 *
	 * @param {Event} event The event object.
	 */
	handleEscapeKey (event) {
		const escapeKeyCode = 27;

		if (event.which === escapeKeyCode) {
			findDOMNode(this.refs.searchField).blur();
		}
	},
	/**
	 * Renders the drilldown.
	 *
	 * @returns {React.Element} The rendered drilldown.
	 */
	renderDrilldown () {
		return (
			<ToolbarSection left>
				{this.renderDrilldownItems()}
				{this.renderSearch()}
			</ToolbarSection>
		);
	},
	/**
	 * Renders the drilldown items.
	 *
	 * @returns {React.Element} The rendered drilldown items.
	 */
	renderDrilldownItems () {
		const { data, list } = this.props;
		const items = data.drilldown ? data.drilldown.items : [];

		let backPath = `${Keystone.adminPath}/${list.path}`;
		const backStyles = { paddingLeft: 0, paddingRight: 0 };
		// Link to the list page the user came from
		if (this.props.listActivePage && this.props.listActivePage > 1) {
			backPath = `${backPath}?page=${this.props.listActivePage}`;
		}

		// return a single back button when no drilldown exists
		if (!items.length) {
			return (
				<GlyphButton
					component={Link}
					data-e2e-editform-header-back
					glyph="chevron-left"
					position="left"
					style={backStyles}
					to={backPath}
					variant="link"
				>
					{list.plural}
				</GlyphButton>
			);
		}

		// prepare the drilldown elements
		const drilldown = [];
		items.forEach((item, idx) => {
			// FIXME @jedwatson
			// we used to support relationships of type MANY where items were
			// represented as siblings inside a single list item; this got a
			// bit messy...
			item.items.forEach(link => {
				drilldown.push({
					href: link.href,
					label: link.label,
					title: item.list.singular,
				});
			});
		});

		// add the current list to the drilldown
		drilldown.push({
			href: backPath,
			label: list.plural,
		});

		return (
			<Drilldown items={drilldown} />
		);
	},
	/**
	 * Renders the search form.
	 *
	 * @returns {React.Element} The rendered search form.
	 */
	renderSearch () {
		var list = this.props.list;
		return (
			<form action={`${Keystone.adminPath}/${list.path}`} className="EditForm__header__search">
				<EditFormHeaderSearch
					value={this.state.searchString}
					onChange={this.searchStringChanged}
					onKeyUp={this.handleEscapeKey}
				/>
				{/* <GlyphField glyphColor="#999" glyph="search">
					<FormInput
						ref="searchField"
						type="search"
						name="search"
						value={this.state.searchString}
						onChange={this.searchStringChanged}
						onKeyUp={this.handleEscapeKey}
						placeholder="Search"
						style={{ paddingLeft: '2.3em' }}
					/>
				</GlyphField> */}
			</form>
		);
	},
	/**
	 * Renders the info section.
	 *
	 * @returns {React.Element} The rendered info section.
	 */
	renderInfo () {
		return (
			<ToolbarSection right>
				{this.renderCreateButton()}
			</ToolbarSection>
		);
	},
	/**
	 * Renders the create button.
	 *
	 * @returns {React.Element} The rendered create button.
	 */
	renderCreateButton () {
		const { nocreate, autocreate, singular } = this.props.list;

		if (nocreate) return null;

		let props = {};
		if (autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = () => { this.toggleCreate(true); };
		}
		return (
			<GlyphButton data-e2e-item-create-button="true" color="success" glyph="plus" position="left" {...props}>
				<ResponsiveText hiddenXS={`New ${singular}`} visibleXS="Create" />
			</GlyphButton>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<Toolbar>
				{this.renderDrilldown()}
				{this.renderInfo()}
			</Toolbar>
		);
	},
});

export default connect((state) => ({
	listActivePage: state.lists.page.index,
}))(EditFormHeader);
