import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const IdColumn = createReactClass({
	displayName: 'IdColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		list: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.id;
		if (!value) return null;

		return (
			<ItemsTableValue padded interior title={value} to={Keystone.adminLegacyPath + '/' + this.props.list.path + '/' + value} field={this.props.col.type}>
				{value}
			</ItemsTableValue>
		);
	},
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

export default IdColumn;
