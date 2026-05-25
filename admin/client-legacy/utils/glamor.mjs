let styleSheet;
const objectClassCache = new WeakMap();
const keyframesCache = new Map();
let classId = 0;

const unitlessProperties = new Set([
	'animationIterationCount',
	'borderImageOutset',
	'borderImageSlice',
	'borderImageWidth',
	'boxFlex',
	'boxFlexGroup',
	'boxOrdinalGroup',
	'columnCount',
	'columns',
	'flex',
	'flexGrow',
	'flexPositive',
	'flexShrink',
	'flexNegative',
	'flexOrder',
	'gridArea',
	'gridRow',
	'gridRowEnd',
	'gridRowSpan',
	'gridRowStart',
	'gridColumn',
	'gridColumnEnd',
	'gridColumnSpan',
	'gridColumnStart',
	'fontWeight',
	'lineClamp',
	'lineHeight',
	'opacity',
	'order',
	'orphans',
	'tabSize',
	'widows',
	'zIndex',
	'zoom',
]);

function ensureStyleSheet() {
	if (styleSheet || typeof document === 'undefined') return styleSheet;
	const element = document.createElement('style');
	element.setAttribute('data-keystone-legacy-glamor', '');
	document.head.appendChild(element);
	styleSheet = element.sheet;
	return styleSheet;
}

function insertRule(rule) {
	const sheet = ensureStyleSheet();
	if (!sheet) return;
	try {
		sheet.insertRule(rule, sheet.cssRules.length);
	} catch (err) {
		// Legacy admin styles should never break rendering because a browser
		// rejects one generated rule.
		if (typeof console !== 'undefined' && console.warn) {
			console.warn('Unable to insert legacy style rule', rule, err);
		}
	}
}

function hyphenate(property) {
	return property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

function serializeValue(property, value) {
	if (typeof value === 'number' && value !== 0 && !unitlessProperties.has(property)) {
		return `${value}px`;
	}
	return String(value);
}

function serializeDeclarations(styles) {
	return Object.entries(styles)
		.filter(([, value]) => value !== null && value !== undefined && typeof value !== 'object')
		.map(([property, value]) => `${hyphenate(property)}:${serializeValue(property, value)}`)
		.join(';');
}

function insertStyleObject(selector, styles) {
	const declarations = serializeDeclarations(styles);
	if (declarations) {
		insertRule(`${selector}{${declarations}}`);
	}
	Object.entries(styles).forEach(([property, value]) => {
		if (!value || typeof value !== 'object') return;
		const nestedSelector = property.trim();
		if (nestedSelector.startsWith('@media')) {
			const nestedDeclarations = serializeDeclarations(value);
			if (nestedDeclarations) {
				insertRule(`${nestedSelector}{${selector}{${nestedDeclarations}}}`);
			}
			Object.entries(value).forEach(([innerProperty, innerValue]) => {
				if (innerValue && typeof innerValue === 'object') {
					const innerSelector = innerProperty.includes('&')
						? innerProperty.replace(/&/g, selector)
						: `${selector}${innerProperty}`;
					insertRule(`${nestedSelector}{${innerSelector}{${serializeDeclarations(innerValue)}}}`);
				}
			});
			return;
		}
		const childSelector = nestedSelector.includes('&')
			? nestedSelector.replace(/&/g, selector)
			: `${selector}${nestedSelector}`;
		insertStyleObject(childSelector, value);
	});
}

function classNameForStyle(style) {
	if (!style) return '';
	if (typeof style === 'string') return style;
	if (style._name) return style._name;
	if (objectClassCache.has(style)) return objectClassCache.get(style);

	const className = `ks-lg-${++classId}`;
	objectClassCache.set(style, className);
	insertStyleObject(`.${className}`, style);
	return className;
}

function flatten(input, output) {
	if (!input) return output;
	if (Array.isArray(input)) {
		input.forEach(item => flatten(item, output));
		return output;
	}
	output.push(input);
	return output;
}

export function css(...styles) {
	return flatten(styles, [])
		.map(classNameForStyle)
		.filter(Boolean)
		.join(' ');
}

export const compose = {
	keyframes(name, frames) {
		const cacheKey = `${name}:${JSON.stringify(frames)}`;
		if (keyframesCache.has(cacheKey)) return keyframesCache.get(cacheKey);
		const animationName = `ks-lg-${name}-${++classId}`;
		const body = Object.entries(frames)
			.map(([step, declarations]) => `${step}{${serializeDeclarations(declarations)}}`)
			.join('');
		insertRule(`@keyframes ${animationName}{${body}}`);
		keyframesCache.set(cacheKey, animationName);
		return animationName;
	},
};
