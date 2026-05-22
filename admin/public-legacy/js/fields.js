require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],2:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"./colors.mjs":1}],4:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"glamor":undefined,"react":undefined}],5:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../../../utils/color.mjs":84,"../../../utils/css.mjs":87}],7:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../../../utils/color.mjs":84}],10:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../../../utils/css.mjs":87,"./colors.mjs":9}],12:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],14:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"./sizes.mjs":13}],15:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],20:[function(require,module,exports){
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

},{"../../../utils/concatClassnames.mjs":86,"./noedit.mjs":21,"./styles.mjs":22,"glamor":undefined,"react":undefined}],21:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../../../utils/color.mjs":84,"glamor":undefined,"react":undefined}],22:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],23:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],25:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],27:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../../../utils/color.mjs":84}],29:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],30:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],33:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"glamor":undefined,"react":undefined}],38:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],42:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],44:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../Button/index.mjs":5,"../Spinner/index.mjs":61,"glamor":undefined,"react":undefined}],45:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"glamor":undefined,"react":undefined}],46:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../Portal/index.mjs":53,"../ScrollLock/index.mjs":56,"glamor":undefined,"react":undefined}],47:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"glamor":undefined,"react":undefined}],48:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"../GlyphButton/index.mjs":34,"glamor":undefined,"react":undefined}],49:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"./page.mjs":51,"glamor":undefined,"react":undefined}],51:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"glamor":undefined,"react":undefined}],52:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"react":undefined}],55:[function(require,module,exports){
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

},{"../../../theme.mjs":80}],58:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"./colors.mjs":57}],60:[function(require,module,exports){
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

},{"../../../theme.mjs":80,"./colors.mjs":60,"./sizes.mjs":62,"glamor":undefined}],64:[function(require,module,exports){
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
arguments[4][64][0].apply(exports,arguments)
},{"./Alert/index.mjs":2,"./BlankState/index.mjs":4,"./Button/index.mjs":5,"./Center/index.mjs":7,"./Chip/index.mjs":10,"./Container/index.mjs":12,"./DropdownButton/index.mjs":15,"./Form/index.mjs":16,"./FormField/index.mjs":18,"./FormInput/index.mjs":20,"./FormLabel/index.mjs":23,"./FormNote/index.mjs":25,"./FormSelect/index.mjs":27,"./Glyph/index.mjs":30,"./GlyphButton/index.mjs":34,"./GlyphField/index.mjs":35,"./Grid/index.mjs":36,"./InlineGroup/index.mjs":39,"./InlineGroupSection/index.mjs":40,"./LabelledControl/index.mjs":42,"./LoadingButton/index.mjs":44,"./Modal/index.mjs":49,"./Pagination/index.mjs":50,"./ResponsiveText/index.mjs":54,"./ScreenReaderOnly/index.mjs":55,"./SegmentedControl/index.mjs":58,"./Spinner/index.mjs":61,"dup":64}],66:[function(require,module,exports){
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
const _index = require("../elemental/index.mjs");
const _string = require("../../utils/string.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * This renders alerts for API success and error responses.
 *   Error format: {
 *     error: 'validation errors' // The unique error type identifier
 *     detail: { ... } // Optional details specific to that error type
 *   }
 *   Success format: {
 *     success: 'item updated', // The unique success type identifier
 *     details: { ... } // Optional details specific to that success type
 *   }
 *   Eventually success and error responses should be handled individually
 *   based on their type. For example: validation errors should be displayed next
 *   to each invalid field and signin errors should promt the user to sign in.
 */ const AlertMessages = _react.default.createClass({
    displayName: 'AlertMessages',
    propTypes: {
        alerts: _react.default.PropTypes.shape({
            error: _react.default.PropTypes.Object,
            success: _react.default.PropTypes.Object
        })
    },
    getDefaultProps () {
        return {
            alerts: {}
        };
    },
    renderValidationErrors () {
        let errors = this.props.alerts.error.detail;
        if (errors.name === 'ValidationError') {
            errors = errors.errors;
        }
        const errorCount = Object.keys(errors).length;
        let alertContent;
        const messages = Object.keys(errors).map((path)=>{
            if (errorCount > 1) {
                return /*#__PURE__*/ _react.default.createElement("li", {
                    key: path
                }, (0, _string.upcase)(errors[path].error || errors[path].message));
            } else {
                return /*#__PURE__*/ _react.default.createElement("div", {
                    key: path
                }, (0, _string.upcase)(errors[path].error || errors[path].message));
            }
        });
        if (errorCount > 1) {
            alertContent = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("h4", null, "There were ", errorCount, " errors creating the new item:"), /*#__PURE__*/ _react.default.createElement("ul", null, messages));
        } else {
            alertContent = messages;
        }
        return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
            color: "danger"
        }, alertContent);
    },
    render () {
        const { error, success } = this.props.alerts;
        if (error) {
            // Render error alerts
            switch(error.error){
                case 'validation errors':
                    return this.renderValidationErrors();
                case 'error':
                    if (error.detail.name === 'ValidationError') {
                        return this.renderValidationErrors();
                    } else {
                        return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
                            color: "danger"
                        }, (0, _string.upcase)(error.error));
                    }
                default:
                    return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
                        color: "danger"
                    }, (0, _string.upcase)(error.error));
            }
        }
        if (success) {
            // Render success alerts
            return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
                color: "success"
            }, (0, _string.upcase)(success.success));
        }
        return null; // No alerts, render nothing
    }
});
const _default = AlertMessages;

},{"../../utils/string.mjs":89,"../elemental/index.mjs":64,"react":undefined}],67:[function(require,module,exports){
/**
 * The form that's visible when "Create <ItemName>" is clicked on either the
 * List screen or the Item screen
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
const _AlertMessages = /*#__PURE__*/ _interop_require_default(require("./AlertMessages.mjs"));
const _FieldTypes = require("FieldTypes");
const _InvalidFieldType = /*#__PURE__*/ _interop_require_default(require("./InvalidFieldType.mjs"));
const _index = require("../elemental/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CreateForm = _react.default.createClass({
    displayName: 'CreateForm',
    propTypes: {
        err: _react.default.PropTypes.object,
        isOpen: _react.default.PropTypes.bool,
        list: _react.default.PropTypes.object,
        onCancel: _react.default.PropTypes.func,
        onCreate: _react.default.PropTypes.func
    },
    getDefaultProps () {
        return {
            err: null,
            isOpen: false
        };
    },
    getInitialState () {
        // Set the field values to their default values when first rendering the
        // form. (If they have a default value, that is)
        const values = {};
        Object.keys(this.props.list.fields).forEach((key)=>{
            const field = this.props.list.fields[key];
            const FieldComponent = _FieldTypes.Fields[field.type];
            values[field.path] = FieldComponent.getDefaultValue(field);
        });
        return {
            values: values,
            alerts: {}
        };
    },
    componentDidMount () {
        document.body.addEventListener('keyup', this.handleKeyPress, false);
    },
    componentWillUnmount () {
        document.body.removeEventListener('keyup', this.handleKeyPress, false);
    },
    handleKeyPress (evt) {
        if (evt.key === 'Escape') {
            this.props.onCancel();
        }
    },
    // Handle input change events
    handleChange (event) {
        const values = Object.assign({}, this.state.values);
        values[event.path] = event.value;
        this.setState({
            values: values
        });
    },
    // Set the props of a field
    getFieldProps (field) {
        const props = Object.assign({}, field);
        props.value = this.state.values[field.path];
        props.values = this.state.values;
        props.onChange = this.handleChange;
        props.mode = 'create';
        props.key = field.path;
        return props;
    },
    // Create a new item when the form is submitted
    submitForm (event) {
        event.preventDefault();
        const createForm = event.target;
        const formData = new FormData(createForm);
        this.props.list.createItem(formData, (err, data)=>{
            if (data) {
                if (this.props.onCreate) {
                    this.props.onCreate(data);
                } else {
                    // Clear form
                    this.setState({
                        values: {},
                        alerts: {
                            success: {
                                success: 'Item created'
                            }
                        }
                    });
                }
            } else {
                if (!err) {
                    err = {
                        error: 'connection error'
                    };
                }
                // If we get a database error, show the database error message
                // instead of only saying "Database error"
                if (err.error === 'database error') {
                    err.error = err.detail.errmsg;
                }
                this.setState({
                    alerts: {
                        error: err
                    }
                });
            }
        });
    },
    // Render the form itself
    renderForm () {
        if (!this.props.isOpen) return;
        const form = [];
        const list = this.props.list;
        const nameField = this.props.list.nameField;
        let focusWasSet;
        // If the name field is an initial one, we need to render a proper
        // input for it
        if (list.nameIsInitial) {
            const nameFieldProps = this.getFieldProps(nameField);
            nameFieldProps.autoFocus = focusWasSet = true;
            if (nameField.type === 'text') {
                nameFieldProps.className = 'item-name-field';
                nameFieldProps.placeholder = nameField.label;
                nameFieldProps.label = '';
            }
            form.push(/*#__PURE__*/ _react.default.createElement(_FieldTypes.Fields[nameField.type], nameFieldProps));
        }
        // Render inputs for all initial fields
        Object.keys(list.initialFields).forEach((key)=>{
            const field = list.fields[list.initialFields[key]];
            // If there's something weird passed in as field type, render the
            // invalid field type component
            if (typeof _FieldTypes.Fields[field.type] !== 'function') {
                form.push(/*#__PURE__*/ _react.default.createElement(_InvalidFieldType.default, {
                    type: field.type,
                    path: field.path,
                    key: field.path
                }));
                return;
            }
            // Get the props for the input field
            const fieldProps = this.getFieldProps(field);
            // If there was no focusRef set previously, set the current field to
            // be the one to be focussed. Generally the first input field, if
            // there's an initial name field that takes precedence.
            if (!focusWasSet) {
                fieldProps.autoFocus = focusWasSet = true;
            }
            form.push(/*#__PURE__*/ _react.default.createElement(_FieldTypes.Fields[field.type], fieldProps));
        });
        return /*#__PURE__*/ _react.default.createElement(_index.Form, {
            layout: "horizontal",
            onSubmit: this.submitForm
        }, /*#__PURE__*/ _react.default.createElement(_index.Modal.Header, {
            text: 'Create a new ' + list.singular,
            showCloseButton: true
        }), /*#__PURE__*/ _react.default.createElement(_index.Modal.Body, null, /*#__PURE__*/ _react.default.createElement(_AlertMessages.default, {
            alerts: this.state.alerts
        }), form), /*#__PURE__*/ _react.default.createElement(_index.Modal.Footer, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
            color: "success",
            type: "submit",
            "data-button-type": "submit"
        }, "Create"), /*#__PURE__*/ _react.default.createElement(_index.Button, {
            variant: "link",
            color: "cancel",
            "data-button-type": "cancel",
            onClick: this.props.onCancel
        }, "Cancel")));
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_index.Modal.Dialog, {
            isOpen: this.props.isOpen,
            onClose: this.props.onCancel,
            backdropClosesModal: true
        }, this.renderForm());
    }
});
const _default = CreateForm;

},{"../elemental/index.mjs":64,"./AlertMessages.mjs":66,"./InvalidFieldType.mjs":68,"FieldTypes":"FieldTypes","react":undefined}],68:[function(require,module,exports){
/**
 * Renders an "Invalid Field Type" error
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
const InvalidFieldType = function(props) {
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: "alert alert-danger"
    }, "Invalid field type ", /*#__PURE__*/ _react.default.createElement("strong", null, props.type), " at path ", /*#__PURE__*/ _react.default.createElement("strong", null, props.path));
};
InvalidFieldType.propTypes = {
    path: _react.default.PropTypes.string,
    type: _react.default.PropTypes.string
};
const _default = InvalidFieldType;

},{"react":undefined}],69:[function(require,module,exports){
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
const _theme = /*#__PURE__*/ _interop_require_default(require("../../theme.mjs"));
const _color = require("../../utils/color.mjs");
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
 * Renders a styled keyboard key element.
 *
 * Wraps the native `<kbd>` element with Glamor CSS classes that give it the
 * appearance of a physical keyboard key (border, background, box-shadow, and
 * monospace font). The `className` prop is intentionally discarded and replaced
 * with the generated Glamor class.
 * @param {object} props             Props forwarded to the `<kbd>` element.
 * @param {string} [props.className] Ignored; overridden by the generated style class.
 * @returns {React.Element} A styled `<kbd>` element.
 */ function Kbd(_0) {
    let { className } = _0, props = _object_without_properties(_0, [
        "className"
    ]);
    props.className = (0, _glamor.css)(classes.kbd);
    return /*#__PURE__*/ _react.default.createElement("kbd", props);
}
const classes = {
    kbd: {
        backgroundColor: _theme.default.color.body,
        borderRadius: 3,
        border: `1px solid #ccc`,
        borderBottomColor: (0, _color.darken)('#ccc', 4),
        borderTopColor: (0, _color.lighten)('#ccc', 4),
        boxShadow: `0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset`,
        display: 'inline-block',
        fontFamily: 'Consolas, "Liberation Mono", Courier, monospace',
        fontSize: '0.85em',
        fontWeight: 700,
        lineHeight: 'inherit',
        padding: '1px 4px',
        whiteSpace: 'nowrap',
        // little hack to tweak "visual-middle" alignment
        position: 'relative',
        top: -1
    }
};
const _default = Kbd;

},{"../../theme.mjs":80,"../../utils/color.mjs":84,"glamor":undefined,"react":undefined}],70:[function(require,module,exports){
/**
 * Render the body of a popout
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
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
const PopoutBody = _react.default.createClass({
    displayName: 'PopoutBody',
    propTypes: {
        children: _react.default.PropTypes.node.isRequired,
        className: _react.default.PropTypes.string,
        scrollable: _react.default.PropTypes.bool
    },
    render () {
        const className = (0, _classnames.default)('Popout__body', {
            'Popout__scrollable-area': this.props.scrollable
        }, this.props.className);
        const _this_props = this.props, { className: _cn, scrollable: _sc } = _this_props, props = _object_without_properties(_this_props, [
            "className",
            "scrollable"
        ]);
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            className: className
        }, props));
    }
});
const _default = PopoutBody;

},{"classnames":undefined,"react":undefined}],71:[function(require,module,exports){
/**
 * Render a footer for a popout
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
const BUTTON_BASE_CLASSNAME = 'Popout__footer__button Popout__footer__button--';
const PopoutFooter = _react.default.createClass({
    displayName: 'PopoutFooter',
    propTypes: {
        children: _react.default.PropTypes.node,
        primaryButtonAction: _react.default.PropTypes.func,
        primaryButtonIsSubmit: _react.default.PropTypes.bool,
        primaryButtonLabel: _react.default.PropTypes.string,
        secondaryButtonAction: _react.default.PropTypes.func,
        secondaryButtonLabel: _react.default.PropTypes.string
    },
    // Render a primary button
    renderPrimaryButton () {
        if (!this.props.primaryButtonLabel) return null;
        return /*#__PURE__*/ _react.default.createElement("button", {
            type: this.props.primaryButtonIsSubmit ? 'submit' : 'button',
            className: BUTTON_BASE_CLASSNAME + 'primary',
            onClick: this.props.primaryButtonAction
        }, this.props.primaryButtonLabel);
    },
    // Render a secondary button
    renderSecondaryButton () {
        if (!this.props.secondaryButtonAction || !this.props.secondaryButtonLabel) return null;
        return /*#__PURE__*/ _react.default.createElement("button", {
            type: "button",
            className: BUTTON_BASE_CLASSNAME + 'secondary',
            onClick: this.props.secondaryButtonAction
        }, this.props.secondaryButtonLabel);
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "Popout__footer"
        }, this.renderPrimaryButton(), this.renderSecondaryButton(), this.props.children);
    }
});
const _default = PopoutFooter;

},{"react":undefined}],72:[function(require,module,exports){
/**
 * Render a header for a popout
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
const _reactaddonscsstransitiongroup = /*#__PURE__*/ _interop_require_default(require("react-addons-css-transition-group"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PopoutHeader = _react.default.createClass({
    displayName: 'PopoutHeader',
    propTypes: {
        leftAction: _react.default.PropTypes.func,
        leftIcon: _react.default.PropTypes.string,
        title: _react.default.PropTypes.string.isRequired,
        transitionDirection: _react.default.PropTypes.oneOf([
            'next',
            'prev'
        ])
    },
    render () {
        // If we have a left action and a left icon, render a header button
        const headerButton = this.props.leftAction && this.props.leftIcon ? /*#__PURE__*/ _react.default.createElement("button", {
            key: 'button_' + this.props.transitionDirection,
            type: "button",
            className: 'Popout__header__button octicon octicon-' + this.props.leftIcon,
            onClick: this.props.leftAction
        }) : null;
        // If we have a title, render it
        const headerTitle = this.props.title ? /*#__PURE__*/ _react.default.createElement("span", {
            key: 'title_' + this.props.transitionDirection,
            className: "Popout__header__label"
        }, this.props.title) : null;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "Popout__header"
        }, /*#__PURE__*/ _react.default.createElement(_reactaddonscsstransitiongroup.default, {
            transitionName: "Popout__header__button",
            transitionEnterTimeout: 200,
            transitionLeaveTimeout: 200
        }, headerButton), /*#__PURE__*/ _react.default.createElement(_reactaddonscsstransitiongroup.default, {
            transitionName: 'Popout__pane-' + this.props.transitionDirection,
            transitionEnterTimeout: 360,
            transitionLeaveTimeout: 360
        }, headerTitle));
    }
});
const _default = PopoutHeader;

},{"react":undefined,"react-addons-css-transition-group":undefined}],73:[function(require,module,exports){
/**
 * Render a popout list heading
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
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
const PopoutListHeading = _react.default.createClass({
    displayName: 'PopoutListHeading',
    propTypes: {
        children: _react.default.PropTypes.node.isRequired,
        className: _react.default.PropTypes.string
    },
    render () {
        const className = (0, _classnames.default)('PopoutList__heading', this.props.className);
        const _this_props = this.props, { className: _cn } = _this_props, props = _object_without_properties(_this_props, [
            "className"
        ]);
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            className: className
        }, props));
    }
});
const _default = PopoutListHeading;

},{"classnames":undefined,"react":undefined}],74:[function(require,module,exports){
/**
 * Render a popout list item
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
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
const PopoutListItem = _react.default.createClass({
    displayName: 'PopoutListItem',
    propTypes: {
        icon: _react.default.PropTypes.string,
        iconHover: _react.default.PropTypes.string,
        isSelected: _react.default.PropTypes.bool,
        label: _react.default.PropTypes.string.isRequired,
        onClick: _react.default.PropTypes.func
    },
    getInitialState () {
        return {
            hover: false
        };
    },
    hover () {
        this.setState({
            hover: true
        });
    },
    unhover () {
        this.setState({
            hover: false
        });
    },
    // Render an icon
    renderIcon () {
        if (!this.props.icon) return null;
        const icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
        const iconClassname = (0, _classnames.default)('PopoutList__item__icon octicon', 'octicon-' + icon);
        return /*#__PURE__*/ _react.default.createElement("span", {
            className: iconClassname
        });
    },
    render () {
        const itemClassname = (0, _classnames.default)('PopoutList__item', {
            'is-selected': this.props.isSelected
        });
        const _this_props = this.props, { className: _cn, icon: _i, iconHover: _ih, isSelected: _is, label: _l } = _this_props, props = _object_without_properties(_this_props, [
            "className",
            "icon",
            "iconHover",
            "isSelected",
            "label"
        ]);
        return /*#__PURE__*/ _react.default.createElement("button", _object_spread({
            type: "button",
            title: this.props.label,
            className: itemClassname,
            onFocus: this.hover,
            onBlur: this.unhover,
            onMouseOver: this.hover,
            onMouseOut: this.unhover
        }, props), this.renderIcon(), /*#__PURE__*/ _react.default.createElement("span", {
            className: "PopoutList__item__label"
        }, this.props.label));
    }
});
const _default = PopoutListItem;

},{"classnames":undefined,"react":undefined}],75:[function(require,module,exports){
/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */ "use strict";
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
    get Heading () {
        return _PopoutListHeading.default;
    },
    get Item () {
        return _PopoutListItem.default;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _PopoutListItem = /*#__PURE__*/ _interop_require_default(require("./PopoutListItem.mjs"));
const _PopoutListHeading = /*#__PURE__*/ _interop_require_default(require("./PopoutListHeading.mjs"));
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
const PopoutList = _react.default.createClass({
    displayName: 'PopoutList',
    propTypes: {
        children: _react.default.PropTypes.node.isRequired,
        className: _react.default.PropTypes.string
    },
    render () {
        const className = (0, _classnames.default)('PopoutList', this.props.className);
        const _this_props = this.props, { className: _cn } = _this_props, props = _object_without_properties(_this_props, [
            "className"
        ]);
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            className: className
        }, props));
    }
});
PopoutList.Item = _PopoutListItem.default;
PopoutList.Heading = _PopoutListHeading.default;
const _default = PopoutList;

},{"./PopoutListHeading.mjs":73,"./PopoutListItem.mjs":74,"classnames":undefined,"react":undefined}],76:[function(require,module,exports){
/**
 * Render a popout pane, calls props.onLayout when the component mounts
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
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
const PopoutPane = _react.default.createClass({
    displayName: 'PopoutPane',
    propTypes: {
        children: _react.default.PropTypes.node.isRequired,
        className: _react.default.PropTypes.string,
        onLayout: _react.default.PropTypes.func
    },
    getDefaultProps () {
        return {
            onLayout: ()=>{}
        };
    },
    componentDidMount () {
        this.props.onLayout(this.refs.el.offsetHeight);
    },
    render () {
        const className = (0, _classnames.default)('Popout__pane', this.props.className);
        const _this_props = this.props, { className: _cn, onLayout: _ol } = _this_props, props = _object_without_properties(_this_props, [
            "className",
            "onLayout"
        ]);
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            ref: "el",
            className: className
        }, props));
    }
});
const _default = PopoutPane;

},{"classnames":undefined,"react":undefined}],77:[function(require,module,exports){
/**
 * A Popout component.
 * One can also add a Header (Popout/Header), a Footer
 * (Popout/Footer), a Body (Popout/Body) and a Pan (Popout/Pane).
 */ "use strict";
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
        return _PopoutBody.default;
    },
    get Footer () {
        return _PopoutFooter.default;
    },
    get Header () {
        return _PopoutHeader.default;
    },
    get Pane () {
        return _PopoutPane.default;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Portal = /*#__PURE__*/ _interop_require_default(require("../Portal.mjs"));
const _reactaddonscsstransitiongroup = /*#__PURE__*/ _interop_require_default(require("react-addons-css-transition-group"));
const _PopoutHeader = /*#__PURE__*/ _interop_require_default(require("./PopoutHeader.mjs"));
const _PopoutBody = /*#__PURE__*/ _interop_require_default(require("./PopoutBody.mjs"));
const _PopoutFooter = /*#__PURE__*/ _interop_require_default(require("./PopoutFooter.mjs"));
const _PopoutPane = /*#__PURE__*/ _interop_require_default(require("./PopoutPane.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SIZES = {
    arrowHeight: 12,
    arrowWidth: 16,
    horizontalMargin: 20
};
const Popout = _react.default.createClass({
    displayName: 'Popout',
    propTypes: {
        isOpen: _react.default.PropTypes.bool,
        onCancel: _react.default.PropTypes.func,
        onSubmit: _react.default.PropTypes.func,
        relativeToID: _react.default.PropTypes.string.isRequired,
        width: _react.default.PropTypes.number
    },
    getDefaultProps () {
        return {
            width: 320
        };
    },
    getInitialState () {
        return {};
    },
    componentWillReceiveProps (nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            window.addEventListener('resize', this.calculatePosition);
            this.calculatePosition(nextProps.isOpen);
        } else if (this.props.isOpen && !nextProps.isOpen) {
            window.removeEventListener('resize', this.calculatePosition);
        }
    },
    getPortalDOMNode () {
        return this.refs.portal.getPortalDOMNode();
    },
    calculatePosition (isOpen) {
        if (!isOpen) return;
        let posNode = document.getElementById(this.props.relativeToID);
        const pos = {
            top: 0,
            left: 0,
            width: posNode.offsetWidth,
            height: posNode.offsetHeight
        };
        while(posNode.offsetParent){
            pos.top += posNode.offsetTop;
            pos.left += posNode.offsetLeft;
            posNode = posNode.offsetParent;
        }
        let leftOffset = Math.max(pos.left + pos.width / 2 - this.props.width / 2, SIZES.horizontalMargin);
        const topOffset = pos.top + pos.height + SIZES.arrowHeight;
        const spaceOnRight = window.innerWidth - (leftOffset + this.props.width + SIZES.horizontalMargin);
        if (spaceOnRight < 0) {
            leftOffset = leftOffset + spaceOnRight;
        }
        const arrowLeftOffset = leftOffset === SIZES.horizontalMargin ? pos.left + pos.width / 2 - SIZES.arrowWidth / 2 - SIZES.horizontalMargin : null;
        const newStateAvaliable = this.state.leftOffset !== leftOffset || this.state.topOffset !== topOffset || this.state.arrowLeftOffset !== arrowLeftOffset;
        if (newStateAvaliable) {
            this.setState({
                leftOffset: leftOffset,
                topOffset: topOffset,
                arrowLeftOffset: arrowLeftOffset
            });
        }
    },
    renderPopout () {
        if (!this.props.isOpen) return null;
        const { width } = this.props;
        const { arrowLeftOffset, leftOffset: left, topOffset: top } = this.state;
        const arrowStyles = arrowLeftOffset ? {
            left: 0,
            marginLeft: arrowLeftOffset
        } : null;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "Popout",
            style: {
                left,
                top,
                width
            }
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "Popout__arrow",
            style: arrowStyles
        }), /*#__PURE__*/ _react.default.createElement("div", {
            className: "Popout__inner"
        }, this.props.children));
    },
    renderBlockout () {
        if (!this.props.isOpen) return;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "blockout",
            onClick: this.props.onCancel
        });
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_Portal.default, {
            className: "Popout-wrapper",
            ref: "portal"
        }, /*#__PURE__*/ _react.default.createElement(_reactaddonscsstransitiongroup.default, {
            transitionEnterTimeout: 200,
            transitionLeaveTimeout: 200,
            transitionName: "Popout"
        }, this.renderPopout()), this.renderBlockout());
    }
});
Popout.Header = _PopoutHeader.default;
Popout.Body = _PopoutBody.default;
Popout.Footer = _PopoutFooter.default;
Popout.Pane = _PopoutPane.default;
const _default = Popout;

},{"../Portal.mjs":78,"./PopoutBody.mjs":70,"./PopoutFooter.mjs":71,"./PopoutHeader.mjs":72,"./PopoutPane.mjs":76,"react":undefined,"react-addons-css-transition-group":undefined}],78:[function(require,module,exports){
/**
 * Used by the Popout component and the Lightbox component of the fields for
 * popouts. Renders a non-react DOM node.
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
const _reactdom = /*#__PURE__*/ _interop_require_default(require("react-dom"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _react.default.createClass({
    displayName: 'Portal',
    portalElement: null,
    componentDidMount () {
        const el = document.createElement('div');
        document.body.appendChild(el);
        this.portalElement = el;
        this.componentDidUpdate();
    },
    componentWillUnmount () {
        document.body.removeChild(this.portalElement);
    },
    componentDidUpdate () {
        _reactdom.default.render(/*#__PURE__*/ _react.default.createElement("div", this.props), this.portalElement);
    },
    getPortalDOMNode () {
        return this.portalElement;
    },
    render () {
        return null;
    }
});

},{"react":undefined,"react-dom":undefined}],79:[function(require,module,exports){
/**
 * Constants
 */ // breakpoints
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
    get NETWORK_ERROR_RETRY_DELAY () {
        return NETWORK_ERROR_RETRY_DELAY;
    },
    get TABLE_CONTROL_COLUMN_WIDTH () {
        return TABLE_CONTROL_COLUMN_WIDTH;
    },
    get borderRadius () {
        return borderRadius;
    },
    get breakpoint () {
        return breakpoint;
    },
    get color () {
        return color;
    },
    get default () {
        return _default;
    },
    get spacing () {
        return spacing;
    }
});
const breakpoint = {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200
};
const borderRadius = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 32
};
const color = {
    appDanger: '#d64242',
    appInfo: '#56cdfc',
    appPrimary: '#1385e5',
    appSuccess: '#34c240',
    appWarning: '#fa9f47'
};
const spacing = {
    xs: 5,
    sm: 10,
    md: 20,
    lg: 40,
    xl: 80
};
const TABLE_CONTROL_COLUMN_WIDTH = 26; // icon + padding
const NETWORK_ERROR_RETRY_DELAY = 500; // in ms
const _default = {
    breakpoint,
    borderRadius,
    color,
    spacing,
    TABLE_CONTROL_COLUMN_WIDTH,
    NETWORK_ERROR_RETRY_DELAY
};

},{}],80:[function(require,module,exports){
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

},{"./utils/color.mjs":84}],81:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"./utils/color.mjs":84,"dup":80}],82:[function(require,module,exports){
/**
 * Helper method to handle List operations, e.g. creating items, deleting items,
 * getting information about those lists, etc.
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
const _listToArray = /*#__PURE__*/ _interop_require_default(require("../../../lib/list/listToArray.mjs"));
const _qs = /*#__PURE__*/ _interop_require_default(require("qs"));
const _xhr = /*#__PURE__*/ _interop_require_default(require("xhr"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Filters for truthy elements in an array
const truthy = (i)=>i;
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
/**
 * Get the columns of a list, structured by fields and headings
 * @param  {object} list The list we want the columns of
 * @returns {Array}      The columns
 */ function getColumns(list) {
    return list.uiElements.map((col)=>{
        if (col.type === 'heading') {
            return {
                type: 'heading',
                content: col.content
            };
        } else {
            const field = list.fields[col.field];
            return field ? {
                type: 'field',
                field: field,
                title: field.label,
                path: field.path
            } : null;
        }
    }).filter(truthy);
}
/**
 * Make an array of filters an object keyed by the filtering path
 * @param  {Array} filterArray The array of filters
 * @returns {object}           The corrected filters, keyed by path
 */ function getFilters(filterArray) {
    const filters = {};
    filterArray.forEach((filter)=>{
        filters[filter.field.path] = filter.value;
    });
    return filters;
}
/**
 * Get the sorting string for the URI
 * @param  {object} sort       The sort object containing the paths to sort by
 * @param  {Array}  sort.paths The paths we want to sort
 * @returns {string}           All the sorting queries we want as a string
 */ function getSortString(sort) {
    return sort.paths.map((i)=>{
        // If we want to sort inverted, we prefix a "-" before the sort path
        return i.invert ? '-' + i.path : i.path;
    }).filter(truthy).join(',');
}
/**
 * Build a query string from a bunch of options
 * @param  {object} options Query configuration including search, filters, columns, page and sort
 * @returns {string}        The query string, prefixed with "?"
 */ function buildQueryString(options) {
    const query = {};
    if (options.search) query.search = options.search;
    if (options.filters.length) query.filters = JSON.stringify(getFilters(options.filters));
    if (options.columns) query.fields = options.columns.map((i)=>i.path).join(',');
    if (options.page && options.page.size) query.limit = options.page.size;
    if (options.page && options.page.index > 1) query.skip = (options.page.index - 1) * options.page.size;
    if (options.sort) query.sort = getSortString(options.sort);
    query.expandRelationshipFields = true;
    return '?' + _qs.default.stringify(query);
}
/**
 * The main list helper class
 * @param {object} options Configuration options for the list
 */ const List = function(options) {
    // TODO these options are possibly unused
    Object.assign(this, options);
    this.columns = getColumns(this);
    this.expandedDefaultColumns = this.expandColumns(this.defaultColumns);
    this.defaultColumnPaths = this.expandedDefaultColumns.map((i)=>i.path).join(',');
};
/**
 * Create an item via the API
 * @param  {FormData} formData The submitted form data
 * @param  {function()} callback Called after the API call
 */ List.prototype.createItem = function(formData, callback) {
    (0, _xhr.default)({
        url: `${getAdminApiPath()}/${this.path}/create`,
        responseType: 'json',
        method: 'POST',
        headers: Object.assign({}, Keystone.csrf.header),
        body: formData
    }, (err, resp, data)=>{
        if (err) callback(err);
        if (resp.statusCode === 200) {
            callback(null, data);
        } else {
            // NOTE: xhr callback will be called with an Error if
            //  there is an error in the browser that prevents
            //  sending the request. A HTTP 500 response is not
            //  going to cause an error to be returned.
            callback(data, null);
        }
    });
};
/**
 * Update a specific item
 * @param  {string}   id       The id of the item we want to update
 * @param  {FormData} formData The submitted form data
 * @param  {function()} callback Called after the API call
 */ List.prototype.updateItem = function(id, formData, callback) {
    (0, _xhr.default)({
        url: `${getAdminApiPath()}/${this.path}/${id}`,
        responseType: 'json',
        method: 'POST',
        headers: Object.assign({}, Keystone.csrf.header),
        body: formData
    }, (err, resp, data)=>{
        if (err) return callback(err);
        if (resp.statusCode === 200) {
            callback(null, data);
        } else {
            callback(data);
        }
    });
};
List.prototype.expandColumns = function(input) {
    let nameIncluded = false;
    const cols = (0, _listToArray.default)(input).map((i)=>{
        const split = i.split('|');
        let path = split[0];
        const width = split[1];
        if (path === '__name__') {
            path = this.namePath;
        }
        const field = this.fields[path];
        if (!field) {
            // TODO: Support arbitary document paths
            if (!this.hidden) {
                if (path === this.namePath) {
                    console.warn(`List ${this.key} did not specify any default columns or a name field`);
                } else {
                    console.warn(`List ${this.key} specified an invalid default column: ${path}`);
                }
            }
            return;
        }
        if (path === this.namePath) {
            nameIncluded = true;
        }
        return {
            field: field,
            label: field.label,
            path: field.path,
            type: field.type,
            width: width
        };
    }).filter(truthy);
    if (!nameIncluded) {
        cols.unshift({
            type: 'id',
            label: 'ID',
            path: 'id'
        });
    }
    return cols;
};
List.prototype.expandSort = function(input) {
    const sort = {
        rawInput: input || this.defaultSort,
        isDefaultSort: false
    };
    sort.input = sort.rawInput;
    if (sort.input === '__default__') {
        sort.isDefaultSort = true;
        sort.input = this.sortable ? 'sortOrder' : this.namePath;
    }
    sort.paths = (0, _listToArray.default)(sort.input).map((path)=>{
        let invert = false;
        if (path.charAt(0) === '-') {
            invert = true;
            path = path.slice(1);
        } else if (path.charAt(0) === '+') {
            path = path.slice(1);
        }
        const field = this.fields[path];
        if (!field) {
            // TODO: Support arbitary document paths
            console.warn('Invalid Sort specified:', path);
            return;
        }
        return {
            field: field,
            type: field.type,
            label: field.label,
            path: field.path,
            invert: invert
        };
    }).filter(truthy);
    return sort;
};
/**
 * Load a specific item via the API
 * @param  {string}   itemId   The id of the item we want to load
 * @param  {object}   options  Optional query parameters to append to the request
 * @param  {function()} callback Called with (err, data) after the API call
 */ List.prototype.loadItem = function(itemId, options, callback) {
    if (arguments.length === 2 && typeof options === 'function') {
        callback = options;
        options = null;
    }
    let url = getAdminApiPath() + '/' + this.path + '/' + itemId;
    const query = _qs.default.stringify(options);
    if (query.length) url += '?' + query;
    (0, _xhr.default)({
        url: url,
        responseType: 'json'
    }, (err, resp, data)=>{
        if (err) return callback(err);
        // Pass the data as result or error, depending on the statusCode
        if (resp.statusCode === 200) {
            callback(null, data);
        } else {
            callback(data);
        }
    });
};
/**
 * Load all items of a list, optionally passing objects to build a query string
 * for sorting or searching
 * @param  {object}   options  Query configuration including search, filters, columns, page and sort
 * @param  {function()} callback Called with (err, data) after the API call
 */ List.prototype.loadItems = function(options, callback) {
    const url = getAdminApiPath() + '/' + this.path + buildQueryString(options);
    (0, _xhr.default)({
        url: url,
        responseType: 'json'
    }, (err, resp, data)=>{
        if (err) callback(err);
        // Pass the data as result or error, depending on the statusCode
        if (resp.statusCode === 200) {
            callback(null, data);
        } else {
            callback(data);
        }
    });
};
/**
 * Constructs a download URL to download a list with the current sorting, filtering,
 * selection and searching options
 * @param  {object} options Query configuration including search, filters, columns and sort
 * @returns {string}        The download URL
 */ List.prototype.getDownloadURL = function(options) {
    const url = getAdminApiPath() + '/' + this.path;
    const parts = [];
    if (options.format !== 'json') {
        options.format = 'csv';
    }
    parts.push(options.search ? 'search=' + options.search : '');
    parts.push(options.filters.length ? 'filters=' + JSON.stringify(getFilters(options.filters)) : '');
    parts.push(options.columns ? 'select=' + options.columns.map((i)=>i.path).join(',') : '');
    parts.push(options.sort ? 'sort=' + getSortString(options.sort) : '');
    parts.push('expandRelationshipFields=true');
    return url + '/export.' + options.format + '?' + parts.filter(truthy).join('&');
};
/**
 * Delete a specific item via the API
 * @param  {string}   itemId   The id of the item we want to delete
 * @param  {function()} callback Called with (err, body) after the API call
 */ List.prototype.deleteItem = function(itemId, callback) {
    this.deleteItems([
        itemId
    ], callback);
};
/**
 * Delete multiple items at once via the API
 * @param  {Array}    itemIds  An array of ids of items we want to delete
 * @param  {function()} callback Called with (err, body) after the API call
 */ List.prototype.deleteItems = function(itemIds, callback) {
    const url = getAdminApiPath() + '/' + this.path + '/delete';
    (0, _xhr.default)({
        url: url,
        method: 'POST',
        headers: Object.assign({}, Keystone.csrf.header),
        json: {
            ids: itemIds
        }
    }, (err, resp, body)=>{
        if (err) return callback(err);
        // Pass the body as result or error, depending on the statusCode
        if (resp.statusCode === 200) {
            callback(null, body);
        } else {
            callback(body);
        }
    });
};
List.prototype.reorderItems = function(item, oldSortOrder, newSortOrder, pageOptions, callback) {
    const url = getAdminApiPath() + '/' + this.path + '/' + item.id + '/sortOrder/' + oldSortOrder + '/' + newSortOrder + '/' + buildQueryString(pageOptions);
    (0, _xhr.default)({
        url: url,
        method: 'POST',
        headers: Object.assign({}, Keystone.csrf.header)
    }, (err, resp, body)=>{
        if (err) return callback(err);
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.log('Error parsing results json:', e, body);
            return callback(e);
        }
        // Pass the body as result or error, depending on the statusCode
        if (resp.statusCode === 200) {
            callback(null, body);
        } else {
            callback(body);
        }
    });
};
const _default = List;

},{"../../../lib/list/listToArray.mjs":199,"qs":undefined,"xhr":undefined}],83:[function(require,module,exports){
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
const _cloudinarymicrourl = /*#__PURE__*/ _interop_require_default(require("cloudinary-microurl"));
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
function getCloudName() {
    const keystone = typeof window !== 'undefined' ? window.Keystone : undefined;
    return keystone && keystone.cloudinary && keystone.cloudinary.cloud_name;
}
/**
 * Takes a Cloudinary public id and an options object and returns a resized image URL.
 * Returns false if no publicId or cloud name is available.
 * @param  {string} publicId The Cloudinary public id of the image
 * @param  {object} [options] Additional Cloudinary URL options to merge in
 * @returns {string|boolean} The constructed Cloudinary URL, or false if inputs are missing
 */ function cloudinaryResize(publicId, options = {}) {
    const cloudName = getCloudName();
    if (!publicId || !cloudName) return false;
    return (0, _cloudinarymicrourl.default)(publicId, _object_spread({
        cloud_name: cloudName,
        quality: 80
    }, options));
}
const _default = cloudinaryResize;

},{"cloudinary-microurl":202}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
/**
 * Exports an object of lists, keyed with their key instead of their name and
 * wrapped with the List helper (./List.js)
 */ "use strict";
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
    get listsByKey () {
        return listsByKey;
    },
    get listsByPath () {
        return listsByPath;
    }
});
const _List = /*#__PURE__*/ _interop_require_default(require("./List.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const listsByKey = {};
const listsByPath = {};
for(const key in Keystone.lists){
    // Guard for-ins
    if (({}).hasOwnProperty.call(Keystone.lists, key)) {
        const list = new _List.default(Keystone.lists[key]);
        listsByKey[key] = list;
        listsByPath[list.path] = list;
    }
}

},{"./List.mjs":82}],89:[function(require,module,exports){
/**
 * A few helper methods for strings
 */ "use strict";
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
    get camelcase () {
        return camelcase;
    },
    get downcase () {
        return downcase;
    },
    get plural () {
        return plural;
    },
    get titlecase () {
        return titlecase;
    },
    get upcase () {
        return upcase;
    }
});
const _lodash = require("lodash");
const plural = function(count, sn, pl) {
    if (arguments.length === 1) {
        return typeof count === 'string' ? count + 's' : count;
    }
    if (typeof sn !== 'string') sn = '';
    if (!pl) {
        pl = sn + 's';
    }
    if (typeof count === 'string') {
        count = Number(count);
    } else if (typeof count !== 'number') {
        count = (0, _lodash.size)(count);
    }
    return (count === 1 ? sn : pl).replace('*', count);
};
const upcase = function(str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== 'string' || !str.length) return '';
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};
const downcase = function(str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== 'string' || !str.length) return '';
    return str.slice(0, 1).toLowerCase() + str.slice(1);
};
const titlecase = function(str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== 'string' || !str.length) return '';
    str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    const parts = str.split(/\s|_|\-/);
    for(let i = 0; i < parts.length; i++){
        if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
            parts[i] = upcase(parts[i]);
        }
    }
    return (0, _lodash.compact)(parts).join(' ');
};
const camelcase = function(str, lc) {
    return lc ? (0, _lodash.camelCase)(str) : (0, _lodash.upperFirst)((0, _lodash.camelCase)(str));
};

},{"lodash":undefined}],90:[function(require,module,exports){
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _color = require("../../admin/client-legacy/utils/color");
const _constants = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/constants"));
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
const Checkbox = _react.default.createClass({
    displayName: 'Checkbox',
    propTypes: {
        checked: _react.default.PropTypes.bool,
        component: _react.default.PropTypes.node,
        onChange: _react.default.PropTypes.func,
        readonly: _react.default.PropTypes.bool
    },
    getDefaultProps () {
        return {
            component: 'button'
        };
    },
    getInitialState () {
        return {
            active: null,
            focus: null,
            hover: null
        };
    },
    componentDidMount () {
        window.addEventListener('mouseup', this.handleMouseUp, false);
    },
    componentWillUnmount () {
        window.removeEventListener('mouseup', this.handleMouseUp, false);
    },
    getStyles () {
        const { checked, readonly } = this.props;
        const { active, focus, hover } = this.state;
        const checkedColor = '#3999fc';
        let background = checked && !readonly ? checkedColor : 'white';
        let borderColor = checked && !readonly ? 'rgba(0,0,0,0.15) rgba(0,0,0,0.1) rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.3) rgba(0,0,0,0.2) rgba(0,0,0,0.15)';
        let boxShadow = checked && !readonly ? '0 1px 0 rgba(255,255,255,0.33)' : 'inset 0 1px 0 rgba(0,0,0,0.06)';
        let color = checked && !readonly ? 'white' : '#bbb';
        const textShadow = checked && !readonly ? '0 1px 0 rgba(0,0,0,0.2)' : null;
        // pseudo state
        if (hover && !focus && !readonly) {
            borderColor = checked ? 'rgba(0,0,0,0.1) rgba(0,0,0,0.15) rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.35) rgba(0,0,0,0.3) rgba(0,0,0,0.25)';
        }
        if (active) {
            background = checked && !readonly ? (0, _color.darken)(checkedColor, 20) : '#eee';
            borderColor = checked && !readonly ? 'rgba(0,0,0,0.25) rgba(0,0,0,0.3) rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.4) rgba(0,0,0,0.35) rgba(0,0,0,0.3)';
            boxShadow = checked && !readonly ? '0 1px 0 rgba(255,255,255,0.33)' : 'inset 0 1px 3px rgba(0,0,0,0.2)';
        }
        if (focus && !active) {
            borderColor = checked && !readonly ? 'rgba(0,0,0,0.25) rgba(0,0,0,0.3) rgba(0,0,0,0.35)' : checkedColor;
            boxShadow = checked && !readonly ? `0 0 0 3px ${(0, _color.fade)(checkedColor, 15)}` : `inset 0 1px 2px rgba(0,0,0,0.15), 0 0 0 3px ${(0, _color.fade)(checkedColor, 15)}`;
        }
        // noedit
        if (readonly) {
            background = 'rgba(255,255,255,0.5)';
            borderColor = 'rgba(0,0,0,0.1)';
            boxShadow = 'none';
            color = checked ? checkedColor : '#bbb';
        }
        return {
            alignItems: 'center',
            background: background,
            border: '1px solid',
            borderColor: borderColor,
            borderRadius: _constants.default.borderRadius.sm,
            boxShadow: boxShadow,
            color: color,
            display: 'inline-block',
            fontSize: 14,
            height: 16,
            lineHeight: '15px',
            outline: 'none',
            padding: 0,
            textAlign: 'center',
            textShadow: textShadow,
            verticalAlign: 'middle',
            width: 16,
            msTransition: 'all 120ms ease-out',
            MozTransition: 'all 120ms ease-out',
            WebkitTransition: 'all 120ms ease-out',
            transition: 'all 120ms ease-out'
        };
    },
    handleKeyDown (e) {
        if (e.keyCode !== 32) return;
        this.toggleActive(true);
    },
    handleKeyUp () {
        this.toggleActive(false);
    },
    handleMouseOver () {
        this.toggleHover(true);
    },
    handleMouseDown () {
        this.toggleActive(true);
        this.toggleFocus(true);
    },
    handleMouseUp () {
        this.toggleActive(false);
    },
    handleMouseOut () {
        this.toggleHover(false);
    },
    toggleActive (pseudo) {
        this.setState({
            active: pseudo
        });
    },
    toggleHover (pseudo) {
        this.setState({
            hover: pseudo
        });
    },
    toggleFocus (pseudo) {
        this.setState({
            focus: pseudo
        });
    },
    handleChange () {
        this.props.onChange(!this.props.checked);
    },
    render () {
        const { checked, readonly } = this.props;
        const _this_props = this.props, { checked: _c, component: _co, onChange: _o, readonly: _r } = _this_props, props = _object_without_properties(_this_props, [
            "checked",
            "component",
            "onChange",
            "readonly"
        ]);
        props.style = this.getStyles();
        props.ref = 'checkbox';
        props.className = (0, _classnames.default)('octicon', {
            'octicon-check': checked,
            'octicon-x': typeof checked === 'boolean' && !checked && readonly
        });
        props.type = readonly ? null : 'button';
        props.onKeyDown = this.handleKeyDown;
        props.onKeyUp = this.handleKeyUp;
        props.onMouseDown = this.handleMouseDown;
        props.onMouseUp = this.handleMouseUp;
        props.onMouseOver = this.handleMouseOver;
        props.onMouseOut = this.handleMouseOut;
        props.onClick = readonly ? null : this.handleChange;
        props.onFocus = readonly ? null : ()=>this.toggleFocus(true);
        props.onBlur = readonly ? null : ()=>this.toggleFocus(false);
        const node = readonly ? 'span' : this.props.component;
        return /*#__PURE__*/ _react.default.createElement(node, props);
    }
});
const _default = Checkbox;

},{"../../admin/client-legacy/constants":79,"../../admin/client-legacy/utils/color":85,"classnames":undefined,"react":undefined}],91:[function(require,module,exports){
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
const _elemental = require("../../admin/client-legacy/App/elemental");
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
// NOTE marginBottom of 1px stops things jumping around
// TODO find out why this is necessary
/**
 * A link-style button used as a toggle label for collapsed field sections.
 *
 * Applies a 1 px bottom margin (prevents layout jump on expand/collapse) and
 * removes horizontal padding so the label aligns with the field content.
 * All extra props are forwarded to the underlying Elemental {@link Button}.
 * @param {object} props - Component props.
 * @param {object} [props.style] - Additional inline styles merged on top of the defaults.
 * @returns {React.Element} An Elemental Button rendered as a link variant.
 */ function CollapsedFieldLabel(_0) {
    let { style } = _0, props = _object_without_properties(_0, [
        "style"
    ]);
    const __style__ = _object_spread({
        marginBottom: 1,
        paddingLeft: 0,
        paddingRight: 0
    }, style);
    return /*#__PURE__*/ _react.default.createElement(_elemental.Button, _object_spread({
        variant: "link",
        style: __style__
    }, props));
}
const _default = CollapsedFieldLabel;

},{"../../admin/client-legacy/App/elemental":65,"react":undefined}],92:[function(require,module,exports){
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
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _reactdaypicker = /*#__PURE__*/ _interop_require_default(require("react-day-picker"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _Popout = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/App/shared/Popout"));
const _elemental = require("../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let lastId = 0;
const _default = _react.default.createClass({
    displayName: 'DateInput',
    propTypes: {
        format: _react.default.PropTypes.string,
        name: _react.default.PropTypes.string,
        onChange: _react.default.PropTypes.func.isRequired,
        path: _react.default.PropTypes.string,
        value: _react.default.PropTypes.string
    },
    getDefaultProps () {
        return {
            format: 'YYYY-MM-DD'
        };
    },
    getInitialState () {
        const id = ++lastId;
        let month = new Date();
        const { format, value } = this.props;
        if ((0, _moment.default)(value, format, true).isValid()) {
            month = (0, _moment.default)(value, format).toDate();
        }
        return {
            id: `_DateInput_${id}`,
            month: month,
            pickerIsOpen: false,
            inputValue: value
        };
    },
    componentDidMount () {
        this.showCurrentMonth();
    },
    componentWillReceiveProps: function(newProps) {
        if (newProps.value === this.props.value) return;
        this.setState({
            month: (0, _moment.default)(newProps.value, this.props.format).toDate(),
            inputValue: newProps.value
        }, this.showCurrentMonth);
    },
    focus () {
        if (!this.refs.input) return;
        (0, _reactdom.findDOMNode)(this.refs.input).focus();
    },
    handleInputChange (e) {
        const { value } = e.target;
        this.setState({
            inputValue: value
        }, this.showCurrentMonth);
    },
    handleKeyPress (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // If the date is strictly equal to the format string, dispatch onChange
            if ((0, _moment.default)(this.state.inputValue, this.props.format, true).isValid()) {
                this.props.onChange({
                    value: this.state.inputValue
                });
            // If the date is not strictly equal, only change the tab that is displayed
            } else if ((0, _moment.default)(this.state.inputValue, this.props.format).isValid()) {
                this.setState({
                    month: (0, _moment.default)(this.state.inputValue, this.props.format).toDate()
                }, this.showCurrentMonth);
            }
        }
    },
    handleDaySelect (e, date, modifiers) {
        if (modifiers && modifiers.disabled) return;
        const value = (0, _moment.default)(date).format(this.props.format);
        this.props.onChange({
            value
        });
        this.setState({
            pickerIsOpen: false,
            month: date,
            inputValue: value
        });
    },
    showPicker () {
        this.setState({
            pickerIsOpen: true
        }, this.showCurrentMonth);
    },
    showCurrentMonth () {
        if (!this.refs.picker) return;
        this.refs.picker.showMonth(this.state.month);
    },
    handleFocus (e) {
        if (this.state.pickerIsOpen) return;
        this.showPicker();
    },
    handleCancel () {
        this.setState({
            pickerIsOpen: false
        });
    },
    handleBlur (e) {
        let rt = e.relatedTarget || e.nativeEvent.explicitOriginalTarget;
        const popout = this.refs.popout.getPortalDOMNode();
        while(rt){
            if (rt === popout) return;
            rt = rt.parentNode;
        }
        this.setState({
            pickerIsOpen: false
        });
    },
    render () {
        const selectedDay = this.props.value;
        // react-day-picker adds a class to the selected day based on this
        const modifiers = {
            selected: (day)=>(0, _moment.default)(day).format(this.props.format) === selectedDay
        };
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            id: this.state.id,
            name: this.props.name,
            onBlur: this.handleBlur,
            onChange: this.handleInputChange,
            onFocus: this.handleFocus,
            onKeyPress: this.handleKeyPress,
            placeholder: this.props.format,
            ref: "input",
            value: this.state.inputValue
        }), /*#__PURE__*/ _react.default.createElement(_Popout.default, {
            isOpen: this.state.pickerIsOpen,
            onCancel: this.handleCancel,
            ref: "popout",
            relativeToID: this.state.id,
            width: 260
        }, /*#__PURE__*/ _react.default.createElement(_reactdaypicker.default, {
            modifiers: modifiers,
            onDayClick: this.handleDaySelect,
            ref: "picker",
            tabIndex: -1
        })));
    }
});

},{"../../admin/client-legacy/App/elemental":65,"../../admin/client-legacy/App/shared/Popout":77,"moment":undefined,"react":undefined,"react-day-picker":undefined,"react-dom":undefined}],93:[function(require,module,exports){
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
const _elemental = require("../../admin/client-legacy/App/elemental");
const _color = require("../../admin/client-legacy/utils/color");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/theme"));
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
 * Displays a read-only form input that communicates the result of a file change.
 *
 * When `color` is not `'default'`, the background, border, and text colour are
 * tinted using the corresponding theme colour at 10 %, 30 %, and 100 % opacity
 * respectively.  Extra props are forwarded to the Elemental {@link FormInput}.
 * @param {object} props - Component props.
 * @param {object} [props.style] - Additional inline styles merged with the defaults.
 * @param {'danger'|'default'|'success'} [props.color] - Colour variant controlling
 *   the tinted appearance of the message.  Defaults to `'default'`.
 * @returns {React.Element} A non-editable FormInput styled for the chosen colour.
 */ function FileChangeMessage(_0) {
    let { style, color } = _0, props = _object_without_properties(_0, [
        "style",
        "color"
    ]);
    const styles = _object_spread({
        marginRight: 10,
        minWidth: 0
    }, style);
    if (color !== 'default') {
        styles.backgroundColor = (0, _color.fade)(_theme.default.color[color], 10);
        styles.borderColor = (0, _color.fade)(_theme.default.color[color], 30);
        styles.color = _theme.default.color[color];
    }
    return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, _object_spread({
        noedit: true,
        style: styles
    }, props));
}
FileChangeMessage.propTypes = {
    color: _react.PropTypes.oneOf([
        'danger',
        'default',
        'success'
    ])
};
FileChangeMessage.defaultProps = {
    color: 'default'
};
const _default = FileChangeMessage;

},{"../../admin/client-legacy/App/elemental":65,"../../admin/client-legacy/theme":81,"../../admin/client-legacy/utils/color":85,"react":undefined}],94:[function(require,module,exports){
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
/*
	Expose internal ref to parent
	=============================

	Field.create({
		triggerFileBrowser () {
			this.refs.fileInput.clickDomNode();
		},
		render () {
			<HiddenFileInput ref="fileInput" />
		}
	});
*/ /**
 * An off-screen file input whose DOM node is exposed to parent components via
 * the imperative helper methods {@link HiddenFileInput#clickDomNode},
 * {@link HiddenFileInput#clearValue}, and {@link HiddenFileInput#hasValue}.
 *
 * The input is positioned at `left: -9999` so it is invisible but still
 * functional; `tabIndex="-1"` removes it from the tab order.
 * @example
 * // Inside a field component:
 * triggerFileBrowser () {
 *   this.refs.fileInput.clickDomNode();
 * }
 * render () {
 *   return <HiddenFileInput ref="fileInput" onChange={this.handleChange} />;
 * }
 */ class HiddenFileInput extends _react.Component {
    /**
	 * Resets the underlying file input value so the same file can be selected again.
	 * @returns {void}
	 */ clearValue() {
        this.target.value = '';
    }
    /**
	 * Programmatically clicks the hidden file input to open the file picker.
	 * @returns {void}
	 */ clickDomNode() {
        this.target.click();
    }
    /**
	 * Returns whether the file input currently holds a selected value.
	 * @returns {boolean} `true` if a file has been selected, `false` otherwise.
	 */ hasValue() {
        return !!this.target.value;
    }
    /**
	 * Renders the off-screen `<input type="file">` element.
	 * @returns {React.Element} A hidden file input positioned off-screen.
	 */ render() {
        const _this_props = this.props, { style } = _this_props, props = _object_without_properties(_this_props, [
            "style"
        ]);
        const setRef = (n)=>this.target = n;
        const styles = _object_spread({
            left: -9999,
            position: 'absolute'
        }, style);
        return /*#__PURE__*/ _react.default.createElement("input", _object_spread_props(_object_spread({}, props), {
            style: styles,
            ref: setRef,
            tabIndex: "-1",
            type: "file"
        }));
    }
    /**
	 * Creates a new HiddenFileInput instance and binds instance methods.
	 */ constructor(){
        super();
        this.clearValue = this.clearValue.bind(this);
        this.clickDomNode = this.clickDomNode.bind(this);
        this.hasValue = this.hasValue.bind(this);
    }
}
HiddenFileInput.propTypes = {
    onChange: _react.PropTypes.func.isRequired
};
const _default = HiddenFileInput;

},{"react":undefined}],95:[function(require,module,exports){
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
const _elemental = require("../../admin/client-legacy/App/elemental");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/theme"));
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
// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size
const ICON_MAP = {
    loading: '',
    remove: 'mega-octicon octicon-trashcan',
    upload: 'mega-octicon octicon-cloud-upload'
};
/**
 * Renders a styled thumbnail container with an optional interactive overlay mask.
 *
 * The container is rendered as the element type given by `component` (defaults
 * to `'span'`).  When `component` is `'a'`, hover and focus border/outline
 * styles are applied via Glamor.
 *
 * The `mask` prop overlays a semi-transparent dark panel on top of the image.
 * `'loading'` shows an inverted spinner; `'remove'` and `'upload'` show the
 * corresponding Octicon icon.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - The thumbnail image or content.
 * @param {string} [props.className] - Additional Glamor/CSS class names.
 * @param {string|object} [props.component] - Element type or React component used to render the
 *   wrapper.  Defaults to `'span'`; pass `'a'` to activate hover and focus styles.
 * @param {'loading'|'remove'|'upload'} [props.mask] - Overlay mask variant to display.
 * @returns {React.Element} The thumbnail wrapper element with optional mask overlay.
 */ function ImageThumbnail(_0) {
    let { children, className, component, mask } = _0, props = _object_without_properties(_0, [
        "children",
        "className",
        "component",
        "mask"
    ]);
    const maskUI = mask ? /*#__PURE__*/ _react.default.createElement("div", {
        className: (0, _glamor.css)(classes.mask) + ` ${ICON_MAP[mask]}`
    }, mask === 'loading' ? /*#__PURE__*/ _react.default.createElement(_elemental.Spinner, {
        color: "inverted"
    }) : null) : null;
    // apply hover and focus styles only when using an anchor
    props.className = (0, _glamor.css)(classes.base, component === 'a' ? classes.anchor : null, className);
    // append the mask UI to children
    props.children = [].concat(children, [
        maskUI
    ]);
    return /*#__PURE__*/ _react.default.createElement(component, props);
}
ImageThumbnail.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.string,
        _react.PropTypes.func
    ]),
    mask: _react.PropTypes.oneOf([
        'loading',
        'remove',
        'upload'
    ])
};
ImageThumbnail.defaultProps = {
    component: 'span'
};
/* eslint quote-props: ["error", "as-needed"] */ const GUTTER_WIDTH = 4;
const hoverAndFocusStyles = {
    borderColor: _theme.default.input.border.color.focus,
    outline: 'none'
};
const classes = {
    base: {
        backgroundColor: 'white',
        borderRadius: _theme.default.borderRadius.default,
        border: `1px solid ${_theme.default.input.border.color.default}`,
        display: 'inline-block',
        height: 'auto',
        lineHeight: '1',
        maxWidth: '100%',
        padding: GUTTER_WIDTH,
        position: 'relative'
    },
    anchor: {
        ':hover': hoverAndFocusStyles,
        ':focus': _object_spread_props(_object_spread({}, hoverAndFocusStyles), {
            boxShadow: _theme.default.input.boxShadowFocus
        })
    },
    // mask
    mask: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: GUTTER_WIDTH,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        left: GUTTER_WIDTH,
        lineHeight: 90,
        overflow: 'hidden',
        position: 'absolute',
        right: GUTTER_WIDTH,
        textAlign: 'center',
        top: GUTTER_WIDTH
    }
};
const _default = ImageThumbnail;

},{"../../admin/client-legacy/App/elemental":65,"../../admin/client-legacy/theme":81,"glamor":undefined,"react":undefined}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _glamor = require("glamor");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _elemental = require("../../admin/client-legacy/App/elemental");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/theme"));
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
// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size
const ICON_MAP = {
    loading: '',
    remove: 'mega-octicon octicon-trashcan',
    upload: 'mega-octicon octicon-cloud-upload'
};
/**
 * Renders a styled thumbnail container with an optional interactive overlay mask.
 *
 * The container is rendered as the element type given by `component` (defaults
 * to `'span'`).  When `component` is `'a'`, hover and focus border/outline
 * styles are applied via Glamor.
 *
 * The `mask` prop overlays a semi-transparent dark panel on top of the image.
 * `'loading'` shows an inverted spinner; `'remove'` and `'upload'` show the
 * corresponding Octicon icon.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - The thumbnail image or content.
 * @param {string} [props.className] - Additional Glamor/CSS class names.
 * @param {string|object} [props.component] - Element type or React component used to render the
 *   wrapper.  Defaults to `'span'`; pass `'a'` to activate hover and focus styles.
 * @param {'loading'|'remove'|'upload'} [props.mask] - Overlay mask variant to display.
 * @returns {React.Element} The thumbnail wrapper element with optional mask overlay.
 */ function ImageThumbnail(_0) {
    let { children, className, component, mask } = _0, props = _object_without_properties(_0, [
        "children",
        "className",
        "component",
        "mask"
    ]);
    const maskUI = mask ? /*#__PURE__*/ _react.default.createElement("div", {
        className: (0, _glamor.css)(classes.mask) + ` ${ICON_MAP[mask]}`
    }, mask === 'loading' ? /*#__PURE__*/ _react.default.createElement(_elemental.Spinner, {
        color: "inverted"
    }) : null) : null;
    // apply hover and focus styles only when using an anchor
    props.className = (0, _glamor.css)(classes.base, component === 'a' ? classes.anchor : null, className);
    // append the mask UI to children
    props.children = [].concat(children, [
        maskUI
    ]);
    return /*#__PURE__*/ _react.default.createElement(component, props);
}
ImageThumbnail.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.PropTypes.string,
        _react.PropTypes.func
    ]),
    mask: _react.PropTypes.oneOf([
        'loading',
        'remove',
        'upload'
    ])
};
ImageThumbnail.defaultProps = {
    component: 'span'
};
/* eslint quote-props: ["error", "as-needed"] */ const GUTTER_WIDTH = 4;
const hoverAndFocusStyles = {
    borderColor: _theme.default.input.border.color.focus,
    outline: 'none'
};
const classes = {
    base: {
        backgroundColor: 'white',
        borderRadius: _theme.default.borderRadius.default,
        border: `1px solid ${_theme.default.input.border.color.default}`,
        display: 'inline-block',
        height: 'auto',
        lineHeight: '1',
        maxWidth: '100%',
        padding: GUTTER_WIDTH,
        position: 'relative'
    },
    anchor: {
        ':hover': hoverAndFocusStyles,
        ':focus': _object_spread_props(_object_spread({}, hoverAndFocusStyles), {
            boxShadow: _theme.default.input.boxShadowFocus
        })
    },
    // mask
    mask: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: GUTTER_WIDTH,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        left: GUTTER_WIDTH,
        lineHeight: 90,
        overflow: 'hidden',
        position: 'absolute',
        right: GUTTER_WIDTH,
        textAlign: 'center',
        top: GUTTER_WIDTH
    }
};
const _default = ImageThumbnail;

},{"../../admin/client-legacy/App/elemental":65,"../../admin/client-legacy/theme":81,"glamor":undefined,"react":undefined}],97:[function(require,module,exports){
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
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
 * A `<td>` element styled as a column in the items list table.
 *
 * Merges the `'ItemList__col'` class with any caller-supplied `className` and
 * forwards all remaining props to the underlying `<td>`.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to append.
 * @returns {React.Element} A `<td>` with the `ItemList__col` class applied.
 */ function ItemsTableCell(_0) {
    let { className } = _0, props = _object_without_properties(_0, [
        "className"
    ]);
    props.className = (0, _classnames.default)('ItemList__col', className);
    return /*#__PURE__*/ _react.default.createElement("td", props);
}
const _default = ItemsTableCell;

},{"classnames":undefined,"react":undefined}],98:[function(require,module,exports){
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
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _reactrouter = require("react-router");
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
 */ function ItemsTableValue(_0) {
    let { className, component, empty, exterior, field, href, interior, padded, to, truncate } = _0, props = _object_without_properties(_0, [
        "className",
        "component",
        "empty",
        "exterior",
        "field",
        "href",
        "interior",
        "padded",
        "to",
        "truncate"
    ]);
    // TODO remove in the next release
    if (href) {
        console.warn('ItemsTableValue: `href` will be deprecated in the next release, use `to`.');
    }
    const linkRef = to || href;
    const Component = linkRef ? _reactrouter.Link : component;
    props.className = (0, _classnames.default)('ItemList__value', field ? `ItemList__value--${field}` : null, {
        'ItemList__link--empty': empty,
        'ItemList__link--exterior': linkRef && exterior,
        'ItemList__link--interior': linkRef && interior,
        'ItemList__link--padded': linkRef && padded,
        'ItemList__value--truncate': truncate
    }, className);
    props.to = linkRef;
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
ItemsTableValue.propTypes = {
    component: _react.PropTypes.oneOfType([
        _react.default.PropTypes.string,
        _react.default.PropTypes.func
    ]),
    empty: _react.PropTypes.bool,
    exterior: _react.PropTypes.bool,
    field: _react.PropTypes.string,
    href: _react.PropTypes.string,
    interior: _react.PropTypes.bool,
    padded: _react.PropTypes.bool,
    to: _react.PropTypes.string,
    truncate: _react.PropTypes.bool
};
ItemsTableValue.defaultProps = {
    component: 'div',
    truncate: true
};
const _default = ItemsTableValue;

},{"classnames":undefined,"react":undefined,"react-router":undefined}],99:[function(require,module,exports){
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
const _elemental = require("../../admin/client-legacy/App/elemental");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../admin/client-legacy/theme"));
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
 * A form field row with a small, muted label suitable for use inside nested
 * or composite field editors.
 *
 * Renders an Elemental {@link FormField} containing a {@link FormLabel} styled
 * at the theme's small font size and `gray40` colour.  On tablet-landscape
 * viewports and above a left indent of `1em` is added via a media-query style.
 * All extra props are forwarded to the underlying `FormField`.
 * @param {object} props - Component props.
 * @param {React.Node} props.children - The field input(s) rendered below the label.
 * @param {string} [props.className] - Additional CSS class names forwarded to the FormField.
 * @param {string} [props.label] - Text content of the field label.
 * @returns {React.Element} A FormField with a styled FormLabel and the provided children.
 */ function NestedFormField(_0) {
    let { children, className, label } = _0, props = _object_without_properties(_0, [
        "children",
        "className",
        "label"
    ]);
    return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, props, /*#__PURE__*/ _react.default.createElement(_elemental.FormLabel, {
        cssStyles: classes.label
    }, label), children);
}
const classes = {
    label: {
        color: _theme.default.color.gray40,
        fontSize: _theme.default.font.size.small,
        [`@media (min-width: ${_theme.default.breakpoint.tabletLandscapeMin})`]: {
            paddingLeft: '1em'
        }
    }
};
const _default = NestedFormField;

},{"../../admin/client-legacy/App/elemental":65,"../../admin/client-legacy/theme":81,"react":undefined}],100:[function(require,module,exports){
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ArrayColumn = _react.default.createClass({
    displayName: 'ArrayColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.length) return null;
        return value.join(', ');
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, this.renderValue()));
    }
});
const _default = ArrayColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],101:[function(require,module,exports){
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const IMAGE_SIZE = 18;
const linkStyle = {
    marginRight: 8
};
const boxStyle = {
    borderRadius: 3,
    display: 'inline-block',
    height: IMAGE_SIZE,
    overflow: 'hidden',
    verticalAlign: 'middle',
    width: IMAGE_SIZE
};
const imageStyle = {
    display: 'block',
    height: IMAGE_SIZE,
    left: '50%',
    position: 'relative',
    WebkitTransform: 'translateX(-50%)',
    MozTransform: 'translateX(-50%)',
    msTransform: 'translateX(-50%)',
    transform: 'translateX(-50%)'
};
const textStyle = {
    color: '#888',
    display: 'inline-block',
    fontSize: '.8rem',
    marginLeft: 8,
    verticalAlign: 'middle'
};
const CloudinaryImageSummary = _react.default.createClass({
    displayName: 'CloudinaryImageSummary',
    propTypes: {
        image: _react.default.PropTypes.object.isRequired,
        label: _react.default.PropTypes.oneOf([
            'dimensions',
            'publicId'
        ])
    },
    renderLabel () {
        if (!this.props.label) return;
        const { label, image } = this.props;
        let text;
        if (label === 'dimensions') {
            text = `${image.width} × ${image.height}`;
        } else {
            text = `${image.public_id}.${image.format}`;
        }
        return /*#__PURE__*/ _react.default.createElement("span", {
            style: textStyle
        }, text);
    },
    renderImageThumbnail () {
        if (!this.props.image) return;
        const startingUrl = this.props.secure ? this.props.image.secure_url : this.props.image.url;
        const url = startingUrl.replace(/image\/upload/, `image/upload/c_thumb,g_face,h_${IMAGE_SIZE},w_${IMAGE_SIZE}`);
        return /*#__PURE__*/ _react.default.createElement("img", {
            src: url,
            style: imageStyle,
            className: "img-load"
        });
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("span", {
            style: linkStyle
        }, /*#__PURE__*/ _react.default.createElement("span", {
            style: boxStyle
        }, this.renderImageThumbnail()), this.renderLabel());
    }
});
const _default = CloudinaryImageSummary;

},{"react":undefined}],102:[function(require,module,exports){
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const IdColumn = _react.default.createClass({
    displayName: 'IdColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object,
        list: _react.default.PropTypes.object
    },
    renderValue () {
        const value = this.props.data.id;
        if (!value) return null;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            padded: true,
            interior: true,
            title: value,
            to: Keystone.adminLegacyPath + '/' + this.props.list.path + '/' + value,
            field: this.props.col.type
        }, value);
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = IdColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],103:[function(require,module,exports){
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const InvalidColumn = _react.default.createClass({
    displayName: 'InvalidColumn',
    propTypes: {
        col: _react.default.PropTypes.object
    },
    renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, "(Invalid Type: ", this.props.col.type, ")");
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = InvalidColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],104:[function(require,module,exports){
/**
 * @file
 * This file defines the `ArrayField` mixin, which is used to create field
 * types that manage an array of values. It provides methods for adding,
 * removing, and updating items in the array, as well as for rendering the
 * field and its value.
 *
 * This mixin is used by the `DateArray`, `NumberArray`, and `TextArray`
 * field types.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `ArrayField` mixin.
 * @type {object}
 */ "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _elemental = require("elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let lastId = 0;
const ENTER_KEYCODE = 13;
/**
 * Creates a new item for the array.
 * @param {string|number} value The value of the new item.
 * @returns {object} The new item.
 */ function newItem(value) {
    lastId = lastId + 1;
    return {
        key: 'i' + lastId,
        value: value
    };
}
/**
 * Reduces an array of items to an array of their values.
 * @param {Array} values The array of items.
 * @returns {Array} The array of values.
 */ function reduceValues(values) {
    return values.map((i)=>i.value);
}
const _default = {
    /**
     * Gets the initial state of the component.
     * @returns {object} The initial state.
     */ getInitialState: function() {
        return {
            values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : []
        };
    },
    /**
     * Handles the component receiving new props.
     * @param {object} nextProps The new props.
     */ componentWillReceiveProps: function(nextProps) {
        if (nextProps.value.join('|') !== reduceValues(this.state.values).join('|')) {
            this.setState({
                values: nextProps.value.map(newItem)
            });
        }
    },
    /**
     * Adds a new item to the array.
     */ addItem: function() {
        const newValues = this.state.values.concat(newItem(''));
        this.setState({
            values: newValues
        }, ()=>{
            if (!this.state.values.length) return;
            (0, _reactdom.findDOMNode)(this.refs['item_' + this.state.values.length]).focus();
        });
        this.valueChanged(reduceValues(newValues));
    },
    /**
     * Removes an item from the array.
     * @param {object} i The item to remove.
     */ removeItem: function(i) {
        const newValues = this.state.values.filter((item)=>item !== i);
        this.setState({
            values: newValues
        }, function() {
            (0, _reactdom.findDOMNode)(this.refs.button).focus();
        });
        this.valueChanged(reduceValues(newValues));
    },
    /**
     * Updates an item in the array.
     * @param {object} i The item to update.
     * @param {object} event The event object.
     */ updateItem: function(i, event) {
        const updatedValues = this.state.values;
        const updateIndex = updatedValues.indexOf(i);
        const newValue = event.value || event.target.value;
        if (this.isValid === undefined || this.isValid(newValue)) {
            updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
        }
        this.setState({
            values: updatedValues
        });
        this.valueChanged(reduceValues(updatedValues));
    },
    /**
     * Handles a change in the field's value.
     * @param {Array} values The new array of values.
     */ valueChanged: function(values) {
        this.props.onChange({
            path: this.props.path,
            value: values
        });
    },
    /**
     * Renders the field.
     * @returns {React.Element} The rendered field.
     */ renderField: function() {
        return /*#__PURE__*/ _react.default.createElement("div", null, this.state.values.map(this.renderItem), /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            ref: "button",
            onClick: this.addItem
        }, "Add item"));
    },
    /**
     * Renders an item in the array.
     * @param {object} item The item to render.
     * @param {number} index The index of the item.
     * @returns {React.Element} The rendered item.
     */ renderItem: function(item, index) {
        const Input = this.getInputComponent ? this.getInputComponent() : _elemental.FormInput;
        const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            key: item.key
        }, /*#__PURE__*/ _react.default.createElement(Input, {
            ref: 'item_' + (index + 1),
            name: this.getInputName(this.props.path),
            value: value,
            onChange: this.updateItem.bind(this, item),
            onKeyDown: this.addItemOnEnter,
            autoComplete: "off"
        }), /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            type: "link-cancel",
            onClick: this.removeItem.bind(this, item),
            className: "keystone-relational-button"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "octicon octicon-x"
        })));
    },
    /**
     * Renders the value of the field.
     * @returns {React.Element} The rendered value.
     */ renderValue: function() {
        const Input = this.getInputComponent ? this.getInputComponent() : _elemental.FormInput;
        return /*#__PURE__*/ _react.default.createElement("div", null, this.state.values.map((item, i)=>{
            const value = this.formatValue ? this.formatValue(item.value) : item.value;
            return /*#__PURE__*/ _react.default.createElement("div", {
                key: i,
                style: i ? {
                    marginTop: '1em'
                } : null
            }, /*#__PURE__*/ _react.default.createElement(Input, {
                noedit: true,
                value: value
            }));
        }));
    },
    /**
     * Determines whether the field should be collapsed.
     * @returns {boolean} Whether the field should be collapsed.
     */ shouldCollapse: function() {
        return this.props.collapse && !this.props.value.length;
    },
    /**
     * Adds an item to the array when the enter key is pressed.
     * @param {object} event The event object.
     */ addItemOnEnter: function(event) {
        if (event.keyCode === ENTER_KEYCODE) {
            this.addItem();
            event.preventDefault();
        }
    }
};

},{"elemental":undefined,"react":undefined,"react-dom":undefined}],105:[function(require,module,exports){
/**
 * @file
 * This file defines the `Field` component, which is the base class for all
 * field components in the KeystoneJS Admin UI.
 *
 * It provides the basic functionality for a field, such as rendering the
 * label, note, and value of the field.
 *
 * It is not meant to be used directly, but should be extended by other field
 * components.
 */ "use strict";
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
    get Base () {
        return Base;
    },
    get Mixins () {
        return Mixins;
    },
    get create () {
        return create;
    },
    get default () {
        return _default;
    }
});
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _evalDependsOn = /*#__PURE__*/ _interop_require_default(require("../utils/evalDependsOn.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _elemental = require("../../admin/client-legacy/App/elemental");
const _CollapsedFieldLabel = /*#__PURE__*/ _interop_require_default(require("../components/CollapsedFieldLabel.mjs"));
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
 * Checks whether a value is an object.
 * @param {unknown} arg The value to check.
 * @returns {boolean} Whether the value is an object.
 */ function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
}
/**
 * Validates a spec object.
 * @param {object} spec The spec to validate.
 * @returns {object} The validated spec.
 */ function validateSpec(spec) {
    if (!spec) spec = {};
    if (!isObject(spec.supports)) {
        spec.supports = {};
    }
    if (!spec.focusTargetRef) {
        spec.focusTargetRef = 'focusTarget';
    }
    return spec;
}
const Base = {
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {};
    },
    /**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */ getDefaultProps () {
        return {
            adminLegacyPath: Keystone.adminLegacyPath,
            inputProps: {},
            labelProps: {},
            valueProps: {},
            size: 'full'
        };
    },
    /**
	 * Gets the name of the input.
	 * @param {string} path The path of the input.
	 * @returns {string} The name of the input.
	 */ getInputName (path) {
        // This correctly creates the path for field inputs, and supports the
        // inputNamePrefix prop that is required for nested fields to work
        return this.props.inputNamePrefix ? `${this.props.inputNamePrefix}[${path}]` : path;
    },
    /**
	 * Handles a change in the value of the input.
	 * @param {object} event The event object.
	 */ valueChanged (event) {
        this.props.onChange({
            path: this.props.path,
            value: event.target.value
        });
    },
    /**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */ shouldCollapse () {
        return this.props.collapse && !this.props.value;
    },
    /**
	 * Determines whether the field should be rendered.
	 * @returns {boolean} Whether the field should be rendered.
	 */ shouldRenderField () {
        if (this.props.mode === 'create') return true;
        return !this.props.noedit;
    },
    /**
	 * Focuses the field.
	 */ focus () {
        if (!this.refs[this.spec.focusTargetRef]) return;
        (0, _reactdom.findDOMNode)(this.refs[this.spec.focusTargetRef]).focus();
    },
    /**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */ renderNote () {
        if (!this.props.note) return null;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            html: this.props.note
        });
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { autoFocus, value, inputProps } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, _object_spread_props(_object_spread({}, inputProps), {
            autoFocus,
            autoComplete: 'off',
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: 'focusTarget',
            value
        }));
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, this.props.value);
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        const wrapperClassName = (0, _classnames.default)('field-type-' + this.props.type, this.props.className, {
            'field-monospace': this.props.monospace
        });
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            htmlFor: this.props.path,
            label: this.props.label,
            className: wrapperClassName,
            cropLabel: true
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: 'FormField__inner field-size-' + this.props.size
        }, this.shouldRenderField() ? this.renderField() : this.renderValue()), this.renderNote());
    }
};
const Mixins = {
    Collapse: {
        /**
		 * Sets the initial collapsed state of the field.
		 */ componentWillMount () {
            this.setState({
                isCollapsed: this.shouldCollapse()
            });
        },
        /**
		 * Focuses the field when it is uncollapsed.
		 * @param {object} prevProps The previous props.
		 * @param {object} prevState The previous state.
		 */ componentDidUpdate (prevProps, prevState) {
            if (prevState.isCollapsed && !this.state.isCollapsed) {
                this.focus();
            }
        },
        /**
		 * Uncollapses the field.
		 */ uncollapse () {
            this.setState({
                isCollapsed: false
            });
        },
        /**
		 * Renders the collapse button.
		 * @returns {React.Element} The rendered collapse button.
		 */ renderCollapse () {
            if (!this.shouldRenderField()) return null;
            return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_CollapsedFieldLabel.default, {
                onClick: this.uncollapse
            }, "+ Add ", this.props.label.toLowerCase()));
        }
    }
};
function create(spec) {
    spec = validateSpec(spec);
    const field = {
        spec: spec,
        displayName: spec.displayName,
        mixins: [
            Mixins.Collapse
        ],
        statics: {
            getDefaultValue: function(field) {
                return typeof field.defaultValue !== 'undefined' ? field.defaultValue : '';
            }
        },
        /**
		 * Renders the component.
		 * @returns {React.Element} The rendered component.
		 */ render () {
            if (!(0, _evalDependsOn.default)(this.props.dependsOn, this.props.values)) {
                return null;
            }
            if (this.state.isCollapsed) {
                return this.renderCollapse();
            }
            return this.renderUI();
        }
    };
    if (spec.statics) {
        Object.assign(field.statics, spec.statics);
    }
    const excludeBaseMethods = {};
    if (spec.mixins) {
        spec.mixins.forEach(function(mixin) {
            Object.keys(mixin).forEach(function(name) {
                if (Base[name]) {
                    excludeBaseMethods[name] = true;
                }
            });
        });
    }
    Object.assign(field, Object.fromEntries(Object.entries(Base).filter(([k])=>!excludeBaseMethods[k])));
    const { mixins: _m, statics: _s } = spec, specRest = _object_without_properties(spec, [
        "mixins",
        "statics"
    ]);
    Object.assign(field, specRest);
    if (Array.isArray(spec.mixins)) {
        field.mixins = field.mixins.concat(spec.mixins);
    }
    return _react.default.createClass(field);
}
const _default = {
    Base,
    Mixins,
    create
};

},{"../../admin/client-legacy/App/elemental":65,"../components/CollapsedFieldLabel.mjs":91,"../utils/evalDependsOn.mjs":198,"classnames":undefined,"react":undefined,"react-dom":undefined}],106:[function(require,module,exports){
/**
 * @file
 * This file defines the `BooleanColumn` component, which is used to render the
 * value of a `Boolean` field in a list view.
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
const _Checkbox = /*#__PURE__*/ _interop_require_default(require("../../components/Checkbox.mjs"));
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `BooleanColumn` component.
 * @augments React.Component
 */ const BooleanColumn = _react.default.createClass({
    displayName: 'BooleanColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            truncate: false,
            field: this.props.col.type
        }, /*#__PURE__*/ _react.default.createElement(_Checkbox.default, {
            readonly: true,
            checked: this.props.data.fields[this.props.col.path]
        }));
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = BooleanColumn;

},{"../../components/Checkbox.mjs":90,"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],107:[function(require,module,exports){
/**
 * @file
 * This file defines the `BooleanField` component, which is used to render a
 * boolean field in the KeystoneJS Admin UI.
 *
 * It provides a checkbox to toggle the value of the field.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `BooleanField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _Checkbox = /*#__PURE__*/ _interop_require_default(require("../../components/Checkbox.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const NOOP = ()=>{};
const _default = _Field.default.create({
    displayName: 'BooleanField',
    statics: {
        type: 'Boolean'
    },
    propTypes: {
        indent: _react.default.PropTypes.bool,
        label: _react.default.PropTypes.string,
        onChange: _react.default.PropTypes.func.isRequired,
        path: _react.default.PropTypes.string.isRequired,
        value: _react.default.PropTypes.bool
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {boolean} value The new value.
	 */ valueChanged (value) {
        this.props.onChange({
            path: this.props.path,
            value: value
        });
    },
    /**
	 * Renders a hidden form input that carries the boolean value on submit.
	 * Returns nothing when the field should not be rendered.
	 * @returns {React.Element|undefined} The hidden input element, or undefined if the field should not render.
	 */ renderFormInput () {
        if (!this.shouldRenderField()) return;
        return /*#__PURE__*/ _react.default.createElement("input", {
            name: this.getInputName(this.props.path),
            type: "hidden",
            value: !!this.props.value
        });
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        const { indent, value, label, path } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", {
            "data-field-name": path,
            "data-field-type": "boolean"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            offsetAbsentLabel: indent
        }, /*#__PURE__*/ _react.default.createElement("label", {
            style: {
                height: '2.3em'
            }
        }, this.renderFormInput(), /*#__PURE__*/ _react.default.createElement(_Checkbox.default, {
            checked: value,
            onChange: this.shouldRenderField() && this.valueChanged || NOOP,
            readonly: !this.shouldRenderField()
        }), /*#__PURE__*/ _react.default.createElement("span", {
            style: {
                marginLeft: '.75em'
            }
        }, label)), this.renderNote()));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../components/Checkbox.mjs":90,"../Field.mjs":105,"react":undefined}],108:[function(require,module,exports){
/**
 * @file
 * This file defines the `BooleanFilter` component, which is used to filter
 * `Boolean` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the value is checked or
 * not.
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
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const VALUE_OPTIONS = [
    {
        label: 'Is Checked',
        value: true
    },
    {
        label: 'Is NOT Checked',
        value: false
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        value: true
    };
}
/**
 * The `BooleanFilter` component.
 * @augments React.Component
 */ const BooleanFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            value: _react.default.PropTypes.bool
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */ updateValue (value) {
        this.props.onChange({
            value
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            options: VALUE_OPTIONS,
            value: this.props.filter.value,
            onChange: this.updateValue
        });
    },
    displayName: "BooleanFilter"
});
const _default = BooleanFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return CloudinaryColumn;
    }
});
const _CloudinaryImageColumn = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageColumn.mjs"));
const _CloudinaryImagesColumn = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimages/CloudinaryImagesColumn.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function CloudinaryColumn(props) {
    var _props_col, _props_data_fields, _props_data;
    const value = (_props_data = props.data) === null || _props_data === void 0 ? void 0 : (_props_data_fields = _props_data.fields) === null || _props_data_fields === void 0 ? void 0 : _props_data_fields[(_props_col = props.col) === null || _props_col === void 0 ? void 0 : _props_col.path];
    const Component = Array.isArray(value) ? _CloudinaryImagesColumn.default : _CloudinaryImageColumn.default;
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}

},{"../cloudinaryimage/CloudinaryImageColumn.mjs":112,"../cloudinaryimages/CloudinaryImagesColumn.mjs":115,"react":undefined}],110:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return CloudinaryField;
    }
});
const _CloudinaryImageField = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageField.mjs"));
const _CloudinaryImagesField = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimages/CloudinaryImagesField.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function CloudinaryField(props) {
    const Component = Array.isArray(props.value) ? _CloudinaryImagesField.default : _CloudinaryImageField.default;
    return /*#__PURE__*/ _react.default.createElement(Component, props);
}
CloudinaryField.displayName = 'CloudinaryField';
CloudinaryField.type = 'Cloudinary';
CloudinaryField.getDefaultValue = (field)=>field && field.multiple ? [] : {};

},{"../cloudinaryimage/CloudinaryImageField.mjs":113,"../cloudinaryimages/CloudinaryImagesField.mjs":116,"react":undefined}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _CloudinaryImageFilter.default;
    }
});
const _CloudinaryImageFilter = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../cloudinaryimage/CloudinaryImageFilter.mjs":114}],112:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImageColumn` component, which is used to
 * render the value of a `CloudinaryImage` field in a list view.
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
const _CloudinaryImageSummary = /*#__PURE__*/ _interop_require_default(require("../../components/columns/CloudinaryImageSummary.mjs"));
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `CloudinaryImageColumn` component.
 * @augments React.Component
 */ const CloudinaryImageColumn = _react.default.createClass({
    displayName: 'CloudinaryImageColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or undefined if no image data is present.
	 */ renderValue: function() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !Object.keys(value).length) return;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, /*#__PURE__*/ _react.default.createElement(_CloudinaryImageSummary.default, {
            label: "dimensions",
            image: value,
            secure: this.props.col.field.secure
        }));
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = CloudinaryImageColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"../../components/columns/CloudinaryImageSummary.mjs":101,"react":undefined}],113:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImageField` component, which is used to
 * render a cloudinary image field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload an image, and it displays a thumbnail of the
 * uploaded image. It also provides a button to remove the image.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `CloudinaryImageField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _cloudinaryResize = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/utils/cloudinaryResize"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _ImageThumbnail = /*#__PURE__*/ _interop_require_default(require("../../components/ImageThumbnail.mjs"));
const _FileChangeMessage = /*#__PURE__*/ _interop_require_default(require("../../components/FileChangeMessage.mjs"));
const _HiddenFileInput = /*#__PURE__*/ _interop_require_default(require("../../components/HiddenFileInput.mjs"));
const _reactimages = /*#__PURE__*/ _interop_require_default(require("react-images"));
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
const SUPPORTED_TYPES = [
    'image/*',
    'application/pdf',
    'application/postscript'
];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);
let uploadInc = 1000;
/**
 * Returns the initial state of the component.
 * @param {object} props The component's props.
 * @returns {object} The initial state.
 */ const buildInitialState = (props)=>({
        removeExisting: false,
        uploadFieldPath: `CloudinaryImage-${props.path}-${++uploadInc}`,
        userSelectedFile: null
    });
const _default = _Field.default.create({
    propTypes: {
        collapse: _react.PropTypes.bool,
        label: _react.PropTypes.string,
        note: _react.PropTypes.string,
        path: _react.PropTypes.string.isRequired,
        value: _react.PropTypes.shape({
            format: _react.PropTypes.string,
            height: _react.PropTypes.number,
            public_id: _react.PropTypes.string,
            resource_type: _react.PropTypes.string,
            secure_url: _react.PropTypes.string,
            signature: _react.PropTypes.string,
            url: _react.PropTypes.string,
            version: _react.PropTypes.number,
            width: _react.PropTypes.number
        })
    },
    displayName: 'CloudinaryImageField',
    statics: {
        type: 'CloudinaryImage',
        getDefaultValue: ()=>({})
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return buildInitialState(this.props);
    },
    componentWillReceiveProps (nextProps) {
    // console.log('CloudinaryImageField nextProps:', nextProps);
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillUpdate (nextProps) {
        // Reset the action state when the value changes
        // TODO: We should add a check for a new item ID in the store
        if (this.props.value.public_id !== nextProps.value.public_id) {
            this.setState({
                removeExisting: false,
                userSelectedFile: null
            });
        }
    },
    // ==============================
    // HELPERS
    // ==============================
    /**
	 * Returns whether the field has a local file.
	 * @returns {boolean} Whether the field has a local file.
	 */ hasLocal () {
        return !!this.state.userSelectedFile;
    },
    /**
	 * Returns whether the field has an existing file.
	 * @returns {boolean} Whether the field has an existing file.
	 */ hasExisting () {
        return !!(this.props.value && this.props.value.url);
    },
    /**
	 * Returns whether the field has an image.
	 * @returns {boolean} Whether the field has an image.
	 */ hasImage () {
        return this.hasExisting() || this.hasLocal();
    },
    /**
	 * Returns the name of the file.
	 * @returns {string} The name of the file.
	 */ getFilename () {
        const { format, height, public_id, width } = this.props.value;
        return this.state.userSelectedFile ? this.state.userSelectedFile.name : `${public_id}.${format} (${width}×${height})`;
    },
    /**
	 * Returns the URL of the image.
	 * @param {number} height The height of the image.
	 * @returns {string} The URL of the image.
	 */ getImageSource (height = 90) {
        // TODO: This lets really wide images break the layout
        let src;
        if (this.hasLocal()) {
            src = this.state.dataUri;
        } else if (this.hasExisting()) {
            src = (0, _cloudinaryResize.default)(this.props.value.public_id, {
                crop: 'fit',
                height: height,
                format: 'jpg',
                secure: this.props.secure
            });
        }
        return src;
    },
    // ==============================
    // METHODS
    // ==============================
    /**
	 * Triggers the file browser.
	 */ triggerFileBrowser () {
        this.refs.fileInput.clickDomNode();
    },
    /**
	 * Handles a change in the file input.
	 * @param {object} event The event object.
	 */ handleFileChange (event) {
        const userSelectedFile = event.target.files[0];
        this.setState({
            userSelectedFile
        });
    },
    // Toggle the lightbox
    /**
	 * Opens the lightbox.
	 * @param {object} event The event object.
	 */ openLightbox (event) {
        event.preventDefault();
        this.setState({
            lightboxIsVisible: true
        });
    },
    /**
	 * Closes the lightbox.
	 */ closeLightbox () {
        this.setState({
            lightboxIsVisible: false
        });
    },
    // Handle image selection in file browser
    /**
	 * Handles a change in the image input.
	 * @param {object} e The event object.
	 * @returns {void}
	 */ handleImageChange (e) {
        if (!window.FileReader) {
            return alert('File reader not supported by browser.');
        }
        const reader = new FileReader();
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match(SUPPORTED_REGEX)) {
            return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
        }
        reader.readAsDataURL(file);
        reader.onloadstart = ()=>{
            this.setState({
                loading: true
            });
        };
        reader.onloadend = (upload)=>{
            this.setState({
                dataUri: upload.target.result,
                loading: false,
                userSelectedFile: file
            });
            this.props.onChange({
                file: file
            });
        };
    },
    // If we have a local file added then remove it and reset the file field.
    /**
	 * Handles the removal of an image.
	 * @param {object} e The event object.
	 */ handleRemove (e) {
        const state = {};
        if (this.state.userSelectedFile) {
            state.userSelectedFile = null;
        } else if (this.hasExisting()) {
            state.removeExisting = true;
        }
        this.setState(state);
    },
    /**
	 * Undoes the removal of an image.
	 */ undoRemove () {
        this.setState(buildInitialState(this.props));
    },
    // ==============================
    // RENDERERS
    // ==============================
    /**
	 * Renders the lightbox, or nothing if there is no image.
	 * @returns {React.Element|undefined} The rendered lightbox, or undefined if no image is present.
	 */ renderLightbox () {
        const { value } = this.props;
        if (!value || !value.public_id) return;
        return /*#__PURE__*/ _react.default.createElement(_reactimages.default, {
            currentImage: 0,
            images: [
                {
                    src: this.getImageSource(600)
                }
            ],
            isOpen: this.state.lightboxIsVisible,
            onClose: this.closeLightbox,
            showImageCount: false
        });
    },
    /**
	 * Renders the image preview.
	 * @returns {React.Element} The rendered image preview.
	 */ renderImagePreview () {
        const { value } = this.props;
        // render icon feedback for intent
        let mask;
        if (this.hasLocal()) mask = 'upload';
        else if (this.state.removeExisting) mask = 'remove';
        else if (this.state.loading) mask = 'loading';
        const shouldOpenLightbox = value.format !== 'pdf';
        return /*#__PURE__*/ _react.default.createElement(_ImageThumbnail.default, {
            component: "a",
            href: this.getImageSource(600),
            onClick: shouldOpenLightbox && this.openLightbox,
            mask: mask,
            target: "__blank",
            style: {
                float: 'left',
                marginRight: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement("img", {
            src: this.getImageSource(),
            style: {
                height: 90
            }
        }));
    },
    /**
	 * Renders the file name and optional message.
	 * @param {boolean} showChangeMessage Whether to show the change message.
	 * @returns {React.Element} The rendered file name and message.
	 */ renderFileNameAndOptionalMessage (showChangeMessage = false) {
        return /*#__PURE__*/ _react.default.createElement("div", null, this.hasImage() ? /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, null, this.getFilename()) : null, showChangeMessage && this.renderChangeMessage());
    },
    /**
	 * Renders the change message.
	 * @returns {React.Element} The rendered change message.
	 */ renderChangeMessage () {
        if (this.state.userSelectedFile) {
            return /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
                color: "success"
            }, "Save to Upload");
        } else if (this.state.removeExisting) {
            return /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
                color: "danger"
            }, "Save to Remove");
        } else {
            return null;
        }
    },
    // Output [cancel/remove/undo] button
    /**
	 * Renders the clear button.
	 * @returns {React.Element} The rendered clear button.
	 */ renderClearButton () {
        const clearText = this.hasLocal() ? 'Cancel' : 'Remove Image';
        return this.state.removeExisting ? /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            variant: "link",
            onClick: this.undoRemove
        }, "Undo Remove") : /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            variant: "link",
            color: "cancel",
            onClick: this.handleRemove
        }, clearText);
    },
    /**
	 * Renders the image toolbar.
	 * @returns {React.Element} The rendered image toolbar.
	 */ renderImageToolbar () {
        return /*#__PURE__*/ _react.default.createElement("div", {
            key: this.props.path + '_toolbar',
            className: "image-toolbar"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.triggerFileBrowser
        }, this.hasImage() ? 'Change' : 'Upload', " Image"), this.hasImage() ? this.renderClearButton() : null);
    },
    /**
	 * Renders the file input.
	 * @returns {React.Element} The rendered file input.
	 */ renderFileInput () {
        if (!this.shouldRenderField()) return null;
        return /*#__PURE__*/ _react.default.createElement(_HiddenFileInput.default, {
            accept: SUPPORTED_TYPES.join(),
            ref: "fileInput",
            name: this.state.uploadFieldPath,
            onChange: this.handleImageChange
        });
    },
    // This renders a hidden input that holds the payload data for how the field
    // should be updated. It should be upload:{filename}, undefined, or 'remove'
    /**
	 * Renders the action input.
	 * @returns {React.Element} The rendered action input.
	 */ renderActionInput () {
        if (!this.shouldRenderField()) return null;
        if (this.state.userSelectedFile || this.state.removeExisting) {
            let value = '';
            if (this.state.userSelectedFile) {
                value = `upload:${this.state.uploadFieldPath}`;
            } else if (this.state.removeExisting && this.props.autoCleanup) {
                value = 'delete';
            }
            return /*#__PURE__*/ _react.default.createElement("input", {
                name: this.getInputName(this.props.path),
                type: "hidden",
                value: value
            });
        } else {
            return null;
        }
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        const { label, note, path } = this.props;
        const imageContainer = /*#__PURE__*/ _react.default.createElement("div", {
            style: this.hasImage() ? {
                marginBottom: '1em'
            } : null
        }, this.hasImage() && this.renderImagePreview(), this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField()));
        const toolbar = this.shouldRenderField() ? this.renderImageToolbar() : /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        });
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: label,
            className: "field-type-cloudinaryimage",
            htmlFor: path
        }, imageContainer, toolbar, !!note && /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            note: note
        }), this.renderLightbox(), this.renderFileInput(), this.renderActionInput());
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/utils/cloudinaryResize":83,"../../components/FileChangeMessage.mjs":93,"../../components/HiddenFileInput.mjs":94,"../../components/ImageThumbnail.mjs":95,"../Field.mjs":105,"react":undefined,"react-images":undefined}],114:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImageFilter` component, which is used to
 * filter `CloudinaryImage` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether an image is set or not.
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
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const OPTIONS = [
    {
        label: 'Is Set',
        value: true
    },
    {
        label: 'Is NOT Set',
        value: false
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        exists: true
    };
}
/**
 * The `CloudinaryImageFilter` component.
 * @augments React.Component
 */ const CloudinaryImageFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            exists: _react.default.PropTypes.oneOf(OPTIONS.map((i)=>i.value))
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */ toggleExists (value) {
        this.props.onChange({
            exists: value
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleExists,
            options: OPTIONS,
            value: filter.exists
        });
    },
    displayName: "CloudinaryImageFilter"
});
const _default = CloudinaryImageFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined}],115:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImagesColumn` component, which is used to
 * render the value of a `CloudinaryImages` field in a list view.
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
const _CloudinaryImageSummary = /*#__PURE__*/ _interop_require_default(require("../../components/columns/CloudinaryImageSummary.mjs"));
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const moreIndicatorStyle = {
    color: '#888',
    fontSize: '.8rem'
};
/**
 * The `CloudinaryImagesColumn` component.
 * @augments React.Component
 */ const CloudinaryImagesColumn = _react.default.createClass({
    displayName: 'CloudinaryImagesColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the values of a many-to-many relationship.
	 * @param {Array} value The array of related items.
	 * @returns {Array|undefined} An array of thumbnail elements, or undefined if the value is empty.
	 */ renderMany (value) {
        if (!value || !value.length) return;
        const items = [];
        for(let i = 0; i < 3; i++){
            if (!value[i]) break;
            items.push(/*#__PURE__*/ _react.default.createElement(_CloudinaryImageSummary.default, {
                key: 'image' + i,
                image: value[i],
                secure: this.props.col.field.secure
            }));
        }
        if (value.length > 3) {
            items.push(/*#__PURE__*/ _react.default.createElement("span", {
                key: "more",
                style: moreIndicatorStyle
            }, "[...", value.length - 3, " more]"));
        }
        return items;
    },
    /**
	 * Renders the value of a one-to-many relationship.
	 * @param {object} value The related item.
	 * @returns {React.Element|undefined} The rendered value, or undefined if the value is empty.
	 */ renderValue (value) {
        if (!value || !Object.keys(value).length) return;
        return /*#__PURE__*/ _react.default.createElement(_CloudinaryImageSummary.default, {
            image: value,
            secure: this.props.col.field.secure
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const value = this.props.data.fields[this.props.col.path];
        const many = value.length > 1;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, many ? this.renderMany(value) : this.renderValue(value[0])));
    }
});
const _default = CloudinaryImagesColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"../../components/columns/CloudinaryImageSummary.mjs":101,"react":undefined}],116:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImagesField` component, which is used to
 * render a cloudinary images field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload images, and it displays thumbnails of the
 * uploaded images. It also provides a button to remove images.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `CloudinaryImagesField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _reactimages = /*#__PURE__*/ _interop_require_default(require("react-images"));
const _cloudinaryResize = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/utils/cloudinaryResize"));
const _CloudinaryImagesThumbnail = /*#__PURE__*/ _interop_require_default(require("./CloudinaryImagesThumbnail.mjs"));
const _HiddenFileInput = /*#__PURE__*/ _interop_require_default(require("../../components/HiddenFileInput.mjs"));
const _FileChangeMessage = /*#__PURE__*/ _interop_require_default(require("../../components/FileChangeMessage.mjs"));
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
const SUPPORTED_TYPES = [
    'image/*',
    'application/pdf',
    'application/postscript'
];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);
const RESIZE_DEFAULTS = {
    crop: 'fit',
    format: 'jpg'
};
let uploadInc = 1000;
const _default = _Field.default.create({
    displayName: 'CloudinaryImagesField',
    statics: {
        type: 'CloudinaryImages',
        getDefaultValue: ()=>[]
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return this.buildInitialState(this.props);
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillUpdate (nextProps) {
        // Reset the thumbnails and upload ID when the item value changes
        // TODO: We should add a check for a new item ID in the store
        const value = _lodash.default.map(this.props.value, 'public_id').join();
        const nextValue = _lodash.default.map(nextProps.value, 'public_id').join();
        if (value !== nextValue) {
            this.setState(this.buildInitialState(nextProps));
        }
    },
    /**
	 * Builds the initial state of the component.
	 * @param {object} props The component's props.
	 * @returns {object} The initial state.
	 */ buildInitialState (props) {
        const uploadFieldPath = `CloudinaryImages-${props.path}-${++uploadInc}`;
        const thumbnails = props.value ? props.value.map((img, index)=>{
            return this.getThumbnail({
                value: img,
                imageSourceSmall: (0, _cloudinaryResize.default)(img.public_id, _object_spread_props(_object_spread({}, RESIZE_DEFAULTS), {
                    height: 90,
                    secure: props.secure
                })),
                imageSourceLarge: (0, _cloudinaryResize.default)(img.public_id, _object_spread_props(_object_spread({}, RESIZE_DEFAULTS), {
                    height: 600,
                    width: 900,
                    secure: props.secure
                }))
            }, index);
        }) : [];
        return {
            thumbnails,
            uploadFieldPath
        };
    },
    /**
	 * Gets a thumbnail component for an image.
	 * @param {object} props The props for the thumbnail.
	 * @param {number} index The index of the thumbnail.
	 * @returns {React.Element} The thumbnail component.
	 */ getThumbnail (props, index) {
        return /*#__PURE__*/ _react.default.createElement(_CloudinaryImagesThumbnail.default, _object_spread({
            key: `thumbnail-${index}`,
            inputName: this.getInputName(this.props.path),
            openLightbox: (e)=>this.openLightbox(e, index),
            shouldRenderActionButton: this.shouldRenderField(),
            toggleDelete: this.removeImage.bind(this, index)
        }, props));
    },
    // ==============================
    // HELPERS
    // ==============================
    /**
	 * Triggers the file browser.
	 */ triggerFileBrowser () {
        this.refs.fileInput.clickDomNode();
    },
    /**
	 * Returns whether the field has files.
	 * @returns {boolean} Whether the field has files.
	 */ hasFiles () {
        return this.refs.fileInput && this.refs.fileInput.hasValue();
    },
    /**
	 * Opens the lightbox.
	 * @param {object} event The event object.
	 * @param {number} index The index of the image to open.
	 */ openLightbox (event, index) {
        event.preventDefault();
        this.setState({
            lightboxIsVisible: true,
            lightboxImageIndex: index
        });
    },
    /**
	 * Closes the lightbox.
	 */ closeLightbox () {
        this.setState({
            lightboxIsVisible: false,
            lightboxImageIndex: null
        });
    },
    /**
	 * Goes to the previous image in the lightbox.
	 */ lightboxPrevious () {
        this.setState({
            lightboxImageIndex: this.state.lightboxImageIndex - 1
        });
    },
    /**
	 * Goes to the next image in the lightbox.
	 */ lightboxNext () {
        this.setState({
            lightboxImageIndex: this.state.lightboxImageIndex + 1
        });
    },
    // ==============================
    // METHODS
    // ==============================
    /**
	 * Removes an image from the field.
	 * @param {number} index The index of the image to remove.
	 */ removeImage (index) {
        const newThumbnails = [
            ...this.state.thumbnails
        ];
        const target = newThumbnails[index];
        // Use splice + clone to toggle the isDeleted prop
        newThumbnails.splice(index, 1, /*#__PURE__*/ (0, _react.cloneElement)(target, {
            isDeleted: !target.props.isDeleted
        }));
        this.setState({
            thumbnails: newThumbnails
        });
    },
    /**
	 * Gets the count of thumbnails with a given key.
	 * @param {string} key The key to count.
	 * @returns {number} The count.
	 */ getCount (key) {
        let count = 0;
        this.state.thumbnails.forEach((thumb)=>{
            if (thumb && thumb.props[key]) count++;
        });
        return count;
    },
    /**
	 * Clears the file input.
	 */ clearFiles () {
        this.refs.fileInput.clearValue();
        this.setState({
            thumbnails: this.state.thumbnails.filter(function(thumb) {
                return !thumb.props.isQueued;
            })
        });
    },
    /**
	 * Handles a change in the file input.
	 * @param {object} event The event object.
	 * @returns {void}
	 */ uploadFile (event) {
        if (!window.FileReader) {
            return alert('File reader not supported by browser.');
        }
        // FileList not a real Array; process it into one and check the types
        const files = [];
        for(let i = 0; i < event.target.files.length; i++){
            const f = event.target.files[i];
            if (!f.type.match(SUPPORTED_REGEX)) {
                return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
            }
            files.push(f);
        }
        let index = this.state.thumbnails.length;
        files.reduce((chain, file)=>chain.then((thumbnails)=>new Promise((resolve)=>{
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e)=>{
                        resolve([
                            ...thumbnails,
                            this.getThumbnail({
                                isQueued: true,
                                imageSourceSmall: e.target.result
                            }, index++)
                        ]);
                    };
                })), Promise.resolve([])).then((thumbnails)=>{
            this.setState({
                thumbnails: [
                    ...this.state.thumbnails,
                    ...thumbnails
                ]
            });
        });
    },
    // ==============================
    // RENDERERS
    // ==============================
    /**
	 * Renders the file input.
	 * @returns {React.Element} The rendered file input.
	 */ renderFileInput () {
        if (!this.shouldRenderField()) return null;
        return /*#__PURE__*/ _react.default.createElement(_HiddenFileInput.default, {
            accept: SUPPORTED_TYPES.join(),
            key: this.state.uploadFieldPath,
            multiple: true,
            name: this.state.uploadFieldPath,
            onChange: this.uploadFile,
            ref: "fileInput"
        });
    },
    /**
	 * Renders the value input.
	 * @returns {React.Element|null|undefined} The rendered value input, null if the field should not
	 *   render, or undefined if there is no pending upload or deletion.
	 */ renderValueInput () {
        if (!this.shouldRenderField()) return null;
        // This renders an input with either the upload field reference, or an
        // empty value to reset the field if all images have been removed
        if (this.hasFiles()) {
            return /*#__PURE__*/ _react.default.createElement("input", {
                name: this.getInputName(this.props.path),
                value: `upload:${this.state.uploadFieldPath}`,
                type: "hidden"
            });
        } else if (this.getCount('isDeleted') === this.props.value.length) {
            return /*#__PURE__*/ _react.default.createElement("input", {
                name: this.getInputName(this.props.path),
                value: "",
                type: "hidden"
            });
        }
    },
    /**
	 * Renders the lightbox.
	 * @returns {React.Element|undefined} The rendered lightbox, or undefined if there are no images.
	 */ renderLightbox () {
        const { value, secure } = this.props;
        if (!value || !value.length) return;
        const images = value.map((image)=>({
                src: (0, _cloudinaryResize.default)(image.public_id, _object_spread_props(_object_spread({}, RESIZE_DEFAULTS), {
                    height: 600,
                    width: 900,
                    secure
                }))
            }));
        return /*#__PURE__*/ _react.default.createElement(_reactimages.default, {
            images: images,
            currentImage: this.state.lightboxImageIndex,
            isOpen: this.state.lightboxIsVisible,
            onClickPrev: this.lightboxPrevious,
            onClickNext: this.lightboxNext,
            onClose: this.closeLightbox
        });
    },
    /**
	 * Renders the toolbar.
	 * @returns {React.Element} The rendered toolbar.
	 */ renderToolbar () {
        if (!this.shouldRenderField()) return null;
        const uploadCount = this.getCount('isQueued');
        const deleteCount = this.getCount('isDeleted');
        // provide a gutter for the change message
        // only required when no cancel button, which has equiv. padding
        const uploadButtonStyles = !this.hasFiles() ? {
            marginRight: 10
        } : {};
        // prepare the change message
        const changeMessage = uploadCount || deleteCount ? /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, null, uploadCount && deleteCount ? `${uploadCount} added and ${deleteCount} removed` : null, uploadCount && !deleteCount ? `${uploadCount} image added` : null, !uploadCount && deleteCount ? `${deleteCount} image removed` : null) : null;
        // prepare the save message
        const saveMessage = uploadCount || deleteCount ? /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
            color: !deleteCount ? 'success' : 'danger'
        }, "Save to ", !deleteCount ? 'Upload' : 'Confirm') : null;
        // clear floating images above
        const toolbarStyles = {
            clear: 'both'
        };
        return /*#__PURE__*/ _react.default.createElement("div", {
            style: toolbarStyles
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.triggerFileBrowser,
            style: uploadButtonStyles,
            "data-e2e-upload-button": "true"
        }, "Upload Images"), this.hasFiles() && /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            variant: "link",
            color: "cancel",
            onClick: this.clearFiles
        }, "Clear selection"), changeMessage, saveMessage);
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        const { label, note, path } = this.props;
        const { thumbnails } = this.state;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: label,
            className: "field-type-cloudinaryimages",
            htmlFor: path
        }, /*#__PURE__*/ _react.default.createElement("div", null, thumbnails), this.renderValueInput(), this.renderFileInput(), this.renderToolbar(), !!note && /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            note: note
        }), this.renderLightbox());
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/utils/cloudinaryResize":83,"../../components/FileChangeMessage.mjs":93,"../../components/HiddenFileInput.mjs":94,"../Field.mjs":105,"./CloudinaryImagesThumbnail.mjs":118,"lodash":undefined,"react":undefined,"react-images":undefined}],117:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `CloudinaryImageFilter` component, which is used to
 * filter `CloudinaryImages` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _CloudinaryImageFilter.default;
    }
});
const _CloudinaryImageFilter = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../cloudinaryimage/CloudinaryImageFilter.mjs":114}],118:[function(require,module,exports){
/**
 * @file
 * This file defines the `CloudinaryImagesThumbnail` component, which is used to
 * render a thumbnail for a Cloudinary image.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _ImageThumbnail = /*#__PURE__*/ _interop_require_default(require("../../components/ImageThumbnail"));
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
 * The `CloudinaryImagesThumbnail` component.
 * @param {object} props The component's props.
 * @param {boolean} props.isDeleted Whether the image is marked for deletion.
 * @param {string} props.imageSourceLarge The URL of the large version of the image used for the lightbox.
 * @param {string} props.imageSourceSmall The URL of the small version of the image shown in the thumbnail.
 * @param {string} props.inputName The name attribute for the hidden input that stores the image value.
 * @param {boolean} props.isQueued Whether the image is queued for upload and not yet saved.
 * @param {(event: MouseEvent) => void} props.openLightbox Callback invoked when the thumbnail is clicked to open the lightbox.
 * @param {boolean} props.shouldRenderActionButton Whether the remove/undo action button should be rendered.
 * @param {() => void} props.toggleDelete Callback invoked when the action button is clicked to toggle deletion.
 * @param {object} props.value The Cloudinary image data object stored for this image.
 * @returns {React.Element} The rendered component.
 */ function CloudinaryImagesThumbnail(_0) {
    let { isDeleted, imageSourceLarge, imageSourceSmall, inputName, isQueued, openLightbox, shouldRenderActionButton, toggleDelete, value } = _0, props = _object_without_properties(_0, [
        "isDeleted",
        "imageSourceLarge",
        "imageSourceSmall",
        "inputName",
        "isQueued",
        "openLightbox",
        "shouldRenderActionButton",
        "toggleDelete",
        "value"
    ]);
    // render icon feedback for intent
    let mask;
    if (isQueued) mask = 'upload';
    else if (isDeleted) mask = 'remove';
    // action button
    const actionButton = shouldRenderActionButton && !isQueued ? /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
        variant: "link",
        color: isDeleted ? 'default' : 'cancel',
        block: true,
        onClick: toggleDelete
    }, isDeleted ? 'Undo' : 'Remove') : null;
    const input = !isQueued && !isDeleted && value ? /*#__PURE__*/ _react.default.createElement("input", {
        type: "hidden",
        name: inputName,
        value: JSON.stringify(value)
    }) : null;
    // provide gutter for the images
    const imageStyles = {
        float: 'left',
        marginBottom: 10,
        marginRight: 10
    };
    return /*#__PURE__*/ _react.default.createElement("div", {
        style: imageStyles
    }, /*#__PURE__*/ _react.default.createElement(_ImageThumbnail.default, {
        component: imageSourceLarge ? 'a' : 'span',
        href: !!imageSourceLarge && imageSourceLarge,
        onClick: !!imageSourceLarge && openLightbox,
        mask: mask,
        target: !!imageSourceLarge && '__blank'
    }, /*#__PURE__*/ _react.default.createElement("img", {
        src: imageSourceSmall,
        style: {
            height: 90
        }
    })), actionButton, input);
}
CloudinaryImagesThumbnail.propTypes = {
    imageSourceLarge: _react.PropTypes.string,
    imageSourceSmall: _react.PropTypes.string.isRequired,
    isDeleted: _react.PropTypes.bool,
    isQueued: _react.PropTypes.bool,
    openLightbox: _react.PropTypes.func.isRequired,
    shouldRenderActionButton: _react.PropTypes.bool,
    toggleDelete: _react.PropTypes.func.isRequired
};
const _default = CloudinaryImagesThumbnail;

},{"../../../admin/client-legacy/App/elemental":65,"../../components/ImageThumbnail":96,"react":undefined}],119:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextColumn` component, which is used to render
 * the value of a `Code` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextColumn.default;
    }
});
const _TextColumn = /*#__PURE__*/ _interop_require_default(require("../text/TextColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextColumn.mjs":185}],120:[function(require,module,exports){
(function (global){(function (){
/**
 * @file
 * This file defines the `CodeField` component, which is used to render a
 * code field in the KeystoneJS Admin UI.
 *
 * It uses the CodeMirror library to provide a rich code editing experience.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * TODO:
 * - Remove dependency on lodash
 */ // See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html
/**
 * The `CodeField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _codemirror = /*#__PURE__*/ _interop_require_default((typeof window !== "undefined" ? window['CodeMirror'] : typeof global !== "undefined" ? global['CodeMirror'] : null));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'CodeField',
    statics: {
        type: 'Code'
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            isFocused: false
        };
    },
    /**
	 * Initializes the CodeMirror instance.
	 */ componentDidMount () {
        if (!this.refs.codemirror) {
            return;
        }
        const options = _lodash.default.defaults({}, this.props.editor, {
            lineNumbers: true,
            readOnly: this.shouldRenderField() ? false : true
        });
        this.codeMirror = _codemirror.default.fromTextArea((0, _reactdom.findDOMNode)(this.refs.codemirror), options);
        this.codeMirror.setSize(null, this.props.height);
        this.codeMirror.on('change', this.codemirrorValueChanged);
        this.codeMirror.on('focus', this.focusChanged.bind(this, true));
        this.codeMirror.on('blur', this.focusChanged.bind(this, false));
        this._currentCodemirrorValue = this.props.value;
    },
    /**
	 * Destroys the CodeMirror instance.
	 */ componentWillUnmount () {
        // todo: is there a lighter-weight way to remove the cm instance?
        if (this.codeMirror) {
            this.codeMirror.toTextArea();
        }
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillReceiveProps (nextProps) {
        if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
            this.codeMirror.setValue(nextProps.value);
        }
    },
    /**
	 * Focuses the CodeMirror instance.
	 */ focus () {
        if (this.codeMirror) {
            this.codeMirror.focus();
        }
    },
    /**
	 * Handles a change in the focus of the CodeMirror instance.
	 * @param {boolean} focused Whether the instance is focused.
	 */ focusChanged (focused) {
        this.setState({
            isFocused: focused
        });
    },
    /**
	 * Handles a change in the value of the CodeMirror instance.
	 * @param {object} doc The CodeMirror document.
	 * @param {object} change The change object.
	 */ codemirrorValueChanged (doc, change) {
        const newValue = doc.getValue();
        this._currentCodemirrorValue = newValue;
        this.props.onChange({
            path: this.props.path,
            value: newValue
        });
    },
    /**
	 * Renders the CodeMirror instance.
	 * @returns {React.Element} The rendered CodeMirror instance.
	 */ renderCodemirror () {
        const className = (0, _classnames.default)('CodeMirror-container', {
            'is-focused': this.state.isFocused && this.shouldRenderField()
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: className
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            multiline: true,
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "codemirror",
            value: this.props.value
        }));
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return this.renderCodemirror();
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        return this.renderCodemirror();
    }
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"classnames":undefined,"lodash":undefined,"react":undefined,"react-dom":undefined}],121:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Code` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],122:[function(require,module,exports){
/**
 * @file
 * This file defines the `ColorColumn` component, which is used to render the
 * value of a `Color` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `ColorColumn` component.
 * @augments React.Component
 */ const ColorColumn = _react.default.createClass({
    displayName: 'ColorColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return null;
        const colorBoxStyle = {
            backgroundColor: value,
            borderRadius: 3,
            display: 'inline-block',
            height: 18,
            marginRight: 10,
            verticalAlign: 'middle',
            width: 18
        };
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            truncate: false,
            field: this.props.col.type
        }, /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                lineHeight: '18px'
            }
        }, /*#__PURE__*/ _react.default.createElement("span", {
            style: colorBoxStyle
        }), /*#__PURE__*/ _react.default.createElement("span", {
            style: {
                display: 'inline-block',
                verticalAlign: 'middle'
            }
        }, value)));
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = ColorColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],123:[function(require,module,exports){
/**
 * @file
 * This file defines the `ColorField` component, which is used to render a
 * color field in the KeystoneJS Admin UI.
 *
 * It provides a color picker and a swatch to display the selected color.
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
const _reactcolor = require("react-color");
const _glamor = require("glamor");
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _transparentswatch = /*#__PURE__*/ _interop_require_default(require("./transparent-swatch.mjs"));
const _coloredswatch = /*#__PURE__*/ _interop_require_default(require("./colored-swatch.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/theme"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `ColorField` component.
 * @augments Field
 */ const ColorField = _Field.default.create({
    displayName: 'ColorField',
    statics: {
        type: 'Color'
    },
    propTypes: {
        onChange: _react.default.PropTypes.func,
        path: _react.default.PropTypes.string,
        value: _react.default.PropTypes.string
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            displayColorPicker: false
        };
    },
    /**
	 * Updates the value of the field.
	 * @param {string} value The new value.
	 */ updateValue (value) {
        this.props.onChange({
            path: this.props.path,
            value: value
        });
    },
    /**
	 * Handles a change in the value of the input.
	 * @param {object} event The event object.
	 */ handleInputChange (event) {
        let newValue = event.target.value;
        if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
            newValue = '#' + newValue;
        }
        if (newValue === this.props.value) return;
        this.updateValue(newValue);
    },
    /**
	 * Handles a click on the swatch.
	 */ handleClick () {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    },
    /**
	 * Handles the closing of the color picker.
	 */ handleClose () {
        this.setState({
            displayColorPicker: false
        });
    },
    /**
	 * Handles a change in the value of the color picker.
	 * @param {object} color The new color.
	 */ handlePickerChange (color) {
        const newValue = color.hex;
        if (newValue === this.props.value) return;
        this.updateValue(newValue);
    },
    /**
	 * Renders the swatch.
	 * @returns {React.Element} The rendered swatch.
	 */ renderSwatch () {
        const className = `${(0, _glamor.css)(classes.swatch)} e2e-type-color__swatch`;
        return this.props.value ? /*#__PURE__*/ _react.default.createElement("span", {
            className: className,
            style: {
                color: this.props.value
            },
            dangerouslySetInnerHTML: {
                __html: _coloredswatch.default
            }
        }) : /*#__PURE__*/ _react.default.createElement("span", {
            className: className,
            dangerouslySetInnerHTML: {
                __html: _transparentswatch.default
            }
        });
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { displayColorPicker } = this.state;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "e2e-type-color__wrapper",
            style: {
                position: 'relative'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroup, null, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
            grow: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "field",
            value: this.props.value
        })), /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.handleClick,
            style: classes.button,
            "data-e2e-type-color__button": true
        }, this.renderSwatch()))), displayColorPicker && /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.blockout),
            "data-e2e-type-color__blockout": true,
            onClick: this.handleClose
        }), /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.popover),
            onClick: (e)=>e.stopPropagation(),
            "data-e2e-type-color__popover": true
        }, /*#__PURE__*/ _react.default.createElement(_reactcolor.SketchPicker, {
            color: this.props.value,
            onChangeComplete: this.handlePickerChange,
            onClose: this.handleClose
        }))));
    }
});
/* eslint quote-props: ["error", "as-needed"] */ const classes = {
    button: {
        background: 'white !important',
        padding: 4,
        width: _theme.default.component.height
    },
    blockout: {
        bottom: 0,
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 1
    },
    popover: {
        marginTop: 10,
        position: 'absolute',
        left: 0,
        zIndex: 500
    },
    swatch: {
        borderRadius: 1,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        display: 'block',
        ' svg': {
            display: 'block'
        }
    }
};
const _default = ColorField;

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/theme":81,"../Field.mjs":105,"./colored-swatch.mjs":125,"./transparent-swatch.mjs":126,"glamor":undefined,"react":undefined,"react-color":undefined}],124:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Color` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],125:[function(require,module,exports){
/**
 * @file
 * This file defines the SVG for a colored swatch.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = `<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g fill="currentColor">
			<rect x="0" y="0" width="24" height="24" />
		</g>
	</svg>`;

},{}],126:[function(require,module,exports){
/**
 * @file
 * This file defines the SVG for a transparent swatch.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = `<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g fill="#CCCCCC">
			<path d="M0,0 L8,0 L8,8 L0,8 L0,0 Z M8,8 L16,8 L16,16 L8,16 L8,8 Z M0,16 L8,16 L8,24 L0,24 L0,16 Z M16,0 L24,0 L24,8 L16,8 L16,0 Z M16,16 L24,16 L24,24 L16,24 L16,16 Z" />
		</g>
	</svg>`;

},{}],127:[function(require,module,exports){
/**
 * @file
 * This file defines the `DateColumn` component, which is used to render the
 * value of a `Date` or `Datetime` field in a list view.
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
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `DateColumn` component.
 * @augments React.Component
 */ const DateColumn = _react.default.createClass({
    displayName: 'DateColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object,
        linkTo: _react.default.PropTypes.string
    },
    /**
	 * Converts a value to a moment object.
	 * @param {string|Date|number} value The value to convert.
	 * @returns {moment.Moment} The moment object.
	 */ toMoment (value) {
        if (this.props.col.field.isUTC) {
            return _moment.default.utc(value);
        } else {
            return (0, _moment.default)(value);
        }
    },
    /**
	 * Gets the value of the field.
	 * @returns {string} The formatted value.
	 */ getValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return null;
        const format = this.props.col.type === 'datetime' ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
        return this.toMoment(value).format(format);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const value = this.getValue();
        const empty = !value && this.props.linkTo ? true : false;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type,
            to: this.props.linkTo,
            empty: empty
        }, value));
    }
});
const _default = DateColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"moment":undefined,"react":undefined}],128:[function(require,module,exports){
/**
 * @file
 * This file defines the `DateField` component, which is used to render a date
 * field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a "Today" button to make it easy to select a
 * date.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `DateField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _DateInput = /*#__PURE__*/ _interop_require_default(require("../../components/DateInput.mjs"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/ const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';
const _default = _Field.default.create({
    displayName: 'DateField',
    statics: {
        type: 'Date'
    },
    propTypes: {
        formatString: _react.default.PropTypes.string,
        inputFormat: _react.default.PropTypes.string,
        label: _react.default.PropTypes.string,
        note: _react.default.PropTypes.string,
        onChange: _react.default.PropTypes.func,
        path: _react.default.PropTypes.string,
        todayButton: _react.default.PropTypes.bool,
        value: _react.default.PropTypes.string
    },
    /**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */ getDefaultProps () {
        return {
            formatString: DEFAULT_FORMAT_STRING,
            inputFormat: DEFAULT_INPUT_FORMAT
        };
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 * @param {string} event.value The new date value in the configured input format.
	 */ valueChanged ({ value }) {
        this.props.onChange({
            path: this.props.path,
            value: value
        });
    },
    /**
	 * Converts a value to a moment object.
	 * @param {string|Date|number} value The value to convert.
	 * @returns {moment.Moment} The moment object.
	 */ toMoment (value) {
        if (this.props.isUTC) {
            return _moment.default.utc(value);
        } else {
            return (0, _moment.default)(value);
        }
    },
    /**
	 * Checks whether a value is valid.
	 * @param {string|Date|number} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */ isValid (value) {
        return this.toMoment(value, this.inputFormat).isValid();
    },
    /**
	 * Formats a value.
	 * @param {string|Date|number} value The value to format.
	 * @returns {string} The formatted value.
	 */ format (value) {
        return value ? this.toMoment(value).format(this.props.formatString) : '';
    },
    /**
	 * Sets the value of the field to today's date.
	 */ setToday () {
        this.valueChanged({
            value: this.toMoment(new Date()).format(this.props.inputFormat)
        });
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, this.format(this.props.value));
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const dateAsMoment = this.toMoment(this.props.value);
        const value = this.props.value && dateAsMoment.isValid() ? dateAsMoment.format(this.props.inputFormat) : this.props.value;
        return /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroup, null, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
            grow: true
        }, /*#__PURE__*/ _react.default.createElement(_DateInput.default, {
            format: this.props.inputFormat,
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "dateInput",
            value: value
        })), this.props.todayButton && /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.setToday
        }, "Today")));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../components/DateInput.mjs":92,"../Field.mjs":105,"moment":undefined,"react":undefined}],129:[function(require,module,exports){
/**
 * @file
 * This file defines the `DateFilter` component, which is used to filter `Date`
 * fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
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
const _reactdom = require("react-dom");
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _reactdaypicker = /*#__PURE__*/ _interop_require_default(require("react-day-picker"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const INVERTED_OPTIONS = [
    {
        label: 'Matches',
        value: false
    },
    {
        label: 'Does NOT Match',
        value: true
    }
];
const MODE_OPTIONS = [
    {
        label: 'On',
        value: 'on'
    },
    {
        label: 'After',
        value: 'after'
    },
    {
        label: 'Before',
        value: 'before'
    },
    {
        label: 'Between',
        value: 'between'
    }
];
/**
 * A component that renders an indicator for the active input field in the
 * DayPicker.
 * @param {object} props The component's props.
 * @param {string} props.activeInputField The name of the currently active input field ('after' or 'before').
 * @returns {React.Element} The rendered component.
 */ const DayPickerIndicator = ({ activeInputField })=>{
    const style = activeInputField === 'before' ? {
        left: '11rem'
    } : null;
    return /*#__PURE__*/ _react.default.createElement("span", {
        className: "DayPicker-Indicator",
        style: style
    }, /*#__PURE__*/ _react.default.createElement("span", {
        className: "DayPicker-Indicator__border"
    }), /*#__PURE__*/ _react.default.createElement("span", {
        className: "DayPicker-Indicator__bg"
    }));
};
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        inverted: INVERTED_OPTIONS[0].value,
        value: (0, _moment.default)(0, 'HH').format(),
        before: (0, _moment.default)(0, 'HH').format(),
        after: (0, _moment.default)(0, 'HH').format()
    };
}
/**
 * The `DateFilter` component.
 * @augments React.Component
 */ const DateFilter = _react.default.createClass({
    displayName: 'DateFilter',
    propTypes: {
        filter: _react.PropTypes.shape({
            mode: _react.PropTypes.oneOf(MODE_OPTIONS.map((i)=>i.value)),
            inverted: _react.PropTypes.boolean
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            format: 'DD-MM-YYYY',
            filter: getDefaultValue(),
            value: (0, _moment.default)().startOf('day').toDate()
        };
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            activeInputField: 'after',
            month: new Date()
        };
    },
    componentDidMount () {
        this.__isMounted = true;
    },
    componentWillUnmount () {
        this.__isMounted = false;
    },
    // ==============================
    // METHODS
    // ==============================
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */ toggleInverted (value) {
        this.updateFilter({
            inverted: value
        });
        this.setFocus(this.props.filter.mode);
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        const mode = e.target.value;
        this.updateFilter({
            mode
        });
        this.setFocus(mode);
    },
    /**
	 * Sets the focus to the correct input field.
	 * @param {string} mode The current mode of the filter.
	 */ setFocus (mode) {
        // give the UI a moment to render
        if (mode === 'between') {
            setTimeout(()=>{
                (0, _reactdom.findDOMNode)(this.refs[this.state.activeInputField]).focus();
            }, 50);
        } else {
            setTimeout(()=>{
                this.refs.input.focus();
            }, 50);
        }
    },
    /**
	 * Handles a change in the value of one of the input fields.
	 * @param {object} e The event object.
	 */ handleInputChange (e) {
    // TODO @jedwatson
    // Entering virtually any value will return an "Invalid date", so I'm
    // temporarily disabling user entry. This entire component needs review.
    // const { value } = e.target;
    // let { month } = this.state;
    // // Change the current month only if the value entered by the user is a valid
    // // date, according to the `L` format
    // if (moment(value, 'L', true).isValid()) {
    // 	month = moment(value, 'L').toDate();
    // }
    // this.updateFilter({ value: value });
    // this.setState({ month }, this.showCurrentDate);
    },
    /**
	 * Sets the active input field.
	 * @param {string} field The name of the field to set as active.
	 */ setActiveField (field) {
        this.setState({
            activeInputField: field
        });
    },
    /**
	 * Switches between the two input fields in "between" mode.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */ switchBetweenActiveInputFields (e, day, modifiers) {
        if (modifiers && modifiers.disabled) return;
        const { activeInputField } = this.state;
        const send = {};
        const newActiveField = activeInputField === 'before' ? 'after' : 'before';
        send[activeInputField] = day;
        this.updateFilter(send);
        this.setState({
            activeInputField: newActiveField
        }, ()=>{
            (0, _reactdom.findDOMNode)(this.refs[newActiveField]).focus();
        });
    },
    /**
	 * Selects a day in the date picker.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */ selectDay (e, day, modifiers) {
        if (modifiers && modifiers.disabled) return;
        this.updateFilter({
            value: day
        });
    },
    /**
	 * Shows the current date in the date picker.
	 */ showCurrentDate () {
        // give the UI a moment to render
        setTimeout(()=>{
            this.refs.daypicker.showMonth(this.state.month);
        }, 50);
    },
    // ==============================
    // RENDERERS
    // ==============================
    /**
	 * Renders the toggle for inverting the filter.
	 * @returns {React.Element} The rendered toggle.
	 */ renderToggle () {
        const { filter } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                marginBottom: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleInverted,
            options: INVERTED_OPTIONS,
            value: filter.inverted
        }));
    },
    /**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */ renderControls () {
        let controls;
        const { activeInputField } = this.state;
        const { field, filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';
        // DayPicker Modifiers - Selected Day
        const modifiers = filter.mode === 'between' ? {
            selected: (day)=>(0, _moment.default)(filter[activeInputField]).isSame(day)
        } : {
            selected: (day)=>(0, _moment.default)(filter.value).isSame(day)
        };
        if (mode.value === 'between') {
            controls = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    marginBottom: '1em'
                }
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
                xsmall: "one-half",
                gutter: 10
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                autoFocus: true,
                ref: "after",
                placeholder: "From",
                onChange: this.handleInputChange,
                onFocus: ()=>this.setActiveField('after'),
                value: (0, _moment.default)(filter.after).format(this.props.format)
            })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                ref: "before",
                placeholder: "To",
                onChange: this.handleInputChange,
                onFocus: ()=>this.setActiveField('before'),
                value: (0, _moment.default)(filter.before).format(this.props.format)
            })))), /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    position: 'relative'
                }
            }, /*#__PURE__*/ _react.default.createElement(_reactdaypicker.default, {
                modifiers: modifiers,
                className: "DayPicker--chrome",
                onDayClick: this.switchBetweenActiveInputFields
            }), /*#__PURE__*/ _react.default.createElement(DayPickerIndicator, {
                activeInputField: activeInputField
            })));
        } else {
            controls = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    marginBottom: '1em'
                }
            }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                autoFocus: true,
                ref: "input",
                placeholder: placeholder,
                value: (0, _moment.default)(filter.value).format(this.props.format),
                onChange: this.handleInputChange,
                onFocus: this.showCurrentDate
            })), /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    position: 'relative'
                }
            }, /*#__PURE__*/ _react.default.createElement(_reactdaypicker.default, {
                ref: "daypicker",
                modifiers: modifiers,
                className: "DayPicker--chrome",
                onDayClick: this.selectDay
            }), /*#__PURE__*/ _react.default.createElement(DayPickerIndicator, null)));
        }
        return controls;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        return /*#__PURE__*/ _react.default.createElement("div", null, this.renderToggle(), /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                marginBottom: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            options: MODE_OPTIONS,
            onChange: this.selectMode,
            value: mode.value
        })), this.renderControls());
    }
});
const _default = DateFilter;

},{"../../../admin/client-legacy/App/elemental":65,"moment":undefined,"react":undefined,"react-day-picker":undefined,"react-dom":undefined}],130:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `ArrayColumn` component, which is used to render
 * the value of a `DateArray` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _ArrayColumn.default;
    }
});
const _ArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../components/columns/ArrayColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../../components/columns/ArrayColumn.mjs":100}],131:[function(require,module,exports){
/**
 * @file
 * This file defines the `DateArrayField` component, which is used to render a
 * date array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field, and it provides a `DateInput` component to edit the dates.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `DateArrayField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _ArrayField = /*#__PURE__*/ _interop_require_default(require("../../mixins/ArrayField.mjs"));
const _DateInput = /*#__PURE__*/ _interop_require_default(require("../../components/DateInput.mjs"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';
const _default = _Field.default.create({
    displayName: 'DateArrayField',
    statics: {
        type: 'DateArray'
    },
    mixins: [
        _ArrayField.default
    ],
    propTypes: {
        formatString: _react.default.PropTypes.string,
        inputFormat: _react.default.PropTypes.string
    },
    /**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */ getDefaultProps () {
        return {
            formatString: DEFAULT_FORMAT_STRING,
            inputFormat: DEFAULT_INPUT_FORMAT
        };
    },
    /**
	 * Processes a new value into the field's input format string.
	 * Returns `undefined` for falsy input and the original value if it cannot
	 * be parsed as a valid date.
	 * @param {string|number|Date} value The raw input value to process.
	 * @returns {string|undefined} The formatted date string, or `undefined` if
	 *   the input is falsy.
	 */ processInputValue (value) {
        if (!value) return;
        const m = (0, _moment.default)(value);
        return m.isValid() ? m.format(this.props.inputFormat) : value;
    },
    /**
	 * Formats a value using the component's `formatString` prop.
	 * @param {string|number|Date} value The date value to format.
	 * @returns {string} The formatted date string, or an empty string for a
	 *   falsy value.
	 */ formatValue (value) {
        return value ? (0, _moment.default)(value).format(this.props.formatString) : '';
    },
    /**
	 * Returns the input component.
	 * @returns {React.Component} The input component.
	 */ getInputComponent () {
        return _DateInput.default;
    }
});

},{"../../components/DateInput.mjs":92,"../../mixins/ArrayField.mjs":104,"../Field.mjs":105,"moment":undefined,"react":undefined}],132:[function(require,module,exports){
/**
 * @file
 * This file defines the `DateArrayFilter` component, which is used to filter
 * `DateArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
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
const _reactdom = require("react-dom");
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _reactdaypicker = /*#__PURE__*/ _interop_require_default(require("react-day-picker"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const PRESENCE_OPTIONS = [
    {
        label: 'At least one element',
        value: 'some'
    },
    {
        label: 'No element',
        value: 'none'
    }
];
const MODE_OPTIONS = [
    {
        label: 'On',
        value: 'on'
    },
    {
        label: 'After',
        value: 'after'
    },
    {
        label: 'Before',
        value: 'before'
    },
    {
        label: 'Between',
        value: 'between'
    }
];
/**
 * A component that renders an indicator for the active input field in the
 * DayPicker.
 * @returns {React.Element} The rendered component.
 */ const DayPickerIndicator = _react.default.createClass({
    render () {
        return /*#__PURE__*/ _react.default.createElement("span", {
            className: "DayPicker-Indicator"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "DayPicker-Indicator__border"
        }), /*#__PURE__*/ _react.default.createElement("span", {
            className: "DayPicker-Indicator__bg"
        }));
    },
    displayName: "DayPickerIndicator"
});
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        presence: PRESENCE_OPTIONS[0].value,
        value: (0, _moment.default)(0, 'HH').format(),
        before: (0, _moment.default)(0, 'HH').format(),
        after: (0, _moment.default)(0, 'HH').format()
    };
}
/**
 * The `DateFilter` component.
 * @augments React.Component
 */ const DateFilter = _react.default.createClass({
    displayName: 'DateFilter',
    propTypes: {
        filter: _react.default.PropTypes.shape({
            mode: _react.default.PropTypes.oneOf(MODE_OPTIONS.map((i)=>i.value)),
            presence: _react.default.PropTypes.string
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            format: 'DD-MM-YYYY',
            filter: getDefaultValue(),
            value: (0, _moment.default)().startOf('day').toDate()
        };
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            activeInputField: 'after',
            month: new Date()
        };
    },
    componentDidMount () {
        // focus the text input
        if (this.props.filter.mode === 'between') {
            (0, _reactdom.findDOMNode)(this.refs[this.state.activeInputField]).focus();
        } else {
            (0, _reactdom.findDOMNode)(this.refs.input).focus();
        }
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */ selectPresence (e) {
        const presence = e.target.value;
        this.updateFilter({
            presence
        });
        (0, _reactdom.findDOMNode)(this.refs.input).focus();
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        const mode = e.target.value;
        this.updateFilter({
            mode
        });
        if (mode === 'between') {
            setTimeout(()=>{
                (0, _reactdom.findDOMNode)(this.refs[this.state.activeInputField]).focus();
            }, 200);
        } else {
            (0, _reactdom.findDOMNode)(this.refs.input).focus();
        }
    },
    /**
	 * Handles a change in the value of the input.
	 * @param {object} e The event object.
	 */ handleInputChange (e) {
        const { value } = e.target;
        let { month } = this.state;
        // Change the current month only if the value entered by the user is a valid
        // date, according to the `L` format
        if ((0, _moment.default)(value, 'L', true).isValid()) {
            month = (0, _moment.default)(value, 'L').toDate();
        }
        this.updateFilter({
            value: value
        });
        this.setState({
            month
        }, this.showCurrentDate);
    },
    /**
	 * Sets the active input field.
	 * @param {string} field The name of the field to set as active.
	 */ setActiveField (field) {
        this.setState({
            activeInputField: field
        });
    },
    /**
	 * Switches between the two input fields in "between" mode.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */ switchBetweenActiveInputFields (e, day, modifiers) {
        if (modifiers && modifiers.disabled) return;
        const { activeInputField } = this.state;
        const send = {};
        send[activeInputField] = day;
        this.updateFilter(send);
        const newActiveField = activeInputField === 'before' ? 'after' : 'before';
        this.setState({
            activeInputField: newActiveField
        }, ()=>{
            (0, _reactdom.findDOMNode)(this.refs[newActiveField]).focus();
        });
    },
    /**
	 * Selects a day in the date picker.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */ selectDay (e, day, modifiers) {
        if (modifiers && modifiers.disabled) return;
        this.updateFilter({
            value: day
        });
    },
    /**
	 * Shows the current date in the date picker.
	 */ showCurrentDate () {
        this.refs.daypicker.showMonth(this.state.month);
    },
    /**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */ renderControls () {
        let controls;
        const { field, filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';
        // DayPicker stuff
        const modifiers = {
            selected: (day)=>(0, _moment.default)(filter.value).isSame(day)
        };
        if (mode.value === 'between') {
            controls = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    marginBottom: '1em'
                }
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
                xsmall: "one-half",
                gutter: 10
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                ref: "after",
                placeholder: "From",
                onFocus: (e)=>{
                    this.setActiveField('after');
                },
                value: (0, _moment.default)(filter.after).format(this.props.format)
            })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                ref: "before",
                placeholder: "To",
                onFocus: (e)=>{
                    this.setActiveField('before');
                },
                value: (0, _moment.default)(filter.before).format(this.props.format)
            })))), /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    position: 'relative'
                }
            }, /*#__PURE__*/ _react.default.createElement(_reactdaypicker.default, {
                className: "DayPicker--chrome",
                modifiers: modifiers,
                onDayClick: this.switchBetweenActiveInputFields
            }), /*#__PURE__*/ _react.default.createElement(DayPickerIndicator, null)));
        } else {
            controls = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    marginBottom: '1em'
                }
            }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleInputChange,
                onFocus: this.showCurrentDate,
                placeholder: placeholder,
                ref: "input",
                value: (0, _moment.default)(filter.value).format(this.props.format)
            })), /*#__PURE__*/ _react.default.createElement("div", {
                style: {
                    position: 'relative'
                }
            }, /*#__PURE__*/ _react.default.createElement(_reactdaypicker.default, {
                className: "DayPicker--chrome",
                modifiers: modifiers,
                onDayClick: this.selectDay,
                ref: "daypicker"
            }), /*#__PURE__*/ _react.default.createElement(DayPickerIndicator, null)));
        }
        return controls;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const presence = PRESENCE_OPTIONS.filter((i)=>i.value === filter.presence)[0];
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                marginBottom: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectPresence,
            options: PRESENCE_OPTIONS,
            value: presence.value
        })), /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                marginBottom: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectMode,
            options: MODE_OPTIONS,
            value: mode.value
        })), this.renderControls());
    }
});
const _default = DateFilter;

},{"../../../admin/client-legacy/App/elemental":65,"moment":undefined,"react":undefined,"react-day-picker":undefined,"react-dom":undefined}],133:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `DateColumn` component, which is used to render
 * the value of a `Datetime` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _DateColumn.default;
    }
});
const _DateColumn = /*#__PURE__*/ _interop_require_default(require("../date/DateColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../date/DateColumn.mjs":127}],134:[function(require,module,exports){
/**
 * @file
 * This file defines the `DatetimeField` component, which is used to render a
 * datetime field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a time input to make it easy to select a
 * date and time.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `DatetimeField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _DateInput = /*#__PURE__*/ _interop_require_default(require("../../components/DateInput.mjs"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'DatetimeField',
    statics: {
        type: 'Datetime'
    },
    focusTargetRef: 'dateInput',
    // default input formats
    dateInputFormat: 'YYYY-MM-DD',
    timeInputFormat: 'h:mm:ss a',
    tzOffsetInputFormat: 'Z',
    // parse formats (duplicated from lib/fieldTypes/datetime.js)
    parseFormats: [
        'YYYY-MM-DD',
        'YYYY-MM-DD h:m:s a',
        'YYYY-MM-DD h:m a',
        'YYYY-MM-DD H:m:s',
        'YYYY-MM-DD H:m'
    ],
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            dateValue: this.props.value && this.moment(this.props.value).format(this.dateInputFormat),
            timeValue: this.props.value && this.moment(this.props.value).format(this.timeInputFormat),
            tzOffsetValue: this.props.value ? this.moment(this.props.value).format(this.tzOffsetInputFormat) : this.moment().format(this.tzOffsetInputFormat)
        };
    },
    /**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */ getDefaultProps () {
        return {
            formatString: 'Do MMM YYYY, h:mm:ss a'
        };
    },
    /**
	 * Returns a moment object with the correct timezone.
	 * @returns {moment} The moment object.
	 */ moment () {
        if (this.props.isUTC) return _moment.default.utc.apply(_moment.default, arguments);
        else return _moment.default.apply(undefined, arguments);
    },
    /**
	 * Checks whether a value is a valid date and time.
	 * @param {string|Date|number|null} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */ // TODO: Move isValid() so we can share with server-side code
    isValid (value) {
        return this.moment(value, this.parseFormats).isValid();
    },
    /**
	 * Formats a value.
	 * @param {string|Date|number|null} value The value to format.
	 * @param {string} format The format string to use.
	 * @returns {string} The formatted value.
	 */ // TODO: Move format() so we can share with server-side code
    format (value, format) {
        format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
        return value ? this.moment(value).format(format) : '';
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {string} dateValue The new date value.
	 * @param {string} timeValue The new time value.
	 * @param {string} tzOffsetValue The new timezone offset value.
	 */ handleChange (dateValue, timeValue, tzOffsetValue) {
        let value = dateValue + ' ' + timeValue;
        let datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;
        // if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
        if (typeof tzOffsetValue !== 'undefined') {
            value += ' ' + tzOffsetValue;
            datetimeFormat += ' ' + this.tzOffsetInputFormat;
        } else {
            this.setState({
                tzOffsetValue: this.moment(value, datetimeFormat).format(this.tzOffsetInputFormat)
            });
        }
        this.props.onChange({
            path: this.props.path,
            value: this.isValid(value) ? this.moment(value, datetimeFormat).toISOString() : null
        });
    },
    /**
	 * Handles a change in the date value.
	 * @param {object} event The event object.
	 * @param {string} event.value The new date string.
	 */ dateChanged ({ value }) {
        this.setState({
            dateValue: value
        });
        this.handleChange(value, this.state.timeValue);
    },
    /**
	 * Handles a change in the time value.
	 * @param {object} evt The event object.
	 */ timeChanged (evt) {
        this.setState({
            timeValue: evt.target.value
        });
        this.handleChange(this.state.dateValue, evt.target.value);
    },
    /**
	 * Sets the value of the field to the current date and time.
	 */ setNow () {
        const dateValue = this.moment().format(this.dateInputFormat);
        const timeValue = this.moment().format(this.timeInputFormat);
        const tzOffsetValue = this.moment().format(this.tzOffsetInputFormat);
        this.setState({
            dateValue: dateValue,
            timeValue: timeValue,
            tzOffsetValue: tzOffsetValue
        });
        this.handleChange(dateValue, timeValue, tzOffsetValue);
    },
    /**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */ renderNote () {
        if (!this.props.note) return null;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            note: this.props.note
        });
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        let input;
        if (this.shouldRenderField()) {
            input = /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroup, null, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
                grow: true
            }, /*#__PURE__*/ _react.default.createElement(_DateInput.default, {
                format: this.dateInputFormat,
                name: this.getInputName(this.props.paths.date),
                onChange: this.dateChanged,
                ref: "dateInput",
                value: this.state.dateValue
            })), /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
                grow: true
            }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                autoComplete: "off",
                name: this.getInputName(this.props.paths.time),
                onChange: this.timeChanged,
                placeholder: "HH:MM:SS am/pm",
                value: this.state.timeValue
            })), /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
                onClick: this.setNow
            }, "Now"))), /*#__PURE__*/ _react.default.createElement("input", {
                name: this.getInputName(this.props.paths.tzOffset),
                type: "hidden",
                value: this.state.tzOffsetValue
            }));
        } else {
            input = /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                noedit: true
            }, this.format(this.props.value, this.props.formatString));
        }
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: this.props.label,
            className: "field-type-datetime",
            htmlFor: this.getInputName(this.props.path)
        }, input, this.renderNote());
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../components/DateInput.mjs":92,"../Field.mjs":105,"moment":undefined,"react":undefined}],135:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `DateFilter` component, which is used to filter
 * `Datetime` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _DateFilter.default;
    }
});
const _DateFilter = /*#__PURE__*/ _interop_require_default(require("../date/DateFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../date/DateFilter.mjs":129}],136:[function(require,module,exports){
/**
 * @file
 * This file defines the `EmailColumn` component, which is used to render the
 * value of an `Email` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `EmailColumn` component.
 * @augments React.Component
 */ const EmailColumn = _react.default.createClass({
    displayName: 'EmailColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field as a mailto link, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or `undefined` if the field is empty.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            to: 'mailto:' + value,
            padded: true,
            exterior: true,
            field: this.props.col.type
        }, value);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = EmailColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],137:[function(require,module,exports){
/**
 * @file
 * This file defines the `EmailField` component, which is used to render an
 * email field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /*
	TODO:
	- gravatar
	- validate email address
 */ /**
 * The `EmailField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const _default = _Field.default.create({
    displayName: 'EmailField',
    propTypes: {
        path: _react.PropTypes.string.isRequired,
        value: _react.PropTypes.string
    },
    statics: {
        type: 'Email'
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(this.props.path),
            ref: "focusTarget",
            value: this.props.value,
            onChange: this.valueChanged,
            autoComplete: "off",
            type: "email"
        });
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return this.props.value ? /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true,
            component: "a",
            href: 'mailto:' + this.props.value
        }, this.props.value) : /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        });
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],138:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Email` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],139:[function(require,module,exports){
/**
 * @file
 * This file defines the `FileColumn` component, which is used to render the
 * value of a `File` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `FileColumn` component.
 * @augments React.Component
 */ const LocalFileColumn = _react.default.createClass({
    /**
	 * Returns the filename of the file, or undefined if no file is present.
	 * @returns {string|undefined} The name of the file, or undefined if not set.
	 */ renderValue: function() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.filename) return;
        return value.filename;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render: function() {
        const value = this.props.data.fields[this.props.col.path];
        const href = value && value.url ? value.url : null;
        const label = value && value.filename ? value.filename : null;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, {
            href: href,
            padded: true,
            interior: true,
            field: this.props.col.type
        }, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, null, label));
    },
    displayName: "LocalFileColumn"
});
const _default = LocalFileColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],140:[function(require,module,exports){
/**
 * @file
 * This file defines the `FileField` component, which is used to render a file
 * field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload a file, and it displays the name of the
 * uploaded file. It also provides a button to remove the file.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `FileField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _FileChangeMessage = /*#__PURE__*/ _interop_require_default(require("../../components/FileChangeMessage.mjs"));
const _HiddenFileInput = /*#__PURE__*/ _interop_require_default(require("../../components/HiddenFileInput.mjs"));
const _ImageThumbnail = /*#__PURE__*/ _interop_require_default(require("../../components/ImageThumbnail.mjs"));
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
let uploadInc = 1000;
/**
 * Returns the initial state of the component.
 * @param {object} props The component's props.
 * @returns {object} The initial state.
 */ const buildInitialState = (props)=>({
        action: null,
        removeExisting: false,
        uploadFieldPath: `File-${props.path}-${++uploadInc}`,
        userSelectedFile: null
    });
const _default = _Field.default.create({
    propTypes: {
        autoCleanup: _react.PropTypes.bool,
        collapse: _react.PropTypes.bool,
        label: _react.PropTypes.string,
        note: _react.PropTypes.string,
        path: _react.PropTypes.string.isRequired,
        thumb: _react.PropTypes.bool,
        value: _react.PropTypes.shape({
            filename: _react.PropTypes.string
        })
    },
    statics: {
        type: 'File',
        getDefaultValue: ()=>({})
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return buildInitialState(this.props);
    },
    /**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */ shouldCollapse () {
        return this.props.collapse && !this.hasExisting();
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillUpdate (nextProps) {
        // Show the new filename when it's finished uploading
        if (this.props.value.filename !== nextProps.value.filename) {
            this.setState(buildInitialState(nextProps));
        }
    },
    // ==============================
    // HELPERS
    // ==============================
    /**
	 * Returns whether the field has a file.
	 * @returns {boolean} Whether the field has a file.
	 */ hasFile () {
        return this.hasExisting() || !!this.state.userSelectedFile;
    },
    /**
	 * Returns whether the field has an existing file.
	 * @returns {boolean} Whether the field has an existing file.
	 */ hasExisting () {
        return this.props.value && !!this.props.value.filename;
    },
    /**
	 * Returns the name of the file.
	 * @returns {string} The name of the file.
	 */ getFilename () {
        return this.state.userSelectedFile ? this.state.userSelectedFile.name : this.props.value.filename;
    },
    /**
	 * Returns the URL of the file.
	 * @returns {string} The URL of the file.
	 */ getFileUrl () {
        return this.props.value && this.props.value.url;
    },
    /**
	 * Returns whether the file is an image.
	 * @returns {boolean} Whether the file is an image.
	 */ isImage () {
        const href = this.props.value ? this.props.value.url : undefined;
        return href && href.match(/\.(jpeg|jpg|gif|png|svg)$/i) != null;
    },
    // ==============================
    // METHODS
    // ==============================
    /**
	 * Triggers the file browser.
	 */ triggerFileBrowser () {
        this.refs.fileInput.clickDomNode();
    },
    /**
	 * Handles a change in the file input.
	 * @param {object} event The event object.
	 */ handleFileChange (event) {
        const userSelectedFile = event.target.files[0];
        this.setState({
            userSelectedFile: userSelectedFile
        });
    },
    /**
	 * Handles the removal of a file.
	 * @param {object} e The event object.
	 */ handleRemove (e) {
        let state = {};
        if (this.state.userSelectedFile) {
            state = buildInitialState(this.props);
        } else if (this.hasExisting()) {
            state.removeExisting = true;
            if (this.props.autoCleanup) {
                if (e.altKey) {
                    state.action = 'reset';
                } else {
                    state.action = 'delete';
                }
            } else {
                if (e.altKey) {
                    state.action = 'delete';
                } else {
                    state.action = 'reset';
                }
            }
        }
        this.setState(state);
    },
    /**
	 * Undoes the removal of a file.
	 */ undoRemove () {
        this.setState(buildInitialState(this.props));
    },
    // ==============================
    // RENDERERS
    // ==============================
    /**
	 * Renders the file name and change message.
	 * @returns {React.Element} The rendered file name and change message.
	 */ renderFileNameAndChangeMessage () {
        const href = this.props.value ? this.props.value.url : undefined;
        return /*#__PURE__*/ _react.default.createElement("div", null, this.hasFile() && !this.state.removeExisting ? /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
            component: href ? 'a' : 'span',
            href: href,
            target: "_blank"
        }, this.getFilename()) : null, this.renderChangeMessage());
    },
    /**
	 * Renders the change message.
	 * @returns {React.Element} The rendered change message.
	 */ renderChangeMessage () {
        if (this.state.userSelectedFile) {
            return /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
                color: "success"
            }, "Save to Upload");
        } else if (this.state.removeExisting) {
            return /*#__PURE__*/ _react.default.createElement(_FileChangeMessage.default, {
                color: "danger"
            }, "File ", this.props.autoCleanup ? 'deleted' : 'removed', " - save to confirm");
        } else {
            return null;
        }
    },
    /**
	 * Renders the clear button.
	 * @returns {React.Element} The rendered clear button.
	 */ renderClearButton () {
        if (this.state.removeExisting) {
            return /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
                variant: "link",
                onClick: this.undoRemove
            }, "Undo Remove");
        } else {
            let clearText;
            if (this.state.userSelectedFile) {
                clearText = 'Cancel Upload';
            } else {
                clearText = this.props.autoCleanup ? 'Delete File' : 'Remove File';
            }
            return /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
                variant: "link",
                color: "cancel",
                onClick: this.handleRemove
            }, clearText);
        }
    },
    /**
	 * Renders the action input.
	 * @returns {React.Element} The rendered action input.
	 */ renderActionInput () {
        // If the user has selected a file for uploading, we need to point at
        // the upload field. If the file is being deleted, we submit that.
        if (this.state.userSelectedFile || this.state.action) {
            const value = this.state.userSelectedFile ? `upload:${this.state.uploadFieldPath}` : this.state.action === 'delete' ? 'remove' : '';
            return /*#__PURE__*/ _react.default.createElement("input", {
                name: this.getInputName(this.props.path),
                type: "hidden",
                value: value
            });
        } else {
            return null;
        }
    },
    /**
	 * Renders the image preview.
	 * @returns {React.Element} The rendered image preview.
	 */ renderImagePreview () {
        const imageSource = this.getFileUrl();
        return /*#__PURE__*/ _react.default.createElement(_ImageThumbnail.default, {
            component: "a",
            href: imageSource,
            target: "__blank",
            style: {
                float: 'left',
                marginRight: '1em',
                maxWidth: '50%'
            }
        }, /*#__PURE__*/ _react.default.createElement("img", {
            src: imageSource,
            style: {
                'max-height': 100,
                'max-width': '100%'
            }
        }));
    },
    /**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        const { label, note, path, thumb } = this.props;
        const isImage = this.isImage();
        const hasFile = this.hasFile();
        const previews = /*#__PURE__*/ _react.default.createElement("div", {
            style: isImage && thumb ? {
                marginBottom: '1em'
            } : null
        }, isImage && thumb && this.renderImagePreview(), hasFile && this.renderFileNameAndChangeMessage());
        const buttons = /*#__PURE__*/ _react.default.createElement("div", {
            style: hasFile ? {
                marginTop: '1em'
            } : null
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.triggerFileBrowser
        }, hasFile ? 'Change' : 'Upload', " File"), hasFile && this.renderClearButton());
        return /*#__PURE__*/ _react.default.createElement("div", {
            "data-field-name": path,
            "data-field-type": "file"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: label,
            htmlFor: path
        }, this.shouldRenderField() ? /*#__PURE__*/ _react.default.createElement("div", null, previews, buttons, /*#__PURE__*/ _react.default.createElement(_HiddenFileInput.default, {
            key: this.state.uploadFieldPath,
            name: this.state.uploadFieldPath,
            onChange: this.handleFileChange,
            ref: "fileInput"
        }), this.renderActionInput()) : /*#__PURE__*/ _react.default.createElement("div", null, hasFile ? this.renderFileNameAndChangeMessage() : /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, "no file")), !!note && /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            html: note
        })));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../components/FileChangeMessage.mjs":93,"../../components/HiddenFileInput.mjs":94,"../../components/ImageThumbnail.mjs":95,"../Field.mjs":105,"react":undefined}],141:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `CloudinaryImageFilter` component, which is used to
 * filter `File` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _CloudinaryImageFilter.default;
    }
});
const _CloudinaryImageFilter = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../cloudinaryimage/CloudinaryImageFilter.mjs":114}],142:[function(require,module,exports){
/**
 * @file
 * This file defines the `GeoPointColumn` component, which is used to render
 * the value of a `GeoPoint` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `GeoPointColumn` component.
 * @augments React.Component
 */ const GeoPointColumn = _react.default.createClass({
    displayName: 'GeoPointColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.length) return null;
        const formattedValue = `${value[1]}, ${value[0]}`;
        const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            title: formattedTitle,
            field: this.props.col.type
        }, formattedValue);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = GeoPointColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],143:[function(require,module,exports){
/**
 * @file
 * This file defines the `GeoPointField` component, which is used to render
 * a geopoint field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `GeoPointField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'GeopointField',
    statics: {
        type: 'Geopoint'
    },
    focusTargetRef: 'lat',
    /**
	 * Handles a change in the latitude value.
	 * @param {object} event The event object.
	 */ handleLat (event) {
        const { value = [], path, onChange } = this.props;
        const newVal = event.target.value;
        onChange({
            path,
            value: [
                value[0],
                newVal
            ]
        });
    },
    /**
	 * Handles a change in the longitude value.
	 * @param {object} event The event object.
	 */ handleLong (event) {
        const { value = [], path, onChange } = this.props;
        const newVal = event.target.value;
        onChange({
            path,
            value: [
                newVal,
                value[1]
            ]
        });
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const { value } = this.props;
        if (value && value[1] && value[0]) {
            return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                noedit: true
            }, value[1], ", ", value[0]);
        }
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, "(not set)");
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { value = [], path } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            xsmall: "one-half",
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(path + '[1]'),
            onChange: this.handleLat,
            placeholder: "Latitude",
            ref: "lat",
            value: value[1]
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            width: "one-half"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(path + '[0]'),
            onChange: this.handleLong,
            placeholder: "Longitude",
            ref: "lng",
            value: value[0]
        })));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],144:[function(require,module,exports){
/**
 * @file
 * This file defines the `GeoPointFilter` component, which is used to filter
 * `GeoPoint` fields in the KeystoneJS Admin UI.
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
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const DISTANCE_OPTIONS = [
    {
        label: 'Max distance (km)',
        value: 'max'
    },
    {
        label: 'Min distance (km)',
        value: 'min'
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        lat: undefined,
        lon: undefined,
        distance: {
            mode: DISTANCE_OPTIONS[0].value,
            value: undefined
        }
    };
}
/**
 * The `GeoPointFilter` component.
 * @augments React.Component
 */ const TextFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            lat: _react.default.PropTypes.number,
            lon: _react.default.PropTypes.number,
            distance: _react.default.PropTypes.shape({
                mode: _react.default.PropTypes.string,
                value: _react.default.PropTypes.number
            })
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Handles a change in the latitude value.
	 * @param {object} evt The event object.
	 */ changeLat (evt) {
        this.updateFilter({
            lat: evt.target.value
        });
    },
    /**
	 * Handles a change in the longitude value.
	 * @param {object} evt The event object.
	 */ changeLon (evt) {
        this.updateFilter({
            lon: evt.target.value
        });
    },
    /**
	 * Handles a change in the distance value.
	 * @param {object} evt The event object.
	 */ changeDistanceValue (evt) {
        this.updateFilter({
            distance: {
                mode: this.props.filter.distance.mode,
                value: evt.target.value
            }
        });
    },
    /**
	 * Handles a change in the distance mode.
	 * @param {string} mode The new distance mode.
	 */ changeDistanceMode (mode) {
        this.updateFilter({
            distance: {
                mode,
                value: this.props.filter.distance.value
            }
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        const distanceModeVerb = filter.distance.mode === 'max' ? 'Maximum' : 'Minimum';
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            xsmall: "one-half",
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: "Latitude"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: true,
            onChange: this.changeLat,
            placeholder: 'Latitude',
            ref: "latitude",
            required: "true",
            step: 0.01,
            type: "number",
            value: filter.lat
        }))), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: "Longitude"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            onChange: this.changeLon,
            placeholder: 'Longitude',
            ref: "longitude",
            required: "true",
            step: 0.01,
            type: "number",
            value: filter.lon
        })))), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.changeDistanceMode,
            options: DISTANCE_OPTIONS,
            value: this.props.filter.distance.mode
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            onChange: this.changeDistanceValue,
            placeholder: distanceModeVerb + ' distance from point',
            ref: "distance",
            type: "number",
            value: filter.distance.value
        }));
    },
    displayName: "TextFilter"
});
const _default = TextFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined}],145:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextColumn` component, which is used to render
 * the value of an `Html` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextColumn.default;
    }
});
const _TextColumn = /*#__PURE__*/ _interop_require_default(require("../text/TextColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextColumn.mjs":185}],146:[function(require,module,exports){
/**
 * @file
 * This file defines the `HtmlField` component, which is used to render an HTML
 * field in the KeystoneJS Admin UI.
 *
 * It provides a WYSIWYG editor for HTML, and it can be configured to show a
 * preview of the rendered HTML.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `HtmlField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _evalDependsOn = /*#__PURE__*/ _interop_require_default(require("../../utils/evalDependsOn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * TODO:
 * - Remove dependency on underscore
 */ let lastId = 0;
/**
 * Returns a unique ID for a component.
 * @returns {string} The unique ID.
 */ function getId() {
    return 'keystone-html-' + lastId++;
}
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
function getTinyMCE() {
    return typeof window === 'undefined' ? null : window.tinymce || null;
}
// Workaround for #2834 found here https://github.com/tinymce/tinymce/issues/794#issuecomment-203701329
function removeTinyMCEInstance(editor) {
    const tinymce1 = getTinyMCE();
    if (!tinymce1 || !editor) return;
    const oldLength = tinymce1.editors.length;
    tinymce1.remove(editor);
    if (oldLength === tinymce1.editors.length) {
        tinymce1.editors.remove(editor);
    }
}
const _default = _Field.default.create({
    displayName: 'HtmlField',
    statics: {
        type: 'Html'
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            id: getId(),
            isFocused: false,
            wysiwygActive: false
        };
    },
    /**
	 * Initializes the WYSIWYG editor.
	 */ initWysiwyg () {
        if (!this.props.wysiwyg) return;
        const tinymce1 = getTinyMCE();
        if (!tinymce1) return;
        const self = this;
        const opts = this.getOptions();
        opts.setup = function(editor) {
            self.editor = editor;
            editor.on('change', self.valueChanged);
            editor.on('focus', self.focusChanged.bind(self, true));
            editor.on('blur', self.focusChanged.bind(self, false));
        };
        this._currentValue = this.props.value;
        tinymce1.init(opts);
        if ((0, _evalDependsOn.default)(this.props.dependsOn, this.props.values)) {
            this.setState({
                wysiwygActive: true
            });
        }
    },
    /**
	 * Removes the WYSIWYG editor.
	 * @param {object} state The component's state.
	 */ removeWysiwyg (state) {
        removeTinyMCEInstance(tinymce.get(state.id));
        this.setState({
            wysiwygActive: false
        });
    },
    /**
	 * Handles the component updating.
	 * @param {object} prevProps The previous props.
	 * @param {object} prevState The previous state.
	 */ componentDidUpdate (prevProps, prevState) {
        if (prevState.isCollapsed && !this.state.isCollapsed) {
            this.initWysiwyg();
        }
        if (this.props.wysiwyg) {
            if ((0, _evalDependsOn.default)(this.props.dependsOn, this.props.values)) {
                if (!this.state.wysiwygActive) {
                    this.initWysiwyg();
                }
            } else if (this.state.wysiwygActive) {
                this.removeWysiwyg(prevState);
            }
        }
    },
    /**
	 * Initializes the WYSIWYG editor when the component mounts.
	 */ componentDidMount () {
        this.initWysiwyg();
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillReceiveProps (nextProps) {
        if (this.editor && this._currentValue !== nextProps.value) {
            this.editor.setContent(nextProps.value);
        }
    },
    /**
	 * Handles a change in the focus of the field.
	 * @param {boolean} focused Whether the field is focused.
	 */ focusChanged (focused) {
        this.setState({
            isFocused: focused
        });
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */ valueChanged (event) {
        let content;
        if (this.editor) {
            content = this.editor.getContent();
        } else {
            content = event.target.value;
        }
        this._currentValue = content;
        this.props.onChange({
            path: this.props.path,
            value: content
        });
    },
    /**
	 * Gets the options for the WYSIWYG editor.
	 * @returns {object} The options.
	 */ getOptions () {
        const plugins = [
            'code',
            'link'
        ];
        const options = Object.assign({}, Keystone.wysiwyg.options, this.props.wysiwyg);
        let toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
        let i;
        if (options.enableImages) {
            plugins.push('image');
            toolbar += ' | image';
        }
        if (options.enableCloudinaryUploads || options.enableS3Uploads) {
            plugins.push('uploadimage');
            toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
        }
        if (options.additionalButtons) {
            const additionalButtons = options.additionalButtons.split(',');
            for(i = 0; i < additionalButtons.length; i++){
                toolbar += ' | ' + additionalButtons[i];
            }
        }
        if (options.additionalPlugins) {
            const additionalPlugins = options.additionalPlugins.split(',');
            for(i = 0; i < additionalPlugins.length; i++){
                plugins.push(additionalPlugins[i]);
            }
        }
        if (options.importcss) {
            plugins.push('importcss');
            const importcssOptions = {
                content_css: options.importcss,
                importcss_append: true,
                importcss_merge_classes: true
            };
            Object.assign(options.additionalOptions, importcssOptions);
        }
        if (!options.overrideToolbar) {
            toolbar += ' | code';
        }
        const opts = {
            selector: '#' + this.state.id,
            toolbar: toolbar,
            plugins: plugins,
            menubar: options.menubar || false,
            skin: options.skin || 'keystone',
            branding: false
        };
        if (this.shouldRenderField()) {
            opts.uploadimage_form_url = options.enableS3Uploads ? `${getAdminApiPath()}/s3/upload` : `${getAdminApiPath()}/cloudinary/upload`;
        } else {
            Object.assign(opts, {
                mode: 'textareas',
                readonly: true,
                menubar: false,
                toolbar: 'code',
                statusbar: false
            });
        }
        if (options.additionalOptions) {
            Object.assign(opts, options.additionalOptions);
        }
        return opts;
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const className = this.state.isFocused ? 'is-focused' : '';
        const style = {
            height: this.props.height
        };
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: className
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            id: this.state.id,
            multiline: true,
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            className: this.props.wysiwyg ? 'wysiwyg' : 'code',
            style: style,
            value: this.props.value
        }));
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            multiline: true,
            noedit: true
        }, this.props.value);
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../utils/evalDependsOn.mjs":198,"../Field.mjs":105,"react":undefined}],147:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Html` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],148:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextColumn` component, which is used to render
 * the value of a `Key` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextColumn.default;
    }
});
const _TextColumn = /*#__PURE__*/ _interop_require_default(require("../text/TextColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextColumn.mjs":185}],149:[function(require,module,exports){
/**
 * @file
 * This file defines the `KeyField` component, which is used to render a key
 * field in the KeystoneJS Admin UI.
 *
 * It is a simple wrapper around the `Field` component.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `KeyField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'KeyField',
    statics: {
        type: 'Key'
    }
});

},{"../Field.mjs":105}],150:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Key` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],151:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = undefined;

},{}],152:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = undefined;

},{}],153:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = undefined;

},{}],154:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
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
const LocalFilesColumn = _react.default.createClass({
    renderValue: function() {
        const value = this.props.data.fields[this.props.col.path];
        if (value.length === 0) return '';
        const fileOrFiles = value.length > 1 ? 'Files' : 'File';
        return value.length + ' ' + fileOrFiles;
    },
    render: function() {
        return /*#__PURE__*/ _react.default.createElement("td", {
            className: "ItemList__col"
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "ItemList__value ItemList__value--local-files"
        }, this.renderValue()));
    },
    displayName: "LocalFilesColumn"
});
const _default = LocalFilesColumn;

},{"react":undefined}],155:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ /*
TODO: this file has been left as a reference for the new File type field.
Some features here, including size formatting and icons, may be ported across.
*/ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _bytes = /*#__PURE__*/ _interop_require_default(require("bytes"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const ICON_EXTS = [
    'aac',
    'ai',
    'aiff',
    'avi',
    'bmp',
    'c',
    'cpp',
    'css',
    'dat',
    'dmg',
    'doc',
    'dotx',
    'dwg',
    'dxf',
    'eps',
    'exe',
    'flv',
    'gif',
    'h',
    'hpp',
    'html',
    'ics',
    'iso',
    'java',
    'jpg',
    'js',
    'key',
    'less',
    'mid',
    'mp3',
    'mp4',
    'mpg',
    'odf',
    'ods',
    'odt',
    'otp',
    'ots',
    'ott',
    'pdf',
    'php',
    'png',
    'ppt',
    'psd',
    'py',
    'qt',
    'rar',
    'rb',
    'rtf',
    'sass',
    'scss',
    'sql',
    'tga',
    'tgz',
    'tiff',
    'txt',
    'wav',
    'xls',
    'xlsx',
    'xml',
    'yml',
    'zip'
];
const LocalFilesFieldItem = _react.default.createClass({
    propTypes: {
        deleted: _react.default.PropTypes.bool,
        filename: _react.default.PropTypes.string,
        isQueued: _react.default.PropTypes.bool,
        size: _react.default.PropTypes.number,
        toggleDelete: _react.default.PropTypes.func
    },
    renderActionButton () {
        if (!this.props.shouldRenderActionButton || this.props.isQueued) return null;
        const buttonLabel = this.props.deleted ? 'Undo' : 'Remove';
        const buttonType = this.props.deleted ? 'link' : 'link-cancel';
        return /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            key: "action-button",
            type: buttonType,
            onClick: this.props.toggleDelete
        }, buttonLabel);
    },
    render () {
        const { filename } = this.props;
        const ext = filename.split('.').pop();
        let iconName = '_blank';
        if (_lodash.default.includes(ICON_EXTS, ext)) iconName = ext;
        let note;
        if (this.props.deleted) {
            note = /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                key: "delete-note",
                noedit: true,
                className: "field-type-localfiles__note field-type-localfiles__note--delete"
            }, "save to delete");
        } else if (this.props.isQueued) {
            note = /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                key: "upload-note",
                noedit: true,
                className: "field-type-localfiles__note field-type-localfiles__note--upload"
            }, "save to upload");
        }
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement("img", {
            key: "file-type-icon",
            className: "file-icon",
            src: Keystone.adminLegacyPath + '/images/icons/32/' + iconName + '.png'
        }), /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            key: "file-name",
            noedit: true,
            className: "field-type-localfiles__filename"
        }, filename, this.props.size ? ' (' + (0, _bytes.default)(this.props.size) + ')' : null), note, this.renderActionButton());
    },
    displayName: "LocalFilesFieldItem"
});
let tempId = 0;
const _default = _Field.default.create({
    getInitialState () {
        const items = [];
        const self = this;
        _lodash.default.forEach(this.props.value, function(item) {
            self.pushItem(item, items);
        });
        return {
            items: items
        };
    },
    removeItem (id) {
        const thumbs = [];
        const self = this;
        _lodash.default.forEach(this.state.items, function(thumb) {
            const newProps = Object.assign({}, thumb.props);
            if (thumb.props._id === id) {
                newProps.deleted = !thumb.props.deleted;
            }
            self.pushItem(newProps, thumbs);
        });
        this.setState({
            items: thumbs
        });
    },
    pushItem (args, thumbs) {
        thumbs = thumbs || this.state.items;
        args.toggleDelete = this.removeItem.bind(this, args._id);
        args.shouldRenderActionButton = this.shouldRenderField();
        args.adminLegacyPath = Keystone.adminLegacyPath;
        thumbs.push(/*#__PURE__*/ _react.default.createElement(LocalFilesFieldItem, _object_spread({
            key: args._id || tempId++
        }, args)));
    },
    fileFieldNode () {
        return this.refs.fileField;
    },
    renderFileField () {
        return /*#__PURE__*/ _react.default.createElement("input", {
            ref: "fileField",
            type: "file",
            name: this.props.paths.upload,
            multiple: true,
            className: "field-upload",
            onChange: this.uploadFile,
            tabIndex: "-1"
        });
    },
    clearFiles () {
        this.fileFieldNode().value = '';
        this.setState({
            items: this.state.items.filter(function(thumb) {
                return !thumb.props.isQueued;
            })
        });
    },
    uploadFile (event) {
        const self = this;
        const files = event.target.files;
        _lodash.default.forEach(files, function(f) {
            self.pushItem({
                isQueued: true,
                filename: f.name
            });
            self.forceUpdate();
        });
    },
    changeFiles () {
        this.fileFieldNode().click();
    },
    hasFiles () {
        return this.refs.fileField && this.fileFieldNode().value;
    },
    renderToolbar () {
        if (!this.shouldRenderField()) return null;
        let clearFilesButton;
        if (this.hasFiles()) {
            clearFilesButton = /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
                type: "link-cancel",
                className: "ml-5",
                onClick: this.clearFiles
            }, "Clear Uploads");
        }
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "files-toolbar"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.changeFiles
        }, "Upload"), clearFilesButton);
    },
    renderPlaceholder () {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "file-field file-upload",
            onClick: this.changeFiles
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "file-preview"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "file-thumbnail"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "file-dropzone"
        }), /*#__PURE__*/ _react.default.createElement("div", {
            className: "ion-picture file-uploading"
        }))), /*#__PURE__*/ _react.default.createElement("div", {
            className: "file-details"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "file-message"
        }, "Click to upload")));
    },
    renderContainer () {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "files-container clearfix"
        }, this.state.items);
    },
    renderFieldAction () {
        let value = '';
        const remove = [];
        _lodash.default.forEach(this.state.items, function(thumb) {
            if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
        });
        if (remove.length) value = 'delete:' + remove.join(',');
        return /*#__PURE__*/ _react.default.createElement("input", {
            ref: "action",
            className: "field-action",
            type: "hidden",
            value: value,
            name: this.props.paths.action
        });
    },
    renderUploadsField () {
        return /*#__PURE__*/ _react.default.createElement("input", {
            ref: "uploads",
            className: "field-uploads",
            type: "hidden",
            name: this.props.paths.uploads
        });
    },
    renderNote: function() {
        if (!this.props.note) return null;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            html: this.props.note
        });
    },
    renderUI () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: this.props.label,
            className: "field-type-localfiles",
            htmlFor: this.props.path
        }, this.renderFieldAction(), this.renderUploadsField(), this.renderFileField(), this.renderContainer(), this.renderToolbar(), this.renderNote());
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"bytes":201,"lodash":undefined,"react":undefined}],156:[function(require,module,exports){
/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _CloudinaryImageFilter.default;
    }
});
const _CloudinaryImageFilter = /*#__PURE__*/ _interop_require_default(require("../cloudinaryimage/CloudinaryImageFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
 

},{"../cloudinaryimage/CloudinaryImageFilter.mjs":114}],157:[function(require,module,exports){
/**
 * @file
 * This file defines the `LocationColumn` component, which is used to render
 * the value of a `Location` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SUB_FIELDS = [
    'street1',
    'suburb',
    'state',
    'postcode',
    'country'
];
/**
 * The `LocationColumn` component.
 * @augments React.Component
 */ const LocationColumn = _react.default.createClass({
    displayName: 'LocationColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !Object.keys(value).length) return null;
        const output = [];
        SUB_FIELDS.map((i)=>{
            if (value[i]) {
                output.push(value[i]);
            }
        });
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type,
            title: output.join(', ')
        }, output.join(', '));
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = LocationColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],158:[function(require,module,exports){
/**
 * @file
 * This file defines the `LocationField` component, which is used to render a
 * location field in the KeystoneJS Admin UI.
 *
 * It provides a set of inputs for the different parts of a location, and it
 * can be configured to use the Google Maps API to improve the location data.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * TODO:
 * - Remove dependency on underscore
 * - Custom path support
 */ /**
 * The `LocationField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _CollapsedFieldLabel = /*#__PURE__*/ _interop_require_default(require("../../components/CollapsedFieldLabel.mjs"));
const _NestedFormField = /*#__PURE__*/ _interop_require_default(require("../../components/NestedFormField.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const _default = _Field.default.create({
    displayName: 'LocationField',
    statics: {
        type: 'Location'
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            collapsedFields: {},
            improve: false,
            overwrite: false
        };
    },
    /**
	 * Sets the initial collapsed state of the fields.
	 */ componentWillMount () {
        const { value = [] } = this.props;
        const collapsedFields = {};
        _lodash.default.forEach([
            'number',
            'name',
            'street2',
            'geo'
        ], (i)=>{
            if (!value[i]) {
                collapsedFields[i] = true;
            }
        }, this);
        this.setState({
            collapsedFields
        });
    },
    /**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */ shouldCollapse () {
        return this.props.collapse && !this.formatValue();
    },
    /**
	 * Uncollapses the fields.
	 */ uncollapseFields () {
        this.setState({
            collapsedFields: {}
        });
    },
    /**
	 * Handles a change in the value of one of the location fields.
	 * @param {string} fieldPath The path of the field that changed.
	 * @param {object} event The event object.
	 */ fieldChanged (fieldPath, event) {
        const { value = {}, path, onChange } = this.props;
        onChange({
            path,
            value: _object_spread_props(_object_spread({}, value), {
                [fieldPath]: event.target.value
            })
        });
    },
    /**
	 * Returns a function that handles a change in the value of a location field.
	 * @param {string} fieldPath The path of the field.
	 * @returns {function(object): void} The change handler.
	 */ makeChanger (fieldPath) {
        return this.fieldChanged.bind(this, fieldPath);
    },
    /**
	 * Handles a change in the value of one of the geo fields.
	 * @param {number} i The index of the geo field.
	 * @param {object} event The event object.
	 */ geoChanged (i, event) {
        const { value = {}, path, onChange } = this.props;
        const newVal = event.target.value;
        const geo = [
            i === 0 ? newVal : value.geo ? value.geo[0] : '',
            i === 1 ? newVal : value.geo ? value.geo[1] : ''
        ];
        onChange({
            path,
            value: _object_spread_props(_object_spread({}, value), {
                geo
            })
        });
    },
    /**
	 * Returns a function that handles a change in the value of a geo field.
	 * @param {number} fieldPath The index of the geo field.
	 * @returns {function(object): void} The change handler.
	 */ makeGeoChanger (fieldPath) {
        return this.geoChanged.bind(this, fieldPath);
    },
    /**
	 * Formats the value of the field.
	 * @returns {string} The formatted value.
	 */ formatValue () {
        const { value = {} } = this.props;
        return _lodash.default.compact([
            value.number,
            value.name,
            value.street1,
            value.street2,
            value.suburb,
            value.state,
            value.postcode,
            value.country
        ]).join(', ');
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, this.formatValue() || '');
    },
    /**
	 * Renders a single field.
	 * @param {string} fieldPath The path of the field.
	 * @param {string} label The label of the field.
	 * @param {boolean} collapse Whether the field should be collapsible.
	 * @param {boolean} autoFocus Whether the field should be focused.
	 * @returns {React.Element} The rendered field.
	 */ renderField (fieldPath, label, collapse, autoFocus) {
        if (this.state.collapsedFields[fieldPath]) {
            return null;
        }
        const { value = {}, path } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_NestedFormField.default, {
            label: label,
            "data-field-location-path": path + '.' + fieldPath
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: autoFocus,
            name: this.getInputName(path + '.' + fieldPath),
            onChange: this.makeChanger(fieldPath),
            placeholder: label,
            value: value[fieldPath] || ''
        }));
    },
    /**
	 * Renders the suburb and state fields.
	 * @returns {React.Element} The rendered fields.
	 */ renderSuburbState () {
        const { value = {}, path } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_NestedFormField.default, {
            label: "Suburb / State",
            "data-field-location-path": path + '.suburb_state'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "two-thirds",
            "data-field-location-path": path + '.suburb'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(path + '.suburb'),
            onChange: this.makeChanger('suburb'),
            placeholder: "Suburb",
            value: value.suburb || ''
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "one-third",
            "data-field-location-path": path + '.state'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(path + '.state'),
            onChange: this.makeChanger('state'),
            placeholder: "State",
            value: value.state || ''
        }))));
    },
    /**
	 * Renders the postcode and country fields.
	 * @returns {React.Element} The rendered fields.
	 */ renderPostcodeCountry () {
        const { value = {}, path } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_NestedFormField.default, {
            label: "Postcode / Country",
            "data-field-location-path": path + '.postcode_country'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "one-third",
            "data-field-location-path": path + '.postcode'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(path + '.postcode'),
            onChange: this.makeChanger('postcode'),
            placeholder: "Post Code",
            value: value.postcode || ''
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "two-thirds",
            "data-field-location-path": path + '.country'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(path + '.country'),
            onChange: this.makeChanger('country'),
            placeholder: "Country",
            value: value.country || ''
        }))));
    },
    /**
	 * Renders the geo fields.
	 * @returns {React.Element} The rendered fields.
	 */ renderGeo () {
        if (this.state.collapsedFields.geo) {
            return null;
        }
        const { value = {}, path, paths } = this.props;
        const geo = value.geo || [];
        return /*#__PURE__*/ _react.default.createElement(_NestedFormField.default, {
            label: "Lat / Lng",
            "data-field-location-path": path + '.geo'
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "one-half",
            "data-field-location-path": "latitude"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(paths.geo + '[1]'),
            onChange: this.makeGeoChanger(1),
            placeholder: "Latitude",
            value: geo[1] || ''
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            small: "one-half",
            "data-field-location-path": "longitude"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: this.getInputName(paths.geo + '[0]'),
            onChange: this.makeGeoChanger(0),
            placeholder: "Longitude",
            value: geo[0] || ''
        }))));
    },
    /**
	 * Handles a change in the value of one of the Google options.
	 * @param {string} key The key of the option that changed.
	 * @param {object} e The event object.
	 */ updateGoogleOption (key, e) {
        const newState = {};
        newState[key] = e.target.checked;
        this.setState(newState);
    },
    /**
	 * Returns a function that handles a change in the value of a Google option.
	 * @param {string} key The key of the option.
	 * @returns {function(object): void} The change handler.
	 */ makeGoogler (key) {
        return this.updateGoogleOption.bind(this, key);
    },
    /**
	 * Renders the Google options.
	 * @returns {React.Element} The rendered options.
	 */ renderGoogleOptions () {
        const { paths, enableMapsAPI } = this.props;
        if (!enableMapsAPI) return null;
        const replace = this.state.improve ? /*#__PURE__*/ _react.default.createElement(_elemental.LabelledControl, {
            checked: this.state.overwrite,
            label: "Replace existing data",
            name: this.getInputName(paths.overwrite),
            onChange: this.makeGoogler('overwrite'),
            type: "checkbox"
        }) : null;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            offsetAbsentLabel: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.LabelledControl, {
            checked: this.state.improve,
            label: "Autodetect and improve location on save",
            name: this.getInputName(paths.improve),
            onChange: this.makeGoogler('improve'),
            title: "When checked, this will attempt to fill missing fields. It will also get the lat/long",
            type: "checkbox"
        }), replace);
    },
    /**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */ renderNote () {
        const { note } = this.props;
        if (!note) return null;
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            offsetAbsentLabel: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            note: note
        }));
    },
    /**
	 * Renders the UI.
	 * @returns {React.Element} The rendered UI.
	 */ renderUI () {
        if (!this.shouldRenderField()) {
            return /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
                label: this.props.label
            }, this.renderValue());
        }
        const showMore = !_lodash.default.isEmpty(this.state.collapsedFields) ? /*#__PURE__*/ _react.default.createElement(_CollapsedFieldLabel.default, {
            onClick: this.uncollapseFields
        }, "(show more fields)") : null;
        const { label, path } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", {
            "data-field-name": path,
            "data-field-type": "location"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            label: label,
            htmlFor: path
        }, showMore), this.renderField('number', 'PO Box / Shop', true, true), this.renderField('name', 'Building Name', true), this.renderField('street1', 'Street Address'), this.renderField('street2', 'Street Address 2', true), this.renderSuburbState(), this.renderPostcodeCountry(), this.renderGeo(), this.renderGoogleOptions(), this.renderNote());
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../components/CollapsedFieldLabel.mjs":91,"../../components/NestedFormField.mjs":99,"../Field.mjs":105,"lodash":undefined,"react":undefined}],159:[function(require,module,exports){
/**
 * @file
 * This file defines the `LocationFilter` component, which is used to filter
 * `Location` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of inputs for the different parts of a location, and it
 * supports inverting the filter.
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
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const INVERTED_OPTIONS = [
    {
        label: 'Matches',
        value: false
    },
    {
        label: 'Does NOT Match',
        value: true
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        inverted: INVERTED_OPTIONS[0].value,
        street: undefined,
        city: undefined,
        state: undefined,
        code: undefined,
        country: undefined
    };
}
/**
 * The `LocationFilter` component.
 * @augments React.Component
 */ const TextFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            inverted: _react.default.PropTypes.boolean,
            street: _react.default.PropTypes.string,
            city: _react.default.PropTypes.string,
            state: _react.default.PropTypes.string,
            code: _react.default.PropTypes.string,
            country: _react.default.PropTypes.string
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {string} key The key of the value to update.
	 * @param {string|boolean} val The new value.
	 */ updateFilter (key, val) {
        const update = {};
        update[key] = val;
        this.props.onChange(Object.assign(this.props.filter, update));
    },
    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */ toggleInverted (value) {
        this.updateFilter('inverted', value);
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Handles a change in the value of one of the filter fields.
	 * @param {object} e The event object.
	 */ updateValue (e) {
        this.updateFilter(e.target.name, e.target.value);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleInverted,
            options: INVERTED_OPTIONS,
            value: filter.inverted
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: true,
            name: "street",
            onChange: this.updateValue,
            placeholder: "Address",
            ref: "focusTarget",
            value: filter.street
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            xsmall: "two-thirds"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: "city",
            onChange: this.updateValue,
            placeholder: "City",
            style: {
                marginBottom: '1em'
            },
            value: filter.city
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            xsmall: "one-third"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: "state",
            onChange: this.updateValue,
            placeholder: "State",
            style: {
                marginBottom: '1em'
            },
            value: filter.state
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            xsmall: "one-third",
            style: {
                marginBottom: 0
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: "code",
            onChange: this.updateValue,
            placeholder: "Postcode",
            value: filter.code
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, {
            xsmall: "two-thirds",
            style: {
                marginBottom: 0
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            name: "country",
            onChange: this.updateValue,
            placeholder: "Country",
            value: filter.country
        }))));
    },
    displayName: "TextFilter"
});
const _default = TextFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined,"react-dom":undefined}],160:[function(require,module,exports){
/**
 * @file
 * This file defines the `MarkdownColumn` component, which is used to render the
 * value of a `Markdown` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `MarkdownColumn` component.
 * @augments React.Component
 */ const MarkdownColumn = _react.default.createClass({
    displayName: 'MarkdownColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {string} The value of the field.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        return value && Object.keys(value).length ? value.md.slice(0, 100) : null;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, this.renderValue()));
    }
});
const _default = MarkdownColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],161:[function(require,module,exports){
(function (global){(function (){
/**
 * @file
 * This file defines the `MarkdownField` component, which is used to render a
 * markdown field in the KeystoneJS Admin UI.
 *
 * It provides a WYSIWYG editor for markdown, and it can be configured to
 * show a preview of the rendered HTML.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `MarkdownField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _jquery = /*#__PURE__*/ _interop_require_default((typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null));
require("./lib/bootstrap-markdown.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Toggles a heading on the selected text.
 * @param {object} e The event object.
 * @param {string} level The heading level.
 */ // Append/remove ### surround the selection
// Source: https://github.com/toopay/bootstrap-markdown/blob/master/js/bootstrap-markdown.js#L909
const toggleHeading = function(e, level) {
    let chunk;
    let cursor;
    const selected = e.getSelection();
    const content = e.getContent();
    let pointer;
    let prevChar;
    if (selected.length === 0) {
        // Give extra word
        chunk = e.__localize('heading text');
    } else {
        chunk = selected.text + '\n';
    }
    // transform selection and set the cursor into chunked text
    if ((pointer = level.length + 1, content.slice(selected.start - pointer, selected.start) === level + ' ') || (pointer = level.length, content.slice(selected.start - pointer, selected.start) === level)) {
        e.setSelection(selected.start - pointer, selected.end);
        e.replaceSelection(chunk);
        cursor = selected.start - pointer;
    } else if (selected.start > 0 && (prevChar = content.slice(selected.start - 1, selected.start), !!prevChar && prevChar !== '\n')) {
        e.replaceSelection('\n\n' + level + ' ' + chunk);
        cursor = selected.start + level.length + 3;
    } else {
        // Empty string before element
        e.replaceSelection(level + ' ' + chunk);
        cursor = selected.start + level.length + 1;
    }
    // Set the cursor
    e.setSelection(cursor, cursor + chunk.length);
};
/**
 * Renders the markdown editor.
 * @param {React.Component} component The component to render the editor on.
 */ const renderMarkdown = function(component) {
    // dependsOn means that sometimes the component is mounted as a null, so account for that & noop
    if (!component.refs.markdownTextarea) {
        return;
    }
    const options = {
        autofocus: false,
        savable: false,
        resize: 'vertical',
        height: component.props.height,
        hiddenButtons: [
            'Heading'
        ],
        // Heading buttons
        additionalButtons: [
            {
                name: 'groupHeaders',
                data: [
                    {
                        name: 'cmdH1',
                        title: 'Heading 1',
                        btnText: 'H1',
                        callback: function(e) {
                            toggleHeading(e, '#');
                        }
                    },
                    {
                        name: 'cmdH2',
                        title: 'Heading 2',
                        btnText: 'H2',
                        callback: function(e) {
                            toggleHeading(e, '##');
                        }
                    },
                    {
                        name: 'cmdH3',
                        title: 'Heading 3',
                        btnText: 'H3',
                        callback: function(e) {
                            toggleHeading(e, '###');
                        }
                    },
                    {
                        name: 'cmdH4',
                        title: 'Heading 4',
                        btnText: 'H4',
                        callback: function(e) {
                            toggleHeading(e, '####');
                        }
                    }
                ]
            }
        ],
        // Insert Header buttons into the toolbar
        reorderButtonGroups: [
            'groupFont',
            'groupHeaders',
            'groupLink',
            'groupMisc',
            'groupUtil'
        ]
    };
    if (component.props.toolbarOptions.hiddenButtons) {
        const hiddenButtons = typeof component.props.toolbarOptions.hiddenButtons === 'string' ? component.props.toolbarOptions.hiddenButtons.split(',') : component.props.toolbarOptions.hiddenButtons;
        options.hiddenButtons = options.hiddenButtons.concat(hiddenButtons);
    }
    (0, _jquery.default)(component.refs.markdownTextarea).markdown(options);
};
/**
 * Escapes HTML for rendering.
 * @param {string} html The HTML to escape.
 * @returns {string} The escaped HTML.
 */ // Simple escaping of html tags and replacing newlines for displaying the raw markdown string within an html doc
const escapeHtmlForRender = function(html) {
    return html.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\n/g, '<br />');
};
const _default = _Field.default.create({
    displayName: 'MarkdownField',
    statics: {
        type: 'Markdown',
        getDefaultValue: ()=>({})
    },
    /**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */ // override `shouldCollapse` to check the markdown field correctly
    shouldCollapse () {
        return this.props.collapse && !this.props.value.md;
    },
    /**
	 * Renders the markdown editor when the component mounts.
	 */ // only have access to `refs` once component is mounted
    componentDidMount () {
        if (this.props.wysiwyg) {
            renderMarkdown(this);
        }
    },
    /**
	 * Renders the markdown editor when the component updates.
	 */ // only have access to `refs` once component is mounted
    componentDidUpdate () {
        if (this.props.wysiwyg) {
            renderMarkdown(this);
        }
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const styles = {
            padding: 8,
            height: this.props.height
        };
        const defaultValue = this.props.value !== undefined && this.props.value.md !== undefined ? this.props.value.md : '';
        return /*#__PURE__*/ _react.default.createElement("textarea", {
            className: "md-editor__input code",
            defaultValue: defaultValue,
            name: this.getInputName(this.props.paths.md),
            ref: "markdownTextarea",
            style: styles
        });
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        // We want to render the raw markdown string, without parsing it to html
        // The markdown string *itself* may include html though so we need to escape it first
        const innerHtml = this.props.value && this.props.value.md ? escapeHtmlForRender(this.props.value.md) : '';
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            dangerouslySetInnerHTML: {
                __html: innerHtml
            },
            multiline: true,
            noedit: true
        });
    }
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"./lib/bootstrap-markdown.mjs":163,"react":undefined}],162:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Markdown` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],163:[function(require,module,exports){
(function (global){(function (){
/**
 * @fileoverview
 * This file is a third-party library, bootstrap-markdown.js.
 *
 * It is used to provide a WYSIWYG editor for markdown fields.
 *
 * @see https://github.com/toopay/bootstrap-markdown
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _jquery = /*#__PURE__*/ _interop_require_default((typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null));
const _marked = require("marked");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* ===================================================
* bootstrap-markdown.js v2.7.0
* http://github.com/toopay/bootstrap-markdown
* ===================================================
* Copyright 2013-2014 Taufan Aditya
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ========================================================== */ /* MARKDOWN CLASS DEFINITION
 * ========================== */ var Markdown = function(element, options) {
    // Class Properties
    this.$ns = 'bootstrap-markdown';
    this.$element = (0, _jquery.default)(element);
    this.$editable = {
        el: null,
        type: null,
        attrKeys: [],
        attrValues: [],
        content: null
    };
    this.$options = _jquery.default.extend(true, {}, _jquery.default.fn.markdown.defaults, options, this.$element.data(), this.$element.data('options'));
    this.$oldContent = null;
    this.$isPreview = false;
    this.$isFullscreen = false;
    this.$editor = null;
    this.$textarea = null;
    this.$handler = [];
    this.$callback = [];
    this.$nextTab = [];
    this.showEditor();
};
Markdown.prototype = {
    constructor: Markdown,
    __alterButtons: function(name, alter) {
        var handler = this.$handler, isAll = name == 'all', that = this;
        _jquery.default.each(handler, function(k, v) {
            var halt = true;
            if (isAll) {
                halt = false;
            } else {
                halt = v.indexOf(name) < 0;
            }
            if (halt == false) {
                alter(that.$editor.find('button[data-handler="' + v + '"]'));
            }
        });
    },
    __buildButtons: function(buttonsArray, container) {
        var i, ns = this.$ns, handler = this.$handler, callback = this.$callback;
        for(i = 0; i < buttonsArray.length; i++){
            // Build each group container
            var y, btnGroups = buttonsArray[i];
            for(y = 0; y < btnGroups.length; y++){
                // Build each button group
                var z, buttons = btnGroups[y].data, btnGroupContainer = (0, _jquery.default)('<div/>', {
                    'class': 'md-editor__btn-group'
                });
                for(z = 0; z < buttons.length; z++){
                    var button = buttons[z], buttonContainer, buttonIconContainer, buttonHandler = ns + '-' + button.name, buttonIcon = this.__getIcon(button.icon), btnText = button.btnText ? button.btnText : '', btnClass = button.btnClass ? button.btnClass : 'md-editor__btn', tabIndex = button.tabIndex ? button.tabIndex : '-1', hotkey = typeof button.hotkey !== 'undefined' ? button.hotkey : '', hotkeyCaption = typeof jQuery.hotkeys !== 'undefined' && hotkey !== '' ? ' (' + hotkey + ')' : '';
                    // Construct the button object
                    buttonContainer = (0, _jquery.default)('<button></button>');
                    buttonContainer.text(' ' + this.__localize(btnText)).addClass('md-editor__btn').addClass(btnClass);
                    if (btnClass.match(/md-editor__btn\--(primary|success|info|warning|danger|link)/)) {
                        buttonContainer.removeClass('md-editor__btn');
                    }
                    buttonContainer.attr({
                        'type': 'button',
                        'title': this.__localize(button.title) + hotkeyCaption,
                        'tabindex': tabIndex,
                        'data-provider': ns,
                        'data-handler': buttonHandler,
                        'data-hotkey': hotkey
                    });
                    if (button.toggle == true) {
                        buttonContainer.attr('data-toggle', 'button');
                    }
                    buttonIconContainer = (0, _jquery.default)('<span/>');
                    buttonIconContainer.addClass(buttonIcon);
                    buttonIconContainer.prependTo(buttonContainer);
                    // Attach the button object
                    btnGroupContainer.append(buttonContainer);
                    // Register handler and callback
                    handler.push(buttonHandler);
                    callback.push(button.callback);
                }
                // Attach the button group into container dom
                container.append(btnGroupContainer);
            }
        }
        return container;
    },
    __setListener: function() {
        // Set size and resizable Properties
        var hasRows = typeof this.$textarea.attr('rows') != 'undefined', maxRows = this.$textarea.val().split("\n").length > 5 ? this.$textarea.val().split("\n").length : '5', rowsVal = hasRows ? this.$textarea.attr('rows') : maxRows;
        this.$textarea.attr('rows', rowsVal);
        if (this.$options.resize) {
            this.$textarea.css('resize', this.$options.resize);
        }
        this.$textarea.on('focus', _jquery.default.proxy(this.focus, this)).on('keypress', _jquery.default.proxy(this.keypress, this)).on('keyup', _jquery.default.proxy(this.keyup, this)).on('change', _jquery.default.proxy(this.change, this));
        if (this.eventSupported('keydown')) {
            this.$textarea.on('keydown', _jquery.default.proxy(this.keydown, this));
        }
        // Re-attach markdown data
        this.$textarea.data('markdown', this);
    },
    __handle: function(e) {
        var target = (0, _jquery.default)(e.currentTarget), handler = this.$handler, callback = this.$callback, handlerName = target.attr('data-handler'), callbackIndex = handler.indexOf(handlerName), callbackHandler = callback[callbackIndex];
        // Trigger the focusin
        (0, _jquery.default)(e.currentTarget).focus();
        callbackHandler(this);
        // Trigger onChange for each button handle
        this.change(this);
        // Unless it was the save handler,
        // focusin the textarea
        if (handlerName.indexOf('cmdSave') < 0) {
            this.$textarea.focus();
        }
        e.preventDefault();
    },
    __localize: function(string) {
        var messages = _jquery.default.fn.markdown.messages, language = this.$options.language;
        if (typeof messages !== 'undefined' && typeof messages[language] !== 'undefined' && typeof messages[language][string] !== 'undefined') {
            return messages[language][string];
        }
        return string;
    },
    __getIcon: function(src) {
        return typeof src == 'object' ? src[this.$options.iconlibrary] : src;
    },
    setFullscreen: function(mode) {
        var $editor = this.$editor, $textarea = this.$textarea;
        if (mode === true) {
            $editor.addClass('md-fullscreen-mode');
            (0, _jquery.default)('body').addClass('md-editor--no-overflow');
            this.$options.onFullscreen(this);
        } else {
            $editor.removeClass('md-fullscreen-mode');
            (0, _jquery.default)('body').removeClass('md-editor--no-overflow');
        }
        this.$isFullscreen = mode;
        $textarea.focus();
    },
    showEditor: function() {
        var instance = this, textarea, ns = this.$ns, container = this.$element, originalHeigth = container.css('height'), originalWidth = container.css('width'), editable = this.$editable, handler = this.$handler, callback = this.$callback, options = this.$options, editor = (0, _jquery.default)('<div/>', {
            'class': 'md-editor',
            click: function() {
                instance.focus();
            }
        });
        // Prepare the editor
        if (this.$editor == null) {
            // Create the panel
            var editorHeader = (0, _jquery.default)('<div/>', {
                'class': 'md-editor__header btn-toolbar'
            });
            // Merge the main & additional button groups together
            var allBtnGroups = [];
            if (options.buttons.length > 0) allBtnGroups = allBtnGroups.concat(options.buttons[0]);
            if (options.additionalButtons.length > 0) allBtnGroups = allBtnGroups.concat(options.additionalButtons[0]);
            // Reduce and/or reorder the button groups
            if (options.reorderButtonGroups.length > 0) {
                allBtnGroups = allBtnGroups.filter(function(btnGroup) {
                    return options.reorderButtonGroups.indexOf(btnGroup.name) > -1;
                }).sort(function(a, b) {
                    if (options.reorderButtonGroups.indexOf(a.name) < options.reorderButtonGroups.indexOf(b.name)) return -1;
                    if (options.reorderButtonGroups.indexOf(a.name) > options.reorderButtonGroups.indexOf(b.name)) return 1;
                    return 0;
                });
            }
            // Build the buttons
            if (allBtnGroups.length > 0) {
                editorHeader = this.__buildButtons([
                    allBtnGroups
                ], editorHeader);
            }
            if (options.fullscreen.enable) {
                editorHeader.append('<div class="md-controls"><a class="md-control md-control-fullscreen" href="javascript:;" tabIndex="-1"><span class="' + this.__getIcon(options.fullscreen.icons.fullscreenOn) + '"></span></a></div>').on('click', '.md-control-fullscreen', function(e) {
                    e.preventDefault();
                    instance.setFullscreen(true);
                });
            }
            editor.append(editorHeader);
            // Wrap the textarea
            if (container.is('textarea')) {
                container.before(editor);
                textarea = container;
                textarea.addClass('md-input');
                editor.append(textarea);
            } else {
                var rawContent = typeof toMarkdown == 'function' ? toMarkdown(container.html()) : container.html(), currentContent = _jquery.default.trim(rawContent);
                // This is some arbitrary content that could be edited
                textarea = (0, _jquery.default)('<textarea/>', {
                    'class': 'md-input',
                    'val': currentContent
                });
                editor.append(textarea);
                // Save the editable
                editable.el = container;
                editable.type = container.prop('tagName').toLowerCase();
                editable.content = container.html();
                (0, _jquery.default)(container[0].attributes).each(function() {
                    editable.attrKeys.push(this.nodeName);
                    editable.attrValues.push(this.nodeValue);
                });
                // Set editor to blocked the original container
                container.replaceWith(editor);
            }
            var editorFooter = (0, _jquery.default)('<div/>', {
                'class': 'md-footer'
            }), createFooter = false, footer = '';
            // Create the footer if savable
            if (options.savable) {
                createFooter = true;
                var saveHandler = 'cmdSave';
                // Register handler and callback
                handler.push(saveHandler);
                callback.push(options.onSave);
                editorFooter.append('<button class="btn btn-success" data-provider="' + ns + '" data-handler="' + saveHandler + '"><i class="icon icon-white icon-ok"></i> ' + this.__localize('Save') + '</button>');
            }
            footer = typeof options.footer === 'function' ? options.footer(this) : options.footer;
            if (_jquery.default.trim(footer) !== '') {
                createFooter = true;
                editorFooter.append(footer);
            }
            if (createFooter) editor.append(editorFooter);
            // Set width
            if (options.width && options.width !== 'inherit') {
                if (jQuery.isNumeric(options.width)) {
                    editor.css('display', 'table');
                    textarea.css('width', options.width + 'px');
                } else {
                    editor.addClass(options.width);
                }
            }
            // Set height
            if (options.height && options.height !== 'inherit') {
                if (jQuery.isNumeric(options.height)) {
                    var height = options.height;
                    if (editorHeader) height = Math.max(0, height - editorHeader.outerHeight());
                    if (editorFooter) height = Math.max(0, height - editorFooter.outerHeight());
                    textarea.css('height', height + 'px');
                } else {
                    editor.addClass(options.height);
                }
            }
            // Reference
            this.$editor = editor;
            this.$textarea = textarea;
            this.$editable = editable;
            this.$oldContent = this.getContent();
            this.__setListener();
            // Set editor attributes, data short-hand API and listener
            this.$editor.attr('id', (new Date).getTime());
            this.$editor.on('click', '[data-provider="bootstrap-markdown"]', _jquery.default.proxy(this.__handle, this));
            if (this.$element.is(':disabled') || this.$element.is('[readonly]')) {
                this.$editor.addClass('md-editor-disabled');
                this.disableButtons('all');
            }
            if (this.eventSupported('keydown') && typeof jQuery.hotkeys === 'object') {
                editorHeader.find('[data-provider="bootstrap-markdown"]').each(function() {
                    var $button = (0, _jquery.default)(this), hotkey = $button.attr('data-hotkey');
                    if (hotkey.toLowerCase() !== '') {
                        textarea.bind('keydown', hotkey, function() {
                            $button.trigger('click');
                            return false;
                        });
                    }
                });
            }
            if (options.initialstate === 'preview') {
                this.showPreview();
            } else if (options.initialstate === 'fullscreen' && options.fullscreen.enable) {
                this.setFullscreen(true);
            }
        } else {
            this.$editor.show();
        }
        if (options.autofocus) {
            this.$textarea.focus();
            this.$editor.addClass('active');
        }
        if (options.fullscreen.enable && options.fullscreen !== false) {
            this.$editor.append('\
				<div class="md-fullscreen-controls">\
					<a href="#" class="exit-fullscreen" title="Exit fullscreen"><span class="' + this.__getIcon(options.fullscreen.icons.fullscreenOff) + '"></span></a>\
				</div>');
            this.$editor.on('click', '.exit-fullscreen', function(e) {
                e.preventDefault();
                instance.setFullscreen(false);
            });
        }
        // hide hidden buttons from options
        this.hideButtons(options.hiddenButtons);
        // disable disabled buttons from options
        this.disableButtons(options.disabledButtons);
        // Trigger the onShow hook
        options.onShow(this);
        return this;
    },
    parseContent: function() {
        var content, callbackContent = this.$options.onPreview(this); // Try to get the content from callback
        if (typeof callbackContent == 'string') {
            // Set the content based by callback content
            content = callbackContent;
        } else {
            // Set the content
            var val = this.$textarea.val();
            if (typeof markdown == 'object') {
                content = markdown.toHTML(val);
            } else if (typeof _marked.marked == 'function') {
                content = (0, _marked.marked)(val);
            } else {
                content = val;
            }
        }
        return content;
    },
    showPreview: function() {
        var options = this.$options, container = this.$textarea, afterContainer = container.next(), replacementContainer = (0, _jquery.default)('<div/>', {
            'class': 'md-editor__preview',
            'data-provider': 'markdown-preview'
        }), content;
        // Give flag that tell the editor enter preview mode
        this.$isPreview = true;
        // Disable all buttons
        this.disableButtons('all').enableButtons('cmdPreview');
        content = this.parseContent();
        // Build preview element
        replacementContainer.html(content);
        if (afterContainer && afterContainer.attr('class') == 'md-footer') {
            // If there is footer element, insert the preview container before it
            replacementContainer.insertBefore(afterContainer);
        } else {
            // Otherwise, just append it after textarea
            container.parent().append(replacementContainer);
        }
        // Set the preview element dimensions
        replacementContainer.css({
            width: container.outerWidth() + 'px',
            height: container.outerHeight() + 'px'
        });
        if (this.$options.resize) {
            replacementContainer.css('resize', this.$options.resize);
        }
        // Hide the last-active textarea
        container.hide();
        // Attach the editor instances
        replacementContainer.data('markdown', this);
        if (this.$element.is(':disabled') || this.$element.is('[readonly]')) {
            this.$editor.addClass('md-editor-disabled');
            this.disableButtons('all');
        }
        return this;
    },
    hidePreview: function() {
        // Give flag that tell the editor quit preview mode
        this.$isPreview = false;
        // Obtain the preview container
        var container = this.$editor.find('div[data-provider="markdown-preview"]');
        // Remove the preview container
        container.remove();
        // Enable all buttons
        this.enableButtons('all');
        // Disable configured disabled buttons
        this.disableButtons(this.$options.disabledButtons);
        // Back to the editor
        this.$textarea.show();
        this.__setListener();
        return this;
    },
    isDirty: function() {
        return this.$oldContent != this.getContent();
    },
    getContent: function() {
        return this.$textarea.val();
    },
    setContent: function(content) {
        this.$textarea.val(content);
        return this;
    },
    findSelection: function(chunk) {
        var content = this.getContent(), startChunkPosition;
        if (startChunkPosition = content.indexOf(chunk), startChunkPosition >= 0 && chunk.length > 0) {
            var oldSelection = this.getSelection(), selection;
            this.setSelection(startChunkPosition, startChunkPosition + chunk.length);
            selection = this.getSelection();
            this.setSelection(oldSelection.start, oldSelection.end);
            return selection;
        } else {
            return null;
        }
    },
    getSelection: function() {
        var e = this.$textarea[0];
        return ('selectionStart' in e && function() {
            var l = e.selectionEnd - e.selectionStart;
            return {
                start: e.selectionStart,
                end: e.selectionEnd,
                length: l,
                text: e.value.substr(e.selectionStart, l)
            };
        } || /* browser not supported */ function() {
            return null;
        })();
    },
    setSelection: function(start, end) {
        var e = this.$textarea[0];
        return ('selectionStart' in e && function() {
            e.selectionStart = start;
            e.selectionEnd = end;
            return;
        } || /* browser not supported */ function() {
            return null;
        })();
    },
    replaceSelection: function(text) {
        var e = this.$textarea[0];
        return ('selectionStart' in e && function() {
            e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
            // Set cursor to the last replacement end
            e.selectionStart = e.value.length;
            return this;
        } || /* browser not supported */ function() {
            e.value += text;
            return jQuery(e);
        })();
    },
    getNextTab: function() {
        // Shift the nextTab
        if (this.$nextTab.length == 0) {
            return null;
        } else {
            var nextTab, tab = this.$nextTab.shift();
            if (typeof tab == 'function') {
                nextTab = tab();
            } else if (typeof tab == 'object' && tab.length > 0) {
                nextTab = tab;
            }
            return nextTab;
        }
    },
    setNextTab: function(start, end) {
        // Push new selection into nextTab collections
        if (typeof start == 'string') {
            var that = this;
            this.$nextTab.push(function() {
                return that.findSelection(start);
            });
        } else if (typeof start == 'number' && typeof end == 'number') {
            var oldSelection = this.getSelection();
            this.setSelection(start, end);
            this.$nextTab.push(this.getSelection());
            this.setSelection(oldSelection.start, oldSelection.end);
        }
        return;
    },
    __parseButtonNameParam: function(nameParam) {
        var buttons = [];
        if (typeof nameParam == 'string') {
            buttons.push(nameParam);
        } else {
            buttons = nameParam;
        }
        return buttons;
    },
    enableButtons: function(name) {
        var buttons = this.__parseButtonNameParam(name), that = this;
        _jquery.default.each(buttons, function(i, v) {
            that.__alterButtons(buttons[i], function(el) {
                el.removeAttr('disabled');
            });
        });
        return this;
    },
    disableButtons: function(name) {
        var buttons = this.__parseButtonNameParam(name), that = this;
        _jquery.default.each(buttons, function(i, v) {
            that.__alterButtons(buttons[i], function(el) {
                el.attr('disabled', 'disabled');
            });
        });
        return this;
    },
    hideButtons: function(name) {
        var buttons = this.__parseButtonNameParam(name), that = this;
        _jquery.default.each(buttons, function(i, v) {
            that.__alterButtons(buttons[i], function(el) {
                el.addClass('hidden');
            });
        });
        return this;
    },
    showButtons: function(name) {
        var buttons = this.__parseButtonNameParam(name), that = this;
        _jquery.default.each(buttons, function(i, v) {
            that.__alterButtons(buttons[i], function(el) {
                el.removeClass('hidden');
            });
        });
        return this;
    },
    eventSupported: function(eventName) {
        var isSupported = eventName in this.$element;
        if (!isSupported) {
            this.$element.setAttribute(eventName, 'return;');
            isSupported = typeof this.$element[eventName] === 'function';
        }
        return isSupported;
    },
    keyup: function(e) {
        var blocked = false;
        switch(e.keyCode){
            case 40:
            case 38:
            case 16:
            case 17:
            case 18:
                break;
            case 9:
                var nextTab;
                if (nextTab = this.getNextTab(), nextTab != null) {
                    // Get the nextTab if exists
                    var that = this;
                    setTimeout(function() {
                        that.setSelection(nextTab.start, nextTab.end);
                    }, 500);
                    blocked = true;
                } else {
                    // The next tab memory contains nothing...
                    // check the cursor position to determine tab action
                    var cursor = this.getSelection();
                    if (cursor.start == cursor.end && cursor.end == this.getContent().length) {
                        // The cursor already reach the end of the content
                        blocked = false;
                    } else {
                        // Put the cursor to the end
                        this.setSelection(this.getContent().length, this.getContent().length);
                        blocked = true;
                    }
                }
                break;
            case 13:
                blocked = false;
                break;
            case 27:
                if (this.$isFullscreen) this.setFullscreen(false);
                blocked = false;
                break;
            default:
                blocked = false;
        }
        if (blocked) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$options.onChange(this);
    },
    change: function(e) {
        this.$options.onChange(this);
        return this;
    },
    focus: function(e) {
        var options = this.$options, isHideable = options.hideable, editor = this.$editor;
        editor.addClass('active');
        // Blur other markdown(s)
        (0, _jquery.default)(document).find('.md-editor').each(function() {
            if ((0, _jquery.default)(this).attr('id') != editor.attr('id')) {
                var attachedMarkdown;
                if (attachedMarkdown = (0, _jquery.default)(this).find('textarea').data('markdown'), attachedMarkdown == null) {
                    attachedMarkdown = (0, _jquery.default)(this).find('div[data-provider="markdown-preview"]').data('markdown');
                }
                if (attachedMarkdown) {
                    attachedMarkdown.blur();
                }
            }
        });
        // Trigger the onFocus hook
        options.onFocus(this);
        return this;
    },
    blur: function(e) {
        var options = this.$options, isHideable = options.hideable, editor = this.$editor, editable = this.$editable;
        if (editor.hasClass('active') || this.$element.parent().length == 0) {
            editor.removeClass('active');
            if (isHideable) {
                // Check for editable elements
                if (editable.el != null) {
                    // Build the original element
                    var oldElement = (0, _jquery.default)('<' + editable.type + '/>'), content = this.getContent(), currentContent = typeof markdown == 'object' ? markdown.toHTML(content) : content;
                    (0, _jquery.default)(editable.attrKeys).each(function(k, v) {
                        oldElement.attr(editable.attrKeys[k], editable.attrValues[k]);
                    });
                    // Get the editor content
                    oldElement.html(currentContent);
                    editor.replaceWith(oldElement);
                } else {
                    editor.hide();
                }
            }
            // Trigger the onBlur hook
            options.onBlur(this);
        }
        return this;
    }
};
/* MARKDOWN PLUGIN DEFINITION
* ========================== */ var old = _jquery.default.fn.markdown;
_jquery.default.fn.markdown = function(option) {
    return this.each(function() {
        var $this = (0, _jquery.default)(this), data = $this.data('markdown'), options = typeof option == 'object' && option;
        if (!data) $this.data('markdown', data = new Markdown(this, options));
    });
};
_jquery.default.fn.markdown.messages = {};
_jquery.default.fn.markdown.defaults = {
    /* Editor Properties */ autofocus: false,
    hideable: false,
    savable: false,
    width: 'inherit',
    height: 'inherit',
    resize: 'none',
    iconlibrary: 'glyph',
    language: 'en',
    initialstate: 'editor',
    /* Buttons Properties */ buttons: [
        [
            {
                name: 'groupFont',
                data: [
                    {
                        name: 'cmdBold',
                        hotkey: 'Ctrl+B',
                        title: 'Bold',
                        icon: {
                            glyph: 'mce-ico mce-i-bold',
                            fa: 'fa fa-bold',
                            'fa-3': 'icon-bold'
                        },
                        callback: function(e) {
                            // Give/remove ** surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('strong text');
                            } else {
                                chunk = selected.text;
                            }
                            // transform selection and set the cursor into chunked text
                            if (content.substr(selected.start - 2, 2) == '**' && content.substr(selected.end, 2) == '**') {
                                e.setSelection(selected.start - 2, selected.end + 2);
                                e.replaceSelection(chunk);
                                cursor = selected.start - 2;
                            } else {
                                e.replaceSelection('**' + chunk + '**');
                                cursor = selected.start + 2;
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    },
                    {
                        name: 'cmdItalic',
                        title: 'Italic',
                        hotkey: 'Ctrl+I',
                        icon: {
                            glyph: 'mce-ico mce-i-italic',
                            fa: 'fa fa-italic',
                            'fa-3': 'icon-italic'
                        },
                        callback: function(e) {
                            // Give/remove * surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('emphasized text');
                            } else {
                                chunk = selected.text;
                            }
                            // transform selection and set the cursor into chunked text
                            if (content.substr(selected.start - 1, 1) == '_' && content.substr(selected.end, 1) == '_') {
                                e.setSelection(selected.start - 1, selected.end + 1);
                                e.replaceSelection(chunk);
                                cursor = selected.start - 1;
                            } else {
                                e.replaceSelection('_' + chunk + '_');
                                cursor = selected.start + 1;
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    }
                ]
            },
            {
                name: 'groupLink',
                data: [
                    {
                        name: 'cmdUrl',
                        title: 'URL/Link',
                        hotkey: 'Ctrl+L',
                        icon: {
                            glyph: 'mce-ico mce-i-link',
                            fa: 'fa fa-link',
                            'fa-3': 'icon-link'
                        },
                        callback: function(e) {
                            // Give [] surround the selection and prepend the link
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent(), link;
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('enter link description here');
                            } else {
                                chunk = selected.text;
                            }
                            link = prompt(e.__localize('Insert Hyperlink'), 'http://');
                            if (link != null && link != '' && link != 'http://' && link.substr(0, 4) == 'http') {
                                var sanitizedLink = (0, _jquery.default)('<div>' + link + '</div>').text();
                                // transform selection and set the cursor into chunked text
                                e.replaceSelection('[' + chunk + '](' + sanitizedLink + ')');
                                cursor = selected.start + 1;
                                // Set the cursor
                                e.setSelection(cursor, cursor + chunk.length);
                            }
                        }
                    },
                    {
                        name: 'cmdImage',
                        title: 'Image',
                        hotkey: 'Ctrl+G',
                        icon: {
                            glyph: 'mce-ico mce-i-image',
                            fa: 'fa fa-picture-o',
                            'fa-3': 'icon-picture'
                        },
                        callback: function(e) {
                            // Give ![] surround the selection and prepend the image link
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent(), link;
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('enter image description here');
                            } else {
                                chunk = selected.text;
                            }
                            link = prompt(e.__localize('Insert Image Hyperlink'), 'http://');
                            if (link != null && link != '' && link != 'http://' && link.substr(0, 4) == 'http') {
                                var sanitizedLink = (0, _jquery.default)('<div>' + link + '</div>').text();
                                // transform selection and set the cursor into chunked text
                                e.replaceSelection('![' + chunk + '](' + sanitizedLink + ' "' + e.__localize('enter image title here') + '")');
                                cursor = selected.start + 2;
                                // Set the next tab
                                e.setNextTab(e.__localize('enter image title here'));
                                // Set the cursor
                                e.setSelection(cursor, cursor + chunk.length);
                            }
                        }
                    }
                ]
            },
            {
                name: 'groupMisc',
                data: [
                    {
                        name: 'cmdList',
                        hotkey: 'Ctrl+U',
                        title: 'Unordered List',
                        icon: {
                            glyph: 'mce-ico mce-i-bullist',
                            fa: 'fa fa-list',
                            'fa-3': 'icon-list-ul'
                        },
                        callback: function(e) {
                            // Prepend/Give - surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            // transform selection and set the cursor into chunked text
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('list text here');
                                e.replaceSelection('- ' + chunk);
                                // Set the cursor
                                cursor = selected.start + 2;
                            } else {
                                if (selected.text.indexOf('\n') < 0) {
                                    chunk = selected.text;
                                    e.replaceSelection('- ' + chunk);
                                    // Set the cursor
                                    cursor = selected.start + 2;
                                } else {
                                    var list = [];
                                    list = selected.text.split('\n');
                                    chunk = list[0];
                                    _jquery.default.each(list, function(k, v) {
                                        list[k] = '- ' + v;
                                    });
                                    e.replaceSelection('\n\n' + list.join('\n'));
                                    // Set the cursor
                                    cursor = selected.start + 4;
                                }
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    },
                    {
                        name: 'cmdListO',
                        hotkey: 'Ctrl+O',
                        title: 'Ordered List',
                        icon: {
                            glyph: 'mce-ico mce-i-numlist',
                            fa: 'fa fa-list-ol',
                            'fa-3': 'icon-list-ol'
                        },
                        callback: function(e) {
                            // Prepend/Give - surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            // transform selection and set the cursor into chunked text
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('list text here');
                                e.replaceSelection('1. ' + chunk);
                                // Set the cursor
                                cursor = selected.start + 3;
                            } else {
                                if (selected.text.indexOf('\n') < 0) {
                                    chunk = selected.text;
                                    e.replaceSelection('1. ' + chunk);
                                    // Set the cursor
                                    cursor = selected.start + 3;
                                } else {
                                    var list = [];
                                    list = selected.text.split('\n');
                                    chunk = list[0];
                                    _jquery.default.each(list, function(k, v) {
                                        list[k] = '1. ' + v;
                                    });
                                    e.replaceSelection('\n\n' + list.join('\n'));
                                    // Set the cursor
                                    cursor = selected.start + 5;
                                }
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    },
                    {
                        name: 'cmdQuote',
                        hotkey: 'Ctrl+Q',
                        title: 'Quote',
                        icon: {
                            glyph: 'mce-ico mce-i-indent',
                            fa: 'fa fa-quote-left',
                            'fa-3': 'icon-quote-left'
                        },
                        callback: function(e) {
                            // Prepend/Give - surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            // transform selection and set the cursor into chunked text
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('quote here');
                                e.replaceSelection('> ' + chunk);
                                // Set the cursor
                                cursor = selected.start + 2;
                            } else {
                                if (selected.text.indexOf('\n') < 0) {
                                    chunk = selected.text;
                                    e.replaceSelection('> ' + chunk);
                                    // Set the cursor
                                    cursor = selected.start + 2;
                                } else {
                                    var list = [];
                                    list = selected.text.split('\n');
                                    chunk = list[0];
                                    _jquery.default.each(list, function(k, v) {
                                        list[k] = '> ' + v;
                                    });
                                    e.replaceSelection('\n\n' + list.join('\n'));
                                    // Set the cursor
                                    cursor = selected.start + 4;
                                }
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    },
                    {
                        name: 'cmdCode',
                        hotkey: 'Ctrl+K',
                        title: 'Code',
                        icon: {
                            glyph: 'mce-ico mce-i-code',
                            fa: 'fa fa-code',
                            'fa-3': 'icon-code'
                        },
                        callback: function(e) {
                            // Give/remove ** surround the selection
                            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
                            if (selected.length == 0) {
                                // Give extra word
                                chunk = e.__localize('code text here');
                            } else {
                                chunk = selected.text;
                            }
                            // transform selection and set the cursor into chunked text
                            if (content.substr(selected.start - 1, 1) == '`' && content.substr(selected.end, 1) == '`') {
                                e.setSelection(selected.start - 1, selected.end + 1);
                                e.replaceSelection(chunk);
                                cursor = selected.start - 1;
                            } else {
                                e.replaceSelection('`' + chunk + '`');
                                cursor = selected.start + 1;
                            }
                            // Set the cursor
                            e.setSelection(cursor, cursor + chunk.length);
                        }
                    }
                ]
            },
            {
                name: 'groupUtil',
                data: [
                    {
                        name: 'cmdPreview',
                        toggle: true,
                        hotkey: 'Ctrl+P',
                        title: 'Preview',
                        btnText: 'Preview',
                        btnClass: 'btn btn-sm',
                        icon: {
                            glyph: 'glyphicon glyphicon-search',
                            fa: 'fa fa-search',
                            'fa-3': 'icon-search'
                        },
                        callback: function(e) {
                            // Check the preview mode and toggle based on this flag
                            var isPreview = e.$isPreview, content;
                            if (isPreview == false) {
                                // Give flag that tell the editor enter preview mode
                                e.showPreview();
                            } else {
                                e.hidePreview();
                            }
                        }
                    }
                ]
            }
        ]
    ],
    additionalButtons: [],
    reorderButtonGroups: [],
    hiddenButtons: [],
    disabledButtons: [],
    footer: '',
    fullscreen: {
        enable: true,
        icons: {
            fullscreenOn: {
                fa: 'fa fa-expand',
                glyph: 'glyphicon glyphicon-fullscreen',
                'fa-3': 'icon-resize-full'
            },
            fullscreenOff: {
                fa: 'fa fa-compress',
                glyph: 'glyphicon glyphicon-fullscreen',
                'fa-3': 'icon-resize-small'
            }
        }
    },
    /* Events hook */ onShow: function(e) {},
    onPreview: function(e) {},
    onSave: function(e) {},
    onBlur: function(e) {},
    onFocus: function(e) {},
    onChange: function(e) {},
    onFullscreen: function(e) {}
};
_jquery.default.fn.markdown.Constructor = Markdown;
/* MARKDOWN NO CONFLICT
* ==================== */ _jquery.default.fn.markdown.noConflict = function() {
    _jquery.default.fn.markdown = old;
    return this;
};
/* MARKDOWN GLOBAL FUNCTION & DATA-API
* ==================================== */ var initMarkdown = function(el) {
    var $this = el;
    if ($this.data('markdown')) {
        $this.data('markdown').showEditor();
        return;
    }
    $this.markdown();
};
var analyzeMarkdown = function(e) {
    var blurred = false, el, $docEditor = (0, _jquery.default)(e.currentTarget);
    // Check whether it was editor childs or not
    if ((e.type == 'focusin' || e.type == 'click') && $docEditor.length == 1 && typeof $docEditor[0] == 'object') {
        el = $docEditor[0].activeElement;
        if (!(0, _jquery.default)(el).data('markdown')) {
            if (typeof (0, _jquery.default)(el).parent().parent().parent().attr('class') == "undefined" || (0, _jquery.default)(el).parent().parent().parent().attr('class').indexOf('md-editor') < 0) {
                if (typeof (0, _jquery.default)(el).parent().parent().attr('class') == "undefined" || (0, _jquery.default)(el).parent().parent().attr('class').indexOf('md-editor') < 0) {
                    blurred = true;
                }
            } else {
                blurred = false;
            }
        }
        if (blurred) {
            // Blur event
            (0, _jquery.default)(document).find('.md-editor').each(function() {
                var parentMd = (0, _jquery.default)(el).parent();
                if ((0, _jquery.default)(this).attr('id') != parentMd.attr('id')) {
                    var attachedMarkdown;
                    if (attachedMarkdown = (0, _jquery.default)(this).find('textarea').data('markdown'), attachedMarkdown == null) {
                        attachedMarkdown = (0, _jquery.default)(this).find('div[data-provider="markdown-preview"]').data('markdown');
                    }
                    if (attachedMarkdown) {
                        attachedMarkdown.blur();
                    }
                }
            });
        }
        e.stopPropagation();
    }
};
(0, _jquery.default)(document).on('click.markdown.data-api', '[data-provide="markdown-editable"]', function(e) {
    initMarkdown((0, _jquery.default)(this));
    e.preventDefault();
}).on('click', function(e) {
    analyzeMarkdown(e);
}).on('focusin', function(e) {
    analyzeMarkdown(e);
}).ready(function() {
    (0, _jquery.default)('textarea[data-provide="markdown"]').each(function() {
        initMarkdown((0, _jquery.default)(this));
    });
}); 

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"marked":undefined}],164:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `NumberColumn` component, which is used to render
 * the value of a `Money` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _NumberColumn.default;
    }
});
const _NumberColumn = /*#__PURE__*/ _interop_require_default(require("../number/NumberColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../number/NumberColumn.mjs":170}],165:[function(require,module,exports){
/**
 * @file
 * This file defines the `MoneyField` component, which is used to render a
 * money field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `MoneyField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
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
const _default = _Field.default.create({
    displayName: 'MoneyField',
    propTypes: {
        onChange: _react.PropTypes.func.isRequired,
        path: _react.PropTypes.string.isRequired,
        value: _react.PropTypes.oneOfType([
            _react.PropTypes.string,
            _react.PropTypes.number
        ])
    },
    statics: {
        type: 'Money'
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */ valueChanged (event) {
        const newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
        if (newValue === this.props.value) return;
        this.props.onChange({
            path: this.props.path,
            value: newValue
        });
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "focusTarget",
            value: this.props.value
        });
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],166:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `NumberFilter` component, which is used to filter
 * `Money` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _NumberFilter.default;
    }
});
const _NumberFilter = /*#__PURE__*/ _interop_require_default(require("../number/NumberFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../number/NumberFilter.mjs":172}],167:[function(require,module,exports){
/**
 * @file
 * This file defines the `NameColumn` component, which is used to render the
 * value of a `Name` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
const _displayName = /*#__PURE__*/ _interop_require_default(require("../../../lib/utils/displayName.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `NameColumn` component.
 * @augments React.Component
 */ const NameColumn = _react.default.createClass({
    displayName: 'NameColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object,
        linkTo: _react.default.PropTypes.string
    },
    /**
	 * Renders the value of the field.
	 * @returns {(string|React.Element)} The rendered value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.first && !value.last) return '(no name)';
        return (0, _displayName.default)(value.first, value.last);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, {
            "data-list-row-edit": this.props.linkTo ? true : undefined,
            "data-item-id": this.props.linkTo ? this.props.data.id : undefined
        }, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            to: this.props.linkTo,
            padded: true,
            interior: true,
            field: this.props.col.type
        }, this.renderValue()));
    }
});
const _default = NameColumn;

},{"../../../lib/utils/displayName.mjs":200,"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],168:[function(require,module,exports){
/**
 * @file
 * This file defines the `NameField` component, which is used to render a name
 * field in the KeystoneJS Admin UI.
 *
 * It provides two text inputs for the first and last name.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `NameField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const NAME_SHAPE = {
    first: _react.PropTypes.string,
    last: _react.PropTypes.string
};
const _default = _Field.default.create({
    displayName: 'NameField',
    statics: {
        type: 'Name',
        getDefaultValue: ()=>({
                first: '',
                last: ''
            })
    },
    propTypes: {
        onChange: _react.PropTypes.func.isRequired,
        path: _react.PropTypes.string.isRequired,
        paths: _react.PropTypes.shape(NAME_SHAPE).isRequired,
        value: _react.PropTypes.shape(NAME_SHAPE).isRequired
    },
    /**
	 * Handles a change in the value of one of the name fields.
	 * @param {string} which The name of the field that changed ("first" or "last").
	 * @param {object} event The synthetic change event from the input element.
	 */ valueChanged: function(which, event) {
        const { value = {}, path, onChange } = this.props;
        onChange({
            path,
            value: _object_spread_props(_object_spread({}, value), {
                [which]: event.target.value
            })
        });
    },
    /**
	 * Handles a change in the first name field.
	 * @param {object} event The synthetic change event from the input element.
	 * @returns {void} Delegates to `valueChanged`.
	 */ changeFirst: function(event) {
        return this.valueChanged('first', event);
    },
    /**
	 * Handles a change in the last name field.
	 * @param {object} event The synthetic change event from the input element.
	 * @returns {void} Delegates to `valueChanged`.
	 */ changeLast: function(event) {
        return this.valueChanged('last', event);
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const inputStyle = {
            width: '100%'
        };
        const { value = {} } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            small: "one-half",
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true,
            style: inputStyle
        }, value.first)), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true,
            style: inputStyle
        }, value.last)));
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { value = {}, paths, autoFocus } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
            small: "one-half",
            gutter: 10
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: autoFocus,
            autoComplete: "off",
            name: this.getInputName(paths.first),
            onChange: this.changeFirst,
            placeholder: "First name",
            value: value.first
        })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(paths.last),
            onChange: this.changeLast,
            placeholder: "Last name",
            value: value.last
        })));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],169:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Name` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],170:[function(require,module,exports){
/**
 * @file
 * This file defines the `NumberColumn` component, which is used to render the
 * value of a `Number` or `Money` field in a list view.
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
const _numeral = /*#__PURE__*/ _interop_require_default(require("numeral"));
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `NumberColumn` component.
 * @augments React.Component
 */ const NumberColumn = _react.default.createClass({
    displayName: 'NumberColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {string} The formatted value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (value === undefined || isNaN(value)) return null;
        const formattedValue = this.props.col.type === 'money' ? (0, _numeral.default)(value).format('$0,0.00') : value;
        return formattedValue;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, this.renderValue()));
    }
});
const _default = NumberColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"numeral":undefined,"react":undefined}],171:[function(require,module,exports){
/**
 * @file
 * This file defines the `NumberField` component, which is used to render a
 * number field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `NumberField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'NumberField',
    statics: {
        type: 'Number'
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */ valueChanged (event) {
        const newValue = event.target.value;
        if (/^-?\d*\.?\d*$/.test(newValue)) {
            this.props.onChange({
                path: this.props.path,
                value: newValue
            });
        }
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "focusTarget",
            value: this.props.value
        });
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],172:[function(require,module,exports){
/**
 * @file
 * This file defines the `NumberFilter` component, which is used to filter
 * `Number` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by number, and it supports
 * inverting the filter.
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
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const MODE_OPTIONS = [
    {
        label: 'Exactly',
        value: 'equals'
    },
    {
        label: 'Greater Than',
        value: 'gt'
    },
    {
        label: 'Less Than',
        value: 'lt'
    },
    {
        label: 'Between',
        value: 'between'
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        value: ''
    };
}
/**
 * The `NumberFilter` component.
 * @augments React.Component
 */ const NumberFilter = _react.default.createClass({
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    componentDidMount () {
        // focus the text input
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Returns a function that handles a change in the value of the filter.
	 * @param {string} type The type of the value to handle.
	 * @returns {(e: Event) => void} The change handler.
	 */ handleChangeBuilder (type) {
        const self = this;
        return function handleChange(e) {
            const { filter, onChange } = self.props;
            switch(type){
                case 'minValue':
                    onChange({
                        mode: filter.mode,
                        value: {
                            min: e.target.value,
                            max: filter.value.max
                        }
                    });
                    break;
                case 'maxValue':
                    onChange({
                        mode: filter.mode,
                        value: {
                            min: filter.value.min,
                            max: e.target.value
                        }
                    });
                    break;
                case 'value':
                    onChange({
                        mode: filter.mode,
                        value: e.target.value
                    });
            }
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} changedProp The changed property.
	 */ updateFilter (changedProp) {
        this.props.onChange(_object_spread({}, this.props.filter, changedProp));
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        this.updateFilter({
            mode: e.target.value
        });
        // focus on next tick
        setTimeout(()=>{
            (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
        }, 0);
    },
    /**
	 * Renders the controls for the filter.
	 * @param {object} mode The current mode of the filter.
	 * @returns {React.Element} The rendered controls.
	 */ renderControls (mode) {
        let controls;
        const { field } = this.props;
        const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';
        if (mode.value === 'between') {
            controls = /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
                xsmall: "one-half",
                gutter: 10
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleChangeBuilder('minValue'),
                placeholder: "Min.",
                ref: "focusTarget",
                type: "number"
            })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleChangeBuilder('maxValue'),
                placeholder: "Max.",
                type: "number"
            })));
        } else {
            controls = /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleChangeBuilder('value'),
                placeholder: placeholder,
                ref: "focusTarget",
                type: "number"
            });
        }
        return controls;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        return /*#__PURE__*/ _react.default.createElement(_elemental.Form, {
            component: "div"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectMode,
            options: MODE_OPTIONS,
            value: mode.value
        })), this.renderControls(mode));
    },
    displayName: "NumberFilter"
});
const _default = NumberFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined,"react-dom":undefined}],173:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `ArrayColumn` component, which is used to render
 * the value of a `NumberArray` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _ArrayColumn.default;
    }
});
const _ArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../components/columns/ArrayColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../../components/columns/ArrayColumn.mjs":100}],174:[function(require,module,exports){
/**
 * @file
 * This file defines the `NumberArrayField` component, which is used to render
 * a number array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field, and it provides a `isValid` method to validate that the
 * input is a valid number.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `NumberArrayField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _ArrayField = /*#__PURE__*/ _interop_require_default(require("../../mixins/ArrayField.mjs"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'NumberArrayField',
    statics: {
        type: 'NumberArray'
    },
    mixins: [
        _ArrayField.default
    ],
    /**
	 * Checks whether a value is a valid number.
	 * @param {string} input The value to check.
	 * @returns {boolean} Whether the value is a valid number.
	 */ isValid (input) {
        return /^-?\d*\.?\d*$/.test(input);
    }
});

},{"../../mixins/ArrayField.mjs":104,"../Field.mjs":105}],175:[function(require,module,exports){
/**
 * @file
 * This file defines the `NumberArrayFilter` component, which is used to filter
 * `NumberArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by number, and it supports
 * inverting the filter.
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
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const MODE_OPTIONS = [
    {
        label: 'Exactly',
        value: 'equals'
    },
    {
        label: 'Greater Than',
        value: 'gt'
    },
    {
        label: 'Less Than',
        value: 'lt'
    },
    {
        label: 'Between',
        value: 'between'
    }
];
const PRESENCE_OPTIONS = [
    {
        label: 'At least one element',
        value: 'some'
    },
    {
        label: 'No element',
        value: 'none'
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        presence: PRESENCE_OPTIONS[0].value,
        value: ''
    };
}
/**
 * The `NumberArrayFilter` component.
 * @augments React.Component
 */ const NumberArrayFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            mode: _react.default.PropTypes.oneOf(MODE_OPTIONS.map((i)=>i.value)),
            presence: _react.default.PropTypes.oneOf(PRESENCE_OPTIONS.map((i)=>i.value)),
            value: _react.default.PropTypes.oneOfType([
                _react.default.PropTypes.number,
                _react.default.PropTypes.string,
                _react.default.PropTypes.shape({
                    min: _react.default.PropTypes.number,
                    max: _react.default.PropTypes.number
                })
            ])
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Returns a function that handles a specific type of onChange events for
	 * either 'minValue', 'maxValue' or simply 'value'
	 * @param {string} type The type of the value to handle.
	 * @returns {(e: object) => void} The change handler.
	 */ handleValueChangeBuilder (type) {
        const self = this;
        return function(e) {
            switch(type){
                case 'minValue':
                    self.updateFilter({
                        value: {
                            min: e.target.value,
                            max: self.props.filter.value.max
                        }
                    });
                    break;
                case 'maxValue':
                    self.updateFilter({
                        value: {
                            min: self.props.filter.value.min,
                            max: e.target.value
                        }
                    });
                    break;
                case 'value':
                    self.updateFilter({
                        value: e.target.value
                    });
                    break;
            }
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} changedProp The changed property.
	 */ updateFilter (changedProp) {
        this.props.onChange(_object_spread({}, this.props.filter, changedProp));
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        const mode = e.target.value;
        this.updateFilter({
            mode
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */ selectPresence (e) {
        const presence = e.target.value;
        this.updateFilter({
            presence
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Renders the controls for the filter.
	 * @param {object} presence The presence object.
	 * @param {object} mode The mode object.
	 * @returns {React.Element} The rendered controls.
	 */ renderControls (presence, mode) {
        let controls;
        const placeholder = presence.label + ' is ' + mode.label.toLowerCase() + '...';
        if (mode.value === 'between') {
            // Render "min" and "max" input
            controls = /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Row, {
                xsmall: "one-half",
                gutter: 10
            }, /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleValueChangeBuilder('minValue'),
                placeholder: "Min.",
                ref: "focusTarget",
                type: "number",
                value: this.props.filter.value.min
            })), /*#__PURE__*/ _react.default.createElement(_elemental.Grid.Col, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleValueChangeBuilder('maxValue'),
                placeholder: "Max.",
                type: "number",
                value: this.props.filter.value.max
            })));
        } else {
            // Render one number input
            controls = /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
                onChange: this.handleValueChangeBuilder('value'),
                placeholder: placeholder,
                ref: "focusTarget",
                type: "number",
                value: this.props.filter.value
            });
        }
        return controls;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        // Get mode and presence based on their values with .filter
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const presence = PRESENCE_OPTIONS.filter((i)=>i.value === filter.presence)[0];
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectPresence,
            options: PRESENCE_OPTIONS,
            value: presence.value
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectMode,
            options: MODE_OPTIONS,
            value: mode.value
        })), this.renderControls(presence, mode));
    },
    displayName: "NumberArrayFilter"
});
const _default = NumberArrayFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined,"react-dom":undefined}],176:[function(require,module,exports){
/**
 * @file
 * This file defines the `PasswordColumn` component, which is used to render
 * the value of a `Password` field in a list view.
 *
 * It displays '********' if a password is set, and an empty string otherwise.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `PasswordColumn` component.
 * @augments React.Component
 */ const PasswordColumn = _react.default.createClass({
    displayName: 'PasswordColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field.
	 * @returns {string} The rendered value.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        return value ? '********' : '';
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, this.renderValue()));
    }
});
const _default = PasswordColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],177:[function(require,module,exports){
/**
 * @file
 * This file defines the `PasswordField` component, which is used to render a
 * password field in the KeystoneJS Admin UI.
 *
 * It provides a UI for setting and changing a password, and it hides the
 * password value from the user.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `PasswordField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'PasswordField',
    statics: {
        type: 'Password'
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            passwordIsSet: this.props.value ? true : false,
            showChangeUI: this.props.mode === 'create' ? true : false,
            password: '',
            confirm: ''
        };
    },
    /**
	 * Handles a change in the value of one of the password fields.
	 * @param {string} which The name of the field that changed.
	 * @param {object} event The event object.
	 */ valueChanged (which, event) {
        const newState = {};
        newState[which] = event.target.value;
        this.setState(newState);
    },
    /**
	 * Shows the change password UI.
	 */ showChangeUI () {
        this.setState({
            showChangeUI: true
        }, ()=>this.focus());
    },
    /**
	 * Hides the change password UI.
	 */ onCancel () {
        this.setState({
            showChangeUI: false
        }, ()=>this.focus());
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, this.props.value ? 'Password Set' : '');
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
    },
    /**
	 * Renders the password and confirm password fields.
	 * @returns {React.Element} The rendered fields.
	 */ renderFields () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroup, {
            block: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
            grow: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged.bind(this, 'password'),
            placeholder: "New password",
            ref: "focusTarget",
            type: "password",
            value: this.state.password
        })), /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
            grow: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.paths.confirm),
            onChange: this.valueChanged.bind(this, 'confirm'),
            placeholder: "Confirm new password",
            value: this.state.confirm,
            type: "password"
        })), this.state.passwordIsSet ? /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.onCancel
        }, "Cancel")) : null);
    },
    /**
	 * Renders the change password button.
	 * @returns {React.Element} The rendered button.
	 */ renderChangeButton () {
        const label = this.state.passwordIsSet ? 'Change Password' : 'Set Password';
        return /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            ref: "focusTarget",
            onClick: this.showChangeUI
        }, label);
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],178:[function(require,module,exports){
/**
 * @file
 * This file defines the `PasswordFilter` component, which is used to filter
 * `Password` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the password is set or
 * not.
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
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const EXISTS_OPTIONS = [
    {
        label: 'Is Set',
        value: true
    },
    {
        label: 'Is NOT Set',
        value: false
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        exists: true
    };
}
/**
 * The `PasswordFilter` component.
 * @augments React.Component
 */ const PasswordFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            exists: _react.default.PropTypes.oneOf(EXISTS_OPTIONS.map((i)=>i.value))
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */ toggleExists (value) {
        this.props.onChange({
            exists: value
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleExists,
            options: EXISTS_OPTIONS,
            value: filter.exists
        });
    },
    displayName: "PasswordFilter"
});
const _default = PasswordFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined}],179:[function(require,module,exports){
/**
 * @file
 * This file defines the `RelationshipColumn` component, which is used to render
 * the value of a `Relationship` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const moreIndicatorStyle = {
    color: '#bbb',
    fontSize: '.8rem',
    fontWeight: 500,
    marginLeft: 8
};
/**
 * The `RelationshipColumn` component.
 * @augments React.Component
 */ const RelationshipColumn = _react.default.createClass({
    displayName: 'RelationshipColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the values of a many-to-many relationship.
	 * @param {Array} value The array of related items.
	 * @returns {React.Element|undefined} The rendered values, or undefined if the array is empty.
	 */ renderMany (value) {
        if (!value || !value.length) return;
        const refList = this.props.col.field.refList;
        const items = [];
        for(let i = 0; i < 3; i++){
            if (!value[i]) break;
            if (i) {
                items.push(/*#__PURE__*/ _react.default.createElement("span", {
                    key: 'comma' + i
                }, ", "));
            }
            items.push(/*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
                interior: true,
                truncate: false,
                key: 'anchor' + i,
                to: Keystone.adminLegacyPath + '/' + refList.path + '/' + value[i].id
            }, value[i].name));
        }
        if (value.length > 3) {
            items.push(/*#__PURE__*/ _react.default.createElement("span", {
                key: "more",
                style: moreIndicatorStyle
            }, "[...", value.length - 3, " more]"));
        }
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type
        }, items);
    },
    /**
	 * Renders the value of a one-to-many relationship.
	 * @param {object} value The related item.
	 * @returns {React.Element|undefined} The rendered value, or undefined if no value is provided.
	 */ renderValue (value) {
        if (!value) return;
        const refList = this.props.col.field.refList;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            to: Keystone.adminLegacyPath + '/' + refList.path + '/' + value.id,
            padded: true,
            interior: true,
            field: this.props.col.type
        }, value.name);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const value = this.props.data.fields[this.props.col.path];
        const many = this.props.col.field.many;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, many ? this.renderMany(value) : this.renderValue(value));
    }
});
const _default = RelationshipColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],180:[function(require,module,exports){
/**
 * @file
 * This file defines the `RelationshipField` component, which is used to render
 * a relationship field in the KeystoneJS Admin UI.
 *
 * It provides a select input to choose a related item from a list, and it
 * can be configured to allow creating new related items inline.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `RelationshipField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _lists = require("../../../admin/client-legacy/utils/lists");
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactselect = /*#__PURE__*/ _interop_require_default(require("react-select"));
const _xhr = /*#__PURE__*/ _interop_require_default(require("xhr"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _CreateForm = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/App/shared/CreateForm"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
/**
 * Compares two arrays of values.
 * @param {Array} current The first array.
 * @param {Array} next The second array.
 * @returns {boolean} Whether the arrays are equal.
 */ function compareValues(current, next) {
    const currentLength = current ? current.length : 0;
    const nextLength = next ? next.length : 0;
    if (currentLength !== nextLength) return false;
    for(let i = 0; i < currentLength; i++){
        if (current[i] !== next[i]) return false;
    }
    return true;
}
const _default = _Field.default.create({
    displayName: 'RelationshipField',
    statics: {
        type: 'Relationship'
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            value: null,
            createIsOpen: false
        };
    },
    /**
	 * Initializes the component.
	 */ componentDidMount () {
        this._itemsCache = {};
        this.loadValue(this.props.value);
        this.__isMounted = true;
    },
    /**
	 * Unmounts the component.
	 */ componentWillUnmount () {
        this.__isMounted = false;
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillReceiveProps (nextProps) {
        if (nextProps.value === this.props.value || nextProps.many && compareValues(this.props.value, nextProps.value)) return;
        this.loadValue(nextProps.value);
    },
    /**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */ shouldCollapse () {
        if (this.props.many) {
            // many:true relationships have an Array for a value
            return this.props.collapse && !this.props.value.length;
        }
        return this.props.collapse && !this.props.value;
    },
    /**
	 * Builds the filters for the query.
	 * @returns {string} The filter string.
	 */ buildFilters () {
        const filters = {};
        _lodash.default.forEach(this.props.filters, (value, key)=>{
            if (typeof value === 'string' && value[0] === ':') {
                const fieldName = value.slice(1);
                const val = this.props.values[fieldName];
                if (val) {
                    filters[key] = val;
                    return;
                }
                // check if filtering by id and item was already saved
                if (fieldName === '_id' && Keystone.item) {
                    filters[key] = Keystone.item.id;
                    return;
                }
            } else {
                filters[key] = value;
            }
        }, this);
        const parts = [];
        _lodash.default.forEach(filters, function(val, key) {
            parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
        });
        return parts.join('&');
    },
    /**
	 * Caches an item.
	 * @param {object} item The item to cache.
	 */ cacheItem (item) {
        item.href = Keystone.adminLegacyPath + '/' + this.props.refList.path + '/' + item.id;
        this._itemsCache[item.id] = item;
    },
    /**
	 * Loads the value of the field.
	 * @param {Array|string|null} values The value(s) to load — an array of IDs, a comma-separated string of IDs, or null/falsy to clear.
	 * @returns {void}
	 */ loadValue (values) {
        if (!values) {
            return this.setState({
                loading: false,
                value: null
            });
        }
        ;
        values = Array.isArray(values) ? values : values.split(',');
        const cachedValues = values.map((i)=>this._itemsCache[i]).filter((i)=>i);
        if (cachedValues.length === values.length) {
            this.setState({
                loading: false,
                value: this.props.many ? cachedValues : cachedValues[0]
            });
            return;
        }
        this.setState({
            loading: true,
            value: null
        });
        Promise.all(values.map((value)=>new Promise((resolve, reject)=>{
                (0, _xhr.default)({
                    url: getAdminApiPath() + '/' + this.props.refList.path + '/' + value + '?basic',
                    responseType: 'json'
                }, (err, resp, data)=>{
                    if (err || !data) return reject(err);
                    this.cacheItem(data);
                    resolve(data);
                });
            }))).then((expanded)=>{
            if (!this.__isMounted) return;
            if (this.props.onValuesLoaded && typeof this.props.onValuesLoaded === 'function') {
                this.props.onValuesLoaded(this.props.path);
            }
            this.setState({
                loading: false,
                value: this.props.many ? expanded : expanded[0]
            });
        });
    },
    // NOTE: this seems like the wrong way to add options to the Select
    loadOptionsCallback: {},
    /**
	 * Loads options for the select input.
	 * @param {string} input The search input.
	 * @param {(err: Error|null, result: {options: Array, complete: boolean}|null) => void} callback The callback to call with the options.
	 */ loadOptions (input, callback) {
        // NOTE: this seems like the wrong way to add options to the Select
        this.loadOptionsCallback = callback;
        const filters = this.buildFilters();
        (0, _xhr.default)({
            url: getAdminApiPath() + '/' + this.props.refList.path + '?basic&search=' + input + '&' + filters,
            responseType: 'json'
        }, (err, resp, data)=>{
            if (err) {
                console.error('Error loading items:', err);
                return callback(null, []);
            }
            data.results.forEach(this.cacheItem);
            callback(null, {
                options: data.results,
                complete: data.results.length === data.count
            });
        });
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {string|Array|null} value The new value — a single ID string, an array of IDs, or null to clear.
	 */ valueChanged (value) {
        this.props.onChange({
            path: this.props.path,
            value: value
        });
    },
    /**
	 * Opens the create modal.
	 */ openCreate () {
        this.setState({
            createIsOpen: true
        });
    },
    /**
	 * Closes the create modal.
	 */ closeCreate () {
        this.setState({
            createIsOpen: false
        });
    },
    /**
	 * Handles the creation of a new item.
	 * @param {object} item The new item.
	 */ onCreate (item) {
        this.cacheItem(item);
        if (Array.isArray(this.state.value)) {
            // For many relationships, append the new item to the end
            const values = this.state.value.map((item)=>item.id);
            values.push(item.id);
            this.valueChanged(values.join(','));
        } else {
            this.valueChanged(item.id);
        }
        // NOTE: this seems like the wrong way to add options to the Select
        this.loadOptionsCallback(null, {
            complete: true,
            options: Object.keys(this._itemsCache).map((k)=>this._itemsCache[k])
        });
        this.closeCreate();
    },
    /**
	 * Renders the select input.
	 * @param {boolean} noedit Whether the input is editable.
	 * @returns {React.Element} The rendered select input.
	 */ renderSelect (noedit) {
        const inputName = this.getInputName(this.props.path);
        const emptyValueInput = this.props.many && (!this.state.value || !this.state.value.length) || !this.props.many && !this.state.value ? /*#__PURE__*/ _react.default.createElement("input", {
            type: "hidden",
            name: inputName,
            value: ""
        }) : null;
        return /*#__PURE__*/ _react.default.createElement("div", null, emptyValueInput, /*#__PURE__*/ _react.default.createElement("input", {
            type: "text",
            style: {
                position: 'absolute',
                width: 1,
                height: 1,
                zIndex: -1,
                opacity: 0
            },
            tabIndex: "-1"
        }), /*#__PURE__*/ _react.default.createElement(_reactselect.default.Async, {
            multi: this.props.many,
            disabled: noedit,
            loadOptions: this.loadOptions,
            labelKey: "name",
            name: inputName,
            onChange: this.valueChanged,
            simpleValue: true,
            value: this.state.value,
            valueKey: "id"
        }));
    },
    /**
	 * Renders the input group.
	 * @returns {React.Element} The rendered input group.
	 */ renderInputGroup () {
        return /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroup, {
            block: true
        }, /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, {
            grow: true
        }, this.renderSelect()), /*#__PURE__*/ _react.default.createElement(_elemental.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            onClick: this.openCreate
        }, "+")), /*#__PURE__*/ _react.default.createElement(_CreateForm.default, {
            list: _lists.listsByKey[this.props.refList.key],
            isOpen: this.state.createIsOpen,
            onCreate: this.onCreate,
            onCancel: this.closeCreate
        }));
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const { many } = this.props;
        const { value } = this.state;
        const props = {
            children: value ? value.name : null,
            component: value ? 'a' : 'span',
            href: value ? value.href : null,
            noedit: true
        };
        return many ? this.renderSelect(true) : /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, props);
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        if (this.props.createInline) {
            return this.renderInputGroup();
        } else {
            return this.renderSelect();
        }
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/App/shared/CreateForm":67,"../../../admin/client-legacy/utils/lists":88,"../Field.mjs":105,"lodash":undefined,"react":undefined,"react-select":undefined,"xhr":undefined}],181:[function(require,module,exports){
/**
 * @file
 * This file defines the `RelationshipFilter` component, which is used to filter
 * `Relationship` fields in the KeystoneJS Admin UI.
 *
 * It provides a search input to find related items, and it supports inverting
 * the filter.
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
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _xhr = /*#__PURE__*/ _interop_require_default(require("xhr"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/App/shared/Popout/PopoutList"));
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
const INVERTED_OPTIONS = [
    {
        label: 'Linked To',
        value: false
    },
    {
        label: 'NOT Linked To',
        value: true
    }
];
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        inverted: INVERTED_OPTIONS[0].value,
        value: []
    };
}
/**
 * The `RelationshipFilter` component.
 * @augments React.Component
 */ const RelationshipFilter = _react.default.createClass({
    propTypes: {
        field: _react.default.PropTypes.object,
        filter: _react.default.PropTypes.shape({
            inverted: _react.default.PropTypes.bool,
            value: _react.default.PropTypes.array
        }),
        onHeightChange: _react.default.PropTypes.func
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */ getInitialState () {
        return {
            searchIsLoading: false,
            searchResults: [],
            searchString: '',
            selectedItems: [],
            valueIsLoading: true
        };
    },
    componentDidMount () {
        this._itemsCache = {};
        this.loadSearchResults(true);
    },
    /**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */ componentWillReceiveProps (nextProps) {
        if (nextProps.filter.value !== this.props.filter.value) {
            this.populateValue(nextProps.filter.value);
        }
    },
    /**
	 * Returns whether the component is loading.
	 * @returns {boolean} Whether the component is loading.
	 */ isLoading () {
        return this.state.searchIsLoading || this.state.valueIsLoading;
    },
    /**
	 * Populates the value of the filter.
	 * @param {Array} value The value to populate.
	 */ populateValue (value) {
        Promise.all(value.map((id)=>{
            if (this._itemsCache[id]) return Promise.resolve(this._itemsCache[id]);
            return new Promise((resolve, reject)=>{
                (0, _xhr.default)({
                    url: getAdminApiPath() + '/' + this.props.field.refList.path + '/' + id + '?basic',
                    responseType: 'json'
                }, (err, resp, data)=>{
                    if (err || !data) return reject(err);
                    this.cacheItem(data);
                    resolve(data);
                });
            });
        })).then((items)=>{
            this.setState({
                valueIsLoading: false,
                selectedItems: items || []
            }, ()=>{
                (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
            });
        }, (err)=>{
            // TODO: Handle errors better
            console.error('Error loading items:', err);
        });
    },
    /**
	 * Caches an item.
	 * @param {object} item The item to cache.
	 */ cacheItem (item) {
        this._itemsCache[item.id] = item;
    },
    /**
	 * Builds the filters for the query.
	 * @returns {string} The filter string.
	 */ buildFilters () {
        const filters = {};
        _lodash.default.forEach(this.props.field.filters, function(value, key) {
            if (value[0] === ':') return;
            filters[key] = value;
        }, this);
        const parts = [];
        _lodash.default.forEach(filters, function(val, key) {
            parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
        });
        return parts.join('&');
    },
    /**
	 * Loads the search results.
	 * @param {boolean} thenPopulateValue Whether to populate the value after loading the results.
	 */ loadSearchResults (thenPopulateValue) {
        const searchString = this.state.searchString;
        const filters = this.buildFilters();
        (0, _xhr.default)({
            url: getAdminApiPath() + '/' + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
            responseType: 'json'
        }, (err, resp, data)=>{
            if (err) {
                // TODO: Handle errors better
                console.error('Error loading items:', err);
                this.setState({
                    searchIsLoading: false
                });
                return;
            }
            data.results.forEach(this.cacheItem);
            if (thenPopulateValue) {
                this.populateValue(this.props.filter.value);
            }
            if (searchString !== this.state.searchString) return;
            this.setState({
                searchIsLoading: false,
                searchResults: data.results
            }, this.updateHeight);
        });
    },
    /**
	 * Updates the height of the component.
	 */ updateHeight () {
        if (this.props.onHeightChange) {
            this.props.onHeightChange(this.refs.container.offsetHeight);
        }
    },
    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */ toggleInverted (inverted) {
        this.updateFilter({
            inverted
        });
    },
    /**
	 * Handles a change in the search input.
	 * @param {object} e The event object.
	 */ updateSearch (e) {
        this.setState({
            searchString: e.target.value
        }, this.loadSearchResults);
    },
    /**
	 * Selects an item.
	 * @param {object} item The item to select.
	 */ selectItem (item) {
        const value = this.props.filter.value.concat(item.id);
        this.updateFilter({
            value
        });
    },
    /**
	 * Removes an item from the filter.
	 * @param {object} item The item to remove.
	 */ removeItem (item) {
        const value = this.props.filter.value.filter((i)=>{
            return i !== item.id;
        });
        this.updateFilter({
            value
        });
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Renders a list of items.
	 * @param {Array} items The items to render.
	 * @param {boolean} selected Whether the items are selected.
	 * @returns {React.Element} The rendered items.
	 */ renderItems (items, selected) {
        const itemIconHover = selected ? 'x' : 'check';
        return items.map((item, i)=>{
            return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
                key: `item-${i}-${item.id}`,
                icon: "dash",
                iconHover: itemIconHover,
                label: item.name,
                onClick: ()=>{
                    if (selected) this.removeItem(item);
                    else this.selectItem(item);
                }
            });
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const selectedItems = this.state.selectedItems;
        const searchResults = this.state.searchResults.filter((i)=>{
            return this.props.filter.value.indexOf(i.id) === -1;
        });
        const placeholder = this.isLoading() ? 'Loading...' : 'Find a ' + this.props.field.label + '...';
        return /*#__PURE__*/ _react.default.createElement("div", {
            ref: "container"
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            options: INVERTED_OPTIONS,
            value: this.props.filter.inverted,
            onChange: this.toggleInverted
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, {
            style: {
                borderBottom: '1px dashed rgba(0,0,0,0.1)',
                paddingBottom: '1em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: true,
            ref: "focusTarget",
            value: this.state.searchString,
            onChange: this.updateSearch,
            placeholder: placeholder
        })), selectedItems.length ? /*#__PURE__*/ _react.default.createElement(_PopoutList.default, null, /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, null, "Selected"), this.renderItems(selectedItems, true)) : null, searchResults.length ? /*#__PURE__*/ _react.default.createElement(_PopoutList.default, null, /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, {
            style: selectedItems.length ? {
                marginTop: '2em'
            } : null
        }, "Items"), this.renderItems(searchResults)) : null);
    },
    displayName: "RelationshipFilter"
});
const _default = RelationshipFilter;

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/App/shared/Popout/PopoutList":75,"lodash":undefined,"react":undefined,"react-dom":undefined,"xhr":undefined}],182:[function(require,module,exports){
/**
 * @file
 * This file defines the `SelectColumn` component, which is used to render the
 * value of a `Select` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `SelectColumn` component.
 * @augments React.Component
 */ const SelectColumn = _react.default.createClass({
    displayName: 'SelectColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object,
        linkTo: _react.default.PropTypes.string
    },
    /**
	 * Renders the value of the field.
	 * @returns {string} The rendered value.
	 */ getValue () {
        const value = this.props.data.fields[this.props.col.path];
        const option = this.props.col.field.ops.filter((i)=>i.value === value)[0];
        return option ? option.label : null;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const value = this.getValue();
        const empty = !value && this.props.linkTo ? true : false;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            field: this.props.col.type,
            to: this.props.linkTo,
            empty: empty
        }, value));
    }
});
const _default = SelectColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],183:[function(require,module,exports){
/**
 * @file
 * This file defines the `SelectField` component, which is used to render a
 * select field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * TODO:
 * - Custom path support
 */ /**
 * The `SelectField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactselect = /*#__PURE__*/ _interop_require_default(require("react-select"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'SelectField',
    statics: {
        type: 'Select'
    },
    /**
	 * Handles a change in the value of the field.
	 * @param {string|number} newValue The new value selected by the user.
	 */ valueChanged (newValue) {
        // TODO: This should be natively handled by the Select component
        if (this.props.numeric && typeof newValue === 'string') {
            newValue = newValue ? Number(newValue) : undefined;
        }
        this.props.onChange({
            path: this.props.path,
            value: newValue
        });
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const { ops, value } = this.props;
        const selected = ops.find((opt)=>opt.value === value);
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true
        }, selected ? selected.label : null);
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { numeric, ops, path, value: val } = this.props;
        // TODO: This should be natively handled by the Select component
        const options = numeric ? ops.map(function(i) {
            return {
                label: i.label,
                value: String(i.value)
            };
        }) : ops;
        const value = typeof val === 'number' ? String(val) : val;
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("input", {
            type: "text",
            style: {
                position: 'absolute',
                width: 1,
                height: 1,
                zIndex: -1,
                opacity: 0
            },
            tabIndex: "-1"
        }), /*#__PURE__*/ _react.default.createElement(_reactselect.default, {
            simpleValue: true,
            name: this.getInputName(path),
            value: value,
            options: options,
            onChange: this.valueChanged
        }));
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined,"react-select":undefined}],184:[function(require,module,exports){
/**
 * @file
 * This file defines the `SelectFilter` component, which is used to filter
 * `Select` fields in the KeystoneJS Admin UI.
 *
 * It provides a popout list of options to filter by, and it supports
 * inverting the filter.
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
const _elemental = require("../../../admin/client-legacy/App/elemental");
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/App/shared/Popout/PopoutList"));
const _Kbd = /*#__PURE__*/ _interop_require_default(require("../../../admin/client-legacy/App/shared/Kbd"));
const _bindFunctions = /*#__PURE__*/ _interop_require_default(require("../../utils/bindFunctions.mjs"));
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
const INVERTED_OPTIONS = [
    {
        label: 'Matches',
        value: false
    },
    {
        label: 'Does NOT Match',
        value: true
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        inverted: INVERTED_OPTIONS[0].value,
        value: []
    };
}
/**
 * A component that renders a single option in the filter.
 * @augments React.Component
 */ class FilterOption extends _react.Component {
    /**
	 * Handles a click on the option.
	 */ handleClick() {
        const { option, selected } = this.props;
        this.props.onClick(option, selected);
    }
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render() {
        const { option, selected } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
            icon: selected ? 'check' : 'dash',
            isSelected: selected,
            label: option.label,
            onClick: this.handleClick
        });
    }
    constructor(){
        super();
        _bindFunctions.default.call(this, [
            'handleClick'
        ]);
    }
}
/**
 * The `SelectFilter` component.
 * @augments React.Component
 */ class SelectFilter extends _react.Component {
    /**
	 * Detects the OS and attaches keyboard listeners when the component mounts.
	 */ componentDidMount() {
        this.detectOS();
        document.body.addEventListener('keydown', this.handleKeyDown, false);
        document.body.addEventListener('keyup', this.handleKeyUp, false);
    }
    /**
	 * Removes keyboard listeners when the component unmounts.
	 */ componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
    }
    // ==============================
    // METHODS
    // ==============================
    /**
	 * Detects the user's operating system.
	 */ // TODO this should probably be moved to the main App component and stored
    // in context for other components to subscribe to when required
    detectOS() {
        let osName = 'Unknown OS';
        if (navigator.appVersion.includes('Win')) osName = 'Windows';
        if (navigator.appVersion.includes('Mac')) osName = 'MacOS';
        if (navigator.appVersion.includes('X11')) osName = 'UNIX';
        if (navigator.appVersion.includes('Linux')) osName = 'Linux';
        this.setState({
            osName
        });
    }
    /**
	 * Handles a keydown event.
	 * @param {object} e The event object.
	 */ handleKeyDown(e) {
        if (e.key !== 'Meta') return;
        this.setState({
            metaDown: true
        });
    }
    /**
	 * Handles a keyup event.
	 * @param {object} e The event object.
	 */ handleKeyUp(e) {
        if (e.key !== 'Meta') return;
        this.setState({
            metaDown: false
        });
    }
    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */ toggleInverted(inverted) {
        this.updateFilter({
            inverted
        });
    }
    /**
	 * Toggles all options on or off.
	 */ toggleAllOptions() {
        const { field, filter } = this.props;
        if (filter.value.length < field.ops.length) {
            this.updateFilter({
                value: field.ops.map((i)=>i.value)
            });
        } else {
            this.updateFilter({
                value: []
            });
        }
    }
    /**
	 * Selects an option.
	 * @param {object} option The option to select.
	 */ selectOption(option) {
        const value = this.state.metaDown ? this.props.filter.value.concat(option.value) : [
            option.value
        ];
        this.updateFilter({
            value
        });
    }
    /**
	 * Removes an option from the filter.
	 * @param {object} option The option to remove.
	 */ removeOption(option) {
        const value = this.state.metaDown ? this.props.filter.value.filter((i)=>i !== option.value) : [
            option.value
        ];
        this.updateFilter({
            value
        });
    }
    /**
	 * Handles a click on an option.
	 * @param {object} option The option that was clicked.
	 * @param {boolean} selected Whether the option is currently selected.
	 */ handleClick(option, selected) {
        selected ? this.removeOption(option) : this.selectOption(option);
    }
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter(value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    }
    // ==============================
    // RENDERERS
    // ==============================
    /**
	 * Renders the options for the filter.
	 * @returns {React.Element} The rendered options.
	 */ renderOptions() {
        return this.props.field.ops.map((option, i)=>{
            const selected = this.props.filter.value.indexOf(option.value) > -1;
            return /*#__PURE__*/ _react.default.createElement(FilterOption, {
                key: `item-${i}-${option.value}`,
                option: option,
                selected: selected,
                onClick: this.handleClick
            });
        });
    }
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render() {
        const { field, filter } = this.props;
        const indeterminate = filter.value.length < field.ops.length;
        const metaKeyLabel = this.state.osName === 'MacOS' ? 'cmd' : 'ctrl';
        const fieldStyles = {
            alignItems: 'center',
            borderBottom: '1px dashed rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1em',
            paddingBottom: '1em'
        };
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleInverted,
            options: INVERTED_OPTIONS,
            value: filter.inverted
        })), /*#__PURE__*/ _react.default.createElement("div", {
            style: fieldStyles
        }, /*#__PURE__*/ _react.default.createElement(_elemental.Button, {
            size: "xsmall",
            onClick: this.toggleAllOptions,
            style: {
                padding: 0,
                width: 50
            }
        }, indeterminate ? 'All' : 'None'), /*#__PURE__*/ _react.default.createElement(_elemental.FormNote, {
            style: {
                margin: 0
            }
        }, "Hold ", /*#__PURE__*/ _react.default.createElement(_Kbd.default, null, metaKeyLabel), " to select multiple options")), this.renderOptions());
    }
    /**
	 * Initialises the component, binds event-handler methods, and sets
	 * the initial state.
	 */ constructor(){
        super();
        _bindFunctions.default.call(this, [
            'detectOS',
            'handleClick',
            'handleKeyDown',
            'handleKeyUp',
            'removeOption',
            'selectOption',
            'toggleAllOptions',
            'toggleInverted',
            'updateFilter'
        ]);
        this.state = {
            metaDown: false
        };
    }
}
SelectFilter.propTypes = {
    field: _react.PropTypes.object,
    filter: _react.PropTypes.shape({
        inverted: _react.PropTypes.boolean,
        value: _react.PropTypes.array
    })
};
SelectFilter.getDefaultValue = getDefaultValue;
SelectFilter.defaultProps = {
    filter: getDefaultValue()
};
const _default = SelectFilter;

},{"../../../admin/client-legacy/App/elemental":65,"../../../admin/client-legacy/App/shared/Kbd":69,"../../../admin/client-legacy/App/shared/Popout/PopoutList":75,"../../utils/bindFunctions.mjs":197,"react":undefined}],185:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextColumn` component, which is used to render the
 * value of a `Text` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `TextColumn` component.
 * @augments React.Component
 */ const TextColumn = _react.default.createClass({
    displayName: 'TextColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object,
        linkTo: _react.default.PropTypes.string
    },
    /**
	 * Renders the value of the field.
	 * @returns {string} The value of the field.
	 */ getValue () {
        // cropping text is important for textarea, which uses this column
        const value = this.props.data.fields[this.props.col.path];
        return value ? value.slice(0, 100) : null;
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const value = this.getValue();
        const empty = !value && this.props.linkTo ? true : false;
        const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, {
            "data-list-row-edit": this.props.linkTo ? true : undefined,
            "data-item-id": this.props.linkTo ? this.props.data.id : undefined
        }, /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            className: className,
            to: this.props.linkTo,
            empty: empty,
            padded: true,
            interior: true,
            field: this.props.col.type
        }, value));
    }
});
const _default = TextColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],186:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextField` component, which is used to render a text
 * field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `TextField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'TextField',
    statics: {
        type: 'Text'
    }
});

},{"../Field.mjs":105}],187:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextFilter` component, which is used to filter `Text`
 * fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by text, and it supports
 * inverting the filter.
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
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const INVERTED_OPTIONS = [
    {
        label: 'Matches',
        value: false
    },
    {
        label: 'Does NOT Match',
        value: true
    }
];
const MODE_OPTIONS = [
    {
        label: 'Contains',
        value: 'contains'
    },
    {
        label: 'Exactly',
        value: 'exactly'
    },
    {
        label: 'Begins with',
        value: 'beginsWith'
    },
    {
        label: 'Ends with',
        value: 'endsWith'
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        inverted: INVERTED_OPTIONS[0].value,
        value: ''
    };
}
/**
 * The `TextFilter` component.
 * @augments React.Component
 */ const TextFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            mode: _react.default.PropTypes.oneOf(MODE_OPTIONS.map((i)=>i.value)),
            inverted: _react.default.PropTypes.boolean,
            value: _react.default.PropTypes.string
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        const mode = e.target.value;
        this.updateFilter({
            mode
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */ toggleInverted (inverted) {
        this.updateFilter({
            inverted
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Handles a change in the value of the filter.
	 * @param {object} e The event object.
	 */ updateValue (e) {
        this.updateFilter({
            value: e.target.value
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { field, filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.toggleInverted,
            options: INVERTED_OPTIONS,
            value: filter.inverted
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectMode,
            options: MODE_OPTIONS,
            value: mode.value
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: true,
            onChange: this.updateValue,
            placeholder: placeholder,
            ref: "focusTarget",
            value: this.props.filter.value
        }));
    },
    displayName: "TextFilter"
});
const _default = TextFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined,"react-dom":undefined}],188:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextColumn` component, which is used to render
 * the value of a `Textarea` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextColumn.default;
    }
});
const _TextColumn = /*#__PURE__*/ _interop_require_default(require("../text/TextColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextColumn.mjs":185}],189:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextareaField` component, which is used to render
 * a textarea field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `TextareaField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const _default = _Field.default.create({
    displayName: 'TextareaField',
    statics: {
        type: 'Textarea'
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const { height } = this.props;
        const styles = {
            height: height,
            whiteSpace: 'pre-wrap',
            overflowY: 'auto'
        };
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            multiline: true,
            noedit: true,
            style: styles
        }, this.props.value);
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { height, path, style, value } = this.props;
        const styles = _object_spread({
            height: height
        }, style);
        return /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            multiline: true,
            name: this.getInputName(path),
            onChange: this.valueChanged,
            ref: "focusTarget",
            style: styles,
            value: value
        });
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],190:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Textarea` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],191:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `ArrayColumn` component, which is used to render
 * the value of a `TextArray` field in a list view.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _ArrayColumn.default;
    }
});
const _ArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../components/columns/ArrayColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../../components/columns/ArrayColumn.mjs":100}],192:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextArrayField` component, which is used to render a
 * text array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `TextArrayField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _ArrayField = /*#__PURE__*/ _interop_require_default(require("../../mixins/ArrayField.mjs"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'TextArrayField',
    statics: {
        type: 'TextArray'
    },
    mixins: [
        _ArrayField.default
    ]
});

},{"../../mixins/ArrayField.mjs":104,"../Field.mjs":105}],193:[function(require,module,exports){
/**
 * @file
 * This file defines the `TextArrayFilter` component, which is used to filter
 * `TextArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by text, and it supports
 * inverting the filter.
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
const _reactdom = require("react-dom");
const _elemental = require("../../../admin/client-legacy/App/elemental");
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
const MODE_OPTIONS = [
    {
        label: 'Contains',
        value: 'contains'
    },
    {
        label: 'Exactly',
        value: 'exactly'
    },
    {
        label: 'Begins with',
        value: 'beginsWith'
    },
    {
        label: 'Ends with',
        value: 'endsWith'
    }
];
const PRESENCE_OPTIONS = [
    {
        label: 'At least one element',
        value: 'some'
    },
    {
        label: 'No element',
        value: 'none'
    }
];
/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */ function getDefaultValue() {
    return {
        mode: MODE_OPTIONS[0].value,
        presence: PRESENCE_OPTIONS[0].value,
        value: ''
    };
}
/**
 * The `TextArrayFilter` component.
 * @augments React.Component
 */ const TextArrayFilter = _react.default.createClass({
    propTypes: {
        filter: _react.default.PropTypes.shape({
            mode: _react.default.PropTypes.oneOf(MODE_OPTIONS.map((i)=>i.value)),
            presence: _react.default.PropTypes.oneOf(PRESENCE_OPTIONS.map((i)=>i.value)),
            value: _react.default.PropTypes.string
        })
    },
    statics: {
        getDefaultValue: getDefaultValue
    },
    getDefaultProps () {
        return {
            filter: getDefaultValue()
        };
    },
    /**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */ updateFilter (value) {
        this.props.onChange(_object_spread({}, this.props.filter, value));
    },
    /**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */ selectMode (e) {
        const mode = e.target.value;
        this.updateFilter({
            mode
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */ selectPresence (e) {
        const presence = e.target.value;
        this.updateFilter({
            presence
        });
        (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
    },
    /**
	 * Handles a change in the value of the filter.
	 * @param {object} e The event object.
	 */ updateValue (e) {
        this.updateFilter({
            value: e.target.value
        });
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        const { filter } = this.props;
        const mode = MODE_OPTIONS.filter((i)=>i.value === filter.mode)[0];
        const presence = PRESENCE_OPTIONS.filter((i)=>i.value === filter.presence)[0];
        const beingVerb = mode.value === 'exactly' ? ' is ' : ' ';
        const placeholder = presence.label + beingVerb + mode.label.toLowerCase() + '...';
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectPresence,
            options: PRESENCE_OPTIONS,
            value: presence.value
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormField, null, /*#__PURE__*/ _react.default.createElement(_elemental.FormSelect, {
            onChange: this.selectMode,
            options: MODE_OPTIONS,
            value: mode.value
        })), /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoFocus: true,
            onChange: this.updateValue,
            placeholder: placeholder,
            ref: "focusTarget",
            value: this.props.filter.value
        }));
    },
    displayName: "TextArrayFilter"
});
const _default = TextArrayFilter;

},{"../../../admin/client-legacy/App/elemental":65,"react":undefined,"react-dom":undefined}],194:[function(require,module,exports){
/**
 * @file
 * This file defines the `UrlColumn` component, which is used to render the
 * value of a `Url` field in a list view.
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
const _ItemsTableCell = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableCell.mjs"));
const _ItemsTableValue = /*#__PURE__*/ _interop_require_default(require("../../components/ItemsTableValue.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * The `UrlColumn` component.
 * @augments React.Component
 */ const UrlColumn = _react.default.createClass({
    displayName: 'UrlColumn',
    propTypes: {
        col: _react.default.PropTypes.object,
        data: _react.default.PropTypes.object
    },
    /**
	 * Renders the value of the field, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or undefined when the field is empty.
	 */ renderValue () {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return;
        // if the value doesn't start with a prototcol, assume http for the href
        let href = value;
        if (href && !/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
            href = 'http://' + value;
        }
        // strip the protocol from the link if it's http(s)
        const label = value.replace(/^https?\:\/\//i, '');
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableValue.default, {
            to: href,
            padded: true,
            exterior: true,
            field: this.props.col.type
        }, label);
    },
    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */ render () {
        return /*#__PURE__*/ _react.default.createElement(_ItemsTableCell.default, null, this.renderValue());
    }
});
const _default = UrlColumn;

},{"../../components/ItemsTableCell.mjs":97,"../../components/ItemsTableValue.mjs":98,"react":undefined}],195:[function(require,module,exports){
/**
 * @file
 * This file defines the `UrlField` component, which is used to render a URL
 * field in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * The `UrlField` component.
 * @augments Field
 */ "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Field = /*#__PURE__*/ _interop_require_default(require("../Field.mjs"));
const _elemental = require("../../../admin/client-legacy/App/elemental");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = _Field.default.create({
    displayName: 'URLField',
    statics: {
        type: 'Url'
    },
    /**
	 * Opens the URL in a new window.
	 */ openValue () {
        let href = this.props.value;
        if (!href) return;
        if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
            href = 'http://' + href;
        }
        window.open(href);
    },
    /**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */ renderField () {
        const { value } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            autoComplete: "off",
            name: this.getInputName(this.props.path),
            onChange: this.valueChanged,
            ref: "focusTarget",
            type: "url",
            value: value
        }), this.renderThumb());
    },
    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */ renderValue () {
        const { value } = this.props;
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_elemental.FormInput, {
            noedit: true,
            onClick: value && this.openValue
        }, value), this.renderThumb());
    },
    /**
	 * Renders a thumbnail of the URL, if the `thumb` prop is true.
	 * @returns {React.Element} The rendered thumbnail.
	 */ renderThumb () {
        const { thumb, value } = this.props;
        if (thumb === true) {
            return /*#__PURE__*/ _react.default.createElement("img", {
                src: value
            });
        }
        return '';
    }
});

},{"../../../admin/client-legacy/App/elemental":65,"../Field.mjs":105,"react":undefined}],196:[function(require,module,exports){
/**
 * @file
 * This file re-exports the `TextFilter` component, which is used to filter
 * `Url` fields in the KeystoneJS Admin UI.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _TextFilter.default;
    }
});
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../text/TextFilter.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

},{"../text/TextFilter.mjs":187}],197:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return bindFunctions;
    }
});
function bindFunctions(functions) {
    functions.forEach((f)=>{
        const fn = this[f];
        if (typeof fn === 'function') {
            this[f] = fn.bind(this);
        }
    });
}

},{}],198:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return evalDependsOn;
    }
});
function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
}
function evalDependsOn(dependsOn, values) {
    if (!isObject(dependsOn) || !Object.keys(dependsOn).length) {
        return true;
    }
    const vals = values !== null && values !== void 0 ? values : {};
    return Object.keys(dependsOn).every(function(key) {
        const expected = dependsOn[key];
        const actual = vals[key];
        if (Array.isArray(expected)) return expected.includes(actual);
        return actual === expected;
    });
}

},{}],199:[function(require,module,exports){
/** Converts a space/comma-delimited string (or existing array) to a trimmed, filtered string array. */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" 
, {
    enumerable: true,
    get: function() {
        return listToArray;
    }
});
function listToArray(str) {
    if (Array.isArray(str)) return str;
    if (!str || typeof str !== 'string') return [];
    return str.replace(/,/g, ' ').split(' ').map((s)=>s.trim()).filter(Boolean);
}

},{}],200:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * Format a display name from first and last name, handling CJK name ordering.
 */ "default" 
, {
    enumerable: true,
    get: function() {
        return displayName;
    }
});
// Inlined from the abandoned 'display-name' npm package.
// CJK regex covers Chinese/Japanese/Korean Unicode blocks.
// eslint-disable-next-line no-irregular-whitespace, sonarjs/duplicates-in-character-class
const CJKRegex = /[⺀-⻾　-〾぀-ゞ゠-ヾ㇀-㇮ㇰ-ㇾ㈀-㋾㌀-㏾㐀-䶾一-鿾豈-﫾︰-﹎]|[\ud840-\ud868\ud86a-\ud86c][\udc00-\udfff]|\ud82c[\udc00-\udcfe]|\ud869[\udc00-\udede\udf00-\udfff]|\ud86d[\udc00-\udf3e\udf40-\udfff]|\ud86e[\udc00-\udc1e]|\ud87e[\udc00-\ude1e]/;
function displayName(firstName, lastName) {
    var _firstName_, _lastName_;
    const isFirst = typeof firstName === 'string' && firstName.length > 0;
    const isLast = typeof lastName === 'string' && lastName.length > 0;
    if (!isFirst) return isLast ? lastName : '';
    if (!isLast) return firstName;
    // isFirst/isLast above verified both strings are non-empty.
    const endCJK = CJKRegex.test((_firstName_ = firstName[firstName.length - 1]) !== null && _firstName_ !== void 0 ? _firstName_ : '');
    const startCJK = CJKRegex.test((_lastName_ = lastName[0]) !== null && _lastName_ !== void 0 ? _lastName_ : '');
    if (endCJK && startCJK) return lastName + firstName;
    if (!endCJK && startCJK) return lastName + firstName;
    if (endCJK && !startCJK) return firstName + lastName;
    return firstName + ' ' + lastName;
}

},{}],201:[function(require,module,exports){
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */

'use strict';

/**
 * Module exports.
 * @public
 */

module.exports = bytes;
module.exports.format = format;
module.exports.parse = parse;

/**
 * Module variables.
 * @private
 */

var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;

var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

var map = {
  b:  1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};

var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
 *
 * @param {string|number} value
 * @param {{
 *  case: [string],
 *  decimalPlaces: [number]
 *  fixedDecimals: [boolean]
 *  thousandsSeparator: [string]
 *  unitSeparator: [string]
 *  }} [options] bytes options.
 *
 * @returns {string|number|null}
 */

function bytes(value, options) {
  if (typeof value === 'string') {
    return parse(value);
  }

  if (typeof value === 'number') {
    return format(value, options);
  }

  return null;
}

/**
 * Format the given value in bytes into a string.
 *
 * If the value is negative, it is kept as such. If it is a float,
 * it is rounded.
 *
 * @param {number} value
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]
 * @param {number} [options.fixedDecimals=false]
 * @param {string} [options.thousandsSeparator=]
 * @param {string} [options.unit=]
 * @param {string} [options.unitSeparator=]
 *
 * @returns {string|null}
 * @public
 */

function format(value, options) {
  if (!Number.isFinite(value)) {
    return null;
  }

  var mag = Math.abs(value);
  var thousandsSeparator = (options && options.thousandsSeparator) || '';
  var unitSeparator = (options && options.unitSeparator) || '';
  var decimalPlaces = (options && options.decimalPlaces !== undefined) ? options.decimalPlaces : 2;
  var fixedDecimals = Boolean(options && options.fixedDecimals);
  var unit = (options && options.unit) || '';

  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.pb) {
      unit = 'PB';
    } else if (mag >= map.tb) {
      unit = 'TB';
    } else if (mag >= map.gb) {
      unit = 'GB';
    } else if (mag >= map.mb) {
      unit = 'MB';
    } else if (mag >= map.kb) {
      unit = 'KB';
    } else {
      unit = 'B';
    }
  }

  var val = value / map[unit.toLowerCase()];
  var str = val.toFixed(decimalPlaces);

  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, '$1');
  }

  if (thousandsSeparator) {
    str = str.split('.').map(function (s, i) {
      return i === 0
        ? s.replace(formatThousandsRegExp, thousandsSeparator)
        : s
    }).join('.');
  }

  return str + unitSeparator + unit;
}

/**
 * Parse the string value into an integer in bytes.
 *
 * If no unit is given, it is assumed the value is in bytes.
 *
 * @param {number|string} val
 *
 * @returns {number|null}
 * @public
 */

function parse(val) {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }

  if (typeof val !== 'string') {
    return null;
  }

  // Test if the string passed is valid
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = 'b';

  if (!results) {
    // Nothing could be extracted from the given string
    floatValue = parseInt(val, 10);
    unit = 'b'
  } else {
    // Retrieve the value and the unit
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }

  if (isNaN(floatValue)) {
    return null;
  }

  return Math.floor(map[unit] * floatValue);
}

},{}],202:[function(require,module,exports){
var e={fetch_format:"f",crop:"c",effect:"e",flags:"fl",gravity:"g",height:"h",radius:"r",quality:"q",width:"w",dpr:"dpr"};module.exports=function(o,r){if(void 0===r&&(r={}),!r.cloud_name)throw Error("options.cloud_name required");var t=r.secure?"https":"http",i=r.source||"upload",n=Object.keys(r).map(function(o){var t=e[o];if(t)return t+"_"+r[o]}).filter(Boolean).join(","),a=r.version&&"v"+r.version;return[t+"://res.cloudinary.com",encodeURIComponent(r.cloud_name),"image",i,n,a,o].filter(Boolean).join("/")};


},{}],"FieldTypes":[function(require,module,exports){
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
    get Columns () {
        return Columns;
    },
    get Fields () {
        return Fields;
    },
    get Filters () {
        return Filters;
    }
});
const _BooleanColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/boolean/BooleanColumn.mjs"));
const _CloudinaryColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinary/CloudinaryColumn.mjs"));
const _CloudinaryImageColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimage/CloudinaryImageColumn.mjs"));
const _CloudinaryImagesColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs"));
const _CodeColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/code/CodeColumn.mjs"));
const _ColorColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/color/ColorColumn.mjs"));
const _DateColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/date/DateColumn.mjs"));
const _DateArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datearray/DateArrayColumn.mjs"));
const _DatetimeColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datetime/DatetimeColumn.mjs"));
const _EmailColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/email/EmailColumn.mjs"));
const _FileColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/file/FileColumn.mjs"));
const _GeoPointColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/geopoint/GeoPointColumn.mjs"));
const _HtmlColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/html/HtmlColumn.mjs"));
const _KeyColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/key/KeyColumn.mjs"));
const _LocalFileColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfile/LocalFileColumn.mjs"));
const _LocalFilesColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfiles/LocalFilesColumn.mjs"));
const _LocationColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/location/LocationColumn.mjs"));
const _MarkdownColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/markdown/MarkdownColumn.mjs"));
const _MoneyColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/money/MoneyColumn.mjs"));
const _NameColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/name/NameColumn.mjs"));
const _NumberColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/number/NumberColumn.mjs"));
const _NumberArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/numberarray/NumberArrayColumn.mjs"));
const _PasswordColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/password/PasswordColumn.mjs"));
const _RelationshipColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/relationship/RelationshipColumn.mjs"));
const _SelectColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/select/SelectColumn.mjs"));
const _TextColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/text/TextColumn.mjs"));
const _TextareaColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarea/TextareaColumn.mjs"));
const _TextArrayColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarray/TextArrayColumn.mjs"));
const _UrlColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/types/url/UrlColumn.mjs"));
const _BooleanField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/boolean/BooleanField.mjs"));
const _CloudinaryField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinary/CloudinaryField.mjs"));
const _CloudinaryImageField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimage/CloudinaryImageField.mjs"));
const _CloudinaryImagesField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimages/CloudinaryImagesField.mjs"));
const _CodeField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/code/CodeField.mjs"));
const _ColorField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/color/ColorField.mjs"));
const _DateField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/date/DateField.mjs"));
const _DateArrayField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datearray/DateArrayField.mjs"));
const _DatetimeField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datetime/DatetimeField.mjs"));
const _EmailField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/email/EmailField.mjs"));
const _FileField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/file/FileField.mjs"));
const _GeoPointField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/geopoint/GeoPointField.mjs"));
const _HtmlField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/html/HtmlField.mjs"));
const _KeyField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/key/KeyField.mjs"));
const _LocalFileField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfile/LocalFileField.mjs"));
const _LocalFilesField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfiles/LocalFilesField.mjs"));
const _LocationField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/location/LocationField.mjs"));
const _MarkdownField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/markdown/MarkdownField.mjs"));
const _MoneyField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/money/MoneyField.mjs"));
const _NameField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/name/NameField.mjs"));
const _NumberField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/number/NumberField.mjs"));
const _NumberArrayField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/numberarray/NumberArrayField.mjs"));
const _PasswordField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/password/PasswordField.mjs"));
const _RelationshipField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/relationship/RelationshipField.mjs"));
const _SelectField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/select/SelectField.mjs"));
const _TextField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/text/TextField.mjs"));
const _TextareaField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarea/TextareaField.mjs"));
const _TextArrayField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarray/TextArrayField.mjs"));
const _UrlField = /*#__PURE__*/ _interop_require_default(require("../../fields/types/url/UrlField.mjs"));
const _BooleanFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/boolean/BooleanFilter.mjs"));
const _CloudinaryFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinary/CloudinaryFilter.mjs"));
const _CloudinaryImageFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimage/CloudinaryImageFilter.mjs"));
const _CloudinaryImagesFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/cloudinaryimages/CloudinaryImagesFilter.mjs"));
const _CodeFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/code/CodeFilter.mjs"));
const _ColorFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/color/ColorFilter.mjs"));
const _DateFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/date/DateFilter.mjs"));
const _DateArrayFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datearray/DateArrayFilter.mjs"));
const _DatetimeFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/datetime/DatetimeFilter.mjs"));
const _EmailFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/email/EmailFilter.mjs"));
const _FileFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/file/FileFilter.mjs"));
const _GeoPointFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/geopoint/GeoPointFilter.mjs"));
const _HtmlFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/html/HtmlFilter.mjs"));
const _KeyFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/key/KeyFilter.mjs"));
const _LocalFileFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfile/LocalFileFilter.mjs"));
const _LocalFilesFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/localfiles/LocalFilesFilter.mjs"));
const _LocationFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/location/LocationFilter.mjs"));
const _MarkdownFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/markdown/MarkdownFilter.mjs"));
const _MoneyFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/money/MoneyFilter.mjs"));
const _NameFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/name/NameFilter.mjs"));
const _NumberFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/number/NumberFilter.mjs"));
const _NumberArrayFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/numberarray/NumberArrayFilter.mjs"));
const _PasswordFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/password/PasswordFilter.mjs"));
const _RelationshipFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/relationship/RelationshipFilter.mjs"));
const _SelectFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/select/SelectFilter.mjs"));
const _TextFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/text/TextFilter.mjs"));
const _TextareaFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarea/TextareaFilter.mjs"));
const _TextArrayFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/textarray/TextArrayFilter.mjs"));
const _UrlFilter = /*#__PURE__*/ _interop_require_default(require("../../fields/types/url/UrlFilter.mjs"));
const _IdColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/components/columns/IdColumn.mjs"));
const _InvalidColumn = /*#__PURE__*/ _interop_require_default(require("../../fields/components/columns/InvalidColumn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Columns = {
    boolean: _BooleanColumn.default,
    cloudinary: _CloudinaryColumn.default,
    cloudinaryimage: _CloudinaryImageColumn.default,
    cloudinaryimages: _CloudinaryImagesColumn.default,
    code: _CodeColumn.default,
    color: _ColorColumn.default,
    date: _DateColumn.default,
    datearray: _DateArrayColumn.default,
    datetime: _DatetimeColumn.default,
    email: _EmailColumn.default,
    file: _FileColumn.default,
    geopoint: _GeoPointColumn.default,
    html: _HtmlColumn.default,
    key: _KeyColumn.default,
    localfile: _LocalFileColumn.default,
    localfiles: _LocalFilesColumn.default,
    location: _LocationColumn.default,
    markdown: _MarkdownColumn.default,
    money: _MoneyColumn.default,
    name: _NameColumn.default,
    number: _NumberColumn.default,
    numberarray: _NumberArrayColumn.default,
    password: _PasswordColumn.default,
    relationship: _RelationshipColumn.default,
    select: _SelectColumn.default,
    text: _TextColumn.default,
    textarea: _TextareaColumn.default,
    textarray: _TextArrayColumn.default,
    url: _UrlColumn.default,
    id: _IdColumn.default,
    __unrecognised__: _InvalidColumn.default
};
const Fields = {
    boolean: _BooleanField.default,
    cloudinary: _CloudinaryField.default,
    cloudinaryimage: _CloudinaryImageField.default,
    cloudinaryimages: _CloudinaryImagesField.default,
    code: _CodeField.default,
    color: _ColorField.default,
    date: _DateField.default,
    datearray: _DateArrayField.default,
    datetime: _DatetimeField.default,
    email: _EmailField.default,
    file: _FileField.default,
    geopoint: _GeoPointField.default,
    html: _HtmlField.default,
    key: _KeyField.default,
    localfile: _LocalFileField.default,
    localfiles: _LocalFilesField.default,
    location: _LocationField.default,
    markdown: _MarkdownField.default,
    money: _MoneyField.default,
    name: _NameField.default,
    number: _NumberField.default,
    numberarray: _NumberArrayField.default,
    password: _PasswordField.default,
    relationship: _RelationshipField.default,
    select: _SelectField.default,
    text: _TextField.default,
    textarea: _TextareaField.default,
    textarray: _TextArrayField.default,
    url: _UrlField.default
};
const Filters = {
    boolean: _BooleanFilter.default,
    cloudinary: _CloudinaryFilter.default,
    cloudinaryimage: _CloudinaryImageFilter.default,
    cloudinaryimages: _CloudinaryImagesFilter.default,
    code: _CodeFilter.default,
    color: _ColorFilter.default,
    date: _DateFilter.default,
    datearray: _DateArrayFilter.default,
    datetime: _DatetimeFilter.default,
    email: _EmailFilter.default,
    file: _FileFilter.default,
    geopoint: _GeoPointFilter.default,
    html: _HtmlFilter.default,
    key: _KeyFilter.default,
    localfile: _LocalFileFilter.default,
    localfiles: _LocalFilesFilter.default,
    location: _LocationFilter.default,
    markdown: _MarkdownFilter.default,
    money: _MoneyFilter.default,
    name: _NameFilter.default,
    number: _NumberFilter.default,
    numberarray: _NumberArrayFilter.default,
    password: _PasswordFilter.default,
    relationship: _RelationshipFilter.default,
    select: _SelectFilter.default,
    text: _TextFilter.default,
    textarea: _TextareaFilter.default,
    textarray: _TextArrayFilter.default,
    url: _UrlFilter.default
};

},{"../../fields/components/columns/IdColumn.mjs":102,"../../fields/components/columns/InvalidColumn.mjs":103,"../../fields/types/boolean/BooleanColumn.mjs":106,"../../fields/types/boolean/BooleanField.mjs":107,"../../fields/types/boolean/BooleanFilter.mjs":108,"../../fields/types/cloudinary/CloudinaryColumn.mjs":109,"../../fields/types/cloudinary/CloudinaryField.mjs":110,"../../fields/types/cloudinary/CloudinaryFilter.mjs":111,"../../fields/types/cloudinaryimage/CloudinaryImageColumn.mjs":112,"../../fields/types/cloudinaryimage/CloudinaryImageField.mjs":113,"../../fields/types/cloudinaryimage/CloudinaryImageFilter.mjs":114,"../../fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs":115,"../../fields/types/cloudinaryimages/CloudinaryImagesField.mjs":116,"../../fields/types/cloudinaryimages/CloudinaryImagesFilter.mjs":117,"../../fields/types/code/CodeColumn.mjs":119,"../../fields/types/code/CodeField.mjs":120,"../../fields/types/code/CodeFilter.mjs":121,"../../fields/types/color/ColorColumn.mjs":122,"../../fields/types/color/ColorField.mjs":123,"../../fields/types/color/ColorFilter.mjs":124,"../../fields/types/date/DateColumn.mjs":127,"../../fields/types/date/DateField.mjs":128,"../../fields/types/date/DateFilter.mjs":129,"../../fields/types/datearray/DateArrayColumn.mjs":130,"../../fields/types/datearray/DateArrayField.mjs":131,"../../fields/types/datearray/DateArrayFilter.mjs":132,"../../fields/types/datetime/DatetimeColumn.mjs":133,"../../fields/types/datetime/DatetimeField.mjs":134,"../../fields/types/datetime/DatetimeFilter.mjs":135,"../../fields/types/email/EmailColumn.mjs":136,"../../fields/types/email/EmailField.mjs":137,"../../fields/types/email/EmailFilter.mjs":138,"../../fields/types/file/FileColumn.mjs":139,"../../fields/types/file/FileField.mjs":140,"../../fields/types/file/FileFilter.mjs":141,"../../fields/types/geopoint/GeoPointColumn.mjs":142,"../../fields/types/geopoint/GeoPointField.mjs":143,"../../fields/types/geopoint/GeoPointFilter.mjs":144,"../../fields/types/html/HtmlColumn.mjs":145,"../../fields/types/html/HtmlField.mjs":146,"../../fields/types/html/HtmlFilter.mjs":147,"../../fields/types/key/KeyColumn.mjs":148,"../../fields/types/key/KeyField.mjs":149,"../../fields/types/key/KeyFilter.mjs":150,"../../fields/types/localfile/LocalFileColumn.mjs":151,"../../fields/types/localfile/LocalFileField.mjs":152,"../../fields/types/localfile/LocalFileFilter.mjs":153,"../../fields/types/localfiles/LocalFilesColumn.mjs":154,"../../fields/types/localfiles/LocalFilesField.mjs":155,"../../fields/types/localfiles/LocalFilesFilter.mjs":156,"../../fields/types/location/LocationColumn.mjs":157,"../../fields/types/location/LocationField.mjs":158,"../../fields/types/location/LocationFilter.mjs":159,"../../fields/types/markdown/MarkdownColumn.mjs":160,"../../fields/types/markdown/MarkdownField.mjs":161,"../../fields/types/markdown/MarkdownFilter.mjs":162,"../../fields/types/money/MoneyColumn.mjs":164,"../../fields/types/money/MoneyField.mjs":165,"../../fields/types/money/MoneyFilter.mjs":166,"../../fields/types/name/NameColumn.mjs":167,"../../fields/types/name/NameField.mjs":168,"../../fields/types/name/NameFilter.mjs":169,"../../fields/types/number/NumberColumn.mjs":170,"../../fields/types/number/NumberField.mjs":171,"../../fields/types/number/NumberFilter.mjs":172,"../../fields/types/numberarray/NumberArrayColumn.mjs":173,"../../fields/types/numberarray/NumberArrayField.mjs":174,"../../fields/types/numberarray/NumberArrayFilter.mjs":175,"../../fields/types/password/PasswordColumn.mjs":176,"../../fields/types/password/PasswordField.mjs":177,"../../fields/types/password/PasswordFilter.mjs":178,"../../fields/types/relationship/RelationshipColumn.mjs":179,"../../fields/types/relationship/RelationshipField.mjs":180,"../../fields/types/relationship/RelationshipFilter.mjs":181,"../../fields/types/select/SelectColumn.mjs":182,"../../fields/types/select/SelectField.mjs":183,"../../fields/types/select/SelectFilter.mjs":184,"../../fields/types/text/TextColumn.mjs":185,"../../fields/types/text/TextField.mjs":186,"../../fields/types/text/TextFilter.mjs":187,"../../fields/types/textarea/TextareaColumn.mjs":188,"../../fields/types/textarea/TextareaField.mjs":189,"../../fields/types/textarea/TextareaFilter.mjs":190,"../../fields/types/textarray/TextArrayColumn.mjs":191,"../../fields/types/textarray/TextArrayField.mjs":192,"../../fields/types/textarray/TextArrayFilter.mjs":193,"../../fields/types/url/UrlColumn.mjs":194,"../../fields/types/url/UrlField.mjs":195,"../../fields/types/url/UrlFilter.mjs":196}]},{},[]);
