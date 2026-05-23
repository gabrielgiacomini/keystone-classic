import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
	Expose internal ref to parent
	=============================

	Field.create({
		triggerFileBrowser () {
			this.refs.fileInput.clickDomNode();
		},
		render () {
			<HiddenFileInput ref="fileInput" />
		}
	});
*/

/**
 * An off-screen file input whose DOM node is exposed to parent components via
 * the imperative helper methods {@link HiddenFileInput#clickDomNode},
 * {@link HiddenFileInput#clearValue}, and {@link HiddenFileInput#hasValue}.
 *
 * The input is positioned at `left: -9999` so it is invisible but still
 * functional; `tabIndex="-1"` removes it from the tab order.
 * @example
 * // Inside a field component:
 * triggerFileBrowser () {
 *   this.refs.fileInput.clickDomNode();
 * }
 * render () {
 *   return <HiddenFileInput ref="fileInput" onChange={this.handleChange} />;
 * }
 */
class HiddenFileInput extends Component {
	/**
	 * Creates a new HiddenFileInput instance and binds instance methods.
	 */
	constructor () {
		super();

		this.clearValue = this.clearValue.bind(this);
		this.clickDomNode = this.clickDomNode.bind(this);
		this.hasValue = this.hasValue.bind(this);
	}
	/**
	 * Resets the underlying file input value so the same file can be selected again.
	 * @returns {void}
	 */
	clearValue () {
		this.target.value = '';
	}
	/**
	 * Programmatically clicks the hidden file input to open the file picker.
	 * @returns {void}
	 */
	clickDomNode () {
		this.target.click();
	}
	/**
	 * Returns whether the file input currently holds a selected value.
	 * @returns {boolean} `true` if a file has been selected, `false` otherwise.
	 */
	hasValue () {
		return !!this.target.value;
	}
	/**
	 * Renders the off-screen `<input type="file">` element.
	 * @returns {React.Element} A hidden file input positioned off-screen.
	 */
	render () {
		const { style, ...props } = this.props;
		const setRef = (n) => (this.target = n);
		const styles = {
			left: -9999,
			position: 'absolute',
			...style,
		};

		return (
			<input
				{...props}
				style={styles}
				ref={setRef}
				tabIndex="-1"
				type="file"
			/>
		);
	}
};

HiddenFileInput.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default HiddenFileInput;
