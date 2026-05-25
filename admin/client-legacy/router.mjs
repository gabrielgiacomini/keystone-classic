import React from 'react';
import qs from 'qs';

const legacyContextType = () => null;

function getWindow() {
	return typeof window === 'undefined' ? undefined : window;
}

function normalizePath(path) {
	if (!path) return '/';
	return path.startsWith('/') ? path : `/${path}`;
}

function splitLocation(path) {
	const [pathname, search = ''] = String(path || '/').split('?');
	return {
		pathname: normalizePath(pathname),
		search: search ? `?${search}` : '',
		query: qs.parse(search),
	};
}

function getCurrentLocation() {
	const currentWindow = getWindow();
	if (!currentWindow) {
		return splitLocation('/');
	}
	return splitLocation(`${currentWindow.location.pathname}${currentWindow.location.search}`);
}

function createHref(to) {
	if (typeof to === 'string') return to;
	if (!to || typeof to !== 'object') return '#';
	const pathname = to.pathname || '/';
	const search = to.search || (to.query ? `?${qs.stringify(to.query)}` : '');
	return `${pathname}${search}`;
}

function notifyLocationChange() {
	const currentWindow = getWindow();
	if (!currentWindow) return;
	currentWindow.dispatchEvent(new Event('popstate'));
}

function navigate(to, replace = false) {
	const currentWindow = getWindow();
	if (!currentWindow) return;
	const href = createHref(to);
	if (replace) {
		currentWindow.history.replaceState(null, '', href);
	} else {
		currentWindow.history.pushState(null, '', href);
	}
	notifyLocationChange();
}

function isModifiedClick(event) {
	return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

function isExternalHref(href) {
	return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || /^[a-z][a-z0-9+.-]*:/i.test(href);
}

function pathSegments(path) {
	return normalizePath(path)
		.split('/')
		.filter(Boolean);
}

function joinPaths(parentPath, childPath) {
	if (!childPath) return normalizePath(parentPath);
	if (childPath.startsWith('/')) return normalizePath(childPath);
	return normalizePath(`${normalizePath(parentPath).replace(/\/$/, '')}/${childPath}`);
}

function matchRoute(pathname, routePath) {
	const routeSegments = pathSegments(routePath);
	const currentSegments = pathSegments(pathname);
	if (routeSegments.length !== currentSegments.length) return null;

	const params = {};
	for (let i = 0; i < routeSegments.length; i++) {
		const routeSegment = routeSegments[i];
		const currentSegment = currentSegments[i];
		if (routeSegment.startsWith(':')) {
			params[routeSegment.slice(1)] = decodeURIComponent(currentSegment);
			continue;
		}
		if (routeSegment !== currentSegment) return null;
	}
	return params;
}

function routeChildren(routeElement) {
	return React.Children.toArray(routeElement.props.children).filter(Boolean);
}

function resolveRoute(pathname, rootRoute) {
	const rootPath = normalizePath(rootRoute.props.path);
	const rootSegments = pathSegments(rootPath);
	const currentSegments = pathSegments(pathname);
	if (rootSegments.some((segment, index) => segment !== currentSegments[index])) {
		return null;
	}

	const childElements = routeChildren(rootRoute);
	const remainderSegments = currentSegments.slice(rootSegments.length);
	const remainderPath = normalizePath(remainderSegments.join('/'));
	const indexRoute = childElements.find(child => child.type === IndexRoute);
	const childRoutes = childElements.filter(child => child.type === Route);

	if (!remainderSegments.length && indexRoute) {
		return {
			child: indexRoute.props.component,
			params: {},
			root: rootRoute.props.component,
		};
	}

	for (const childRoute of childRoutes) {
		const params = matchRoute(remainderPath, normalizePath(childRoute.props.path));
		if (params) {
			return {
				child: childRoute.props.component,
				params,
				root: rootRoute.props.component,
			};
		}
	}

	return {
		child: null,
		params: {},
		root: rootRoute.props.component,
	};
}

export const browserHistory = {
	getCurrentLocation,
	listen(listener) {
		const currentWindow = getWindow();
		if (!currentWindow) return () => {};
		const handler = () => listener(getCurrentLocation());
		currentWindow.addEventListener('popstate', handler);
		return () => currentWindow.removeEventListener('popstate', handler);
	},
	push(to) {
		navigate(to);
	},
	replace(to) {
		navigate(to, true);
	},
	createHref,
};

export function Link({ children, onClick, target, to, ...props }) {
	const href = createHref(to);
	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
		if (event.defaultPrevented || target || isModifiedClick(event) || isExternalHref(href)) {
			return;
		}
		event.preventDefault();
		navigate(href);
	};

	return React.createElement('a', {
		...props,
		href,
		onClick: handleClick,
		target,
	}, children);
}

export function Route() {
	return null;
}

export function IndexRoute() {
	return null;
}

export class Router extends React.Component {
	static childContextTypes = {
		router: legacyContextType,
	};

	state = {
		location: getCurrentLocation(),
	};

	getChildContext() {
		return {
			router: {
				createHref,
				push: this.props.history.push,
				replace: this.props.history.replace,
			},
		};
	}

	componentDidMount() {
		this.unlisten = this.props.history.listen(location => {
			this.setState({ location });
		});
	}

	componentWillUnmount() {
		if (this.unlisten) {
			this.unlisten();
		}
	}

	render() {
		const rootRoute = React.Children.toArray(this.props.children).find(child => child.type === Route);
		if (!rootRoute) return null;

		const resolvedRoute = resolveRoute(this.state.location.pathname, rootRoute);
		if (!resolvedRoute) return null;

		const RootComponent = resolvedRoute.root;
		const ChildComponent = resolvedRoute.child;
		const routeProps = {
			location: this.state.location,
			params: resolvedRoute.params,
			routeParams: resolvedRoute.params,
		};
		const child = ChildComponent ? React.createElement(ChildComponent, routeProps) : null;

		return React.createElement(RootComponent, routeProps, child);
	}
}
