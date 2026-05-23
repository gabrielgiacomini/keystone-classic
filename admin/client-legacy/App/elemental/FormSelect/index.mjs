import { css } from 'glamor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './styles.mjs';

/**
 * A styled select element wrapped in a container with custom arrow indicators.
 * Accepts either an `options` array or `children` — providing both logs a console error.
 * Inherits `formFieldId` from context to use as the element id when no `id` prop is given.
 */
class FormSelect extends Component {
	/**
	 * Renders a container div with a native `<select>` element and decorative arrow spans.
	 * When `options` is provided the options are rendered from that array; otherwise
	 * `children` are rendered directly inside the `<select>`.
	 * @returns {React.Element} The rendered FormSelect markup.
	 */
	render () {
		const { children, id, options, ...props } = this.props;
		const { formFieldId } = this.context;

		props.className = css(
			classes.select,
			props.disabled ? classes['select--disabled'] : null
		);
		props.id = id || formFieldId;

		// Property Violation
		if (options && children) {
			console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
		}

		return (
			<div className={css(classes.container)}>
				{options ? (
					<select {...props}>{options.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
					</select>
				) : <select {...props}>{children}</select>}
				<span className={css(classes.arrows, props.disabled ? classes['arrows--disabled'] : null)}>
					<span className={css(classes.arrow, classes.arrowTop)} />
					<span className={css(classes.arrow, classes.arrowBottom)} />
				</span>
			</div>
		);
	}
};

FormSelect.contextTypes = {
	formFieldId: PropTypes.string,
};
FormSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

export default FormSelect;
