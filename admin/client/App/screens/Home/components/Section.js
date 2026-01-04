import PropTypes from 'prop-types';
import React from 'react';
import getRelatedIconClass from '../utils/getRelatedIconClass';

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
	children: PropTypes.element.isRequired,
	icon: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
};

export default Section;
