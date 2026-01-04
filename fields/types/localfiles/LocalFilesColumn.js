/**
 * @fileoverview
 * This field type is deprecated and will be removed in a future version.
 *
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */
import React from 'react';

class LocalFilesColumn extends React.Component {
    renderValue = () => {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length === 0) return '';
		var fileOrFiles = (value.length > 1) ? 'Files' : 'File';
		return value.length + ' ' + fileOrFiles;
	};

    render() {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--local-files">{this.renderValue()}</div>
			</td>
		);
	}
}

export default LocalFilesColumn;
