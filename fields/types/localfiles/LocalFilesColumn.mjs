/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */
import React from 'react';

function LocalFilesColumn({ col, data }) {
	const value = data.fields[col.path];
	const renderedValue = value.length === 0
		? ''
		: value.length + ' ' + (value.length > 1 ? 'Files' : 'File');

	return React.createElement(
		'td',
		{ className: 'ItemList__col' },
		React.createElement('div', { className: 'ItemList__value ItemList__value--local-files' }, renderedValue),
	);
}

export default LocalFilesColumn;
