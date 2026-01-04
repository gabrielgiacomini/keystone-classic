import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createRoot } from 'react-dom/client';
import PassContext from '../PassContext';


export default class Portal extends Component {
	constructor () {
		super();
		this.portalElement = null;
		this.root = null;
	}
	componentDidMount () {
		const p = document.createElement('div');
		document.body.appendChild(p);
		this.portalElement = p;
		this.root = createRoot(p);
		this.componentDidUpdate();
	}
	componentDidUpdate () {
		const duration = 200;
		const styles = `
				.fade-enter { opacity: 0.01; }
				.fade-enter-active { opacity: 1; transition: opacity ${duration}ms; }
				.fade-exit { opacity: 1; }
				.fade-exit-active { opacity: 0.01; transition: opacity ${duration}ms; }
		`;
		const { children, className, ...rest } = this.props;
		if (this.root) {
			this.root.render(
				<PassContext context={this.context}>
					<div className={className}>
						<style>{styles}</style>
						<TransitionGroup component="div" {...rest}>
							{Children.map(children, (child, index) => 
								child ? (
									<CSSTransition
										key={child.key || index}
										classNames="fade"
										timeout={duration}
									>
										{child}
									</CSSTransition>
								) : null
							)}
						</TransitionGroup>
					</div>
				</PassContext>
			);
		}
	}
	componentWillUnmount () {
		if (this.root) {
			this.root.unmount();
		}
		document.body.removeChild(this.portalElement);
	}
	render () {
		return null;
	}
}

Portal.contextTypes = {
	onClose: PropTypes.func,
};
