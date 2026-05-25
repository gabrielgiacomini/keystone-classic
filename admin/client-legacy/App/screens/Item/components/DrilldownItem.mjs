import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../../router.mjs';
import { Button, Glyph } from '../../../elemental/index.mjs';

import theme from '../../../../theme.mjs';

/**
 * Renders a single drilldown navigation link, optionally followed by a separator glyph
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name
 * @param {string} props.href The URL the link navigates to
 * @param {string} props.label The visible link text
 * @param {boolean} [props.separate] When true, renders a separator after the link
 * @param {React.Element|string} [props.separator] Custom separator content; defaults to a chevron-right glyph
 * @param {object} [props.style] Inline styles forwarded to the Button component
 * @returns {React.Element} A list item containing a link button and an optional separator
 */
function DrilldownItem ({ className, href, label, separate, separator, style, ...props }) {
	props.className = css(classes.item, className);

	// remove horizontal padding
	const styles = {
		paddingLeft: 0,
		paddingRight: 0,
		...style,
	};

	return (
		<li {...props}>
			<Button
				component={Link}
				style={styles}
				to={href}
				variant="link"
			>
				{label}
			</Button>
			{separate && (
				<span className={css(classes.separator)}>
					{separator}
				</span>
			)}
		</li>
	);
};

DrilldownItem.propTypes = {
	href: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	separate: PropTypes.bool, // FIXME verb; could be better
	separator: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
};
DrilldownItem.defaultProps = {
	separator: <Glyph name="chevron-right" />,
};

const classes = {
	item: {
		display: 'inline-block',
		margin: 0,
		padding: 0,
		verticalAlign: 'middle',
	},
	separator: {
		color: theme.color.gray40,
		marginLeft: '0.5em',
		marginRight: '0.5em',
	},
};

export default DrilldownItem;
