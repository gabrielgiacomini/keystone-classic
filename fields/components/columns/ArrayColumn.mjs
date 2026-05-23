import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const ArrayColumn = createReactClass({
	displayName: 'ArrayColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		return value.join(', ');
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default ArrayColumn;
