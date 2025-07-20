/**
 * @fileoverview This file contains the Lists component, which is used to
 * render a list of lists on the home screen.
 */
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { plural } from '../../../../utils/string';
import ListTile from './ListTile';

/**
 * Renders a list of lists.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.counts The counts for each list.
 * @param {array|object} props.lists The lists to render.
 * @param {React.Element} props.spinner The spinner to display while loading.
 * @returns {React.Element} The rendered component.
 */
export class Lists extends React.Component {
	render () {
		return (
			<div className="dashboard-group__lists">
				{_.map(this.props.lists, (list, key) => {
					// If an object is passed in the key is the index,
					// if an array is passed in the key is at list.key
					const listKey = list.key || key;
					const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
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
