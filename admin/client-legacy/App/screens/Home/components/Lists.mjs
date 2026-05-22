import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { plural } from '../../../../utils/string.mjs';
import ListTile from './ListTile.mjs';

/**
 * Renders a grid of ListTile components for all lists in a dashboard section.
 */
export class Lists extends React.Component {
	/**
	 * Renders a container div with a ListTile for each list in the section.
	 * @returns {React.Element} A container div with a ListTile for each list
	 */
	render () {
		return (
			<div className="dashboard-group__lists">
				{_.map(this.props.lists, (list, key) => {
					// If an object is passed in the key is the index,
					// if an array is passed in the key is at list.key
					const listKey = list.key || key;
					const href = list.external ? list.path : `${Keystone.adminLegacyPath}/${list.path}`;
					const listData = this.props.listsData[list.path];
					const isNoCreate = listData ? listData.nocreate : false;
					return (
						<ListTile
							key={list.path}
							path={list.path}
							label={list.label}
							hideCreateButton={isNoCreate}
							href={href}
							count={plural(this.props.counts[listKey], '* Item', '* Items')}
							spinner={this.props.spinner}
						/>
					);
				})}
			</div>
		);
	}
}

Lists.propTypes = {
	counts: React.PropTypes.object.isRequired,
	lists: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.object,
	]).isRequired,
	spinner: React.PropTypes.node,
};

export default connect((state) => {
	return {
		listsData: state.lists.data,
	};
})(Lists);
