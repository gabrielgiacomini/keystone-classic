import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import ItemsTableCell from '../ItemsTableCell.mjs';

describe('<ItemsTableCell/> tests', () => {
	it('should render <td> with default class and properties', () => {
		const html = renderToStaticMarkup(React.createElement(ItemsTableCell));
		expect(html).to.equal('<td class="ItemList__col"></td>');
	});

	it('should render <td> with properties p1, p2', () => {
		const element = ItemsTableCell({ p1: 'v1', p2: 'v2' });
		expect(element.type).to.equal('td');
		expect(element.props.p1).to.equal('v1');
		expect(element.props.p2).to.equal('v2');
	});

	it('should render <td> with css class mock-style', () => {
		const html = renderToStaticMarkup(React.createElement(ItemsTableCell, { className: 'mock-style' }));
		expect(html).to.equal('<td class="ItemList__col mock-style"></td>');
	});
});
