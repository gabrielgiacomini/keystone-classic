import { css } from 'glamor';
import React, { cloneElement, Children, PropTypes } from 'react';

// NOTE: only accepts InlineGroupSection as a single child

/**
 * Renders a group of child elements laid out inline (or as a block) using
 * flexbox. Each child is cloned with a `position` prop ('only', 'first',
 * 'last', or 'middle') and a `contiguous` prop so that child components can
 * adjust their own styling based on their position within the group.
 * @param {object} props - Component props.
 * @param {boolean} [props.block] - When true, the group uses `display: flex`
 *   instead of the default `display: inline-flex`.
 * @param {React.Node} [props.children] - Child elements to render inside the group.
 * @param {string} [props.className] - Additional CSS class name appended to
 *   the glamor-generated class.
 * @param {string|React.ComponentType} [props.component] - HTML tag or React
 *   component used as the container element.
 * @param {boolean} [props.contiguous] - Passed through to every child element
 *   so children can render contiguous (borderless) styles.
 * @param {object} [props.cssStyles] - A glamor CSS-rule object applied to the
 *   container element.
 * @returns {React.Element} The rendered container element with cloned children.
 */
function InlineGroup ({
	cssStyles,
	block,
	children,
	className,
	component: Component,
	contiguous,
	...props
}) {
	// prepare group className
	props.className = css(
		classes.group,
		!!block && classes.block,
		cssStyles
	);
	if (className) {
		props.className += (' ' + className);
	}

	// convert children to an array and filter out falsey values
	const buttons = Children.toArray(children).filter(i => i);

	// normalize the count
	const count = buttons.length - 1;

	// clone children and apply classNames that glamor can target
	props.children = buttons.map((c, idx) => {
		if (!c) return null;

		const isOnlyChild = !count;
		const isFirstChild = !isOnlyChild && idx === 0;
		const isLastChild = !isOnlyChild && idx === count;
		const isMiddleChild = !isOnlyChild && !isFirstChild && !isLastChild;

		let position;
		if (isOnlyChild) position = 'only';
		if (isFirstChild) position = 'first';
		if (isLastChild) position = 'last';
		if (isMiddleChild) position = 'middle';

		return cloneElement(c, {
			contiguous: contiguous,
			position,
		});
	});

	return <Component {...props} />;
};

InlineGroup.propTypes = {
	block: PropTypes.bool,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	contiguous: PropTypes.bool,
	cssStyles: PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	}),
};
InlineGroup.defaultProps = {
	component: 'div',
};

const classes = {
	group: {
		display: 'inline-flex',
	},
	block: {
		display: 'flex',
	},
};

export default InlineGroup;
