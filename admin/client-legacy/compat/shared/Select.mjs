import React from 'react';
import Select from 'react-select';

const stringifyValue = (value) => {
	return typeof value === 'string' ? value : value !== null && JSON.stringify(value) || '';
};

function patchHiddenFieldStringRefs(SelectComponent) {
	const proto = SelectComponent && SelectComponent.prototype;
	if (!proto || proto.__keystoneReact18HiddenFieldPatch) return;
	proto.renderHiddenField = function renderHiddenField(valueArray) {
		if (!this.props.name) return undefined;
		if (this.props.joinValues) {
			const value = valueArray.map((item) => stringifyValue(item[this.props.valueKey])).join(this.props.delimiter);
			return React.createElement('input', {
				disabled: this.props.disabled,
				name: this.props.name,
				type: 'hidden',
				value,
			});
		}
		return valueArray.map((item, index) => React.createElement('input', {
			disabled: this.props.disabled,
			key: 'hidden.' + index,
			name: this.props.name,
			type: 'hidden',
			value: stringifyValue(item[this.props.valueKey]),
		}));
	};
	Object.defineProperty(proto, '__keystoneReact18HiddenFieldPatch', { value: true });
}

patchHiddenFieldStringRefs(Select);

export default Select;
