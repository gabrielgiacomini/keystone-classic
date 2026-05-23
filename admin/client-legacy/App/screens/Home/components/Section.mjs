import React from 'react';
import PropTypes from 'prop-types';
import getRelatedIconClass from '../utils/getRelatedIconClass.mjs';

/**
 * Renders a dashboard section with a heading icon, label, and child list tiles.
 */
class Section extends React.Component {
	/**
	 * Renders the section heading with icon and label, wrapping the child list tiles.
	 * @returns {React.Element} A dashboard group div with a heading and children
	 */
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
	children: PropTypes.element.isRequired,
	icon: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
};

export default Section;
