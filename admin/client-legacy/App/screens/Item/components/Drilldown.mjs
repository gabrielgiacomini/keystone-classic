import { css } from 'glamor';
import React, { PropTypes } from 'react';
import DrilldownItem from './DrilldownItem.mjs';

/**
 * Renders an inline horizontal breadcrumb-style list of drilldown navigation links
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name to apply to the list
 * @param {Array} props.items Array of navigation items, each with href and label
 * @returns {React.Element} An unordered list of DrilldownItem components
 */
function Drilldown ({ className, items, ...props }) {
	props.className = css(classes.drilldown, className);

	return (
		<ul {...props}>
			{items.map((item, idx) => (
				<DrilldownItem
					href={item.href}
					key={idx}
					label={item.label}
					separate={idx < items.length - 1}
				/>
			))}
		</ul>
	);
};

Drilldown.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			href: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			separate: PropTypes.bool, // FIXME verb; could be better
		})
	).isRequired,
};

const classes = {
	drilldown: {
		display: 'inline-block',
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
};

export default Drilldown;
