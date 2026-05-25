import { css } from '../../admin/client-legacy/utils/glamor.mjs';
import React from 'react';
import Spinner from '../../admin/client-legacy/App/elemental/Spinner/index.mjs';
import theme from '../../admin/client-legacy/theme.mjs';

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

const ICON_MAP = {
	loading: '',
	remove: 'mega-octicon octicon-trashcan',
	upload: 'mega-octicon octicon-cloud-upload',
};

/**
 * Renders a styled thumbnail container with an optional interactive overlay mask.
 *
 * The container is rendered as the element type given by `component` (defaults
 * to `'span'`).  When `component` is `'a'`, hover and focus border/outline
 * styles are applied via Glamor.
 *
 * The `mask` prop overlays a semi-transparent dark panel on top of the image.
 * `'loading'` shows an inverted spinner; `'remove'` and `'upload'` show the
 * corresponding Octicon icon.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - The thumbnail image or content.
 * @param {string} [props.className] - Additional Glamor/CSS class names.
 * @param {string|object} [props.component] - Element type or React component used to render the
 *   wrapper.  Defaults to `'span'`; pass `'a'` to activate hover and focus styles.
 * @param {'loading'|'remove'|'upload'} [props.mask] - Overlay mask variant to display.
 * @returns {React.Element} The thumbnail wrapper element with optional mask overlay.
 */
function ImageThumbnail ({ children, className, component, mask, ...props }) {
	const maskUI = mask
		? React.createElement(
				'div',
				{ className: css(classes.mask) + ` ${ICON_MAP[mask]}` },
				mask === 'loading' ? React.createElement(Spinner, { color: 'inverted' }) : null
		  )
		: null;

	// apply hover and focus styles only when using an anchor
	props.className = css(
		classes.base,
		component === 'a' ? classes.anchor : null,
		className
	);

	// append the mask UI to children
	props.children = [].concat(children, [maskUI]);

	return React.createElement(component, props);
};

ImageThumbnail.defaultProps = {
	component: 'span',
};

/* eslint quote-props: ["error", "as-needed"] */
const GUTTER_WIDTH = 4;
const hoverAndFocusStyles = {
	borderColor: theme.input.border.color.focus,
	outline: 'none',
};
const classes = {
	base: {
		backgroundColor: 'white',
		borderRadius: theme.borderRadius.default,
		border: `1px solid ${theme.input.border.color.default}`,
		display: 'inline-block',
		height: 'auto',
		lineHeight: '1',
		maxWidth: '100%',
		padding: GUTTER_WIDTH,
		position: 'relative',
	},
	anchor: {
		':hover': hoverAndFocusStyles,
		':focus': {
			...hoverAndFocusStyles,
			boxShadow: theme.input.boxShadowFocus,
		},
	},

	// mask
	mask: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		bottom: GUTTER_WIDTH,
		color: 'white',
		display: 'flex',
		justifyContent: 'center',
		left: GUTTER_WIDTH,
		lineHeight: 90,
		overflow: 'hidden',
		position: 'absolute',
		right: GUTTER_WIDTH,
		textAlign: 'center',
		top: GUTTER_WIDTH,
	},
};

export default ImageThumbnail;
