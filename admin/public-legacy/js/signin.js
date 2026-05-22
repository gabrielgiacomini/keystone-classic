(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    danger: _theme.default.alert.color.danger,
    error: _theme.default.alert.color.danger,
    info: _theme.default.alert.color.info,
    success: _theme.default.alert.color.success,
    warning: _theme.default.alert.color.warning
};

},{"../../../theme.mjs":71}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// clone children if a class exists for the tagname
const cloneWithClassnames = (c)=>{
    const type = c.type && c.type.displayName ? c.type.displayName : c.type || null;
    if (!type || !_styles.default[type]) return c;
    return /*#__PURE__*/ (0, _react.cloneElement)(c, {
        className: (0, _glamor.css)(_styles.default[type])
    });
};
/**
 * Alert component that renders a styled notification block.
 *
 * Applies colour-coded styles based on the `color` prop and clones child
 * elements with their associated elemental class names where available.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content to render inside the alert.
 * @param {string} [props.className] - Additional CSS class names to apply.
 * @param {'danger'|'error'|'info'|'success'|'warning'} props.color - Alert colour variant.
 * @param {string|((props: object) => React.Element)} [props.component] - HTML tag name or React component to render as the root element. Defaults to `'div'`.
 * @returns {React.Element} The rendered alert element.
 */ function Alert(_0) {
    let { children, className, color, component: Component } = _0, props = _object_without_properties(_0, [
        "children",
        "className",
        "color",
        "component"
    ]);
    props.className = (0, _glamor.css)(_styles.default.alert, _styles.default[color], className);
    props.children = _react.Children.map(children, cloneWithClassnames);
    return /*#__PURE__*/ _react.default.createElement(Component, _object_spread_props(_object_spread({}, props), {
        "data-alert-type": color
    }));
}
Alert.propTypes = {
    color: _react.PropTypes.oneOf(Object.keys(_colors.default)).isRequired,
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ])
};
Alert.defaultProps = {
    component: 'div'
};
const _default = Alert;

},{"./colors.mjs":1,"./styles.mjs":3,"glamor":undefined,"react":undefined}],3:[function(require,module,exports){
// ==============================
// Alert
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
// Prepare variants
const colorVariants = {};
Object.keys(_colors.default).forEach((color)=>{
    colorVariants[color] = {
        backgroundColor: _colors.default[color].background,
        borderColor: _colors.default[color].border,
        color: _colors.default[color].text
    };
});
// Prepare headings
const headingTagnames = {};
[
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
].forEach((tag)=>{
    headingTagnames[tag] = {
        color: 'inherit'
    };
});
const linkStyles = {
    color: 'inherit',
    textDecoration: 'underline',
    ':hover': {
        color: 'inherit'
    },
    ':focus': {
        color: 'inherit'
    }
};
const _default = _object_spread({
    alert: {
        borderColor: 'transparent',
        borderRadius: _theme.default.alert.borderRadius,
        borderStyle: 'solid',
        borderWidth: _theme.default.alert.borderWidth,
        margin: _theme.default.alert.margin,
        padding: _theme.default.alert.padding
    },
    // tagnames
    a: linkStyles,
    Link: linkStyles,
    strong: {
        fontWeight: 500
    }
}, headingTagnames, colorVariants);

},{"../../../theme.mjs":71,"./colors.mjs":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a centered, styled empty-state container.
 *
 * Applies blank-state theme styles (background, padding, border-radius, text
 * alignment) to the root element, and optionally renders an `<h2>` heading
 * above any child content.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name merged with the container styles.
 * @param {React.ReactNode} [props.children] - Content rendered inside the container.
 * @param {string} [props.heading] - Optional heading text rendered as an `<h2>` above children.
 * @param {((props: object) => React.Element)|string} [props.component] - Root element type or React component to render; defaults to 'div'.
 * @returns {React.Element} The rendered blank-state element.
 */ function BlankState(_0) {
    let { className, children, heading, component: Component } = _0, props = _object_without_properties(_0, [
        "className",
        "children",
        "heading",
        "component"
    ]);
    props.className = (0, _glamor.css)(classes.container, className);
    return /*#__PURE__*/ _react.default.createElement(Component, props, !!heading && /*#__PURE__*/ _react.default.createElement("h2", {
        "data-e2e-blank-state-heading": true,
        className: (0, _glamor.css)(classes.heading)
    }, heading), children);
}
BlankState.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]).isRequired,
    heading: _react.PropTypes.string
};
BlankState.defaultProps = {
    component: 'div'
};
/* eslint quote-props: ["error", "as-needed"] */ const classes = {
    container: {
        backgroundColor: _theme.default.blankstate.background,
        borderRadius: _theme.default.blankstate.borderRadius,
        color: _theme.default.blankstate.color,
        paddingBottom: _theme.default.blankstate.paddingVertical,
        paddingLeft: _theme.default.blankstate.paddingHorizontal,
        paddingRight: _theme.default.blankstate.paddingHorizontal,
        paddingTop: _theme.default.blankstate.paddingVertical,
        textAlign: 'center'
    },
    heading: {
        color: 'inherit',
        ':last-child': {
            marginBottom: 0
        }
    }
};
const _default = BlankState;

},{"../../../theme.mjs":71,"glamor":undefined,"react":undefined}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_wildcard(require("./styles.mjs"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
const commonClasses = _styles.common;
const stylesheetCache = {};
function getStyleSheet(variant, color) {
    const cacheKey = `${variant}-${color}`;
    if (!stylesheetCache[cacheKey]) {
        const variantStyles = _styles[variant](color);
        stylesheetCache[cacheKey] = variantStyles;
    }
    return stylesheetCache[cacheKey];
}
const BUTTON_SIZES = [
    'large',
    'medium',
    'small',
    'xsmall'
];
const BUTTON_VARIANTS = [
    'fill',
    'hollow',
    'link'
];
const BUTTON_COLORS = [
    'default',
    'primary',
    'success',
    'warning',
    'danger',
    'cancel',
    'delete'
];
// NOTE must NOT be functional component to allow `refs`
/**
 * A styled button component that renders as a `<button>`, `<a>`, or any
 * custom element. Supports multiple visual variants, sizes, and colors via
 * Glamor-generated CSS class names. Must be a class component so that callers
 * can attach React refs to the underlying DOM node.
 */ class Button extends _react.Component {
    /**
	 * Renders the button element.
	 *
	 * Resolves the Glamor CSS class names for the requested variant and color,
	 * merges any additional `cssStyles` and `className` values, then returns
	 * the appropriate element. When `component` is omitted the tag is `<a>`
	 * if an `href` prop is present, otherwise `<button>`. A `type="button"`
	 * attribute is added automatically to `<button>` elements that do not
	 * already carry a `type`, preventing accidental form submission.
	 * @returns {React.Element} The rendered button element.
	 */ render() {
        const _this_props = this.props, { active, cssStyles, block, className, color, component, disabled, size, variant } = _this_props, props = _object_without_properties(_this_props, [
            "active",
            "cssStyles",
            "block",
            "className",
            "color",
            "component",
            "disabled",
            "size",
            "variant"
        ]);
        let Tag = component;
        // get the styles
        const variantClasses = getStyleSheet(variant, color);
        props.className = (0, _glamor.css)(commonClasses.base, commonClasses[size], variantClasses.base, block ? commonClasses.block : null, disabled ? commonClasses.disabled : null, active ? variantClasses.active : null, ...cssStyles);
        if (className) {
            props.className += ' ' + className;
        }
        // return an anchor or button
        if (!Tag) {
            Tag = props.href ? 'a' : 'button';
        }
        // Ensure buttons don't submit by default
        if (Tag === 'button' && !props.type) {
            props.type = 'button';
        }
        return /*#__PURE__*/ _react.default.createElement(Tag, props);
    }
}
Button.propTypes = {
    active: _react.PropTypes.bool,
    block: _react.PropTypes.bool,
    color: _react.PropTypes.oneOf(BUTTON_COLORS),
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]),
    cssStyles: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        _definition: _react.PropTypes.object,
        _name: _react.PropTypes.string
    })),
    disabled: _react.PropTypes.bool,
    href: _react.PropTypes.string,
    size: _react.PropTypes.oneOf(BUTTON_SIZES),
    variant: _react.PropTypes.oneOf(BUTTON_VARIANTS)
};
Button.defaultProps = {
    cssStyles: [],
    color: 'default',
    variant: 'fill'
};
const _default = Button;

},{"./styles.mjs":6,"glamor":undefined,"react":undefined}],6:[function(require,module,exports){
// ==============================
// Button
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get common () {
        return common;
    },
    get fill () {
        return fill;
    },
    get hollow () {
        return hollow;
    },
    get link () {
        return link;
    }
});
const _css = require("../../../utils/css.mjs");
const _color = require("../../../utils/color.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
const common = {
    // Base Button
    // ----------------
    base: {
        'appearance': 'none',
        'background': 'none',
        'borderWidth': _theme.default.button.borderWidth,
        'borderStyle': 'solid',
        'borderColor': 'transparent',
        'borderRadius': _theme.default.button.borderRadius,
        'cursor': 'pointer',
        'display': 'inline-block',
        'fontWeight': _theme.default.button.font.weight,
        'height': _theme.default.component.height,
        'lineHeight': _theme.default.component.lineHeight,
        'marginBottom': 0,
        'padding': `0 ${_theme.default.button.paddingHorizontal}`,
        'outline': 0,
        'textAlign': 'center',
        'touchAction': 'manipulation',
        'userSelect': 'none',
        'verticalAlign': 'middle',
        'whiteSpace': 'nowrap',
        ':hover': {
            color: _theme.default.button.default.textColor,
            textDecoration: 'none'
        },
        ':focus': {
            color: _theme.default.button.default.textColor,
            textDecoration: 'none'
        }
    },
    // Block Display
    // ----------------
    block: {
        display: 'block',
        width: '100%'
    },
    // Disabled
    // ----------------
    disabled: {
        opacity: 0.4,
        pointerEvents: 'none'
    },
    // Sizes
    // ----------------
    large: {
        fontSize: _theme.default.font.size.large
    },
    default: {
        fontSize: _theme.default.font.size.default
    },
    small: {
        fontSize: _theme.default.font.size.small
    },
    xsmall: {
        fontSize: _theme.default.font.size.xsmall,
        lineHeight: '1.9',
        paddingLeft: '.66em',
        paddingRight: '.66em'
    }
};
// Fill Variant
// ----------------
function buttonFillVariant(textColor, bgColor) {
    const hoverStyles = _object_spread_props(_object_spread({}, (0, _css.gradientVertical)((0, _color.lighten)(bgColor, 10), (0, _color.darken)(bgColor, 5))), {
        borderColor: `${(0, _color.darken)(bgColor, 5)} ${(0, _color.darken)(bgColor, 10)} ${(0, _color.darken)(bgColor, 15)}`,
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
        color: textColor,
        outline: 'none'
    });
    const focusStyles = _object_spread_props(_object_spread({}, (0, _css.gradientVertical)((0, _color.lighten)(bgColor, 10), (0, _color.darken)(bgColor, 5))), {
        borderColor: `${(0, _color.darken)(bgColor, 5)} ${(0, _color.darken)(bgColor, 10)} ${(0, _color.darken)(bgColor, 15)}`,
        boxShadow: `0 0 0 3px ${(0, _color.fade)(bgColor, 25)}`,
        color: textColor,
        outline: 'none'
    });
    const activeStyles = {
        backgroundColor: (0, _color.darken)(bgColor, 10),
        backgroundImage: 'none',
        borderColor: `${(0, _color.darken)(bgColor, 25)} ${(0, _color.darken)(bgColor, 15)} ${(0, _color.darken)(bgColor, 10)}`,
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
    };
    return {
        base: _object_spread_props(_object_spread({}, (0, _css.gradientVertical)((0, _color.lighten)(bgColor, 5), (0, _color.darken)(bgColor, 10), bgColor)), {
            'borderColor': `${(0, _color.darken)(bgColor, 10)} ${(0, _color.darken)(bgColor, 20)} ${(0, _color.darken)(bgColor, 25)}`,
            'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            'color': textColor,
            'fontWeight': 400,
            'textShadow': '0 -1px 0 rgba(0, 0, 0, 0.25)',
            ':hover': hoverStyles,
            ':focus': focusStyles,
            ':active': activeStyles
        }),
        active: activeStyles
    };
}
// TODO: This is pretty hacky, needs to be consolidated with the Variant() method
// above (needs more theme variables to be implemented though)
function buttonFillDefault() {
    const borderColor = _theme.default.input.border.color.default;
    const hoverStyles = _object_spread_props(_object_spread({}, (0, _css.gradientVertical)('#fff', '#eee')), {
        borderColor: `${(0, _color.darken)(borderColor, 5)} ${(0, _color.darken)(borderColor, 5)} ${(0, _color.darken)(borderColor, 10)}`,
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
        color: _theme.default.color.text
    });
    const focusStyles = {
        borderColor: _theme.default.color.primary,
        boxShadow: `0 0 0 3px ${(0, _color.fade)(_theme.default.color.primary, 10)}`,
        color: _theme.default.color.text,
        outline: 'none'
    };
    const activeStyles = {
        background: '#e6e6e6',
        borderColor: (0, _color.darken)(borderColor, 10),
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        color: _theme.default.color.text
    };
    return {
        base: _object_spread_props(_object_spread({}, (0, _css.gradientVertical)('#fafafa', '#eaeaea')), {
            'borderColor': `${borderColor} ${(0, _color.darken)(borderColor, 6)} ${(0, _color.darken)(borderColor, 12)}`,
            'color': _theme.default.color.text,
            'textShadow': '0 1px 0 white',
            ':hover': hoverStyles,
            ':focus': focusStyles,
            ':active': activeStyles
        }),
        // gross hack
        active: _object_spread_props(_object_spread({}, activeStyles), {
            ':hover': activeStyles,
            ':focus': _object_spread_props(_object_spread({}, activeStyles, focusStyles), {
                boxShadow: `0 0 0 3px ${(0, _color.fade)(_theme.default.color.primary, 10)}, inset 0 1px 2px rgba(0, 0, 0, 0.1)`
            }),
            ':active': activeStyles
        })
    };
}
const fill = (color)=>{
    switch(color){
        case 'default':
            return buttonFillDefault();
        case 'cancel':
        case 'delete':
            return buttonFillVariant('white', _theme.default.button.danger.bgColor);
        default:
            return buttonFillVariant('white', _theme.default.button[color].bgColor);
    }
};
// Hollow Variant
// ----------------
function buttonHollowVariant(textColor, borderColor) {
    const focusAndHoverStyles = {
        backgroundImage: 'none',
        backgroundColor: (0, _color.fade)(borderColor, 15),
        borderColor: (0, _color.darken)(borderColor, 15),
        boxShadow: 'none',
        color: textColor,
        outline: 'none'
    };
    const focusOnlyStyles = {
        boxShadow: `0 0 0 3px ${(0, _color.fade)(borderColor, 10)}`
    };
    const activeStyles = {
        backgroundColor: (0, _color.fade)(borderColor, 35),
        borderColor: (0, _color.darken)(borderColor, 25),
        boxShadow: 'none'
    };
    return {
        base: {
            'background': 'none',
            'borderColor': borderColor,
            'color': textColor,
            ':hover': focusAndHoverStyles,
            ':focus ': Object.assign({}, focusAndHoverStyles, focusOnlyStyles),
            ':active': activeStyles
        },
        active: activeStyles
    };
}
const hollow = (color)=>{
    // TODO: better handling of cancel and delete colors
    if (color === 'cancel' || color === 'delete') color = 'danger';
    return buttonHollowVariant(_theme.default.button[color].bgColor, _theme.default.button[color].borderColor);
};
// Link Variant
// ----------------
function buttonLinkVariant(textColor, hoverColor) {
    const hoverStyles = {
        color: hoverColor,
        textDecoration: 'underline'
    };
    return {
        base: {
            'background': 'none',
            'border': 0,
            'boxShadow': 'none',
            'color': textColor,
            'fontWeight': 'normal',
            'outline': 'none',
            ':hover': hoverStyles,
            ':focus': hoverStyles,
            ':active': hoverStyles
        },
        active: hoverStyles
    };
}
function buttonLinkDelete() {
    const styles = buttonLinkVariant(_theme.default.color.gray40, _theme.default.color.danger);
    const hoverStyles = _object_spread_props(_object_spread({}, (0, _css.gradientVertical)((0, _color.lighten)(_theme.default.color.danger, 10), (0, _color.darken)(_theme.default.color.danger, 10))), {
        backgroundColor: _theme.default.color.danger,
        borderColor: `${(0, _color.darken)(_theme.default.color.danger, 4)} ${(0, _color.darken)(_theme.default.color.danger, 8)} ${(0, _color.darken)(_theme.default.color.danger, 12)}`,
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
        color: 'white',
        textDecoration: 'none'
    });
    const activeStyles = {
        backgroundColor: (0, _color.darken)(_theme.default.color.danger, 4),
        backgroundImage: 'none',
        borderColor: `${(0, _color.darken)(_theme.default.color.danger, 12)} ${(0, _color.darken)(_theme.default.color.danger, 8)} ${(0, _color.darken)(_theme.default.color.danger, 8)}`,
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        color: 'white'
    };
    return {
        base: _object_spread_props(_object_spread({}, styles.base), {
            ':hover': hoverStyles,
            ':focus': hoverStyles,
            ':active': activeStyles
        }),
        active: activeStyles
    };
}
const link = (color)=>{
    switch(color){
        case 'default':
            return buttonLinkVariant(_theme.default.color.link, _theme.default.color.linkHover);
        case 'cancel':
            return buttonLinkVariant(_theme.default.color.gray40, _theme.default.color.danger);
        case 'delete':
            return buttonLinkDelete();
        default:
            return buttonLinkVariant(_theme.default.color[color], _theme.default.color[color]);
    }
};

},{"../../../theme.mjs":71,"../../../utils/color.mjs":72,"../../../utils/css.mjs":74}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a container element with centering styles applied.
 *
 * Merges the glamor-based centering class with any additional `className`
 * and sets the `height` on the inline style before forwarding all remaining
 * props to the underlying `component`.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class to merge with the centering style.
 * @param {(string|((props: object) => React.Element))} [props.component] - HTML tag name or React component to render; defaults to 'div'.
 * @param {number|string} [props.height] - CSS height value applied via inline style. Defaults to 'auto'.
 * @param {object} [props.style] - Additional inline styles merged with the height style.
 * @returns {React.Element} The rendered component with centering styles applied.
 */ function Center(_0) {
    let { className, component: Component, height, style } = _0, props = _object_without_properties(_0, [
        "className",
        "component",
        "height",
        "style"
    ]);
    props.className = (0, _glamor.css)(_styles.default.center, className);
    props.style = _object_spread({
        height
    }, style);
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
Center.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]),
    height: _react.PropTypes.oneOfType([
        _react.PropTypes.number,
        _react.PropTypes.string
    ])
};
Center.defaultProps = {
    component: 'div',
    height: 'auto'
};
const _default = Center;

},{"./styles.mjs":8,"glamor":undefined,"react":undefined}],8:[function(require,module,exports){
// ==============================
// Center
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = {
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _color = require("../../../utils/color.mjs");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
const baseColors = {};
[
    'danger',
    'info',
    'primary',
    'success',
    'warning'
].forEach((color)=>{
    baseColors[color] = {
        background: (0, _color.fade)(_theme.default.color[color], 10),
        backgroundActive: (0, _color.fade)(_theme.default.color[color], 20),
        backgroundHover: (0, _color.fade)(_theme.default.color[color], 15),
        text: _theme.default.color[color]
    };
});
const invertedColors = {};
[
    'danger',
    'info',
    'primary',
    'success',
    'warning'
].forEach((color)=>{
    invertedColors[color + '__inverted'] = {
        background: _theme.default.color[color],
        backgroundActive: (0, _color.lighten)(_theme.default.color[color], 5),
        backgroundHover: (0, _color.lighten)(_theme.default.color[color], 15),
        text: 'white'
    };
});
const _default = _object_spread(_object_spread_props(_object_spread({
    default: {
        background: _theme.default.color.gray10,
        backgroundActive: _theme.default.color.gray20,
        backgroundHover: _theme.default.color.gray15,
        text: _theme.default.color.gray60
    }
}, baseColors), {
    // inverted
    default__inverted: {
        background: _theme.default.color.gray60,
        backgroundActive: (0, _color.lighten)(_theme.default.color.gray60, 5),
        backgroundHover: (0, _color.lighten)(_theme.default.color.gray60, 15),
        text: 'white'
    }
}), invertedColors);

},{"../../../theme.mjs":71,"../../../utils/color.mjs":72}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A labelled chip (tag) component with an optional clear button.
 *
 * Renders a div containing a primary label button and, when `onClear` is
 * provided, a secondary "×" clear button. Both buttons are styled according
 * to the `color` and `inverted` props.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class applied to the wrapper div.
 * @param {React.Node} [props.children] - Extra content rendered inside the label button after the label text.
 * @param {string} props.color - Color variant key from the colors map. Defaults to `'default'`.
 * @param {boolean} [props.inverted] - When true, uses the inverted colour style.
 * @param {string} props.label - Text displayed inside the label button.
 * @param {(event: React.SyntheticEvent) => void} [props.onClear] - Click handler for the clear button. The clear button is only rendered when this prop is provided.
 * @param {(event: React.SyntheticEvent) => void} [props.onClick] - Click handler for the label button.
 * @returns {React.Element} The rendered chip element.
 */ function Chip(_0) {
    let { className, children, color, inverted, label, onClear, onClick } = _0, props = _object_without_properties(_0, [
        "className",
        "children",
        "color",
        "inverted",
        "label",
        "onClear",
        "onClick"
    ]);
    props.className = (0, _glamor.css)(_styles.default.chip, className);
    const labelClassName = (0, _glamor.css)(_styles.default.button, _styles.default.label, _styles.default['button__' + color + (inverted ? '__inverted' : '')]);
    const clearClassName = (0, _glamor.css)(_styles.default.button, _styles.default.clear, _styles.default['button__' + color + (inverted ? '__inverted' : '')]);
    return /*#__PURE__*/ _react.default.createElement("div", props, /*#__PURE__*/ _react.default.createElement("button", {
        type: "button",
        onClick: onClick,
        className: labelClassName
    }, label, children), !!onClear && /*#__PURE__*/ _react.default.createElement("button", {
        type: "button",
        onClick: onClear,
        className: clearClassName
    }, "×"));
}
Chip.propTypes = {
    color: _react.PropTypes.oneOf(Object.keys(_colors.default)).isRequired,
    inverted: _react.PropTypes.bool,
    label: _react.default.PropTypes.string.isRequired,
    onClear: _react.default.PropTypes.func,
    onClick: _react.default.PropTypes.func
};
Chip.defaultProps = {
    color: 'default'
};
const _default = Chip;

},{"./colors.mjs":9,"./styles.mjs":11,"glamor":undefined,"react":undefined}],11:[function(require,module,exports){
// ==============================
// Alert
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _css = require("../../../utils/css.mjs");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
// Prepare variants
const colorVariants = {};
Object.keys(_colors.default).forEach((color)=>{
    const hoverStyles = {
        backgroundColor: _colors.default[color].backgroundHover
    };
    colorVariants['button__' + color] = {
        backgroundColor: _colors.default[color].background,
        color: _colors.default[color].text,
        ':hover': hoverStyles,
        ':focus': hoverStyles,
        ':active': {
            backgroundColor: _colors.default[color].backgroundActive
        }
    };
});
const _default = _object_spread({
    chip: {
        display: 'inline-block',
        fontSize: _theme.default.font.size.small,
        fontWeight: 500,
        marginRight: '0.5em',
        overflow: 'hidden',
        lineHeight: '2.2em'
    },
    // tagnames
    button: {
        appearance: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'block',
        float: 'left',
        padding: '0 .9em',
        outline: 'none',
        // make pills - exaggerate the padding toward the radii so it looks even
        ':first-child': _object_spread_props(_object_spread({}, (0, _css.borderLeftRadius)('3em')), {
            paddingLeft: '1.1em'
        }),
        ':last-child': _object_spread_props(_object_spread({}, (0, _css.borderRightRadius)('3em')), {
            paddingRight: '1.1em'
        })
    },
    // provide separation between the label and clear buttons
    // floating stops the margins from collapsing into eaching
    label: {
        marginRight: 1
    },
    clear: {
        marginLeft: 1
    }
}, colorVariants);

},{"../../../theme.mjs":71,"../../../utils/css.mjs":74,"./colors.mjs":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A layout container component that applies glamor CSS classes for width sizing
 * and an optional clearfix, then renders the given component element with the
 * composed className and any remaining props.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge.
 * @param {boolean} [props.clearFloatingChildren] - When true, appends a clearfix class to clear floated children.
 * @param {React.Component|string} props.component - The element type or component to render (defaults to 'div').
 * @param {string} props.width - Container width variant; one of the keys defined in sizes ('small', 'medium', 'large'). Defaults to 'large'.
 * @returns {React.Element} The rendered component element.
 */ function Container(_0) {
    let { className, clearFloatingChildren, component: Component, width } = _0, props = _object_without_properties(_0, [
        "className",
        "clearFloatingChildren",
        "component",
        "width"
    ]);
    props.className = (0, _glamor.css)(_styles.default.container, _styles.default[width], clearFloatingChildren ? _styles.default.clearfix : null, className);
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
Container.propTypes = {
    clearFloatingChildren: _react.PropTypes.bool,
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]).isRequired,
    width: _react.PropTypes.oneOf(Object.keys(_sizes.default)).isRequired
};
Container.defaultProps = {
    component: 'div',
    width: 'large'
};
const _default = Container;

},{"./sizes.mjs":13,"./styles.mjs":14,"glamor":undefined,"react":undefined}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    small: _theme.default.container.size.small,
    medium: _theme.default.container.size.medium,
    large: _theme.default.container.size.large
};

},{"../../../theme.mjs":71}],14:[function(require,module,exports){
// ==============================
// Container
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
// Prepare sizes
const sizeVariants = {};
Object.keys(_sizes.default).forEach((size)=>{
    sizeVariants[size] = {
        maxWidth: _sizes.default[size]
    };
});
/*
	Micro clearfix hack
	1.	The space content is one way to avoid an Opera bug when the
			contenteditable attribute is included anywhere else in the document.
			Otherwise it causes space to appear at the top and bottom of elements
			that are clearfixed.
	2.	The use of `table` rather than `block` is only necessary if using
			`:before` to contain the top-margins of child elements.
*/ const clearfixStyles = {
    clear: 'both',
    content: '" "',
    display: 'table'
};
const _default = _object_spread({
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: _theme.default.container.gutter,
        paddingRight: _theme.default.container.gutter
    },
    // clear floating children
    clearfix: {
        ':before': clearfixStyles,
        ':after': clearfixStyles
    }
}, sizeVariants);

},{"../../../theme.mjs":71,"./sizes.mjs":13}],15:[function(require,module,exports){
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _glamor = require("glamor");
const _index = /*#__PURE__*/ _interop_require_default(require("../Button/index.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A Button variant that appends a small CSS-triangle arrow after its children,
 * indicating a dropdown or menu trigger. All extra props are forwarded to the
 * underlying Button component.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content rendered inside the button, before the arrow.
 * @returns {React.ReactElement} A Button element containing the children and a styled arrow span.
 */ function DropdownButton(_0) {
    let { children } = _0, props = _object_without_properties(_0, [
        "children"
    ]);
    return /*#__PURE__*/ _react.default.createElement(_index.default, props, children, /*#__PURE__*/ _react.default.createElement("span", {
        className: (0, _glamor.css)(classes.arrow)
    }));
}
// NOTE
// 1: take advantage of `currentColor` by leaving border top color undefined
// 2: even though the arrow is vertically centered, visually it appears too low
//    because of lowercase characters beside it
const classes = {
    arrow: {
        borderLeft: '0.3em solid transparent',
        borderRight: '0.3em solid transparent',
        borderTop: '0.3em solid',
        display: 'inline-block',
        height: 0,
        marginTop: '-0.125em',
        verticalAlign: 'middle',
        width: 0,
        // add spacing
        ':first-child': {
            marginRight: '0.5em'
        },
        ':last-child': {
            marginLeft: '0.5em'
        }
    }
};
const _default = DropdownButton;

},{"../Button/index.mjs":5,"glamor":undefined,"react":undefined}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A form wrapper component that provides layout context to its children.
 * Renders an arbitrary container element with glamor-generated class names
 * derived from the chosen layout variant.
 */ class Form extends _react.Component {
    /**
	 * Exposes `formLayout` and `labelWidth` to the React context so that
	 * descendant form controls can read them without explicit prop drilling.
	 * @returns {{ formLayout: string, labelWidth: number|string }} Child context object.
	 */ getChildContext() {
        return {
            formLayout: this.props.layout,
            labelWidth: this.props.labelWidth
        };
    }
    /**
	 * Renders the configured container element with the computed glamor className
	 * that reflects the active layout variant.
	 * @returns {React.Element} The rendered container element.
	 */ render() {
        // NOTE `labelWidth` is destructured only to exclude it from the forwarded props
        const _this_props = this.props, { className, component: Component, labelWidth, layout } = _this_props, props = _object_without_properties(_this_props, [
            "className",
            "component",
            "labelWidth",
            "layout"
        ]);
        props.className = (0, _glamor.css)(_styles.default.Form, _styles.default['Form__' + layout], className);
        return /*#__PURE__*/ _react.default.createElement(Component, props);
    }
}
Form.childContextTypes = {
    formLayout: _react.PropTypes.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    labelWidth: _react.PropTypes.oneOfType([
        _react.PropTypes.number,
        _react.PropTypes.string
    ])
};
Form.propTypes = {
    children: _react.PropTypes.node.isRequired,
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.string,
        _react.PropTypes.func
    ]),
    layout: _react.PropTypes.oneOf([
        'basic',
        'horizontal',
        'inline'
    ])
};
Form.defaultProps = {
    component: 'form',
    layout: 'basic'
};
const _default = Form;

},{"./styles.mjs":17,"glamor":undefined,"react":undefined}],17:[function(require,module,exports){
// ==============================
// Form
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = {
    Form: {}
};

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _index = /*#__PURE__*/ _interop_require_default(require("../FormLabel/index.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A form field wrapper component that renders a labelled container around its
 * children. Generates a unique `formFieldId` and exposes it via React child
 * context so descendant inputs can synchronise their `id`/`htmlFor` attributes
 * without requiring the parent to pass the value down manually.
 */ class FormField extends _react.Component {
    /**
	 * Provides the generated `formFieldId` to all descendant components through
	 * React's legacy context API.
	 * @returns {object} Child context object containing `formFieldId`.
	 */ getChildContext() {
        return {
            formFieldId: this.formFieldId
        };
    }
    /**
	 * Renders a `<div>` wrapper that applies glamor-generated CSS classes based
	 * on the current form layout and an optional `<FormLabel>` when a `label`
	 * prop is provided. When `offsetAbsentLabel` is true and `labelWidth` is
	 * available in context, the wrapper receives a matching `paddingLeft` to
	 * align labelless fields with labelled siblings.
	 * @returns {React.Element} The rendered form-field container element.
	 */ render() {
        const { formLayout = 'basic', labelWidth } = this.context;
        const _this_props = this.props, { cssStyles, children, className, cropLabel, htmlFor, label, offsetAbsentLabel } = _this_props, props = _object_without_properties(_this_props, [
            "cssStyles",
            "children",
            "className",
            "cropLabel",
            "htmlFor",
            "label",
            "offsetAbsentLabel"
        ]);
        props.className = (0, _glamor.css)(_styles.default.FormField, _styles.default['FormField--form-layout-' + formLayout], offsetAbsentLabel ? _styles.default['FormField--offset-absent-label'] : null, cssStyles);
        if (className) {
            props.className += ' ' + className;
        }
        if (offsetAbsentLabel && labelWidth) {
            props.style = _object_spread({
                paddingLeft: labelWidth
            }, props.style);
        }
        // elements
        const componentLabel = label ? /*#__PURE__*/ _react.default.createElement(_index.default, {
            htmlFor: htmlFor,
            cropText: cropLabel
        }, label) : null;
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread_props(_object_spread({}, props), {
            htmlFor: htmlFor
        }), componentLabel, children);
    }
    /**
	 * Initialises the component and assigns a randomly-generated `formFieldId`
	 * that is stable for the lifetime of the instance.
	 */ constructor(){
        super();
        this.formFieldId = generateId();
    }
}
const stylesShape = {
    _definition: _react.PropTypes.object,
    _name: _react.PropTypes.string
};
FormField.contextTypes = {
    formLayout: _react.PropTypes.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    labelWidth: _react.PropTypes.oneOfType([
        _react.PropTypes.number,
        _react.PropTypes.string
    ])
};
FormField.childContextTypes = {
    formFieldId: _react.PropTypes.string
};
FormField.propTypes = {
    children: _react.PropTypes.node,
    cropLabel: _react.PropTypes.bool,
    cssStyles: _react.PropTypes.oneOfType([
        _react.PropTypes.arrayOf(_react.PropTypes.shape(stylesShape)),
        _react.PropTypes.shape(stylesShape)
    ]),
    htmlFor: _react.default.PropTypes.string,
    label: _react.default.PropTypes.string,
    offsetAbsentLabel: _react.default.PropTypes.bool
};
function generateId() {
    return Math.random().toString(36).slice(2, 11);
}
const _default = FormField;

},{"../FormLabel/index.mjs":23,"./styles.mjs":19,"glamor":undefined,"react":undefined}],19:[function(require,module,exports){
// ==============================
// Form Field
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    'FormField': {
        marginBottom: '1em',
        position: 'relative'
    },
    // when inside a horizontal form
    'FormField--form-layout-horizontal': {
        [`@media (min-width: ${_theme.default.breakpoint.tabletLandscapeMin})`]: {
            display: 'table',
            tableLayout: 'fixed',
            width: '100%'
        }
    },
    // inside horizontal form
    // typically for use with submit button inside
    'FormField--offset-absent-label': {
        paddingLeft: _theme.default.form.label.width
    },
    // when inside an inline form
    'FormField--form-layout-inline': {
        'display': 'inline-block',
        'paddingLeft': '0.25em',
        'paddingRight': '0.25em',
        'verticalAlign': 'top',
        ':first-child': {
            paddingLeft: 0
        },
        ':last-child': {
            paddingRight: 0
        }
    }
};

},{"../../../theme.mjs":71}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _concatClassnames = /*#__PURE__*/ _interop_require_default(require("../../../utils/concatClassnames.mjs"));
const _noedit = /*#__PURE__*/ _interop_require_default(require("./noedit.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// NOTE must NOT be functional component to allow `refs`
/**
 * A form input component that renders either a standard `<input>`, a
 * `<textarea>` (when `multiline` is true), or an `<InputNoedit>` read-only
 * display (when `noedit` is true). Must be a class component so that
 * consumers can hold a `ref` and call `blur`/`focus` imperatively.
 */ class FormInput extends _react.Component {
    /**
	 * Removes focus from the underlying input or textarea element.
	 * @returns {void}
	 */ blur() {
        this.target.blur();
    }
    /**
	 * Moves focus to the underlying input or textarea element.
	 * @returns {void}
	 */ focus() {
        this.target.focus();
    }
    /**
	 * Renders an `<InputNoedit>` when the `noedit` prop is set, otherwise
	 * renders a glamor-styled `<input>` or `<textarea>` depending on the
	 * `multiline` prop. Picks up `formFieldId` and `formLayout` from context
	 * to set the element's `id` and layout-specific class names.
	 * @returns {React.Element} The rendered element.
	 */ render() {
        const _this_props = this.props, { cssStyles, className, disabled, id, multiline, noedit, size } = _this_props, props = _object_without_properties(_this_props, [
            "cssStyles",
            "className",
            "disabled",
            "id",
            "multiline",
            "noedit",
            "size"
        ]);
        // NOTE return a different component for `noedit`
        if (noedit) return /*#__PURE__*/ _react.default.createElement(_noedit.default, this.props);
        const { formFieldId, formLayout } = this.context;
        props.id = id || formFieldId;
        props.className = (0, _glamor.css)(_styles.default.FormInput, _styles.default['FormInput__size--' + size], disabled ? _styles.default['FormInput--disabled'] : null, formLayout ? _styles.default['FormInput--form-layout-' + formLayout] : null, ...(0, _concatClassnames.default)(cssStyles));
        if (className) {
            props.className += ' ' + className;
        }
        const setRef = (n)=>this.target = n;
        const Tag = multiline ? 'textarea' : 'input';
        return /*#__PURE__*/ _react.default.createElement(Tag, _object_spread({
            ref: setRef,
            disabled: props.disabled
        }, props));
    }
}
const stylesShape = {
    _definition: _react.PropTypes.object,
    _name: _react.PropTypes.string
};
FormInput.propTypes = {
    cssStyles: _react.PropTypes.oneOfType([
        _react.PropTypes.arrayOf(_react.PropTypes.shape(stylesShape)),
        _react.PropTypes.shape(stylesShape)
    ]),
    multiline: _react.PropTypes.bool,
    size: _react.PropTypes.oneOf([
        'default',
        'small',
        'large'
    ]),
    type: _react.PropTypes.string
};
FormInput.defaultProps = {
    size: 'default',
    type: 'text'
};
FormInput.contextTypes = {
    formLayout: _react.PropTypes.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    formFieldId: _react.PropTypes.string
};
const _default = FormInput;

},{"../../../utils/concatClassnames.mjs":73,"./noedit.mjs":21,"./styles.mjs":22,"glamor":undefined,"react":undefined}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _color = require("../../../utils/color.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/* eslint quote-props: ["error", "as-needed"] */ /**
 * A read-only form input that renders its content inside a styled, non-editable
 * container element. Applies glamor CSS classes for the noedit appearance,
 * optional text cropping, optional multiline layout, and anchor-style
 * highlighting when an `href` or `onClick` prop is present.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge.
 * @param {string|{ (): object }} [props.component] - The element or component to render. Defaults to 'span'.
 * @param {boolean} [props.cropText] - When true, applies text-cropping styles.
 * @param {boolean} [props.multiline] - When true, applies block/multiline layout styles.
 * @param {unknown} [props.noedit] - Consumed and removed from props; not passed to the rendered element.
 * @param {string} [props.type] - Consumed and removed from props; not passed to the rendered element.
 * @returns {React.Element} The rendered component element.
 */ function FormInputNoedit(_0) {
    let { className, component: Component, cropText, multiline, noedit, type } = _0, props = _object_without_properties(_0, [
        "className",
        "component",
        "cropText",
        "multiline",
        "noedit",
        "type"
    ]);
    props.className = (0, _glamor.css)(classes.noedit, cropText ? classes.cropText : null, multiline ? classes.multiline : null, props.href || props.onClick ? classes.anchor : null, className);
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
FormInputNoedit.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.string,
        _react.PropTypes.func
    ]),
    cropText: _react.PropTypes.bool
};
FormInputNoedit.defaultProps = {
    component: 'span'
};
const anchorHoverAndFocusStyles = {
    backgroundColor: (0, _color.fade)(_theme.default.color.link, 10),
    borderColor: (0, _color.fade)(_theme.default.color.link, 10),
    color: _theme.default.color.link,
    outline: 'none',
    textDecoration: 'underline'
};
const classes = {
    noedit: {
        appearance: 'none',
        backgroundColor: _theme.default.input.background.noedit,
        backgroundImage: 'none',
        borderColor: _theme.default.input.border.color.noedit,
        borderRadius: _theme.default.input.border.radius,
        borderStyle: 'solid',
        borderWidth: _theme.default.input.border.width,
        color: _theme.default.color.gray80,
        display: 'inline-block',
        lineHeight: _theme.default.input.lineHeight,
        padding: `0 ${_theme.default.input.paddingHorizontal}`,
        transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
        verticalAlign: 'middle',
        // prevent empty inputs from collapsing by adding content
        ':empty:before': {
            color: _theme.default.color.gray40,
            content: '"(no value)"'
        }
    },
    multiline: {
        display: 'block',
        height: 'auto',
        lineHeight: '1.4',
        paddingBottom: '0.6em',
        paddingTop: '0.6em'
    },
    // indicate clickability when using an anchor
    anchor: {
        backgroundColor: (0, _color.fade)(_theme.default.color.link, 5),
        borderColor: (0, _color.fade)(_theme.default.color.link, 10),
        color: _theme.default.color.link,
        marginRight: 5,
        minWidth: 0,
        textDecoration: 'none',
        ':hover': anchorHoverAndFocusStyles,
        ':focus': anchorHoverAndFocusStyles
    }
};
const _default = FormInputNoedit;

},{"../../../theme.mjs":71,"../../../utils/color.mjs":72,"glamor":undefined,"react":undefined}],22:[function(require,module,exports){
// ==============================
// Form Input
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    'FormInput': {
        'appearance': 'none',
        'backgroundColor': _theme.default.input.background.default,
        'backgroundImage': 'none',
        'borderColor': _theme.default.input.border.color.default,
        'borderRadius': _theme.default.input.border.radius,
        'borderStyle': 'solid',
        'borderWidth': _theme.default.input.border.width,
        'boxShadow': _theme.default.input.boxShadow,
        'color': 'inherit',
        'display': 'block',
        'height': _theme.default.input.height,
        'lineHeight': _theme.default.input.lineHeight,
        'padding': `0 ${_theme.default.input.paddingHorizontal}`,
        'transition': 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
        'width': '100%',
        ':hover': {
            borderColor: _theme.default.input.border.color.hover,
            outline: 0
        },
        ':focus': {
            borderColor: _theme.default.input.border.color.focus,
            boxShadow: _theme.default.input.boxShadowFocus,
            outline: 0
        }
    },
    'FormInput--disabled': {
        backgroundColor: _theme.default.input.background.disabled,
        pointerEvents: 'none'
    },
    // sizes
    'FormInput__size--small': {
        fontSize: _theme.default.font.size.small
    },
    'FormInput__size--large': {
        fontSize: _theme.default.font.size.large
    }
};

},{"../../../theme.mjs":71}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a form label element with glamor CSS class names derived from the
 * form layout context. Reads `formFieldId`, `formLayout`, and `labelWidth`
 * from React context and merges them with the provided props.
 * @param {object} props - Component props.
 * @param {string|function(): React.Element} [props.component] - Element type or component to render; defaults to 'label'.
 * @param {boolean} [props.cropText] - When true, applies a text-cropping CSS modifier class.
 * @param {Array|object} [props.cssStyles] - Glamor style object or array of style objects to apply.
 * @param {string} [props.className] - Additional CSS class name appended after glamor classes.
 * @param {string} [props.htmlFor] - The `for` attribute value; falls back to `formFieldId` from context.
 * @param {object} context - React context.
 * @param {string} [context.formFieldId] - Field ID provided by a parent Form component.
 * @param {string} [context.formLayout] - Layout variant ('basic', 'horizontal', or 'inline').
 * @param {number|string} [context.labelWidth] - Explicit width applied as an inline style.
 * @returns {React.Element} The rendered label element.
 */ function FormLabel(_0, _1) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { cssStyles, className, component: Component, cropText, htmlFor } = _ref1, props = _object_without_properties(_ref1, [
        "cssStyles",
        "className",
        "component",
        "cropText",
        "htmlFor"
    ]), [{ formFieldId, formLayout, labelWidth }] = _rest;
    props.htmlFor = htmlFor || formFieldId;
    props.className = (0, _glamor.css)(_styles.default.FormLabel, formLayout ? _styles.default['FormLabel--form-layout-' + formLayout] : null, cropText ? _styles.default['FormLabel--crop-text'] : null, cssStyles);
    if (className) {
        props.className += ' ' + className;
    }
    if (labelWidth) {
        props.style = _object_spread({
            width: labelWidth
        }, props.style);
    }
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
const stylesShape = {
    _definition: _react.PropTypes.object,
    _name: _react.PropTypes.string
};
FormLabel.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.string,
        _react.PropTypes.func
    ]),
    cropText: _react.PropTypes.bool,
    cssStyles: _react.PropTypes.oneOfType([
        _react.PropTypes.arrayOf(_react.PropTypes.shape(stylesShape)),
        _react.PropTypes.shape(stylesShape)
    ])
};
FormLabel.defaultProps = {
    component: 'label'
};
FormLabel.contextTypes = {
    formLayout: _react.PropTypes.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    formFieldId: _react.PropTypes.string,
    labelWidth: _react.PropTypes.oneOfType([
        _react.PropTypes.number,
        _react.PropTypes.string
    ])
};
const _default = FormLabel;

},{"./styles.mjs":24,"glamor":undefined,"react":undefined}],24:[function(require,module,exports){
// ==============================
// Form Label
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    'FormLabel': {
        color: _theme.default.form.label.color,
        fontSize: _theme.default.form.label.fontSize,
        fontWeight: _theme.default.form.label.fontWeight,
        display: 'inline-block',
        marginBottom: '0.5em'
    },
    // when inside a horizontal form
    'FormLabel--form-layout-horizontal': {
        [`@media (min-width: ${_theme.default.breakpoint.tabletLandscapeMin})`]: {
            display: 'table-cell',
            lineHeight: _theme.default.component.lineHeight,
            marginBottom: 0,
            paddingRight: 5,
            verticalAlign: 'top',
            width: _theme.default.form.label.width
        }
    },
    // crop long text
    'FormLabel--crop-text': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
};

},{"../../../theme.mjs":71}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a styled form note (helper text) below a form field.
 *
 * Accepts either `children` or an `html` prop to set content. Providing both
 * at the same time is an error — the component logs a warning and renders the
 * `html` prop in that case.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge onto the root element.
 * @param {React.ReactNode} [props.children] - Child nodes rendered when `html` is not provided.
 * @param {(function(): void)|string} [props.component] - Root element type or component to render. Defaults to 'div'.
 * @param {string} [props.html] - Raw HTML string rendered via dangerouslySetInnerHTML.
 * @returns {React.Element} The rendered form note element.
 */ function FormNote(_0) {
    let { className, children, component: Component, html } = _0, props = _object_without_properties(_0, [
        "className",
        "children",
        "component",
        "html"
    ]);
    props.className = (0, _glamor.css)(_styles.default.note, className);
    // Property Violation
    if (children && html) {
        console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
    }
    return html ? /*#__PURE__*/ _react.default.createElement(Component, _object_spread_props(_object_spread({}, props), {
        dangerouslySetInnerHTML: {
            __html: html
        }
    })) : /*#__PURE__*/ _react.default.createElement(Component, props, children);
}
FormNote.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]),
    html: _react.PropTypes.string
};
FormNote.defaultProps = {
    component: 'div'
};
const _default = FormNote;

},{"./styles.mjs":26,"glamor":undefined,"react":undefined}],26:[function(require,module,exports){
// ==============================
// Form Note
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    note: {
        color: _theme.default.form.note.color,
        fontSize: _theme.default.form.note.fontSize,
        marginTop: _theme.default.spacing.small
    }
};

},{"../../../theme.mjs":71}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A styled select element wrapped in a container with custom arrow indicators.
 * Accepts either an `options` array or `children` — providing both logs a console error.
 * Inherits `formFieldId` from context to use as the element id when no `id` prop is given.
 */ class FormSelect extends _react.Component {
    /**
	 * Renders a container div with a native `<select>` element and decorative arrow spans.
	 * When `options` is provided the options are rendered from that array; otherwise
	 * `children` are rendered directly inside the `<select>`.
	 * @returns {React.Element} The rendered FormSelect markup.
	 */ render() {
        const _this_props = this.props, { children, id, options } = _this_props, props = _object_without_properties(_this_props, [
            "children",
            "id",
            "options"
        ]);
        const { formFieldId } = this.context;
        props.className = (0, _glamor.css)(_styles.default.select, props.disabled ? _styles.default['select--disabled'] : null);
        props.id = id || formFieldId;
        // Property Violation
        if (options && children) {
            console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
        }
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(_styles.default.container)
        }, options ? /*#__PURE__*/ _react.default.createElement("select", props, options.map((opt)=>/*#__PURE__*/ _react.default.createElement("option", {
                key: opt.value,
                value: opt.value
            }, opt.label))) : /*#__PURE__*/ _react.default.createElement("select", props, children), /*#__PURE__*/ _react.default.createElement("span", {
            className: (0, _glamor.css)(_styles.default.arrows, props.disabled ? _styles.default['arrows--disabled'] : null)
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: (0, _glamor.css)(_styles.default.arrow, _styles.default.arrowTop)
        }), /*#__PURE__*/ _react.default.createElement("span", {
            className: (0, _glamor.css)(_styles.default.arrow, _styles.default.arrowBottom)
        })));
    }
}
FormSelect.contextTypes = {
    formFieldId: _react.PropTypes.string
};
FormSelect.propTypes = {
    onChange: _react.PropTypes.func.isRequired,
    options: _react.default.PropTypes.arrayOf(_react.default.PropTypes.shape({
        label: _react.default.PropTypes.string,
        value: _react.default.PropTypes.string
    })),
    value: _react.PropTypes.oneOfType([
        _react.PropTypes.number,
        _react.PropTypes.string
    ])
};
const _default = FormSelect;

},{"./styles.mjs":28,"glamor":undefined,"react":undefined}],28:[function(require,module,exports){
// ==============================
// Form Select
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _color = require("../../../utils/color.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    container: {
        position: 'relative'
    },
    // select node
    select: {
        appearance: 'none',
        backgroundColor: _theme.default.input.background.default,
        backgroundImage: 'none',
        borderColor: _theme.default.input.border.color.default,
        borderBottomColor: (0, _color.darken)(_theme.default.input.border.color.default, 4),
        borderTopColor: (0, _color.lighten)(_theme.default.input.border.color.default, 4),
        borderRadius: _theme.default.input.border.radius,
        borderStyle: 'solid',
        borderWidth: _theme.default.input.border.width,
        boxShadow: _theme.default.select.boxShadow,
        color: 'inherit',
        display: 'block',
        height: _theme.default.input.height,
        lineHeight: _theme.default.input.lineHeight,
        padding: `0 ${_theme.default.input.paddingHorizontal}`,
        transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
        width: '100%',
        ':hover': {
            borderColor: _theme.default.input.border.color.hover,
            outline: 0
        },
        ':focus': {
            borderColor: _theme.default.input.border.color.focus,
            boxShadow: _theme.default.input.boxShadowFocus,
            outline: 0
        }
    },
    'select--disabled': {
        backgroundColor: _theme.default.input.background.disabled,
        pointerEvents: 'none'
    },
    // arrows
    arrows: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: _theme.default.input.height,
        justifyContent: 'center',
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
        width: _theme.default.input.height
    },
    arrow: {
        borderLeft: '0.3em solid transparent',
        borderRight: '0.3em solid transparent',
        display: 'inline-block',
        height: 0,
        verticalAlign: 'middle',
        width: 0,
        zIndex: 1
    },
    arrowTop: {
        borderBottom: '0.3em solid',
        marginBottom: '0.1em'
    },
    arrowBottom: {
        borderTop: '0.3em solid',
        marginTop: '0.1em'
    }
};

},{"../../../theme.mjs":71,"../../../utils/color.mjs":72}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    danger: _theme.default.glyph.color.danger,
    inherit: _theme.default.glyph.color.inherit,
    inverted: _theme.default.glyph.color.inverted,
    primary: _theme.default.glyph.color.primary,
    success: _theme.default.glyph.color.success,
    warning: _theme.default.glyph.color.warning
};

},{"../../../theme.mjs":71}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _octicons = /*#__PURE__*/ _interop_require_default(require("./octicons.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size
/**
 * Renders an octicon glyph icon as a configurable component.
 *
 * Applies glamor-generated class names for the base glyph style, the chosen
 * predefined color variant, and the chosen size variant, then appends the
 * octicon-specific CSS class for the requested icon name.  When `color` is not
 * one of the predefined color keys it is applied as an inline `color` style
 * instead, allowing arbitrary CSS color strings.
 * @param {object} props - Component props.
 * @param {object} [props.cssStyles] - A glamor style object merged into the generated class name.
 * @param {string} [props.className] - Additional CSS class names appended after the generated ones.
 * @param {string} [props.color] - Predefined color key or any CSS color string. Defaults to 'inherit'.
 * @param {string} [props.component] - HTML tag or React component used as the root element. Defaults to 'i'.
 * @param {string} props.name - Octicon icon name; must be a key of the octicons map.
 * @param {string} [props.size] - Predefined size key from the sizes map. Defaults to 'small'.
 * @param {object} [props.style] - Inline styles merged with the generated color style.
 * @returns {React.Element} The rendered icon element.
 */ function Glyph(_0) {
    let { cssStyles, className, color, component: Component, name, size, style } = _0, props = _object_without_properties(_0, [
        "cssStyles",
        "className",
        "color",
        "component",
        "name",
        "size",
        "style"
    ]);
    const colorIsValidType = Object.keys(_colors.default).includes(color);
    props.className = (0, _glamor.css)(_styles.default.glyph, colorIsValidType && _styles.default['color__' + color], _styles.default['size__' + size], cssStyles) + ` ${_octicons.default[name]}`;
    if (className) {
        props.className += ' ' + className;
    }
    // support random color strings
    props.style = _object_spread({
        color: !colorIsValidType ? color : null
    }, style);
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
Glyph.propTypes = {
    color: _react.PropTypes.oneOfType([
        _react.PropTypes.oneOf(Object.keys(_colors.default)),
        _react.PropTypes.string
    ]),
    cssStyles: _react.PropTypes.shape({
        _definition: _react.PropTypes.object,
        _name: _react.PropTypes.string
    }),
    name: _react.PropTypes.oneOf(Object.keys(_octicons.default)).isRequired,
    size: _react.PropTypes.oneOf(Object.keys(_sizes.default))
};
Glyph.defaultProps = {
    component: 'i',
    color: 'inherit',
    size: 'small'
};
const _default = Glyph;

},{"./colors.mjs":29,"./octicons.mjs":31,"./sizes.mjs":32,"./styles.mjs":33,"glamor":undefined,"react":undefined}],31:[function(require,module,exports){
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = {
    alert: 'octicon octicon-alert',
    'arrow-down': 'octicon octicon-arrow-down',
    'arrow-left': 'octicon octicon-arrow-left',
    'arrow-right': 'octicon octicon-arrow-right',
    'arrow-small-down': 'octicon octicon-arrow-small-down',
    'arrow-small-left': 'octicon octicon-arrow-small-left',
    'arrow-small-right': 'octicon octicon-arrow-small-right',
    'arrow-small-up': 'octicon octicon-arrow-small-up',
    'arrow-up': 'octicon octicon-arrow-up',
    microscope: 'octicon octicon-microscope',
    beaker: 'octicon octicon-beaker',
    bell: 'octicon octicon-bell',
    book: 'octicon octicon-book',
    bookmark: 'octicon octicon-bookmark',
    briefcase: 'octicon octicon-briefcase',
    broadcast: 'octicon octicon-broadcast',
    browser: 'octicon octicon-browser',
    bug: 'octicon octicon-bug',
    calendar: 'octicon octicon-calendar',
    check: 'octicon octicon-check',
    checklist: 'octicon octicon-checklist',
    'chevron-down': 'octicon octicon-chevron-down',
    'chevron-left': 'octicon octicon-chevron-left',
    'chevron-right': 'octicon octicon-chevron-right',
    'chevron-up': 'octicon octicon-chevron-up',
    'circle-slash': 'octicon octicon-circle-slash',
    'circuit-board': 'octicon octicon-circuit-board',
    clippy: 'octicon octicon-clippy',
    clock: 'octicon octicon-clock',
    'cloud-download': 'octicon octicon-cloud-download',
    'cloud-upload': 'octicon octicon-cloud-upload',
    code: 'octicon octicon-code',
    'color-mode': 'octicon octicon-color-mode',
    'comment-add': 'octicon octicon-comment-add',
    comment: 'octicon octicon-comment',
    'comment-discussion': 'octicon octicon-comment-discussion',
    'credit-card': 'octicon octicon-credit-card',
    dash: 'octicon octicon-dash',
    dashboard: 'octicon octicon-dashboard',
    database: 'octicon octicon-database',
    clone: 'octicon octicon-clone',
    'desktop-download': 'octicon octicon-desktop-download',
    'device-camera': 'octicon octicon-device-camera',
    'device-camera-video': 'octicon octicon-device-camera-video',
    'device-desktop': 'octicon octicon-device-desktop',
    'device-mobile': 'octicon octicon-device-mobile',
    diff: 'octicon octicon-diff',
    'diff-added': 'octicon octicon-diff-added',
    'diff-ignored': 'octicon octicon-diff-ignored',
    'diff-modified': 'octicon octicon-diff-modified',
    'diff-removed': 'octicon octicon-diff-removed',
    'diff-renamed': 'octicon octicon-diff-renamed',
    ellipsis: 'octicon octicon-ellipsis',
    'eye-unwatch': 'octicon octicon-eye-unwatch',
    'eye-watch': 'octicon octicon-eye-watch',
    eye: 'octicon octicon-eye',
    'file-binary': 'octicon octicon-file-binary',
    'file-code': 'octicon octicon-file-code',
    'file-directory': 'octicon octicon-file-directory',
    'file-media': 'octicon octicon-file-media',
    'file-pdf': 'octicon octicon-file-pdf',
    'file-submodule': 'octicon octicon-file-submodule',
    'file-symlink-directory': 'octicon octicon-file-symlink-directory',
    'file-symlink-file': 'octicon octicon-file-symlink-file',
    'file-text': 'octicon octicon-file-text',
    'file-zip': 'octicon octicon-file-zip',
    flame: 'octicon octicon-flame',
    fold: 'octicon octicon-fold',
    gear: 'octicon octicon-gear',
    gift: 'octicon octicon-gift',
    gist: 'octicon octicon-gist',
    'gist-secret': 'octicon octicon-gist-secret',
    'git-branch-create': 'octicon octicon-git-branch-create',
    'git-branch-delete': 'octicon octicon-git-branch-delete',
    'git-branch': 'octicon octicon-git-branch',
    'git-commit': 'octicon octicon-git-commit',
    'git-compare': 'octicon octicon-git-compare',
    'git-merge': 'octicon octicon-git-merge',
    'git-pull-request-abandoned': 'octicon octicon-git-pull-request-abandoned',
    'git-pull-request': 'octicon octicon-git-pull-request',
    globe: 'octicon octicon-globe',
    graph: 'octicon octicon-graph',
    heart: 'octicon octicon-heart',
    history: 'octicon octicon-history',
    home: 'octicon octicon-home',
    'horizontal-rule': 'octicon octicon-horizontal-rule',
    hubot: 'octicon octicon-hubot',
    inbox: 'octicon octicon-inbox',
    info: 'octicon octicon-info',
    'issue-closed': 'octicon octicon-issue-closed',
    'issue-opened': 'octicon octicon-issue-opened',
    'issue-reopened': 'octicon octicon-issue-reopened',
    jersey: 'octicon octicon-jersey',
    key: 'octicon octicon-key',
    keyboard: 'octicon octicon-keyboard',
    law: 'octicon octicon-law',
    'light-bulb': 'octicon octicon-light-bulb',
    link: 'octicon octicon-link',
    'link-external': 'octicon octicon-link-external',
    'list-ordered': 'octicon octicon-list-ordered',
    'list-unordered': 'octicon octicon-list-unordered',
    location: 'octicon octicon-location',
    'gist-private': 'octicon octicon-gist-private',
    'mirror-private': 'octicon octicon-mirror-private',
    'git-fork-private': 'octicon octicon-git-fork-private',
    lock: 'octicon octicon-lock',
    'logo-github': 'octicon octicon-logo-github',
    mail: 'octicon octicon-mail',
    'mail-read': 'octicon octicon-mail-read',
    'mail-reply': 'octicon octicon-mail-reply',
    'mark-github': 'octicon octicon-mark-github',
    markdown: 'octicon octicon-markdown',
    megaphone: 'octicon octicon-megaphone',
    mention: 'octicon octicon-mention',
    milestone: 'octicon octicon-milestone',
    'mirror-public': 'octicon octicon-mirror-public',
    mirror: 'octicon octicon-mirror',
    'mortar-board': 'octicon octicon-mortar-board',
    mute: 'octicon octicon-mute',
    'no-newline': 'octicon octicon-no-newline',
    octoface: 'octicon octicon-octoface',
    organization: 'octicon octicon-organization',
    package: 'octicon octicon-package',
    paintcan: 'octicon octicon-paintcan',
    pencil: 'octicon octicon-pencil',
    'person-add': 'octicon octicon-person-add',
    'person-follow': 'octicon octicon-person-follow',
    person: 'octicon octicon-person',
    pin: 'octicon octicon-pin',
    plug: 'octicon octicon-plug',
    'repo-create': 'octicon octicon-repo-create',
    'gist-new': 'octicon octicon-gist-new',
    'file-directory-create': 'octicon octicon-file-directory-create',
    'file-add': 'octicon octicon-file-add',
    plus: 'octicon octicon-plus',
    'primitive-dot': 'octicon octicon-primitive-dot',
    'primitive-square': 'octicon octicon-primitive-square',
    pulse: 'octicon octicon-pulse',
    question: 'octicon octicon-question',
    quote: 'octicon octicon-quote',
    'radio-tower': 'octicon octicon-radio-tower',
    'repo-delete': 'octicon octicon-repo-delete',
    repo: 'octicon octicon-repo',
    'repo-clone': 'octicon octicon-repo-clone',
    'repo-force-push': 'octicon octicon-repo-force-push',
    'gist-fork': 'octicon octicon-gist-fork',
    'repo-forked': 'octicon octicon-repo-forked',
    'repo-pull': 'octicon octicon-repo-pull',
    'repo-push': 'octicon octicon-repo-push',
    rocket: 'octicon octicon-rocket',
    rss: 'octicon octicon-rss',
    ruby: 'octicon octicon-ruby',
    'screen-full': 'octicon octicon-screen-full',
    'screen-normal': 'octicon octicon-screen-normal',
    'search-save': 'octicon octicon-search-save',
    search: 'octicon octicon-search',
    server: 'octicon octicon-server',
    settings: 'octicon octicon-settings',
    shield: 'octicon octicon-shield',
    'log-in': 'octicon octicon-log-in',
    'sign-in': 'octicon octicon-sign-in',
    'log-out': 'octicon octicon-log-out',
    'sign-out': 'octicon octicon-sign-out',
    squirrel: 'octicon octicon-squirrel',
    'star-add': 'octicon octicon-star-add',
    'star-delete': 'octicon octicon-star-delete',
    star: 'octicon octicon-star',
    stop: 'octicon octicon-stop',
    'repo-sync': 'octicon octicon-repo-sync',
    sync: 'octicon octicon-sync',
    'tag-remove': 'octicon octicon-tag-remove',
    'tag-add': 'octicon octicon-tag-add',
    tag: 'octicon octicon-tag',
    telescope: 'octicon octicon-telescope',
    terminal: 'octicon octicon-terminal',
    'three-bars': 'octicon octicon-three-bars',
    thumbsdown: 'octicon octicon-thumbsdown',
    thumbsup: 'octicon octicon-thumbsup',
    tools: 'octicon octicon-tools',
    trashcan: 'octicon octicon-trashcan',
    'triangle-down': 'octicon octicon-triangle-down',
    'triangle-left': 'octicon octicon-triangle-left',
    'triangle-right': 'octicon octicon-triangle-right',
    'triangle-up': 'octicon octicon-triangle-up',
    unfold: 'octicon octicon-unfold',
    unmute: 'octicon octicon-unmute',
    versions: 'octicon octicon-versions',
    watch: 'octicon octicon-watch',
    'remove-close': 'octicon octicon-remove-close',
    x: 'octicon octicon-x',
    zap: 'octicon octicon-zap'
};

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    small: _theme.default.glyph.size.small,
    medium: _theme.default.glyph.size.medium,
    large: _theme.default.glyph.size.large
};

},{"../../../theme.mjs":71}],33:[function(require,module,exports){
// ==============================
// Glyph
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
// Prepare variants
const colorVariants = {};
Object.keys(_colors.default).forEach((color)=>{
    colorVariants[`color__${color}`] = {
        color: _colors.default[color]
    };
});
// Prepare sizes
const sizeVariants = {};
Object.keys(_sizes.default).forEach((size)=>{
    sizeVariants[`size__${size}`] = {
        fontSize: _sizes.default[size]
    };
});
const _default = _object_spread({
    glyph: {}
}, colorVariants, sizeVariants);

},{"./colors.mjs":29,"./sizes.mjs":32}],34:[function(require,module,exports){
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _index = /*#__PURE__*/ _interop_require_default(require("../Button/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../Glyph/index.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A Button that renders an inline Glyph icon alongside its children.
 *
 * The icon is positioned to the left of children when `position` is 'default'
 * or 'left', and to the right when `position` is 'right'. An automatic
 * horizontal margin offset is applied to separate the icon from the text.
 * All extra props are forwarded to the underlying Button component.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - Content rendered between or after the icon.
 * @param {string} [props.glyph] - Name of the glyph icon to render (validated by Glyph).
 * @param {string} [props.glyphColor] - Color passed to the Glyph component.
 * @param {string} [props.glyphSize] - Size passed to the Glyph component.
 * @param {object} [props.glyphStyle] - Additional inline styles merged onto the Glyph.
 * @param {'default'|'left'|'right'} [props.position] - Icon placement; 'default' and 'left' place the icon before children, 'right' places it after. Defaults to 'default'.
 * @returns {React.Element} A Button element containing the positioned icon and children.
 */ function GlyphButton(_0) {
    let { children, glyph, glyphColor, glyphSize, glyphStyle, position } = _0, props = _object_without_properties(_0, [
        "children",
        "glyph",
        "glyphColor",
        "glyphSize",
        "glyphStyle",
        "position"
    ]);
    const isDefault = position === 'default';
    const isLeft = position === 'left';
    const isRight = position === 'right';
    const offset = {};
    if (isLeft) offset.marginRight = '0.5em';
    if (isRight) offset.marginLeft = '0.5em';
    const glyphStyles = _object_spread({}, offset, glyphStyle);
    const icon = /*#__PURE__*/ _react.default.createElement(_index1.default, {
        cssStyles: classes.glyph,
        color: glyphColor,
        name: glyph,
        size: glyphSize,
        style: glyphStyles
    });
    return /*#__PURE__*/ _react.default.createElement(_index.default, props, (isDefault || isLeft) && icon, children, isRight && icon);
}
// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphButton.propTypes = {
    glyph: _react.PropTypes.string,
    glyphColor: _react.PropTypes.string,
    glyphSize: _react.PropTypes.string,
    glyphStyle: _react.PropTypes.object,
    position: _react.PropTypes.oneOf([
        'default',
        'left',
        'right'
    ])
};
GlyphButton.defaultProps = {
    glyphStyle: {},
    position: 'default'
};
const classes = {
    glyph: {
        display: 'inline-block',
        marginTop: '-0.125em',
        verticalAlign: 'middle'
    }
};
const _default = GlyphButton;

},{"../Button/index.mjs":5,"../Glyph/index.mjs":30,"react":undefined}],35:[function(require,module,exports){
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _index = /*#__PURE__*/ _interop_require_default(require("../FormField/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../Glyph/index.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A form field that renders a Glyph icon positioned to the left or right of its children.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content rendered inside the field, adjacent to the icon.
 * @param {string} [props.glyph] - Name of the glyph icon to display (validated by the Glyph component).
 * @param {string} [props.glyphColor] - Color of the glyph icon (validated by the Glyph component).
 * @param {string} [props.glyphSize] - Size of the glyph icon (validated by the Glyph component).
 * @param {'left'|'right'} [props.position] - Side on which the icon is rendered relative to children.
 * @returns {React.Element} A Field element containing the positioned Glyph icon and children.
 */ function GlyphField(_0) {
    let { children, glyph, glyphColor, glyphSize, position } = _0, props = _object_without_properties(_0, [
        "children",
        "glyph",
        "glyphColor",
        "glyphSize",
        "position"
    ]);
    const isLeft = position === 'left';
    const isRight = position === 'right';
    const glyphStyles = {};
    if (isLeft) glyphStyles.marginRight = '0.5em';
    if (isRight) glyphStyles.marginLeft = '0.5em';
    const icon = /*#__PURE__*/ _react.default.createElement(_index1.default, {
        cssStyles: classes.glyph,
        color: glyphColor,
        name: glyph,
        size: glyphSize,
        style: glyphStyles
    });
    return /*#__PURE__*/ _react.default.createElement(_index.default, _object_spread({
        cssStyles: classes.wrapper
    }, props), isLeft && icon, children, isRight && icon);
}
// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphField.propTypes = {
    glyph: _react.PropTypes.string,
    glyphColor: _react.PropTypes.string,
    glyphSize: _react.PropTypes.string,
    position: _react.PropTypes.oneOf([
        'left',
        'right'
    ])
};
GlyphField.defaultProps = {
    position: 'left'
};
const classes = {
    wrapper: {
        alignItems: 'center',
        display: 'flex'
    },
    glyph: {
        display: 'inline-block',
        marginTop: '-0.125em',
        verticalAlign: 'middle'
    }
};
const _default = GlyphField;

},{"../FormField/index.mjs":18,"../Glyph/index.mjs":30,"react":undefined}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Col () {
        return _index.default;
    },
    get Row () {
        return _index1.default;
    },
    get default () {
        return _default;
    }
});
const _index = /*#__PURE__*/ _interop_require_default(require("../GridCol/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../GridRow/index.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    Col: _index.default,
    Row: _index1.default
};

},{"../GridCol/index.mjs":37,"../GridRow/index.mjs":38}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
const WIDTHS = {
    'one-whole': '100%',
    'one-half': '50%',
    'one-third': '33.33%',
    'two-thirds': '66.66%',
    'one-quarter': '25%',
    'three-quarters': '75%',
    'one-fifth': '20%',
    'two-fifths': '40%',
    'three-fifths': '60%',
    'four-fifths': '80%',
    'one-sixth': '16.66%',
    'five-sixths': '83.33%'
};
const GridCol = (props, context)=>{
    const gutter = props.gutter || context.gutter;
    const xsmall = props.xsmall || context.xsmall;
    const small = props.small || context.small;
    const medium = props.medium || context.medium;
    const large = props.large || context.large;
    const className = (0, _glamor.css)(classes['xsmall-' + xsmall], classes['small-' + small], classes['medium-' + medium], classes['large-' + large]);
    const componentClassName = `${className}${props.className ? ' ' + props.className : ''}`;
    const componentStyles = gutter ? {
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2
    } : {};
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: componentClassName,
        style: componentStyles
    }, props.children);
};
GridCol.contextTypes = {
    gutter: _react.PropTypes.number,
    large: _react.PropTypes.string,
    medium: _react.PropTypes.string,
    small: _react.PropTypes.string,
    xsmall: _react.PropTypes.string
};
GridCol.propTypes = {
    gutter: _react.PropTypes.number,
    large: _react.PropTypes.string,
    medium: _react.PropTypes.string,
    small: _react.PropTypes.string,
    xsmall: _react.PropTypes.string
};
const classes = _object_spread({}, prepareWidths('xsmall', WIDTHS), prepareWidths('small', WIDTHS), prepareWidths('medium', WIDTHS), prepareWidths('large', WIDTHS));
function prepareWidths(prefix, obj) {
    const classes = {};
    switch(prefix){
        case 'small':
            for(const prop in obj){
                classes[prefix + '-' + prop] = {
                    [`@media (min-width: ${_theme.default.breakpoint.tabletPortraitMin})`]: {
                        width: obj[prop]
                    }
                };
            }
            break;
        case 'medium':
            for(const prop in obj){
                classes[prefix + '-' + prop] = {
                    [`@media (min-width: ${_theme.default.breakpoint.tabletLandscapeMin})`]: {
                        width: obj[prop]
                    }
                };
            }
            break;
        case 'large':
            for(const prop in obj){
                classes[prefix + '-' + prop] = {
                    [`@media (min-width: ${_theme.default.breakpoint.desktopMin})`]: {
                        width: obj[prop]
                    }
                };
            }
            break;
        default:
            for(const prop in obj){
                classes[prefix + '-' + prop] = {
                    width: obj[prop]
                };
            }
    }
    return classes;
}
const _default = GridCol;

},{"../../../theme.mjs":71,"glamor":undefined,"react":undefined}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
/**
 * A flex-based grid row that distributes gutter and breakpoint props to child
 * GridCol components via React context.
 */ class GridRow extends _react.Component {
    /**
	 * Exposes gutter and breakpoint props as child context so GridCol
	 * components can read them without requiring explicit prop drilling.
	 * @returns {object} Child context containing gutter, xsmall, small, medium, and large values.
	 */ getChildContext() {
        return {
            gutter: this.props.gutter,
            xsmall: this.props.xsmall,
            small: this.props.small,
            medium: this.props.medium,
            large: this.props.large
        };
    }
    /**
	 * Renders a flex-wrap div with computed class name and negative horizontal
	 * margins derived from the gutter prop, wrapping the row's children.
	 * @returns {React.Element} A div element containing the row's children.
	 */ render() {
        const { children, className, gutter, styles = {} } = this.props;
        const componentClassName = `${(0, _glamor.css)(classes.grid)}${className ? ' ' + className : ''}`;
        const componentStyles = Object.assign(styles, {
            marginLeft: gutter / -2,
            marginRight: gutter / -2
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: componentClassName,
            style: componentStyles
        }, children);
    }
}
GridRow.childContextTypes = {
    gutter: _react.PropTypes.number,
    xsmall: _react.PropTypes.string,
    small: _react.PropTypes.string,
    medium: _react.PropTypes.string,
    large: _react.PropTypes.string
};
GridRow.propTypes = {
    gutter: _react.PropTypes.number,
    large: _react.PropTypes.string,
    medium: _react.PropTypes.string,
    small: _react.PropTypes.string,
    xsmall: _react.PropTypes.string
};
GridRow.defaultProps = {
    gutter: 0,
    xsmall: 'one-whole'
};
const classes = {
    grid: {
        display: 'flex',
        flexWrap: 'wrap'
    }
};
const _default = GridRow;

},{"glamor":undefined,"react":undefined}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// NOTE: only accepts InlineGroupSection as a single child
/**
 * Renders a group of child elements laid out inline (or as a block) using
 * flexbox. Each child is cloned with a `position` prop ('only', 'first',
 * 'last', or 'middle') and a `contiguous` prop so that child components can
 * adjust their own styling based on their position within the group.
 * @param {object} props - Component props.
 * @param {boolean} [props.block] - When true, the group uses `display: flex`
 *   instead of the default `display: inline-flex`.
 * @param {React.Node} [props.children] - Child elements to render inside the group.
 * @param {string} [props.className] - Additional CSS class name appended to
 *   the glamor-generated class.
 * @param {string|React.ComponentType} [props.component] - HTML tag or React
 *   component used as the container element.
 * @param {boolean} [props.contiguous] - Passed through to every child element
 *   so children can render contiguous (borderless) styles.
 * @param {object} [props.cssStyles] - A glamor CSS-rule object applied to the
 *   container element.
 * @returns {React.Element} The rendered container element with cloned children.
 */ function InlineGroup(_0) {
    let { cssStyles, block, children, className, component: Component, contiguous } = _0, props = _object_without_properties(_0, [
        "cssStyles",
        "block",
        "children",
        "className",
        "component",
        "contiguous"
    ]);
    // prepare group className
    props.className = (0, _glamor.css)(classes.group, !!block && classes.block, cssStyles);
    if (className) {
        props.className += ' ' + className;
    }
    // convert children to an array and filter out falsey values
    const buttons = _react.Children.toArray(children).filter((i)=>i);
    // normalize the count
    const count = buttons.length - 1;
    // clone children and apply classNames that glamor can target
    props.children = buttons.map((c, idx)=>{
        if (!c) return null;
        const isOnlyChild = !count;
        const isFirstChild = !isOnlyChild && idx === 0;
        const isLastChild = !isOnlyChild && idx === count;
        const isMiddleChild = !isOnlyChild && !isFirstChild && !isLastChild;
        let position;
        if (isOnlyChild) position = 'only';
        if (isFirstChild) position = 'first';
        if (isLastChild) position = 'last';
        if (isMiddleChild) position = 'middle';
        return /*#__PURE__*/ (0, _react.cloneElement)(c, {
            contiguous: contiguous,
            position
        });
    });
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
InlineGroup.propTypes = {
    block: _react.PropTypes.bool,
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.func,
        _react.PropTypes.string
    ]),
    contiguous: _react.PropTypes.bool,
    cssStyles: _react.PropTypes.shape({
        _definition: _react.PropTypes.object,
        _name: _react.PropTypes.string
    })
};
InlineGroup.defaultProps = {
    component: 'div'
};
const classes = {
    group: {
        display: 'inline-flex'
    },
    block: {
        display: 'flex'
    }
};
const _default = InlineGroup;

},{"glamor":undefined,"react":undefined}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// NOTE: Inline Group Section accepts a single child
/**
 * A layout section used inside an InlineGroup that accepts a single child
 * element. When `contiguous` is true, positional and state styles are applied
 * directly to the child via `cloneElement`; otherwise the child is wrapped in
 * a `<div>` with the appropriate glamor class names.
 * @param {object} props - Component props.
 * @param {boolean} [props.active] - Whether the section is in an active state (buttons only).
 * @param {Array|object} [props.cssStyles] - Additional glamor styles forwarded to the child or wrapper.
 * @param {React.Element} props.children - The single child element to render.
 * @param {string} [props.className] - Additional CSS class name (passed through via rest props).
 * @param {boolean} [props.contiguous] - When true, styles are applied directly to the child element.
 * @param {boolean} [props.grow] - When true, the section expands to fill available space.
 * @param {'first'|'last'|'middle'|'only'} [props.position] - Position of this section within the group.
 * @returns {React.Element} The rendered section element.
 */ function InlineGroupSection(_0) {
    let { active, cssStyles, children, className, contiguous, grow, position } = _0, props = _object_without_properties(_0, [
        "active",
        "cssStyles",
        "children",
        "className",
        "contiguous",
        "grow",
        "position"
    ]);
    // evaluate position
    const separate = position === 'last' || position === 'middle';
    // A `contiguous` section must manipulate it's child directly
    // A separate (default) section just wraps the child
    return contiguous ? /*#__PURE__*/ (0, _react.cloneElement)(children, _object_spread({
        cssStyles: [
            _styles.default.contiguous,
            _styles.default['contiguous__' + position],
            active ? _styles.default.active : null,
            grow ? _styles.default.grow : null,
            cssStyles
        ]
    }, props)) : /*#__PURE__*/ _react.default.createElement("div", _object_spread({
        className: (0, _glamor.css)(!!grow && _styles.default.grow, !!separate && _styles.default.separate, cssStyles)
    }, props), children);
}
InlineGroupSection.propTypes = {
    active: _react.PropTypes.bool,
    children: _react.PropTypes.element.isRequired,
    contiguous: _react.PropTypes.bool,
    grow: _react.PropTypes.bool,
    position: _react.PropTypes.oneOf([
        'first',
        'last',
        'middle',
        'only'
    ])
};
const _default = InlineGroupSection;

},{"./styles.mjs":41,"glamor":undefined,"react":undefined}],41:[function(require,module,exports){
// ==============================
// Inline Group: Section
// ==============================
// Takes only FormInput and Button as children, rendering them as a
// tidy inline array
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    // pull active elements up
    active: {
        position: 'relative'
    },
    // stretch to fill available width
    grow: {
        flex: '1 1 0'
    },
    // separate applicable non-contiguous elements
    separate: {
        paddingLeft: '0.75em'
    },
    // Contiguous: manipulate children directly
    // pull focused contiguous elements up
    contiguous: {
        ':focus': {
            position: 'relative',
            zIndex: 1
        }
    },
    // position
    contiguous__middle: {
        borderRadius: 0,
        marginLeft: _theme.default.button.borderWidth * -1
    },
    contiguous__first: {
        borderBottomRightRadius: '0 !important',
        borderTopRightRadius: '0 !important'
    },
    contiguous__last: {
        borderBottomLeftRadius: '0 !important',
        borderTopLeftRadius: '0 !important',
        marginLeft: _theme.default.button.borderWidth * -1
    }
};

},{"../../../theme.mjs":71}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a labelled checkbox or radio control.
 *
 * Wraps an `<input>` (checkbox or radio) and a `<span>` label inside a
 * `<label>` element so that clicking the label text activates the control.
 * When `inline` is true, an additional CSS modifier class is applied to
 * display the wrapper inline.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class passed to glamor for the wrapper.
 * @param {boolean} [props.inline] - When true, applies the inline wrapper modifier style.
 * @param {React.ReactNode} [props.label] - Content rendered inside the label `<span>`.
 * @param {string} [props.title] - HTML `title` attribute placed on the outer `<label>` element.
 * @param {'checkbox'|'radio'} props.type - Input type; must be `'checkbox'` or `'radio'`.
 * @returns {React.Element} A `<label>` element containing the input and label text.
 */ function LabelledControl(_0) {
    let { className, inline, label, title } = _0, props = _object_without_properties(_0, [
        "className",
        "inline",
        "label",
        "title"
    ]);
    const labelClassName = (0, _glamor.css)(_styles.default.wrapper, inline && _styles.default.wrapper__inline, className);
    return /*#__PURE__*/ _react.default.createElement("label", {
        title: title,
        className: labelClassName
    }, /*#__PURE__*/ _react.default.createElement("input", _object_spread_props(_object_spread({}, props), {
        className: (0, _glamor.css)(_styles.default.control)
    })), /*#__PURE__*/ _react.default.createElement("span", {
        className: (0, _glamor.css)(_styles.default.label)
    }, label));
}
LabelledControl.propTypes = {
    inline: _react.PropTypes.bool,
    title: _react.PropTypes.string,
    type: _react.PropTypes.oneOf([
        'checkbox',
        'radio'
    ]).isRequired
};
const _default = LabelledControl;

},{"./styles.mjs":43,"glamor":undefined,"react":undefined}],43:[function(require,module,exports){
// ==============================
// Alert
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    wrapper: {
        display: 'block',
        height: _theme.default.input.height,
        lineHeight: _theme.default.input.lineHeight
    },
    wrapper__inline: {
        display: 'inline'
    },
    // checkbox or radio
    control: {
        marginRight: '0.5em'
    }
};

},{"../../../theme.mjs":71}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _index = /*#__PURE__*/ _interop_require_default(require("../Button/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../Spinner/index.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * A Button wrapper that slides a small Spinner in and out of view based on the
 * `loading` prop. Spinner colour and variant are derived from the button's own
 * `color` and `variant` props so the two always stay in sync.
 * @param {object} props - Component props.
 * @param {React.Node} props.children - Content rendered inside the button.
 * @param {boolean} [props.loading] - When true, the spinner is visible.
 * @returns {React.Element} The rendered LoadingButton element.
 */ function LoadingButton(_0) {
    let { children, loading } = _0, props = _object_without_properties(_0, [
        "children",
        "loading"
    ]);
    // determine the correct variant for the spinner,
    // fill is the default variant on Button
    const variant = props.variant || 'fill';
    // determine the correct color for the spinner,
    // cancel and delete alias to "danger"
    let color;
    if (props.color === 'cancel' || props.color === 'delete') color = 'danger';
    // merge all the variant/color together
    const formattedColor = variant === 'fill' && props.color !== 'default' ? 'inverted' : color;
    // render the spinner if required
    const spinner = loading && /*#__PURE__*/ _react.default.createElement(_index1.default, {
        size: "small",
        color: formattedColor
    });
    // slide the spinner in and out of view
    const spinnerStyles = {
        width: loading ? _theme.default.spinner.size.small * 5 + _theme.default.spacing.small : 0
    };
    // render everything
    return /*#__PURE__*/ _react.default.createElement(_index.default, props, /*#__PURE__*/ _react.default.createElement("span", {
        className: (0, _glamor.css)(classes.spinner),
        style: spinnerStyles
    }, spinner), children);
}
LoadingButton.propTypes = {
    loading: _react.PropTypes.bool
};
LoadingButton.defaultProps = {
    loading: false
};
const classes = {
    spinner: {
        display: 'inline-block',
        overflow: 'hidden',
        textAlign: 'left',
        transition: 'width 200ms ease-out',
        verticalAlign: 'middle'
    }
};
const _default = LoadingButton;

},{"../../../theme.mjs":71,"../Button/index.mjs":5,"../Spinner/index.mjs":61,"glamor":undefined,"react":undefined}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders the body section of a modal dialog.
 *
 * Applies modal body padding from the theme and merges any additional
 * className or props onto the underlying div element.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name to apply.
 * @returns {React.Element} A styled div element containing the modal body content.
 */ function ModalBody(_0) {
    let { className } = _0, props = _object_without_properties(_0, [
        "className"
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
        className: (0, _glamor.css)(classes.body, className)
    }, props));
}
const classes = {
    body: {
        paddingBottom: _theme.default.modal.padding.body.vertical,
        paddingLeft: _theme.default.modal.padding.body.horizontal,
        paddingRight: _theme.default.modal.padding.body.horizontal,
        paddingTop: _theme.default.modal.padding.body.vertical
    }
};
const _default = ModalBody;

},{"../../../theme.mjs":71,"glamor":undefined,"react":undefined}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _index = /*#__PURE__*/ _interop_require_default(require("../ScrollLock/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../Portal/index.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const canUseDom = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * A modal dialog component that renders its content inside a Portal and supports
 * backdrop click and keyboard (Escape) dismissal.
 */ class ModalDialog extends _react.Component {
    /**
	 * Provides the `onClose` callback to descendant components via React context.
	 * @returns {object} Child context containing the `onClose` handler.
	 */ getChildContext() {
        return {
            onClose: this.props.onClose
        };
    }
    /**
	 * Adds or removes the global `keydown` listener when `isOpen` or
	 * `enableKeyboardInput` changes in the incoming props.
	 * @param {object} nextProps - The incoming props before the update is applied.
	 */ componentWillReceiveProps(nextProps) {
        if (!canUseDom) return;
        // add event listeners
        if (nextProps.isOpen && nextProps.enableKeyboardInput) {
            window.addEventListener('keydown', this.handleKeyboardInput);
        }
        if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
            window.removeEventListener('keydown', this.handleKeyboardInput);
        }
    }
    /**
	 * Removes the global `keydown` listener when the component is unmounted.
	 */ componentWillUnmount() {
        if (this.props.enableKeyboardInput) {
            window.removeEventListener('keydown', this.handleKeyboardInput);
        }
    }
    // ==============================
    // Methods
    // ==============================
    /**
	 * Calls `onClose` when the Escape key (keyCode 27) is pressed.
	 * @param {KeyboardEvent} event - The keydown event fired by the browser.
	 * @returns {boolean} Always returns `false`.
	 */ handleKeyboardInput(event) {
        if (event.keyCode === 27) this.props.onClose();
        return false;
    }
    /**
	 * Calls `onClose` when the user clicks directly on the backdrop container
	 * rather than on the dialog itself.
	 * @param {MouseEvent} e - The click or touchend event fired on the container.
	 */ handleBackdropClick(e) {
        if (e.target !== this.refs.container) return;
        this.props.onClose();
    }
    // ==============================
    // Renderers
    // ==============================
    /**
	 * Renders the backdrop and dialog box, or an empty placeholder when the
	 * dialog is closed.
	 * @returns {React.Element} The dialog element when open, or an empty `<span>` when closed.
	 */ renderDialog() {
        const { backdropClosesModal, children, isOpen, width } = this.props;
        const dataConfirmDialog = this.props['data-confirm-dialog'];
        if (!isOpen) return /*#__PURE__*/ _react.default.createElement("span", {
            key: "closed"
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.container),
            key: "open",
            ref: "container",
            onClick: !!backdropClosesModal && this.handleBackdropClick,
            onTouchEnd: !!backdropClosesModal && this.handleBackdropClick
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.dialog),
            style: {
                width
            },
            "data-screen-id": "modal-dialog",
            "data-confirm-dialog": dataConfirmDialog
        }, children), /*#__PURE__*/ _react.default.createElement(_index.default, null));
    }
    /**
	 * Renders the dialog inside a Portal so it is mounted at the document root.
	 * @returns {React.Element} A Portal wrapping the dialog output.
	 */ render() {
        return /*#__PURE__*/ _react.default.createElement(_index1.default, null, this.renderDialog());
    }
    /**
	 * Initialises the component and binds event-handler methods to the instance.
	 */ constructor(){
        super();
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    }
}
ModalDialog.propTypes = {
    backdropClosesModal: _react.PropTypes.bool,
    enableKeyboardInput: _react.PropTypes.bool,
    isOpen: _react.PropTypes.bool,
    onClose: _react.PropTypes.func.isRequired,
    'data-confirm-dialog': _react.PropTypes.bool,
    width: _react.PropTypes.number
};
ModalDialog.defaultProps = {
    enableKeyboardInput: true,
    width: 768
};
ModalDialog.childContextTypes = {
    onClose: _react.PropTypes.func.isRequired
};
const classes = {
    container: {
        alignItems: 'center',
        backgroundColor: _theme.default.modal.background,
        boxSizing: 'border-box',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: _theme.default.modal.zIndex
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: _theme.default.borderRadius.default,
        maxHeight: '90%',
        overflowY: 'auto',
        paddingBottom: _theme.default.modal.padding.dialog.vertical,
        paddingLeft: _theme.default.modal.padding.dialog.horizontal,
        paddingRight: _theme.default.modal.padding.dialog.horizontal,
        paddingTop: _theme.default.modal.padding.dialog.vertical,
        position: 'relative'
    }
};
const _default = ModalDialog;

},{"../../../theme.mjs":71,"../Portal/index.mjs":53,"../ScrollLock/index.mjs":56,"glamor":undefined,"react":undefined}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders the footer section of a modal dialog.
 *
 * Wraps its children in a flex container with themed padding and a top border.
 * Child content is aligned horizontally according to the `align` prop.
 * @param {object} props - Component props.
 * @param {'center'|'left'|'right'} props.align - Horizontal alignment of footer content. Defaults to `'left'`.
 * @param {string} [props.className] - Additional CSS class name merged with the footer styles.
 * @returns {React.Element} A `<div>` element styled as the modal footer.
 */ function ModalFooter(_0) {
    let { align, className } = _0, props = _object_without_properties(_0, [
        "align",
        "className"
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: (0, _glamor.css)(classes.footer, classes['align__' + align], className)
    }));
}
ModalFooter.propTypes = {
    align: _react.PropTypes.oneOf([
        'center',
        'left',
        'right'
    ]),
    children: _react.PropTypes.node,
    onClose: _react.PropTypes.func,
    showCloseButton: _react.PropTypes.bool,
    text: _react.PropTypes.string
};
ModalFooter.defaultProps = {
    align: 'left'
};
const classes = {
    footer: {
        borderTop: `2px solid ${_theme.default.color.gray10}`,
        display: 'flex',
        paddingBottom: _theme.default.modal.padding.footer.vertical,
        paddingLeft: _theme.default.modal.padding.footer.horizontal,
        paddingRight: _theme.default.modal.padding.footer.horizontal,
        paddingTop: _theme.default.modal.padding.footer.vertical
    },
    // alignment
    align__left: {
        justifyContent: 'flex-start'
    },
    align__center: {
        justifyContent: 'center'
    },
    align__right: {
        justifyContent: 'flex-end'
    }
};
const _default = ModalFooter;

},{"../../../theme.mjs":71,"glamor":undefined,"react":undefined}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _index = /*#__PURE__*/ _interop_require_default(require("../GlyphButton/index.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders the header section of a modal dialog.
 *
 * Displays either a text title or arbitrary children inside a flex container,
 * and optionally renders a close button on the right when `showCloseButton` is
 * true and the `onClose` context function is provided.
 *
 * Passing both `children` and `text` at the same time is not supported; a
 * console error is emitted if both are present and only `text` is rendered.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - Content to render when `text` is not provided.
 * @param {string} [props.className] - Additional glamor CSS class applied to the header element.
 * @param {boolean} [props.showCloseButton] - When true, renders a close button if `onClose` is available in context.
 * @param {string} [props.text] - Title text rendered inside an h4 element.
 * @param {object} context - React context.
 * @param {() => void} context.onClose - Callback invoked when the close button is clicked.
 * @returns {React.Element} The rendered modal header element.
 */ function ModalHeader(_0, _1) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { children, className, showCloseButton, text } = _ref1, props = _object_without_properties(_ref1, [
        "children",
        "className",
        "showCloseButton",
        "text"
    ]), [{ onClose }] = _rest;
    // Property Violation
    if (children && text) {
        console.error('Warning: ModalHeader cannot render `children` and `text`. You must provide one or the other.');
    }
    return /*#__PURE__*/ _react.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: (0, _glamor.css)(classes.header, className)
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: (0, _glamor.css)(classes.grow)
    }, text ? /*#__PURE__*/ _react.default.createElement("h4", {
        className: (0, _glamor.css)(classes.text)
    }, text) : children), !!onClose && showCloseButton && /*#__PURE__*/ _react.default.createElement(_index.default, {
        cssStyles: classes.close,
        color: "cancel",
        glyph: "x",
        onClick: onClose,
        variant: "link"
    }));
}
ModalHeader.propTypes = {
    children: _react.PropTypes.node,
    onClose: _react.PropTypes.func,
    showCloseButton: _react.PropTypes.bool,
    text: _react.PropTypes.string
};
ModalHeader.contextTypes = {
    onClose: _react.PropTypes.func.isRequired
};
const classes = {
    header: {
        alignItems: 'center',
        borderBottom: `2px solid ${_theme.default.color.gray10}`,
        display: 'flex',
        paddingBottom: _theme.default.modal.padding.header.vertical,
        paddingLeft: _theme.default.modal.padding.header.horizontal,
        paddingRight: _theme.default.modal.padding.header.horizontal,
        paddingTop: _theme.default.modal.padding.header.vertical
    },
    // fill space to push the close button right
    grow: {
        flexGrow: 1
    },
    // title text
    text: {
        color: 'inherit',
        fontSize: 18,
        fontWeight: 500,
        lineHeight: 1,
        margin: 0
    }
};
const _default = ModalHeader;

},{"../../../theme.mjs":71,"../GlyphButton/index.mjs":34,"glamor":undefined,"react":undefined}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Body () {
        return _body.default;
    },
    get Dialog () {
        return _dialog.default;
    },
    get Footer () {
        return _footer.default;
    },
    get Header () {
        return _header.default;
    },
    get default () {
        return _default;
    }
});
const _body = /*#__PURE__*/ _interop_require_default(require("./body.mjs"));
const _dialog = /*#__PURE__*/ _interop_require_default(require("./dialog.mjs"));
const _footer = /*#__PURE__*/ _interop_require_default(require("./footer.mjs"));
const _header = /*#__PURE__*/ _interop_require_default(require("./header.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    Body: _body.default,
    Dialog: _dialog.default,
    Footer: _footer.default,
    Header: _header.default
};

},{"./body.mjs":45,"./dialog.mjs":46,"./footer.mjs":47,"./header.mjs":48}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _page = /*#__PURE__*/ _interop_require_default(require("./page.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
/**
 * Pagination component that renders a record count summary and a list of
 * page number buttons. Page buttons are windowed to at most `limit` items.
 */ class Pagination extends _react.Component {
    /**
	 * Renders a text summary of which records are currently visible.
	 *
	 * When there are no records the text reads "No <plural|records>".
	 * When total exceeds pageSize it reads "Showing <start> to <end> of <total>".
	 * Otherwise it reads "Showing <total> [singular|plural]".
	 * @returns {React.Element} A div containing the count string.
	 */ renderCount() {
        let count = '';
        const { currentPage, pageSize, plural, singular, total } = this.props;
        if (!total) {
            count = 'No ' + (plural || 'records');
        } else if (total > pageSize) {
            const start = pageSize * (currentPage - 1) + 1;
            const end = Math.min(start + pageSize - 1, total);
            count = `Showing ${start} to ${end} of ${total}`;
        } else {
            count = 'Showing ' + total;
            if (total > 1 && plural) {
                count += ' ' + plural;
            } else if (total === 1 && singular) {
                count += ' ' + singular;
            }
        }
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.count),
            "data-e2e-pagination-count": true
        }, count);
    }
    /**
	 * Renders the list of page number buttons.
	 *
	 * Returns null when all records fit on a single page. When `limit` is set
	 * and smaller than the total number of pages the window is centred on
	 * `currentPage`. Ellipsis buttons ("...") are added at the start and/or end
	 * to jump to the first or last page when the window does not include them.
	 * @returns {React.Element|null} A div of Page buttons, or null.
	 */ renderPages() {
        const { currentPage, limit, onPageSelect, pageSize, total } = this.props;
        if (total <= pageSize) return null;
        const pages = [];
        const totalPages = Math.ceil(total / pageSize);
        let minPage = 1;
        let maxPage = totalPages;
        if (limit && limit < totalPages) {
            const rightLimit = Math.floor(limit / 2);
            const leftLimit = rightLimit + limit % 2 - 1;
            minPage = currentPage - leftLimit;
            maxPage = currentPage + rightLimit;
            if (minPage < 1) {
                maxPage = limit;
                minPage = 1;
            }
            if (maxPage > totalPages) {
                minPage = totalPages - limit + 1;
                maxPage = totalPages;
            }
        }
        if (minPage > 1) {
            pages.push(/*#__PURE__*/ _react.default.createElement(_page.default, {
                key: "page_start",
                onClick: ()=>onPageSelect(1)
            }, "..."));
        }
        for(let page = minPage; page <= maxPage; page++){
            const selected = page === currentPage;
            pages.push(/*#__PURE__*/ _react.default.createElement(_page.default, {
                key: 'page_' + page,
                selected: selected,
                onClick: ()=>onPageSelect(page)
            }, page));
        }
        if (maxPage < totalPages) {
            pages.push(/*#__PURE__*/ _react.default.createElement(_page.default, {
                key: "page_end",
                onClick: ()=>onPageSelect(totalPages)
            }, "..."));
        }
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.list)
        }, pages);
    }
    /**
	 * Renders the pagination container with the count summary and page buttons.
	 * @returns {React.Element} The root pagination div.
	 */ render() {
        const className = (0, _glamor.css)(classes.container, this.props.className);
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: className,
            style: this.props.style
        }, this.renderCount(), this.renderPages());
    }
}
const classes = {
    container: {
        display: 'block',
        lineHeight: _theme.default.component.lineHeight,
        marginBottom: '2em'
    },
    count: {
        display: 'inline-block',
        marginRight: '1em',
        verticalAlign: 'middle'
    },
    list: {
        display: 'inline-block',
        verticalAlign: 'middle'
    }
};
Pagination.propTypes = {
    className: _react.PropTypes.string,
    currentPage: _react.PropTypes.number.isRequired,
    limit: _react.PropTypes.number,
    onPageSelect: _react.PropTypes.func,
    pageSize: _react.PropTypes.number.isRequired,
    plural: _react.PropTypes.string,
    singular: _react.PropTypes.string,
    style: _react.PropTypes.object,
    total: _react.PropTypes.number.isRequired
};
const _default = Pagination;

},{"../../../theme.mjs":71,"./page.mjs":51,"glamor":undefined,"react":undefined}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a single pagination page button.
 *
 * Applies Glamor CSS classes for the base page style, and conditionally adds
 * the disabled or selected variant classes based on the corresponding props.
 * All remaining props (including the required onClick handler) are forwarded
 * directly to the underlying `<button>` element.
 * @param {object} props - Component props.
 * @param {boolean} [props.disabled] - When true, applies the disabled style (muted colours, default cursor).
 * @param {(event: React.SyntheticEvent) => void} props.onClick - Click handler invoked when the page button is clicked.
 * @param {boolean} [props.selected] - When true, applies the selected/active-page style.
 * @returns {React.Element} A styled `<button>` element.
 */ function Page(_0) {
    let { disabled, selected } = _0, props = _object_without_properties(_0, [
        "disabled",
        "selected"
    ]);
    props.className = (0, _glamor.css)(classes.page, !!disabled && classes.disabled, !!selected && classes.selected);
    return /*#__PURE__*/ _react.default.createElement("button", props);
}
Page.propTypes = {
    disabled: _react.PropTypes.bool,
    onClick: _react.PropTypes.func.isRequired,
    selected: _react.PropTypes.bool
};
/* eslint quote-props: ["error", "as-needed"] */ const selectedStyle = {
    backgroundColor: _theme.default.pagination.selected.background,
    borderColor: _theme.default.pagination.selected.border,
    color: _theme.default.pagination.selected.color,
    cursor: 'default',
    zIndex: 2
};
const pseudoStyle = {
    backgroundColor: _theme.default.pagination.hover.background,
    borderColor: _theme.default.pagination.hover.border,
    color: _theme.default.pagination.hover.color,
    outline: 'none'
};
const classes = {
    page: {
        appearance: 'none',
        background: 'none',
        border: '1px solid transparent',
        borderRadius: _theme.default.borderRadius.default,
        color: _theme.default.pagination.color,
        cursor: 'pointer',
        display: 'inline-block',
        float: 'left',
        marginRight: '0.25em',
        padding: '0 .7em',
        position: 'relative',
        textDecoration: 'none',
        // handle hover and focus
        ':hover': pseudoStyle,
        ':focus': pseudoStyle
    },
    // selected page
    selected: _object_spread_props(_object_spread({}, selectedStyle), {
        ':hover': selectedStyle,
        ':focus': selectedStyle
    }),
    // disabled page
    disabled: {
        backgroundColor: _theme.default.pagination.disabled.background,
        borderColor: _theme.default.pagination.disabled.background,
        color: _theme.default.pagination.disabled.color,
        cursor: 'default'
    }
};
const _default = Page;

},{"../../../theme.mjs":71,"glamor":undefined,"react":undefined}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9
/**
 * React component that passes a supplied context object down to Portal descendants.
 *
 * Wraps a single child element and exposes the context provided via `props.context`
 * as React child context, enabling descendant components inside a Portal to access
 * context that would otherwise be severed by the Portal boundary.
 */ class PassContext extends _react.Component {
    /**
	 * Returns the child context object to be made available to descendant components.
	 * @returns {object} The context object passed in via `props.context`.
	 */ getChildContext() {
        return this.props.context;
    }
    /**
	 * Renders the single child element passed to this component.
	 * @returns {React.Element} The sole child element from `props.children`.
	 */ render() {
        return _react.Children.only(this.props.children);
    }
}
PassContext.propTypes = {
    context: _react.PropTypes.object.isRequired
};
PassContext.childContextTypes = {
    onClose: _react.PropTypes.func
};
const _default = PassContext;

},{"react":undefined}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Portal;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reactaddonscsstransitiongroup = /*#__PURE__*/ _interop_require_default(require("react-addons-css-transition-group"));
const _reactdom = require("react-dom");
const _index = /*#__PURE__*/ _interop_require_default(require("../PassContext/index.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
class Portal extends _react.Component {
    /**
	 * Creates a new div, appends it to document.body, stores a reference in
	 * this.portalElement, and triggers the first render into that node.
	 * @returns {void}
	 */ componentDidMount() {
        const p = document.createElement('div');
        document.body.appendChild(p);
        this.portalElement = p;
        this.componentDidUpdate();
    }
    /**
	 * Re-renders the portal content into this.portalElement, wrapping children
	 * in a CSS fade transition group with a 200 ms enter/leave duration.
	 * @returns {void}
	 */ componentDidUpdate() {
        // Animate fade on mount/unmount
        const duration = 200;
        const styles = `
				.fade-enter { opacity: 0.01; }
				.fade-enter.fade-enter-active { opacity: 1; transition: opacity ${duration}ms; }
				.fade-leave { opacity: 1; }
				.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity ${duration}ms; }
		`;
        (0, _reactdom.render)(/*#__PURE__*/ _react.default.createElement(_index.default, {
            context: this.context
        }, /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("style", null, styles), /*#__PURE__*/ _react.default.createElement(_reactaddonscsstransitiongroup.default, _object_spread({
            component: "div",
            transitionName: "fade",
            transitionEnterTimeout: duration,
            transitionLeaveTimeout: duration
        }, this.props)))), this.portalElement);
    }
    /**
	 * Removes the portal's div from document.body when the component unmounts.
	 * @returns {void}
	 */ componentWillUnmount() {
        document.body.removeChild(this.portalElement);
    }
    /**
	 * Returns null because Portal renders its content out-of-tree via a detached
	 * DOM node rather than inline in the React tree.
	 * @returns {null} Always null.
	 */ render() {
        return null;
    }
    /**
	 * Initialises the instance and sets portalElement to null before mounting.
	 */ constructor(){
        super();
        this.portalElement = null;
    }
}
Portal.contextTypes = {
    onClose: _react.PropTypes.func
};

},{"../PassContext/index.mjs":52,"react":undefined,"react-addons-css-transition-group":undefined,"react-dom":undefined}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
// Using window.innerWidth and state instead of CSS media breakpoints
// because we want to render null rather than an empty span. Allowing for
// CSS pseudo classes like :only-child to behave as expected.
// Return true if window + document
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * Renders a text string appropriate for the current viewport width by
 * listening to window resize events and selecting from the visibleXS,
 * visibleSM, visibleMD, or visibleLG prop (with hiddenXS/SM/MD/LG as
 * fallbacks). Renders null when no matching text is available, so CSS
 * pseudo-selectors such as :only-child work as expected.
 */ class ResponsiveText extends _react.Component {
    /**
	 * Attaches a resize event listener to the window and fires an initial
	 * resize to sync state with the actual viewport width. Does nothing in
	 * non-DOM environments (e.g. server-side rendering).
	 * @returns {void}
	 */ componentDidMount() {
        if (canUseDOM) {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        }
    }
    /**
	 * Removes the resize event listener added in componentDidMount to prevent
	 * memory leaks after the component is removed from the DOM.
	 * @returns {void}
	 */ componentWillUnmount() {
        if (canUseDOM) {
            window.removeEventListener('resize', this.handleResize);
        }
    }
    /**
	 * Updates component state with the current window.innerWidth so that the
	 * rendered text reflects the latest viewport size.
	 * @returns {void}
	 */ handleResize() {
        this.setState({
            windowWidth: canUseDOM ? window.innerWidth : 0
        });
    }
    /**
	 * Selects the appropriate text string for the current viewport width and
	 * renders it inside the configured wrapper element. Returns null when no
	 * text prop resolves for the active breakpoint.
	 * @returns {React.ReactElement|null} The wrapper element containing the
	 *   selected text, or null if no text is available for the current
	 *   viewport width.
	 */ render() {
        const _this_props = this.props, { component: Component, hiddenLG, hiddenMD, hiddenSM, hiddenXS, visibleLG, visibleMD, visibleSM, visibleXS } = _this_props, props = _object_without_properties(_this_props, [
            "component",
            "hiddenLG",
            "hiddenMD",
            "hiddenSM",
            "hiddenXS",
            "visibleLG",
            "visibleMD",
            "visibleSM",
            "visibleXS"
        ]);
        const { windowWidth } = this.state;
        let text;
        // set text value from breakpoint; attempt XS --> LG
        if (windowWidth < _theme.default.breakpointNumeric.mobile) {
            text = visibleXS || hiddenSM || hiddenMD || hiddenLG;
        } else if (windowWidth < _theme.default.breakpointNumeric.tabletPortrait) {
            text = hiddenXS || visibleSM || hiddenMD || hiddenLG;
        } else if (windowWidth < _theme.default.breakpointNumeric.tabletLandscape) {
            text = hiddenXS || hiddenSM || visibleMD || hiddenLG;
        } else {
            text = hiddenXS || hiddenSM || hiddenMD || visibleLG;
        }
        return text ? /*#__PURE__*/ _react.default.createElement(Component, props, text) : null;
    }
    /**
	 * Initialises component state with the current window width and binds the
	 * resize handler.
	 * @returns {void}
	 */ constructor(){
        super();
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            windowWidth: canUseDOM ? window.innerWidth : 0
        };
    }
}
ResponsiveText.propTypes = {
    hiddenLG: _react.PropTypes.string,
    hiddenMD: _react.PropTypes.string,
    hiddenSM: _react.PropTypes.string,
    hiddenXS: _react.PropTypes.string,
    visibleLG: _react.PropTypes.string,
    visibleMD: _react.PropTypes.string,
    visibleSM: _react.PropTypes.string,
    visibleXS: _react.PropTypes.string
};
ResponsiveText.defaultProps = {
    component: 'span'
};
const _default = ResponsiveText;

},{"../../../theme.mjs":71,"react":undefined}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _glamor = require("glamor");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a visually hidden `<span>` that remains accessible to screen readers.
 *
 * Applies the standard "sr-only" CSS technique (position absolute, 1×1 px,
 * clipped, overflow hidden) via glamor, merged with any additional `className`
 * supplied by the caller.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional extra glamor class to merge with the sr-only styles.
 * @returns {React.Element} A `<span>` element with screen-reader-only styles applied.
 */ function ScreenReaderOnly(_0) {
    let { className } = _0, props = _object_without_properties(_0, [
        "className"
    ]);
    props.className = (0, _glamor.css)(classes.srOnly, className);
    return /*#__PURE__*/ _react.default.createElement("span", props);
}
const classes = {
    srOnly: {
        border: 0,
        clip: 'rect(0,0,0,0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: 1
    }
};
const _default = ScreenReaderOnly;

},{"glamor":undefined,"react":undefined}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ScrollLock;
    }
});
const _react = require("react");
class ScrollLock extends _react.Component {
    /**
	 * Increments the lock reference count and, on the first lock, adds
	 * right-padding equal to the scrollbar width and sets `overflow-y: hidden`
	 * on `document.body` to prevent page scrolling. No-ops in non-browser
	 * environments.
	 */ componentWillMount() {
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
	 */ componentWillUnmount() {
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
	 */ render() {
        return null;
    }
    /**
	 * Initialises the instance and sets the internal lock reference count to zero.
	 */ constructor(){
        super();
        this.lockCount = 0;
    }
}

},{"react":undefined}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    danger: _theme.default.color.danger,
    default: _theme.default.color.gray80,
    error: _theme.default.color.danger,
    info: _theme.default.color.info,
    primary: _theme.default.color.primary,
    success: _theme.default.color.success,
    warning: _theme.default.color.warning
};

},{"../../../theme.mjs":71}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Renders a group of buttons where exactly one option can be selected at a time.
 *
 * Each option in `options` becomes a button. The button whose `value` matches
 * the `value` prop is highlighted using the chosen `color` theme. Clicking an
 * enabled button calls `onChange` with that option's value.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class applied to the wrapper element.
 * @param {string} [props.color] - Color theme applied to the active segment. Defaults to `'default'`.
 * @param {boolean} [props.cropText] - When true, truncates button labels and shows the full label as a tooltip. Useful when `inline` and `equalWidthSegments` are both true.
 * @param {boolean} [props.equalWidthSegments] - When true, all buttons share equal width. Only relevant when `inline` is false.
 * @param {boolean} [props.inline] - When true, renders the control inline rather than full-width.
 * @param {(value: boolean|number|string) => void} props.onChange - Callback invoked with the selected option's value when a button is clicked.
 * @param {Array<{disabled: boolean, label: string, value: boolean|number|string}>} props.options - List of options to render as buttons.
 * @param {boolean|number|string} [props.value] - The currently selected value.
 * @returns {React.Element} A div containing one button per option.
 */ function SegmentedControl(_0) {
    let { className, color, cropText, equalWidthSegments, inline, onChange, options, value } = _0, props = _object_without_properties(_0, [
        "className",
        "color",
        "cropText",
        "equalWidthSegments",
        "inline",
        "onChange",
        "options",
        "value"
    ]);
    props.className = (0, _glamor.css)(_styles.default.control, inline ? _styles.default.control__inline : null, className);
    return /*#__PURE__*/ _react.default.createElement("div", props, options.map((opt)=>{
        const buttonClassName = (0, _glamor.css)(_styles.default.button, opt.disabled ? _styles.default.button__disabled : null, opt.value === value ? _styles.default['button__' + color] : null, cropText ? _styles.default.button__cropText : null, equalWidthSegments ? _styles.default.button__equalWidth : null);
        return /*#__PURE__*/ _react.default.createElement("button", {
            className: buttonClassName,
            key: opt.value,
            onClick: !opt.disabled && (()=>onChange(opt.value)),
            type: "button",
            title: cropText ? opt.label : null,
            tabIndex: opt.disabled ? '-1' : ''
        }, opt.label);
    }));
}
const valuePropShape = [
    _react.PropTypes.bool,
    _react.PropTypes.number,
    _react.PropTypes.string
];
SegmentedControl.propTypes = {
    color: _react.PropTypes.oneOf(Object.keys(_colors.default)),
    cropText: _react.PropTypes.bool,
    equalWidthSegments: _react.PropTypes.bool,
    inline: _react.PropTypes.bool,
    onChange: _react.PropTypes.func.isRequired,
    options: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        disabled: _react.PropTypes.bool,
        label: _react.PropTypes.string,
        value: _react.PropTypes.oneOfType(valuePropShape)
    })).isRequired,
    value: _react.PropTypes.oneOfType(valuePropShape)
};
SegmentedControl.defaultProps = {
    color: 'default'
};
const _default = SegmentedControl;

},{"./colors.mjs":57,"./styles.mjs":59,"glamor":undefined,"react":undefined}],59:[function(require,module,exports){
// ==============================
// Segmented Control
// ==============================
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
// Prepare variants
const colorVariants = {};
Object.keys(_colors.default).forEach((color)=>{
    const pseudoStyles = {
        backgroundColor: _colors.default[color],
        color: 'white'
    };
    colorVariants['button__' + color] = {
        backgroundColor: _colors.default[color],
        color: 'white',
        ':hover': pseudoStyles,
        ':focus': pseudoStyles,
        ':active': pseudoStyles
    };
});
const _default = _object_spread({
    control: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: _theme.default.input.border.color.default,
        borderRadius: '0.4em',
        display: 'flex',
        fontSize: _theme.default.font.size.small,
        paddingLeft: 1,
        paddingRight: 1
    },
    control__inline: {
        display: 'inline-flex'
    },
    // buttons
    button: {
        background: 'none',
        border: 0,
        borderRadius: '0.25em',
        flexGrow: 1,
        margin: '2px 1px',
        padding: '0.3em 0.9em',
        outline: 0,
        ':hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        },
        ':focus': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        },
        ':active': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
    },
    button__equalWidth: {
        flex: '1 1 0'
    },
    button__cropText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    button__disabled: {
        opacity: 0.6,
        pointerEvents: 'none'
    }
}, colorVariants);

},{"../../../theme.mjs":71,"./colors.mjs":57}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = [
    'danger',
    'default',
    'inverted',
    'primary',
    'success',
    'warning'
];

},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _index = /*#__PURE__*/ _interop_require_default(require("../ScreenReaderOnly/index.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
/**
 * Animated three-dot loading spinner with screen-reader accessible "Loading..." text.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional glamor CSS class applied to the wrapper element.
 * @param {'small'|'medium'|'large'} [props.size] - Controls the size of the spinner dots. Defaults to 'medium'.
 * @param {'danger'|'default'|'inverted'|'primary'|'success'|'warning'} [props.color] - Controls the colour of the spinner dots. Defaults to 'default'.
 * @returns {React.Element} A div containing three styled dot spans and a hidden "Loading..." label.
 */ function Spinner(_0) {
    let { className, size, color } = _0, props = _object_without_properties(_0, [
        "className",
        "size",
        "color"
    ]);
    props.className = (0, _glamor.css)(_styles.default.base, _styles.default[size], className);
    return /*#__PURE__*/ _react.default.createElement("div", props, /*#__PURE__*/ _react.default.createElement("span", {
        className: `${(0, _glamor.css)(_styles.default.dot, _styles.default['size__' + size], _styles.default['color__' + color], _styles.default.dot__first)}`
    }), /*#__PURE__*/ _react.default.createElement("span", {
        className: `${(0, _glamor.css)(_styles.default.dot, _styles.default['size__' + size], _styles.default['color__' + color], _styles.default.dot__second)}`
    }), /*#__PURE__*/ _react.default.createElement("span", {
        className: `${(0, _glamor.css)(_styles.default.dot, _styles.default['size__' + size], _styles.default['color__' + color], _styles.default.dot__third)}`
    }), /*#__PURE__*/ _react.default.createElement(_index.default, null, "Loading..."));
}
Spinner.propTypes = {
    color: _react.PropTypes.oneOf(_colors.default),
    size: _react.PropTypes.oneOf(_sizes.default)
};
Spinner.defaultProps = {
    size: 'medium',
    color: 'default'
};
const _default = Spinner;

},{"../ScreenReaderOnly/index.mjs":55,"./colors.mjs":60,"./sizes.mjs":62,"./styles.mjs":63,"glamor":undefined,"react":undefined}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = [
    'small',
    'medium',
    'large'
];

},{}],63:[function(require,module,exports){
// ==============================
// Spinner
// ==============================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
// Prepare variants
const colorVariants = {};
_colors.default.forEach((color)=>{
    colorVariants[`color__${color}`] = {
        backgroundColor: _theme.default.spinner.color[color]
    };
});
// Prepare sizes
const sizeVariants = {};
_sizes.default.forEach((size)=>{
    sizeVariants[`size__${size}`] = {
        fontSize: _theme.default.spinner.size[size]
    };
});
// Declare animation keyframes
const keyframes = _glamor.compose.keyframes('pulse', {
    '0%, 80%, 100%': {
        opacity: 0
    },
    '40%': {
        opacity: 1
    }
});
const _default = _object_spread({
    base: {
        display: 'inline-block',
        lineHeight: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        width: '5em'
    },
    small: {
        fontSize: 4
    },
    medium: {
        fontSize: 8
    },
    large: {
        fontSize: 16
    },
    // text
    text: {
        border: 0,
        clip: 'rect(0,0,0,0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: 1
    },
    // dots
    dot: {
        animationName: keyframes,
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        borderRadius: '1em',
        display: 'inline-block',
        height: '1em',
        verticalAlign: 'top',
        width: '1em'
    },
    dot__second: {
        animationDelay: '160ms',
        marginLeft: '1em'
    },
    dot__third: {
        animationDelay: '320ms',
        marginLeft: '1em'
    }
}, colorVariants, sizeVariants);

},{"../../../theme.mjs":71,"./colors.mjs":60,"./sizes.mjs":62,"glamor":undefined}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Alert () {
        return _index.default;
    },
    get BlankState () {
        return _index1.default;
    },
    get Button () {
        return _index2.default;
    },
    get Center () {
        return _index3.default;
    },
    get Chip () {
        return _index4.default;
    },
    get Container () {
        return _index5.default;
    },
    get DropdownButton () {
        return _index6.default;
    },
    get Form () {
        return _index7.default;
    },
    get FormField () {
        return _index8.default;
    },
    get FormInput () {
        return _index9.default;
    },
    get FormLabel () {
        return _index10.default;
    },
    get FormNote () {
        return _index11.default;
    },
    get FormSelect () {
        return _index12.default;
    },
    get Glyph () {
        return _index13.default;
    },
    get GlyphButton () {
        return _index14.default;
    },
    get GlyphField () {
        return _index15.default;
    },
    get Grid () {
        return _index16.default;
    },
    get InlineGroup () {
        return _index17.default;
    },
    get InlineGroupSection () {
        return _index18.default;
    },
    get LabelledControl () {
        return _index19.default;
    },
    get LoadingButton () {
        return _index20.default;
    },
    get Modal () {
        return _index21.default;
    },
    get Pagination () {
        return _index22.default;
    },
    get ResponsiveText () {
        return _index23.default;
    },
    get ScreenReaderOnly () {
        return _index24.default;
    },
    get SegmentedControl () {
        return _index25.default;
    },
    get Spinner () {
        return _index26.default;
    },
    get default () {
        return _default;
    }
});
const _index = /*#__PURE__*/ _interop_require_default(require("./Alert/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("./BlankState/index.mjs"));
const _index2 = /*#__PURE__*/ _interop_require_default(require("./Button/index.mjs"));
const _index3 = /*#__PURE__*/ _interop_require_default(require("./Center/index.mjs"));
const _index4 = /*#__PURE__*/ _interop_require_default(require("./Chip/index.mjs"));
const _index5 = /*#__PURE__*/ _interop_require_default(require("./Container/index.mjs"));
const _index6 = /*#__PURE__*/ _interop_require_default(require("./DropdownButton/index.mjs"));
const _index7 = /*#__PURE__*/ _interop_require_default(require("./Form/index.mjs"));
const _index8 = /*#__PURE__*/ _interop_require_default(require("./FormField/index.mjs"));
const _index9 = /*#__PURE__*/ _interop_require_default(require("./FormInput/index.mjs"));
const _index10 = /*#__PURE__*/ _interop_require_default(require("./FormLabel/index.mjs"));
const _index11 = /*#__PURE__*/ _interop_require_default(require("./FormNote/index.mjs"));
const _index12 = /*#__PURE__*/ _interop_require_default(require("./FormSelect/index.mjs"));
const _index13 = /*#__PURE__*/ _interop_require_default(require("./Glyph/index.mjs"));
const _index14 = /*#__PURE__*/ _interop_require_default(require("./GlyphButton/index.mjs"));
const _index15 = /*#__PURE__*/ _interop_require_default(require("./GlyphField/index.mjs"));
const _index16 = /*#__PURE__*/ _interop_require_default(require("./Grid/index.mjs"));
const _index17 = /*#__PURE__*/ _interop_require_default(require("./InlineGroup/index.mjs"));
const _index18 = /*#__PURE__*/ _interop_require_default(require("./InlineGroupSection/index.mjs"));
const _index19 = /*#__PURE__*/ _interop_require_default(require("./LabelledControl/index.mjs"));
const _index20 = /*#__PURE__*/ _interop_require_default(require("./LoadingButton/index.mjs"));
const _index21 = /*#__PURE__*/ _interop_require_default(require("./Modal/index.mjs"));
const _index22 = /*#__PURE__*/ _interop_require_default(require("./Pagination/index.mjs"));
const _index23 = /*#__PURE__*/ _interop_require_default(require("./ResponsiveText/index.mjs"));
const _index24 = /*#__PURE__*/ _interop_require_default(require("./ScreenReaderOnly/index.mjs"));
const _index25 = /*#__PURE__*/ _interop_require_default(require("./SegmentedControl/index.mjs"));
const _index26 = /*#__PURE__*/ _interop_require_default(require("./Spinner/index.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    Alert: _index.default,
    BlankState: _index1.default,
    Button: _index2.default,
    Center: _index3.default,
    Chip: _index4.default,
    Container: _index5.default,
    DropdownButton: _index6.default,
    Form: _index7.default,
    FormField: _index8.default,
    FormInput: _index9.default,
    FormLabel: _index10.default,
    FormNote: _index11.default,
    FormSelect: _index12.default,
    Glyph: _index13.default,
    GlyphButton: _index14.default,
    GlyphField: _index15.default,
    Grid: _index16.default,
    InlineGroup: _index17.default,
    InlineGroupSection: _index18.default,
    LabelledControl: _index19.default,
    LoadingButton: _index20.default,
    Modal: _index21.default,
    Pagination: _index22.default,
    ResponsiveText: _index23.default,
    ScreenReaderOnly: _index24.default,
    SegmentedControl: _index25.default,
    Spinner: _index26.default
};

},{"./Alert/index.mjs":2,"./BlankState/index.mjs":4,"./Button/index.mjs":5,"./Center/index.mjs":7,"./Chip/index.mjs":10,"./Container/index.mjs":12,"./DropdownButton/index.mjs":15,"./Form/index.mjs":16,"./FormField/index.mjs":18,"./FormInput/index.mjs":20,"./FormLabel/index.mjs":23,"./FormNote/index.mjs":25,"./FormSelect/index.mjs":27,"./Glyph/index.mjs":30,"./GlyphButton/index.mjs":34,"./GlyphField/index.mjs":35,"./Grid/index.mjs":36,"./InlineGroup/index.mjs":39,"./InlineGroupSection/index.mjs":40,"./LabelledControl/index.mjs":42,"./LoadingButton/index.mjs":44,"./Modal/index.mjs":49,"./Pagination/index.mjs":50,"./ResponsiveText/index.mjs":54,"./ScreenReaderOnly/index.mjs":55,"./SegmentedControl/index.mjs":58,"./Spinner/index.mjs":61}],65:[function(require,module,exports){
/**
 * The actual Sign In view, with the login form
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _xhr = /*#__PURE__*/ _interop_require_default(require("xhr"));
const _Alert = /*#__PURE__*/ _interop_require_default(require("./components/Alert.mjs"));
const _Brand = /*#__PURE__*/ _interop_require_default(require("./components/Brand.mjs"));
const _UserInfo = /*#__PURE__*/ _interop_require_default(require("./components/UserInfo.mjs"));
const _LoginForm = /*#__PURE__*/ _interop_require_default(require("./components/LoginForm.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
const SigninView = _react.default.createClass({
    getInitialState () {
        return {
            email: "",
            password: "",
            isAnimating: false,
            isInvalid: false,
            invalidMessage: "",
            signedOut: window.location.search === "?signedout"
        };
    },
    componentDidMount () {
        // Focus the email field when we're mounted
        if (this.refs.email) {
            this.refs.email.select();
        }
        this.__isMounted = true;
    },
    componentWillUnmount () {
        this.__isMounted = false;
    },
    handleInputChange (e) {
        // Set the new state when the input changes
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    },
    handleSubmit (e) {
        e.preventDefault();
        // If either password or mail are missing, show an error
        if (!this.state.email || !this.state.password) {
            return this.displayError("Please enter an email address and password to sign in.");
        }
        (0, _xhr.default)({
            url: `${getAdminApiPath()}/session/signin`,
            method: "post",
            json: {
                email: this.state.email,
                password: this.state.password
            },
            headers: Object.assign({}, Keystone.csrf.header)
        }, (err, resp, body)=>{
            if (err || body && body.error) {
                return body.error === "invalid csrf" ? this.displayError("Something went wrong; please refresh your browser and try again.") : this.displayError("The email and password you entered are not valid.");
            } else {
                // Redirect to where we came from or to the default admin legacy path
                if (Keystone.redirect) {
                    top.location.href = Keystone.redirect;
                } else {
                    top.location.href = this.props.from ? this.props.from : Keystone.adminLegacyPath;
                }
            }
        });
    },
    /**
	 * Display an error message
	 * @param  {string} message The message you want to show
	 */ displayError (message) {
        this.setState({
            isAnimating: true,
            isInvalid: true,
            invalidMessage: message
        });
        setTimeout(this.finishAnimation, 750);
    },
    // Finish the animation and select the email field
    finishAnimation () {
        if (!this.__isMounted) return;
        if (this.refs.email) {
            this.refs.email.select();
        }
        this.setState({
            isAnimating: false
        });
    },
    render () {
        const boxClassname = (0, _classnames.default)("auth-box", {
            "auth-box--has-errors": this.state.isAnimating
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "auth-wrapper"
        }, /*#__PURE__*/ _react.default.createElement(_Alert.default, {
            isInvalid: this.state.isInvalid,
            signedOut: this.state.signedOut,
            invalidMessage: this.state.invalidMessage
        }), /*#__PURE__*/ _react.default.createElement("div", {
            className: boxClassname
        }, /*#__PURE__*/ _react.default.createElement("h1", {
            className: "u-hidden-visually"
        }, this.props.brand ? this.props.brand : "Keystone", " Sign In", " "), /*#__PURE__*/ _react.default.createElement("div", {
            className: "auth-box__inner"
        }, /*#__PURE__*/ _react.default.createElement(_Brand.default, {
            logo: this.props.logo,
            brand: this.props.brand
        }), this.props.user ? /*#__PURE__*/ _react.default.createElement(_UserInfo.default, {
            adminLegacyPath: this.props.from ? this.props.from : Keystone.adminLegacyPath,
            signoutPath: `${Keystone.adminLegacyPath}/signout`,
            userCanAccessKeystone: this.props.userCanAccessKeystone,
            userName: this.props.user.name
        }) : /*#__PURE__*/ _react.default.createElement(_LoginForm.default, {
            email: this.state.email,
            handleInputChange: this.handleInputChange,
            handleSubmit: this.handleSubmit,
            isAnimating: this.state.isAnimating,
            password: this.state.password
        }))), /*#__PURE__*/ _react.default.createElement("div", {
            className: "auth-footer"
        }, /*#__PURE__*/ _react.default.createElement("span", null, "Powered by "), /*#__PURE__*/ _react.default.createElement("a", {
            href: "http://v4.keystonejs.com",
            target: "_blank",
            title: "The Node.js CMS and web application platform (new window)"
        }, "KeystoneJS")));
    },
    displayName: "SigninView"
});
const _default = SigninView;

},{"./components/Alert.mjs":66,"./components/Brand.mjs":67,"./components/LoginForm.mjs":68,"./components/UserInfo.mjs":69,"classnames":undefined,"react":undefined,"xhr":undefined}],66:[function(require,module,exports){
/**
 * Renders an Alert. Pass either an isInvalid and invalidMessage prop, or set
 * the signedOut prop to true to show the standard signed out message
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _index = require("../../App/elemental/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AlertView = function(props) {
    if (props.isInvalid) {
        return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
            key: "error",
            color: "danger",
            style: {
                textAlign: 'center'
            }
        }, props.invalidMessage);
    } else if (props.signedOut) {
        return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
            key: "signed-out",
            color: "info",
            style: {
                textAlign: 'center'
            }
        }, "You have been signed out.");
    } else {
        // Can't return "null" from stateless components
        return /*#__PURE__*/ _react.default.createElement("span", null);
    }
};
AlertView.propTypes = {
    invalidMessage: _react.default.PropTypes.string,
    isInvalid: _react.default.PropTypes.bool,
    signedOut: _react.default.PropTypes.bool
};
const _default = AlertView;

},{"../../App/elemental/index.mjs":64,"react":undefined}],67:[function(require,module,exports){
/**
 * Renders a logo, defaulting to the Keystone logo if no brand is specified in
 * the configuration
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Brand = function(props) {
    // Default to the KeystoneJS logo
    let logo = {
        src: `${Keystone.adminLegacyPath}/images/logo.png`,
        width: 205,
        height: 68
    };
    if (props.logo) {
        // If the logo is set to a string, it's a direct link
        logo = typeof props.logo === 'string' ? {
            src: props.logo
        } : props.logo;
        // Optionally one can specify the logo as an array, also stating the
        // wanted width and height of the logo
        // TODO: Deprecate this
        if (Array.isArray(logo)) {
            logo = {
                src: logo[0],
                width: logo[1],
                height: logo[2]
            };
        }
    }
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: "auth-box__col"
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: "auth-box__brand"
    }, /*#__PURE__*/ _react.default.createElement("a", {
        href: "/",
        className: "auth-box__brand__logo"
    }, /*#__PURE__*/ _react.default.createElement("img", {
        src: logo.src,
        width: logo.width ? logo.width : null,
        height: logo.height ? logo.height : null,
        alt: props.brand
    }))));
};
const _default = Brand;

},{"react":undefined}],68:[function(require,module,exports){
/**
 * The login form of the signin screen
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _index = require("../../App/elemental/index.mjs");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const LoginForm = ({ email, handleInputChange, handleSubmit, isAnimating, password })=>{
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: "auth-box__col"
    }, /*#__PURE__*/ _react.default.createElement(_index.Form, {
        onSubmit: handleSubmit,
        noValidate: true
    }, /*#__PURE__*/ _react.default.createElement(_index.FormField, {
        label: "Email",
        htmlFor: "email"
    }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
        autoFocus: true,
        type: "email",
        name: "email",
        onChange: handleInputChange,
        value: email
    })), /*#__PURE__*/ _react.default.createElement(_index.FormField, {
        label: "Password",
        htmlFor: "password"
    }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
        type: "password",
        name: "password",
        onChange: handleInputChange,
        value: password
    })), /*#__PURE__*/ _react.default.createElement(_index.Button, {
        disabled: isAnimating,
        color: "primary",
        type: "submit"
    }, "Sign In")));
};
LoginForm.propTypes = {
    email: _react.PropTypes.string,
    handleInputChange: _react.PropTypes.func.isRequired,
    handleSubmit: _react.PropTypes.func.isRequired,
    isAnimating: _react.PropTypes.bool,
    password: _react.PropTypes.string
};
const _default = LoginForm;

},{"../../App/elemental/index.mjs":64,"react":undefined}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _index = require("../../App/elemental/index.mjs");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// TODO Figure out if we should change "Keystone" to "Admin area"
const UserInfo = ({ adminLegacyPath, signoutPath, userCanAccessKeystone, userName })=>{
    const adminButton = userCanAccessKeystone ? /*#__PURE__*/ _react.default.createElement(_index.Button, {
        href: adminLegacyPath,
        color: "primary"
    }, "Open Keystone") : null;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: "auth-box__col"
    }, /*#__PURE__*/ _react.default.createElement("p", null, "Hi ", userName, ","), /*#__PURE__*/ _react.default.createElement("p", null, "You're already signed in."), adminButton, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        href: signoutPath,
        variant: "link",
        color: "cancel"
    }, "Sign Out"));
};
UserInfo.propTypes = {
    adminLegacyPath: _react.PropTypes.string.isRequired,
    signoutPath: _react.PropTypes.string.isRequired,
    userCanAccessKeystone: _react.PropTypes.bool,
    userName: _react.PropTypes.string.isRequired
};
const _default = UserInfo;

},{"../../App/elemental/index.mjs":64,"react":undefined}],70:[function(require,module,exports){
/**
 * The signin page, it renders a page with a username and password input form.
 *
 * This is decoupled from the main app (in the "App/" folder) because we inject
 * lots of data into the other screens (like the lists that exist) that we don't
 * want to have injected here, so this is a completely separate route and template.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _qs = /*#__PURE__*/ _interop_require_default(require("qs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = /*#__PURE__*/ _interop_require_default(require("react-dom"));
const _Signin = /*#__PURE__*/ _interop_require_default(require("./Signin.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Sanitize from param
const internalFromRegex = /^\/[^/\\]\w+/;
const params = _qs.default.parse(window.location.search.replace(/^\?/, ''));
const from = internalFromRegex.test(params.from) ? params.from : undefined;
_reactdom.default.render(/*#__PURE__*/ _react.default.createElement(_Signin.default, {
    brand: Keystone.brand,
    from: from,
    logo: Keystone.logo,
    user: Keystone.user,
    userCanAccessKeystone: Keystone.userCanAccessKeystone
}), document.getElementById('signin-view'));

},{"./Signin.mjs":65,"qs":undefined,"react":undefined,"react-dom":undefined}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _color = require("./utils/color.mjs");
const theme = {};
// ==============================
// COMMON
// ==============================
// breakpoint
theme.breakpointNumeric = {
    mobile: 480,
    tabletPortrait: 768,
    tabletLandscape: 992,
    desktop: 1200
};
theme.breakpoint = {
    tabletPortraitMin: theme.breakpointNumeric.mobile + 1 + 'px',
    tabletLandscapeMin: theme.breakpointNumeric.tabletPortrait + 1 + 'px',
    desktopMin: theme.breakpointNumeric.tabletLandscape + 1 + 'px',
    desktopLargeMin: theme.breakpointNumeric.desktop + 1 + 'px',
    mobileMax: theme.breakpointNumeric.mobile + 'px',
    tabletPortraitMax: theme.breakpointNumeric.tabletPortrait + 'px',
    tabletLandscapeMax: theme.breakpointNumeric.tabletLandscape + 'px',
    desktopMax: theme.breakpointNumeric.desktop + 'px'
};
// container
theme.container = {
    gutter: 20,
    size: {
        small: 750,
        medium: 970,
        large: 1170
    }
};
// color
theme.color = {
    body: '#fafafa',
    link: '#1385e5',
    linkHover: (0, _color.lighten)('#1385e5', 10),
    text: '#1A1A1A',
    // contextual
    success: '#34c240',
    create: '#34c240',
    primary: '#1385e5',
    info: '#1385e5',
    warning: '#FA3',
    danger: '#d64242',
    error: '#d64242',
    // neutrals
    gray90: '#1A1A1A',
    gray80: '#333',
    gray70: '#4D4D4D',
    gray60: '#666',
    gray50: '#7F7F7F',
    gray40: '#999',
    gray30: '#B3B3B3',
    gray20: '#CCC',
    gray15: '#D9D9D9',
    gray10: '#E5E5E5',
    gray05: '#F2F2F2',
    // social
    facebook: '#3B5998',
    google: '#DC4E41',
    instagram: '#3f729b',
    pinterest: '#bd081c',
    tumblr: '#35465c',
    twitter: '#55ACEE',
    youtube: '#cd201f',
    vimeo: '#1ab7ea'
};
// border radii
theme.borderRadius = {
    small: '0.125rem',
    default: '0.3rem',
    large: '0.5rem'
};
// spacing
theme.spacing = {
    xsmall: 5,
    small: 10,
    default: 20,
    large: 30,
    xlarge: 40,
    xxlarge: 60
};
// ==============================
// ELEMENTAL SPECIFIC
// ==============================
// button
theme.button = {
    borderRadius: theme.borderRadius.default,
    borderWidth: 1,
    font: {
        weight: 500
    },
    paddingHorizontal: '1em',
    default: {
        bgColor: theme.color.primary,
        borderColor: (0, _color.blend)(theme.color.primary, theme.color.body, 60),
        textColor: theme.color.primary
    },
    primary: {
        bgColor: theme.color.primary,
        borderColor: (0, _color.blend)(theme.color.primary, theme.color.body, 60),
        textColor: theme.color.primary
    },
    success: {
        bgColor: theme.color.success,
        borderColor: (0, _color.blend)(theme.color.success, theme.color.body, 60),
        textColor: theme.color.success
    },
    warning: {
        bgColor: theme.color.warning,
        borderColor: (0, _color.blend)(theme.color.warning, theme.color.body, 60),
        textColor: theme.color.warning
    },
    danger: {
        bgColor: theme.color.danger,
        borderColor: (0, _color.blend)(theme.color.danger, theme.color.body, 60),
        textColor: theme.color.danger
    }
};
// blank state
theme.blankstate = {
    background: (0, _color.darken)(theme.color.body, 4),
    borderRadius: theme.borderRadius.default,
    color: theme.color.gray40,
    paddingHorizontal: '2em',
    paddingVertical: '4em'
};
// font
theme.font = {
    family: {
        mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        sansSerif: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        serif: 'Georgia, Times New Roman, Times, serif'
    },
    size: {
        xxsmall: '0.65rem',
        xsmall: '0.75rem',
        small: '0.85rem',
        default: '1rem',
        medium: '1.2rem',
        large: '1.6rem',
        xlarge: '2.4rem',
        xxlarge: '3.2rem'
    }
};
// form
theme.form = {
    label: {
        color: theme.color.gray50,
        fontSize: '1rem',
        fontWeight: 'normal',
        width: 180
    },
    note: {
        color: theme.color.gray40,
        fontSize: '0.9em'
    }
};
// component
theme.component = {
    lineHeight: '2.3em',
    height: '2.4em',
    padding: '1em'
};
// input
theme.input = {
    background: {
        default: 'white',
        disabled: '#fafafa',
        noedit: (0, _color.darken)(theme.color.body, 2)
    },
    placeholderColor: '#aaa',
    lineHeight: theme.component.lineHeight,
    height: theme.component.height,
    border: {
        color: {
            default: '#ccc',
            focus: theme.color.info,
            hover: '#bbb',
            noedit: (0, _color.darken)(theme.color.body, 8)
        },
        radius: theme.borderRadius.default,
        width: 1
    },
    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
    boxShadowFocus: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${(0, _color.fade)(theme.color.info, 10)}`,
    paddingHorizontal: '.75em'
};
// select
theme.select = {
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.075)'
};
// alert
theme.alert = {
    padding: '0.75em  1em',
    margin: '0 0 1em',
    borderWidth: 1,
    borderRadius: theme.borderRadius.default,
    color: {
        danger: {
            background: (0, _color.fade)(theme.color.danger, 10),
            border: (0, _color.fade)(theme.color.danger, 10),
            text: theme.color.danger
        },
        info: {
            background: (0, _color.fade)(theme.color.primary, 10),
            border: (0, _color.fade)(theme.color.primary, 10),
            text: theme.color.primary
        },
        success: {
            background: (0, _color.fade)(theme.color.success, 10),
            border: (0, _color.fade)(theme.color.success, 10),
            text: theme.color.success
        },
        warning: {
            background: (0, _color.fade)(theme.color.warning, 10),
            border: (0, _color.fade)(theme.color.warning, 10),
            text: theme.color.warning
        }
    }
};
// glyph
theme.glyph = {
    color: {
        danger: theme.color.danger,
        inherit: 'inherit',
        inverted: 'white',
        primary: theme.color.primary,
        success: theme.color.success,
        warning: theme.color.warning
    },
    size: {
        small: 16,
        medium: 32,
        large: 64
    }
};
// modal
theme.modal = {
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: 100,
    padding: {
        dialog: {
            horizontal: '1em',
            vertical: 0
        },
        body: {
            horizontal: 0,
            vertical: '1em'
        },
        footer: {
            horizontal: 0,
            vertical: '1em'
        },
        header: {
            horizontal: 0,
            vertical: '0.6em'
        }
    }
};
// pagination
theme.pagination = {
    color: theme.color.gray60,
    hover: {
        background: 'white',
        border: 'rgba(0, 0, 0, 0.1)',
        color: theme.color.gray60
    },
    selected: {
        background: 'rgba(0, 0, 0, 0.05)',
        border: 'transparent',
        color: theme.color.gray60
    },
    disabled: {
        background: 'transparent',
        color: theme.color.gray40
    }
};
// spinner
theme.spinner = {
    color: {
        danger: theme.color.danger,
        default: theme.color.gray40,
        inverted: 'white',
        primary: theme.color.primary,
        success: theme.color.success,
        warning: theme.color.warning
    },
    size: {
        small: 4,
        medium: 8,
        large: 16
    }
};
const _default = theme;

},{"./utils/color.mjs":72}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get blend () {
        return blend;
    },
    get darken () {
        return darken;
    },
    get default () {
        return _default;
    },
    get fade () {
        return fade;
    },
    get lighten () {
        return lighten;
    }
});
/**
 * Validate Hex
 * ==============================
 * Strips the leading hash if present and normalises the value to a 6-digit hex string.
 * @param {string} color A 3- or 6-digit hex color, optionally prefixed with "#"
 * @returns {string} The validated 6-digit hex string without the "#" prefix
 */ function validateHex(color) {
    const hex = color.replace('#', '');
    if (hex.length === 3) {
        return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error(`Invalid color value provided: "${color}"`);
    }
    return hex;
}
/**
 * Fade Color
 * ==============================
 * Takes a hexadecimal color, converts it to RGB and applies an alpha value.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} opacity Opacity value from 0 to 100
 * @returns {string} An rgba() CSS color string
 */ function fade(color, opacity = 100) {
    const decimalFraction = opacity / 100;
    const hex = validateHex(color);
    // 1.
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // 2.
    const result = 'rgba(' + r + ',' + g + ',' + b + ',' + decimalFraction + ')';
    return result;
}
/**
 * Shade Color
 * ==============================
 * Takes a hexadecimal color, converts it to RGB and lightens or darkens it.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent Positive values lighten, negative values darken (range: -100 to 100)
 * @returns {string} The shaded hex color string prefixed with "#"
 */ function shade(color, percent) {
    const decimalFraction = percent / 100;
    const hex = validateHex(color);
    // 1.
    const f = parseInt(hex, 16);
    const t = decimalFraction < 0 ? 0 : 255;
    const p = decimalFraction < 0 ? decimalFraction * -1 : decimalFraction;
    const R = f >> 16;
    const G = f >> 8 & 0x00FF;
    const B = f & 0x0000FF;
    // 2.
    return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}
// shade helpers
const lighten = shade;
/**
 * Darkens a hex color by the given percentage.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent How much to darken (0–100)
 * @returns {string} The darkened hex color string prefixed with "#"
 */ function darken(color, percent) {
    return shade(color, percent * -1);
}
/**
 * Blend Color
 * ==============================
 * Takes two hexadecimal colors and blends them together.
 * @param {string} color1  The starting hex color string (3 or 6 digits, with or without "#")
 * @param {string} color2  The ending hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent Blend percentage from 0 (all color1) to 100 (all color2)
 * @returns {string} The blended hex color string prefixed with "#"
 */ function blend(color1, color2, percent) {
    const decimalFraction = percent / 100;
    const hex1 = validateHex(color1);
    const hex2 = validateHex(color2);
    // 1.
    const f = parseInt(hex1, 16);
    const t = parseInt(hex2, 16);
    const R1 = f >> 16;
    const G1 = f >> 8 & 0x00FF;
    const B1 = f & 0x0000FF;
    const R2 = t >> 16;
    const G2 = t >> 8 & 0x00FF;
    const B2 = t & 0x0000FF;
    // 2.
    return '#' + (0x1000000 + (Math.round((R2 - R1) * decimalFraction) + R1) * 0x10000 + (Math.round((G2 - G1) * decimalFraction) + G1) * 0x100 + (Math.round((B2 - B1) * decimalFraction) + B1)).toString(16).slice(1);
}
const _default = {
    blend,
    darken,
    fade,
    lighten
};

},{}],73:[function(require,module,exports){
// ======================
// Concatenate Classnames
// ======================
//
// Support className as an array:
// force classname prop into an array (possibly of arrays) then flatten
/*
	// To use spread the new array into glamor's `css` function

	function Component ({ className, ...props }) {
		props.className = css(
			classes.component,
			...concatClassnames(className)
		);

		return <Component {...props} />;
	};
*/ /**
 *
 * @param className
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return concatClassnames;
    }
});
function concatClassnames(className) {
    return [
        className
    ].reduce((a, b)=>{
        return a.concat(b);
    }, []);
}

},{}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get borderBottomRadius () {
        return borderBottomRadius;
    },
    get borderLeftRadius () {
        return borderLeftRadius;
    },
    get borderRightRadius () {
        return borderRightRadius;
    },
    get borderTopRadius () {
        return borderTopRadius;
    },
    get default () {
        return _default;
    },
    get gradientHorizontal () {
        return gradientHorizontal;
    },
    get gradientVertical () {
        return gradientVertical;
    }
});
/**
 * Linear Gradient
 * ==============================
 * Short-hand helper for adding a linear gradient to your component.
 * Accepts a direction, a start color, an end color and an optional base value.
 * Spread the declaration into your component class: `...linearGradient(red, blue)`.
 * @param {string} direction  CSS gradient direction (e.g. "to bottom")
 * @param {string} top        Start color
 * @param {string} bottom     End color
 * @param {string} [base]     Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */ function linearGradient(direction, top, bottom, base = '') {
    return {
        background: `linear-gradient(${direction}, ${top} 0%, ${bottom} 100%) ${base}`
    };
}
/**
 * Vertical Gradient
 * Short-hand helper for a top-to-bottom linear gradient.
 * @param {string} top    Start color
 * @param {string} bottom End color
 * @param {string} base   Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */ function gradientVertical(top, bottom, base) {
    return linearGradient('to bottom', top, bottom, base);
}
/**
 * Horizontal Gradient
 * Short-hand helper for a left-to-right linear gradient.
 * @param {string} top    Start color (left side)
 * @param {string} bottom End color (right side)
 * @param {string} base   Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */ function gradientHorizontal(top, bottom, base) {
    return linearGradient('to right', top, bottom, base);
}
/**
 * Border Radius
 * ==============================
 * Short-hand helpers for border radii.
 */ /**
 * Apply a border radius to the top two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderTopLeftRadius and borderTopRightRadius
 */ function borderTopRadius(radius) {
    return {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius
    };
}
/**
 * Apply a border radius to the right two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomRightRadius and borderTopRightRadius
 */ function borderRightRadius(radius) {
    return {
        borderBottomRightRadius: radius,
        borderTopRightRadius: radius
    };
}
/**
 * Apply a border radius to the bottom two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomLeftRadius and borderBottomRightRadius
 */ function borderBottomRadius(radius) {
    return {
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius
    };
}
/**
 * Apply a border radius to the left two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomLeftRadius and borderTopLeftRadius
 */ function borderLeftRadius(radius) {
    return {
        borderBottomLeftRadius: radius,
        borderTopLeftRadius: radius
    };
}
const _default = {
    borderTopRadius,
    borderRightRadius,
    borderBottomRadius,
    borderLeftRadius,
    gradientHorizontal,
    gradientVertical
};

},{}]},{},[70]);
