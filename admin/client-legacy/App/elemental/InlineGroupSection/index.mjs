import { css } from 'glamor';
import React, { cloneElement, PropTypes } from 'react';
import classes from './styles.mjs';

// NOTE: Inline Group Section accepts a single child

/**
 * A layout section used inside an InlineGroup that accepts a single child
 * element. When `contiguous` is true, positional and state styles are applied
 * directly to the child via `cloneElement`; otherwise the child is wrapped in
 * a `<div>` with the appropriate glamor class names.
 * @param {object} props - Component props.
 * @param {boolean} [props.active] - Whether the section is in an active state (buttons only).
 * @param {Array|object} [props.cssStyles] - Additional glamor styles forwarded to the child or wrapper.
 * @param {React.Element} props.children - The single child element to render.
 * @param {string} [props.className] - Additional CSS class name (passed through via rest props).
 * @param {boolean} [props.contiguous] - When true, styles are applied directly to the child element.
 * @param {boolean} [props.grow] - When true, the section expands to fill available space.
 * @param {'first'|'last'|'middle'|'only'} [props.position] - Position of this section within the group.
 * @returns {React.Element} The rendered section element.
 */
function InlineGroupSection ({
	active,
	cssStyles,
	children,
	className,
	contiguous,
	grow,
	position,
	...props
}) {
	// evaluate position
	const separate = position === 'last' || position === 'middle';

	// A `contiguous` section must manipulate it's child directly
	// A separate (default) section just wraps the child
	return contiguous ? cloneElement(children, {
		cssStyles: [
			classes.contiguous,
			classes['contiguous__' + position],
			active ? classes.active : null,
			grow ? classes.grow : null,
			cssStyles,
		],
		...props,
	}) : (
		<div className={css(
			!!grow && classes.grow,
			!!separate && classes.separate,
			cssStyles
		)} {...props}>
			{children}
		</div>
	);
};

InlineGroupSection.propTypes = {
	active: PropTypes.bool, // buttons only
	children: PropTypes.element.isRequired,
	contiguous: PropTypes.bool,
	grow: PropTypes.bool,
	position: PropTypes.oneOf(['first', 'last', 'middle', 'only']),
};

export default InlineGroupSection;
