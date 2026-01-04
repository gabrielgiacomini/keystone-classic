import PropTypes from 'prop-types';
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

class IdColumn extends React.Component {
    static displayName = 'IdColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
		list: PropTypes.object,
	};

    renderValue = () => {
		const value = this.props.data.id;
		if (!value) return null;

		return (
			<ItemsTableValue padded interior title={value} to={Keystone.adminPath + '/' + this.props.list.path + '/' + value} field={this.props.col.type}>
				{value}
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

export default IdColumn;
