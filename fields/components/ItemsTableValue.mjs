import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

/**
 * Renders a value cell inside the items list table, optionally as a router link.
 *
 * When `to` (or the deprecated `href`) is provided the cell is rendered using
 * React Router's `<Link>`; otherwise the element type given by `component` is
 * used (defaults to `'div'`).  BEM modifier classes are applied for the field
 * name, empty/interior/exterior/padded link states, and optional text truncation.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names.
 * @param {string|object} [props.component] - Fallback element type or React component when no
 *   link destination is given.  Defaults to `'div'`.
 * @param {boolean} [props.empty] - Applies the empty link style when true.
 * @param {boolean} [props.exterior] - Marks the link as pointing to an external destination.
 * @param {string} [props.field] - Field name used to generate a BEM modifier class.
 * @param {string} [props.href] - Deprecated. Use `to` instead.
 * @param {boolean} [props.interior] - Marks the link as pointing to an internal destination.
 * @param {boolean} [props.padded] - Applies additional padding to the link.
 * @param {string} [props.to] - React Router destination path; renders a `<Link>` when set.
 * @param {boolean} [props.truncate] - Truncates overflowing text when true.  Defaults to `true`.
 * @returns {React.Element} The rendered value cell element.
 */
function ItemsTableValue ({
	className,
	component,
	empty,
	exterior,
	field,
	href,
	interior,
	padded,
	to,
	truncate,
	...props
}) {
	// TODO remove in the next release
	if (href) {
		console.warn('ItemsTableValue: `href` will be deprecated in the next release, use `to`.');
	}
	const linkRef = to || href;
	const Component = linkRef ? Link : component;

	props.className = classnames('ItemList__value', (
		field ? `ItemList__value--${field}` : null
	), {
		'ItemList__link--empty': empty,
		'ItemList__link--exterior': linkRef && exterior,
		'ItemList__link--interior': linkRef && interior,
		'ItemList__link--padded': linkRef && padded,
		'ItemList__value--truncate': truncate,
	}, className);
	props.to = linkRef;

	return <Component {...props} />;
};

ItemsTableValue.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	empty: PropTypes.bool,
	exterior: PropTypes.bool, // FIXME this should be "external" e.g. an external link
	field: PropTypes.string,
	href: PropTypes.string, // TODO remove in next release
	interior: PropTypes.bool, // FIXME this should be "internal" e.g. an internal link
	padded: PropTypes.bool,
	to: PropTypes.string,
	truncate: PropTypes.bool,
};
ItemsTableValue.defaultProps = {
	component: 'div',
	truncate: true,
};

export default ItemsTableValue;
