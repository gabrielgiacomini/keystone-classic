import React, { PropTypes } from 'react';
import { css } from 'glamor';
import Button from '../Button/index.mjs';
import Spinner from '../Spinner/index.mjs';
import theme from '../../../theme.mjs';

/**
 * A Button wrapper that slides a small Spinner in and out of view based on the
 * `loading` prop. Spinner colour and variant are derived from the button's own
 * `color` and `variant` props so the two always stay in sync.
 * @param {object} props - Component props.
 * @param {React.Node} props.children - Content rendered inside the button.
 * @param {boolean} [props.loading] - When true, the spinner is visible.
 * @returns {React.Element} The rendered LoadingButton element.
 */
function LoadingButton ({ children, loading, ...props }) {
	// determine the correct variant for the spinner,
	// fill is the default variant on Button
	const variant = props.variant || 'fill';

	// determine the correct color for the spinner,
	// cancel and delete alias to "danger"
	let color;
	if (props.color === 'cancel' || props.color === 'delete') color = 'danger';

	// merge all the variant/color together
	const formattedColor = variant === 'fill' && props.color !== 'default'
		? 'inverted'
		: color;

	// render the spinner if required
	const spinner = loading && (
		<Spinner
			size="small"
			color={formattedColor}
		/>
	);

	// slide the spinner in and out of view
	const spinnerStyles = {
		width: loading
			? (theme.spinner.size.small * 5 + theme.spacing.small)
			: 0,
	};

	// render everything
	return (
		<Button {...props}>
			<span className={css(classes.spinner)} style={spinnerStyles}>
				{spinner}
			</span>
			{children}
		</Button>
	);
};

LoadingButton.propTypes = {
	loading: PropTypes.bool,
};
LoadingButton.defaultProps = {
	loading: false,
};

const classes = {
	spinner: {
		display: 'inline-block',
		overflow: 'hidden',
		textAlign: 'left',
		transition: 'width 200ms ease-out',
		verticalAlign: 'middle',
	},
};

export default LoadingButton;
