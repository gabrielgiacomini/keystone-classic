import React, { Component } from 'react';
import PropTypes from 'prop-types';
import theme from '../../../theme.mjs';

// Using window.innerWidth and state instead of CSS media breakpoints
// because we want to render null rather than an empty span. Allowing for
// CSS pseudo classes like :only-child to behave as expected.

// Return true if window + document
const canUseDOM = !!(
	typeof window !== 'undefined'
	&& window.document
	&& window.document.createElement
);

/**
 * Renders a text string appropriate for the current viewport width by
 * listening to window resize events and selecting from the visibleXS,
 * visibleSM, visibleMD, or visibleLG prop (with hiddenXS/SM/MD/LG as
 * fallbacks). Renders null when no matching text is available, so CSS
 * pseudo-selectors such as :only-child work as expected.
 */
class ResponsiveText extends Component {
	/**
	 * Initialises component state with the current window width and binds the
	 * resize handler.
	 * @returns {void}
	 */
	constructor () {
		super();
		this.handleResize = this.handleResize.bind(this);
		this.state = {
			windowWidth: canUseDOM ? window.innerWidth : 0,
		};
	}

	/**
	 * Attaches a resize event listener to the window and fires an initial
	 * resize to sync state with the actual viewport width. Does nothing in
	 * non-DOM environments (e.g. server-side rendering).
	 * @returns {void}
	 */
	componentDidMount () {
		if (canUseDOM) {
			window.addEventListener('resize', this.handleResize);
			this.handleResize();
		}
	}

	/**
	 * Removes the resize event listener added in componentDidMount to prevent
	 * memory leaks after the component is removed from the DOM.
	 * @returns {void}
	 */
	componentWillUnmount () {
		if (canUseDOM) {
			window.removeEventListener('resize', this.handleResize);
		}
	}

	/**
	 * Updates component state with the current window.innerWidth so that the
	 * rendered text reflects the latest viewport size.
	 * @returns {void}
	 */
	handleResize () {
		this.setState({
			windowWidth: canUseDOM ? window.innerWidth : 0,
		});
	}

	/**
	 * Selects the appropriate text string for the current viewport width and
	 * renders it inside the configured wrapper element. Returns null when no
	 * text prop resolves for the active breakpoint.
	 * @returns {React.ReactElement|null} The wrapper element containing the
	 *   selected text, or null if no text is available for the current
	 *   viewport width.
	 */
	render () {
		const {
			component: Component,
			hiddenLG,
			hiddenMD,
			hiddenSM,
			hiddenXS,
			visibleLG,
			visibleMD,
			visibleSM,
			visibleXS,
			...props
		} = this.props;
		const { windowWidth } = this.state;

		let text;

		// set text value from breakpoint; attempt XS --> LG
		if (windowWidth < theme.breakpointNumeric.mobile) {
			text = visibleXS || hiddenSM || hiddenMD || hiddenLG;
		} else if (windowWidth < theme.breakpointNumeric.tabletPortrait) {
			text = hiddenXS || visibleSM || hiddenMD || hiddenLG;
		} else if (windowWidth < theme.breakpointNumeric.tabletLandscape) {
			text = hiddenXS || hiddenSM || visibleMD || hiddenLG;
		} else {
			text = hiddenXS || hiddenSM || hiddenMD || visibleLG;
		}

		return text ? <Component {...props}>{text}</Component> : null;
	}
};

ResponsiveText.propTypes = {
	hiddenLG: PropTypes.string,
	hiddenMD: PropTypes.string,
	hiddenSM: PropTypes.string,
	hiddenXS: PropTypes.string,
	visibleLG: PropTypes.string,
	visibleMD: PropTypes.string,
	visibleSM: PropTypes.string,
	visibleXS: PropTypes.string,
};
ResponsiveText.defaultProps = {
	component: 'span',
};

export default ResponsiveText;
