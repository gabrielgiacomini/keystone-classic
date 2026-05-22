import React from 'react';


const FooterBar = React.createClass({
	propTypes: {
		style: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			style: {},
		};
	},
	getInitialState () {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0,
		};
	},
	componentDidMount () {
		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;
		const footer = this.refs.footer;
		this.windowSize = this.getWindowSize();
		const footerStyle = window.getComputedStyle(footer);
		this.footerSize = {
			x: footer.offsetWidth,
			y: footer.offsetHeight + parseInt(footerStyle.marginTop || '0'),
		};
		window.addEventListener('scroll', this.recalcPosition, false);
		window.addEventListener('resize', this.recalcPosition, false);
		this.recalcPosition();
	},
	componentWillUnmount () {
		window.removeEventListener('scroll', this.recalcPosition, false);
		window.removeEventListener('resize', this.recalcPosition, false);
	},
	getWindowSize () {
		return {
			x: window.innerWidth,
			y: window.innerHeight,
		};
	},
	recalcPosition () {
		const wrapper = this.refs.wrapper;

		this.footerSize.x = wrapper.offsetWidth;

		let offsetTop = 0;
		let offsetEl = wrapper;

		while (offsetEl) {
			offsetTop += offsetEl.offsetTop;
			offsetEl = offsetEl.offsetParent;
		}

		const maxY = offsetTop + this.footerSize.y;
		const viewY = window.scrollY + window.innerHeight;

		const newSize = this.getWindowSize();
		const sizeChanged = (newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y);
		this.windowSize = newSize;

		const newState = {
			width: this.footerSize.x,
			height: this.footerSize.y,
		};

		if (viewY > maxY && (sizeChanged || this.mode !== 'inline')) {
			this.mode = 'inline';
			newState.top = 0;
			newState.position = 'absolute';
			this.setState(newState);
		} else if (viewY <= maxY && (sizeChanged || this.mode !== 'fixed')) {
			this.mode = 'fixed';
			newState.top = window.innerHeight - this.footerSize.y;
			newState.position = 'fixed';
			this.setState(newState);
		}
	},
	render () {
		const wrapperStyle = {
			height: this.state.height,
			marginTop: 60,
			position: 'relative',
		};
		const { children: _ch, style: _st, ...footerProps } = this.props;
		const footerStyle = Object.assign({}, this.props.style, {
			position: this.state.position,
			top: this.state.top,
			width: this.state.width,
			height: this.state.height,
		});
		return (
			<div ref="wrapper" style={wrapperStyle}>
				<div ref="footer" style={footerStyle} {...footerProps}>{this.props.children}</div>
			</div>
		);
	},
});

export default FooterBar;
