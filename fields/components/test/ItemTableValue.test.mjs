import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import ItemsTableValue from '../ItemsTableValue.mjs';

describe('<ItemsTableValue/> tests', () => {
	it('should render <div> with default properties and css class', () => {
		const html = renderToStaticMarkup(React.createElement(ItemsTableValue));

		expect(html).to.equal('<div class="ItemList__value ItemList__value--truncate"></div>');
	});

	it('should render <div> with explicit properties and css class', () => {
		const html = renderToStaticMarkup(
			React.createElement(ItemsTableValue, {
				className: 'mock-class',
				field: 'mock-file-upload',
				interior: true,
				padded: true,
				truncate: false,
			})
		);

		expect(html).to.equal('<div class="ItemList__value ItemList__value--mock-file-upload mock-class"></div>');
	});

	it('should render <Link> with default properties and css class', () => {
		const actualUrl = 'http://hello.world';
		const html = renderToStaticMarkup(React.createElement(ItemsTableValue, { to: actualUrl }));

		expect(html).to.contain(`href="${actualUrl}"`);
		expect(html).to.contain('class="ItemList__value ItemList__value--truncate"');
	});

	it('should render <Link> with explicit properties and css class', () => {
		const html = renderToStaticMarkup(
			React.createElement(ItemsTableValue, {
				href: 'http://hello.world',
				field: 'mock-file-upload',
				interior: true,
				padded: true,
				truncate: false,
			})
		);

		expect(html).to.contain('href="http://hello.world"');
		expect(html).to.contain('class="ItemList__value ItemList__value--mock-file-upload ItemList__link--interior ItemList__link--padded"');
	});

	it('should render <div> with child', () => {
		const actualText = 'mock-span-text';
		const html = renderToStaticMarkup(
			React.createElement(ItemsTableValue, null, React.createElement('span', null, actualText))
		);

		expect(html).to.equal('<div class="ItemList__value ItemList__value--truncate"><span>mock-span-text</span></div>');
	});
});
