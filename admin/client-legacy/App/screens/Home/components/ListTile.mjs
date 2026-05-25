import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Link } from '../../../../router.mjs';

/**
 * Displays information about a list and lets you create a new one.
 */
const ListTile = createReactClass({
	propTypes: {
		count: PropTypes.string,
		hideCreateButton: PropTypes.bool,
		href: PropTypes.string,
		label: PropTypes.string,
		path: PropTypes.string,
		spinner: PropTypes.object,
	},
	render () {
		const opts = {
			'data-dashboard-list': true,
			'data-list-path': this.props.path,
		};
		return (
			<div className="dashboard-group__list" {...opts}>
				<span className="dashboard-group__list-inner">
					<Link
						to={this.props.href}
						className="dashboard-group__list-tile"
						data-dashboard-list-manage
						data-list-path={this.props.path}
					>
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count" data-dashboard-list-count>{this.props.spinner || this.props.count}</div>
					</Link>
					{/* If we want to create a new list, we append ?create, which opens the
						create form on the new page! */}
					{(!this.props.hideCreateButton) && (
						<Link
							to={this.props.href + '?create'}
							className="dashboard-group__list-create octicon octicon-plus"
							title="Create"
							tabIndex="-1"
						/>
					)}
				</span>
			</div>
		);
	},
});

export default ListTile;
