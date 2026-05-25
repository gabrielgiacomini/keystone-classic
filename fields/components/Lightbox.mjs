import React from 'react';

const backdropStyle = {
	alignItems: 'center',
	backgroundColor: 'rgba(0, 0, 0, 0.9)',
	bottom: 0,
	display: 'flex',
	justifyContent: 'center',
	left: 0,
	padding: 40,
	position: 'fixed',
	right: 0,
	top: 0,
	zIndex: 2000,
};

const imageStyle = {
	boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
	maxHeight: '90vh',
	maxWidth: '90vw',
};

const buttonStyle = {
	background: 'rgba(0, 0, 0, 0.45)',
	border: 0,
	borderRadius: 2,
	color: '#fff',
	cursor: 'pointer',
	fontSize: 30,
	height: 48,
	lineHeight: '48px',
	position: 'fixed',
	textAlign: 'center',
	width: 48,
};

const closeStyle = {
	...buttonStyle,
	right: 20,
	top: 20,
};

const previousStyle = {
	...buttonStyle,
	left: 20,
	top: '50%',
	transform: 'translateY(-50%)',
};

const nextStyle = {
	...buttonStyle,
	right: 20,
	top: '50%',
	transform: 'translateY(-50%)',
};

export default class Lightbox extends React.Component {
	componentDidMount() {
		if (this.props.isOpen) {
			this.addKeyboardListener();
		}
	}

	componentDidUpdate(previousProps) {
		if (!previousProps.isOpen && this.props.isOpen) {
			this.addKeyboardListener();
		} else if (previousProps.isOpen && !this.props.isOpen) {
			this.removeKeyboardListener();
		}
	}

	componentWillUnmount() {
		this.removeKeyboardListener();
	}

	addKeyboardListener() {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', this.handleKeyDown);
		}
	}

	removeKeyboardListener() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', this.handleKeyDown);
		}
	}

	handleKeyDown = (event) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.props.onClose();
		} else if (event.key === 'ArrowLeft' && this.canGoPrevious()) {
			event.preventDefault();
			this.props.onClickPrev();
		} else if (event.key === 'ArrowRight' && this.canGoNext()) {
			event.preventDefault();
			this.props.onClickNext();
		}
	};

	canGoPrevious() {
		return this.props.currentImage > 0 && typeof this.props.onClickPrev === 'function';
	}

	canGoNext() {
		return this.props.currentImage < this.props.images.length - 1 && typeof this.props.onClickNext === 'function';
	}

	render() {
		const { currentImage, images, isOpen, onClose, showImageCount } = this.props;
		if (!isOpen || !images.length) return null;

		const image = images[currentImage] || images[0];
		const showCount = showImageCount !== false && images.length > 1;

		return React.createElement(
			'div',
			{
				'aria-modal': 'true',
				role: 'dialog',
				style: backdropStyle,
				onClick: onClose,
			},
			React.createElement(
				'button',
				{
					'aria-label': 'Close',
					onClick: onClose,
					style: closeStyle,
					title: 'Close (Esc)',
					type: 'button',
				},
				'×'
			),
			this.canGoPrevious() && React.createElement(
				'button',
				{
					'aria-label': 'Previous',
					onClick: (event) => {
						event.stopPropagation();
						this.props.onClickPrev();
					},
					style: previousStyle,
					title: 'Previous (Left arrow key)',
					type: 'button',
				},
				'‹'
			),
			React.createElement('img', {
				alt: image.caption || '',
				src: image.src,
				style: imageStyle,
				onClick: (event) => event.stopPropagation(),
			}),
			this.canGoNext() && React.createElement(
				'button',
				{
					'aria-label': 'Next',
					onClick: (event) => {
						event.stopPropagation();
						this.props.onClickNext();
					},
					style: nextStyle,
					title: 'Next (Right arrow key)',
					type: 'button',
				},
				'›'
			),
			showCount && React.createElement(
				'div',
				{ style: { bottom: 20, color: '#fff', position: 'fixed' } },
				currentImage + 1,
				' / ',
				images.length
			)
		);
	}
}


Lightbox.defaultProps = {
	currentImage: 0,
	isOpen: false,
	showImageCount: true,
};
