import PropTypes from 'prop-types';
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

class InvalidColumn extends React.Component {
    static displayName = 'InvalidColumn';

    static propTypes = {
		col: PropTypes.object,
	};

    renderValue = () => {
		return (
			<ItemsTableValue field={this.props.col.type}>
				(Invalid Type: {this.props.col.type})
			</ItemsTableValue>
		);

	};

    render() {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	}
}

export default InvalidColumn;
