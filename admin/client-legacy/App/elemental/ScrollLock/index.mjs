import { Component } from 'react';

/**
 * A renderless React component that prevents the page body from scrolling
 * while it is mounted. Supports nested usage via a reference count: the body
 * scroll lock is applied on the first mount and released only when the last
 * instance unmounts.
 */
export default class ScrollLock extends Component {
	/**
	 * Initialises the instance and sets the internal lock reference count to zero.
	 */
	constructor () {
		super();
		this.lockCount = 0;
	}
	/**
	 * Increments the lock reference count and, on the first lock, adds
	 * right-padding equal to the scrollbar width and sets `overflow-y: hidden`
	 * on `document.body` to prevent page scrolling. No-ops in non-browser
	 * environments.
	 */
	UNSAFE_componentWillMount () {
		if (typeof window === 'undefined') return;

		this.lockCount++;
		if (this.lockCount > 1) return;

		//	FIXME iOS ignores overflow on body
		try {
			const scrollBarWidth = window.innerWidth - document.body.clientWidth;

			const target = document.body;

			target.style.paddingRight = scrollBarWidth + 'px';
			target.style.overflowY = 'hidden';
		} catch (err) {
			console.error('Failed to find body element. Err:', err);
		}
	}
	/**
	 * Decrements the lock reference count and, when the count reaches zero,
	 * clears the `paddingRight` and `overflow-y` styles previously set on
	 * `document.body`, restoring normal page scrolling. No-ops in non-browser
	 * environments or when the count is already zero.
	 */
	componentWillUnmount () {
		if (typeof window === 'undefined' || this.lockCount === 0) return;

		this.lockCount--;
		if (this.lockCount > 0) return; // Still locked

		//	FIXME iOS ignores overflow on body
		try {
			const target = document.body;

			target.style.paddingRight = '';
			target.style.overflowY = '';

		} catch (err) {
			console.error('Failed to find body element. Err:', err);
		}
	}
	/**
	 * Renders nothing. This component exists solely for its lifecycle side-effects.
	 * @returns {null} Always returns null.
	 */
	render () {
		return null;
	}
}
