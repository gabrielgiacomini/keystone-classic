import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ItemsTableCell from '../ItemsTableCell.mjs';

describe('<ItemsTableCell/> tests', () => {
	it('should render <td> with default class and properties', () => {
		const cell = shallow(<ItemsTableCell/>);
		expect(cell.find('td').type()).to.eql('td');
		expect(cell.find('td').length).to.eql(1);
		expect(cell.find('.ItemList__col').length).to.eql(1);
		expect(cell.prop('className')).to.eql('ItemList__col ');
	});

	it('should render <td> with properties p1, p2', () => {
		const cell = shallow(<ItemsTableCell p1="v1" p2="v2"/>);
		expect(cell.prop('p1')).to.eql('v1');
		expect(cell.prop('p2')).to.eql('v2');
	});

	it('should render <td> with css class mock-style', () => {
		const cell = shallow(<ItemsTableCell className="mock-style"/>);
		expect(cell.find('.mock-style').length).to.eql(1);
		expect(cell.find('.ItemList__col').length).to.eql(1);
	});
});
