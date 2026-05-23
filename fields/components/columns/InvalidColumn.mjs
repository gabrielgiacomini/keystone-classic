import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const InvalidColumn = createReactClass({
	displayName: 'InvalidColumn',
	propTypes: {
		col: PropTypes.object,
	},
	renderValue () {
		return (
			<ItemsTableValue field={this.props.col.type}>
				(Invalid Type: {this.props.col.type})
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

export default InvalidColumn;
