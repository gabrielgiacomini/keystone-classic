import React from 'react';
import Button from '../../admin/client-legacy/App/elemental/Button/index.mjs';

// NOTE marginBottom of 1px stops things jumping around
// TODO find out why this is necessary

/**
 * A link-style button used as a toggle label for collapsed field sections.
 *
 * Applies a 1 px bottom margin (prevents layout jump on expand/collapse) and
 * removes horizontal padding so the label aligns with the field content.
 * All extra props are forwarded to the underlying Elemental {@link Button}.
 * @param {object} props - Component props.
 * @param {object} [props.style] - Additional inline styles merged on top of the defaults.
 * @returns {React.Element} An Elemental Button rendered as a link variant.
 */
function CollapsedFieldLabel ({ style, ...props }) {
	const __style__ = {
		marginBottom: 1,
		paddingLeft: 0,
		paddingRight: 0,
		...style,
	};

	return React.createElement(Button, { variant: 'link', style: __style__, ...props });
};

export default CollapsedFieldLabel;
