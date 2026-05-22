import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ItemsTableValue from '../ItemsTableValue.mjs';

describe('<ItemsTableValue/> tests', () => {
	it('should render <div> with default properties and css class', () => {
		const tableValue = shallow(<ItemsTableValue/>);

		expect(tableValue.find('div').type()).to.eql('div');
		expect(tableValue.find('div').length).to.eql(1);
		expect(tableValue.find('.ItemList__value').length).to.eql(1);
		expect(tableValue.find('.ItemList__value--truncate').length).to.eql(1);
		expect(tableValue.prop('children')).to.be.undefined;
	});

	it('should render <div> with explicit properties and css class', () => {
		const tableValue = shallow(
			<ItemsTableValue
				className="mock-class"
				field="mock-file-upload"
				interior
				padded
				truncate={false}
			/>
		);

		expect(tableValue.find('.ItemList__value--truncate').length).to.eql(0);
		expect(tableValue.find('.ItemList__value .ItemList__value--mock-file-upload .mock-class').length).to.eql(1);
	});

	it('should render <Link> with default properties and css class', () => {
		const actualUrl = 'http://hello.world';
		const tableValue = shallow(<ItemsTableValue to={actualUrl} />);

		expect(tableValue.name()).to.eql('Link');
		expect(tableValue.prop('href')).to.eql(actualUrl);
		expect(tableValue.find('.ItemList__value .ItemList__value--truncate').length).to.eql(1);
	});

	it('should render <Link> with explicit properties and css class', () => {
		const tableValue = shallow(
			<ItemsTableValue
				href="http://hello.world"
				field="mock-file-upload"
				interior
				padded
				truncate={false}
			/>
		);

		expect(tableValue.name()).to.eql('Link');
		expect(tableValue.find('.ItemList__value--truncate').length).to.eql(0);
		expect(tableValue.find('.ItemList__value .ItemList__value--mock-file-upload .ItemList__link--interior .ItemList__link--padded').length).to.eql(1);
	});

	it('should render <div> with child', () => {
		const actualText = 'mock-span-text';
		const tableValue = shallow(
			<ItemsTableValue>
				<span>{actualText}</span>
			</ItemsTableValue>
		);
		const child = tableValue.prop('children');

		expect(tableValue.find('div').type()).to.eql('div');
		expect(tableValue.find('div').length).to.eql(1);
		expect(tableValue.find('.ItemList__value').length).to.eql(1);
		expect(tableValue.find('.ItemList__value--truncate').length).to.eql(1);
		expect(child.type).to.eql('span');
		expect(child.props.children).to.eql(actualText);
	});
});
