import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classes from './styles.mjs';
import concatClassnames from '../../../utils/concatClassnames.mjs';
import InputNoedit from './noedit.mjs';

// NOTE must NOT be functional component to allow `refs`

/**
 * A form input component that renders either a standard `<input>`, a
 * `<textarea>` (when `multiline` is true), or an `<InputNoedit>` read-only
 * display (when `noedit` is true). Must be a class component so that
 * consumers can hold a `ref` and call `blur`/`focus` imperatively.
 */
class FormInput extends Component {
	/**
	 * Removes focus from the underlying input or textarea element.
	 * @returns {void}
	 */
	blur () {
		this.target.blur();
	}
	/**
	 * Moves focus to the underlying input or textarea element.
	 * @returns {void}
	 */
	focus () {
		this.target.focus();
	}
	/**
	 * Renders an `<InputNoedit>` when the `noedit` prop is set, otherwise
	 * renders a glamor-styled `<input>` or `<textarea>` depending on the
	 * `multiline` prop. Picks up `formFieldId` and `formLayout` from context
	 * to set the element's `id` and layout-specific class names.
	 * @returns {React.Element} The rendered element.
	 */
	render () {
		const {
			cssStyles,
			className,
			disabled,
			id,
			multiline,
			noedit,
			size,
			...props
		} = this.props;

		// NOTE return a different component for `noedit`
		if (noedit) return <InputNoedit {...this.props} />;

		const { formFieldId, formLayout } = this.context;

		props.id = id || formFieldId;
		props.className = css(
			classes.FormInput,
			classes['FormInput__size--' + size],
			disabled ? classes['FormInput--disabled'] : null,
			formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
			...concatClassnames(cssStyles)
		);
		if (className) {
			props.className += (' ' + className);
		}

		const setRef = (n) => (this.target = n);
		const Tag = multiline ? 'textarea' : 'input';

		return (
			<Tag
				ref={setRef}
				disabled={props.disabled}
				{...props}
			/>
		);
	}
};

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormInput.propTypes = {
	cssStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
	multiline: PropTypes.bool,
	size: PropTypes.oneOf(['default', 'small', 'large']),
	type: PropTypes.string,
};
FormInput.defaultProps = {
	size: 'default',
	type: 'text',
};
FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};

export default FormInput;
