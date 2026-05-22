import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const IdColumn = React.createClass({
	displayName: 'IdColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		list: React.PropTypes.object,
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
