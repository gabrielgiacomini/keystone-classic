/**
 * @fileoverview This file contains the Section component, which is used to
 * render a section on the home screen.
 */
import React from 'react';
import getRelatedIconClass from '../utils/getRelatedIconClass';

/**
 * Renders a section on the home screen.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.icon The icon to display.
 * @param {string} props.id The id of the section.
 * @param {string} props.label The label for the section.
 * @returns {React.Element} The rendered component.
 */
class Section extends React.Component {
	render () {
		const iconClass = this.props.icon || getRelatedIconClass(this.props.id);
		return (
			<div className="dashboard-group" data-section-label={this.props.label}>
				<div className="dashboard-group__heading">
					<span className={`dashboard-group__heading-icon ${iconClass}`} />
					{this.props.label}
				</div>
				{this.props.children}
			</div>
		);
	}
}

Section.propTypes = {
	children: React.PropTypes.element.isRequired,
	icon: React.PropTypes.string,
	id: React.PropTypes.string,
	label: React.PropTypes.string.isRequired,
};

export default Section;
