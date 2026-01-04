import { p as propTypesExports, c as css_1, r as reactExports, $ as compose_1, q as createRoot, T as TransitionGroup, C as CSSTransition } from './shared-CG1ixHyk.js';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

/**
	Validate Hex
	==============================

	@param {String} hex

	1. remove hash if present
	2. convert from 3 to 6 digit color code & ensure valid hex
*/

function validateHex(color) {
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
	Fade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and applies an alpha value.

	@param {String} color
	@param {Number} opacity (0-100)

	1. convert hex to RGB
	2. combine and add alpha channel
*/

function fade(color) {
  let opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
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
	Shade Color
	==============================

	Takes a hexidecimal color, converts it to RGB and lightens or darkens

	@param {String} color
	@param {Number} opacity (0-100)

	1. do fancy RGB bitwise operations
	2. combine back into a hex value
*/

function shade(color, percent) {
  const decimalFraction = percent / 100;
  const hex = validateHex(color);

  // 1.
  let f = parseInt(hex, 16);
  let t = decimalFraction < 0 ? 0 : 255;
  let p = decimalFraction < 0 ? decimalFraction * -1 : decimalFraction;
  const R = f >> 16;
  const G = f >> 8 & 0x00FF;
  const B = f & 0x0000FF;

  // 2.
  return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

// shade helpers
const lighten = shade;
function darken(color, percent) {
  return shade(color, percent * -1);
}

/**
	Blend Color
	==============================

	Takes two hexidecimal colors and blend them together

	@param {String} color1
	@param {String} color2
	@param {Number} percent (0-100)

	1. do fancy RGB bitwise operations
	2. combine back into a hex value
*/

function blend(color1, color2, percent) {
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

/* eslint-disable key-spacing */
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
  linkHover: lighten('#1385e5', 10),
  text: '#1A1A1A',
  // contextual
  success: '#34c240',
  create: '#34c240',
  // alias for success
  primary: '#1385e5',
  info: '#1385e5',
  // alias for primary
  warning: '#FA3',
  danger: '#d64242',
  error: '#d64242',
  // alias for danger

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
    borderColor: blend(theme.color.primary, theme.color.body, 60),
    textColor: theme.color.primary
  },
  primary: {
    bgColor: theme.color.primary,
    borderColor: blend(theme.color.primary, theme.color.body, 60),
    textColor: theme.color.primary
  },
  success: {
    bgColor: theme.color.success,
    borderColor: blend(theme.color.success, theme.color.body, 60),
    textColor: theme.color.success
  },
  warning: {
    bgColor: theme.color.warning,
    borderColor: blend(theme.color.warning, theme.color.body, 60),
    textColor: theme.color.warning
  },
  danger: {
    bgColor: theme.color.danger,
    borderColor: blend(theme.color.danger, theme.color.body, 60),
    textColor: theme.color.danger
  }
};

// blank state

theme.blankstate = {
  background: darken(theme.color.body, 4),
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
    noedit: darken(theme.color.body, 2)
  },
  placeholderColor: '#aaa',
  lineHeight: theme.component.lineHeight,
  height: theme.component.height,
  border: {
    color: {
      default: '#ccc',
      focus: theme.color.info,
      hover: '#bbb',
      noedit: darken(theme.color.body, 8)
    },
    radius: theme.borderRadius.default,
    width: 1
  },
  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
  boxShadowFocus: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${fade(theme.color.info, 10)}`,
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
      background: fade(theme.color.danger, 10),
      border: fade(theme.color.danger, 10),
      text: theme.color.danger
    },
    info: {
      background: fade(theme.color.primary, 10),
      border: fade(theme.color.primary, 10),
      text: theme.color.primary
    },
    success: {
      background: fade(theme.color.success, 10),
      border: fade(theme.color.success, 10),
      text: theme.color.success
    },
    warning: {
      background: fade(theme.color.warning, 10),
      border: fade(theme.color.warning, 10),
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

const colors$4 = {
  danger: theme.alert.color.danger,
  error: theme.alert.color.danger,
  info: theme.alert.color.info,
  success: theme.alert.color.success,
  warning: theme.alert.color.warning
};

// ==============================
// Alert
// ==============================


// Prepare variants
const colorVariants$4 = {};
Object.keys(colors$4).forEach(color => {
  colorVariants$4[color] = {
    backgroundColor: colors$4[color].background,
    borderColor: colors$4[color].border,
    color: colors$4[color].text
  };
});

// Prepare headings
const headingTagnames = {};
['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
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
const classes$s = {
  alert: {
    borderColor: 'transparent',
    borderRadius: theme.alert.borderRadius,
    borderStyle: 'solid',
    borderWidth: theme.alert.borderWidth,
    margin: theme.alert.margin,
    padding: theme.alert.padding
  },
  // tagnames
  a: linkStyles,
  Link: linkStyles,
  strong: {
    fontWeight: 500
  },
  // headings
  ...headingTagnames,
  // colors
  ...colorVariants$4
};

// clone children if a class exists for the tagname
const cloneWithClassnames = c => {
  const type = c.type && c.type.displayName ? c.type.displayName : c.type || null;
  if (!type || !classes$s[type]) return c;
  return /*#__PURE__*/reactExports.cloneElement(c, {
    className: css_1(classes$s[type])
  });
};
function Alert(_ref) {
  let {
    children,
    className,
    color,
    component: Component,
    ...props
  } = _ref;
  props.className = css_1(classes$s.alert, classes$s[color], className);
  props.children = reactExports.Children.map(children, cloneWithClassnames);
  return /*#__PURE__*/reactExports.createElement(Component, _extends({}, props, {
    "data-alert-type": color
  }));
}
Alert.propTypes = {
  color: propTypesExports.oneOf(Object.keys(colors$4)).isRequired,
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string])
};
Alert.defaultProps = {
  component: 'div'
};

function BlankState(_ref) {
  let {
    className,
    children,
    heading,
    component: Component,
    ...props
  } = _ref;
  props.className = css_1(classes$r.container, className);
  return /*#__PURE__*/reactExports.createElement(Component, props, !!heading && /*#__PURE__*/reactExports.createElement("h2", {
    "data-e2e-blank-state-heading": true,
    className: css_1(classes$r.heading)
  }, heading), children);
}
BlankState.propTypes = {
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]).isRequired,
  heading: propTypesExports.string
};
BlankState.defaultProps = {
  component: 'div'
};

/* eslint quote-props: ["error", "as-needed"] */

const classes$r = {
  container: {
    backgroundColor: theme.blankstate.background,
    borderRadius: theme.blankstate.borderRadius,
    color: theme.blankstate.color,
    paddingBottom: theme.blankstate.paddingVertical,
    paddingLeft: theme.blankstate.paddingHorizontal,
    paddingRight: theme.blankstate.paddingHorizontal,
    paddingTop: theme.blankstate.paddingVertical,
    textAlign: 'center'
  },
  heading: {
    color: 'inherit',
    ':last-child': {
      marginBottom: 0
    }
  }
};

/**
	Linear Gradient
	==============================

	Short-hand helper for adding a linear gradient to your component.

	- @param {String} sideOrCorner
	- @param {String} top
	- @param {String} bottom
	- @param {String} base (optional)
	- @returns {Object} css linear gradient declaration

	Spread the declaration into your component class:
	------------------------------

	myComponentClass: {
		...linearGradient(red, blue),
	}
*/

function linearGradient(direction, top, bottom) {
  let base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  return {
    background: `linear-gradient(${direction}, ${top} 0%, ${bottom} 100%) ${base}`
  };
}

// Vertical Gradient
function gradientVertical(top, bottom, base) {
  return linearGradient('to bottom', top, bottom, base);
}

// right
function borderRightRadius(radius) {
  return {
    borderBottomRightRadius: radius,
    borderTopRightRadius: radius
  };
}

// left
function borderLeftRadius(radius) {
  return {
    borderBottomLeftRadius: radius,
    borderTopLeftRadius: radius
  };
}

// Common Styles
// ----------------

const common = {
  // Base Button
  // ----------------
  base: {
    'appearance': 'none',
    'background': 'none',
    'borderWidth': theme.button.borderWidth,
    'borderStyle': 'solid',
    'borderColor': 'transparent',
    'borderRadius': theme.button.borderRadius,
    'cursor': 'pointer',
    'display': 'inline-block',
    'fontWeight': theme.button.font.weight,
    'height': theme.component.height,
    'lineHeight': theme.component.lineHeight,
    'marginBottom': 0,
    'padding': `0 ${theme.button.paddingHorizontal}`,
    'outline': 0,
    'textAlign': 'center',
    'touchAction': 'manipulation',
    'userSelect': 'none',
    'verticalAlign': 'middle',
    'whiteSpace': 'nowrap',
    ':hover': {
      color: theme.button.default.textColor,
      textDecoration: 'none'
    },
    ':focus': {
      color: theme.button.default.textColor,
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
    fontSize: theme.font.size.large
  },
  default: {
    fontSize: theme.font.size.default
  },
  small: {
    fontSize: theme.font.size.small
  },
  xsmall: {
    fontSize: theme.font.size.xsmall,
    lineHeight: '1.9',
    paddingLeft: '.66em',
    paddingRight: '.66em'
  }
};

// Fill Variant
// ----------------
function buttonFillVariant(textColor, bgColor) {
  const hoverStyles = {
    ...gradientVertical(lighten(bgColor, 10), darken(bgColor, 5)),
    borderColor: `${darken(bgColor, 5)} ${darken(bgColor, 10)} ${darken(bgColor, 15)}`,
    boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
    color: textColor,
    outline: 'none'
  };
  const focusStyles = {
    ...gradientVertical(lighten(bgColor, 10), darken(bgColor, 5)),
    borderColor: `${darken(bgColor, 5)} ${darken(bgColor, 10)} ${darken(bgColor, 15)}`,
    boxShadow: `0 0 0 3px ${fade(bgColor, 25)}`,
    color: textColor,
    outline: 'none'
  };
  const activeStyles = {
    backgroundColor: darken(bgColor, 10),
    backgroundImage: 'none',
    borderColor: `${darken(bgColor, 25)} ${darken(bgColor, 15)} ${darken(bgColor, 10)}`,
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
  };
  return {
    base: {
      ...gradientVertical(lighten(bgColor, 5), darken(bgColor, 10), bgColor),
      'borderColor': `${darken(bgColor, 10)} ${darken(bgColor, 20)} ${darken(bgColor, 25)}`,
      'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      'color': textColor,
      'fontWeight': 400,
      'textShadow': '0 -1px 0 rgba(0, 0, 0, 0.25)',
      ':hover': hoverStyles,
      ':focus': focusStyles,
      ':active': activeStyles
    },
    active: activeStyles
  };
}
// TODO: This is pretty hacky, needs to be consolidated with the Variant() method
// above (needs more theme variables to be implemented though)
function buttonFillDefault() {
  const borderColor = theme.input.border.color.default;
  const hoverStyles = {
    ...gradientVertical('#fff', '#eee'),
    borderColor: `${darken(borderColor, 5)} ${darken(borderColor, 5)} ${darken(borderColor, 10)}`,
    boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
    color: theme.color.text
  };
  const focusStyles = {
    borderColor: theme.color.primary,
    boxShadow: `0 0 0 3px ${fade(theme.color.primary, 10)}`,
    color: theme.color.text,
    outline: 'none'
  };
  const activeStyles = {
    background: '#e6e6e6',
    borderColor: darken(borderColor, 10),
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    color: theme.color.text
  };
  return {
    base: {
      ...gradientVertical('#fafafa', '#eaeaea'),
      'borderColor': `${borderColor} ${darken(borderColor, 6)} ${darken(borderColor, 12)}`,
      'color': theme.color.text,
      'textShadow': '0 1px 0 white',
      ':hover': hoverStyles,
      ':focus': focusStyles,
      ':active': activeStyles
    },
    // gross hack
    active: {
      ...activeStyles,
      ':hover': activeStyles,
      ':focus': {
        ...activeStyles,
        ...focusStyles,
        boxShadow: `0 0 0 3px ${fade(theme.color.primary, 10)}, inset 0 1px 2px rgba(0, 0, 0, 0.1)`
      },
      ':active': activeStyles
    }
  };
}
const fill = color => {
  switch (color) {
    case 'default':
      return buttonFillDefault();
    case 'cancel':
    case 'delete':
      return buttonFillVariant('white', theme.button.danger.bgColor);
    default:
      return buttonFillVariant('white', theme.button[color].bgColor);
  }
};

// Hollow Variant
// ----------------
function buttonHollowVariant(textColor, borderColor) {
  const focusAndHoverStyles = {
    backgroundImage: 'none',
    backgroundColor: fade(borderColor, 15),
    borderColor: darken(borderColor, 15),
    boxShadow: 'none',
    color: textColor,
    outline: 'none'
  };
  const focusOnlyStyles = {
    boxShadow: `0 0 0 3px ${fade(borderColor, 10)}`
  };
  const activeStyles = {
    backgroundColor: fade(borderColor, 35),
    borderColor: darken(borderColor, 25),
    boxShadow: 'none'
  };
  return {
    base: {
      'background': 'none',
      'borderColor': borderColor,
      'color': textColor,
      ':hover': focusAndHoverStyles,
      ':focus ': _extends({}, focusAndHoverStyles, focusOnlyStyles),
      ':active': activeStyles
    },
    active: activeStyles
  };
}
const hollow = color => {
  // TODO: better handling of cancel and delete colors
  if (color === 'cancel' || color === 'delete') color = 'danger';
  return buttonHollowVariant(theme.button[color].bgColor, theme.button[color].borderColor);
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
  const styles = buttonLinkVariant(theme.color.gray40, theme.color.danger);
  const hoverStyles = {
    ...gradientVertical(lighten(theme.color.danger, 10), darken(theme.color.danger, 10)),
    backgroundColor: theme.color.danger,
    borderColor: `${darken(theme.color.danger, 4)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 12)}`,
    boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
    color: 'white',
    textDecoration: 'none'
  };
  const activeStyles = {
    backgroundColor: darken(theme.color.danger, 4),
    backgroundImage: 'none',
    borderColor: `${darken(theme.color.danger, 12)} ${darken(theme.color.danger, 8)} ${darken(theme.color.danger, 8)}`,
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    color: 'white'
  };
  return {
    base: {
      ...styles.base,
      ':hover': hoverStyles,
      ':focus': hoverStyles,
      ':active': activeStyles
    },
    active: activeStyles
  };
}
const link = color => {
  switch (color) {
    case 'default':
      return buttonLinkVariant(theme.color.link, theme.color.linkHover);
    case 'cancel':
      return buttonLinkVariant(theme.color.gray40, theme.color.danger);
    case 'delete':
      return buttonLinkDelete();
    default:
      return buttonLinkVariant(theme.color[color], theme.color[color]);
  }
};
const styles = {
  common,
  fill,
  hollow,
  link
};

const commonClasses = styles.common;
const stylesheetCache = {};
function getStyleSheet(variant, color) {
  const cacheKey = `${variant}-${color}`;
  if (!stylesheetCache[cacheKey]) {
    const variantStyles = styles[variant](color);
    stylesheetCache[cacheKey] = variantStyles;
  }
  return stylesheetCache[cacheKey];
}
const BUTTON_SIZES = ['large', 'medium', 'small', 'xsmall'];
const BUTTON_VARIANTS = ['fill', 'hollow', 'link'];
const BUTTON_COLORS = ['default', 'primary', 'success', 'warning', 'danger', 'cancel', 'delete'];

// NOTE must NOT be functional component to allow `refs`

class Button extends reactExports.Component {
  render() {
    var {
      active,
      cssStyles,
      block,
      className,
      color,
      component: Tag,
      disabled,
      size,
      variant,
      ...props
    } = this.props;

    // get the styles
    const variantClasses = getStyleSheet(variant, color);
    props.className = css_1(commonClasses.base, commonClasses[size], variantClasses.base, block ? commonClasses.block : null, disabled ? commonClasses.disabled : null, active ? variantClasses.active : null, ...cssStyles);
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
    return /*#__PURE__*/reactExports.createElement(Tag, props);
  }
}
Button.propTypes = {
  active: propTypesExports.bool,
  block: propTypesExports.bool,
  color: propTypesExports.oneOf(BUTTON_COLORS),
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]),
  cssStyles: propTypesExports.arrayOf(propTypesExports.shape({
    _definition: propTypesExports.object,
    _name: propTypesExports.string
  })),
  disabled: propTypesExports.bool,
  href: propTypesExports.string,
  size: propTypesExports.oneOf(BUTTON_SIZES),
  variant: propTypesExports.oneOf(BUTTON_VARIANTS)
};
Button.defaultProps = {
  cssStyles: [],
  color: 'default',
  variant: 'fill'
};

// ==============================
// Center
// ==============================

const classes$q = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

function Center(_ref) {
  let {
    className,
    component: Component,
    height,
    style,
    ...props
  } = _ref;
  props.className = css_1(classes$q.center, className);
  props.style = {
    height,
    ...style
  };
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
Center.propTypes = {
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]),
  height: propTypesExports.oneOfType([propTypesExports.number, propTypesExports.string])
};
Center.defaultProps = {
  component: 'div',
  height: 'auto'
};

const baseColors = {};
['danger', 'info', 'primary', 'success', 'warning'].forEach(color => {
  baseColors[color] = {
    background: fade(theme.color[color], 10),
    backgroundActive: fade(theme.color[color], 20),
    backgroundHover: fade(theme.color[color], 15),
    text: theme.color[color]
  };
});
const invertedColors = {};
['danger', 'info', 'primary', 'success', 'warning'].forEach(color => {
  invertedColors[color + '__inverted'] = {
    background: theme.color[color],
    backgroundActive: lighten(theme.color[color], 5),
    backgroundHover: lighten(theme.color[color], 15),
    text: 'white'
  };
});
const colors$3 = {
  default: {
    background: theme.color.gray10,
    backgroundActive: theme.color.gray20,
    backgroundHover: theme.color.gray15,
    text: theme.color.gray60
  },
  ...baseColors,
  // inverted
  default__inverted: {
    background: theme.color.gray60,
    backgroundActive: lighten(theme.color.gray60, 5),
    backgroundHover: lighten(theme.color.gray60, 15),
    text: 'white'
  },
  ...invertedColors
};

// ==============================
// Alert
// ==============================


// Prepare variants
const colorVariants$3 = {};
Object.keys(colors$3).forEach(color => {
  const hoverStyles = {
    backgroundColor: colors$3[color].backgroundHover
  };
  colorVariants$3['button__' + color] = {
    backgroundColor: colors$3[color].background,
    color: colors$3[color].text,
    ':hover': hoverStyles,
    ':focus': hoverStyles,
    ':active': {
      backgroundColor: colors$3[color].backgroundActive
    }
  };
});
const classes$p = {
  chip: {
    display: 'inline-block',
    fontSize: theme.font.size.small,
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
    ':first-child': {
      ...borderLeftRadius('3em'),
      paddingLeft: '1.1em'
    },
    ':last-child': {
      ...borderRightRadius('3em'),
      paddingRight: '1.1em'
    }
  },
  // provide separation between the label and clear buttons
  // floating stops the margins from collapsing into eaching

  label: {
    marginRight: 1
  },
  clear: {
    marginLeft: 1
  },
  // colors
  ...colorVariants$3
};

function Chip(_ref) {
  let {
    className,
    children,
    color,
    inverted,
    label,
    onClear,
    onClick,
    ...props
  } = _ref;
  props.className = css_1(classes$p.chip, className);
  const labelClassName = css_1(classes$p.button, classes$p.label, classes$p['button__' + color + (inverted ? '__inverted' : '')]);
  const clearClassName = css_1(classes$p.button, classes$p.clear, classes$p['button__' + color + (inverted ? '__inverted' : '')]);
  return /*#__PURE__*/reactExports.createElement("div", props, /*#__PURE__*/reactExports.createElement("button", {
    type: "button",
    onClick: onClick,
    className: labelClassName
  }, label, children), !!onClear && /*#__PURE__*/reactExports.createElement("button", {
    type: "button",
    onClick: onClear,
    className: clearClassName
  }, "\xD7"));
}
Chip.propTypes = {
  color: propTypesExports.oneOf(Object.keys(colors$3)).isRequired,
  inverted: propTypesExports.bool,
  label: propTypesExports.string.isRequired,
  onClear: propTypesExports.func,
  onClick: propTypesExports.func
};
Chip.defaultProps = {
  color: 'default'
};

const sizes$2 = {
  small: theme.container.size.small,
  medium: theme.container.size.medium,
  large: theme.container.size.large
};

// ==============================
// Container
// ==============================


// Prepare sizes
const sizeVariants$2 = {};
Object.keys(sizes$2).forEach(size => {
  sizeVariants$2[size] = {
    maxWidth: sizes$2[size]
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
*/
const clearfixStyles = {
  clear: 'both',
  content: '" "',
  // 1
  display: 'table' // 2
};
const classes$o = {
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: theme.container.gutter,
    paddingRight: theme.container.gutter
  },
  // clear floating children
  clearfix: {
    ':before': clearfixStyles,
    ':after': clearfixStyles
  },
  // sizes
  ...sizeVariants$2
};

function Container(_ref) {
  let {
    className,
    clearFloatingChildren,
    component: Component,
    width,
    ...props
  } = _ref;
  props.className = css_1(classes$o.container, classes$o[width], clearFloatingChildren ? classes$o.clearfix : null, className);
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
Container.propTypes = {
  clearFloatingChildren: propTypesExports.bool,
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]).isRequired,
  width: propTypesExports.oneOf(Object.keys(sizes$2)).isRequired
};
Container.defaultProps = {
  component: 'div',
  width: 'large'
};

// ==============================
// Form
// ==============================

const classes$n = {
  Form: {}
};

class Form extends reactExports.Component {
  getChildContext() {
    return {
      formLayout: this.props.layout,
      labelWidth: this.props.labelWidth
    };
  }
  render() {
    // NOTE `labelWidth` is declared to remove it from `props`, though never used
    const {
      className,
      component: Component,
      labelWidth,
      // eslint-disable-line no-unused-vars
      layout,
      ...props
    } = this.props;
    props.className = css_1(classes$n.Form, classes$n['Form__' + layout], className);
    return /*#__PURE__*/reactExports.createElement(Component, props);
  }
}
Form.childContextTypes = {
  formLayout: propTypesExports.oneOf(['basic', 'horizontal', 'inline']),
  labelWidth: propTypesExports.oneOfType([propTypesExports.number, propTypesExports.string])
};
Form.propTypes = {
  children: propTypesExports.node.isRequired,
  component: propTypesExports.oneOfType([propTypesExports.string, propTypesExports.func]),
  layout: propTypesExports.oneOf(['basic', 'horizontal', 'inline'])
};
Form.defaultProps = {
  component: 'form',
  layout: 'basic'
};

// ==============================
// Form Field
// ==============================

const classes$m = {
  'FormField': {
    marginBottom: '1em',
    position: 'relative'
  },
  // when inside a horizontal form

  'FormField--form-layout-horizontal': {
    [`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
      display: 'table',
      tableLayout: 'fixed',
      width: '100%'
    }
  },
  // inside horizontal form
  // typically for use with submit button inside
  'FormField--offset-absent-label': {
    paddingLeft: theme.form.label.width
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

// ==============================
// Form Label
// ==============================

const classes$l = {
  'FormLabel': {
    color: theme.form.label.color,
    fontSize: theme.form.label.fontSize,
    fontWeight: theme.form.label.fontWeight,
    display: 'inline-block',
    marginBottom: '0.5em'
  },
  // when inside a horizontal form

  'FormLabel--form-layout-horizontal': {
    [`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
      display: 'table-cell',
      lineHeight: theme.component.lineHeight,
      // fix
      marginBottom: 0,
      paddingRight: 5,
      verticalAlign: 'top',
      width: theme.form.label.width
    }
  },
  // crop long text

  'FormLabel--crop-text': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};

function FormLabel(_ref, _ref2) {
  let {
    cssStyles,
    className,
    component: Component,
    cropText,
    htmlFor,
    ...props
  } = _ref;
  let {
    formFieldId,
    formLayout,
    labelWidth
  } = _ref2;
  props.htmlFor = htmlFor || formFieldId;
  props.className = css_1(classes$l.FormLabel, formLayout ? classes$l['FormLabel--form-layout-' + formLayout] : null, cropText ? classes$l['FormLabel--crop-text'] : null, cssStyles);
  if (className) {
    props.className += ' ' + className;
  }
  if (labelWidth) {
    props.style = {
      width: labelWidth,
      ...props.style
    };
  }
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
const stylesShape$2 = {
  _definition: propTypesExports.object,
  _name: propTypesExports.string
};
FormLabel.propTypes = {
  component: propTypesExports.oneOfType([propTypesExports.string, propTypesExports.func]),
  cropText: propTypesExports.bool,
  cssStyles: propTypesExports.oneOfType([propTypesExports.arrayOf(propTypesExports.shape(stylesShape$2)), propTypesExports.shape(stylesShape$2)])
};
FormLabel.defaultProps = {
  component: 'label'
};
FormLabel.contextTypes = {
  formLayout: propTypesExports.oneOf(['basic', 'horizontal', 'inline']),
  formFieldId: propTypesExports.string,
  labelWidth: propTypesExports.oneOfType([propTypesExports.number, propTypesExports.string])
};

class FormField extends reactExports.Component {
  constructor() {
    super();
    this.formFieldId = generateId();
  }
  getChildContext() {
    return {
      formFieldId: this.formFieldId
    };
  }
  render() {
    const {
      formLayout = 'basic',
      labelWidth
    } = this.context;
    const {
      cssStyles,
      children,
      className,
      cropLabel,
      htmlFor,
      label,
      offsetAbsentLabel,
      ...props
    } = this.props;
    props.className = css_1(classes$m.FormField, classes$m['FormField--form-layout-' + formLayout], offsetAbsentLabel ? classes$m['FormField--offset-absent-label'] : null, cssStyles);
    if (className) {
      props.className += ' ' + className;
    }
    if (offsetAbsentLabel && labelWidth) {
      props.style = {
        paddingLeft: labelWidth,
        ...props.style
      };
    }

    // elements
    const componentLabel = label ? /*#__PURE__*/reactExports.createElement(FormLabel, {
      htmlFor: htmlFor,
      cropText: cropLabel
    }, label) : null;
    return /*#__PURE__*/reactExports.createElement("div", _extends({}, props, {
      htmlFor: htmlFor
    }), componentLabel, children);
  }
}
const stylesShape$1 = {
  _definition: propTypesExports.object,
  _name: propTypesExports.string
};
FormField.contextTypes = {
  formLayout: propTypesExports.oneOf(['basic', 'horizontal', 'inline']),
  labelWidth: propTypesExports.oneOfType([propTypesExports.number, propTypesExports.string])
};
FormField.childContextTypes = {
  formFieldId: propTypesExports.string
};
FormField.propTypes = {
  children: propTypesExports.node,
  cropLabel: propTypesExports.bool,
  cssStyles: propTypesExports.oneOfType([propTypesExports.arrayOf(propTypesExports.shape(stylesShape$1)), propTypesExports.shape(stylesShape$1)]),
  htmlFor: propTypesExports.string,
  label: propTypesExports.string,
  offsetAbsentLabel: propTypesExports.bool
};
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ==============================
// Form Input
// ==============================

const classes$k = {
  'FormInput': {
    'appearance': 'none',
    'backgroundColor': theme.input.background.default,
    'backgroundImage': 'none',
    'borderColor': theme.input.border.color.default,
    'borderRadius': theme.input.border.radius,
    'borderStyle': 'solid',
    'borderWidth': theme.input.border.width,
    'boxShadow': theme.input.boxShadow,
    'color': 'inherit',
    // FIXME
    'display': 'block',
    'height': theme.input.height,
    'lineHeight': theme.input.lineHeight,
    'padding': `0 ${theme.input.paddingHorizontal}`,
    'transition': 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
    'width': '100%',
    ':hover': {
      borderColor: theme.input.border.color.hover,
      outline: 0
    },
    ':focus': {
      borderColor: theme.input.border.color.focus,
      boxShadow: theme.input.boxShadowFocus,
      outline: 0
    }
  },
  'FormInput--disabled': {
    backgroundColor: theme.input.background.disabled,
    pointerEvents: 'none'
  },
  // sizes
  'FormInput__size--small': {
    fontSize: theme.font.size.small
  },
  'FormInput__size--large': {
    fontSize: theme.font.size.large
  }
};

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
*/

function concatClassnames(className) {
  return [className].reduce((a, b) => {
    return a.concat(b);
  }, []);
}

/* eslint quote-props: ["error", "as-needed"] */

function FormInputNoedit(_ref) {
  let {
    className,
    component: Component,
    cropText,
    multiline,
    noedit,
    // NOTE not used, just removed from props
    type,
    ...props
  } = _ref;
  props.className = css_1(classes$j.noedit, cropText ? classes$j.cropText : null, multiline ? classes$j.multiline : null, props.href || props.onClick ? classes$j.anchor : null, className);
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
FormInputNoedit.propTypes = {
  component: propTypesExports.oneOfType([propTypesExports.string, propTypesExports.func]),
  cropText: propTypesExports.bool
};
FormInputNoedit.defaultProps = {
  component: 'span'
};
const anchorHoverAndFocusStyles = {
  backgroundColor: fade(theme.color.link, 10),
  borderColor: fade(theme.color.link, 10),
  color: theme.color.link,
  outline: 'none',
  textDecoration: 'underline'
};
const classes$j = {
  noedit: {
    appearance: 'none',
    backgroundColor: theme.input.background.noedit,
    backgroundImage: 'none',
    borderColor: theme.input.border.color.noedit,
    borderRadius: theme.input.border.radius,
    borderStyle: 'solid',
    borderWidth: theme.input.border.width,
    color: theme.color.gray80,
    display: 'inline-block',
    lineHeight: theme.input.lineHeight,
    padding: `0 ${theme.input.paddingHorizontal}`,
    transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
    verticalAlign: 'middle',
    // prevent empty inputs from collapsing by adding content
    ':empty:before': {
      color: theme.color.gray40,
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
    backgroundColor: fade(theme.color.link, 5),
    borderColor: fade(theme.color.link, 10),
    color: theme.color.link,
    marginRight: 5,
    minWidth: 0,
    textDecoration: 'none',
    ':hover': anchorHoverAndFocusStyles,
    ':focus': anchorHoverAndFocusStyles
  }
};

// NOTE must NOT be functional component to allow `refs`

class FormInput extends reactExports.Component {
  blur() {
    this.target.blur();
  }
  focus() {
    this.target.focus();
  }
  render() {
    const {
      cssStyles,
      className,
      disabled,
      id,
      multiline,
      noedit,
      size,
      ...props
    } = this.props;

    // NOTE return a different component for `noedit`
    if (noedit) return /*#__PURE__*/reactExports.createElement(FormInputNoedit, this.props);
    const {
      formFieldId,
      formLayout
    } = this.context;
    props.id = id || formFieldId;
    props.className = css_1(classes$k.FormInput, classes$k['FormInput__size--' + size], disabled ? classes$k['FormInput--disabled'] : null, formLayout ? classes$k['FormInput--form-layout-' + formLayout] : null, ...concatClassnames(cssStyles));
    if (className) {
      props.className += ' ' + className;
    }
    const setRef = n => this.target = n;
    const Tag = multiline ? 'textarea' : 'input';
    return /*#__PURE__*/reactExports.createElement(Tag, _extends({
      ref: setRef,
      disabled: props.disabled
    }, props));
  }
}
const stylesShape = {
  _definition: propTypesExports.object,
  _name: propTypesExports.string
};
FormInput.propTypes = {
  cssStyles: propTypesExports.oneOfType([propTypesExports.arrayOf(propTypesExports.shape(stylesShape)), propTypesExports.shape(stylesShape)]),
  multiline: propTypesExports.bool,
  size: propTypesExports.oneOf(['default', 'small', 'large']),
  type: propTypesExports.string
};
FormInput.defaultProps = {
  size: 'default',
  type: 'text'
};
FormInput.contextTypes = {
  formLayout: propTypesExports.oneOf(['basic', 'horizontal', 'inline']),
  formFieldId: propTypesExports.string
};

// ==============================
// Form Note
// ==============================

const classes$i = {
  note: {
    color: theme.form.note.color,
    fontSize: theme.form.note.fontSize,
    marginTop: theme.spacing.small
  }
};

function FormNote(_ref) {
  let {
    className,
    children,
    component: Component,
    html,
    ...props
  } = _ref;
  props.className = css_1(classes$i.note, className);

  // Property Violation
  if (children && html) {
    console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
  }
  return html ? /*#__PURE__*/reactExports.createElement(Component, _extends({}, props, {
    dangerouslySetInnerHTML: {
      __html: html
    }
  })) : /*#__PURE__*/reactExports.createElement(Component, props, children);
}
FormNote.propTypes = {
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]),
  html: propTypesExports.string
};
FormNote.defaultProps = {
  component: 'div'
};

// ==============================
// Form Select
// ==============================

const classes$h = {
  container: {
    position: 'relative'
  },
  // select node
  select: {
    appearance: 'none',
    backgroundColor: theme.input.background.default,
    backgroundImage: 'none',
    borderColor: theme.input.border.color.default,
    borderBottomColor: darken(theme.input.border.color.default, 4),
    borderTopColor: lighten(theme.input.border.color.default, 4),
    borderRadius: theme.input.border.radius,
    borderStyle: 'solid',
    borderWidth: theme.input.border.width,
    boxShadow: theme.select.boxShadow,
    color: 'inherit',
    // FIXME
    display: 'block',
    height: theme.input.height,
    lineHeight: theme.input.lineHeight,
    padding: `0 ${theme.input.paddingHorizontal}`,
    transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
    width: '100%',
    ':hover': {
      borderColor: theme.input.border.color.hover,
      outline: 0
    },
    ':focus': {
      borderColor: theme.input.border.color.focus,
      boxShadow: theme.input.boxShadowFocus,
      outline: 0
    }
  },
  'select--disabled': {
    backgroundColor: theme.input.background.disabled,
    pointerEvents: 'none'
  },
  // arrows
  arrows: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: theme.input.height,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.input.height
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

class FormSelect extends reactExports.Component {
  render() {
    const {
      children,
      id,
      options,
      ...props
    } = this.props;
    const {
      formFieldId
    } = this.context;
    props.className = css_1(classes$h.select, props.disabled ? classes$h['select--disabled'] : null);
    props.id = id || formFieldId;

    // Property Violation
    if (options && children) {
      console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
    }
    return /*#__PURE__*/reactExports.createElement("div", {
      className: css_1(classes$h.container)
    }, options ? /*#__PURE__*/reactExports.createElement("select", props, options.map(opt => /*#__PURE__*/reactExports.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label))) : /*#__PURE__*/reactExports.createElement("select", props, children), /*#__PURE__*/reactExports.createElement("span", {
      className: css_1(classes$h.arrows, props.disabled ? classes$h['arrows--disabled'] : null)
    }, /*#__PURE__*/reactExports.createElement("span", {
      className: css_1(classes$h.arrow, classes$h.arrowTop)
    }), /*#__PURE__*/reactExports.createElement("span", {
      className: css_1(classes$h.arrow, classes$h.arrowBottom)
    })));
  }
}
FormSelect.contextTypes = {
  formFieldId: propTypesExports.string
};
FormSelect.propTypes = {
  onChange: propTypesExports.func.isRequired,
  options: propTypesExports.arrayOf(propTypesExports.shape({
    label: propTypesExports.string,
    value: propTypesExports.string
  })),
  value: propTypesExports.oneOfType([propTypesExports.number, propTypesExports.string])
};

/* eslint quote-props: ["error", "as-needed"] */

const octicons = {
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

const colors$2 = {
  danger: theme.glyph.color.danger,
  inherit: theme.glyph.color.inherit,
  inverted: theme.glyph.color.inverted,
  primary: theme.glyph.color.primary,
  success: theme.glyph.color.success,
  warning: theme.glyph.color.warning
};

const sizes$1 = {
  small: theme.glyph.size.small,
  medium: theme.glyph.size.medium,
  large: theme.glyph.size.large
};

// ==============================
// Glyph
// ==============================


// Prepare variants
const colorVariants$2 = {};
Object.keys(colors$2).forEach(color => {
  colorVariants$2[`color__${color}`] = {
    color: colors$2[color]
  };
});

// Prepare sizes
const sizeVariants$1 = {};
Object.keys(sizes$1).forEach(size => {
  sizeVariants$1[`size__${size}`] = {
    fontSize: sizes$1[size]
  };
});
const classes$g = {
  glyph: {},
  // Colors
  ...colorVariants$2,
  // Sizes
  ...sizeVariants$1
};

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

function Glyph(_ref) {
  let {
    cssStyles,
    className,
    color,
    component: Component,
    name,
    size,
    style,
    ...props
  } = _ref;
  const colorIsValidType = Object.keys(colors$2).includes(color);
  props.className = css_1(classes$g.glyph, colorIsValidType && classes$g['color__' + color], classes$g['size__' + size], cssStyles) + ` ${octicons[name]}`;
  if (className) {
    props.className += ' ' + className;
  }

  // support random color strings
  props.style = {
    color: !colorIsValidType ? color : null,
    ...style
  };
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
Glyph.propTypes = {
  color: propTypesExports.oneOfType([propTypesExports.oneOf(Object.keys(colors$2)), propTypesExports.string // support random color strings
  ]),
  cssStyles: propTypesExports.shape({
    _definition: propTypesExports.object,
    _name: propTypesExports.string
  }),
  name: propTypesExports.oneOf(Object.keys(octicons)).isRequired,
  size: propTypesExports.oneOf(Object.keys(sizes$1))
};
Glyph.defaultProps = {
  component: 'i',
  color: 'inherit',
  size: 'small'
};

/* eslint quote-props: ["error", "as-needed"] */

function GlyphButton(_ref) {
  let {
    children,
    glyph,
    glyphColor,
    glyphSize,
    glyphStyle,
    position,
    ...props
  } = _ref;
  const isDefault = position === 'default';
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const offset = {};
  if (isLeft) offset.marginRight = '0.5em';
  if (isRight) offset.marginLeft = '0.5em';
  const glyphStyles = {
    ...offset,
    ...glyphStyle
  };
  const icon = /*#__PURE__*/reactExports.createElement(Glyph, {
    cssStyles: classes$f.glyph,
    color: glyphColor,
    name: glyph,
    size: glyphSize,
    style: glyphStyles
  });
  return /*#__PURE__*/reactExports.createElement(Button, props, (isDefault || isLeft) && icon, children, isRight && icon);
}

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphButton.propTypes = {
  glyph: propTypesExports.string,
  glyphColor: propTypesExports.string,
  glyphSize: propTypesExports.string,
  glyphStyle: propTypesExports.object,
  position: propTypesExports.oneOf(['default', 'left', 'right'])
};
GlyphButton.defaultProps = {
  glyphStyle: {},
  position: 'default' // no margin, assumes no children
};
const classes$f = {
  glyph: {
    display: 'inline-block',
    marginTop: '-0.125em',
    // fix icon alignment
    verticalAlign: 'middle'
  }
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
({
  glyph: propTypesExports.string,
  glyphColor: propTypesExports.string,
  glyphSize: propTypesExports.string,
  position: propTypesExports.oneOf(['left', 'right'])
});

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
const GridCol = (props, context) => {
  const gutter = props.gutter || context.gutter;
  const xsmall = props.xsmall || context.xsmall;
  const small = props.small || context.small;
  const medium = props.medium || context.medium;
  const large = props.large || context.large;
  const className = css_1(classes$e['xsmall-' + xsmall], classes$e['small-' + small], classes$e['medium-' + medium], classes$e['large-' + large]);
  const componentClassName = `${className}${props.className ? ' ' + props.className : ''}`;
  const componentStyles = gutter ? {
    paddingLeft: gutter / 2,
    paddingRight: gutter / 2
  } : {};
  return /*#__PURE__*/reactExports.createElement("div", {
    className: componentClassName,
    style: componentStyles
  }, props.children);
};
GridCol.contextTypes = {
  gutter: propTypesExports.number,
  large: propTypesExports.string,
  medium: propTypesExports.string,
  small: propTypesExports.string,
  xsmall: propTypesExports.string
};
GridCol.propTypes = {
  gutter: propTypesExports.number,
  large: propTypesExports.string,
  medium: propTypesExports.string,
  small: propTypesExports.string,
  xsmall: propTypesExports.string
};
const classes$e = {
  ...prepareWidths('xsmall', WIDTHS),
  ...prepareWidths('small', WIDTHS),
  ...prepareWidths('medium', WIDTHS),
  ...prepareWidths('large', WIDTHS)
};

/* eslint-disable guard-for-in */
function prepareWidths(prefix, obj) {
  let classes = {};
  switch (prefix) {
    case 'small':
      for (let prop in obj) {
        classes[prefix + '-' + prop] = {
          [`@media (min-width: ${theme.breakpoint.tabletPortraitMin})`]: {
            width: obj[prop]
          }
        };
      }
      break;
    case 'medium':
      for (let prop in obj) {
        classes[prefix + '-' + prop] = {
          [`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
            width: obj[prop]
          }
        };
      }
      break;
    case 'large':
      for (let prop in obj) {
        classes[prefix + '-' + prop] = {
          [`@media (min-width: ${theme.breakpoint.desktopMin})`]: {
            width: obj[prop]
          }
        };
      }
      break;
    default:
      for (let prop in obj) {
        classes[prefix + '-' + prop] = {
          width: obj[prop]
        };
      }
  }
  return classes;
}

class GridRow extends reactExports.Component {
  getChildContext() {
    return {
      gutter: this.props.gutter,
      xsmall: this.props.xsmall,
      small: this.props.small,
      medium: this.props.medium,
      large: this.props.large
    };
  }
  render() {
    const {
      children,
      className,
      gutter,
      styles = {}
    } = this.props;
    const componentClassName = `${css_1(classes$d.grid)}${className ? ' ' + className : ''}`;
    const componentStyles = _extends(styles, {
      marginLeft: gutter / -2,
      marginRight: gutter / -2
    });
    return /*#__PURE__*/reactExports.createElement("div", {
      className: componentClassName,
      style: componentStyles
    }, children);
  }
}
GridRow.childContextTypes = {
  gutter: propTypesExports.number,
  xsmall: propTypesExports.string,
  small: propTypesExports.string,
  medium: propTypesExports.string,
  large: propTypesExports.string
};
GridRow.propTypes = {
  gutter: propTypesExports.number,
  large: propTypesExports.string,
  medium: propTypesExports.string,
  small: propTypesExports.string,
  xsmall: propTypesExports.string
};
GridRow.defaultProps = {
  gutter: 0,
  xsmall: 'one-whole'
};
const classes$d = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

// NOTE: only accepts InlineGroupSection as a single child

function InlineGroup(_ref) {
  let {
    cssStyles,
    block,
    children,
    className,
    component: Component,
    contiguous,
    ...props
  } = _ref;
  // prepare group className
  props.className = css_1(classes$c.group, !!block && classes$c.block, cssStyles);
  if (className) {
    props.className += ' ' + className;
  }

  // convert children to an array and filter out falsey values
  const buttons = reactExports.Children.toArray(children).filter(i => i);

  // normalize the count
  const count = buttons.length - 1;

  // clone children and apply classNames that glamor can target
  props.children = buttons.map((c, idx) => {
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
    return /*#__PURE__*/reactExports.cloneElement(c, {
      contiguous: contiguous,
      position
    });
  });
  return /*#__PURE__*/reactExports.createElement(Component, props);
}
InlineGroup.propTypes = {
  block: propTypesExports.bool,
  component: propTypesExports.oneOfType([propTypesExports.func, propTypesExports.string]),
  contiguous: propTypesExports.bool,
  cssStyles: propTypesExports.shape({
    _definition: propTypesExports.object,
    _name: propTypesExports.string
  })
};
InlineGroup.defaultProps = {
  component: 'div'
};
const classes$c = {
  group: {
    display: 'inline-flex'
  },
  block: {
    display: 'flex'
  }
};

// ==============================
// Inline Group: Section
// ==============================

const classes$b = {
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
    marginLeft: theme.button.borderWidth * -1
  },
  contiguous__first: {
    borderBottomRightRadius: '0 !important',
    borderTopRightRadius: '0 !important'
  },
  contiguous__last: {
    borderBottomLeftRadius: '0 !important',
    borderTopLeftRadius: '0 !important',
    marginLeft: theme.button.borderWidth * -1
  }
};

// NOTE: Inline Group Section accepts a single child

function InlineGroupSection(_ref) {
  let {
    active,
    cssStyles,
    children,
    className,
    contiguous,
    grow,
    position,
    ...props
  } = _ref;
  // evaluate position
  const separate = position === 'last' || position === 'middle';

  // A `contiguous` section must manipulate it's child directly
  // A separate (default) section just wraps the child
  return contiguous ? /*#__PURE__*/reactExports.cloneElement(children, {
    cssStyles: [classes$b.contiguous, classes$b['contiguous__' + position], active ? classes$b.active : null, grow ? classes$b.grow : null, cssStyles],
    ...props
  }) : /*#__PURE__*/reactExports.createElement("div", _extends({
    className: css_1(!!grow && classes$b.grow, !!separate && classes$b.separate, cssStyles)
  }, props), children);
}
InlineGroupSection.propTypes = {
  active: propTypesExports.bool,
  // buttons only
  children: propTypesExports.element.isRequired,
  contiguous: propTypesExports.bool,
  grow: propTypesExports.bool,
  position: propTypesExports.oneOf(['first', 'last', 'middle', 'only'])
};

// ==============================
// Alert
// ==============================

const classes$a = {
  wrapper: {
    display: 'block',
    height: theme.input.height,
    lineHeight: theme.input.lineHeight
  },
  wrapper__inline: {
    display: 'inline'
  },
  // checkbox or radio
  control: {
    marginRight: '0.5em'
  }
};

function LabelledControl(_ref) {
  let {
    className,
    inline,
    label,
    title,
    ...props
  } = _ref;
  const labelClassName = css_1(classes$a.wrapper, inline && classes$a.wrapper__inline, className);
  return /*#__PURE__*/reactExports.createElement("label", {
    title: title,
    className: labelClassName
  }, /*#__PURE__*/reactExports.createElement("input", _extends({}, props, {
    className: css_1(classes$a.control)
  })), /*#__PURE__*/reactExports.createElement("span", {
    className: css_1(classes$a.label)
  }, label));
}
LabelledControl.propTypes = {
  inline: propTypesExports.bool,
  title: propTypesExports.string,
  type: propTypesExports.oneOf(['checkbox', 'radio']).isRequired
};

const colors$1 = ['danger', 'default', 'inverted', 'primary', 'success', 'warning'];

const sizes = ['small', 'medium', 'large'];

// ==============================
// Spinner
// ==============================


// Prepare variants
const colorVariants$1 = {};
colors$1.forEach(color => {
  colorVariants$1[`color__${color}`] = {
    backgroundColor: theme.spinner.color[color]
  };
});

// Prepare sizes
const sizeVariants = {};
sizes.forEach(size => {
  sizeVariants[`size__${size}`] = {
    fontSize: theme.spinner.size[size]
  };
});

// Declare animation keyframes

const keyframes = compose_1.keyframes('pulse', {
  '0%, 80%, 100%': {
    opacity: 0
  },
  '40%': {
    opacity: 1
  }
});
const classes$9 = {
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
  },
  // Colors
  ...colorVariants$1,
  // Sizes
  ...sizeVariants
};

function ScreenReaderOnly(_ref) {
  let {
    className,
    ...props
  } = _ref;
  props.className = css_1(classes$8.srOnly, className);
  return /*#__PURE__*/reactExports.createElement("span", props);
}
const classes$8 = {
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

function Spinner(_ref) {
  let {
    className,
    size,
    color,
    ...props
  } = _ref;
  props.className = css_1(classes$9.base, classes$9[size], className);
  return /*#__PURE__*/reactExports.createElement("div", props, /*#__PURE__*/reactExports.createElement("span", {
    className: `${css_1(classes$9.dot, classes$9['size__' + size], classes$9['color__' + color], classes$9.dot__first)}`
  }), /*#__PURE__*/reactExports.createElement("span", {
    className: `${css_1(classes$9.dot, classes$9['size__' + size], classes$9['color__' + color], classes$9.dot__second)}`
  }), /*#__PURE__*/reactExports.createElement("span", {
    className: `${css_1(classes$9.dot, classes$9['size__' + size], classes$9['color__' + color], classes$9.dot__third)}`
  }), /*#__PURE__*/reactExports.createElement(ScreenReaderOnly, null, "Loading..."));
}
Spinner.propTypes = {
  color: propTypesExports.oneOf(colors$1),
  size: propTypesExports.oneOf(sizes)
};
Spinner.defaultProps = {
  size: 'medium',
  color: 'default'
};

function LoadingButton(_ref) {
  let {
    children,
    loading,
    ...props
  } = _ref;
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
  const spinner = loading && /*#__PURE__*/reactExports.createElement(Spinner, {
    size: "small",
    color: formattedColor
  });

  // slide the spinner in and out of view
  const spinnerStyles = {
    width: loading ? theme.spinner.size.small * 5 + theme.spacing.small : 0
  };

  // render everything
  return /*#__PURE__*/reactExports.createElement(Button, props, /*#__PURE__*/reactExports.createElement("span", {
    className: css_1(classes$7.spinner),
    style: spinnerStyles
  }, spinner), children);
}
LoadingButton.propTypes = {
  loading: propTypesExports.bool
};
LoadingButton.defaultProps = {
  loading: false
};
const classes$7 = {
  spinner: {
    display: 'inline-block',
    overflow: 'hidden',
    textAlign: 'left',
    transition: 'width 200ms ease-out',
    verticalAlign: 'middle'
  }
};

function ModalBody(_ref) {
  let {
    className,
    ...props
  } = _ref;
  return /*#__PURE__*/reactExports.createElement("div", _extends({
    className: css_1(classes$6.body, className)
  }, props));
}
const classes$6 = {
  body: {
    paddingBottom: theme.modal.padding.body.vertical,
    paddingLeft: theme.modal.padding.body.horizontal,
    paddingRight: theme.modal.padding.body.horizontal,
    paddingTop: theme.modal.padding.body.vertical
  }
};

class ScrollLock extends reactExports.Component {
  constructor() {
    super();
    this.lockCount = 0;
  }
  UNSAFE_componentWillMount() {
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
  componentWillUnmount() {
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
  render() {
    return null;
  }
}

// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9

class PassContext extends reactExports.Component {
  getChildContext() {
    return this.props.context;
  }
  render() {
    return reactExports.Children.only(this.props.children);
  }
}
PassContext.propTypes = {
  context: propTypesExports.object.isRequired
};
PassContext.childContextTypes = {
  onClose: propTypesExports.func
};

class Portal extends reactExports.Component {
  constructor() {
    super();
    this.portalElement = null;
    this.root = null;
  }
  componentDidMount() {
    const p = document.createElement('div');
    document.body.appendChild(p);
    this.portalElement = p;
    this.root = createRoot(p);
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    const duration = 200;
    const styles = `
				.fade-enter { opacity: 0.01; }
				.fade-enter-active { opacity: 1; transition: opacity ${duration}ms; }
				.fade-exit { opacity: 1; }
				.fade-exit-active { opacity: 0.01; transition: opacity ${duration}ms; }
		`;
    const {
      children,
      className,
      ...rest
    } = this.props;
    if (this.root) {
      this.root.render(/*#__PURE__*/reactExports.createElement(PassContext, {
        context: this.context
      }, /*#__PURE__*/reactExports.createElement("div", {
        className: className
      }, /*#__PURE__*/reactExports.createElement("style", null, styles), /*#__PURE__*/reactExports.createElement(TransitionGroup, _extends({
        component: "div"
      }, rest), reactExports.Children.map(children, (child, index) => child ? /*#__PURE__*/reactExports.createElement(CSSTransition, {
        key: child.key || index,
        classNames: "fade",
        timeout: duration
      }, child) : null)))));
    }
  }
  componentWillUnmount() {
    if (this.root) {
      this.root.unmount();
    }
    document.body.removeChild(this.portalElement);
  }
  render() {
    return null;
  }
}
Portal.contextTypes = {
  onClose: propTypesExports.func
};

const canUseDom = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
class ModalDialog extends reactExports.Component {
  constructor() {
    super();
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
  }
  getChildContext() {
    return {
      onClose: this.props.onClose
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!canUseDom) return;

    // add event listeners
    if (nextProps.isOpen && nextProps.enableKeyboardInput) {
      window.addEventListener('keydown', this.handleKeyboardInput);
    }
    if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
      window.removeEventListener('keydown', this.handleKeyboardInput);
    }
  }
  componentWillUnmount() {
    if (this.props.enableKeyboardInput) {
      window.removeEventListener('keydown', this.handleKeyboardInput);
    }
  }

  // ==============================
  // Methods
  // ==============================

  handleKeyboardInput(event) {
    if (event.keyCode === 27) this.props.onClose();
    return false;
  }
  handleBackdropClick(e) {
    if (e.target !== this.refs.container) return;
    this.props.onClose();
  }

  // ==============================
  // Renderers
  // ==============================

  renderDialog() {
    const {
      backdropClosesModal,
      children,
      isOpen,
      width
    } = this.props;
    if (!isOpen) return /*#__PURE__*/reactExports.createElement("span", {
      key: "closed"
    });
    return /*#__PURE__*/reactExports.createElement("div", {
      className: css_1(classes$5.container),
      key: "open",
      ref: "container",
      onClick: !!backdropClosesModal && this.handleBackdropClick,
      onTouchEnd: !!backdropClosesModal && this.handleBackdropClick
    }, /*#__PURE__*/reactExports.createElement("div", {
      className: css_1(classes$5.dialog),
      style: {
        width
      },
      "data-screen-id": "modal-dialog"
    }, children), /*#__PURE__*/reactExports.createElement(ScrollLock, null));
  }
  render() {
    return /*#__PURE__*/reactExports.createElement(Portal, null, this.renderDialog());
  }
}
ModalDialog.propTypes = {
  backdropClosesModal: propTypesExports.bool,
  enableKeyboardInput: propTypesExports.bool,
  isOpen: propTypesExports.bool,
  onClose: propTypesExports.func.isRequired,
  width: propTypesExports.number
};
ModalDialog.defaultProps = {
  enableKeyboardInput: true,
  width: 768
};
ModalDialog.childContextTypes = {
  onClose: propTypesExports.func.isRequired
};
const classes$5 = {
  container: {
    alignItems: 'center',
    backgroundColor: theme.modal.background,
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: theme.modal.zIndex
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.default,
    maxHeight: '90%',
    overflowY: 'auto',
    paddingBottom: theme.modal.padding.dialog.vertical,
    paddingLeft: theme.modal.padding.dialog.horizontal,
    paddingRight: theme.modal.padding.dialog.horizontal,
    paddingTop: theme.modal.padding.dialog.vertical,
    position: 'relative'
  }
};

function ModalFooter(_ref) {
  let {
    align,
    className,
    ...props
  } = _ref;
  return /*#__PURE__*/reactExports.createElement("div", _extends({}, props, {
    className: css_1(classes$4.footer, classes$4['align__' + align], className)
  }));
}
ModalFooter.propTypes = {
  align: propTypesExports.oneOf(['center', 'left', 'right']),
  children: propTypesExports.node,
  onClose: propTypesExports.func,
  showCloseButton: propTypesExports.bool,
  text: propTypesExports.string
};
ModalFooter.defaultProps = {
  align: 'left'
};
const classes$4 = {
  footer: {
    borderTop: `2px solid ${theme.color.gray10}`,
    display: 'flex',
    paddingBottom: theme.modal.padding.footer.vertical,
    paddingLeft: theme.modal.padding.footer.horizontal,
    paddingRight: theme.modal.padding.footer.horizontal,
    paddingTop: theme.modal.padding.footer.vertical
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

function ModalHeader(_ref, _ref2) {
  let {
    children,
    className,
    showCloseButton,
    text,
    ...props
  } = _ref;
  let {
    onClose
  } = _ref2;
  // Property Violation
  if (children && text) {
    console.error('Warning: ModalHeader cannot render `children` and `text`. You must provide one or the other.');
  }
  return /*#__PURE__*/reactExports.createElement("div", _extends({}, props, {
    className: css_1(classes$3.header, className)
  }), /*#__PURE__*/reactExports.createElement("div", {
    className: css_1(classes$3.grow)
  }, text ? /*#__PURE__*/reactExports.createElement("h4", {
    className: css_1(classes$3.text)
  }, text) : children), !!onClose && showCloseButton && /*#__PURE__*/reactExports.createElement(GlyphButton, {
    cssStyles: classes$3.close,
    color: "cancel",
    glyph: "x",
    onClick: onClose,
    variant: "link"
  }));
}
ModalHeader.propTypes = {
  children: propTypesExports.node,
  onClose: propTypesExports.func,
  showCloseButton: propTypesExports.bool,
  text: propTypesExports.string
};
ModalHeader.contextTypes = {
  onClose: propTypesExports.func.isRequired
};
const classes$3 = {
  header: {
    alignItems: 'center',
    borderBottom: `2px solid ${theme.color.gray10}`,
    display: 'flex',
    paddingBottom: theme.modal.padding.header.vertical,
    paddingLeft: theme.modal.padding.header.horizontal,
    paddingRight: theme.modal.padding.header.horizontal,
    paddingTop: theme.modal.padding.header.vertical
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

function Page(_ref) {
  let {
    disabled,
    selected,
    ...props
  } = _ref;
  props.className = css_1(classes$2.page, !!disabled && classes$2.disabled, !!selected && classes$2.selected);
  return /*#__PURE__*/reactExports.createElement("button", props);
}
Page.propTypes = {
  disabled: propTypesExports.bool,
  onClick: propTypesExports.func.isRequired,
  selected: propTypesExports.bool
};

/* eslint quote-props: ["error", "as-needed"] */

const selectedStyle = {
  backgroundColor: theme.pagination.selected.background,
  borderColor: theme.pagination.selected.border,
  color: theme.pagination.selected.color,
  cursor: 'default',
  zIndex: 2
};
const pseudoStyle = {
  backgroundColor: theme.pagination.hover.background,
  borderColor: theme.pagination.hover.border,
  color: theme.pagination.hover.color,
  outline: 'none'
};
const classes$2 = {
  page: {
    appearance: 'none',
    background: 'none',
    border: '1px solid transparent',
    borderRadius: theme.borderRadius.default,
    color: theme.pagination.color,
    cursor: 'pointer',
    display: 'inline-block',
    float: 'left',
    // Collapse white-space
    marginRight: '0.25em',
    padding: '0 .7em',
    position: 'relative',
    textDecoration: 'none',
    // handle hover and focus
    ':hover': pseudoStyle,
    ':focus': pseudoStyle
  },
  // selected page
  selected: {
    ...selectedStyle,
    ':hover': selectedStyle,
    ':focus': selectedStyle
  },
  // disabled page

  disabled: {
    backgroundColor: theme.pagination.disabled.background,
    borderColor: theme.pagination.disabled.background,
    color: theme.pagination.disabled.color,
    cursor: 'default'
  }
};

class Pagination extends reactExports.Component {
  renderCount() {
    let count = '';
    const {
      currentPage,
      pageSize,
      plural,
      singular,
      total
    } = this.props;
    if (!total) {
      count = 'No ' + (plural || 'records');
    } else if (total > pageSize) {
      let start = pageSize * (currentPage - 1) + 1;
      let end = Math.min(start + pageSize - 1, total);
      count = `Showing ${start} to ${end} of ${total}`;
    } else {
      count = 'Showing ' + total;
      if (total > 1 && plural) {
        count += ' ' + plural;
      } else if (total === 1 && singular) {
        count += ' ' + singular;
      }
    }
    return /*#__PURE__*/reactExports.createElement("div", {
      className: css_1(classes$1.count),
      "data-e2e-pagination-count": true
    }, count);
  }
  renderPages() {
    const {
      currentPage,
      limit,
      onPageSelect,
      pageSize,
      total
    } = this.props;
    if (total <= pageSize) return null;
    let pages = [];
    let totalPages = Math.ceil(total / pageSize);
    let minPage = 1;
    let maxPage = totalPages;
    if (limit && limit < totalPages) {
      let rightLimit = Math.floor(limit / 2);
      let leftLimit = rightLimit + limit % 2 - 1;
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
      pages.push(/*#__PURE__*/reactExports.createElement(Page, {
        key: "page_start",
        onClick: () => onPageSelect(1)
      }, "..."));
    }
    for (let page = minPage; page <= maxPage; page++) {
      let selected = page === currentPage;
      /* eslint-disable no-loop-func */
      pages.push(/*#__PURE__*/reactExports.createElement(Page, {
        key: 'page_' + page,
        selected: selected,
        onClick: () => onPageSelect(page)
      }, page));
      /* eslint-enable */
    }
    if (maxPage < totalPages) {
      pages.push(/*#__PURE__*/reactExports.createElement(Page, {
        key: "page_end",
        onClick: () => onPageSelect(totalPages)
      }, "..."));
    }
    return /*#__PURE__*/reactExports.createElement("div", {
      className: css_1(classes$1.list)
    }, pages);
  }
  render() {
    const className = css_1(classes$1.container, this.props.className);
    return /*#__PURE__*/reactExports.createElement("div", {
      className: className,
      style: this.props.style
    }, this.renderCount(), this.renderPages());
  }
}
const classes$1 = {
  container: {
    display: 'block',
    lineHeight: theme.component.lineHeight,
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
  className: propTypesExports.string,
  currentPage: propTypesExports.number.isRequired,
  limit: propTypesExports.number,
  onPageSelect: propTypesExports.func,
  pageSize: propTypesExports.number.isRequired,
  plural: propTypesExports.string,
  singular: propTypesExports.string,
  style: propTypesExports.object,
  total: propTypesExports.number.isRequired
};

// Using window.innerWidth and state instead of CSS media breakpoints
// because we want to render null rather than an empty span. Allowing for
// CSS pseudo classes like :only-child to behave as expected.

// Return true if window + document
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
class ResponsiveText extends reactExports.Component {
  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      windowWidth: canUseDOM ? window.innerWidth : 0
    };
  }
  componentDidMount() {
    if (canUseDOM) {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }
  }
  componentWillUnmount() {
    if (canUseDOM) {
      window.removeEventListener('resize', this.handleResize);
    }
  }
  handleResize() {
    this.setState({
      windowWidth: canUseDOM ? window.innerWidth : 0
    });
  }
  render() {
    const {
      component: Component,
      hiddenLG,
      hiddenMD,
      hiddenSM,
      hiddenXS,
      visibleLG,
      visibleMD,
      visibleSM,
      visibleXS,
      ...props
    } = this.props;
    const {
      windowWidth
    } = this.state;
    let text;

    // set text value from breakpoint; attempt XS --> LG
    if (windowWidth < theme.breakpointNumeric.mobile) {
      text = visibleXS || hiddenSM || hiddenMD || hiddenLG;
    } else if (windowWidth < theme.breakpointNumeric.tabletPortrait) {
      text = hiddenXS || visibleSM || hiddenMD || hiddenLG;
    } else if (windowWidth < theme.breakpointNumeric.tabletLandscape) {
      text = hiddenXS || hiddenSM || visibleMD || hiddenLG;
    } else {
      text = hiddenXS || hiddenSM || hiddenMD || visibleLG;
    }
    return text ? /*#__PURE__*/reactExports.createElement(Component, props, text) : null;
  }
}
ResponsiveText.propTypes = {
  hiddenLG: propTypesExports.string,
  hiddenMD: propTypesExports.string,
  hiddenSM: propTypesExports.string,
  hiddenXS: propTypesExports.string,
  visibleLG: propTypesExports.string,
  visibleMD: propTypesExports.string,
  visibleSM: propTypesExports.string,
  visibleXS: propTypesExports.string
};
ResponsiveText.defaultProps = {
  component: 'span'
};

const colors = {
  danger: theme.color.danger,
  default: theme.color.gray80,
  error: theme.color.danger,
  info: theme.color.info,
  primary: theme.color.primary,
  success: theme.color.success,
  warning: theme.color.warning
};

// ==============================
// Segmented Control
// ==============================


// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
  const pseudoStyles = {
    backgroundColor: colors[color],
    color: 'white'
  };
  colorVariants['button__' + color] = {
    backgroundColor: colors[color],
    color: 'white',
    ':hover': pseudoStyles,
    ':focus': pseudoStyles,
    ':active': pseudoStyles
  };
});
const classes = {
  control: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.input.border.color.default,
    borderRadius: '0.4em',
    display: 'flex',
    fontSize: theme.font.size.small,
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
  },
  // colors
  ...colorVariants
};

function SegmentedControl(_ref) {
  let {
    className,
    color,
    cropText,
    equalWidthSegments,
    inline,
    onChange,
    options,
    value,
    ...props
  } = _ref;
  props.className = css_1(classes.control, inline ? classes.control__inline : null, className);
  return /*#__PURE__*/reactExports.createElement("div", props, options.map(opt => {
    const buttonClassName = css_1(classes.button, opt.disabled ? classes.button__disabled : null, opt.value === value ? classes['button__' + color] : null, cropText ? classes.button__cropText : null, equalWidthSegments ? classes.button__equalWidth : null);
    return /*#__PURE__*/reactExports.createElement("button", {
      className: buttonClassName,
      key: opt.value,
      onClick: !opt.disabled && (() => onChange(opt.value)),
      type: "button",
      title: cropText ? opt.label : null,
      tabIndex: opt.disabled ? '-1' : ''
    }, opt.label);
  }));
}
const valuePropShape = [propTypesExports.bool, propTypesExports.number, propTypesExports.string];
SegmentedControl.propTypes = {
  color: propTypesExports.oneOf(Object.keys(colors)),
  cropText: propTypesExports.bool,
  // when `inline && equalWidthSegments` crops to the next largest option length
  equalWidthSegments: propTypesExports.bool,
  // only relevant when `inline === false`
  inline: propTypesExports.bool,
  onChange: propTypesExports.func.isRequired,
  options: propTypesExports.arrayOf(propTypesExports.shape({
    disabled: propTypesExports.bool,
    label: propTypesExports.string,
    value: propTypesExports.oneOfType(valuePropShape)
  })).isRequired,
  value: propTypesExports.oneOfType(valuePropShape)
};
SegmentedControl.defaultProps = {
  color: 'default'
};

export { Alert as A, Button as B, Container as C, FormField as F, GridRow as G, InlineGroup as I, LabelledControl as L, ModalHeader as M, Pagination as P, ResponsiveText as R, Spinner as S, _extends as _, GridCol as a, ModalBody as b, ModalFooter as c, ModalDialog as d, darken as e, fade as f, FormInput as g, FormNote as h, SegmentedControl as i, FormSelect as j, InlineGroupSection as k, FormLabel as l, Form as m, lighten as n, LoadingButton as o, Glyph as p, GlyphButton as q, BlankState as r, Center as s, theme as t, Chip as u };
