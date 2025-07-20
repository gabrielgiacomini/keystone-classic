/**
 * @fileoverview This file contains the Footer component, which is displayed at
 * the bottom of the page. It displays the brand, the current Keystone version,
 * and a link to the KeystoneJS website. It also displays the currently logged
 * in user and a signout link.
 */
import React from "react";
import { css } from "glamor";
import { Container } from "../../elemental";
import theme from "../../../theme";

/**
 * The global Footer, displays a link to the website and the current Keystone
 * version in use.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.appversion The version of the app.
 * @param {string} props.backUrl The URL to go back to.
 * @param {string} props.brand The brand name.
 * @param {object} props.user The currently logged in user.
 * @param {object} props.User The User model.
 * @param {string} props.version The version of KeystoneJS.
 * @returns {React.Element} The rendered component.
 */
var Footer = React.createClass({
	displayName: "Footer",
	propTypes: {
		appversion: React.PropTypes.string,
		backUrl: React.PropTypes.string,
		brand: React.PropTypes.string,
		user: React.PropTypes.object,
		User: React.PropTypes.object, // eslint-disable-line react/sort-prop-types
		version: React.PropTypes.string
	},
	/**
	 * Renders the user.
	 *
	 * @returns {React.Element} The rendered user.
	 */
	renderUser() {
		const { User, user } = this.props;
		if (!user) return null;

		return (
			<span>
				<span> Signed in as </span>
				<a
					href={`${Keystone.adminPath}/${User.path}/${user.id}`}
					tabIndex="-1"
					className={css(classes.link)}
				>
					{user.name}
				</a>
				<span>.</span>
			</span>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { backUrl, brand, appversion, version } = this.props;

		return (
			<footer className={css(classes.footer)} data-keystone-footer>
				<Container>
					<a href={backUrl} tabIndex="-1" className={css(classes.link)}>
						{brand + (appversion ? " " + appversion : "")}
					</a>
					<span> powered by </span>
					<a
						href="http://v4.keystonejs.com"
						target="_blank"
						className={css(classes.link)}
						tabIndex="-1"
					>
						KeystoneJS
					</a>
					<span> version {version}.</span>
					{this.renderUser()}
				</Container>
			</footer>
		);
	}
});

/* eslint quote-props: ["error", "as-needed"] */
/**
 * The styles for the link on hover and focus.
 */
const linkHoverAndFocus = {
	color: theme.color.gray60,
	outline: "none"
};

/**
 * The styles for the component.
 */
const classes = {
	footer: {
		boxShadow: "0 -1px 0 rgba(0, 0, 0, 0.1)",
		color: theme.color.gray40,
		fontSize: theme.font.size.small,
		paddingBottom: 30,
		paddingTop: 40,
		textAlign: "center"
	},
	link: {
		color: theme.color.gray60,

		":hover": linkHoverAndFocus,
		":focus": linkHoverAndFocus
	}
};

module.exports = Footer;
