import PropTypes from 'prop-types';
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

class ArrayColumn extends React.Component {
    static displayName = 'ArrayColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    renderValue = () => {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		return value.join(', ');
	};

    render() {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
}

export default ArrayColumn;
