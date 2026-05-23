(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
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
const _index = require("./elemental/index.mjs");
const _reactrouter = require("react-router");
const _glamor = require("glamor");
const _index1 = /*#__PURE__*/ _interop_require_default(require("./components/Navigation/Mobile/index.mjs"));
const _index2 = /*#__PURE__*/ _interop_require_default(require("./components/Navigation/Primary/index.mjs"));
const _index3 = /*#__PURE__*/ _interop_require_default(require("./components/Navigation/Secondary/index.mjs"));
const _index4 = /*#__PURE__*/ _interop_require_default(require("./components/Footer/index.mjs"));
const _lists = require("../utils/lists.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const classes = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    body: {
        flexGrow: 1
    }
};
const App = (props)=>{
    let children = props.children;
    // If we're on either a list or an item view
    let currentList, currentSection;
    if (props.params.listId) {
        currentList = _lists.listsByPath[props.params.listId];
        // If we're on a list path that doesn't exist (e.g. /keystone/gibberishasfw34afsd) this will
        // be undefined
        if (!currentList) {
            children = /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement("p", null, "List not found!"), /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
                to: `${Keystone.adminLegacyPath}`
            }, "Go back home"));
        } else {
            // Get the current section we're in for the navigation
            currentSection = Keystone.nav.by.list[currentList.key];
        }
    }
    // Default current section key to dashboard
    const currentSectionKey = currentSection && currentSection.key || 'dashboard';
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: (0, _glamor.css)(classes.wrapper)
    }, /*#__PURE__*/ _react.default.createElement("header", null, /*#__PURE__*/ _react.default.createElement(_index1.default, {
        brand: Keystone.brand,
        currentListKey: props.params.listId,
        currentSectionKey: currentSectionKey,
        sections: Keystone.nav.sections,
        signoutUrl: Keystone.signoutUrl
    }), /*#__PURE__*/ _react.default.createElement(_index2.default, {
        currentSectionKey: currentSectionKey,
        brand: Keystone.brand,
        sections: Keystone.nav.sections,
        signoutUrl: Keystone.signoutUrl
    }), currentSection ? /*#__PURE__*/ _react.default.createElement(_index3.default, {
        currentListKey: props.params.listId,
        lists: currentSection.lists,
        itemId: props.params.itemId
    }) : null), /*#__PURE__*/ _react.default.createElement("main", {
        className: (0, _glamor.css)(classes.body)
    }, children), /*#__PURE__*/ _react.default.createElement(_index4.default, {
        appversion: Keystone.appversion,
        backUrl: Keystone.backUrl,
        brand: Keystone.brand,
        User: Keystone.User,
        user: Keystone.user,
        version: Keystone.version
    }));
};
const _default = App;

},{"../utils/lists.mjs":155,"./components/Footer/index.mjs":2,"./components/Navigation/Mobile/index.mjs":5,"./components/Navigation/Primary/index.mjs":7,"./components/Navigation/Secondary/index.mjs":9,"./elemental/index.mjs":73,"glamor":undefined,"react":undefined,"react-router":undefined}],2:[function(require,module,exports){
/**
 * The global Footer, displays a link to the website and the current Keystone
 * version in use
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _glamor = require("glamor");
const _index = require("../../elemental/index.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Footer = (0, _createreactclass.default)({
    displayName: "Footer",
    propTypes: {
        appversion: _proptypes.default.string,
        backUrl: _proptypes.default.string,
        brand: _proptypes.default.string,
        user: _proptypes.default.object,
        User: _proptypes.default.object,
        version: _proptypes.default.string
    },
    // Render the user
    renderUser () {
        const { User, user } = this.props;
        if (!user) return null;
        return /*#__PURE__*/ _react.default.createElement("span", null, /*#__PURE__*/ _react.default.createElement("span", null, " Signed in as "), /*#__PURE__*/ _react.default.createElement("a", {
            href: `${Keystone.adminLegacyPath}/${User.path}/${user.id}`,
            tabIndex: "-1",
            className: (0, _glamor.css)(classes.link)
        }, user.name), /*#__PURE__*/ _react.default.createElement("span", null, "."));
    },
    render () {
        const { backUrl, brand, appversion, version } = this.props;
        return /*#__PURE__*/ _react.default.createElement("footer", {
            className: (0, _glamor.css)(classes.footer),
            "data-keystone-footer": true
        }, /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement("a", {
            href: backUrl,
            tabIndex: "-1",
            className: (0, _glamor.css)(classes.link)
        }, brand + (appversion ? " " + appversion : "")), /*#__PURE__*/ _react.default.createElement("span", null, " powered by "), /*#__PURE__*/ _react.default.createElement("a", {
            href: "http://v4.keystonejs.com",
            target: "_blank",
            className: (0, _glamor.css)(classes.link),
            tabIndex: "-1"
        }, "KeystoneJS"), /*#__PURE__*/ _react.default.createElement("span", null, " version ", version, "."), this.renderUser()));
    }
});
/* eslint quote-props: ["error", "as-needed"] */ const linkHoverAndFocus = {
    color: _theme.default.color.gray60,
    outline: "none"
};
const classes = {
    footer: {
        boxShadow: "0 -1px 0 rgba(0, 0, 0, 0.1)",
        color: _theme.default.color.gray40,
        fontSize: _theme.default.font.size.small,
        paddingBottom: 30,
        paddingTop: 40,
        textAlign: "center"
    },
    link: {
        color: _theme.default.color.gray60,
        ":hover": linkHoverAndFocus,
        ":focus": linkHoverAndFocus
    }
};
const _default = Footer;

},{"../../../theme.mjs":150,"../../elemental/index.mjs":73,"create-react-class":161,"glamor":undefined,"prop-types":258,"react":undefined}],3:[function(require,module,exports){
/**
 * A list item of the mobile navigation
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactrouter = require("react-router");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const MobileListItem = (0, _createreactclass.default)({
    displayName: 'MobileListItem',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string,
        href: _proptypes.default.string.isRequired,
        onClick: _proptypes.default.func
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            className: this.props.className,
            to: this.props.href,
            onClick: this.props.onClick,
            tabIndex: "-1"
        }, this.props.children);
    }
});
const _default = MobileListItem;

},{"create-react-class":161,"prop-types":258,"react":undefined,"react-router":undefined}],4:[function(require,module,exports){
/**
 * A mobile section
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _ListItem = /*#__PURE__*/ _interop_require_default(require("./ListItem.mjs"));
const _reactrouter = require("react-router");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const MobileSectionItem = (0, _createreactclass.default)({
    displayName: 'MobileSectionItem',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string,
        currentListKey: _proptypes.default.string,
        href: _proptypes.default.string.isRequired,
        lists: _proptypes.default.array
    },
    // Render the lists
    renderLists () {
        if (!this.props.lists || this.props.lists.length <= 1) return null;
        const navLists = this.props.lists.map((item)=>{
            // Get the link and the classname
            const href = item.external ? item.path : `${Keystone.adminLegacyPath}/${item.path}`;
            const className = this.props.currentListKey && this.props.currentListKey === item.path ? 'MobileNavigation__list-item is-active' : 'MobileNavigation__list-item';
            return /*#__PURE__*/ _react.default.createElement(_ListItem.default, {
                key: item.path,
                href: href,
                className: className,
                onClick: this.props.onClick
            }, item.label);
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation__lists"
        }, navLists);
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: this.props.className
        }, /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            className: "MobileNavigation__section-item",
            to: this.props.href,
            tabIndex: "-1",
            onClick: this.props.onClick
        }, this.props.children), this.renderLists());
    }
});
const _default = MobileSectionItem;

},{"./ListItem.mjs":3,"create-react-class":161,"prop-types":258,"react":undefined,"react-router":undefined}],5:[function(require,module,exports){
/**
 * The mobile navigation, displayed on screens < 768px
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _CSSTransitionGroup = /*#__PURE__*/ _interop_require_default(require("react-transition-group/CSSTransitionGroup"));
const _SectionItem = /*#__PURE__*/ _interop_require_default(require("./SectionItem.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ESCAPE_KEY_CODE = 27;
const MobileNavigation = (0, _createreactclass.default)({
    displayName: 'MobileNavigation',
    propTypes: {
        brand: _proptypes.default.string,
        currentListKey: _proptypes.default.string,
        currentSectionKey: _proptypes.default.string,
        sections: _proptypes.default.array.isRequired,
        signoutUrl: _proptypes.default.string
    },
    getInitialState () {
        return {
            barIsVisible: false
        };
    },
    // Handle showing and hiding the menu based on the window size when
    // resizing
    componentDidMount () {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    },
    handleResize () {
        this.setState({
            barIsVisible: window.innerWidth < 768
        });
    },
    // Toggle the menu
    toggleMenu () {
        this[this.state.menuIsVisible ? 'hideMenu' : 'showMenu']();
    },
    // Show the menu
    showMenu () {
        this.setState({
            menuIsVisible: true
        });
        // Make the body unscrollable, so you can only scroll in the menu
        document.body.style.overflow = 'hidden';
        document.body.addEventListener('keyup', this.handleEscapeKey, false);
    },
    // Hide the menu
    hideMenu () {
        this.setState({
            menuIsVisible: false
        });
        // Make the body scrollable again
        document.body.style.overflow = null;
        document.body.removeEventListener('keyup', this.handleEscapeKey, false);
    },
    // If the escape key was pressed, hide the menu
    handleEscapeKey (event) {
        if (event.which === ESCAPE_KEY_CODE) {
            this.hideMenu();
        }
    },
    renderNavigation () {
        if (!this.props.sections || !this.props.sections.length) return null;
        return this.props.sections.map((section)=>{
            // Get the link and the classname
            const href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminLegacyPath}/${section.lists[0].path}`;
            const className = this.props.currentSectionKey && this.props.currentSectionKey === section.key ? 'MobileNavigation__section is-active' : 'MobileNavigation__section';
            // Render a SectionItem
            return /*#__PURE__*/ _react.default.createElement(_SectionItem.default, {
                key: section.key,
                className: className,
                href: href,
                lists: section.lists,
                currentListKey: this.props.currentListKey,
                onClick: this.toggleMenu
            }, section.label);
        });
    },
    // Render a blockout
    renderBlockout () {
        if (!this.state.menuIsVisible) return null;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation__blockout",
            onClick: this.toggleMenu
        });
    },
    // Render the sidebar menu
    renderMenu () {
        if (!this.state.menuIsVisible) return null;
        return /*#__PURE__*/ _react.default.createElement("nav", {
            className: "MobileNavigation__menu"
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation__sections"
        }, this.renderNavigation()));
    },
    render () {
        if (!this.state.barIsVisible) return null;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation"
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation__bar"
        }, /*#__PURE__*/ _react.default.createElement("button", {
            type: "button",
            onClick: this.toggleMenu,
            className: "MobileNavigation__bar__button MobileNavigation__bar__button--menu"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: 'MobileNavigation__bar__icon octicon octicon-' + (this.state.menuIsVisible ? 'x' : 'three-bars')
        })), /*#__PURE__*/ _react.default.createElement("span", {
            className: "MobileNavigation__bar__label"
        }, this.props.brand), /*#__PURE__*/ _react.default.createElement("a", {
            href: this.props.signoutUrl,
            className: "MobileNavigation__bar__button MobileNavigation__bar__button--signout"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "MobileNavigation__bar__icon octicon octicon-sign-out"
        }))), /*#__PURE__*/ _react.default.createElement("div", {
            className: "MobileNavigation__bar--placeholder"
        }), /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
            transitionName: "MobileNavigation__menu",
            transitionEnterTimeout: 260,
            transitionLeaveTimeout: 200
        }, this.renderMenu()), /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
            transitionName: "react-transitiongroup-fade",
            transitionEnterTimeout: 0,
            transitionLeaveTimeout: 0
        }, this.renderBlockout()));
    }
});
const _default = MobileNavigation;

},{"./SectionItem.mjs":4,"create-react-class":161,"prop-types":258,"react":undefined,"react-transition-group/CSSTransitionGroup":undefined}],6:[function(require,module,exports){
/**
 * A item in the primary navigation. If it has a "to" prop it'll render a
 * react-router "Link", if it has a "href" prop it'll render a simple "a" tag
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _reactrouter = require("react-router");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PrimaryNavItem = ({ children, className, href, label, listPath, title, to, active })=>{
    const itemClassName = (0, _classnames.default)('primary-navbar__item', className);
    const Button = to ? /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
        className: "primary-navbar__link",
        key: title,
        tabIndex: "-1",
        title: title,
        to: to,
        // Block clicks on active link
        onClick: (evt)=>{
            if (active) evt.preventDefault();
        }
    }, children) : /*#__PURE__*/ _react.default.createElement("a", {
        className: "primary-navbar__link",
        href: href,
        key: title,
        tabIndex: "-1",
        title: title
    }, children);
    return /*#__PURE__*/ _react.default.createElement("li", {
        className: itemClassName,
        "data-section-label": label,
        "data-nav-list-link": listPath ? 'true' : undefined,
        "data-list-path": listPath
    }, Button);
};
PrimaryNavItem.displayName = 'PrimaryNavItem';
PrimaryNavItem.propTypes = {
    children: _proptypes.default.node.isRequired,
    className: _proptypes.default.string,
    href: _proptypes.default.string,
    label: _proptypes.default.string,
    listPath: _proptypes.default.string,
    title: _proptypes.default.string,
    to: _proptypes.default.string
};
const _default = PrimaryNavItem;

},{"classnames":undefined,"prop-types":258,"react":undefined,"react-router":undefined}],7:[function(require,module,exports){
/**
 * The primary (i.e. uppermost) navigation on desktop. Renders all sections and
 * the home-, website- and signout buttons.
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../../elemental/index.mjs");
const _NavItem = /*#__PURE__*/ _interop_require_default(require("./NavItem.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PrimaryNavigation = (0, _createreactclass.default)({
    displayName: 'PrimaryNavigation',
    propTypes: {
        brand: _proptypes.default.string,
        currentSectionKey: _proptypes.default.string,
        sections: _proptypes.default.array.isRequired,
        signoutUrl: _proptypes.default.string
    },
    getInitialState () {
        return {};
    },
    // Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
    componentDidMount () {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    },
    handleResize () {
        this.setState({
            navIsVisible: window.innerWidth >= 768
        });
    },
    // Render the sign out button
    renderSignout () {
        if (!this.props.signoutUrl) return null;
        return /*#__PURE__*/ _react.default.createElement(_NavItem.default, {
            label: "octicon-sign-out",
            href: this.props.signoutUrl,
            title: "Sign Out"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "octicon octicon-sign-out"
        }));
    },
    // Render the back button
    renderBackButton () {
        if (!Keystone.backUrl) return null;
        return /*#__PURE__*/ _react.default.createElement(_NavItem.default, {
            label: "octicon-globe",
            href: Keystone.backUrl,
            title: 'Front page - ' + this.props.brand
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "octicon octicon-globe"
        }));
    },
    // Render the link to the webpage
    renderFrontLink () {
        return /*#__PURE__*/ _react.default.createElement("ul", {
            className: "app-nav app-nav--primary app-nav--right"
        }, this.renderBackButton(), this.renderSignout());
    },
    renderBrand () {
        // TODO: support navbarLogo from keystone config
        const { brand, currentSectionKey } = this.props;
        const className = currentSectionKey === 'dashboard' ? 'primary-navbar__brand primary-navbar__item--active' : 'primary-navbar__brand';
        return /*#__PURE__*/ _react.default.createElement(_NavItem.default, {
            className: className,
            label: "octicon-home",
            title: 'Dashboard - ' + brand,
            to: Keystone.adminLegacyPath
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: "octicon octicon-home"
        }));
    },
    // Render the navigation
    renderNavigation () {
        if (!this.props.sections || !this.props.sections.length) return null;
        return this.props.sections.map((section)=>{
            // Get the link and the class name
            const to = !section.lists[0].external && `${Keystone.adminLegacyPath}/${section.lists[0].path}`;
            const href = section.lists[0].external && section.lists[0].path;
            const isActive = this.props.currentSectionKey && this.props.currentSectionKey === section.key;
            const className = isActive ? 'primary-navbar__item--active' : null;
            return /*#__PURE__*/ _react.default.createElement(_NavItem.default, {
                active: isActive,
                key: section.key,
                label: section.label,
                className: className,
                listPath: section.lists[0].path,
                to: to,
                href: href
            }, section.label);
        });
    },
    render () {
        if (!this.state.navIsVisible) return null;
        return /*#__PURE__*/ _react.default.createElement("nav", {
            className: "primary-navbar"
        }, /*#__PURE__*/ _react.default.createElement(_index.Container, {
            clearFloatingChildren: true
        }, /*#__PURE__*/ _react.default.createElement("ul", {
            className: "app-nav app-nav--primary app-nav--left"
        }, this.renderBrand(), this.renderNavigation()), this.renderFrontLink()));
    }
});
const _default = PrimaryNavigation;

},{"../../../elemental/index.mjs":73,"./NavItem.mjs":6,"create-react-class":161,"prop-types":258,"react":undefined}],8:[function(require,module,exports){
/**
 * A navigation item of the secondary navigation
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactrouter = require("react-router");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SecondaryNavItem = (0, _createreactclass.default)({
    displayName: 'SecondaryNavItem',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string,
        href: _proptypes.default.string.isRequired,
        onClick: _proptypes.default.func,
        path: _proptypes.default.string,
        title: _proptypes.default.string
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("li", {
            className: this.props.className,
            "data-nav-list-link": "true",
            "data-list-path": this.props.path
        }, /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            to: this.props.href,
            onClick: this.props.onClick,
            title: this.props.title,
            tabIndex: "-1"
        }, this.props.children));
    }
});
const _default = SecondaryNavItem;

},{"create-react-class":161,"prop-types":258,"react":undefined,"react-router":undefined}],9:[function(require,module,exports){
/**
 * The secondary navigation links to inidvidual lists of a section
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactredux = require("react-redux");
const _index = require("../../../elemental/index.mjs");
const _active = require("../../../screens/List/actions/active.mjs");
const _NavItem = /*#__PURE__*/ _interop_require_default(require("./NavItem.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SecondaryNavigation = (0, _createreactclass.default)({
    displayName: 'SecondaryNavigation',
    propTypes: {
        currentListKey: _proptypes.default.string,
        lists: _proptypes.default.array.isRequired
    },
    getInitialState () {
        return {};
    },
    // Handle resizing and hide this nav on mobile (i.e. < 768px) screens
    componentDidMount () {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    },
    handleResize () {
        this.setState({
            navIsVisible: this.props.lists && Object.keys(this.props.lists).length > 0 && window.innerWidth >= 768
        });
    },
    // Render the navigation
    renderNavigation (lists) {
        const navigation = Object.keys(lists).map((key)=>{
            const list = lists[key];
            // Get the link and the classname
            const href = list.external ? list.path : `${Keystone.adminLegacyPath}/${list.path}`;
            const isActive = this.props.currentListKey && this.props.currentListKey === list.path;
            const className = isActive ? 'active' : null;
            const onClick = (evt)=>{
                // If it's the currently active navigation item and we're not on the item view,
                // clear the query params on click
                if (isActive && !this.props.itemId) {
                    evt.preventDefault();
                    this.props.dispatch((0, _active.setActiveList)(this.props.currentList, this.props.currentListKey));
                }
            };
            return /*#__PURE__*/ _react.default.createElement(_NavItem.default, {
                key: list.path,
                path: list.path,
                className: className,
                href: href,
                onClick: onClick
            }, list.label);
        });
        return /*#__PURE__*/ _react.default.createElement("ul", {
            className: "app-nav app-nav--secondary app-nav--left"
        }, navigation);
    },
    render () {
        if (!this.state.navIsVisible) return null;
        return /*#__PURE__*/ _react.default.createElement("nav", {
            className: "secondary-navbar"
        }, /*#__PURE__*/ _react.default.createElement(_index.Container, {
            clearFloatingChildren: true
        }, this.renderNavigation(this.props.lists)));
    }
});
const _default = (0, _reactredux.connect)((state)=>{
    return {
        currentList: state.lists.currentList
    };
})(SecondaryNavigation);

},{"../../../elemental/index.mjs":73,"../../../screens/List/actions/active.mjs":104,"./NavItem.mjs":8,"create-react-class":161,"prop-types":258,"react":undefined,"react-redux":undefined}],10:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],11:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    color: _proptypes.default.oneOf(Object.keys(_colors.default)).isRequired,
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ])
};
Alert.defaultProps = {
    component: 'div'
};
const _default = Alert;

},{"./colors.mjs":10,"./styles.mjs":12,"glamor":undefined,"prop-types":258,"react":undefined}],12:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"./colors.mjs":10}],13:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
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
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]).isRequired,
    heading: _proptypes.default.string
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

},{"../../../theme.mjs":150,"glamor":undefined,"prop-types":258,"react":undefined}],14:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _styles = /*#__PURE__*/ _interop_require_wildcard(require("./styles.mjs"));
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
    active: _proptypes.default.bool,
    block: _proptypes.default.bool,
    color: _proptypes.default.oneOf(BUTTON_COLORS),
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]),
    cssStyles: _proptypes.default.arrayOf(_proptypes.default.shape({
        _definition: _proptypes.default.object,
        _name: _proptypes.default.string
    })),
    disabled: _proptypes.default.bool,
    href: _proptypes.default.string,
    size: _proptypes.default.oneOf(BUTTON_SIZES),
    variant: _proptypes.default.oneOf(BUTTON_VARIANTS)
};
Button.defaultProps = {
    cssStyles: [],
    color: 'default',
    variant: 'fill'
};
const _default = Button;

},{"./styles.mjs":15,"glamor":undefined,"prop-types":258,"react":undefined}],15:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"../../../utils/color.mjs":152,"../../../utils/css.mjs":154}],16:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]),
    height: _proptypes.default.oneOfType([
        _proptypes.default.number,
        _proptypes.default.string
    ])
};
Center.defaultProps = {
    component: 'div',
    height: 'auto'
};
const _default = Center;

},{"./styles.mjs":17,"glamor":undefined,"prop-types":258,"react":undefined}],17:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"../../../utils/color.mjs":152}],19:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
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
    color: _proptypes.default.oneOf(Object.keys(_colors.default)).isRequired,
    inverted: _proptypes.default.bool,
    label: _proptypes.default.string.isRequired,
    onClear: _proptypes.default.func,
    onClick: _proptypes.default.func
};
Chip.defaultProps = {
    color: 'default'
};
const _default = Chip;

},{"./colors.mjs":18,"./styles.mjs":20,"glamor":undefined,"prop-types":258,"react":undefined}],20:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"../../../utils/css.mjs":154,"./colors.mjs":18}],21:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _sizes = /*#__PURE__*/ _interop_require_default(require("./sizes.mjs"));
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
    clearFloatingChildren: _proptypes.default.bool,
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]).isRequired,
    width: _proptypes.default.oneOf(Object.keys(_sizes.default)).isRequired
};
Container.defaultProps = {
    component: 'div',
    width: 'large'
};
const _default = Container;

},{"./sizes.mjs":22,"./styles.mjs":23,"glamor":undefined,"prop-types":258,"react":undefined}],22:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],23:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"./sizes.mjs":22}],24:[function(require,module,exports){
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

},{"../Button/index.mjs":14,"glamor":undefined,"react":undefined}],25:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    formLayout: _proptypes.default.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    labelWidth: _proptypes.default.oneOfType([
        _proptypes.default.number,
        _proptypes.default.string
    ])
};
Form.propTypes = {
    children: _proptypes.default.node.isRequired,
    component: _proptypes.default.oneOfType([
        _proptypes.default.string,
        _proptypes.default.func
    ]),
    layout: _proptypes.default.oneOf([
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

},{"./styles.mjs":26,"glamor":undefined,"prop-types":258,"react":undefined}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    _definition: _proptypes.default.object,
    _name: _proptypes.default.string
};
FormField.contextTypes = {
    formLayout: _proptypes.default.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    labelWidth: _proptypes.default.oneOfType([
        _proptypes.default.number,
        _proptypes.default.string
    ])
};
FormField.childContextTypes = {
    formFieldId: _proptypes.default.string
};
FormField.propTypes = {
    children: _proptypes.default.node,
    cropLabel: _proptypes.default.bool,
    cssStyles: _proptypes.default.oneOfType([
        _proptypes.default.arrayOf(_proptypes.default.shape(stylesShape)),
        _proptypes.default.shape(stylesShape)
    ]),
    htmlFor: _proptypes.default.string,
    label: _proptypes.default.string,
    offsetAbsentLabel: _proptypes.default.bool
};
function generateId() {
    return Math.random().toString(36).slice(2, 11);
}
const _default = FormField;

},{"../FormLabel/index.mjs":32,"./styles.mjs":28,"glamor":undefined,"prop-types":258,"react":undefined}],28:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],29:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    _definition: _proptypes.default.object,
    _name: _proptypes.default.string
};
FormInput.propTypes = {
    cssStyles: _proptypes.default.oneOfType([
        _proptypes.default.arrayOf(_proptypes.default.shape(stylesShape)),
        _proptypes.default.shape(stylesShape)
    ]),
    multiline: _proptypes.default.bool,
    size: _proptypes.default.oneOf([
        'default',
        'small',
        'large'
    ]),
    type: _proptypes.default.string
};
FormInput.defaultProps = {
    size: 'default',
    type: 'text'
};
FormInput.contextTypes = {
    formLayout: _proptypes.default.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    formFieldId: _proptypes.default.string
};
const _default = FormInput;

},{"../../../utils/concatClassnames.mjs":153,"./noedit.mjs":30,"./styles.mjs":31,"glamor":undefined,"prop-types":258,"react":undefined}],30:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _glamor = require("glamor");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
const _color = require("../../../utils/color.mjs");
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
    component: _proptypes.default.oneOfType([
        _proptypes.default.string,
        _proptypes.default.func
    ]),
    cropText: _proptypes.default.bool
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

},{"../../../theme.mjs":150,"../../../utils/color.mjs":152,"glamor":undefined,"prop-types":258,"react":undefined}],31:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],32:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    _definition: _proptypes.default.object,
    _name: _proptypes.default.string
};
FormLabel.propTypes = {
    component: _proptypes.default.oneOfType([
        _proptypes.default.string,
        _proptypes.default.func
    ]),
    cropText: _proptypes.default.bool,
    cssStyles: _proptypes.default.oneOfType([
        _proptypes.default.arrayOf(_proptypes.default.shape(stylesShape)),
        _proptypes.default.shape(stylesShape)
    ])
};
FormLabel.defaultProps = {
    component: 'label'
};
FormLabel.contextTypes = {
    formLayout: _proptypes.default.oneOf([
        'basic',
        'horizontal',
        'inline'
    ]),
    formFieldId: _proptypes.default.string,
    labelWidth: _proptypes.default.oneOfType([
        _proptypes.default.number,
        _proptypes.default.string
    ])
};
const _default = FormLabel;

},{"./styles.mjs":33,"glamor":undefined,"prop-types":258,"react":undefined}],33:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],34:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]),
    html: _proptypes.default.string
};
FormNote.defaultProps = {
    component: 'div'
};
const _default = FormNote;

},{"./styles.mjs":35,"glamor":undefined,"prop-types":258,"react":undefined}],35:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],36:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    formFieldId: _proptypes.default.string
};
FormSelect.propTypes = {
    onChange: _proptypes.default.func.isRequired,
    options: _proptypes.default.arrayOf(_proptypes.default.shape({
        label: _proptypes.default.string,
        value: _proptypes.default.string
    })),
    value: _proptypes.default.oneOfType([
        _proptypes.default.number,
        _proptypes.default.string
    ])
};
const _default = FormSelect;

},{"./styles.mjs":37,"glamor":undefined,"prop-types":258,"react":undefined}],37:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"../../../utils/color.mjs":152}],38:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],39:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    color: _proptypes.default.oneOfType([
        _proptypes.default.oneOf(Object.keys(_colors.default)),
        _proptypes.default.string
    ]),
    cssStyles: _proptypes.default.shape({
        _definition: _proptypes.default.object,
        _name: _proptypes.default.string
    }),
    name: _proptypes.default.oneOf(Object.keys(_octicons.default)).isRequired,
    size: _proptypes.default.oneOf(Object.keys(_sizes.default))
};
Glyph.defaultProps = {
    component: 'i',
    color: 'inherit',
    size: 'small'
};
const _default = Glyph;

},{"./colors.mjs":38,"./octicons.mjs":40,"./sizes.mjs":41,"./styles.mjs":42,"glamor":undefined,"prop-types":258,"react":undefined}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],42:[function(require,module,exports){
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

},{"./colors.mjs":38,"./sizes.mjs":41}],43:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    glyph: _proptypes.default.string,
    glyphColor: _proptypes.default.string,
    glyphSize: _proptypes.default.string,
    glyphStyle: _proptypes.default.object,
    position: _proptypes.default.oneOf([
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

},{"../Button/index.mjs":14,"../Glyph/index.mjs":39,"prop-types":258,"react":undefined}],44:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    glyph: _proptypes.default.string,
    glyphColor: _proptypes.default.string,
    glyphSize: _proptypes.default.string,
    position: _proptypes.default.oneOf([
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

},{"../FormField/index.mjs":27,"../Glyph/index.mjs":39,"prop-types":258,"react":undefined}],45:[function(require,module,exports){
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

},{"../GridCol/index.mjs":46,"../GridRow/index.mjs":47}],46:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    gutter: _proptypes.default.number,
    large: _proptypes.default.string,
    medium: _proptypes.default.string,
    small: _proptypes.default.string,
    xsmall: _proptypes.default.string
};
GridCol.propTypes = {
    gutter: _proptypes.default.number,
    large: _proptypes.default.string,
    medium: _proptypes.default.string,
    small: _proptypes.default.string,
    xsmall: _proptypes.default.string
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

},{"../../../theme.mjs":150,"glamor":undefined,"prop-types":258,"react":undefined}],47:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _glamor = require("glamor");
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
    gutter: _proptypes.default.number,
    xsmall: _proptypes.default.string,
    small: _proptypes.default.string,
    medium: _proptypes.default.string,
    large: _proptypes.default.string
};
GridRow.propTypes = {
    gutter: _proptypes.default.number,
    large: _proptypes.default.string,
    medium: _proptypes.default.string,
    small: _proptypes.default.string,
    xsmall: _proptypes.default.string
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

},{"glamor":undefined,"prop-types":258,"react":undefined}],48:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    block: _proptypes.default.bool,
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]),
    contiguous: _proptypes.default.bool,
    cssStyles: _proptypes.default.shape({
        _definition: _proptypes.default.object,
        _name: _proptypes.default.string
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

},{"glamor":undefined,"prop-types":258,"react":undefined}],49:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    active: _proptypes.default.bool,
    children: _proptypes.default.element.isRequired,
    contiguous: _proptypes.default.bool,
    grow: _proptypes.default.bool,
    position: _proptypes.default.oneOf([
        'first',
        'last',
        'middle',
        'only'
    ])
};
const _default = InlineGroupSection;

},{"./styles.mjs":50,"glamor":undefined,"prop-types":258,"react":undefined}],50:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],51:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    inline: _proptypes.default.bool,
    title: _proptypes.default.string,
    type: _proptypes.default.oneOf([
        'checkbox',
        'radio'
    ]).isRequired
};
const _default = LabelledControl;

},{"./styles.mjs":52,"glamor":undefined,"prop-types":258,"react":undefined}],52:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],53:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _glamor = require("glamor");
const _index = /*#__PURE__*/ _interop_require_default(require("../Button/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../Spinner/index.mjs"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../theme.mjs"));
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
    loading: _proptypes.default.bool
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

},{"../../../theme.mjs":150,"../Button/index.mjs":14,"../Spinner/index.mjs":70,"glamor":undefined,"prop-types":258,"react":undefined}],54:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"glamor":undefined,"react":undefined}],55:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
	 */ UNSAFE_componentWillReceiveProps(nextProps) {
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
            onClick: backdropClosesModal ? this.handleBackdropClick : undefined,
            onTouchEnd: backdropClosesModal ? this.handleBackdropClick : undefined
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
    backdropClosesModal: _proptypes.default.bool,
    enableKeyboardInput: _proptypes.default.bool,
    isOpen: _proptypes.default.bool,
    onClose: _proptypes.default.func.isRequired,
    'data-confirm-dialog': _proptypes.default.bool,
    width: _proptypes.default.number
};
ModalDialog.defaultProps = {
    enableKeyboardInput: true,
    width: 768
};
ModalDialog.childContextTypes = {
    onClose: _proptypes.default.func.isRequired
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

},{"../../../theme.mjs":150,"../Portal/index.mjs":62,"../ScrollLock/index.mjs":65,"glamor":undefined,"prop-types":258,"react":undefined}],56:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    align: _proptypes.default.oneOf([
        'center',
        'left',
        'right'
    ]),
    children: _proptypes.default.node,
    onClose: _proptypes.default.func,
    showCloseButton: _proptypes.default.bool,
    text: _proptypes.default.string
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

},{"../../../theme.mjs":150,"glamor":undefined,"prop-types":258,"react":undefined}],57:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    children: _proptypes.default.node,
    onClose: _proptypes.default.func,
    showCloseButton: _proptypes.default.bool,
    text: _proptypes.default.string
};
ModalHeader.contextTypes = {
    onClose: _proptypes.default.func.isRequired
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

},{"../../../theme.mjs":150,"../GlyphButton/index.mjs":43,"glamor":undefined,"prop-types":258,"react":undefined}],58:[function(require,module,exports){
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

},{"./body.mjs":54,"./dialog.mjs":55,"./footer.mjs":56,"./header.mjs":57}],59:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    className: _proptypes.default.string,
    currentPage: _proptypes.default.number.isRequired,
    limit: _proptypes.default.number,
    onPageSelect: _proptypes.default.func,
    pageSize: _proptypes.default.number.isRequired,
    plural: _proptypes.default.string,
    singular: _proptypes.default.string,
    style: _proptypes.default.object,
    total: _proptypes.default.number.isRequired
};
const _default = Pagination;

},{"../../../theme.mjs":150,"./page.mjs":60,"glamor":undefined,"prop-types":258,"react":undefined}],60:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    disabled: _proptypes.default.bool,
    onClick: _proptypes.default.func.isRequired,
    selected: _proptypes.default.bool
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

},{"../../../theme.mjs":150,"glamor":undefined,"prop-types":258,"react":undefined}],61:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    context: _proptypes.default.object.isRequired
};
PassContext.childContextTypes = {
    onClose: _proptypes.default.func
};
const _default = PassContext;

},{"prop-types":258,"react":undefined}],62:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdom = require("react-dom");
const _index = /*#__PURE__*/ _interop_require_default(require("../PassContext/index.mjs"));
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
        (0, _reactdom.render)(/*#__PURE__*/ _react.default.createElement(_index.default, {
            context: this.context
        }, /*#__PURE__*/ _react.default.createElement("div", null, this.props.children)), this.portalElement);
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
    onClose: _proptypes.default.func
};

},{"../PassContext/index.mjs":61,"prop-types":258,"react":undefined,"react-dom":undefined}],63:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    hiddenLG: _proptypes.default.string,
    hiddenMD: _proptypes.default.string,
    hiddenSM: _proptypes.default.string,
    hiddenXS: _proptypes.default.string,
    visibleLG: _proptypes.default.string,
    visibleMD: _proptypes.default.string,
    visibleSM: _proptypes.default.string,
    visibleXS: _proptypes.default.string
};
ResponsiveText.defaultProps = {
    component: 'span'
};
const _default = ResponsiveText;

},{"../../../theme.mjs":150,"prop-types":258,"react":undefined}],64:[function(require,module,exports){
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

},{"glamor":undefined,"react":undefined}],65:[function(require,module,exports){
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
	 */ UNSAFE_componentWillMount() {
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

},{"react":undefined}],66:[function(require,module,exports){
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

},{"../../../theme.mjs":150}],67:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _glamor = require("glamor");
const _styles = /*#__PURE__*/ _interop_require_default(require("./styles.mjs"));
const _colors = /*#__PURE__*/ _interop_require_default(require("./colors.mjs"));
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
    _proptypes.default.bool,
    _proptypes.default.number,
    _proptypes.default.string
];
SegmentedControl.propTypes = {
    color: _proptypes.default.oneOf(Object.keys(_colors.default)),
    cropText: _proptypes.default.bool,
    equalWidthSegments: _proptypes.default.bool,
    inline: _proptypes.default.bool,
    onChange: _proptypes.default.func.isRequired,
    options: _proptypes.default.arrayOf(_proptypes.default.shape({
        disabled: _proptypes.default.bool,
        label: _proptypes.default.string,
        value: _proptypes.default.oneOfType(valuePropShape)
    })).isRequired,
    value: _proptypes.default.oneOfType(valuePropShape)
};
SegmentedControl.defaultProps = {
    color: 'default'
};
const _default = SegmentedControl;

},{"./colors.mjs":66,"./styles.mjs":68,"glamor":undefined,"prop-types":258,"react":undefined}],68:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"./colors.mjs":66}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    color: _proptypes.default.oneOf(_colors.default),
    size: _proptypes.default.oneOf(_sizes.default)
};
Spinner.defaultProps = {
    size: 'medium',
    color: 'default'
};
const _default = Spinner;

},{"../ScreenReaderOnly/index.mjs":64,"./colors.mjs":69,"./sizes.mjs":71,"./styles.mjs":72,"glamor":undefined,"prop-types":258,"react":undefined}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
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

},{"../../../theme.mjs":150,"./colors.mjs":69,"./sizes.mjs":71,"glamor":undefined}],73:[function(require,module,exports){
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

},{"./Alert/index.mjs":11,"./BlankState/index.mjs":13,"./Button/index.mjs":14,"./Center/index.mjs":16,"./Chip/index.mjs":19,"./Container/index.mjs":21,"./DropdownButton/index.mjs":24,"./Form/index.mjs":25,"./FormField/index.mjs":27,"./FormInput/index.mjs":29,"./FormLabel/index.mjs":32,"./FormNote/index.mjs":34,"./FormSelect/index.mjs":36,"./Glyph/index.mjs":39,"./GlyphButton/index.mjs":43,"./GlyphField/index.mjs":44,"./Grid/index.mjs":45,"./InlineGroup/index.mjs":48,"./InlineGroupSection/index.mjs":49,"./LabelledControl/index.mjs":51,"./LoadingButton/index.mjs":53,"./Modal/index.mjs":58,"./Pagination/index.mjs":59,"./ResponsiveText/index.mjs":63,"./ScreenReaderOnly/index.mjs":64,"./SegmentedControl/index.mjs":67,"./Spinner/index.mjs":70}],74:[function(require,module,exports){
/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */ // `@babel/polyfill` (deprecated) was previously required here for ES6
// generator support. Modern browsers ship native generators; if older
// targets need to be re-supported, add `core-js/stable` and
// `regenerator-runtime/runtime` as direct imports here.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = /*#__PURE__*/ _interop_require_default(require("react-dom"));
const _reactrouter = require("react-router");
const _reactredux = require("react-redux");
const _reactrouterredux = require("react-router-redux");
const _App = /*#__PURE__*/ _interop_require_default(require("./App.mjs"));
const _index = /*#__PURE__*/ _interop_require_default(require("./screens/Home/index.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("./screens/Item/index.mjs"));
const _index2 = /*#__PURE__*/ _interop_require_default(require("./screens/List/index.mjs"));
const _store = /*#__PURE__*/ _interop_require_default(require("./store.mjs"));
const _lists = require("../utils/lists.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Sync the browser history to the Redux store
const history = (0, _reactrouterredux.syncHistoryWithStore)(_reactrouter.browserHistory, _store.default);
Keystone.User = _lists.listsByKey[Keystone.userList];
_reactdom.default.render(/*#__PURE__*/ _react.default.createElement(_reactredux.Provider, {
    store: _store.default
}, /*#__PURE__*/ _react.default.createElement(_reactrouter.Router, {
    history: history
}, /*#__PURE__*/ _react.default.createElement(_reactrouter.Route, {
    path: Keystone.adminLegacyPath,
    component: _App.default
}, /*#__PURE__*/ _react.default.createElement(_reactrouter.IndexRoute, {
    component: _index.default
}), /*#__PURE__*/ _react.default.createElement(_reactrouter.Route, {
    path: ":listId",
    component: _index2.default
}), /*#__PURE__*/ _react.default.createElement(_reactrouter.Route, {
    path: ":listId/:itemId",
    component: _index1.default
})))), document.getElementById('react-root'));

},{"../utils/lists.mjs":155,"./App.mjs":1,"./screens/Home/index.mjs":84,"./screens/Item/index.mjs":102,"./screens/List/index.mjs":129,"./store.mjs":148,"react":undefined,"react-dom":undefined,"react-redux":undefined,"react-router":undefined,"react-router-redux":undefined}],75:[function(require,module,exports){
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
    get createFilterObject () {
        return createFilterObject;
    },
    get filterParser () {
        return filterParser;
    },
    get filtersParser () {
        return filtersParser;
    }
});
const _isPlainObject = /*#__PURE__*/ _interop_require_default(require("lodash/isPlainObject"));
const _isArray = /*#__PURE__*/ _interop_require_default(require("lodash/isArray"));
const _isObject = /*#__PURE__*/ _interop_require_default(require("lodash/isObject"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function filtersParser(filters, currentList) {
    if (typeof filters === 'string') {
        try {
            filters = JSON.parse(filters);
        } catch (e) {
            console.warn('Invalid filters provided', filters);
            filters = void 0;
        }
    }
    if (!filters) return [];
    const assembledFilters = filters.map((filter)=>{
        const path = filter.path;
        const value = Object.assign({}, filter);
        delete value.path;
        return createFilterObject(path, value, currentList.fields);
    });
    filters = assembledFilters.filter((filter)=>filter);
    return filters;
}
function filterParser({ path, value }, activeFilters, currentList) {
    if (!activeFilters || !(0, _isArray.default)(activeFilters)) {
        throw new Error('activeFilters must be an array');
    }
    if (!currentList) {
        throw new Error('No currentList selected');
    }
    if (!(0, _isObject.default)(currentList) || (0, _isArray.default)(currentList)) {
        throw new Error('currentList is expected to be an { Object }', currentList);
    }
    let filter = activeFilters.filter((i)=>i.field.path === path)[0];
    if (filter) {
        filter.value = value;
    } else {
        filter = createFilterObject(path, value, currentList.fields);
        if (!filter) {
            return void 0;
        }
    }
    return filter;
}
function createFilterObject(path, value, currentListFields) {
    if (!currentListFields || !(0, _isPlainObject.default)(currentListFields)) {
        console.warn('currentListFields must be a plain object', currentListFields);
        return;
    }
    const field = currentListFields[path];
    if (!field) {
        console.warn('Invalid Filter path specified:', path);
        return;
    }
    return {
        field,
        value
    };
}

},{"lodash/isArray":240,"lodash/isObject":246,"lodash/isPlainObject":248}],76:[function(require,module,exports){
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
    get columnsParser () {
        return columnsParser;
    },
    get createFilterObject () {
        return _filters.createFilterObject;
    },
    get filterParser () {
        return _filters.filterParser;
    },
    get filtersParser () {
        return _filters.filtersParser;
    },
    get sortParser () {
        return sortParser;
    }
});
const _filters = require("./filters.mjs");
/**
 * Returns an array of expanded column objects, given a columns value and a currentList object.
 * Falls back to the list's default columns when columns is empty or falsy.
 * @param {string} columns - A string representation of a list of columns.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {Array} An array of expanded column objects.
 */ function columnsParser(columns, currentList) {
    if (!currentList) {
        throw new Error('No currentList selected');
    }
    if (!columns || columns.length === 0) {
        return currentList.expandColumns(currentList.defaultColumns);
    }
    return currentList.expandColumns(columns);
}
/**
 * Returns an expanded sort object, given a sort path and a currentList object.
 * Falls back to the list's default sort when path is falsy.
 * @param {string} path - A string representation of the sort path.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {object} An expanded representation of the sort path.
 */ function sortParser(path, currentList) {
    if (!currentList) {
        throw new Error('No currentList selected');
    }
    if (!path) return currentList.expandSort(currentList.defaultSort);
    return currentList.expandSort(path);
}

},{"./filters.mjs":75}],77:[function(require,module,exports){
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
    get default () {
        return _default;
    },
    get setActiveColumnsSaga () {
        return setActiveColumnsSaga;
    },
    get setActiveFilterSaga () {
        return setActiveFilterSaga;
    },
    get setActiveSortSaga () {
        return setActiveSortSaga;
    }
});
const _reduxsaga = require("redux-saga");
const _effects = require("redux-saga/effects");
const _constants = /*#__PURE__*/ _interop_require_wildcard(require("../screens/List/constants.mjs"));
const _queryParamsSagas = require("./queryParamsSagas.mjs");
const _index = require("../parsers/index.mjs");
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
 * Debounce the search loading new items by 500ms
 */ function* debouncedSearch() {
    const searchString = yield (0, _effects.select)((state)=>state.active.search);
    if (searchString) {
        yield (0, _reduxsaga.delay)(500);
    }
    yield (0, _effects.call)(_queryParamsSagas.updateParams);
}
function* setActiveColumnsSaga() {
    while(true){
        const { columns } = yield (0, _effects.take)(_constants.SELECT_ACTIVE_COLUMNS);
        const { currentList } = yield (0, _effects.select)((state)=>state.lists);
        const newColumns = yield (0, _effects.call)(_index.columnsParser, columns, currentList);
        yield (0, _effects.put)({
            type: _constants.SET_ACTIVE_COLUMNS,
            columns: newColumns
        });
    }
}
function* setActiveSortSaga() {
    while(true){
        const { path } = yield (0, _effects.take)(_constants.SELECT_ACTIVE_SORT);
        const { currentList } = yield (0, _effects.select)((state)=>state.lists);
        const sort = yield (0, _effects.call)(_index.sortParser, path, currentList);
        yield (0, _effects.put)({
            type: _constants.SET_ACTIVE_SORT,
            sort
        });
    }
}
function* setActiveFilterSaga() {
    while(true){
        const { filter } = yield (0, _effects.take)(_constants.SELECT_FILTER);
        const { currentList } = yield (0, _effects.select)((state)=>state.lists);
        const activeFilters = yield (0, _effects.select)((state)=>state.active.filters);
        const updatedFilter = yield (0, _effects.call)(_index.filterParser, filter, activeFilters, currentList);
        yield (0, _effects.put)({
            type: _constants.ADD_FILTER,
            filter: updatedFilter
        });
    }
}
/**
 * Root saga that forks all feature sagas and wires up takeLatest watchers
 * for search debouncing, list activation, and query-param synchronisation.
 * @yields {void} Redux saga fork effects.
 */ function* rootSaga() {
    yield (0, _effects.fork)(_reduxsaga.takeLatest, _constants.SET_ACTIVE_SEARCH, debouncedSearch);
    yield (0, _effects.fork)(_reduxsaga.takeLatest, _constants.SET_ACTIVE_LIST, _queryParamsSagas.evalQueryParams);
    // If one of the other active properties changes, update the query params and load the new items
    yield (0, _effects.fork)(setActiveSortSaga);
    yield (0, _effects.fork)(setActiveColumnsSaga);
    yield (0, _effects.fork)(setActiveFilterSaga);
    yield (0, _effects.fork)(_reduxsaga.takeLatest, [
        _constants.QUERY_HAS_CHANGED,
        _constants.ADD_FILTER,
        _constants.SET_ACTIVE_COLUMNS,
        _constants.SET_ACTIVE_SORT,
        _constants.SET_CURRENT_PAGE,
        _constants.CLEAR_FILTER,
        _constants.CLEAR_ALL_FILTERS
    ], _queryParamsSagas.updateParams);
}
const _default = rootSaga;

},{"../parsers/index.mjs":76,"../screens/List/constants.mjs":128,"./queryParamsSagas.mjs":78,"redux-saga":undefined,"redux-saga/effects":264}],78:[function(require,module,exports){
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
    get evalQueryParams () {
        return evalQueryParams;
    },
    get parseQueryParams () {
        return parseQueryParams;
    },
    get updateParams () {
        return updateParams;
    },
    get urlUpdate () {
        return urlUpdate;
    }
});
const _queryParams = require("../../utils/queryParams.mjs");
const _reactrouterredux = require("react-router-redux");
const _effects = require("redux-saga/effects");
const _constants = /*#__PURE__*/ _interop_require_wildcard(require("../screens/List/constants.mjs"));
const _index = require("../screens/List/actions/index.mjs");
const _isEqual = /*#__PURE__*/ _interop_require_default(require("lodash/isEqual"));
const _index1 = require("../parsers/index.mjs");
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
function* urlUpdate(query, cache, pathname) {
    const { search: _sq } = query, attenuatedQuery = _object_without_properties(query, [
        "search"
    ]);
    const { search: _sc } = cache, attenuatedCache = _object_without_properties(cache, [
        "search"
    ]);
    if (!(0, _isEqual.default)(attenuatedQuery, attenuatedCache)) {
        yield (0, _effects.put)((0, _reactrouterredux.push)({
            pathname,
            query
        }));
    } else {
        yield (0, _effects.put)((0, _reactrouterredux.replace)({
            pathname,
            query
        }));
    }
}
function* updateParams() {
    // Select all the things
    const activeState = yield (0, _effects.select)((state)=>state.active);
    const currentList = yield (0, _effects.select)((state)=>state.lists.currentList);
    const location = yield (0, _effects.select)((state)=>state.routing.locationBeforeTransitions);
    const { index } = yield (0, _effects.select)((state)=>state.lists.page);
    // Get the data into the right format, set the defaults
    const sort = (0, _queryParams.createSortQueryParams)(activeState.sort.rawInput, currentList.defaultSort);
    const page = (0, _queryParams.createPageQueryParams)(index, 1);
    const columns = (0, _queryParams.stringifyColumns)(activeState.columns, currentList.defaultColumnPaths);
    const search = activeState.search;
    const filters = (0, _queryParams.parametizeFilters)(activeState.filters);
    const newParams = (0, _queryParams.updateQueryParams)({
        page,
        columns,
        sort,
        search,
        filters
    }, location);
    // TODO: Starting or clearing a search pushes a new history state, but updating
    // the current search replaces it for nicer history navigation support
    yield (0, _effects.put)({
        type: _constants.REPLACE_CACHED_QUERY,
        cachedQuery: newParams
    });
    yield* urlUpdate(newParams, activeState.cachedQuery, location.pathname);
    yield (0, _effects.put)((0, _index.loadItems)());
}
function* evalQueryParams() {
    const { pathname, query } = yield (0, _effects.select)((state)=>state.routing.locationBeforeTransitions);
    const { cachedQuery } = yield (0, _effects.select)((state)=>state.active);
    const { currentList } = yield (0, _effects.select)((state)=>state.lists);
    if (pathname !== `${Keystone.adminLegacyPath}/${currentList.id}`) return;
    if ((0, _isEqual.default)(query, cachedQuery)) {
        yield (0, _effects.put)({
            type: _constants.QUERY_HAS_NOT_CHANGED
        });
        yield (0, _effects.put)((0, _index.loadItems)());
    } else {
        const parsedQuery = yield (0, _effects.call)(parseQueryParams, query, currentList);
        yield (0, _effects.put)({
            type: _constants.QUERY_HAS_CHANGED,
            parsedQuery
        });
    }
}
function parseQueryParams(query, currentList) {
    const columns = (0, _index1.columnsParser)(query.columns, currentList);
    const sort = (0, _index1.sortParser)(query.sort, currentList);
    const filters = (0, _index1.filtersParser)(query.filters, currentList);
    const currentPage = query.page || 1;
    const search = query.search || '';
    return {
        columns,
        sort,
        filters,
        currentPage,
        search
    };
}

},{"../../utils/queryParams.mjs":156,"../parsers/index.mjs":76,"../screens/List/actions/index.mjs":106,"../screens/List/constants.mjs":128,"lodash/isEqual":243,"react-router-redux":undefined,"redux-saga/effects":264}],79:[function(require,module,exports){
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
    get countsLoaded () {
        return countsLoaded;
    },
    get countsLoadingError () {
        return countsLoadingError;
    },
    get loadCounts () {
        return loadCounts;
    }
});
const _xhr = /*#__PURE__*/ _interop_require_default(require("xhr"));
const _constants = require("./constants.mjs");
const _constants1 = require("../../../constants.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getAdminApiPath() {
    return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}
function loadCounts() {
    return (dispatch)=>{
        dispatch({
            type: _constants.LOAD_COUNTS
        });
        (0, _xhr.default)({
            url: `${getAdminApiPath()}/counts`
        }, (err, resp, body)=>{
            if (err) {
                dispatch(countsLoadingError(err));
                return;
            }
            try {
                body = JSON.parse(body);
                if (body.counts) {
                    dispatch(countsLoaded(body.counts));
                }
            } catch (e) {
                console.log('Error parsing results json:', e, body);
                dispatch(countsLoadingError(e));
                return;
            }
        });
    };
}
function countsLoaded(counts) {
    return {
        type: _constants.COUNTS_LOADING_SUCCESS,
        counts
    };
}
function countsLoadingError(error) {
    return (dispatch, getState)=>{
        dispatch({
            type: _constants.COUNTS_LOADING_ERROR,
            error
        });
        setTimeout(()=>{
            dispatch(loadCounts());
        }, _constants1.NETWORK_ERROR_RETRY_DELAY);
    };
}

},{"../../../constants.mjs":149,"./constants.mjs":83,"xhr":undefined}],80:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactrouter = require("react-router");
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
/**
 * Displays information about a list and lets you create a new one.
 */ const ListTile = (0, _createreactclass.default)({
    propTypes: {
        count: _proptypes.default.string,
        hideCreateButton: _proptypes.default.bool,
        href: _proptypes.default.string,
        label: _proptypes.default.string,
        path: _proptypes.default.string,
        spinner: _proptypes.default.object
    },
    render () {
        const opts = {
            'data-dashboard-list': true,
            'data-list-path': this.props.path
        };
        return /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            className: "dashboard-group__list"
        }, opts), /*#__PURE__*/ _react.default.createElement("span", {
            className: "dashboard-group__list-inner"
        }, /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            to: this.props.href,
            className: "dashboard-group__list-tile",
            "data-dashboard-list-manage": true,
            "data-list-path": this.props.path
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-group__list-label"
        }, this.props.label), /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-group__list-count",
            "data-dashboard-list-count": true
        }, this.props.spinner || this.props.count)), !this.props.hideCreateButton && /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            to: this.props.href + '?create',
            className: "dashboard-group__list-create octicon octicon-plus",
            title: "Create",
            tabIndex: "-1"
        })));
    },
    displayName: "ListTile"
});
const _default = ListTile;

},{"create-react-class":161,"prop-types":258,"react":undefined,"react-router":undefined}],81:[function(require,module,exports){
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
    get Lists () {
        return Lists;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _reactredux = require("react-redux");
const _string = require("../../../../utils/string.mjs");
const _ListTile = /*#__PURE__*/ _interop_require_default(require("./ListTile.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class Lists extends _react.default.Component {
    /**
	 * Renders a container div with a ListTile for each list in the section.
	 * @returns {React.Element} A container div with a ListTile for each list
	 */ render() {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-group__lists"
        }, _lodash.default.map(this.props.lists, (list, key)=>{
            // If an object is passed in the key is the index,
            // if an array is passed in the key is at list.key
            const listKey = list.key || key;
            const href = list.external ? list.path : `${Keystone.adminLegacyPath}/${list.path}`;
            const listData = this.props.listsData[list.path];
            const isNoCreate = listData ? listData.nocreate : false;
            return /*#__PURE__*/ _react.default.createElement(_ListTile.default, {
                key: list.path,
                path: list.path,
                label: list.label,
                hideCreateButton: isNoCreate,
                href: href,
                count: (0, _string.plural)(this.props.counts[listKey], '* Item', '* Items'),
                spinner: this.props.spinner
            });
        }));
    }
}
Lists.propTypes = {
    counts: _proptypes.default.object.isRequired,
    lists: _proptypes.default.oneOfType([
        _proptypes.default.array,
        _proptypes.default.object
    ]).isRequired,
    spinner: _proptypes.default.node
};
const _default = (0, _reactredux.connect)((state)=>{
    return {
        listsData: state.lists.data
    };
})(Lists);

},{"../../../../utils/string.mjs":157,"./ListTile.mjs":80,"lodash":undefined,"prop-types":258,"react":undefined,"react-redux":undefined}],82:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _getRelatedIconClass = /*#__PURE__*/ _interop_require_default(require("../utils/getRelatedIconClass.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Renders a dashboard section with a heading icon, label, and child list tiles.
 */ class Section extends _react.default.Component {
    /**
	 * Renders the section heading with icon and label, wrapping the child list tiles.
	 * @returns {React.Element} A dashboard group div with a heading and children
	 */ render() {
        const iconClass = this.props.icon || (0, _getRelatedIconClass.default)(this.props.id);
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-group",
            "data-section-label": this.props.label
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-group__heading"
        }, /*#__PURE__*/ _react.default.createElement("span", {
            className: `dashboard-group__heading-icon ${iconClass}`
        }), this.props.label), this.props.children);
    }
}
Section.propTypes = {
    children: _proptypes.default.element.isRequired,
    icon: _proptypes.default.string,
    id: _proptypes.default.string,
    label: _proptypes.default.string.isRequired
};
const _default = Section;

},{"../utils/getRelatedIconClass.mjs":86,"prop-types":258,"react":undefined}],83:[function(require,module,exports){
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
    get COUNTS_LOADING_ERROR () {
        return COUNTS_LOADING_ERROR;
    },
    get COUNTS_LOADING_SUCCESS () {
        return COUNTS_LOADING_SUCCESS;
    },
    get LOAD_COUNTS () {
        return LOAD_COUNTS;
    }
});
const LOAD_COUNTS = 'app/Home/LOAD_COUNTS';
const COUNTS_LOADING_SUCCESS = 'app/Home/COUNTS_LOADING_SUCCESS';
const COUNTS_LOADING_ERROR = 'app/Home/COUNTS_LOADING_ERROR';

},{}],84:[function(require,module,exports){
/**
 * The Home view is the view one sees at /keystone. It shows a list of all lists,
 * grouped by their section.
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
    get HomeView () {
        return HomeView;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _index = require("../../elemental/index.mjs");
const _reactredux = require("react-redux");
const _Lists = /*#__PURE__*/ _interop_require_default(require("./components/Lists.mjs"));
const _Section = /*#__PURE__*/ _interop_require_default(require("./components/Section.mjs"));
const _AlertMessages = /*#__PURE__*/ _interop_require_default(require("../../shared/AlertMessages.mjs"));
const _actions = require("./actions.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const HomeView = (0, _createreactclass.default)({
    displayName: 'HomeView',
    getInitialState () {
        return {
            modalIsOpen: true
        };
    },
    // When everything is rendered, start loading the item counts of the lists
    // from the API
    componentDidMount () {
        this.props.dispatch((0, _actions.loadCounts)());
    },
    getSpinner () {
        if (this.props.counts && Object.keys(this.props.counts).length === 0 && (this.props.error || this.props.loading)) {
            return /*#__PURE__*/ _react.default.createElement(_index.Spinner, null);
        }
        return null;
    },
    render () {
        const spinner = this.getSpinner();
        return /*#__PURE__*/ _react.default.createElement(_index.Container, {
            "data-screen-id": "home"
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-header"
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-heading"
        }, Keystone.brand)), /*#__PURE__*/ _react.default.createElement("div", {
            className: "dashboard-groups"
        }, this.props.error && /*#__PURE__*/ _react.default.createElement(_AlertMessages.default, {
            alerts: {
                error: {
                    error: "There is a problem with the network, we're trying to reconnect..."
                }
            }
        }), Keystone.nav.flat ? /*#__PURE__*/ _react.default.createElement(_Lists.default, {
            counts: this.props.counts,
            lists: Keystone.lists,
            spinner: spinner
        }) : /*#__PURE__*/ _react.default.createElement("div", null, Keystone.nav.sections.map((navSection)=>{
            return /*#__PURE__*/ _react.default.createElement(_Section.default, {
                key: navSection.key,
                id: navSection.key,
                label: navSection.label
            }, /*#__PURE__*/ _react.default.createElement(_Lists.default, {
                counts: this.props.counts,
                lists: navSection.lists,
                spinner: spinner
            }));
        }), Keystone.orphanedLists.length ? /*#__PURE__*/ _react.default.createElement(_Section.default, {
            label: "Other",
            icon: "octicon-database"
        }, /*#__PURE__*/ _react.default.createElement(_Lists.default, {
            counts: this.props.counts,
            lists: Keystone.orphanedLists,
            spinner: spinner
        })) : null)));
    }
});
const _default = (0, _reactredux.connect)((state)=>({
        counts: state.home.counts,
        loading: state.home.loading,
        error: state.home.error
    }))(HomeView);

},{"../../elemental/index.mjs":73,"../../shared/AlertMessages.mjs":132,"./actions.mjs":79,"./components/Lists.mjs":81,"./components/Section.mjs":82,"create-react-class":161,"react":undefined,"react-redux":undefined}],85:[function(require,module,exports){
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
const _constants = require("./constants.mjs");
const initialState = {
    counts: {},
    loading: false,
    error: null
};
/**
 * Reducer for the Home screen, managing list counts and their loading state.
 * @param {object} state The current state, defaulting to initialState
 * @param {object} action The dispatched action
 * @returns {object} The next state after applying the action
 */ function home(state = initialState, action) {
    switch(action.type){
        case _constants.LOAD_COUNTS:
            return Object.assign({}, state, {
                loading: true
            });
        case _constants.COUNTS_LOADING_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                counts: action.counts,
                error: null
            });
        case _constants.COUNTS_LOADING_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.error
            });
        default:
            return state;
    }
}
const _default = home;

},{"./constants.mjs":83}],86:[function(require,module,exports){
/**
 * Gets a related icon for a string, returned as a classname to be applied to a span. If no related
 * icon is found, returns a classname for a dot icon
 * @param  {string} string The section identifier to look up
 * @returns {string} The classname of the icon
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return getRelatedIconClass;
    }
});
function getRelatedIconClass(string) {
    const icons = [
        {
            icon: 'book',
            sections: [
                'books',
                'posts',
                'blog',
                'blog-posts',
                'stories',
                'news-stories',
                'content'
            ]
        },
        {
            icon: 'briefcase',
            sections: [
                'businesses',
                'companies',
                'listings',
                'organizations',
                'partners'
            ]
        },
        {
            icon: 'calendar',
            sections: [
                'events',
                'dates'
            ]
        },
        {
            icon: 'clock',
            sections: [
                'classes',
                'hours',
                'times'
            ]
        },
        {
            icon: 'file-media',
            sections: [
                'gallery',
                'galleries',
                'images',
                'photos',
                'pictures'
            ]
        },
        {
            icon: 'file-text',
            sections: [
                'attachments',
                'docs',
                'documents',
                'files'
            ]
        },
        {
            icon: 'location',
            sections: [
                'locations',
                'markers',
                'places'
            ]
        },
        {
            icon: 'mail',
            sections: [
                'emails',
                'enquiries'
            ]
        },
        {
            icon: 'megaphone',
            sections: [
                'broadcasts',
                'jobs',
                'talks'
            ]
        },
        {
            icon: 'organization',
            sections: [
                'contacts',
                'customers',
                'groups',
                'members',
                'people',
                'speakers',
                'teams',
                'users'
            ]
        },
        {
            icon: 'package',
            sections: [
                'boxes',
                'items',
                'packages',
                'parcels'
            ]
        },
        {
            icon: 'tag',
            sections: [
                'tags'
            ]
        }
    ];
    const classes = icons.filter((obj)=>obj.sections.indexOf(string) !== -1).map((obj)=>`octicon octicon-${obj.icon}`);
    if (!classes.length) {
        classes.push('octicon octicon-primitive-dot');
    }
    return classes.join(' ');
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
    get dataLoaded () {
        return dataLoaded;
    },
    get dataLoadingError () {
        return dataLoadingError;
    },
    get deleteItem () {
        return deleteItem;
    },
    get loadItemData () {
        return loadItemData;
    },
    get loadRelationshipItemData () {
        return loadRelationshipItemData;
    },
    get moveItem () {
        return moveItem;
    },
    get relationshipDataLoaded () {
        return relationshipDataLoaded;
    },
    get reorderItems () {
        return reorderItems;
    },
    get resetItems () {
        return resetItems;
    },
    get selectItem () {
        return selectItem;
    }
});
const _constants = require("./constants.mjs");
const _index = require("../List/actions/index.mjs");
function selectItem(itemId) {
    return {
        type: _constants.SELECT_ITEM,
        id: itemId
    };
}
function loadItemData() {
    return (dispatch, getState)=>{
        // Hold on to the id of the item we currently want to load.
        // Dispatch this reference to our redux store to hold on to as a 'loadingRef'.
        const currentItemID = getState().item.id;
        dispatch({
            type: _constants.LOAD_DATA
        });
        const state = getState();
        const list = state.lists.currentList;
        // const itemID = state.item.id;
        // Load a specific item with the utils/List.js helper
        list.loadItem(state.item.id, {
            drilldown: true
        }, (err, itemData)=>{
            // Once this async request has fired this callback, check that
            // the item id referenced by thisLoadRef is the same id
            // referenced by loadingRef in the redux store.
            // If it is, then this is the latest request, and it is safe to resolve it normally.
            // If it is not the same id however,
            // this means that this request is NOT the latest fired request,
            // and so we'll bail out of it early.
            if (getState().item.id !== currentItemID) return;
            if (err || !itemData) {
                dispatch(dataLoadingError(err));
            } else {
                dispatch(dataLoaded(itemData));
            }
        });
    };
}
function loadRelationshipItemData({ columns, refList, relationship, relatedItemId }) {
    return (dispatch, getState)=>{
        refList.loadItems({
            columns: columns,
            filters: [
                {
                    field: refList.fields[relationship.refPath],
                    value: {
                        value: relatedItemId
                    }
                }
            ]
        }, (err, items)=>{
            // // TODO: indicate pagination & link to main list view
            // this.setState({ items });
            dispatch(relationshipDataLoaded(relationship.path, items));
        });
    };
}
function dataLoaded(data) {
    return {
        type: _constants.DATA_LOADING_SUCCESS,
        loadingRef: null,
        data
    };
}
function relationshipDataLoaded(path, data) {
    return {
        type: _constants.LOAD_RELATIONSHIP_DATA,
        relationshipPath: path,
        data
    };
}
function dataLoadingError(err) {
    return {
        type: _constants.DATA_LOADING_ERROR,
        loadingRef: null,
        error: err
    };
}
function deleteItem(id, router) {
    return (dispatch, getState)=>{
        const state = getState();
        const list = state.lists.currentList;
        list.deleteItem(id, (err)=>{
            // If a router is passed, redirect to the current list path,
            // otherwise stay where we are
            if (router) {
                let redirectUrl = `${Keystone.adminLegacyPath}/${list.path}`;
                if (state.lists.page.index && state.lists.page.index > 1) {
                    redirectUrl = `${redirectUrl}?page=${state.lists.page.index}`;
                }
                router.push(redirectUrl);
            }
            // TODO Proper error handling
            if (err) {
                alert(err.error || 'Error deleting item, please try again!');
            } else {
                dispatch((0, _index.loadItems)());
            }
        });
    };
}
function reorderItems({ columns, refList, relationship, relatedItemId, item, prevSortOrder, newSortOrder }) {
    return (dispatch, getState)=>{
        // Send the item, previous sortOrder and the new sortOrder
        // we should get the proper list and new page results in return
        refList.reorderItems(item, prevSortOrder, newSortOrder, {
            columns: columns,
            filters: [
                {
                    field: refList.fields[relationship.refPath],
                    value: {
                        value: relatedItemId
                    }
                }
            ]
        }, (err, items)=>{
            dispatch(relationshipDataLoaded(relationship.path, items));
        // If err, flash the row alert
        // if (err) {
        // 	dispatch(resetItems(item.id));
        // 	// return this.resetItems(this.findItemById[item.id]);
        // } else {
        // 	dispatch(itemsLoaded(items));
        // 	dispatch(setRowAlert({
        // 		success: item.id,
        // 		fail: false,
        // 	}));
        // }
        });
    };
}
function moveItem({ prevIndex, newIndex, relationshipPath, newSortOrder }) {
    return {
        type: _constants.DRAG_MOVE_ITEM,
        prevIndex,
        newIndex,
        relationshipPath,
        newSortOrder
    };
}
function resetItems() {
    return {
        type: _constants.DRAG_RESET_ITEMS
    };
}

},{"../List/actions/index.mjs":106,"./constants.mjs":101}],88:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
 * Renders alternate content when a modifier key (e.g. Alt) is held down
 */ class AltText extends _react.Component {
    /**
	 * Attaches keydown and keyup listeners to detect modifier key presses
	 */ componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyDown, false);
        document.body.addEventListener('keyup', this.handleKeyUp, false);
    }
    /**
	 * Removes keydown and keyup listeners on unmount
	 */ componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
    }
    /**
	 * Sets modified state when the configured modifier key is pressed
	 * @param {KeyboardEvent} e The keydown event
	 */ handleKeyDown(e) {
        if (e.key !== this.props.modifier) return;
        this.setState({
            modified: true
        });
    }
    /**
	 * Clears modified state when the configured modifier key is released
	 * @param {KeyboardEvent} e The keyup event
	 */ handleKeyUp(e) {
        if (e.key !== this.props.modifier) return;
        this.setState({
            modified: false
        });
    }
    /**
	 * Renders the wrapped component with either normal or modified children based on key state
	 * @returns {React.Element} The rendered component
	 */ render() {
        // NOTE `modifier` is declared to remove it from `props`, though never used
        const _this_props = this.props, { component: Component, modified, modifier, normal } = _this_props, props = _object_without_properties(_this_props, [
            "component",
            "modified",
            "modifier",
            "normal"
        ]);
        props.children = this.state.modified ? modified : normal;
        return /*#__PURE__*/ _react.default.createElement(Component, props);
    }
    /**
	 * Initialises key-tracking handlers and sets the initial modified state
	 */ constructor(){
        super();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.state = {
            modified: false
        };
    }
}
const SUPPORTED_KEYS = [
    'Alt',
    'Control',
    'Meta',
    'Shift'
];
AltText.propTypes = {
    component: _proptypes.default.oneOfType([
        _proptypes.default.func,
        _proptypes.default.string
    ]),
    modified: _proptypes.default.oneOfType([
        _proptypes.default.element,
        _proptypes.default.string
    ]),
    modifier: _proptypes.default.oneOf(SUPPORTED_KEYS),
    normal: _proptypes.default.oneOfType([
        _proptypes.default.element,
        _proptypes.default.string
    ])
};
AltText.defaultProps = {
    component: 'span',
    modifier: 'Alt'
};
const _default = AltText;

},{"prop-types":258,"react":undefined}],89:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _DrilldownItem = /*#__PURE__*/ _interop_require_default(require("./DrilldownItem.mjs"));
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
 * Renders an inline horizontal breadcrumb-style list of drilldown navigation links
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name to apply to the list
 * @param {Array} props.items Array of navigation items, each with href and label
 * @returns {React.Element} An unordered list of DrilldownItem components
 */ function Drilldown(_0) {
    let { className, items } = _0, props = _object_without_properties(_0, [
        "className",
        "items"
    ]);
    props.className = (0, _glamor.css)(classes.drilldown, className);
    return /*#__PURE__*/ _react.default.createElement("ul", props, items.map((item, idx)=>/*#__PURE__*/ _react.default.createElement(_DrilldownItem.default, {
            href: item.href,
            key: idx,
            label: item.label,
            separate: idx < items.length - 1
        })));
}
Drilldown.propTypes = {
    items: _proptypes.default.arrayOf(_proptypes.default.shape({
        href: _proptypes.default.string.isRequired,
        label: _proptypes.default.string.isRequired,
        separate: _proptypes.default.bool
    })).isRequired
};
const classes = {
    drilldown: {
        display: 'inline-block',
        listStyle: 'none',
        margin: 0,
        padding: 0
    }
};
const _default = Drilldown;

},{"./DrilldownItem.mjs":90,"glamor":undefined,"prop-types":258,"react":undefined}],90:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactrouter = require("react-router");
const _index = require("../../../elemental/index.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
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
 * Renders a single drilldown navigation link, optionally followed by a separator glyph
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name
 * @param {string} props.href The URL the link navigates to
 * @param {string} props.label The visible link text
 * @param {boolean} [props.separate] When true, renders a separator after the link
 * @param {React.Element|string} [props.separator] Custom separator content; defaults to a chevron-right glyph
 * @param {object} [props.style] Inline styles forwarded to the Button component
 * @returns {React.Element} A list item containing a link button and an optional separator
 */ function DrilldownItem(_0) {
    let { className, href, label, separate, separator, style } = _0, props = _object_without_properties(_0, [
        "className",
        "href",
        "label",
        "separate",
        "separator",
        "style"
    ]);
    props.className = (0, _glamor.css)(classes.item, className);
    // remove horizontal padding
    const styles = _object_spread({
        paddingLeft: 0,
        paddingRight: 0
    }, style);
    return /*#__PURE__*/ _react.default.createElement("li", props, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        component: _reactrouter.Link,
        style: styles,
        to: href,
        variant: "link"
    }, label), separate && /*#__PURE__*/ _react.default.createElement("span", {
        className: (0, _glamor.css)(classes.separator)
    }, separator));
}
DrilldownItem.propTypes = {
    href: _proptypes.default.string.isRequired,
    label: _proptypes.default.string.isRequired,
    separate: _proptypes.default.bool,
    separator: _proptypes.default.oneOfType([
        _proptypes.default.element,
        _proptypes.default.string
    ])
};
DrilldownItem.defaultProps = {
    separator: /*#__PURE__*/ _react.default.createElement(_index.Glyph, {
        name: "chevron-right"
    })
};
const classes = {
    item: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
        verticalAlign: 'middle'
    },
    separator: {
        color: _theme.default.color.gray40,
        marginLeft: '0.5em',
        marginRight: '0.5em'
    }
};
const _default = DrilldownItem;

},{"../../../../theme.mjs":150,"../../../elemental/index.mjs":73,"glamor":undefined,"prop-types":258,"react":undefined,"react-router":undefined}],91:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _index = require("../../../elemental/index.mjs");
const _FieldTypes = require("FieldTypes");
const _color = require("../../../../utils/color.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
const _AlertMessages = /*#__PURE__*/ _interop_require_default(require("../../../shared/AlertMessages.mjs"));
const _ConfirmationDialog = /*#__PURE__*/ _interop_require_default(require("../../../shared/ConfirmationDialog.mjs"));
const _FormHeading = /*#__PURE__*/ _interop_require_default(require("./FormHeading.mjs"));
const _AltText = /*#__PURE__*/ _interop_require_default(require("./AltText.mjs"));
const _FooterBar = /*#__PURE__*/ _interop_require_default(require("./FooterBar.mjs"));
const _InvalidFieldType = /*#__PURE__*/ _interop_require_default(require("../../../shared/InvalidFieldType.mjs"));
const _actions = require("../actions.mjs");
const _string = require("../../../../utils/string.mjs");
const _constants = require("../constants.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getNameFromData(data) {
    if (typeof data === 'object') {
        if (typeof data.first === 'string' && typeof data.last === 'string') {
            return data.first + ' ' + data.last;
        } else if (data.id) {
            return data.id;
        }
    }
    return data;
}
function smoothScrollTop() {
    const position = window.scrollY || window.pageYOffset;
    const speed = position / 10;
    if (position > 1) {
        const newPosition = position - speed;
        window.scrollTo(0, newPosition);
        window.requestAnimationFrame(smoothScrollTop);
    } else {
        window.scrollTo(0, 0);
    }
}
const EditForm = (0, _createreactclass.default)({
    displayName: 'EditForm',
    propTypes: {
        data: _proptypes.default.object,
        list: _proptypes.default.object
    },
    getInitialState () {
        const hasAsyncFields = !!this.props.list.columns.find((col)=>{
            if (col.field && col.field.type === 'relationship') {
                const fieldData = this.props.data.fields[col.field.path];
                return col.field.many ? fieldData.length > 0 : fieldData;
            } else {
                return false;
            }
        });
        return {
            values: Object.assign({}, this.props.data.fields),
            confirmationDialog: null,
            loading: hasAsyncFields,
            hasLoaded: !hasAsyncFields,
            lastValues: null,
            focusFirstField: !this.props.list.nameField && !this.props.list.nameFieldIsFormHeader
        };
    },
    componentDidMount () {
        this.__isMounted = true;
    },
    componentWillUnmount () {
        this.__isMounted = false;
    },
    getFieldProps (field) {
        const props = Object.assign({}, field);
        const alerts = this.state.alerts;
        // Display validation errors inline
        if (alerts && alerts.error && alerts.error.error === 'validation errors') {
            if (alerts.error.detail[field.path]) {
                // NOTE: This won't work yet, as ElementalUI doesn't allow
                // passed in isValid, only invalidates via internal state.
                // PR to fix that: https://github.com/elementalui/elemental/pull/149
                props.isValid = false;
            }
        }
        props.value = this.state.values[field.path] === undefined ? field.defaultValue : this.state.values[field.path];
        props.values = this.state.values;
        props.onChange = this.handleChange;
        props.mode = 'edit';
        // add a callback on RelationshipField element props to call when values are fully loaded
        if (props.type === 'relationship' && !this.state.hasLoaded) {
            if (props.many && props.value.length > 0 || !props.many && !!props.value) {
                this.registerAsyncField(field.path);
                props.onValuesLoaded = this.onAsyncFieldValuesLoaded;
            }
        }
        return props;
    },
    registerAsyncField (fieldName) {
        this.__asyncFields = this.__asyncFields || {};
        this.__asyncFields[fieldName] = this.__asyncFields[fieldName] || _constants.ASYNC_FIELD_LOADING;
    },
    onAsyncFieldValuesLoaded (fieldName) {
        this.__asyncFields[fieldName] = _constants.ASYNC_FIELD_LOADED;
        const isLoadingComplete = Object.values(this.__asyncFields).filter((asyncStatus)=>asyncStatus !== _constants.ASYNC_FIELD_LOADED).length === 0;
        this.setState({
            loading: !isLoadingComplete,
            hasLoaded: isLoadingComplete
        });
    },
    handleChange (event) {
        const values = Object.assign({}, this.state.values);
        values[event.path] = event.value;
        this.setState({
            values
        });
    },
    toggleDeleteDialog () {
        this.setState({
            deleteDialogIsOpen: !this.state.deleteDialogIsOpen
        });
    },
    toggleResetDialog () {
        this.setState({
            resetDialogIsOpen: !this.state.resetDialogIsOpen
        });
    },
    handleReset () {
        this.setState({
            values: Object.assign({}, this.state.lastValues || this.props.data.fields),
            resetDialogIsOpen: false
        });
    },
    handleDelete () {
        const { data } = this.props;
        this.props.dispatch((0, _actions.deleteItem)(data.id, this.props.router));
    },
    handleKeyFocus () {
        const input = this.refs.keyOrIdInput;
        input.select();
    },
    removeConfirmationDialog () {
        this.setState({
            confirmationDialog: null
        });
    },
    updateItem () {
        const { data, list } = this.props;
        const editForm = this.refs.editForm;
        // Fix for Safari where XHR form submission fails when input[type=file] is empty
        // https://stackoverflow.com/questions/49614091/safari-11-1-ajax-xhr-form-submission-fails-when-inputtype-file-is-empty
        $(editForm).find("input[type='file']").each(function() {
            if ($(this).get(0).files.length === 0) {
                $(this).prop('disabled', true);
            }
        });
        const formData = new FormData(editForm);
        $(editForm).find("input[type='file']").each(function() {
            if ($(this).get(0).files.length === 0) {
                $(this).prop('disabled', false);
            }
        });
        // Show loading indicator
        this.setState({
            loading: true
        });
        list.updateItem(data.id, formData, (err, data)=>{
            smoothScrollTop();
            if (err) {
                this.setState({
                    alerts: {
                        error: err
                    },
                    loading: false
                });
            } else {
                // Success, display success flash messages, replace values
                // TODO: Update key value
                this.setState({
                    alerts: {
                        success: {
                            success: 'Your changes have been saved successfully'
                        }
                    },
                    lastValues: this.state.values,
                    values: data.fields,
                    loading: false
                });
            }
        });
    },
    renderKeyOrId () {
        const className = 'EditForm__key-or-id';
        const list = this.props.list;
        if (list.nameField && list.autokey && this.props.data[list.autokey.path]) {
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: className
            }, /*#__PURE__*/ _react.default.createElement(_AltText.default, {
                modified: "ID:",
                normal: `${(0, _string.upcase)(list.autokey.path)}: `,
                title: "Press <alt> to reveal the ID",
                className: "EditForm__key-or-id__label"
            }), /*#__PURE__*/ _react.default.createElement(_AltText.default, {
                modified: /*#__PURE__*/ _react.default.createElement("input", {
                    ref: "keyOrIdInput",
                    onFocus: this.handleKeyFocus,
                    value: this.props.data.id,
                    className: "EditForm__key-or-id__input",
                    readOnly: true
                }),
                normal: /*#__PURE__*/ _react.default.createElement("input", {
                    ref: "keyOrIdInput",
                    onFocus: this.handleKeyFocus,
                    value: this.props.data[list.autokey.path],
                    className: "EditForm__key-or-id__input",
                    readOnly: true
                }),
                title: "Press <alt> to reveal the ID",
                className: "EditForm__key-or-id__field"
            }));
        } else if (list.autokey && this.props.data[list.autokey.path]) {
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: className
            }, /*#__PURE__*/ _react.default.createElement("span", {
                className: "EditForm__key-or-id__label"
            }, list.autokey.path, ": "), /*#__PURE__*/ _react.default.createElement("div", {
                className: "EditForm__key-or-id__field"
            }, /*#__PURE__*/ _react.default.createElement("input", {
                ref: "keyOrIdInput",
                onFocus: this.handleKeyFocus,
                value: this.props.data[list.autokey.path],
                className: "EditForm__key-or-id__input",
                readOnly: true
            })));
        } else if (list.nameField) {
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: className
            }, /*#__PURE__*/ _react.default.createElement("span", {
                className: "EditForm__key-or-id__label"
            }, "ID: "), /*#__PURE__*/ _react.default.createElement("div", {
                className: "EditForm__key-or-id__field"
            }, /*#__PURE__*/ _react.default.createElement("input", {
                ref: "keyOrIdInput",
                onFocus: this.handleKeyFocus,
                value: this.props.data.id,
                className: "EditForm__key-or-id__input",
                readOnly: true
            })));
        }
    },
    renderNameField () {
        const nameField = this.props.list.nameField;
        const nameFieldIsFormHeader = this.props.list.nameFieldIsFormHeader;
        const wrapNameField = (field)=>/*#__PURE__*/ _react.default.createElement("div", {
                className: "EditForm__name-field"
            }, field);
        if (nameFieldIsFormHeader) {
            const nameFieldProps = this.getFieldProps(nameField);
            nameFieldProps.label = null;
            nameFieldProps.size = 'full';
            nameFieldProps.autoFocus = true;
            nameFieldProps.inputProps = {
                className: 'item-name-field',
                placeholder: nameField.label,
                size: 'large'
            };
            return wrapNameField(/*#__PURE__*/ _react.default.createElement(_FieldTypes.Fields[nameField.type], nameFieldProps));
        } else {
            return wrapNameField(/*#__PURE__*/ _react.default.createElement("h2", null, this.props.data.name || '(no name)'));
        }
    },
    renderFormElements () {
        let headings = 0;
        return this.props.list.uiElements.map((el, index)=>{
            // Don't render the name field if it is the header since it'll be rendered in BIG above
            // the list. (see renderNameField method, this is the reverse check of the one it does)
            if (this.props.list.nameField && el.field === this.props.list.nameField.path && this.props.list.nameFieldIsFormHeader) return;
            if (el.type === 'heading') {
                headings++;
                el.options.values = this.state.values;
                el.key = 'h-' + headings;
                return /*#__PURE__*/ _react.default.createElement(_FormHeading.default, el);
            }
            if (el.type === 'field') {
                const field = this.props.list.fields[el.field];
                const props = this.getFieldProps(field);
                if (typeof _FieldTypes.Fields[field.type] !== 'function') {
                    return /*#__PURE__*/ _react.default.createElement(_InvalidFieldType.default, {
                        type: field.type,
                        path: field.path,
                        key: field.path
                    });
                }
                props.key = field.path;
                if (index === 0 && this.state.focusFirstField) {
                    props.autoFocus = true;
                }
                return /*#__PURE__*/ _react.default.createElement(_FieldTypes.Fields[field.type], props);
            }
        }, this);
    },
    renderFooterBar () {
        if (this.props.list.noedit && this.props.list.nodelete) {
            return null;
        }
        const { loading, hasLoaded } = this.state;
        const loadingButtonText = loading ? hasLoaded ? 'Saving' : 'Loading' : 'Save';
        // Padding must be applied inline so the FooterBar can determine its
        // innerHeight at runtime. Aphrodite's styling comes later...
        return /*#__PURE__*/ _react.default.createElement(_FooterBar.default, {
            style: styles.footerbar
        }, /*#__PURE__*/ _react.default.createElement("div", {
            style: styles.footerbarInner
        }, !this.props.list.noedit && /*#__PURE__*/ _react.default.createElement(_index.LoadingButton, {
            color: "primary",
            disabled: loading,
            loading: loading,
            onClick: this.updateItem,
            "data-button": "update"
        }, loadingButtonText), !this.props.list.noedit && /*#__PURE__*/ _react.default.createElement(_index.Button, {
            disabled: loading,
            onClick: this.toggleResetDialog,
            variant: "link",
            color: "cancel",
            "data-button": "reset"
        }, /*#__PURE__*/ _react.default.createElement(_index.ResponsiveText, {
            hiddenXS: "reset changes",
            visibleXS: "reset"
        })), !this.props.list.nodelete && /*#__PURE__*/ _react.default.createElement(_index.Button, {
            disabled: loading,
            onClick: this.toggleDeleteDialog,
            variant: "link",
            color: "delete",
            style: styles.deleteButton,
            "data-button": "delete"
        }, /*#__PURE__*/ _react.default.createElement(_index.ResponsiveText, {
            hiddenXS: `delete ${this.props.list.singular.toLowerCase()}`,
            visibleXS: "delete"
        }))));
    },
    renderTrackingMeta () {
        // TODO: These fields are visible now, so we don't want this. We may revisit
        // it when we have more granular control over hiding fields in certain
        // contexts, so I'm leaving this code here as a reference for now - JW
        if (true) return null; // if (true) prevents unreachable code linter errpr
        if (!this.props.list.tracking) return null;
        const elements = [];
        const data = {};
        if (this.props.list.tracking.createdAt) {
            data.createdAt = this.props.data.fields[this.props.list.tracking.createdAt];
            if (data.createdAt) {
                elements.push(/*#__PURE__*/ _react.default.createElement(_index.FormField, {
                    key: "createdAt",
                    label: "Created on"
                }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
                    noedit: true,
                    title: (0, _moment.default)(data.createdAt).format('DD/MM/YYYY h:mm:ssa')
                }, (0, _moment.default)(data.createdAt).format('Do MMM YYYY'))));
            }
        }
        if (this.props.list.tracking.createdBy) {
            data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
            if (data.createdBy && data.createdBy.name) {
                const createdByName = getNameFromData(data.createdBy.name);
                if (createdByName) {
                    elements.push(/*#__PURE__*/ _react.default.createElement(_index.FormField, {
                        key: "createdBy",
                        label: "Created by"
                    }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
                        noedit: true
                    }, data.createdBy.name.first, " ", data.createdBy.name.last)));
                }
            }
        }
        if (this.props.list.tracking.updatedAt) {
            data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
            if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
                elements.push(/*#__PURE__*/ _react.default.createElement(_index.FormField, {
                    key: "updatedAt",
                    label: "Updated on"
                }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
                    noedit: true,
                    title: (0, _moment.default)(data.updatedAt).format('DD/MM/YYYY h:mm:ssa')
                }, (0, _moment.default)(data.updatedAt).format('Do MMM YYYY'))));
            }
        }
        if (this.props.list.tracking.updatedBy) {
            data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
            if (data.updatedBy && data.updatedBy.name) {
                const updatedByName = getNameFromData(data.updatedBy.name);
                if (updatedByName) {
                    elements.push(/*#__PURE__*/ _react.default.createElement(_index.FormField, {
                        key: "updatedBy",
                        label: "Updated by"
                    }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
                        noedit: true
                    }, data.updatedBy.name.first, " ", data.updatedBy.name.last)));
                }
            }
        }
        return Object.keys(elements).length ? /*#__PURE__*/ _react.default.createElement("div", {
            className: "EditForm__meta"
        }, /*#__PURE__*/ _react.default.createElement("h3", {
            className: "form-heading"
        }, "Meta"), elements) : null;
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("form", {
            ref: "editForm",
            className: "EditForm-container"
        }, this.state.alerts ? /*#__PURE__*/ _react.default.createElement(_AlertMessages.default, {
            alerts: this.state.alerts
        }) : null, /*#__PURE__*/ _react.default.createElement(_index.Grid.Row, null, /*#__PURE__*/ _react.default.createElement(_index.Grid.Col, {
            large: "three-quarters"
        }, /*#__PURE__*/ _react.default.createElement(_index.Form, {
            layout: "horizontal",
            component: "div"
        }, this.renderNameField(), this.renderKeyOrId(), this.renderFormElements(), this.renderTrackingMeta())), /*#__PURE__*/ _react.default.createElement(_index.Grid.Col, {
            large: "one-quarter"
        }, /*#__PURE__*/ _react.default.createElement("span", null))), this.renderFooterBar(), /*#__PURE__*/ _react.default.createElement(_ConfirmationDialog.default, {
            confirmationLabel: "Reset",
            isOpen: this.state.resetDialogIsOpen,
            onCancel: this.toggleResetDialog,
            onConfirmation: this.handleReset
        }, /*#__PURE__*/ _react.default.createElement("p", null, "Reset your changes to ", /*#__PURE__*/ _react.default.createElement("strong", null, this.props.data.name), "?")), /*#__PURE__*/ _react.default.createElement(_ConfirmationDialog.default, {
            confirmationLabel: "Delete",
            isOpen: this.state.deleteDialogIsOpen,
            onCancel: this.toggleDeleteDialog,
            onConfirmation: this.handleDelete
        }, "Are you sure you want to delete ", /*#__PURE__*/ _react.default.createElement("strong", null, this.props.data.name, "?"), /*#__PURE__*/ _react.default.createElement("br", null), /*#__PURE__*/ _react.default.createElement("br", null), "This cannot be undone."));
    }
});
const styles = {
    footerbar: {
        backgroundColor: (0, _color.fade)(_theme.default.color.body, 93),
        boxShadow: '0 -2px 0 rgba(0, 0, 0, 0.1)',
        paddingBottom: 20,
        paddingTop: 20,
        zIndex: 99
    },
    footerbarInner: {
        height: _theme.default.component.height
    },
    deleteButton: {
        float: 'right'
    }
};
const _default = EditForm;

},{"../../../../theme.mjs":150,"../../../../utils/color.mjs":152,"../../../../utils/string.mjs":157,"../../../elemental/index.mjs":73,"../../../shared/AlertMessages.mjs":132,"../../../shared/ConfirmationDialog.mjs":133,"../../../shared/InvalidFieldType.mjs":137,"../actions.mjs":87,"../constants.mjs":101,"./AltText.mjs":88,"./FooterBar.mjs":94,"./FormHeading.mjs":95,"FieldTypes":undefined,"create-react-class":161,"moment":undefined,"prop-types":258,"react":undefined}],92:[function(require,module,exports){
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
    get EditFormHeader () {
        return EditFormHeader;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdom = require("react-dom");
const _reactredux = require("react-redux");
const _index = /*#__PURE__*/ _interop_require_default(require("./Toolbar/index.mjs"));
const _ToolbarSection = /*#__PURE__*/ _interop_require_default(require("./Toolbar/ToolbarSection.mjs"));
const _EditFormHeaderSearch = /*#__PURE__*/ _interop_require_default(require("./EditFormHeaderSearch.mjs"));
const _reactrouter = require("react-router");
const _Drilldown = /*#__PURE__*/ _interop_require_default(require("./Drilldown.mjs"));
const _index1 = require("../../../elemental/index.mjs");
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
const EditFormHeader = (0, _createreactclass.default)({
    displayName: 'EditFormHeader',
    propTypes: {
        data: _proptypes.default.object,
        list: _proptypes.default.object,
        toggleCreate: _proptypes.default.func
    },
    getInitialState () {
        return {
            searchString: ''
        };
    },
    toggleCreate (visible) {
        this.props.toggleCreate(visible);
    },
    searchStringChanged (event) {
        this.setState({
            searchString: event.target.value
        });
    },
    handleEscapeKey (event) {
        const escapeKeyCode = 27;
        if (event.which === escapeKeyCode) {
            (0, _reactdom.findDOMNode)(this.refs.searchField).blur();
        }
    },
    renderDrilldown () {
        return /*#__PURE__*/ _react.default.createElement(_ToolbarSection.default, {
            left: true
        }, this.renderDrilldownItems(), this.renderSearch());
    },
    renderDrilldownItems () {
        const { data, list } = this.props;
        const items = data.drilldown ? data.drilldown.items : [];
        let backPath = `${Keystone.adminLegacyPath}/${list.path}`;
        const backStyles = {
            paddingLeft: 0,
            paddingRight: 0
        };
        // Link to the list page the user came from
        if (this.props.listActivePage && this.props.listActivePage > 1) {
            backPath = `${backPath}?page=${this.props.listActivePage}`;
        }
        // return a single back button when no drilldown exists
        if (!items.length) {
            return /*#__PURE__*/ _react.default.createElement(_index1.GlyphButton, {
                component: _reactrouter.Link,
                "data-e2e-editform-header-back": true,
                glyph: "chevron-left",
                position: "left",
                style: backStyles,
                to: backPath,
                variant: "link"
            }, list.plural);
        }
        // prepare the drilldown elements
        const drilldown = [];
        items.forEach((item, idx)=>{
            // FIXME @jedwatson
            // we used to support relationships of type MANY where items were
            // represented as siblings inside a single list item; this got a
            // bit messy...
            item.items.forEach((link)=>{
                drilldown.push({
                    href: link.href,
                    label: link.label,
                    title: item.list.singular
                });
            });
        });
        // add the current list to the drilldown
        drilldown.push({
            href: backPath,
            label: list.plural
        });
        return /*#__PURE__*/ _react.default.createElement(_Drilldown.default, {
            items: drilldown
        });
    },
    renderSearch () {
        const list = this.props.list;
        return /*#__PURE__*/ _react.default.createElement("form", {
            action: `${Keystone.adminLegacyPath}/${list.path}`,
            className: "EditForm__header__search"
        }, /*#__PURE__*/ _react.default.createElement(_EditFormHeaderSearch.default, {
            value: this.state.searchString,
            onChange: this.searchStringChanged,
            onKeyUp: this.handleEscapeKey
        }));
    },
    renderInfo () {
        return /*#__PURE__*/ _react.default.createElement(_ToolbarSection.default, {
            right: true
        }, this.renderCreateButton());
    },
    renderCreateButton () {
        const { nocreate, autocreate, singular } = this.props.list;
        if (nocreate) return null;
        const props = {};
        if (autocreate) {
            props.href = '?new' + Keystone.csrf.query;
        } else {
            props.onClick = ()=>{
                this.toggleCreate(true);
            };
        }
        return /*#__PURE__*/ _react.default.createElement(_index1.GlyphButton, _object_spread({
            "data-e2e-item-create-button": "true",
            color: "success",
            glyph: "plus",
            position: "left"
        }, props), /*#__PURE__*/ _react.default.createElement(_index1.ResponsiveText, {
            hiddenXS: `New ${singular}`,
            visibleXS: "Create"
        }));
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_index.default, null, this.renderDrilldown(), this.renderInfo());
    }
});
const _default = (0, _reactredux.connect)((state)=>({
        listActivePage: state.lists.page.index
    }))(EditFormHeader);

},{"../../../elemental/index.mjs":73,"./Drilldown.mjs":89,"./EditFormHeaderSearch.mjs":93,"./Toolbar/ToolbarSection.mjs":99,"./Toolbar/index.mjs":100,"create-react-class":161,"prop-types":258,"react":undefined,"react-dom":undefined,"react-redux":undefined,"react-router":undefined}],93:[function(require,module,exports){
/* eslint quote-props: ["error", "as-needed"] */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" // Search
 // ------------------------------
 // .EditForm__header__search {
 // 	display: inline-block;
 // 	margin-left: 1em;
 // }
 // .EditForm__header__search-field {
 // 	margin-bottom: 0;
 //
 // 	.IconField__icon {
 // 		color: @app-primary;
 // 	}
 // }
 //
 // // make the input appear as a button link until focused
 // .EditForm__header__search-input {
 // 	// override elemental's transition to catch the width or it looks weird
 // 	.transition( all 0.15s ease-in-out );
 // 	.placeholder(@link-color);
 // 	background: transparent;
 // 	border-color: transparent;
 // 	box-shadow: none;
 // 	display: inline-block;
 //
 // 	// set the width to only be as long as if it were a button initially
 // 	// this is updated on focus to a more comfortable typing length
 // 	width: 100px;
 //
 // 	// decorate the input as a link
 // 	&:hover {
 // 		.placeholder(@link-hover-color);
 // 		border-color: transparent;
 // 		cursor: pointer;
 //
 // 		// handle placeholder text
 // 		&::-moz-placeholder { text-decoration: underline; }
 // 		&:-ms-input-placeholder { text-decoration: underline; }
 // 		&::-webkit-input-placeholder  { text-decoration: underline; }
 //
 // 		+ .IconField__icon {
 // 			color: @link-hover-color;
 // 		}
 // 	}
 //
 // 	// return the input to it's natural appearance on focus
 // 	&:focus {
 // 		.placeholder(@input-placeholder-color);
 // 		background: white;
 // 		border-color: @input-border-color-focus;
 // 		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px fade(@input-border-color-focus, 10%);
 // 		cursor: auto;
 // 		outline: 0;
 // 		width: 240px;
 //
 // 		// handle placeholder text
 // 		&::-moz-placeholder { text-decoration: none; }
 // 		&:-ms-input-placeholder { text-decoration: none; }
 // 		&::-webkit-input-placeholder  { text-decoration: none; }
 //
 // 		+ .IconField__icon {
 // 			color: @input-placeholder-color;
 // 		}
 // 	}
 // }
 // // hide the search field on small devices
 // @media (max-width: 480px) {
 // 	.EditForm__header__search {
 // 		display: none;
 // 	}
 // }
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdom = require("react-dom");
const _glamor = require("glamor");
const _index = require("../../../elemental/index.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
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
 * Search input for the item edit-form header that expands from a button into a text field on focus
 */ class EditFormHeaderSearch extends _react.Component {
    /**
	 * Sets focused state and moves DOM focus to the underlying input element
	 */ focusField() {
        this.setState({
            focused: true
        }, ()=>{
            (0, _reactdom.findDOMNode)(this.refs.target).focus();
        });
    }
    /**
	 * Renders either a search button or an expanded search input depending on focus state
	 * @returns {React.Element} A search button or an inline search input wrapper
	 */ render() {
        const { focused } = this.state;
        const _this_props = this.props, { onChange, onKeyUp, value } = _this_props, props = _object_without_properties(_this_props, [
            "onChange",
            "onKeyUp",
            "value"
        ]);
        return focused ? /*#__PURE__*/ _react.default.createElement("div", {
            className: (0, _glamor.css)(classes.wrapper)
        }, /*#__PURE__*/ _react.default.createElement(_index.Glyph, {
            cssStyles: classes.glyph,
            color: _theme.default.color.gray40,
            name: "search",
            "data-e2e-search-icon": true
        }), /*#__PURE__*/ _react.default.createElement(_index.FormInput, _object_spread({
            cssStyles: classes.input,
            name: "search",
            onBlur: ()=>this.setState({
                    focused: false
                }),
            onChange: onChange,
            onKeyUp: onKeyUp,
            placeholder: "Search",
            ref: "target",
            type: "search",
            value: value
        }, props))) : /*#__PURE__*/ _react.default.createElement(_index.GlyphButton, {
            color: "primary",
            glyph: "search",
            glyphStyle: {
                marginRight: '0.4em'
            },
            onClick: this.focusField,
            onFocus: this.focusField,
            position: "left",
            variant: "link",
            style: {
                paddingLeft: '0.7em'
            },
            "data-e2e-search-icon": true
        }, "Search");
    }
    /**
	 * Binds focusField handler and initialises focused state
	 */ constructor(){
        super();
        this.focusField = this.focusField.bind(this);
        this.state = {
            focused: false
        };
    }
}
// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
EditFormHeaderSearch.propTypes = {
    onChange: _proptypes.default.func.isRequired,
    value: _proptypes.default.string
};
const classes = {
    wrapper: {
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'middle'
    },
    // input
    input: {
        paddingLeft: '2.2em',
        // opacity: 0,
        transition: 'all 240ms',
        width: 100,
        ':focus': {
            // opacity: 1,
            width: 240
        }
    },
    // glyph
    glyph: {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '2.2em'
    }
};
const _default = EditFormHeaderSearch;

},{"../../../../theme.mjs":150,"../../../elemental/index.mjs":73,"glamor":undefined,"prop-types":258,"react":undefined,"react-dom":undefined}],94:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const FooterBar = (0, _createreactclass.default)({
    propTypes: {
        style: _proptypes.default.object
    },
    getDefaultProps () {
        return {
            style: {}
        };
    },
    getInitialState () {
        return {
            position: 'relative',
            width: 'auto',
            height: 'auto',
            top: 0
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
            y: footer.offsetHeight + parseInt(footerStyle.marginTop || '0')
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
            y: window.innerHeight
        };
    },
    recalcPosition () {
        const wrapper = this.refs.wrapper;
        this.footerSize.x = wrapper.offsetWidth;
        let offsetTop = 0;
        let offsetEl = wrapper;
        while(offsetEl){
            offsetTop += offsetEl.offsetTop;
            offsetEl = offsetEl.offsetParent;
        }
        const maxY = offsetTop + this.footerSize.y;
        const viewY = window.scrollY + window.innerHeight;
        const newSize = this.getWindowSize();
        const sizeChanged = newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y;
        this.windowSize = newSize;
        const newState = {
            width: this.footerSize.x,
            height: this.footerSize.y
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
            position: 'relative'
        };
        const _this_props = this.props, { children: _ch, style: _st } = _this_props, footerProps = _object_without_properties(_this_props, [
            "children",
            "style"
        ]);
        const footerStyle = Object.assign({}, this.props.style, {
            position: this.state.position,
            top: this.state.top,
            width: this.state.width,
            height: this.state.height
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            ref: "wrapper",
            style: wrapperStyle
        }, /*#__PURE__*/ _react.default.createElement("div", _object_spread({
            ref: "footer",
            style: footerStyle
        }, footerProps), this.props.children));
    },
    displayName: "FooterBar"
});
const _default = FooterBar;

},{"create-react-class":161,"prop-types":258,"react":undefined}],95:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _evalDependsOn = /*#__PURE__*/ _interop_require_default(require("../../../../../../fields/utils/evalDependsOn.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = (0, _createreactclass.default)({
    displayName: 'FormHeading',
    propTypes: {
        options: _proptypes.default.object
    },
    render () {
        if (!(0, _evalDependsOn.default)(this.props.options.dependsOn, this.props.options.values)) {
            return null;
        }
        return /*#__PURE__*/ _react.default.createElement("h3", {
            className: "form-heading"
        }, this.props.content);
    }
});

},{"../../../../../../fields/utils/evalDependsOn.mjs":158,"create-react-class":161,"prop-types":258,"react":undefined}],96:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactrouter = require("react-router");
const _index = require("../../../../elemental/index.mjs");
const _RelatedItemsListDragDrop = /*#__PURE__*/ _interop_require_default(require("./RelatedItemsListDragDrop.mjs"));
const _RelatedItemsListRow = /*#__PURE__*/ _interop_require_default(require("./RelatedItemsListRow.mjs"));
const _actions = require("../../actions.mjs");
const _constants = require("../../../../../constants.mjs");
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
const RelatedItemsList = (0, _createreactclass.default)({
    propTypes: {
        dispatch: _proptypes.default.func.isRequired,
        dragNewSortOrder: _proptypes.default.number,
        items: _proptypes.default.array,
        list: _proptypes.default.object.isRequired,
        refList: _proptypes.default.object.isRequired,
        relatedItemId: _proptypes.default.string.isRequired,
        relationship: _proptypes.default.object.isRequired
    },
    getInitialState () {
        return {
            columns: this.getColumns(),
            err: null,
            items: null
        };
    },
    componentDidMount () {
        this.__isMounted = true;
        this.loadItems();
    },
    componentWillUnmount () {
        this.__isMounted = false;
    },
    isSortable () {
        // Check if the related items should be sortable. The referenced list has to
        //   be sortable and it has to set the current list as it's sortContext.
        const { refList, list, relationship } = this.props;
        const sortContext = refList.sortContext;
        if (refList.sortable && sortContext) {
            const parts = sortContext.split(':');
            if (parts[0] === list.key && parts[1] === relationship.path) {
                return true;
            }
        }
        return false;
    },
    getColumns () {
        const { relationship, refList } = this.props;
        const columns = refList.expandColumns(refList.defaultColumns);
        return columns.filter((i)=>i.path !== relationship.refPath);
    },
    loadItems () {
        const { refList, relatedItemId, relationship } = this.props;
        const { columns } = this.state;
        // TODO: Move error to redux store
        if (!refList.fields[relationship.refPath]) {
            const err = /*#__PURE__*/ _react.default.createElement(_index.Alert, {
                color: "danger"
            }, /*#__PURE__*/ _react.default.createElement("strong", null, "Error:"), " Related List ", /*#__PURE__*/ _react.default.createElement("strong", null, refList.label), " has no field ", /*#__PURE__*/ _react.default.createElement("strong", null, relationship.refPath));
            return this.setState({
                err
            });
        }
        this.props.dispatch((0, _actions.loadRelationshipItemData)({
            columns,
            refList,
            relatedItemId,
            relationship
        }));
    },
    renderItems () {
        const tableBody = this.isSortable() ? /*#__PURE__*/ _react.default.createElement(_RelatedItemsListDragDrop.default, _object_spread({
            columns: this.state.columns,
            items: this.props.items
        }, this.props)) : /*#__PURE__*/ _react.default.createElement("tbody", null, this.props.items.results.map((item)=>{
            return /*#__PURE__*/ _react.default.createElement(_RelatedItemsListRow.default, {
                key: item.id,
                columns: this.state.columns,
                item: item,
                refList: this.props.refList
            });
        }));
        return this.props.items.results.length ? /*#__PURE__*/ _react.default.createElement("div", {
            className: "ItemList-wrapper"
        }, /*#__PURE__*/ _react.default.createElement("table", {
            cellPadding: "0",
            cellSpacing: "0",
            className: "Table ItemList"
        }, this.renderTableCols(), this.renderTableHeaders(), tableBody)) : /*#__PURE__*/ _react.default.createElement(_index.BlankState, {
            heading: `No related ${this.props.refList.plural.toLowerCase()}...`,
            style: {
                marginBottom: '3em'
            }
        });
    },
    renderTableCols () {
        const cols = this.state.columns.map((col)=>/*#__PURE__*/ _react.default.createElement("col", {
                width: col.width,
                key: col.path
            }));
        return /*#__PURE__*/ _react.default.createElement("colgroup", null, cols);
    },
    renderTableHeaders () {
        const cells = this.state.columns.map((col)=>{
            return /*#__PURE__*/ _react.default.createElement("th", {
                key: col.path
            }, col.label);
        });
        // add sort col when available
        if (this.isSortable()) {
            cells.unshift(/*#__PURE__*/ _react.default.createElement("th", {
                width: _constants.TABLE_CONTROL_COLUMN_WIDTH,
                key: "sortable"
            }));
        }
        return /*#__PURE__*/ _react.default.createElement("thead", null, /*#__PURE__*/ _react.default.createElement("tr", null, cells));
    },
    render () {
        if (this.state.err) {
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: "Relationship"
            }, this.state.err);
        }
        const listHref = `${Keystone.adminLegacyPath}/${this.props.refList.path}`;
        const loadingElement = /*#__PURE__*/ _react.default.createElement(_index.Center, {
            height: 100
        }, /*#__PURE__*/ _react.default.createElement(_index.Spinner, null));
        const heading = this.props.relationship.label || this.props.refList.label;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "Relationship"
        }, /*#__PURE__*/ _react.default.createElement("h3", {
            className: "Relationship__link"
        }, /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
            to: listHref
        }, heading)), this.props.items ? this.renderItems() : loadingElement);
    },
    displayName: "RelatedItemsList"
});
const _default = RelatedItemsList;

},{"../../../../../constants.mjs":149,"../../../../elemental/index.mjs":73,"../../actions.mjs":87,"./RelatedItemsListDragDrop.mjs":97,"./RelatedItemsListRow.mjs":98,"create-react-class":161,"prop-types":258,"react":undefined,"react-router":undefined}],97:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdnd = require("react-dnd");
const _reactdndhtml5backend = /*#__PURE__*/ _interop_require_default(require("react-dnd-html5-backend"));
const _RelatedItemsListRow = require("./RelatedItemsListRow.mjs");
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
class RelatedItemsListDragDrop extends _react.Component {
    render() {
        const { items } = this.props;
        return /*#__PURE__*/ _react.default.createElement("tbody", null, items.results.map((item, i)=>{
            return /*#__PURE__*/ _react.default.createElement(_RelatedItemsListRow.Sortable, _object_spread({
                key: item.id,
                index: i,
                item: item
            }, this.props));
        }));
    }
}
RelatedItemsListDragDrop.propTypes = {
    columns: _proptypes.default.array.isRequired,
    dispatch: _proptypes.default.func.isRequired,
    dragNewSortOrder: _proptypes.default.number,
    items: _proptypes.default.array.isRequired,
    list: _proptypes.default.object.isRequired,
    refList: _proptypes.default.object.isRequired,
    relatedItemId: _proptypes.default.string.isRequired,
    relationship: _proptypes.default.object.isRequired
};
const _default = (0, _reactdnd.DragDropContext)(_reactdndhtml5backend.default)(RelatedItemsListDragDrop);

},{"./RelatedItemsListRow.mjs":98,"prop-types":258,"react":undefined,"react-dnd":undefined,"react-dnd-html5-backend":undefined}],98:[function(require,module,exports){
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
    get Sortable () {
        return Sortable;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdnd = require("react-dnd");
const _FieldTypes = require("FieldTypes");
const _actions = require("../../actions.mjs");
const _ListControl = /*#__PURE__*/ _interop_require_default(require("../../../List/components/ListControl.mjs"));
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
/**
 * Renders a single row inside a related-items list table, with optional drag-and-drop support
 */ class RelatedItemsListRow extends _react.Component {
    /**
	 * Renders table cells for each column, prepending a sort handle when drag-and-drop is enabled
	 * @returns {React.Element} A table row element, optionally wrapped by a drop target
	 */ render() {
        const { columns, item, connectDragSource, connectDropTarget, refList } = this.props;
        const cells = columns.map((col, i)=>{
            const ColumnType = _FieldTypes.Columns[col.type] || _FieldTypes.Columns.__unrecognised__;
            const linkTo = !i ? `${Keystone.adminLegacyPath}/${refList.path}/${item.id}` : undefined;
            return /*#__PURE__*/ _react.default.createElement(ColumnType, {
                key: col.path,
                list: refList,
                col: col,
                data: item,
                linkTo: linkTo
            });
        });
        // add sortable icon when applicable
        if (connectDragSource) {
            cells.unshift(/*#__PURE__*/ _react.default.createElement(_ListControl.default, {
                key: "_sort",
                type: "sortable",
                dragSource: connectDragSource
            }));
        }
        const row = /*#__PURE__*/ _react.default.createElement("tr", {
            key: 'i' + item.id
        }, cells);
        if (connectDropTarget) {
            return connectDropTarget(row);
        } else {
            return row;
        }
    }
}
RelatedItemsListRow.propTypes = {
    columns: _proptypes.default.array.isRequired,
    dispatch: _proptypes.default.func.isRequired,
    dragNewSortOrder: _proptypes.default.number,
    index: _proptypes.default.number,
    item: _proptypes.default.object.isRequired,
    refList: _proptypes.default.object.isRequired,
    relatedItemId: _proptypes.default.string.isRequired,
    relationship: _proptypes.default.object.isRequired,
    // Injected by React DnD:
    isDragging: _proptypes.default.bool,
    connectDragSource: _proptypes.default.func,
    connectDropTarget: _proptypes.default.func,
    connectDragPreview: _proptypes.default.func
};
const _default = RelatedItemsListRow;
// Expose Sortable
/**
 * Implements drag source.
 */ const dragItem = {
    beginDrag (props) {
        const send = _object_spread({}, props);
        // props.dispatch(setDragBase(props.item, props.index));
        return _object_spread({}, send);
    },
    endDrag (props, monitor, component) {
        // Dropped outside of the drop target, reset rows
        if (!monitor.didDrop()) {
            props.dispatch((0, _actions.resetItems)());
            return;
        }
        const draggedItem = props.item;
        const prevSortOrder = draggedItem.sortOrder;
        const newSortOrder = props.dragNewSortOrder;
        // Dropping on self
        if (prevSortOrder === newSortOrder) {
            props.dispatch((0, _actions.resetItems)());
            return;
        }
        // dropped on a target
        const { columns, refList, relationship, relatedItemId, item } = props;
        props.dispatch((0, _actions.reorderItems)({
            columns,
            refList,
            relationship,
            relatedItemId,
            item,
            prevSortOrder,
            newSortOrder
        }));
    }
};
/**
 * Implements drag target.
 */ const dropItem = {
    drop (props, monitor, component) {
        return _object_spread({}, props);
    },
    hover (props, monitor, component) {
        // reset row alerts
        // if (props.rowAlert.success || props.rowAlert.fail) {
        // 	props.dispatch(setRowAlert({
        // 		reset: true,
        // 	}));
        // }
        const dragged = monitor.getItem().index;
        const over = props.index;
        // self
        if (dragged === over) {
            return;
        }
        // Since the items are moved on hover, we need to store the new sort order from the dragged over item so we can use it to reorder when the item is dropped.
        props.dispatch((0, _actions.moveItem)({
            prevIndex: dragged,
            newIndex: over,
            relationshipPath: props.relationship.path,
            newSortOrder: props.item.sortOrder
        }));
        monitor.getItem().index = over;
    }
};
/**
 * Maps React DnD drag-source connector and monitor state to component props
 * @param {object} connect The React DnD drag-source connector
 * @param {object} monitor The React DnD drag monitor
 * @returns {object} Props to inject: connectDragSource, isDragging, connectDragPreview
 */ function dragProps(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    };
}
/**
 * Maps React DnD drop-target connector to component props
 * @param {object} connect The React DnD drop-target connector
 * @returns {object} Props to inject: connectDropTarget
 */ function dropProps(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}
const Sortable = (0, _reactdnd.DragSource)('item', dragItem, dragProps)((0, _reactdnd.DropTarget)('item', dropItem, dropProps)(RelatedItemsListRow));

},{"../../../List/components/ListControl.mjs":119,"../../actions.mjs":87,"FieldTypes":undefined,"prop-types":258,"react":undefined,"react-dnd":undefined}],99:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
 * Renders a toolbar section div with optional left or right alignment modifier classes
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name
 * @param {boolean} [props.left] When true, applies the left-alignment modifier class
 * @param {boolean} [props.right] When true, applies the right-alignment modifier class
 * @returns {React.Element} A div element with appropriate Toolbar__section class names
 */ function ToolbarSection(_0) {
    let { className, left, right } = _0, props = _object_without_properties(_0, [
        "className",
        "left",
        "right"
    ]);
    props.className = (0, _classnames.default)('Toolbar__section', {
        'Toolbar__section--left': left,
        'Toolbar__section--right': right
    }, className);
    return /*#__PURE__*/ _react.default.createElement("div", props);
}
ToolbarSection.propTypes = {
    left: _proptypes.default.bool,
    right: _proptypes.default.bool
};
const _default = ToolbarSection;

},{"classnames":undefined,"prop-types":258,"react":undefined}],100:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const Toolbar = (props)=>/*#__PURE__*/ _react.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "Toolbar"
    }));
Toolbar.displayName = 'Toolbar';
Toolbar.propTypes = {
    children: _proptypes.default.node.isRequired
};
const _default = Toolbar;

},{"prop-types":258,"react":undefined}],101:[function(require,module,exports){
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
    get ASYNC_FIELD_LOADED () {
        return ASYNC_FIELD_LOADED;
    },
    get ASYNC_FIELD_LOADING () {
        return ASYNC_FIELD_LOADING;
    },
    get DATA_LOADING_ERROR () {
        return DATA_LOADING_ERROR;
    },
    get DATA_LOADING_SUCCESS () {
        return DATA_LOADING_SUCCESS;
    },
    get DRAG_MOVE_ITEM () {
        return DRAG_MOVE_ITEM;
    },
    get DRAG_RESET_ITEMS () {
        return DRAG_RESET_ITEMS;
    },
    get LOAD_DATA () {
        return LOAD_DATA;
    },
    get LOAD_RELATIONSHIP_DATA () {
        return LOAD_RELATIONSHIP_DATA;
    },
    get SELECT_ITEM () {
        return SELECT_ITEM;
    }
});
const SELECT_ITEM = 'app/Item/SELECT_ITEM';
const LOAD_DATA = 'app/Item/LOAD_DATA';
const DATA_LOADING_SUCCESS = 'app/Item/DATA_LOADING_SUCCESS';
const DATA_LOADING_ERROR = 'app/Item/DATA_LOADING_ERROR';
const DRAG_MOVE_ITEM = 'app/Item/DRAG_MOVE_ITEM';
const DRAG_RESET_ITEMS = 'app/Item/DRAG_RESET_ITEMS';
const LOAD_RELATIONSHIP_DATA = 'app/Item/LOAD_RELATIONSHIP_DATA';
const ASYNC_FIELD_LOADING = 'loading';
const ASYNC_FIELD_LOADED = 'loaded';

},{}],102:[function(require,module,exports){
/**
 * Item View
 *
 * This is the item view, it is rendered when users visit a page of a specific
 * item. This mainly renders the form to edit the item content in.
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../elemental/index.mjs");
const _reactredux = require("react-redux");
const _reactrouter = require("react-router");
const _lists = require("../../../utils/lists.mjs");
const _CreateForm = /*#__PURE__*/ _interop_require_default(require("../../shared/CreateForm.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../../elemental/Alert/index.mjs"));
const _EditForm = /*#__PURE__*/ _interop_require_default(require("./components/EditForm.mjs"));
const _EditFormHeader = /*#__PURE__*/ _interop_require_default(require("./components/EditFormHeader.mjs"));
const _RelatedItemsList = /*#__PURE__*/ _interop_require_default(require("./components/RelatedItemsList/RelatedItemsList.mjs"));
const _actions = require("./actions.mjs");
const _index2 = require("../List/actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ItemView = (0, _createreactclass.default)({
    displayName: 'ItemView',
    contextTypes: {
        router: _proptypes.default.object.isRequired
    },
    getInitialState () {
        return {
            createIsOpen: false
        };
    },
    componentDidMount () {
        // When we directly navigate to an item without coming from another client
        // side routed page before, we need to select the list before initializing the item
        // We also need to update when the list id has changed
        if (!this.props.currentList || this.props.currentList.id !== this.props.params.listId) {
            this.props.dispatch((0, _index2.selectList)(this.props.params.listId));
        }
        this.initializeItem(this.props.params.itemId);
    },
    UNSAFE_componentWillReceiveProps (nextProps) {
        // We've opened a new item from the client side routing, so initialize
        // again with the new item id
        if (nextProps.params.itemId !== this.props.params.itemId) {
            this.props.dispatch((0, _index2.selectList)(nextProps.params.listId));
            this.initializeItem(nextProps.params.itemId);
        }
    },
    // Initialize an item
    initializeItem (itemId) {
        this.props.dispatch((0, _actions.selectItem)(itemId));
        this.props.dispatch((0, _actions.loadItemData)());
    },
    // Called when a new item is created
    onCreate (item) {
        // Hide the create form
        this.toggleCreateModal(false);
        // Redirect to newly created item path
        const list = this.props.currentList;
        this.context.router.push(`${Keystone.adminLegacyPath}/${list.path}/${item.id}`);
    },
    // Open and close the create new item modal
    toggleCreateModal (visible) {
        this.setState({
            createIsOpen: visible
        });
    },
    // Render this items relationships
    renderRelationships () {
        const { relationships } = this.props.currentList;
        const keys = Object.keys(relationships);
        if (!keys.length) return;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "Relationships"
        }, /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement("h2", null, "Relationships"), keys.map((key)=>{
            const relationship = relationships[key];
            const refList = _lists.listsByKey[relationship.ref];
            const { currentList, params, relationshipData, drag } = this.props;
            return /*#__PURE__*/ _react.default.createElement(_RelatedItemsList.default, {
                key: relationship.path,
                list: currentList,
                refList: refList,
                relatedItemId: params.itemId,
                relationship: relationship,
                items: relationshipData[relationship.path],
                dragNewSortOrder: drag.newSortOrder,
                dispatch: this.props.dispatch
            });
        })));
    },
    // Handle errors
    handleError (error) {
        const detail = error.detail;
        if (detail) {
            // Item not found
            if (detail.name === 'CastError' && detail.path === '_id') {
                return /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement(_index1.default, {
                    color: "danger",
                    style: {
                        marginTop: '2em'
                    }
                }, 'No item matching id "', this.props.routeParams.itemId, '". ', /*#__PURE__*/ _react.default.createElement(_reactrouter.Link, {
                    to: `${Keystone.adminLegacyPath}/${this.props.routeParams.listId}`
                }, "Go back to ", this.props.routeParams.listId, "?")));
            }
        }
        if (error.message) {
            // Server down + possibly other errors
            if (error.message === 'Internal XMLHttpRequest Error') {
                return /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement(_index1.default, {
                    color: "danger",
                    style: {
                        marginTop: '2em'
                    }
                }, "We encountered some network problems, please refresh."));
            }
        }
        return /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement(_index1.default, {
            color: "danger",
            style: {
                marginTop: '2em'
            }
        }, "An unknown error has ocurred, please refresh."));
    },
    render () {
        // If we don't have any data yet, show the loading indicator
        if (!this.props.ready) {
            return /*#__PURE__*/ _react.default.createElement(_index.Center, {
                height: "50vh",
                "data-screen-id": "item"
            }, /*#__PURE__*/ _react.default.createElement(_index.Spinner, null));
        }
        // When we have the data, render the item view with it
        return /*#__PURE__*/ _react.default.createElement("div", {
            "data-screen-id": "item"
        }, this.props.error ? this.handleError(this.props.error) : /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement(_EditFormHeader.default, {
            list: this.props.currentList,
            data: this.props.data,
            toggleCreate: this.toggleCreateModal
        }), /*#__PURE__*/ _react.default.createElement(_CreateForm.default, {
            list: this.props.currentList,
            isOpen: this.state.createIsOpen,
            onCancel: ()=>this.toggleCreateModal(false),
            onCreate: (item)=>this.onCreate(item)
        }), /*#__PURE__*/ _react.default.createElement(_EditForm.default, {
            list: this.props.currentList,
            data: this.props.data,
            dispatch: this.props.dispatch,
            router: this.context.router
        })), this.renderRelationships()));
    }
});
const _default = (0, _reactredux.connect)((state)=>({
        data: state.item.data,
        loading: state.item.loading,
        ready: state.item.ready,
        error: state.item.error,
        currentList: state.lists.currentList,
        relationshipData: state.item.relationshipData,
        drag: state.item.drag
    }))(ItemView);

},{"../../../utils/lists.mjs":155,"../../elemental/Alert/index.mjs":11,"../../elemental/index.mjs":73,"../../shared/CreateForm.mjs":134,"../List/actions/index.mjs":106,"./actions.mjs":87,"./components/EditForm.mjs":91,"./components/EditFormHeader.mjs":92,"./components/RelatedItemsList/RelatedItemsList.mjs":96,"create-react-class":161,"prop-types":258,"react":undefined,"react-redux":undefined,"react-router":undefined}],103:[function(require,module,exports){
/**
 * Item reducer, handles the item data and loading
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
const _constants = require("./constants.mjs");
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
const initialState = {
    data: null,
    id: null,
    loading: false,
    ready: false,
    error: null,
    relationshipData: {},
    drag: {
        clonedItems: false,
        newSortOrder: null,
        relationshipPath: false
    }
};
/**
 * Handles item state including data loading, drag-and-drop reordering, and relationship data
 * @param {object} state Current item state
 * @param {object} action Dispatched Redux action
 * @returns {object} Next item state
 */ function item(state = initialState, action) {
    switch(action.type){
        case _constants.SELECT_ITEM:
            return Object.assign({}, state, {
                ready: false,
                id: action.id,
                data: null
            });
        case _constants.LOAD_DATA:
            return Object.assign({}, state, {
                loading: true
            });
        case _constants.DATA_LOADING_SUCCESS:
            Keystone.item = action.data; // Fix keystone filter
            return Object.assign({}, state, {
                data: action.data,
                loading: false,
                ready: true,
                error: null
            });
        case _constants.DATA_LOADING_ERROR:
            return Object.assign({}, state, {
                data: null,
                loading: false,
                ready: true,
                error: action.error
            });
        case _constants.DRAG_MOVE_ITEM:
            const currentItems = state.relationshipData[action.relationshipPath].results;
            // Cache a copy of the current items to reset the items when dismissing a drag and drop if a cached copy doesn't already exist
            const clonedItems = state.drag.clonedItems || currentItems;
            const item1 = currentItems[action.prevIndex];
            // Remove item at prevIndex from array and save that array in
            // itemsWithoutItem
            const itemsWithoutItem = currentItems.slice(0, action.prevIndex).concat(currentItems.slice(action.prevIndex + 1, currentItems.length));
            // Add item back in at new index
            itemsWithoutItem.splice(action.newIndex, 0, item1);
            const newRelationshipData = Object.assign({}, state.relationshipData[action.relationshipPath], {
                results: itemsWithoutItem
            });
            return Object.assign({}, state, {
                drag: {
                    newSortOrder: action.newSortOrder,
                    clonedItems: clonedItems,
                    relationshipPath: action.relationshipPath
                },
                relationshipData: _object_spread_props(_object_spread({}, state.relationshipData), {
                    [action.relationshipPath]: newRelationshipData
                })
            });
        case _constants.DRAG_RESET_ITEMS:
            const originalRelationshipData = Object.assign({}, state.relationshipData[state.drag.relationshipPath], {
                results: state.drag.clonedItems
            });
            return Object.assign({}, state, {
                drag: {
                    newSortOrder: null,
                    clonedItems: false,
                    relationshipPath: false
                },
                relationshipData: _object_spread_props(_object_spread({}, state.relationshipData), {
                    [state.drag.relationshipPath]: originalRelationshipData
                })
            });
        case _constants.LOAD_RELATIONSHIP_DATA:
            return Object.assign({}, state, {
                // Reset drag and drop when relationship data is loaded
                drag: {
                    newSortOrder: null,
                    clonedItems: false,
                    relationshipPath: false
                },
                relationshipData: _object_spread_props(_object_spread({}, state.relationshipData), {
                    [action.relationshipPath]: action.data
                })
            });
        default:
            return state;
    }
}
const _default = item;

},{"./constants.mjs":101}],104:[function(require,module,exports){
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
    get clearAllFilters () {
        return clearAllFilters;
    },
    get clearCachedQuery () {
        return clearCachedQuery;
    },
    get clearFilter () {
        return clearFilter;
    },
    get setActiveColumns () {
        return setActiveColumns;
    },
    get setActiveList () {
        return setActiveList;
    },
    get setActiveSearch () {
        return setActiveSearch;
    },
    get setActiveSort () {
        return setActiveSort;
    },
    get setFilter () {
        return setFilter;
    }
});
const _constants = require("../constants.mjs");
function setActiveSearch(searchString) {
    return {
        type: _constants.SET_ACTIVE_SEARCH,
        searchString
    };
}
function setActiveSort(path) {
    return {
        type: _constants.SELECT_ACTIVE_SORT,
        path
    };
}
function setActiveColumns(columns) {
    return {
        type: _constants.SELECT_ACTIVE_COLUMNS,
        columns
    };
}
function setActiveList(list, id) {
    return {
        type: _constants.SET_ACTIVE_LIST,
        list,
        id
    };
}
function clearFilter(path) {
    return {
        type: _constants.CLEAR_FILTER,
        path
    };
}
function clearAllFilters() {
    return {
        type: _constants.CLEAR_ALL_FILTERS
    };
}
function setFilter(path, value) {
    return {
        type: _constants.SELECT_FILTER,
        filter: {
            path,
            value
        }
    };
}
function clearCachedQuery() {
    return {
        type: _constants.CLEAR_CACHED_QUERY
    };
}

},{"../constants.mjs":128}],105:[function(require,module,exports){
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
    get moveItem () {
        return moveItem;
    },
    get reorderItems () {
        return reorderItems;
    },
    get resetDragItems () {
        return resetDragItems;
    },
    get resetDragPage () {
        return resetDragPage;
    },
    get resetItems () {
        return resetItems;
    },
    get setDragBase () {
        return setDragBase;
    },
    get setDragIndex () {
        return setDragIndex;
    },
    get setDragItem () {
        return setDragItem;
    },
    get setRowAlert () {
        return setRowAlert;
    }
});
const _constants = require("../constants.mjs");
const _index = require("../actions/index.mjs");
function setDragBase(item, index) {
    return (dispatch)=>{
        dispatch(resetDragPage());
        dispatch(resetDragItems());
        if (item) {
            dispatch(setDragItem(item));
            if (index) {
                dispatch(setDragIndex(index));
            }
        }
    };
}
function resetDragPage() {
    return {
        type: _constants.RESET_DRAG_PAGE
    };
}
function resetDragItems() {
    return {
        type: _constants.RESET_DRAG_ITEMS
    };
}
function setDragItem(item) {
    return {
        type: _constants.SET_DRAG_ITEM,
        item
    };
}
function setDragIndex(index) {
    return {
        type: _constants.SET_DRAG_INDEX,
        index
    };
}
function setRowAlert(data) {
    return {
        type: _constants.SET_ROW_ALERT,
        data
    };
}
function moveItem(prevIndex, newIndex, options) {
    return {
        type: _constants.DRAG_MOVE_ITEM,
        prevIndex,
        newIndex,
        options
    };
}
function reorderItems(item, prevSortOrder, newSortOrder, goToPage) {
    // // reset drag
    // defaultDrag();
    return (dispatch, getState)=>{
        if (goToPage) {
            // TODO FIGURE OUT IF THIS IS A RACE CONDITION
            dispatch((0, _index.setCurrentPage)(goToPage));
        }
        const state = getState();
        const list = state.lists.currentList;
        // Send the item, previous sortOrder and the new sortOrder
        // we should get the proper list and new page results in return
        list.reorderItems(item, prevSortOrder, newSortOrder, {
            search: state.active.search,
            filters: state.active.filters,
            sort: state.active.sort,
            columns: state.active.columns,
            page: state.lists.page
        }, (err, items)=>{
            // If err, flash the row alert
            if (err) {
                dispatch(resetItems(item.id));
            // return this.resetItems(this.findItemById[item.id]);
            } else {
                dispatch((0, _index.itemsLoaded)(items));
                dispatch(setRowAlert({
                    success: item.id,
                    fail: false
                }));
            }
        });
    };
}
function resetItems(itemId) {
    return (dispatch, getState)=>{
        const state = getState();
        const { page, drag } = state.lists;
        if (page.index !== drag.page) {
            // We are not on the original page so we need to move back to it
            dispatch((0, _index.setCurrentPage)(drag.page));
            dispatch((0, _index.loadItems)({
                fail: true,
                id: itemId
            }));
        // reset drag
        // return defaultDrag();
        }
        // Reset the list if dragout or error
        dispatch(setRowAlert({
            success: false,
            fail: itemId
        }));
    // we use the cached clone since this is the same page
    // the clone contains the proper index numbers which get overwritten on drag
    // _items.results = drag.clonedItems;
    // defaultDrag();
    // this.notifyChange();
    };
}

},{"../actions/index.mjs":106,"../constants.mjs":128}],106:[function(require,module,exports){
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
    get clearAllFilters () {
        return _active.clearAllFilters;
    },
    get clearCachedQuery () {
        return _active.clearCachedQuery;
    },
    get clearFilter () {
        return _active.clearFilter;
    },
    get deleteItems () {
        return _items.deleteItems;
    },
    get downloadItems () {
        return _items.downloadItems;
    },
    get itemLoadingError () {
        return _items.itemLoadingError;
    },
    get itemsLoaded () {
        return _items.itemsLoaded;
    },
    get loadInitialItems () {
        return loadInitialItems;
    },
    get loadItems () {
        return _items.loadItems;
    },
    get moveItem () {
        return _dragdrop.moveItem;
    },
    get reorderItems () {
        return _dragdrop.reorderItems;
    },
    get resetItems () {
        return _dragdrop.resetItems;
    },
    get selectList () {
        return selectList;
    },
    get setActiveColumns () {
        return _active.setActiveColumns;
    },
    get setActiveFilters () {
        return _active.setActiveFilters;
    },
    get setActiveSearch () {
        return _active.setActiveSearch;
    },
    get setActiveSort () {
        return _active.setActiveSort;
    },
    get setCurrentPage () {
        return setCurrentPage;
    },
    get setDragBase () {
        return _dragdrop.setDragBase;
    },
    get setFilter () {
        return _active.setFilter;
    },
    get setRowAlert () {
        return _dragdrop.setRowAlert;
    }
});
const _constants = require("../constants.mjs");
const _active = require("./active.mjs");
const _items = require("./items.mjs");
const _dragdrop = require("./dragdrop.mjs");
function selectList(id) {
    return (dispatch, getState)=>{
        dispatch({
            type: _constants.SELECT_LIST,
            id
        });
        dispatch((0, _active.setActiveList)(getState().lists.data[id], id));
    };
}
function loadInitialItems() {
    return {
        type: _constants.INITIAL_LIST_LOAD
    };
}
function setCurrentPage(index) {
    return {
        type: _constants.SET_CURRENT_PAGE,
        index: parseInt(index)
    };
}

},{"../constants.mjs":128,"./active.mjs":104,"./dragdrop.mjs":105,"./items.mjs":107}],107:[function(require,module,exports){
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
    get deleteItems () {
        return deleteItems;
    },
    get downloadItems () {
        return downloadItems;
    },
    get itemLoadingError () {
        return itemLoadingError;
    },
    get itemsLoaded () {
        return itemsLoaded;
    },
    get loadItems () {
        return loadItems;
    }
});
const _constants = require("../constants.mjs");
const _constants1 = require("../../../../constants.mjs");
function loadItems(options = {}) {
    return (dispatch, getState)=>{
        const currentLoadCounter = getState().lists.loadCounter + 1;
        dispatch({
            type: _constants.LOAD_ITEMS,
            loadCounter: currentLoadCounter
        });
        // Take a snapshot of the current redux state.
        const state = getState();
        // Hold a reference to the currentList in state.
        const currentList = state.lists.currentList;
        currentList.loadItems({
            search: state.active.search,
            filters: state.active.filters,
            sort: state.active.sort,
            columns: state.active.columns,
            page: state.lists.page
        }, (err, items)=>{
            // Create a new state snapshot and compare the current active list id
            // to the id of the currentList referenced above.
            // If they are the same, then this is the latest fetch request, we may resolve this normally.
            // If these are not the same, then it means that this is not the latest fetch request.
            // BAIL OUT!
            if (getState().active.id !== currentList.id) return;
            if (getState().lists.loadCounter > currentLoadCounter) return;
            if (items) {
                // if (page.index !== drag.page && drag.item) {
                // 	// add the dragging item
                // 	if (page.index > drag.page) {
                // 		_items.results.unshift(drag.item);
                // 	} else {
                // 		_items.results.push(drag.item);
                // 	}
                // }
                // _itemsResultsClone = items.results.slice(0);
                //
                // TODO Reenable this
                // if (options.success && options.id) {
                // 	// flashes a success background on the row
                // 	_rowAlert.success = options.id;
                // }
                // if (options.fail && options.id) {
                // 	// flashes a failure background on the row
                // 	_rowAlert.fail = options.id;
                // }
                // Successfully resolve this request in redux and set the loadCounter back to zero.
                dispatch(itemsLoaded(items));
            } else {
                // Catch this error in redux and set the loadCounter back to zero.
                dispatch(itemLoadingError(err));
            }
        });
    };
}
function downloadItems(format, columns) {
    return (dispatch, getState)=>{
        const state = getState();
        const active = state.active;
        const currentList = state.lists.currentList;
        const url = currentList.getDownloadURL({
            search: active.search,
            filters: active.filters,
            sort: active.sort,
            columns: columns ? currentList.expandColumns(columns) : active.columns,
            format: format
        });
        window.open(url);
    };
}
function itemsLoaded(items) {
    return {
        type: _constants.ITEMS_LOADED,
        items
    };
}
function itemLoadingError() {
    return (dispatch)=>{
        dispatch({
            type: _constants.ITEM_LOADING_ERROR,
            err: 'Network request failed'
        });
        setTimeout(()=>{
            dispatch(loadItems());
        }, _constants1.NETWORK_ERROR_RETRY_DELAY);
    };
}
function deleteItems(ids) {
    return (dispatch, getState)=>{
        const list = getState().lists.currentList;
        list.deleteItems(ids, (err, data)=>{
            // TODO ERROR HANDLING
            dispatch(loadItems());
        });
    };
}

},{"../../../../constants.mjs":149,"../constants.mjs":128}],108:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _FieldTypes = require("FieldTypes");
const _index = require("../../../../elemental/index.mjs");
const _index1 = /*#__PURE__*/ _interop_require_default(require("../../../../shared/Popout/index.mjs"));
const _index2 = require("../../actions/index.mjs");
const _getFilterLabel = /*#__PURE__*/ _interop_require_default(require("./getFilterLabel.mjs"));
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
 * React component that renders an active filter chip and an editable popout
 * for modifying or removing a single field filter.
 */ class Filter extends _react.Component {
    /**
	 * Opens the filter popout and copies the current filter value into local state.
	 */ open() {
        this.setState({
            isOpen: true,
            filterValue: this.props.filter.value
        });
    }
    /**
	 * Closes the filter popout.
	 */ close() {
        this.setState({
            isOpen: false
        });
    }
    /**
	 * Stores the pending filter value in local state while the popout is open.
	 * @param {object} filterValue - The new candidate filter value supplied by the field-specific filter component.
	 */ updateValue(filterValue) {
        this.setState({
            filterValue: filterValue
        });
    }
    /**
	 * Dispatches the setFilter action with the current pending value and closes the popout.
	 * Called on form submit; prevents the default browser form submission.
	 * @param {Event} e - The form submit event.
	 */ updateFilter(e) {
        const { dispatch, filter } = this.props;
        dispatch((0, _index2.setFilter)(filter.field.path, this.state.filterValue));
        this.close();
        e.preventDefault();
    }
    /**
	 * Dispatches the clearFilter action to remove this filter from the active filter set.
	 */ removeFilter() {
        this.props.dispatch((0, _index2.clearFilter)(this.props.filter.field.path));
    }
    /**
	 * Renders a Chip for the active filter alongside a Popout form for editing it.
	 * @returns {React.Element} The filter chip and popout form element.
	 */ render() {
        const { filter } = this.props;
        const filterId = `activeFilter__${filter.field.path}`;
        const FilterComponent = _FieldTypes.Filters[filter.field.type];
        return /*#__PURE__*/ _react.default.createElement("span", null, /*#__PURE__*/ _react.default.createElement(_index.Chip, {
            label: (0, _getFilterLabel.default)(filter.field, filter.value),
            onClick: this.open,
            onClear: this.removeFilter,
            color: "primary",
            id: filterId
        }), /*#__PURE__*/ _react.default.createElement(_index1.default, {
            isOpen: this.state.isOpen,
            onCancel: this.close,
            relativeToID: filterId
        }, /*#__PURE__*/ _react.default.createElement("form", {
            onSubmit: this.updateFilter
        }, /*#__PURE__*/ _react.default.createElement(_index1.default.Header, {
            title: "Edit Filter"
        }), /*#__PURE__*/ _react.default.createElement(_index1.default.Body, null, /*#__PURE__*/ _react.default.createElement(FilterComponent, {
            field: filter.field,
            filter: this.state.filterValue,
            onChange: this.updateValue
        })), /*#__PURE__*/ _react.default.createElement(_index1.default.Footer, {
            ref: "footer",
            primaryButtonIsSubmit: true,
            primaryButtonLabel: "Apply",
            secondaryButtonAction: this.close,
            secondaryButtonLabel: "Cancel"
        }))));
    }
    /**
	 * Initialises method bindings and sets the default closed state.
	 */ constructor(){
        super();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.state = {
            isOpen: false
        };
    }
}
Filter.propTypes = {
    dispatch: _proptypes.default.func.isRequired,
    filter: _proptypes.default.shape({
        field: _proptypes.default.object.isRequired,
        value: _proptypes.default.object.isRequired
    }).isRequired
};
const _default = Filter;

},{"../../../../elemental/index.mjs":73,"../../../../shared/Popout/index.mjs":146,"../../actions/index.mjs":106,"./getFilterLabel.mjs":112,"FieldTypes":undefined,"prop-types":258,"react":undefined}],109:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../../../elemental/index.mjs");
const _Filter = /*#__PURE__*/ _interop_require_default(require("./Filter.mjs"));
const _index1 = require("../../actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ListFilters = ({ dispatch, filters })=>{
    if (!filters.length) return /*#__PURE__*/ _react.default.createElement("div", null);
    const dispatchClearAllFilters = function() {
        dispatch((0, _index1.clearAllFilters)());
    };
    // Generate the list of filter pills
    const currentFilters = filters.map((filter, i)=>/*#__PURE__*/ _react.default.createElement(_Filter.default, {
            key: 'f' + i,
            filter: filter,
            dispatch: dispatch
        }));
    // When more than 1, append the clear button
    if (currentFilters.length > 1) {
        currentFilters.push(/*#__PURE__*/ _react.default.createElement(_index.Chip, {
            key: "listFilters__clear",
            label: "Clear All",
            onClick: dispatchClearAllFilters
        }));
    }
    const styles = {
        marginBottom: '1em',
        marginTop: '1em'
    };
    return /*#__PURE__*/ _react.default.createElement("div", {
        style: styles
    }, currentFilters);
};
ListFilters.propTypes = {
    dispatch: _proptypes.default.func.isRequired,
    filters: _proptypes.default.array.isRequired
};
const _default = ListFilters;

},{"../../../../elemental/index.mjs":73,"../../actions/index.mjs":106,"./Filter.mjs":108,"prop-types":258,"react":undefined}],110:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdom = require("react-dom");
const _CSSTransitionGroup = /*#__PURE__*/ _interop_require_default(require("react-transition-group/CSSTransitionGroup"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _ListFiltersAddForm = /*#__PURE__*/ _interop_require_default(require("./ListFiltersAddForm.mjs"));
const _index = /*#__PURE__*/ _interop_require_default(require("../../../../shared/Popout/index.mjs"));
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../../shared/Popout/PopoutList.mjs"));
const _index1 = require("../../../../elemental/index.mjs");
const _ListHeaderButton = /*#__PURE__*/ _interop_require_default(require("../ListHeaderButton.mjs"));
const _index2 = require("../../actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ListFiltersAdd = (0, _createreactclass.default)({
    displayName: 'ListFiltersAdd',
    propTypes: {
        maxHeight: _proptypes.default.number
    },
    getDefaultProps () {
        return {
            maxHeight: 360
        };
    },
    getInitialState () {
        return {
            innerHeight: 0,
            isOpen: false,
            searchString: '',
            selectedField: false
        };
    },
    updateSearch (e) {
        this.setState({
            searchString: e.target.value
        });
    },
    openPopout () {
        this.setState({
            isOpen: true
        }, this.focusSearch);
    },
    closePopout () {
        this.setState({
            innerHeight: 0,
            isOpen: false,
            searchString: '',
            selectedField: false
        });
    },
    setPopoutHeight (height) {
        this.setState({
            innerHeight: Math.min(this.props.maxHeight, height)
        });
    },
    navigateBack () {
        this.setState({
            selectedField: false,
            searchString: '',
            innerHeight: 0
        }, this.focusSearch);
    },
    focusSearch () {
        (0, _reactdom.findDOMNode)(this.refs.search).focus();
    },
    selectField (field) {
        this.setState({
            selectedField: field
        });
    },
    applyFilter (value) {
        this.props.dispatch((0, _index2.setFilter)(this.state.selectedField.path, value));
        this.closePopout();
    },
    renderList () {
        const activeFilterFields = this.props.activeFilters.map((obj)=>obj.field);
        const activeFilterPaths = activeFilterFields.map((obj)=>obj.path);
        const { searchString } = this.state;
        let filteredFilters = this.props.availableFilters;
        if (searchString) {
            filteredFilters = filteredFilters.filter((filter)=>filter.type !== 'heading').filter((filter)=>new RegExp(searchString).test(filter.field.label.toLowerCase()));
        }
        const popoutList = filteredFilters.map((el, i)=>{
            if (el.type === 'heading') {
                return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, {
                    key: 'heading_' + i
                }, el.content);
            }
            const filterIsActive = activeFilterPaths.length && activeFilterPaths.indexOf(el.field.path) > -1;
            return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
                key: 'item_' + el.field.path,
                icon: filterIsActive ? 'check' : 'chevron-right',
                iconHover: filterIsActive ? 'check' : 'chevron-right',
                isSelected: !!filterIsActive,
                label: el.field.label,
                onClick: ()=>{
                    this.selectField(el.field);
                }
            });
        });
        const formFieldStyles = {
            borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
            marginBottom: '1em',
            paddingBottom: '1em'
        };
        return /*#__PURE__*/ _react.default.createElement(_index.default.Pane, {
            onLayout: this.setPopoutHeight,
            key: "list"
        }, /*#__PURE__*/ _react.default.createElement(_index.default.Body, null, /*#__PURE__*/ _react.default.createElement("div", {
            style: formFieldStyles
        }, /*#__PURE__*/ _react.default.createElement(_index1.FormInput, {
            onChange: this.updateSearch,
            placeholder: "Find a filter...",
            ref: "search",
            value: this.state.searchString
        })), popoutList));
    },
    renderForm () {
        return /*#__PURE__*/ _react.default.createElement(_index.default.Pane, {
            onLayout: this.setPopoutHeight,
            key: "form"
        }, /*#__PURE__*/ _react.default.createElement(_ListFiltersAddForm.default, {
            activeFilters: this.props.activeFilters,
            field: this.state.selectedField,
            onApply: this.applyFilter,
            onCancel: this.closePopout,
            onBack: this.navigateBack,
            maxHeight: this.props.maxHeight,
            onHeightChange: this.setPopoutHeight,
            dispatch: this.props.dispatch
        }));
    },
    render () {
        const { isOpen, selectedField } = this.state;
        const popoutBodyStyle = this.state.innerHeight ? {
            height: this.state.innerHeight
        } : null;
        const popoutPanesClassname = (0, _classnames.default)('Popout__panes', {
            'Popout__scrollable-area': !selectedField
        });
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_ListHeaderButton.default, {
            active: isOpen,
            glyph: "eye",
            id: "listHeaderFilterButton",
            label: "Filter",
            onClick: isOpen ? this.closePopout : this.openPopout
        }), /*#__PURE__*/ _react.default.createElement(_index.default, {
            isOpen: isOpen,
            onCancel: this.closePopout,
            relativeToID: "listHeaderFilterButton"
        }, /*#__PURE__*/ _react.default.createElement(_index.default.Header, {
            leftAction: selectedField ? this.navigateBack : null,
            leftIcon: selectedField ? 'chevron-left' : null,
            title: selectedField ? selectedField.label : 'Filter',
            transitionDirection: selectedField ? 'next' : 'prev'
        }), /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
            className: popoutPanesClassname,
            component: "div",
            style: popoutBodyStyle,
            transitionName: selectedField ? 'Popout__pane-next' : 'Popout__pane-prev',
            transitionEnterTimeout: 360,
            transitionLeaveTimeout: 360
        }, selectedField ? this.renderForm() : this.renderList())));
    }
});
const _default = ListFiltersAdd;

},{"../../../../elemental/index.mjs":73,"../../../../shared/Popout/PopoutList.mjs":142,"../../../../shared/Popout/index.mjs":146,"../../actions/index.mjs":106,"../ListHeaderButton.mjs":121,"./ListFiltersAddForm.mjs":111,"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined,"react-dom":undefined,"react-transition-group/CSSTransitionGroup":undefined}],111:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdom = require("react-dom");
const _index = /*#__PURE__*/ _interop_require_default(require("../../../../shared/Popout/index.mjs"));
const _FieldTypes = require("FieldTypes");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ListFiltersAddForm = (0, _createreactclass.default)({
    propTypes: {
        field: _proptypes.default.object.isRequired,
        maxHeight: _proptypes.default.number,
        onApply: _proptypes.default.func,
        onCancel: _proptypes.default.func,
        onHeightChange: _proptypes.default.func
    },
    getInitialState () {
        const filterComponent = _FieldTypes.Filters[this.props.field.type];
        let filterValue = this.props.activeFilters.filter((i)=>i.field.path === this.props.field.path)[0];
        if (filterValue) {
            filterValue = filterValue.value;
        } else {
            filterValue = filterComponent && filterComponent.getDefaultValue ? filterComponent.getDefaultValue() : {};
        }
        return {
            filterComponent: filterComponent,
            filterValue: filterValue
        };
    },
    updateHeight (bodyHeight) {
        bodyHeight += 40; // TODO: remove magic number, currently accounts for padding
        const footerHeight = (0, _reactdom.findDOMNode)(this.refs.footer).offsetHeight;
        const maxBodyHeight = this.props.maxHeight - footerHeight;
        const newHeight = bodyHeight + footerHeight;
        // console.log(bodyHeight, maxBodyHeight, '|', newHeight, this.props.maxHeight);
        this.setState({
            bodyHeight: Math.min(bodyHeight, maxBodyHeight)
        }, ()=>{
            this.props.onHeightChange(Math.min(newHeight, this.props.maxHeight));
        });
    },
    updateValue (filterValue) {
        this.setState({
            filterValue: filterValue
        });
    },
    handleFormSubmit (e) {
        e.preventDefault();
        this.props.onApply(this.state.filterValue);
    },
    renderInvalidFilter () {
        return /*#__PURE__*/ _react.default.createElement("div", null, "Error: type ", this.props.field.type, " has no filter UI.");
    },
    render () {
        const FilterComponent = this.state.filterComponent;
        return /*#__PURE__*/ _react.default.createElement("form", {
            onSubmit: this.handleFormSubmit
        }, /*#__PURE__*/ _react.default.createElement(_index.default.Body, {
            ref: "body",
            scrollable: true,
            style: {
                height: this.state.bodyHeight
            }
        }, FilterComponent ? /*#__PURE__*/ _react.default.createElement(FilterComponent, {
            field: this.props.field,
            filter: this.state.filterValue,
            onChange: this.updateValue,
            onHeightChange: this.updateHeight
        }) : this.renderInvalidFilter()), /*#__PURE__*/ _react.default.createElement(_index.default.Footer, {
            ref: "footer",
            primaryButtonIsSubmit: true,
            primaryButtonLabel: "Apply",
            secondaryButtonAction: this.props.onCancel,
            secondaryButtonLabel: "Cancel"
        }));
    },
    displayName: "ListFiltersAddForm"
});
const _default = ListFiltersAddForm;

},{"../../../../shared/Popout/index.mjs":146,"FieldTypes":undefined,"create-react-class":161,"prop-types":258,"react":undefined,"react-dom":undefined}],112:[function(require,module,exports){
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DATE_FORMAT = 'MMM D YYYY';
const DATETIME_FORMAT = 'MMM D YYYY h:mm:ss';
/**
 * Returns a human-readable label describing an active filter for display in the
 * list header chip. Handles all built-in Keystone field types including boolean,
 * date, datetime, geopoint, location, number, money, password, relationship,
 * select, and various text-like types.
 * @param {object} field - The Keystone field descriptor (must have `label` and `type` properties).
 * @param {object} value - The current filter value object whose shape depends on `field.type`.
 * @returns {string} A human-readable description of the filter condition.
 */ function getFilterLabel(field, value) {
    const label = field.label;
    switch(field.type){
        // BOOLEAN
        case 'boolean':
            {
                return value.value ? label : `NOT ${label}`;
            }
        // DATE
        case 'date':
            {
                return `${label} ${resolveDateFormat(value, DATE_FORMAT)}`;
            }
        // DATE ARRAY
        case 'datearray':
            {
                const presence = value.presence === 'some' ? 'Some' : 'No';
                return `${presence} ${label} ${resolveDateFormat(value, DATETIME_FORMAT, 'are')}`;
            }
        // DATETIME
        case 'datetime':
            {
                return `${label} ${resolveDateFormat(value, DATETIME_FORMAT)}`;
            }
        // GEOPOINT
        // TODO distance needs a qualifier, currently defaults to "km"?
        case 'geopoint':
            {
                const mode = value.distance.mode === 'max' ? 'is within' : 'is at least';
                const distance = `${value.distance.value}km`;
                const conjunction = value.distance.mode === 'max' ? 'of' : 'from';
                const latlong = `${value.lat}, ${value.lon}`;
                return `${label} ${mode} ${distance} ${conjunction} ${latlong}`;
            }
        // LOCATION
        case 'location':
            {
                const joiner = value.inverted ? 'does NOT match' : 'matches';
                // Remove undefined values before rendering the template literal
                const formattedValue = [
                    value.street,
                    value.city,
                    value.state,
                    value.code,
                    value.country
                ].join(' ').trim();
                return `${label} ${joiner} "${formattedValue}"`;
            }
        // NUMBER & MONEY
        case 'number':
        case 'money':
            {
                return `${label} ${resolveNumberFormat(value)}`;
            }
        // NUMBER ARRAY
        case 'numberarray':
            {
                const presence = value.presence === 'some' ? 'Some' : 'No';
                return `${presence} ${label} ${resolveNumberFormat(value, 'are')}`;
            }
        // PASSWORD
        case 'password':
            {
                return value.exists ? `${label} is set` : `${label} is NOT set`;
            }
        // RELATIONSHIP
        // TODO populate relationship, currently rendering an ID
        case 'relationship':
            {
                const joiner = value.inverted ? 'is NOT' : 'is';
                const formattedValue = value.value.length > 1 ? value.value.join(', or ') : value.value[0];
                return `${label} ${joiner} ${formattedValue}`;
            }
        // SELECT
        case 'select':
            {
                const joiner = value.inverted ? 'is NOT' : 'is';
                const formattedValue = value.value.length > 1 ? value.value.join(', or ') : value.value[0];
                return `${label} ${joiner} ${formattedValue}`;
            }
        // TEXT-LIKE
        case 'code':
        case 'color':
        case 'email':
        case 'html':
        case 'key':
        case 'markdown':
        case 'name':
        case 'text':
        case 'textarea':
        case 'url':
            {
                let mode = '';
                if (value.mode === 'beginsWith') {
                    mode = value.inverted ? 'does NOT begin with' : 'begins with';
                } else if (value.mode === 'endsWith') {
                    mode = value.inverted ? 'does NOT end with' : 'ends with';
                } else if (value.mode === 'exactly') {
                    mode = value.inverted ? 'is NOT exactly' : 'is exactly';
                } else if (value.mode === 'contains') {
                    mode = value.inverted ? 'does NOT contain' : 'contains';
                }
                return `${label} ${mode} "${value.value}"`;
            }
        // TEXTARRAY
        case 'textarray':
            {
                const presence = value.presence === 'some' ? 'Some' : 'No';
                let mode = '';
                if (value.mode === 'beginsWith') {
                    mode = value.inverted ? 'do NOT begin with' : 'begin with';
                } else if (value.mode === 'endsWith') {
                    mode = value.inverted ? 'do NOT end with' : 'end with';
                } else if (value.mode === 'exactly') {
                    mode = value.inverted ? 'are NOT exactly' : 'are exactly';
                } else if (value.mode === 'contains') {
                    mode = value.inverted ? 'do NOT contain' : 'contain';
                }
                return `${presence} ${label} ${mode} "${value.value}"`;
            }
        // CATCHALL
        default:
            {
                return `${label} "${value.value}"`;
            }
    }
}
function resolveNumberFormat(value, conjunction = 'is') {
    let mode = '';
    if (value.mode === 'equals') mode = conjunction;
    else if (value.mode === 'gt') mode = `${conjunction} greater than`;
    else if (value.mode === 'lt') mode = `${conjunction} less than`;
    const formattedValue = value.mode === 'between' ? `is between ${value.value.min} and ${value.value.max}` : value.value;
    return `${mode} ${formattedValue}`;
}
function resolveDateFormat(value, format, conjunction = 'is') {
    const joiner = value.inverted ? `${conjunction} NOT` : conjunction;
    const mode = value.mode === 'on' ? '' : value.mode;
    const formattedValue = value.mode === 'between' ? `${(0, _moment.default)(value.after).format(format)} and ${(0, _moment.default)(value.before).format(format)}` : (0, _moment.default)(value.value).format(format);
    return `${joiner} ${mode} ${formattedValue}`;
}
const _default = getFilterLabel;

},{"moment":undefined}],113:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _ItemsTableRow = /*#__PURE__*/ _interop_require_default(require("./ItemsTableRow.mjs"));
const _ItemsTableDragDrop = /*#__PURE__*/ _interop_require_default(require("./ItemsTableDragDrop.mjs"));
const _constants = require("../../../../../constants.mjs");
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
const ItemsTable = (0, _createreactclass.default)({
    propTypes: {
        checkedItems: _proptypes.default.object.isRequired,
        columns: _proptypes.default.array.isRequired,
        deleteTableItem: _proptypes.default.func.isRequired,
        handleSortSelect: _proptypes.default.func.isRequired,
        items: _proptypes.default.object.isRequired,
        list: _proptypes.default.object.isRequired,
        manageMode: _proptypes.default.bool.isRequired,
        rowAlert: _proptypes.default.object.isRequired
    },
    renderCols () {
        const cols = this.props.columns.map((col)=>/*#__PURE__*/ _react.default.createElement("col", {
                key: col.path,
                width: col.width
            }));
        // add delete col when available
        if (!this.props.list.nodelete) {
            cols.unshift(/*#__PURE__*/ _react.default.createElement("col", {
                width: _constants.TABLE_CONTROL_COLUMN_WIDTH,
                key: "delete"
            }));
        }
        // add sort col when available
        if (this.props.list.sortable) {
            cols.unshift(/*#__PURE__*/ _react.default.createElement("col", {
                width: _constants.TABLE_CONTROL_COLUMN_WIDTH,
                key: "sortable"
            }));
        }
        return /*#__PURE__*/ _react.default.createElement("colgroup", null, cols);
    },
    renderHeaders () {
        let listControlCount = 0;
        if (this.props.list.sortable) listControlCount++;
        if (!this.props.list.nodelete) listControlCount++;
        // set active sort
        const activeSortPath = this.props.activeSort.paths[0];
        // pad first col when controls are available
        const cellPad = listControlCount ? /*#__PURE__*/ _react.default.createElement("th", {
            colSpan: listControlCount
        }) : null;
        // map each heading column
        const cellMap = this.props.columns.map((col)=>{
            const isSelected = activeSortPath && activeSortPath.path === col.path;
            const isInverted = isSelected && activeSortPath.invert;
            const buttonTitle = `Sort by ${col.label}${isSelected && !isInverted ? ' (desc)' : ''}`;
            const colClassName = (0, _classnames.default)('ItemList__sort-button th-sort', {
                'th-sort--asc': isSelected && !isInverted,
                'th-sort--desc': isInverted
            });
            return /*#__PURE__*/ _react.default.createElement("th", {
                key: col.path,
                colSpan: "1"
            }, /*#__PURE__*/ _react.default.createElement("button", {
                className: colClassName,
                onClick: ()=>{
                    this.props.handleSortSelect(col.path, isSelected && !isInverted);
                },
                title: buttonTitle
            }, col.label, /*#__PURE__*/ _react.default.createElement("span", {
                className: "th-sort__icon"
            })));
        });
        return /*#__PURE__*/ _react.default.createElement("thead", null, /*#__PURE__*/ _react.default.createElement("tr", null, cellPad, cellMap));
    },
    render () {
        const { items } = this.props;
        if (!items.results.length) return null;
        const tableBody = this.props.list.sortable ? /*#__PURE__*/ _react.default.createElement(_ItemsTableDragDrop.default, this.props) : /*#__PURE__*/ _react.default.createElement("tbody", null, items.results.map((item, i)=>{
            return /*#__PURE__*/ _react.default.createElement(_ItemsTableRow.default, _object_spread({
                key: item.id,
                deleteTableItem: this.props.deleteTableItem,
                index: i,
                sortOrder: item.sortOrder || 0,
                id: item.id,
                item: item
            }, this.props));
        }));
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "ItemList-wrapper"
        }, /*#__PURE__*/ _react.default.createElement("table", {
            cellPadding: "0",
            cellSpacing: "0",
            className: "Table ItemList",
            "data-list-table": true,
            "data-list-key": this.props.list.key,
            "data-list-path": this.props.list.path
        }, this.renderCols(), this.renderHeaders(), tableBody));
    },
    displayName: "ItemsTable"
});
const _default = ItemsTable;

},{"../../../../../constants.mjs":149,"./ItemsTableDragDrop.mjs":114,"./ItemsTableRow.mjs":117,"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],114:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdnd = require("react-dnd");
const _reactdndhtml5backend = /*#__PURE__*/ _interop_require_default(require("react-dnd-html5-backend"));
const _ItemsTableRow = require("./ItemsTableRow.mjs");
const _ItemsTableDragDropZone = /*#__PURE__*/ _interop_require_default(require("./ItemsTableDragDropZone.mjs"));
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
const ItemsTableDragDrop = (0, _createreactclass.default)({
    displayName: 'ItemsTableDragDrop',
    propTypes: {
        columns: _proptypes.default.array,
        id: _proptypes.default.any,
        index: _proptypes.default.number,
        items: _proptypes.default.object,
        list: _proptypes.default.object
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement("tbody", null, this.props.items.results.map((item, i)=>{
            return /*#__PURE__*/ _react.default.createElement(_ItemsTableRow.Sortable, _object_spread({
                key: item.id,
                index: i,
                sortOrder: item.sortOrder || 0,
                id: item.id,
                item: item
            }, this.props));
        }), /*#__PURE__*/ _react.default.createElement(_ItemsTableDragDropZone.default, this.props));
    }
});
const _default = (0, _reactdnd.DragDropContext)(_reactdndhtml5backend.default)(ItemsTableDragDrop);

},{"./ItemsTableDragDropZone.mjs":115,"./ItemsTableRow.mjs":117,"create-react-class":161,"prop-types":258,"react":undefined,"react-dnd":undefined,"react-dnd-html5-backend":undefined}],115:[function(require,module,exports){
/**
 * THIS IS ORPHANED AND ISN'T RENDERED AT THE MOMENT
 * THIS WAS DONE TO FINISH THE REDUX INTEGRATION, WILL REWRITE SOON
 * - `@mxstbr`
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _ItemsTableDragDropZoneTarget = /*#__PURE__*/ _interop_require_default(require("./ItemsTableDragDropZoneTarget.mjs"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ItemsTableDragDropZone = (0, _createreactclass.default)({
    displayName: 'ItemsTableDragDropZone',
    propTypes: {
        columns: _proptypes.default.array,
        connectDropTarget: _proptypes.default.func,
        items: _proptypes.default.object,
        list: _proptypes.default.object
    },
    renderPageDrops () {
        const { items, currentPage, pageSize } = this.props;
        const totalPages = Math.ceil(items.count / pageSize);
        const style = {
            display: totalPages > 1 ? null : 'none'
        };
        const pages = [];
        for(let i = 0; i < totalPages; i++){
            const page = i + 1;
            const pageItems = String(page * pageSize - (pageSize - 1)) + ' - ' + String(page * pageSize);
            const current = page === currentPage;
            const className = (0, _classnames.default)('ItemList__dropzone--page', {
                'is-active': current
            });
            pages.push(/*#__PURE__*/ _react.default.createElement(_ItemsTableDragDropZoneTarget.default, {
                key: 'page_' + page,
                page: page,
                className: className,
                pageItems: pageItems,
                pageSize: pageSize,
                currentPage: currentPage,
                drag: this.props.drag,
                dispatch: this.props.dispatch
            }));
        }
        let cols = this.props.columns.length;
        if (this.props.list.sortable) cols++;
        if (!this.props.list.nodelete) cols++;
        return /*#__PURE__*/ _react.default.createElement("tr", {
            style: style
        }, /*#__PURE__*/ _react.default.createElement("td", {
            colSpan: cols
        }, /*#__PURE__*/ _react.default.createElement("div", {
            className: "ItemList__dropzone"
        }, pages, /*#__PURE__*/ _react.default.createElement("div", {
            className: "clearfix"
        }))));
    },
    render () {
        return this.renderPageDrops();
    }
});
const _default = ItemsTableDragDropZone;

},{"./ItemsTableDragDropZoneTarget.mjs":116,"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],116:[function(require,module,exports){
/**
 * THIS IS ORPHANED AND ISN'T RENDERED AT THE MOMENT
 * THIS WAS DONE TO FINISH THE REDUX INTEGRATION, WILL REWRITE SOON
 * - `@mxstbr`
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactdnd = require("react-dnd");
const _index = require("../../actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let timeoutID = false;
// drop target
const ItemsTableDragDropZoneTarget = (0, _createreactclass.default)({
    displayName: 'ItemsTableDragDropZoneTarget',
    propTypes: {
        className: _proptypes.default.string,
        connectDropTarget: _proptypes.default.func,
        isOver: _proptypes.default.bool,
        pageItems: _proptypes.default.string
    },
    componentDidUpdate () {
        if (timeoutID && !this.props.isOver) {
            clearTimeout(timeoutID);
            timeoutID = false;
        }
    },
    render () {
        const { pageItems, page, isOver, dispatch } = this.props;
        let { className } = this.props;
        if (isOver) {
            className += page === this.props.currentPage ? ' is-available ' : ' is-waiting ';
        }
        return this.props.connectDropTarget(/*#__PURE__*/ _react.default.createElement("div", {
            className: className,
            onClick: (e)=>{
                dispatch((0, _index.setCurrentPage)(page));
            }
        }, pageItems));
    }
});
/**
 * Implements drag target.
 */ const dropTarget = {
    drop (props, monitor, component) {
        // we send manual data to endDrag to send this item to the correct page
        const { page } = props.drag;
        const targetPage = props.page;
        const pageSize = props.pageSize;
        const item = monitor.getItem();
        item.goToPage = props.page;
        item.prevSortOrder = item.sortOrder;
        // Work out the new sort order. If the new page is greater, we'll put it at the start of the page, and
        // if it's smaller we'll put it at the end of the page.
        item.newSortOrder = targetPage < page ? targetPage * pageSize : targetPage * pageSize - (pageSize - 1);
        return item;
    }
};
/**
 * Specifies the props to inject into the drop-target component.
 * @param {object} connect - The react-dnd connector object used to attach the drop target to a DOM node.
 * @param {object} monitor - The react-dnd monitor providing drag-state information.
 * @returns {object} Props object containing `connectDropTarget` and `isOver`.
 */ function dropProps(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}
const _default = (0, _reactdnd.DropTarget)('item', dropTarget, dropProps)(ItemsTableDragDropZoneTarget);

},{"../../actions/index.mjs":106,"create-react-class":161,"prop-types":258,"react":undefined,"react-dnd":undefined}],117:[function(require,module,exports){
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
    get Sortable () {
        return Sortable;
    },
    get default () {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
const _ListControl = /*#__PURE__*/ _interop_require_default(require("../ListControl.mjs"));
const _FieldTypes = require("FieldTypes");
const _reactdnd = require("react-dnd");
const _index = require("../../actions/index.mjs");
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
const ItemsRow = (0, _createreactclass.default)({
    propTypes: {
        columns: _proptypes.default.array,
        id: _proptypes.default.any,
        index: _proptypes.default.number,
        items: _proptypes.default.object,
        list: _proptypes.default.object,
        // Injected by React DnD:
        isDragging: _proptypes.default.bool,
        connectDragSource: _proptypes.default.func,
        connectDropTarget: _proptypes.default.func,
        connectDragPreview: _proptypes.default.func
    },
    renderRow (item) {
        const itemId = item.id;
        const rowClassname = (0, _classnames.default)({
            'ItemList__row--dragging': this.props.isDragging,
            'ItemList__row--selected': this.props.checkedItems[itemId],
            'ItemList__row--manage': this.props.manageMode,
            'ItemList__row--success': this.props.rowAlert.success === itemId,
            'ItemList__row--failure': this.props.rowAlert.fail === itemId
        });
        // item fields
        const cells = this.props.columns.map((col, i)=>{
            const ColumnType = _FieldTypes.Columns[col.type] || _FieldTypes.Columns.__unrecognised__;
            const linkTo = !i ? `${Keystone.adminLegacyPath}/${this.props.list.path}/${itemId}` : undefined;
            return /*#__PURE__*/ _react.default.createElement(ColumnType, {
                key: col.path,
                list: this.props.list,
                col: col,
                data: item,
                linkTo: linkTo
            });
        });
        // add sortable icon when applicable
        if (this.props.list.sortable) {
            cells.unshift(/*#__PURE__*/ _react.default.createElement(_ListControl.default, {
                key: "_sort",
                type: "sortable",
                itemId: itemId,
                dragSource: this.props.connectDragSource
            }));
        }
        // add delete/check icon when applicable
        if (!this.props.list.nodelete) {
            cells.unshift(this.props.manageMode ? /*#__PURE__*/ _react.default.createElement(_ListControl.default, {
                key: "_check",
                type: "check",
                itemId: itemId,
                active: this.props.checkedItems[itemId]
            }) : /*#__PURE__*/ _react.default.createElement(_ListControl.default, {
                key: "_delete",
                onClick: (e)=>this.props.deleteTableItem(item, e),
                type: "delete",
                itemId: itemId
            }));
        }
        const addRow = /*#__PURE__*/ _react.default.createElement("tr", {
            key: 'i' + item.id,
            onClick: this.props.manageMode ? (e)=>this.props.checkTableItem(item, e) : null,
            className: rowClassname,
            "data-list-row": true,
            "data-list-row-edit": true,
            "data-list-key": this.props.list.key,
            "data-list-path": this.props.list.path,
            "data-item-id": itemId,
            "data-selected": this.props.checkedItems[itemId] ? 'true' : 'false'
        }, cells);
        if (this.props.list.sortable) {
            return(// we could add a preview container/image
            // this.props.connectDragPreview(this.props.connectDropTarget(addRow))
            this.props.connectDropTarget(addRow));
        } else {
            return addRow;
        }
    },
    render () {
        return this.renderRow(this.props.item);
    },
    displayName: "ItemsRow"
});
const _default = ItemsRow;
// Expose Sortable
/**
 * Implements drag source.
 */ const dragItem = {
    beginDrag (props) {
        const send = _object_spread({}, props);
        props.dispatch((0, _index.setDragBase)(props.item, props.index));
        return _object_spread({}, send);
    },
    endDrag (props, monitor, component) {
        if (!monitor.didDrop()) {
            props.dispatch((0, _index.resetItems)(props.id));
            return;
        }
        const page = props.currentPage;
        const pageSize = props.pageSize;
        // If we were dropped onto a page change target, then droppedOn.prevSortOrder etc will be
        // set by that target, and we should use those values. If we were just dropped onto a new row
        // then we need to calculate these values ourselves.
        const droppedOn = monitor.getDropResult();
        const prevSortOrder = droppedOn.prevSortOrder || props.sortOrder;
        // To explain the following line, suppose we are on page 3 and there are 10 items per page.
        // Previous to this page, there are (3 - 1)*10 = 20 items before us. If we have index 6
        // on this page, then we're the 7th item to display (index starts from 0), and so we
        // want to update the display order to 20 + 7 = 27.
        const newSortOrder = droppedOn.newSortOrder || (page - 1) * pageSize + droppedOn.index + 1;
        // If we were dropped on a page change target, then droppedOn.gotToPage will be set, and we should
        // pass this to reorderItems, which will then change the page for the user.
        props.dispatch((0, _index.reorderItems)(props.item, prevSortOrder, newSortOrder, Number(droppedOn.goToPage)));
    }
};
/**
 * Implements drag target.
 */ const dropItem = {
    drop (props, monitor, component) {
        return _object_spread({}, props);
    },
    hover (props, monitor, component) {
        // reset row alerts
        if (props.rowAlert.success || props.rowAlert.fail) {
            props.dispatch((0, _index.setRowAlert)({
                reset: true
            }));
        }
        const dragged = monitor.getItem().index;
        const over = props.index;
        // self
        if (dragged === over) {
            return;
        }
        props.dispatch((0, _index.moveItem)(dragged, over, props));
        monitor.getItem().index = over;
    }
};
/**
 * Specifies the props to inject into the drag-source component.
 * @param {object} connect - The react-dnd connector object used to attach drag-source behaviour to a DOM node.
 * @param {object} monitor - The react-dnd monitor providing drag-state information.
 * @returns {object} Props object containing `connectDragSource`, `isDragging`, and `connectDragPreview`.
 */ function dragProps(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    };
}
function dropProps(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}
const Sortable = (0, _reactdnd.DragSource)('item', dragItem, dragProps)((0, _reactdnd.DropTarget)('item', dropItem, dropProps)(ItemsRow));

},{"../../actions/index.mjs":106,"../ListControl.mjs":119,"FieldTypes":undefined,"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined,"react-dnd":undefined}],118:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _index = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/index.mjs"));
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/PopoutList.mjs"));
const _index1 = require("../../../elemental/index.mjs");
const _ListHeaderButton = /*#__PURE__*/ _interop_require_default(require("./ListHeaderButton.mjs"));
const _index2 = require("../actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ListColumnsForm = (0, _createreactclass.default)({
    displayName: 'ListColumnsForm',
    getInitialState () {
        return {
            selectedColumns: {},
            searchString: ''
        };
    },
    getSelectedColumnsFromStore () {
        const selectedColumns = {};
        this.props.activeColumns.forEach((col)=>{
            selectedColumns[col.path] = true;
        });
        return selectedColumns;
    },
    togglePopout (visible) {
        this.setState({
            selectedColumns: this.getSelectedColumnsFromStore(),
            isOpen: visible,
            searchString: ''
        });
    },
    toggleColumn (path, value) {
        const newColumns = Object.assign({}, this.state.selectedColumns);
        if (value) {
            newColumns[path] = value;
        } else {
            delete newColumns[path];
        }
        this.setState({
            selectedColumns: newColumns
        });
    },
    applyColumns () {
        this.props.dispatch((0, _index2.setActiveColumns)(Object.keys(this.state.selectedColumns)));
        this.togglePopout(false);
    },
    updateSearch (e) {
        this.setState({
            searchString: e.target.value
        });
    },
    renderColumns () {
        const availableColumns = this.props.availableColumns;
        const { searchString } = this.state;
        let filteredColumns = availableColumns;
        if (searchString) {
            filteredColumns = filteredColumns.filter((column)=>column.type !== 'heading').filter((column)=>new RegExp(searchString).test(column.field.label.toLowerCase()));
        }
        return filteredColumns.map((el, i)=>{
            if (el.type === 'heading') {
                return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, {
                    key: 'heading_' + i
                }, el.content);
            }
            const path = el.field.path;
            const selected = this.state.selectedColumns[path];
            return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
                key: 'column_' + el.field.path,
                icon: selected ? 'check' : 'dash',
                iconHover: selected ? 'dash' : 'check',
                isSelected: !!selected,
                label: el.field.label,
                onClick: ()=>{
                    this.toggleColumn(path, !selected);
                }
            });
        });
    },
    render () {
        const formFieldStyles = {
            borderBottom: '1px dashed rgba(0,0,0,0.1)',
            marginBottom: '1em',
            paddingBottom: '1em'
        };
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_ListHeaderButton.default, {
            active: this.state.isOpen,
            id: "listHeaderColumnButton",
            glyph: "list-unordered",
            label: "Columns",
            onClick: ()=>this.togglePopout(!this.state.isOpen)
        }), /*#__PURE__*/ _react.default.createElement(_index.default, {
            isOpen: this.state.isOpen,
            onCancel: ()=>this.togglePopout(false),
            relativeToID: "listHeaderColumnButton"
        }, /*#__PURE__*/ _react.default.createElement(_index.default.Header, {
            title: "Columns"
        }), /*#__PURE__*/ _react.default.createElement(_index.default.Body, {
            scrollable: true
        }, /*#__PURE__*/ _react.default.createElement("div", {
            style: formFieldStyles
        }, /*#__PURE__*/ _react.default.createElement(_index1.FormInput, {
            autoFocus: true,
            onChange: this.updateSearch,
            placeholder: "Find a column...",
            value: this.state.searchString
        })), /*#__PURE__*/ _react.default.createElement(_PopoutList.default, null, this.renderColumns())), /*#__PURE__*/ _react.default.createElement(_index.default.Footer, {
            primaryButtonAction: this.applyColumns,
            primaryButtonLabel: "Apply",
            secondaryButtonAction: ()=>this.togglePopout(false),
            secondaryButtonLabel: "Cancel"
        })));
    }
});
const _default = ListColumnsForm;

},{"../../../elemental/index.mjs":73,"../../../shared/Popout/PopoutList.mjs":142,"../../../shared/Popout/index.mjs":146,"../actions/index.mjs":106,"./ListHeaderButton.mjs":121,"create-react-class":161,"react":undefined}],119:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const ListControl = (0, _createreactclass.default)({
    propTypes: {
        active: _proptypes.default.bool,
        dragSource: _proptypes.default.func,
        itemId: _proptypes.default.string,
        onClick: _proptypes.default.func,
        type: _proptypes.default.oneOf([
            'check',
            'delete',
            'sortable'
        ]).isRequired
    },
    renderControl () {
        let icon = 'octicon octicon-';
        const className = (0, _classnames.default)('ItemList__control ItemList__control--' + this.props.type, {
            'is-active': this.props.active
        });
        const tabindex = this.props.type === 'sortable' ? -1 : null;
        if (this.props.type === 'check') {
            icon += 'check';
        }
        if (this.props.type === 'delete') {
            icon += 'trashcan';
        }
        if (this.props.type === 'sortable') {
            icon += 'three-bars';
        }
        const attrs = {
            'data-list-row-control': this.props.type,
            'data-item-id': this.props.itemId
        };
        if (this.props.type === 'check') {
            attrs['data-list-row-select'] = true;
            attrs['aria-label'] = `Select row ${this.props.itemId}`;
        }
        if (this.props.type === 'delete') {
            attrs['data-list-row-delete'] = true;
            attrs['aria-label'] = `Delete row ${this.props.itemId}`;
        }
        const renderButton = /*#__PURE__*/ _react.default.createElement("button", _object_spread({
            type: "button",
            onClick: this.props.onClick,
            className: className,
            tabIndex: tabindex
        }, attrs), /*#__PURE__*/ _react.default.createElement("span", {
            className: icon
        }));
        if (this.props.dragSource) {
            return this.props.dragSource(renderButton);
        } else {
            return renderButton;
        }
    },
    render () {
        const className = 'ItemList__col--control ItemList__col--' + this.props.type;
        return /*#__PURE__*/ _react.default.createElement("td", {
            className: className
        }, this.renderControl());
    },
    displayName: "ListControl"
});
const _default = ListControl;

},{"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],120:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/index.mjs"));
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/PopoutList.mjs"));
const _ListHeaderButton = /*#__PURE__*/ _interop_require_default(require("./ListHeaderButton.mjs"));
const _index1 = require("../../../elemental/index.mjs");
const _index2 = require("../actions/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FORMAT_OPTIONS = [
    {
        label: 'CSV',
        value: 'csv'
    },
    {
        label: 'JSON',
        value: 'json'
    }
];
const ListDownloadForm = (0, _createreactclass.default)({
    propTypes: {
        activeColumns: _proptypes.default.array,
        dispatch: _proptypes.default.func.isRequired,
        list: _proptypes.default.object
    },
    getInitialState () {
        return {
            format: FORMAT_OPTIONS[0].value,
            isOpen: false,
            useCurrentColumns: true,
            selectedColumns: this.getDefaultSelectedColumns()
        };
    },
    getDefaultSelectedColumns () {
        const selectedColumns = {};
        this.props.activeColumns.forEach((col)=>{
            selectedColumns[col.path] = true;
        });
        return selectedColumns;
    },
    getListUIElements () {
        return this.props.list.uiElements.map((el)=>{
            return el.type === 'field' ? {
                type: 'field',
                field: this.props.list.fields[el.field]
            } : el;
        });
    },
    allColumnsSelected () {
        const selectedColumns = Object.keys(this.state.selectedColumns).length;
        const columnAmount = this.getListUIElements().filter((el)=>el.type !== 'heading').length;
        return selectedColumns === columnAmount;
    },
    togglePopout (visible) {
        this.setState({
            isOpen: visible
        });
    },
    toggleColumn (column, value) {
        const newColumns = Object.assign({}, this.state.selectedColumns);
        if (value) {
            newColumns[column] = value;
        } else {
            delete newColumns[column];
        }
        this.setState({
            selectedColumns: newColumns
        });
    },
    changeFormat (value) {
        this.setState({
            format: value
        });
    },
    toggleCurrentlySelectedColumns (e) {
        const newState = {
            useCurrentColumns: e.target.checked,
            selectedColumns: this.getDefaultSelectedColumns()
        };
        this.setState(newState);
    },
    clickSelectAll () {
        if (this.allColumnsSelected()) {
            this.selectNoColumns();
        } else {
            this.selectAllColumns();
        }
    },
    selectAllColumns () {
        const newColumns = {};
        this.getListUIElements().map((el)=>{
            if (el.type !== 'heading') {
                newColumns[el.field.path] = true;
            }
        });
        this.setState({
            selectedColumns: newColumns
        });
    },
    selectNoColumns () {
        this.setState({
            selectedColumns: {}
        });
    },
    handleDownloadRequest () {
        this.props.dispatch((0, _index2.downloadItems)(this.state.format, Object.keys(this.state.selectedColumns)));
        this.togglePopout(false);
    },
    renderColumnSelect () {
        if (this.state.useCurrentColumns) return null;
        const possibleColumns = this.getListUIElements().map((el, i)=>{
            if (el.type === 'heading') {
                return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, {
                    key: 'heading_' + i
                }, el.content);
            }
            const columnKey = el.field.path;
            const columnValue = this.state.selectedColumns[columnKey];
            return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
                key: 'item_' + el.field.path,
                icon: columnValue ? 'check' : 'dash',
                iconHover: columnValue ? 'dash' : 'check',
                isSelected: columnValue,
                label: el.field.label,
                onClick: ()=>this.toggleColumn(columnKey, !columnValue)
            });
        });
        const allColumnsSelected = this.allColumnsSelected();
        const checkboxLabel = allColumnsSelected ? 'Select None' : 'Select All';
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_index1.FormField, {
            offsetAbsentLabel: true
        }, /*#__PURE__*/ _react.default.createElement(_index1.LabelledControl, {
            checked: allColumnsSelected,
            label: checkboxLabel,
            onChange: this.clickSelectAll,
            type: "checkbox",
            value: true
        })), /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                borderTop: '1px dashed rgba(0,0,0,0.1)',
                marginTop: '1em',
                paddingTop: '1em'
            }
        }, possibleColumns));
    },
    render () {
        const { useCurrentColumns } = this.state;
        return /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_ListHeaderButton.default, {
            active: this.state.isOpen,
            id: "listHeaderDownloadButton",
            glyph: "cloud-download",
            label: "Download",
            onClick: ()=>this.togglePopout(!this.state.isOpen)
        }), /*#__PURE__*/ _react.default.createElement(_index.default, {
            isOpen: this.state.isOpen,
            onCancel: ()=>this.togglePopout(false),
            relativeToID: "listHeaderDownloadButton"
        }, /*#__PURE__*/ _react.default.createElement(_index.default.Header, {
            title: "Download"
        }), /*#__PURE__*/ _react.default.createElement(_index.default.Body, {
            scrollable: true
        }, /*#__PURE__*/ _react.default.createElement(_index1.Form, {
            layout: "horizontal",
            labelWidth: 100,
            component: "div"
        }, /*#__PURE__*/ _react.default.createElement(_index1.FormField, {
            label: "File format:"
        }, /*#__PURE__*/ _react.default.createElement(_index1.SegmentedControl, {
            equalWidthSegments: true,
            onChange: this.changeFormat,
            options: FORMAT_OPTIONS,
            value: this.state.format
        })), /*#__PURE__*/ _react.default.createElement(_index1.FormField, {
            label: "Columns:",
            style: {
                marginBottom: 0
            }
        }, /*#__PURE__*/ _react.default.createElement(_index1.LabelledControl, {
            autoFocus: true,
            checked: useCurrentColumns,
            label: "Use currently selected",
            onChange: this.toggleCurrentlySelectedColumns,
            type: "checkbox",
            value: true
        })), this.renderColumnSelect())), /*#__PURE__*/ _react.default.createElement(_index.default.Footer, {
            primaryButtonAction: this.handleDownloadRequest,
            primaryButtonLabel: "Download",
            secondaryButtonAction: ()=>this.togglePopout(false),
            secondaryButtonLabel: "Cancel"
        })));
    },
    displayName: "ListDownloadForm"
});
const _default = ListDownloadForm;

},{"../../../elemental/index.mjs":73,"../../../shared/Popout/PopoutList.mjs":142,"../../../shared/Popout/index.mjs":146,"../actions/index.mjs":106,"./ListHeaderButton.mjs":121,"create-react-class":161,"prop-types":258,"react":undefined}],121:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../../elemental/index.mjs");
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
 * A responsive toolbar button that shows a glyph icon on narrow screens and a
 * text label on wider screens.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name.
 * @param {string} [props.label] - Text label shown on wider screens.
 * @param {string} props.glyph - Name of the Glyph icon shown on narrow screens.
 * @returns {React.Element} A DropdownButton containing a glyph and a label span.
 */ function ListHeaderButton(_0) {
    let { className, label, glyph } = _0, props = _object_without_properties(_0, [
        "className",
        "label",
        "glyph"
    ]);
    return /*#__PURE__*/ _react.default.createElement(_index.DropdownButton, _object_spread({
        block: true
    }, props), /*#__PURE__*/ _react.default.createElement(_index.Glyph, {
        name: glyph,
        cssStyles: classes.glyph
    }), /*#__PURE__*/ _react.default.createElement("span", {
        className: (0, _glamor.css)(classes.label)
    }, label));
}
ListHeaderButton.propTypes = {
    glyph: _proptypes.default.string.isRequired
};
// show an icon on small screens where real estate is precious
// otherwise render the label
const classes = {
    glyph: {
        'display': 'none',
        '@media (max-width: 500px)': {
            display: 'inline-block'
        }
    },
    label: {
        'display': 'inline-block',
        '@media (max-width: 500px)': {
            display: 'none'
        }
    }
};
const _default = ListHeaderButton;

},{"../../../elemental/index.mjs":73,"glamor":undefined,"prop-types":258,"react":undefined}],122:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
const _color = require("../../../../utils/color.mjs");
const _index = require("../../../elemental/index.mjs");
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
 * A search input with an inline clear/search icon button. When the input is
 * empty the icon is a search glyph; once text is present it becomes an X that
 * clears the query on click.
 * @param {object} props - Component props.
 * @param {boolean} [props.focusInput] - Whether the input should receive focus on mount.
 * @param {function(Event): void} props.handleChange - Called with the change event on each keystroke.
 * @param {function(): void} props.handleClear - Called when the clear (X) button is clicked.
 * @param {function(Event): void} props.handleKeyup - Called with the keyup event on each key release.
 * @param {string} [props.value] - The current search query string.
 * @returns {React.Element} The search input wrapper element.
 */ function ListHeaderSearch(_0) {
    let { focusInput, handleChange, handleClear, handleKeyup, value } = _0, props = _object_without_properties(_0, [
        "focusInput",
        "handleChange",
        "handleClear",
        "handleKeyup",
        "value"
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: (0, _glamor.css)(classes.wrapper)
    }), /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
        "data-search-input-field": true,
        onChange: handleChange,
        onKeyUp: handleKeyup,
        placeholder: "Search",
        value: value
    }), /*#__PURE__*/ _react.default.createElement("button", {
        className: (0, _glamor.css)(classes.icon, !!value.length && classes.iconWhenClear),
        "data-search-input-field-clear-icon": true,
        disabled: !value.length,
        onClick: value.length ? handleClear : undefined,
        title: "Clear search query",
        type: "button"
    }, /*#__PURE__*/ _react.default.createElement(_index.Glyph, {
        name: value.length ? 'x' : 'search'
    })));
}
ListHeaderSearch.propTypes = {
    focusInput: _proptypes.default.bool,
    handleChange: _proptypes.default.func.isRequired,
    handleClear: _proptypes.default.func.isRequired,
    handleKeyup: _proptypes.default.func.isRequired,
    value: _proptypes.default.string
};
const clearHoverAndFocusStyles = {
    color: _theme.default.color.danger,
    outline: 0,
    textDecoration: 'none'
};
const classes = {
    wrapper: {
        position: 'relative'
    },
    icon: {
        background: 'none',
        border: 'none',
        color: _theme.default.color.gray40,
        height: '100%',
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        top: 0,
        width: '2.2em',
        zIndex: 2
    },
    iconWhenClear: {
        ':hover': clearHoverAndFocusStyles,
        ':focus': clearHoverAndFocusStyles,
        ':active': {
            color: (0, _color.darken)(_theme.default.color.danger, 10)
        }
    }
};
const _default = ListHeaderSearch;

},{"../../../../theme.mjs":150,"../../../../utils/color.mjs":152,"../../../elemental/index.mjs":73,"glamor":undefined,"prop-types":258,"react":undefined}],123:[function(require,module,exports){
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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
const _ListSort = /*#__PURE__*/ _interop_require_default(require("./ListSort.mjs"));
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
 * Renders the list screen heading together with the ListSort popout for changing
 * the active sort order.
 * @param {object} props - Component props.
 * @param {object} [props.activeSort] - The currently active sort descriptor.
 * @param {object[]} [props.availableColumns] - All columns available for sorting.
 * @param {function(string): void} props.handleSortSelect - Called when the user selects a new sort column.
 * @param {string} [props.title] - The list name displayed as the heading text.
 * @returns {React.Element} An h2 heading element containing the title and sort control.
 */ function ListHeaderTitle(_0) {
    let { activeSort, availableColumns, handleSortSelect, title } = _0, props = _object_without_properties(_0, [
        "activeSort",
        "availableColumns",
        "handleSortSelect",
        "title"
    ]);
    return /*#__PURE__*/ _react.default.createElement("h2", _object_spread({
        className: (0, _glamor.css)(classes.heading)
    }, props), title, /*#__PURE__*/ _react.default.createElement(_ListSort.default, {
        activeSort: activeSort,
        availableColumns: availableColumns,
        handleSortSelect: handleSortSelect
    }));
}
ListHeaderTitle.propTypes = {
    activeSort: _proptypes.default.object,
    availableColumns: _proptypes.default.arrayOf(_proptypes.default.object),
    handleSortSelect: _proptypes.default.func.isRequired,
    title: _proptypes.default.string
};
const classes = {
    heading: {
        [`@media (max-width: ${_theme.default.breakpoint.mobileMax})`]: {
            fontSize: '1.25em',
            fontWeight: 500
        }
    }
};
const _default = ListHeaderTitle;

},{"../../../../theme.mjs":150,"./ListSort.mjs":126,"glamor":undefined,"prop-types":258,"react":undefined}],124:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../../elemental/index.mjs");
const _theme = /*#__PURE__*/ _interop_require_default(require("../../../../theme.mjs"));
const _ListColumnsForm = /*#__PURE__*/ _interop_require_default(require("./ListColumnsForm.mjs"));
const _ListDownloadForm = /*#__PURE__*/ _interop_require_default(require("./ListDownloadForm.mjs"));
const _ListHeaderSearch = /*#__PURE__*/ _interop_require_default(require("./ListHeaderSearch.mjs"));
const _ListFiltersAdd = /*#__PURE__*/ _interop_require_default(require("./Filtering/ListFiltersAdd.mjs"));
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
function ButtonDivider(_0) {
    let { style } = _0, props = _object_without_properties(_0, [
        "style"
    ]);
    props.style = _object_spread({
        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
        paddingLeft: '0.75em'
    }, style);
    return /*#__PURE__*/ _react.default.createElement("div", props);
}
function CreateButton(_0) {
    let { listName, onClick } = _0, props = _object_without_properties(_0, [
        "listName",
        "onClick"
    ]);
    return /*#__PURE__*/ _react.default.createElement(_index.GlyphButton, _object_spread({
        block: true,
        color: "success",
        "data-list-create": true,
        "data-e2e-list-create-button": "header",
        glyph: "plus",
        onClick: onClick,
        position: "left",
        title: `Create ${listName}`
    }, props), /*#__PURE__*/ _react.default.createElement(_index.ResponsiveText, {
        visibleSM: "Create",
        visibleMD: "Create",
        visibleLG: `Create ${listName}`
    }));
}
/**
 * The main toolbar for the list screen. Composes search, filter, column
 * selector, download, expand, and create-item controls into a single responsive
 * inline group.
 * @param {object} props - Component props.
 * @param {function(object): void} props.dispatch - Redux dispatch function passed to child controls.
 * @param {object} [props.list] - The current Keystone list descriptor.
 * @param {boolean} [props.expandIsActive] - Whether the expanded-width mode is active.
 * @param {function(): void} props.expandOnClick - Called when the expand-width button is clicked.
 * @param {boolean} [props.createIsAvailable] - Whether the create-item button should be shown.
 * @param {string} [props.createListName] - The list name used in the create button label.
 * @param {function(): void} props.createOnClick - Called when the create-item button is clicked.
 * @param {function(Event): void} props.searchHandleChange - Change handler for the search input.
 * @param {function(): void} props.searchHandleClear - Handler to clear the search input.
 * @param {function(Event): void} props.searchHandleKeyup - Keyup handler for the search input.
 * @param {string} [props.searchValue] - Current value of the search input.
 * @param {object[]} [props.filtersActive] - Currently active filters.
 * @param {object[]} [props.filtersAvailable] - All filters available to add.
 * @param {object[]} [props.columnsAvailable] - All columns available for display.
 * @param {object[]} [props.columnsActive] - Currently visible columns.
 * @returns {React.Element} The full toolbar element.
 */ function ListHeaderToolbar(_0) {
    let { // common
    dispatch, list, // expand
    expandIsActive, expandOnClick, // list
    createIsAvailable, createListName, createOnClick, // search
    searchHandleChange, searchHandleClear, searchHandleKeyup, searchValue, // filters
    filtersActive, filtersAvailable, // columns
    columnsAvailable, columnsActive } = _0, props = _object_without_properties(_0, [
        "dispatch",
        "list",
        "expandIsActive",
        "expandOnClick",
        "createIsAvailable",
        "createListName",
        "createOnClick",
        "searchHandleChange",
        "searchHandleClear",
        "searchHandleKeyup",
        "searchValue",
        "filtersActive",
        "filtersAvailable",
        "columnsAvailable",
        "columnsActive"
    ]);
    return /*#__PURE__*/ _react.default.createElement(_index.InlineGroup, {
        block: true,
        cssStyles: classes.wrapper
    }, /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        grow: true,
        cssStyles: classes.search
    }, /*#__PURE__*/ _react.default.createElement(_ListHeaderSearch.default, {
        handleChange: searchHandleChange,
        handleClear: searchHandleClear,
        handleKeyup: searchHandleKeyup,
        value: searchValue
    })), /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        grow: true,
        cssStyles: classes.buttons
    }, /*#__PURE__*/ _react.default.createElement(_index.InlineGroup, {
        block: true
    }, /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        cssStyles: classes.filter
    }, /*#__PURE__*/ _react.default.createElement(_ListFiltersAdd.default, {
        dispatch: dispatch,
        activeFilters: filtersActive,
        availableFilters: filtersAvailable
    })), /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        cssStyles: classes.columns
    }, /*#__PURE__*/ _react.default.createElement(_ListColumnsForm.default, {
        availableColumns: columnsAvailable,
        activeColumns: columnsActive,
        dispatch: dispatch
    })), /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        cssStyles: classes.download
    }, /*#__PURE__*/ _react.default.createElement(_ListDownloadForm.default, {
        activeColumns: columnsActive,
        dispatch: dispatch,
        list: list
    })), /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        cssStyles: classes.expand
    }, /*#__PURE__*/ _react.default.createElement(ButtonDivider, null, /*#__PURE__*/ _react.default.createElement(_index.GlyphButton, {
        active: expandIsActive,
        glyph: "mirror",
        onClick: expandOnClick,
        title: "Expand table width"
    }))), createIsAvailable && /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, {
        cssStyles: classes.create
    }, /*#__PURE__*/ _react.default.createElement(ButtonDivider, null, /*#__PURE__*/ _react.default.createElement(CreateButton, {
        listName: createListName,
        onClick: createOnClick
    }))))));
}
ListHeaderToolbar.propTypes = {
    columnsActive: _proptypes.default.array,
    columnsAvailable: _proptypes.default.array,
    createIsAvailable: _proptypes.default.bool,
    createListName: _proptypes.default.string,
    createOnClick: _proptypes.default.func.isRequired,
    dispatch: _proptypes.default.func.isRequired,
    expandIsActive: _proptypes.default.bool,
    expandOnClick: _proptypes.default.func.isRequired,
    filtersActive: _proptypes.default.array,
    filtersAvailable: _proptypes.default.array,
    list: _proptypes.default.object,
    searchHandleChange: _proptypes.default.func.isRequired,
    searchHandleClear: _proptypes.default.func.isRequired,
    searchHandleKeyup: _proptypes.default.func.isRequired,
    searchValue: _proptypes.default.string
};
const tabletGrowStyles = {
    [`@media (max-width: ${_theme.default.breakpoint.tabletPortraitMax})`]: {
        flexGrow: 1
    }
};
const classes = {
    // main wrapper
    wrapper: {
        [`@media (max-width: ${_theme.default.breakpoint.tabletPortraitMax})`]: {
            flexWrap: 'wrap'
        }
    },
    // button wrapper
    buttons: {
        [`@media (max-width: ${_theme.default.breakpoint.tabletPortraitMax})`]: {
            paddingLeft: 0
        }
    },
    // cols
    expand: {
        [`@media (max-width: ${_theme.default.breakpoint.desktopMax})`]: {
            display: 'none'
        }
    },
    filter: {
        [`@media (max-width: ${_theme.default.breakpoint.tabletPortraitMax})`]: {
            paddingLeft: 0,
            flexGrow: 1
        }
    },
    columns: tabletGrowStyles,
    create: tabletGrowStyles,
    download: tabletGrowStyles,
    search: {
        [`@media (max-width: ${_theme.default.breakpoint.tabletPortraitMax})`]: {
            marginBottom: '0.75em',
            minWidth: '100%'
        }
    }
};
const _default = ListHeaderToolbar;

},{"../../../../theme.mjs":150,"../../../elemental/index.mjs":73,"./Filtering/ListFiltersAdd.mjs":110,"./ListColumnsForm.mjs":118,"./ListDownloadForm.mjs":120,"./ListHeaderSearch.mjs":122,"prop-types":258,"react":undefined}],125:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../../../elemental/index.mjs");
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
 * Renders the management toolbar for the list screen. Provides a Manage toggle
 * button, item-selection controls (all, page, none), a delete action, and a
 * selected-count indicator. Returns null when there are no items or when both
 * edit and delete are disabled on the list.
 * @param {object} props - Component props.
 * @param {number} [props.checkedItemCount] - Number of currently checked/selected items.
 * @param {function(): void} props.handleDelete - Called when the delete button is clicked.
 * @param {function(string): void} props.handleSelect - Called with a selection mode string ('all', 'visible', or 'none').
 * @param {function(boolean): void} props.handleToggle - Called with a boolean to open or close manage mode.
 * @param {boolean} [props.isOpen] - Whether manage mode is currently active.
 * @param {number} [props.itemCount] - Total number of items in the list.
 * @param {number} [props.itemsPerPage] - Number of items shown per page.
 * @param {boolean} [props.nodelete] - When true, the delete action is not available.
 * @param {boolean} [props.noedit] - When true, edit actions are not available.
 * @param {boolean} [props.selectAllItemsLoading] - Whether a select-all request is in progress.
 * @returns {React.Element|null} The management toolbar, or null when not applicable.
 */ function ListManagement(_0) {
    let { checkedItemCount, handleDelete, handleSelect, handleToggle, isOpen, itemCount, itemsPerPage, nodelete, noedit, selectAllItemsLoading } = _0, props = _object_without_properties(_0, [
        "checkedItemCount",
        "handleDelete",
        "handleSelect",
        "handleToggle",
        "isOpen",
        "itemCount",
        "itemsPerPage",
        "nodelete",
        "noedit",
        "selectAllItemsLoading"
    ]);
    // do not render if there's no results
    // or if edit/delete unavailable on the list
    if (!itemCount || nodelete && noedit) return null;
    const buttonNoteStyles = {
        color: '#999',
        fontWeight: 'normal'
    };
    // delete button
    const actionButtons = isOpen && /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.GlyphButton, {
        color: "cancel",
        "data-list-management-delete": true,
        disabled: !checkedItemCount,
        glyph: "trashcan",
        onClick: handleDelete,
        position: "left",
        variant: "link",
        alt: "delete"
    }, "Delete"));
    // select buttons
    const allVisibleButtonIsActive = checkedItemCount === itemCount;
    const pageVisibleButtonIsActive = checkedItemCount === itemsPerPage;
    const noneButtonIsActive = !checkedItemCount;
    const selectAllButton = itemCount > itemsPerPage && /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        active: allVisibleButtonIsActive,
        onClick: ()=>handleSelect('all'),
        title: "Select all rows (including those not visible)"
    }, selectAllItemsLoading ? /*#__PURE__*/ _react.default.createElement(_index.Spinner, null) : 'All', " ", /*#__PURE__*/ _react.default.createElement("small", {
        style: buttonNoteStyles
    }, "(", itemCount, ")")));
    const selectButtons = isOpen ? /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.InlineGroup, {
        contiguous: true
    }, selectAllButton, /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        active: pageVisibleButtonIsActive,
        onClick: ()=>handleSelect('visible'),
        title: "Select all rows"
    }, itemCount > itemsPerPage ? 'Page ' : 'All ', /*#__PURE__*/ _react.default.createElement("small", {
        style: buttonNoteStyles
    }, "(", itemCount > itemsPerPage ? itemsPerPage : itemCount, ")"))), /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        active: noneButtonIsActive,
        onClick: ()=>handleSelect('none'),
        title: "Deselect all rows"
    }, "None")))) : null;
    // selected count text
    const selectedCountText = isOpen ? /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement("span", {
        "data-list-management-selected-count": true,
        style: {
            color: '#666',
            display: 'inline-block',
            lineHeight: '2.4em',
            margin: 1
        }
    }, checkedItemCount, " selected")) : null;
    // put it all together
    return /*#__PURE__*/ _react.default.createElement("div", {
        "data-list-management": true
    }, /*#__PURE__*/ _react.default.createElement(_index.InlineGroup, {
        style: {
            float: 'left',
            marginRight: '.75em',
            marginBottom: 0
        }
    }, /*#__PURE__*/ _react.default.createElement(_index.InlineGroupSection, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        active: isOpen,
        "data-list-management-toggle": true,
        onClick: ()=>handleToggle(!isOpen)
    }, "Manage")), selectButtons, actionButtons, selectedCountText));
}
ListManagement.propTypes = {
    checkedItems: _proptypes.default.number,
    handleDelete: _proptypes.default.func.isRequired,
    handleSelect: _proptypes.default.func.isRequired,
    handleToggle: _proptypes.default.func.isRequired,
    isOpen: _proptypes.default.bool,
    itemCount: _proptypes.default.number,
    itemsPerPage: _proptypes.default.number,
    nodelete: _proptypes.default.bool,
    noedit: _proptypes.default.bool,
    selectAllItemsLoading: _proptypes.default.bool
};
const _default = ListManagement;

},{"../../../elemental/index.mjs":73,"prop-types":258,"react":undefined}],126:[function(require,module,exports){
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
const _index = require("../../../elemental/index.mjs");
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _Kbd = /*#__PURE__*/ _interop_require_default(require("../../../shared/Kbd.mjs"));
const _index1 = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/index.mjs"));
const _PopoutList = /*#__PURE__*/ _interop_require_default(require("../../../shared/Popout/PopoutList.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ListSort = (0, _createreactclass.default)({
    displayName: 'ListSort',
    propTypes: {
        handleSortSelect: _proptypes.default.func.isRequired
    },
    getInitialState () {
        return {
            altDown: false,
            popoutIsOpen: false,
            searchString: ''
        };
    },
    componentDidMount () {
        document.body.addEventListener('keydown', this.handleKeyDown, false);
        document.body.addEventListener('keyup', this.handleKeyUp, false);
    },
    componentWillUnmount () {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown (e) {
        if (e.key !== 'Alt') return;
        this.setState({
            altDown: true
        });
    },
    handleKeyUp (e) {
        if (e.key !== 'Alt') return;
        this.setState({
            altDown: false
        });
    },
    handleSortSelect (path, inverted) {
        if (this.state.altDown) inverted = true;
        this.props.handleSortSelect(path, inverted);
        this.closePopout();
    },
    openPopout () {
        this.setState({
            popoutIsOpen: true
        });
    },
    closePopout () {
        this.setState({
            popoutIsOpen: false,
            searchString: ''
        });
    },
    updateSearch (e) {
        this.setState({
            searchString: e.target.value
        });
    },
    renderSortOptions () {
        // TODO: Handle multiple sort paths
        const activeSortPath = this.props.activeSort.paths[0];
        const availibleColumns = this.props.availableColumns;
        const { searchString } = this.state;
        let filteredColumns = availibleColumns;
        if (searchString) {
            filteredColumns = filteredColumns.filter((column)=>column.type !== 'heading').filter((column)=>new RegExp(searchString).test(column.field.label.toLowerCase()));
        }
        return filteredColumns.map((el, i)=>{
            if (el.type === 'heading') {
                return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Heading, {
                    key: 'heading_' + i
                }, el.content);
            }
            const path = el.field.path;
            const isSelected = activeSortPath && activeSortPath.path === path;
            const isInverted = isSelected && activeSortPath.invert;
            const icon = this.state.altDown || isSelected && !isInverted ? 'chevron-up' : 'chevron-down';
            return /*#__PURE__*/ _react.default.createElement(_PopoutList.default.Item, {
                key: 'column_' + el.field.path,
                icon: icon,
                isSelected: isSelected,
                label: el.field.label,
                onClick: ()=>{
                    this.handleSortSelect(path, isSelected && !isInverted);
                }
            });
        });
    },
    render () {
        // TODO: Handle multiple sort paths
        const activeSortPath = this.props.activeSort.paths[0];
        const formFieldStyles = {
            borderBottom: '1px dashed rgba(0,0,0,0.1)',
            paddingBottom: '1em'
        };
        return /*#__PURE__*/ _react.default.createElement("span", null, activeSortPath && /*#__PURE__*/ _react.default.createElement("span", null, /*#__PURE__*/ _react.default.createElement("span", {
            style: {
                color: '#999'
            }
        }, " sorted by "), /*#__PURE__*/ _react.default.createElement("a", {
            id: "listHeaderSortButton",
            href: "javascript:;",
            onClick: this.openPopout
        }, activeSortPath.label.toLowerCase(), activeSortPath.invert ? ' (descending)' : '', /*#__PURE__*/ _react.default.createElement("span", {
            className: "disclosure-arrow"
        }))), /*#__PURE__*/ _react.default.createElement(_index1.default, {
            isOpen: this.state.popoutIsOpen,
            onCancel: this.closePopout,
            relativeToID: "listHeaderSortButton"
        }, /*#__PURE__*/ _react.default.createElement(_index1.default.Header, {
            title: "Sort"
        }), /*#__PURE__*/ _react.default.createElement(_index1.default.Body, {
            scrollable: true
        }, /*#__PURE__*/ _react.default.createElement(_index.FormField, {
            style: formFieldStyles
        }, /*#__PURE__*/ _react.default.createElement(_index.FormInput, {
            autoFocus: true,
            value: this.state.searchString,
            onChange: this.updateSearch,
            placeholder: "Find a field..."
        })), /*#__PURE__*/ _react.default.createElement(_PopoutList.default, null, this.renderSortOptions())), /*#__PURE__*/ _react.default.createElement(_index1.default.Footer, null, /*#__PURE__*/ _react.default.createElement(_index.FormNote, null, "Hold ", /*#__PURE__*/ _react.default.createElement(_Kbd.default, null, "alt"), " to toggle ascending/descending"))));
    }
});
const _default = ListSort;

},{"../../../elemental/index.mjs":73,"../../../shared/Kbd.mjs":138,"../../../shared/Popout/PopoutList.mjs":142,"../../../shared/Popout/index.mjs":146,"create-react-class":161,"prop-types":258,"react":undefined}],127:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _reactselect = /*#__PURE__*/ _interop_require_default(require("react-select"));
const _reactdom = require("react-dom");
const _FieldTypes = require("FieldTypes");
const _InvalidFieldType = /*#__PURE__*/ _interop_require_default(require("../../../shared/InvalidFieldType.mjs"));
const _string = require("../../../../utils/string.mjs");
const _index = require("../../../elemental/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const UpdateForm = (0, _createreactclass.default)({
    displayName: 'UpdateForm',
    propTypes: {
        isOpen: _proptypes.default.bool,
        itemIds: _proptypes.default.array,
        list: _proptypes.default.object,
        onCancel: _proptypes.default.func
    },
    getDefaultProps () {
        return {
            isOpen: false
        };
    },
    getInitialState () {
        return {
            fields: []
        };
    },
    componentDidMount () {
        this.doFocus();
    },
    componentDidUpdate () {
        this.doFocus();
    },
    doFocus () {
        if (this.refs.focusTarget) {
            (0, _reactdom.findDOMNode)(this.refs.focusTarget).focus();
        }
    },
    getOptions () {
        const { fields } = this.props.list;
        return Object.keys(fields).map((key)=>({
                value: fields[key].path,
                label: fields[key].label
            }));
    },
    getFieldProps (field) {
        const props = Object.assign({}, field);
        props.value = this.state.fields[field.path];
        props.values = this.state.fields;
        props.onChange = this.handleChange;
        props.mode = 'create';
        props.key = field.path;
        return props;
    },
    updateOptions (fields) {
        this.setState({
            fields: fields
        }, this.doFocus);
    },
    handleChange (value) {
        console.log('handleChange:', value);
    },
    handleClose () {
        this.setState({
            fields: []
        });
        this.props.onCancel();
    },
    renderFields () {
        const { list } = this.props;
        const { fields } = this.state;
        const formFields = [];
        let focusRef;
        fields.forEach((fieldOption)=>{
            const field = list.fields[fieldOption.value];
            if (typeof _FieldTypes.Fields[field.type] !== 'function') {
                formFields.push(/*#__PURE__*/ _react.default.createElement(_InvalidFieldType.default, {
                    type: field.type,
                    path: field.path,
                    key: field.path
                }));
                return;
            }
            const fieldProps = this.getFieldProps(field);
            if (!focusRef) {
                fieldProps.ref = focusRef = 'focusTarget';
            }
            formFields.push(/*#__PURE__*/ _react.default.createElement(_FieldTypes.Fields[field.type], fieldProps));
        });
        const fieldsUI = formFields.length ? formFields : /*#__PURE__*/ _react.default.createElement(_index.BlankState, {
            heading: "Choose a field above to begin",
            style: {
                padding: '3em 2em'
            }
        });
        return /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                borderTop: '1px dashed rgba(0,0,0,0.1)',
                marginTop: 20,
                paddingTop: 20
            }
        }, fieldsUI);
    },
    renderForm () {
        const { itemIds, list } = this.props;
        const itemCount = (0, _string.plural)(itemIds, '* ' + list.singular, '* ' + list.plural);
        const formAction = `${Keystone.adminLegacyPath}/${list.path}`;
        return /*#__PURE__*/ _react.default.createElement(_index.Form, {
            layout: "horizontal",
            action: formAction,
            noValidate: "true"
        }, /*#__PURE__*/ _react.default.createElement(_index.Modal.Header, {
            onClose: this.handleClose,
            showCloseButton: true,
            text: 'Update ' + itemCount
        }), /*#__PURE__*/ _react.default.createElement(_index.Modal.Body, null, /*#__PURE__*/ _react.default.createElement(_reactselect.default, {
            key: "field-select",
            multi: true,
            onChange: this.updateOptions,
            options: this.getOptions(),
            ref: "initialFocusTarget",
            value: this.state.fields
        }), this.renderFields()), /*#__PURE__*/ _react.default.createElement(_index.Modal.Footer, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
            color: "primary",
            submit: true
        }, "Update"), /*#__PURE__*/ _react.default.createElement(_index.Button, {
            color: "cancel",
            variant: "link",
            onClick: this.handleClose
        }, "Cancel")));
    },
    render () {
        return /*#__PURE__*/ _react.default.createElement(_index.Modal.Dialog, {
            isOpen: this.props.isOpen,
            onClose: this.handleClose,
            backdropClosesModal: true
        }, this.renderForm());
    }
});
const _default = UpdateForm;

},{"../../../../utils/string.mjs":157,"../../../elemental/index.mjs":73,"../../../shared/InvalidFieldType.mjs":137,"FieldTypes":undefined,"create-react-class":161,"prop-types":258,"react":undefined,"react-dom":undefined,"react-select":undefined}],128:[function(require,module,exports){
// General
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
    get ADD_FILTER () {
        return ADD_FILTER;
    },
    get CLEAR_ALL_FILTERS () {
        return CLEAR_ALL_FILTERS;
    },
    get CLEAR_CACHED_QUERY () {
        return CLEAR_CACHED_QUERY;
    },
    get CLEAR_FILTER () {
        return CLEAR_FILTER;
    },
    get DRAG_MOVE_ITEM () {
        return DRAG_MOVE_ITEM;
    },
    get INITIAL_LIST_LOAD () {
        return INITIAL_LIST_LOAD;
    },
    get ITEMS_LOADED () {
        return ITEMS_LOADED;
    },
    get ITEM_LOADING_ERROR () {
        return ITEM_LOADING_ERROR;
    },
    get LOADING_ITEMS () {
        return LOADING_ITEMS;
    },
    get LOAD_ITEMS () {
        return LOAD_ITEMS;
    },
    get QUERY_HAS_CHANGED () {
        return QUERY_HAS_CHANGED;
    },
    get QUERY_HAS_NOT_CHANGED () {
        return QUERY_HAS_NOT_CHANGED;
    },
    get REPLACE_CACHED_QUERY () {
        return REPLACE_CACHED_QUERY;
    },
    get RESET_DRAG_ITEMS () {
        return RESET_DRAG_ITEMS;
    },
    get RESET_DRAG_PAGE () {
        return RESET_DRAG_PAGE;
    },
    get SELECT_ACTIVE_COLUMNS () {
        return SELECT_ACTIVE_COLUMNS;
    },
    get SELECT_ACTIVE_SORT () {
        return SELECT_ACTIVE_SORT;
    },
    get SELECT_FILTER () {
        return SELECT_FILTER;
    },
    get SELECT_LIST () {
        return SELECT_LIST;
    },
    get SET_ACTIVE_COLUMNS () {
        return SET_ACTIVE_COLUMNS;
    },
    get SET_ACTIVE_LIST () {
        return SET_ACTIVE_LIST;
    },
    get SET_ACTIVE_SEARCH () {
        return SET_ACTIVE_SEARCH;
    },
    get SET_ACTIVE_SORT () {
        return SET_ACTIVE_SORT;
    },
    get SET_CURRENT_PAGE () {
        return SET_CURRENT_PAGE;
    },
    get SET_DRAG_INDEX () {
        return SET_DRAG_INDEX;
    },
    get SET_DRAG_ITEM () {
        return SET_DRAG_ITEM;
    },
    get SET_FILTERS () {
        return SET_FILTERS;
    },
    get SET_ROW_ALERT () {
        return SET_ROW_ALERT;
    }
});
const SELECT_LIST = 'app/List/SELECT_LIST';
const SET_CURRENT_PAGE = 'app/List/SET_CURRENT_PAGE';
const INITIAL_LIST_LOAD = 'app/List/INITIAL_LIST_LOAD';
const LOAD_ITEMS = 'app/List/LOAD_ITEMS';
const LOADING_ITEMS = 'app/List/LOADING_ITEMS';
const ITEMS_LOADED = 'app/List/ITEMS_LOADED';
const ITEM_LOADING_ERROR = 'app/List/ITEM_LOADING_ERROR';
const SELECT_ACTIVE_SORT = 'app/List/SELECT_ACTIVE_SORT';
const SELECT_ACTIVE_COLUMNS = 'app/List/SELECT_ACTIVE_COLUMNS';
const SELECT_FILTER = 'app/List/SELECT_FILTER';
const SET_ACTIVE_SEARCH = 'app/List/SET_ACTIVE_SEARCH';
const SET_ACTIVE_SORT = 'app/List/SET_ACTIVE_SORT';
const SET_ACTIVE_COLUMNS = 'app/List/SET_ACTIVE_COLUMNS';
const SET_ACTIVE_LIST = 'app/List/SET_ACTIVE_LIST';
const QUERY_HAS_CHANGED = 'app/List/QUERY_HAS_CHANGED';
const QUERY_HAS_NOT_CHANGED = 'app/List/QUERY_HAS_NOT_CHANGED';
const REPLACE_CACHED_QUERY = 'app/List/REPLACE_CACHED_QUERY';
const CLEAR_CACHED_QUERY = 'app/List/CLEAR_CACHED_QUERY';
const ADD_FILTER = 'app/List/ADD_FILTER';
const CLEAR_FILTER = 'app/List/CLEAR_FILTER';
const CLEAR_ALL_FILTERS = 'app/List/CLEAR_ALL_FILTERS';
const SET_FILTERS = 'app/List/SET_FILTERS';
const SET_ROW_ALERT = 'app/List/SET_ROW_ALERT';
const RESET_DRAG_PAGE = 'app/List/RESET_DRAG_PAGE';
const RESET_DRAG_ITEMS = 'app/List/RESET_DRAG_ITEMS';
const SET_DRAG_ITEM = 'app/List/SET_DRAG_ITEM';
const SET_DRAG_INDEX = 'app/List/SET_DRAG_INDEX';
const DRAG_MOVE_ITEM = 'app/List/DRAG_MOVE_ITEM';

},{}],129:[function(require,module,exports){
/**
 * The list view is a paginated table of all items in the list. It can show a
 * variety of information about the individual items in columns.
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _numeral = /*#__PURE__*/ _interop_require_default(require("numeral"));
const _reactredux = require("react-redux");
const _index = require("../../elemental/index.mjs");
const _ListFilters = /*#__PURE__*/ _interop_require_default(require("./components/Filtering/ListFilters.mjs"));
const _ListHeaderTitle = /*#__PURE__*/ _interop_require_default(require("./components/ListHeaderTitle.mjs"));
const _ListHeaderToolbar = /*#__PURE__*/ _interop_require_default(require("./components/ListHeaderToolbar.mjs"));
const _ListManagement = /*#__PURE__*/ _interop_require_default(require("./components/ListManagement.mjs"));
const _ConfirmationDialog = /*#__PURE__*/ _interop_require_default(require("../../shared/ConfirmationDialog.mjs"));
const _CreateForm = /*#__PURE__*/ _interop_require_default(require("../../shared/CreateForm.mjs"));
const _FlashMessages = /*#__PURE__*/ _interop_require_default(require("../../shared/FlashMessages.mjs"));
const _ItemsTable = /*#__PURE__*/ _interop_require_default(require("./components/ItemsTable/ItemsTable.mjs"));
const _UpdateForm = /*#__PURE__*/ _interop_require_default(require("./components/UpdateForm.mjs"));
const _string = require("../../../utils/string.mjs");
const _lists = require("../../../utils/lists.mjs");
const _queryParams = require("../../../utils/queryParams.mjs");
const _index1 = require("./actions/index.mjs");
const _actions = require("../Item/actions.mjs");
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
const ESC_KEY_CODE = 27;
const ListView = (0, _createreactclass.default)({
    contextTypes: {
        router: _proptypes.default.object.isRequired
    },
    getInitialState () {
        return {
            confirmationDialog: {
                isOpen: false
            },
            checkedItems: {},
            constrainTableWidth: true,
            manageMode: false,
            showCreateForm: false,
            showUpdateForm: false
        };
    },
    UNSAFE_componentWillMount () {
        // When we directly navigate to a list without coming from another client
        // side routed page before, we need to initialize the list and parse
        // possibly specified query parameters
        this.props.dispatch((0, _index1.selectList)(this.props.params.listId));
        const isNoCreate = this.props.lists.data[this.props.params.listId].nocreate;
        const shouldOpenCreate = this.props.location.search === '?create';
        this.setState({
            showCreateForm: shouldOpenCreate && !isNoCreate || Keystone.createFormErrors
        });
    },
    UNSAFE_componentWillReceiveProps (nextProps) {
        // We've opened a new list from the client side routing, so initialize
        // again with the new list id
        const isReady = this.props.lists.ready && nextProps.lists.ready;
        if (isReady && (0, _queryParams.checkForQueryChange)(nextProps, this.props)) {
            this.props.dispatch((0, _index1.selectList)(nextProps.params.listId));
        }
    },
    componentWillUnmount () {
        this.props.dispatch((0, _index1.clearCachedQuery)());
    },
    // ==============================
    // HEADER
    // ==============================
    // Called when a new item is created
    onCreate (item) {
        // Hide the create form
        this.toggleCreateModal(false);
        // Redirect to newly created item path
        const list = this.props.currentList;
        this.context.router.push(`${Keystone.adminLegacyPath}/${list.path}/${item.id}`);
    },
    createAutocreate () {
        const list = this.props.currentList;
        list.createItem(null, (err, data)=>{
            if (err) {
                // TODO Proper error handling
                alert('Something went wrong, please try again!');
                console.log(err);
            } else {
                this.context.router.push(`${Keystone.adminLegacyPath}/${list.path}/${data.id}`);
            }
        });
    },
    updateSearch (e) {
        this.props.dispatch((0, _index1.setActiveSearch)(e.target.value));
    },
    handleSearchClear () {
        this.props.dispatch((0, _index1.setActiveSearch)(''));
    // TODO re-implement focus when ready
    // findDOMNode(this.refs.listSearchInput).focus();
    },
    handleSearchKey (e) {
        // clear on esc
        if (e.which === ESC_KEY_CODE) {
            this.handleSearchClear();
        }
    },
    handlePageSelect (i) {
        // If the current page index is the same as the index we are intending to pass to redux, bail out.
        if (i === this.props.lists.page.index) return;
        return this.props.dispatch((0, _index1.setCurrentPage)(i));
    },
    toggleManageMode (filter = !this.state.manageMode) {
        this.setState({
            manageMode: filter,
            checkedItems: {}
        });
    },
    toggleUpdateModal (filter = !this.state.showUpdateForm) {
        this.setState({
            showUpdateForm: filter
        });
    },
    massUpdate () {
        // TODO: Implement update multi-item
        console.log('Update ALL the things!');
    },
    massDelete () {
        const { checkedItems } = this.state;
        const list = this.props.currentList;
        const itemCount = (0, _string.plural)(checkedItems, '* ' + list.singular.toLowerCase(), '* ' + list.plural.toLowerCase());
        const itemIds = Object.keys(checkedItems);
        this.setState({
            confirmationDialog: {
                isOpen: true,
                label: 'Delete',
                body: /*#__PURE__*/ _react.default.createElement("div", null, "Are you sure you want to delete ", itemCount, "?", /*#__PURE__*/ _react.default.createElement("br", null), /*#__PURE__*/ _react.default.createElement("br", null), "This cannot be undone."),
                onConfirmation: ()=>{
                    this.props.dispatch((0, _index1.deleteItems)(itemIds));
                    this.toggleManageMode();
                    this.removeConfirmationDialog();
                }
            }
        });
    },
    handleManagementSelect (selection) {
        if (selection === 'all') this.checkAllItems();
        if (selection === 'none') this.uncheckAllTableItems();
        if (selection === 'visible') this.checkAllTableItems();
        return false;
    },
    renderConfirmationDialog () {
        const props = this.state.confirmationDialog;
        return /*#__PURE__*/ _react.default.createElement(_ConfirmationDialog.default, {
            confirmationLabel: props.label,
            isOpen: props.isOpen,
            onCancel: this.removeConfirmationDialog,
            onConfirmation: props.onConfirmation
        }, props.body);
    },
    renderManagement () {
        const { checkedItems, manageMode, selectAllItemsLoading } = this.state;
        const { currentList } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_ListManagement.default, {
            checkedItemCount: Object.keys(checkedItems).length,
            handleDelete: this.massDelete,
            handleSelect: this.handleManagementSelect,
            handleToggle: ()=>this.toggleManageMode(!manageMode),
            isOpen: manageMode,
            itemCount: this.props.items.count,
            itemsPerPage: this.props.lists.page.size,
            nodelete: currentList.nodelete,
            noedit: currentList.noedit,
            selectAllItemsLoading: selectAllItemsLoading
        });
    },
    renderPagination () {
        const items = this.props.items;
        if (this.state.manageMode || !items.count) return;
        const list = this.props.currentList;
        const currentPage = this.props.lists.page.index;
        const pageSize = this.props.lists.page.size;
        if (!pageSize) return null;
        return /*#__PURE__*/ _react.default.createElement(_index.Pagination, {
            currentPage: currentPage,
            onPageSelect: this.handlePageSelect,
            pageSize: pageSize,
            plural: list.plural,
            singular: list.singular,
            style: {
                marginBottom: 0
            },
            total: items.count,
            limit: 10
        });
    },
    renderHeader () {
        const items = this.props.items;
        const { autocreate, nocreate, plural, singular } = this.props.currentList;
        const showingResultSubset = this.props.active.search || this.props.active.filters.length;
        return /*#__PURE__*/ _react.default.createElement(_index.Container, {
            style: {
                paddingTop: '2em'
            }
        }, /*#__PURE__*/ _react.default.createElement(_ListHeaderTitle.default, {
            activeSort: this.props.active.sort,
            availableColumns: this.props.currentList.columns,
            handleSortSelect: this.handleSortSelect,
            title: `
						${showingResultSubset ? 'Showing ' : ''}
						${(0, _numeral.default)(items.count).format()}
						${(0, _string.plural)(items.count, ' ' + singular, ' ' + plural)}
					`
        }), /*#__PURE__*/ _react.default.createElement(_ListHeaderToolbar.default, {
            // common
            dispatch: this.props.dispatch,
            list: _lists.listsByPath[this.props.params.listId],
            // expand
            expandIsActive: !this.state.constrainTableWidth,
            expandOnClick: this.toggleTableWidth,
            // create
            createIsAvailable: !nocreate,
            createListName: singular,
            createOnClick: autocreate ? this.createAutocreate : this.openCreateModal,
            // search
            searchHandleChange: this.updateSearch,
            searchHandleClear: this.handleSearchClear,
            searchHandleKeyup: this.handleSearchKey,
            searchValue: this.props.active.search,
            // filters
            filtersActive: this.props.active.filters,
            filtersAvailable: this.props.currentList.columns.filter((col)=>col.field && col.field.hasFilterMethod || col.type === 'heading'),
            // columns
            columnsActive: this.props.active.columns,
            columnsAvailable: this.props.currentList.columns
        }), /*#__PURE__*/ _react.default.createElement(_ListFilters.default, {
            dispatch: this.props.dispatch,
            filters: this.props.active.filters
        }));
    },
    // ==============================
    // TABLE
    // ==============================
    checkTableItem (item, e) {
        e.preventDefault();
        const newCheckedItems = _object_spread({}, this.state.checkedItems);
        const itemId = item.id;
        if (this.state.checkedItems[itemId]) {
            delete newCheckedItems[itemId];
        } else {
            newCheckedItems[itemId] = true;
        }
        this.setState({
            checkedItems: newCheckedItems
        });
    },
    checkAllTableItems () {
        const checkedItems = {};
        this.props.items.results.forEach((item)=>{
            checkedItems[item.id] = true;
        });
        this.setState({
            checkedItems: checkedItems
        });
    },
    checkAllItems () {
        const checkedItems = _object_spread({}, this.state.checkedItems);
        // Just in case this API call takes a long time, we'll update the select all button with
        // a spinner.
        this.setState({
            selectAllItemsLoading: true
        });
        const self = this;
        this.props.currentList.loadItems({
            expandRelationshipFilters: false,
            filters: {}
        }, function(err, data) {
            data.results.forEach((item)=>{
                checkedItems[item.id] = true;
            });
            self.setState({
                checkedItems: checkedItems,
                selectAllItemsLoading: false
            });
        });
    },
    uncheckAllTableItems () {
        this.setState({
            checkedItems: {}
        });
    },
    deleteTableItem (item, e) {
        if (e.altKey) {
            this.props.dispatch((0, _actions.deleteItem)(item.id));
            return;
        }
        e.preventDefault();
        this.setState({
            confirmationDialog: {
                isOpen: true,
                label: 'Delete',
                body: /*#__PURE__*/ _react.default.createElement("div", null, "Are you sure you want to delete ", /*#__PURE__*/ _react.default.createElement("strong", null, item.name), "?", /*#__PURE__*/ _react.default.createElement("br", null), /*#__PURE__*/ _react.default.createElement("br", null), "This cannot be undone."),
                onConfirmation: ()=>{
                    this.props.dispatch((0, _actions.deleteItem)(item.id));
                    this.removeConfirmationDialog();
                }
            }
        });
    },
    removeConfirmationDialog () {
        this.setState({
            confirmationDialog: {
                isOpen: false
            }
        });
    },
    toggleTableWidth () {
        this.setState({
            constrainTableWidth: !this.state.constrainTableWidth
        });
    },
    // ==============================
    // COMMON
    // ==============================
    handleSortSelect (path, inverted) {
        if (inverted) path = '-' + path;
        this.props.dispatch((0, _index1.setActiveSort)(path));
    },
    toggleCreateModal (visible) {
        this.setState({
            showCreateForm: visible
        });
    },
    openCreateModal () {
        this.toggleCreateModal(true);
    },
    closeCreateModal () {
        this.toggleCreateModal(false);
    },
    showBlankState () {
        return !this.props.loading && !this.props.items.results.length && !this.props.active.search && !this.props.active.filters.length;
    },
    renderBlankState () {
        const { currentList } = this.props;
        if (!this.showBlankState()) return null;
        // create and nav directly to the item view, or open the create modal
        const onClick = currentList.autocreate ? this.createAutocreate : this.openCreateModal;
        // display the button if create allowed
        const button = !currentList.nocreate ? /*#__PURE__*/ _react.default.createElement(_index.GlyphButton, {
            color: "success",
            glyph: "plus",
            position: "left",
            onClick: onClick,
            "data-e2e-list-create-button": "no-results"
        }, "Create ", currentList.singular) : null;
        return /*#__PURE__*/ _react.default.createElement(_index.Container, null, this.props.error ? /*#__PURE__*/ _react.default.createElement(_FlashMessages.default, {
            messages: {
                error: [
                    {
                        title: "There is a problem with the network, we're trying to reconnect..."
                    }
                ]
            }
        }) : null, /*#__PURE__*/ _react.default.createElement(_index.BlankState, {
            heading: `No ${this.props.currentList.plural.toLowerCase()} found...`,
            style: {
                marginTop: 40
            }
        }, button));
    },
    renderActiveState () {
        if (this.showBlankState()) return null;
        const containerStyle = {
            transition: 'max-width 160ms ease-out',
            msTransition: 'max-width 160ms ease-out',
            MozTransition: 'max-width 160ms ease-out',
            WebkitTransition: 'max-width 160ms ease-out'
        };
        if (!this.state.constrainTableWidth) {
            containerStyle.maxWidth = '100%';
        }
        return /*#__PURE__*/ _react.default.createElement("div", null, this.renderHeader(), /*#__PURE__*/ _react.default.createElement(_index.Container, null, /*#__PURE__*/ _react.default.createElement("div", {
            style: {
                height: 35,
                marginBottom: '1em',
                marginTop: '1em'
            }
        }, this.renderManagement(), this.renderPagination(), /*#__PURE__*/ _react.default.createElement("span", {
            style: {
                clear: 'both',
                display: 'table'
            }
        }))), /*#__PURE__*/ _react.default.createElement(_index.Container, {
            style: containerStyle
        }, this.props.error ? /*#__PURE__*/ _react.default.createElement(_FlashMessages.default, {
            messages: {
                error: [
                    {
                        title: "There is a problem with the network, we're trying to reconnect.."
                    }
                ]
            }
        }) : null, this.props.loading ? /*#__PURE__*/ _react.default.createElement(_index.Center, {
            height: "50vh"
        }, /*#__PURE__*/ _react.default.createElement(_index.Spinner, null)) : /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement(_ItemsTable.default, {
            activeSort: this.props.active.sort,
            checkedItems: this.state.checkedItems,
            checkTableItem: this.checkTableItem,
            columns: this.props.active.columns,
            deleteTableItem: this.deleteTableItem,
            handleSortSelect: this.handleSortSelect,
            items: this.props.items,
            list: this.props.currentList,
            manageMode: this.state.manageMode,
            rowAlert: this.props.rowAlert,
            currentPage: this.props.lists.page.index,
            pageSize: this.props.lists.page.size,
            drag: this.props.lists.drag,
            dispatch: this.props.dispatch
        }), this.renderNoSearchResults())));
    },
    renderNoSearchResults () {
        if (this.props.items.results.length) return null;
        let matching = this.props.active.search;
        if (this.props.active.filters.length) {
            matching += (matching ? ' and ' : '') + (0, _string.plural)(this.props.active.filters.length, '* filter', '* filters');
        }
        matching = matching ? ' found matching ' + matching : '.';
        return /*#__PURE__*/ _react.default.createElement(_index.BlankState, {
            style: {
                marginTop: 20,
                marginBottom: 20
            }
        }, /*#__PURE__*/ _react.default.createElement(_index.Glyph, {
            name: "search",
            size: "medium",
            style: {
                marginBottom: 20
            }
        }), /*#__PURE__*/ _react.default.createElement("h2", {
            style: {
                color: 'inherit'
            }
        }, "No ", this.props.currentList.plural.toLowerCase(), matching));
    },
    render () {
        if (!this.props.ready) {
            return /*#__PURE__*/ _react.default.createElement(_index.Center, {
                height: "50vh",
                "data-screen-id": "list"
            }, /*#__PURE__*/ _react.default.createElement(_index.Spinner, null));
        }
        return /*#__PURE__*/ _react.default.createElement("div", {
            "data-screen-id": "list"
        }, this.renderBlankState(), this.renderActiveState(), /*#__PURE__*/ _react.default.createElement(_CreateForm.default, {
            err: Keystone.createFormErrors,
            isOpen: this.state.showCreateForm,
            list: this.props.currentList,
            onCancel: this.closeCreateModal,
            onCreate: this.onCreate
        }), /*#__PURE__*/ _react.default.createElement(_UpdateForm.default, {
            isOpen: this.state.showUpdateForm,
            itemIds: Object.keys(this.state.checkedItems),
            list: this.props.currentList,
            onCancel: ()=>this.toggleUpdateModal(false)
        }), this.renderConfirmationDialog());
    },
    displayName: "ListView"
});
const _default = (0, _reactredux.connect)((state)=>{
    return {
        lists: state.lists,
        loading: state.lists.loading,
        error: state.lists.error,
        currentList: state.lists.currentList,
        items: state.lists.items,
        page: state.lists.page,
        ready: state.lists.ready,
        rowAlert: state.lists.rowAlert,
        active: state.active
    };
})(ListView);

},{"../../../utils/lists.mjs":155,"../../../utils/queryParams.mjs":156,"../../../utils/string.mjs":157,"../../elemental/index.mjs":73,"../../shared/ConfirmationDialog.mjs":133,"../../shared/CreateForm.mjs":134,"../../shared/FlashMessages.mjs":136,"../Item/actions.mjs":87,"./actions/index.mjs":106,"./components/Filtering/ListFilters.mjs":109,"./components/ItemsTable/ItemsTable.mjs":113,"./components/ListHeaderTitle.mjs":123,"./components/ListHeaderToolbar.mjs":124,"./components/ListManagement.mjs":125,"./components/UpdateForm.mjs":127,"create-react-class":161,"numeral":undefined,"prop-types":258,"react":undefined,"react-redux":undefined}],130:[function(require,module,exports){
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
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _constants = require("../constants.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const initialState = {
    columns: [],
    filters: [],
    search: '',
    sort: {
        input: '',
        isDefaultSort: false,
        paths: [],
        rawInput: ''
    },
    cachedQuery: {}
};
/**
 * Manage the active state
 * @param {object} state - Current active state; defaults to initialState.
 * @param {object} action - Dispatched Redux action with a `type` property.
 * @returns {object} Next active state.
 */ function active(state = initialState, action) {
    switch(action.type){
        case _constants.SET_ACTIVE_LIST:
            return Object.assign({}, state, {
                id: action.id,
                columns: action.list.expandColumns(action.list.defaultColumns),
                filters: [],
                search: '',
                sort: action.list.expandSort(action.list.defaultSort)
            });
        case _constants.SET_ACTIVE_SEARCH:
            return Object.assign({}, state, {
                search: action.searchString
            });
        case _constants.SET_ACTIVE_SORT:
            return Object.assign({}, state, {
                sort: action.sort
            });
        case _constants.SET_ACTIVE_COLUMNS:
            return Object.assign({}, state, {
                columns: action.columns
            });
        case _constants.ADD_FILTER:
            return Object.assign({}, state, {
                // Override existing filter with field path,
                // otherwise add to filters array
                filters: _lodash.default.unionWith([
                    action.filter
                ], state.filters, (stateFilter, actionFilter)=>{
                    return stateFilter.field.path === actionFilter.field.path;
                })
            });
        case _constants.SET_FILTERS:
            return Object.assign({}, state, {
                filters: action.filters
            });
        case _constants.CLEAR_FILTER:
            const newFilters = _lodash.default.filter(state.filters, (filter)=>{
                return filter.field.path !== action.path;
            });
            return Object.assign({}, state, {
                filters: newFilters
            });
        case _constants.CLEAR_ALL_FILTERS:
            return Object.assign({}, state, {
                filters: []
            });
        case _constants.QUERY_HAS_CHANGED:
            const { search, sort, filters, columns } = action.parsedQuery;
            return Object.assign({}, state, {
                search,
                sort: sort || initialState.sort,
                filters: filters || initialState.filters,
                columns: columns || initialState.columns
            });
        case _constants.REPLACE_CACHED_QUERY:
            return Object.assign({}, state, {
                cachedQuery: action.cachedQuery
            });
        case _constants.CLEAR_CACHED_QUERY:
            return Object.assign({}, state, {
                cachedQuery: {}
            });
        default:
            return state;
    }
}
const _default = active;

},{"../constants.mjs":128,"lodash":undefined}],131:[function(require,module,exports){
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
const _List = /*#__PURE__*/ _interop_require_default(require("../../../../utils/List.mjs"));
const _constants = require("../constants.mjs");
const _constants1 = require("../../Item/constants.mjs");
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
const initialState = {
    loadingRef: null,
    loadCounter: 0,
    currentList: null,
    loading: false,
    ready: false,
    error: null,
    data: {},
    items: {
        results: [],
        count: null
    },
    page: {
        size: null,
        index: undefined
    },
    rowAlert: {
        success: false,
        fail: false
    },
    drag: {
        page: 1,
        item: false,
        clonedItems: false,
        index: false
    }
};
// Rekey the lists in the state with their paths for easier matching with the
// URL parameters
const initialLists = Keystone.lists;
for(const name in initialLists){
    if (({}).hasOwnProperty.call(initialLists, name)) {
        const currentList = initialLists[name];
        initialState.data[currentList.path] = new _List.default(currentList);
        initialState.data[currentList.path].items = {
            results: [],
            count: null
        };
    }
}
/**
 * Manage all lists
 * @param {object} state - Current lists state; defaults to initialState.
 * @param {object} action - Dispatched Redux action with a `type` property.
 * @returns {object} Next lists state.
 */ function lists(state = initialState, action) {
    switch(action.type){
        case _constants.SELECT_LIST:
            const list = state.data[action.id];
            list.id = action.id;
            let items = {
                results: [],
                count: null
            };
            // If we have cached items, instead of resetting state.items put the
            // cached items in the state
            if (list.items.count !== null) {
                items = list.items;
            }
            return Object.assign({}, state, {
                currentList: list,
                ready: false,
                items: items,
                page: _object_spread_props(_object_spread({}, state.page), {
                    index: 1,
                    size: list.perPage
                })
            });
        case _constants.LOAD_ITEMS:
            let loading = true;
            let ready = state.ready;
            // If we have cached items ready, don't show a loading indicator
            // while we fetch the new items in the background
            if (state.items.count !== null && loading === false) {
                loading = false;
                ready = true;
            }
            return Object.assign({}, state, {
                loading,
                ready,
                loadCounter: action.loadCounter
            });
        case _constants.ITEMS_LOADED:
            // Cache the items in state.data so we can show the already existing
            // items on the next round trip while fetching the new items in the
            // background
            const cachedList = state.data[state.currentList.id];
            cachedList.items = action.items;
            return Object.assign({}, state, {
                loading: false,
                ready: true,
                error: null,
                items: action.items,
                data: _object_spread_props(_object_spread({}, state.data), {
                    [state.currentList.id]: cachedList
                }),
                loadCounter: 0
            });
        case _constants.ITEM_LOADING_ERROR:
            return Object.assign({}, state, {
                loading: true,
                ready: true,
                error: action.err,
                loadCounter: 0
            });
        case _constants1.DELETE_ITEM:
            const newItems = {
                results: state.items.results.filter((el)=>el.id !== action.id),
                count: state.items.count - 1
            };
            const newCachedList = state.data[state.currentList.id];
            newCachedList.items = newItems;
            return Object.assign({}, state, {
                items: newItems,
                data: _object_spread_props(_object_spread({}, state.data), {
                    [state.currentList.id]: newCachedList
                })
            });
        case _constants.SET_CURRENT_PAGE:
            console.log(action.index);
            return Object.assign({}, state, {
                loading: true,
                page: _object_spread_props(_object_spread({}, state.page), {
                    index: action.index
                })
            });
        case _constants.SET_ROW_ALERT:
            if (action.data.reset === true) {
                return Object.assign({}, state, {
                    rowAlert: {
                        success: false,
                        fail: false
                    }
                });
            }
            return Object.assign({}, state, {
                rowAlert: _object_spread({}, state.rowAlert, action.data)
            });
        case _constants.RESET_DRAG_PAGE:
            return Object.assign({}, state, {
                drag: _object_spread_props(_object_spread({}, state.drag), {
                    page: state.page.index
                })
            });
        case _constants.RESET_DRAG_ITEMS:
            return Object.assign({}, state, {
                drag: _object_spread_props(_object_spread({}, state.drag), {
                    clonedItems: state.items
                })
            });
        case _constants.SET_DRAG_ITEM:
            return Object.assign({}, state, {
                drag: _object_spread_props(_object_spread({}, state.drag), {
                    item: action.item
                })
            });
        case _constants.SET_DRAG_INDEX:
            return Object.assign({}, state, {
                drag: _object_spread_props(_object_spread({}, state.drag), {
                    index: action.index
                })
            });
        case _constants.QUERY_HAS_CHANGED:
            const index = parseInt(action.parsedQuery.currentPage) || 1;
            return Object.assign({}, state, {
                loading: true,
                page: _object_spread_props(_object_spread({}, state.page), {
                    index
                })
            });
        case _constants.DRAG_MOVE_ITEM:
            // TODO: option to use manageMode for sortOrder
            const currentItems = state.items.results;
            const item = currentItems[action.prevIndex];
            // Remove item at prevIndex from array and save that array in
            // itemsWithoutItem
            const itemsWithoutItem = currentItems.slice(0, action.prevIndex).concat(currentItems.slice(action.prevIndex + 1, currentItems.length));
            // Add item back in at new index
            itemsWithoutItem.splice(action.newIndex, 0, item);
            return Object.assign({}, state, {
                items: _object_spread_props(_object_spread({}, state.items), {
                    results: itemsWithoutItem
                })
            });
        default:
            return state;
    }
}
const _default = lists;

},{"../../../../utils/List.mjs":151,"../../Item/constants.mjs":101,"../constants.mjs":128}],132:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
 */ const AlertMessages = (0, _createreactclass.default)({
    displayName: 'AlertMessages',
    propTypes: {
        alerts: _proptypes.default.shape({
            error: _proptypes.default.object,
            success: _proptypes.default.object
        })
    },
    getDefaultProps () {
        return {
            alerts: {}
        };
    },
    renderValidationErrors () {
        let errors = this.props.alerts.error.detail;
        if (!errors) {
            return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
                color: "danger"
            }, (0, _string.upcase)(this.props.alerts.error.error));
        }
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

},{"../../utils/string.mjs":157,"../elemental/index.mjs":73,"create-react-class":161,"prop-types":258,"react":undefined}],133:[function(require,module,exports){
/**
 * Renders a confirmation dialog modal
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../elemental/index.mjs");
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
 * A modal dialog that asks the user to confirm or cancel an action.
 *
 * Renders a Modal.Dialog containing either raw HTML or React children as the
 * body, plus a footer with a confirm button and a cancel button. Passing both
 * `children` and `html` at the same time is an error; only one should be used.
 * @param {object}        props                Component props.
 * @param {string}        props.cancelLabel       Label for the cancel button.
 * @param {React.Node}    props.children          React child nodes to render as the body.
 * @param {string}        props.confirmationLabel Label for the confirm button.
 * @param {string}        props.confirmationType  Button color variant for the confirm button
 *                                                ('danger', 'primary', 'success', or 'warning').
 * @param {string}        props.html              Raw HTML string to render as the body
 *                                                (mutually exclusive with children).
 * @param {boolean}       props.isOpen            Whether the dialog is currently visible.
 * @param {function()}    props.onCancel          Callback invoked when the user cancels.
 * @param {function()}    props.onConfirmation    Callback invoked when the user confirms.
 * @returns {React.Element} The rendered confirmation dialog.
 */ function ConfirmationDialog(_0) {
    let { cancelLabel, children, confirmationLabel, confirmationType, html, isOpen, onCancel, onConfirmation } = _0, props = _object_without_properties(_0, [
        "cancelLabel",
        "children",
        "confirmationLabel",
        "confirmationType",
        "html",
        "isOpen",
        "onCancel",
        "onConfirmation"
    ]);
    // Property Violation
    if (children && html) {
        console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
    }
    return /*#__PURE__*/ _react.default.createElement(_index.Modal.Dialog, {
        backdropClosesModal: true,
        "data-confirm-dialog": true,
        isOpen: isOpen,
        onClose: onCancel,
        width: 400
    }, html ? /*#__PURE__*/ _react.default.createElement(_index.Modal.Body, _object_spread_props(_object_spread({}, props), {
        dangerouslySetInnerHTML: {
            __html: html
        }
    })) : /*#__PURE__*/ _react.default.createElement(_index.Modal.Body, props, children), /*#__PURE__*/ _react.default.createElement(_index.Modal.Footer, null, /*#__PURE__*/ _react.default.createElement(_index.Button, {
        autoFocus: true,
        size: "small",
        "data-button-type": "confirm",
        "data-confirm-delete": confirmationLabel === 'Delete' ? true : undefined,
        color: confirmationType,
        onClick: onConfirmation
    }, confirmationLabel), /*#__PURE__*/ _react.default.createElement(_index.Button, {
        size: "small",
        "data-button-type": "cancel",
        variant: "link",
        color: "cancel",
        onClick: onCancel
    }, cancelLabel)));
}
ConfirmationDialog.propTypes = {
    body: _proptypes.default.string,
    cancelLabel: _proptypes.default.string,
    confirmationLabel: _proptypes.default.string,
    confirmationType: _proptypes.default.oneOf([
        'danger',
        'primary',
        'success',
        'warning'
    ]),
    onCancel: _proptypes.default.func,
    onConfirmation: _proptypes.default.func
};
ConfirmationDialog.defaultProps = {
    cancelLabel: 'Cancel',
    confirmationLabel: 'Okay',
    confirmationType: 'danger',
    isOpen: false
};
const _default = ConfirmationDialog;

},{"../elemental/index.mjs":73,"prop-types":258,"react":undefined}],134:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _AlertMessages = /*#__PURE__*/ _interop_require_default(require("./AlertMessages.mjs"));
const _FieldTypes = require("FieldTypes");
const _InvalidFieldType = /*#__PURE__*/ _interop_require_default(require("./InvalidFieldType.mjs"));
const _index = require("../elemental/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CreateForm = (0, _createreactclass.default)({
    displayName: 'CreateForm',
    propTypes: {
        err: _proptypes.default.object,
        isOpen: _proptypes.default.bool,
        list: _proptypes.default.object,
        onCancel: _proptypes.default.func,
        onCreate: _proptypes.default.func
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
            backdropClosesModal: false
        }, this.renderForm());
    }
});
const _default = CreateForm;

},{"../elemental/index.mjs":73,"./AlertMessages.mjs":132,"./InvalidFieldType.mjs":137,"FieldTypes":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],135:[function(require,module,exports){
/**
 * A single flash message component. Used by FlashMessages.js
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _index = require("../elemental/index.mjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FlashMessage = (0, _createreactclass.default)({
    propTypes: {
        message: _proptypes.default.oneOfType([
            _proptypes.default.object,
            _proptypes.default.string
        ]).isRequired,
        type: _proptypes.default.string
    },
    // Render the message
    renderMessage (message) {
        // If the message is only a string, render the string
        if (typeof message === 'string') {
            return /*#__PURE__*/ _react.default.createElement("span", null, message);
        }
        // Get the title and the detail of the message
        const title = message.title ? /*#__PURE__*/ _react.default.createElement("h4", null, message.title) : null;
        const detail = message.detail ? /*#__PURE__*/ _react.default.createElement("p", null, message.detail) : null;
        // If the message has a list attached, render a <ul>
        const list = message.list ? /*#__PURE__*/ _react.default.createElement("ul", {
            style: {
                marginBottom: 0
            }
        }, message.list.map((item, i)=>/*#__PURE__*/ _react.default.createElement("li", {
                key: `i${i}`
            }, item))) : null;
        return /*#__PURE__*/ _react.default.createElement("span", null, title, detail, list);
    },
    render () {
        const { message, type } = this.props;
        return /*#__PURE__*/ _react.default.createElement(_index.Alert, {
            color: type
        }, this.renderMessage(message));
    },
    displayName: "FlashMessage"
});
const _default = FlashMessage;

},{"../elemental/index.mjs":73,"create-react-class":161,"prop-types":258,"react":undefined}],136:[function(require,module,exports){
/**
 * Render a few flash messages, e.g. errors, success messages, warnings,...
 *
 * Use like this:
 * <FlashMessages
 *   messages={{
 *	   error: [{
 *	     title: 'There is a network problem',
 *	     detail: 'Please try again later...',
 *	   }],
 *   }}
 * />
 *
 * Instead of error, it can also be hilight, info, success or warning
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _lodash = /*#__PURE__*/ _interop_require_default(require("lodash"));
const _FlashMessage = /*#__PURE__*/ _interop_require_default(require("./FlashMessage.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const FlashMessages = (0, _createreactclass.default)({
    displayName: 'FlashMessages',
    propTypes: {
        messages: _proptypes.default.oneOfType([
            _proptypes.default.bool,
            _proptypes.default.shape({
                error: _proptypes.default.array,
                hilight: _proptypes.default.array,
                info: _proptypes.default.array,
                success: _proptypes.default.array,
                warning: _proptypes.default.array
            })
        ])
    },
    // Render messages by their type
    renderMessages (messages, type) {
        if (!messages || !messages.length) return null;
        return messages.map((message, i)=>{
            return /*#__PURE__*/ _react.default.createElement(_FlashMessage.default, {
                message: message,
                type: type,
                key: `i${i}`
            });
        });
    },
    // Render the individual messages based on their type
    renderTypes (types) {
        return Object.keys(types).map((type)=>this.renderMessages(types[type], type));
    },
    render () {
        if (!this.props.messages) return null;
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: "flash-messages"
        }, _lodash.default.isPlainObject(this.props.messages) && this.renderTypes(this.props.messages));
    }
});
const _default = FlashMessages;

},{"./FlashMessage.mjs":135,"create-react-class":161,"lodash":undefined,"prop-types":258,"react":undefined}],137:[function(require,module,exports){
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
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
    path: _proptypes.default.string,
    type: _proptypes.default.string
};
const _default = InvalidFieldType;

},{"prop-types":258,"react":undefined}],138:[function(require,module,exports){
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

},{"../../theme.mjs":150,"../../utils/color.mjs":152,"glamor":undefined,"react":undefined}],139:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const PopoutBody = (0, _createreactclass.default)({
    displayName: 'PopoutBody',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string,
        scrollable: _proptypes.default.bool
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

},{"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],140:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const BUTTON_BASE_CLASSNAME = 'Popout__footer__button Popout__footer__button--';
const PopoutFooter = (0, _createreactclass.default)({
    displayName: 'PopoutFooter',
    propTypes: {
        children: _proptypes.default.node,
        primaryButtonAction: _proptypes.default.func,
        primaryButtonIsSubmit: _proptypes.default.bool,
        primaryButtonLabel: _proptypes.default.string,
        secondaryButtonAction: _proptypes.default.func,
        secondaryButtonLabel: _proptypes.default.string
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

},{"create-react-class":161,"prop-types":258,"react":undefined}],141:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _CSSTransitionGroup = /*#__PURE__*/ _interop_require_default(require("react-transition-group/CSSTransitionGroup"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PopoutHeader = (0, _createreactclass.default)({
    displayName: 'PopoutHeader',
    propTypes: {
        leftAction: _proptypes.default.func,
        leftIcon: _proptypes.default.string,
        title: _proptypes.default.string.isRequired,
        transitionDirection: _proptypes.default.oneOf([
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
        }, /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
            transitionName: "Popout__header__button",
            transitionEnterTimeout: 200,
            transitionLeaveTimeout: 200
        }, headerButton), /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
            transitionName: 'Popout__pane-' + this.props.transitionDirection,
            transitionEnterTimeout: 360,
            transitionLeaveTimeout: 360
        }, headerTitle));
    }
});
const _default = PopoutHeader;

},{"create-react-class":161,"prop-types":258,"react":undefined,"react-transition-group/CSSTransitionGroup":undefined}],142:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const PopoutList = (0, _createreactclass.default)({
    displayName: 'PopoutList',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string
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

},{"./PopoutListHeading.mjs":143,"./PopoutListItem.mjs":144,"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],143:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const PopoutListHeading = (0, _createreactclass.default)({
    displayName: 'PopoutListHeading',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string
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

},{"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],144:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const PopoutListItem = (0, _createreactclass.default)({
    displayName: 'PopoutListItem',
    propTypes: {
        icon: _proptypes.default.string,
        iconHover: _proptypes.default.string,
        isSelected: _proptypes.default.bool,
        label: _proptypes.default.string.isRequired,
        onClick: _proptypes.default.func
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

},{"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],145:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
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
const PopoutPane = (0, _createreactclass.default)({
    displayName: 'PopoutPane',
    propTypes: {
        children: _proptypes.default.node.isRequired,
        className: _proptypes.default.string,
        onLayout: _proptypes.default.func
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

},{"classnames":undefined,"create-react-class":161,"prop-types":258,"react":undefined}],146:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _proptypes = /*#__PURE__*/ _interop_require_default(require("prop-types"));
const _Portal = /*#__PURE__*/ _interop_require_default(require("../Portal.mjs"));
const _CSSTransitionGroup = /*#__PURE__*/ _interop_require_default(require("react-transition-group/CSSTransitionGroup"));
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
const Popout = (0, _createreactclass.default)({
    displayName: 'Popout',
    propTypes: {
        isOpen: _proptypes.default.bool,
        onCancel: _proptypes.default.func,
        onSubmit: _proptypes.default.func,
        relativeToID: _proptypes.default.string.isRequired,
        width: _proptypes.default.number
    },
    getDefaultProps () {
        return {
            width: 320
        };
    },
    getInitialState () {
        return {};
    },
    UNSAFE_componentWillReceiveProps (nextProps) {
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
        }, /*#__PURE__*/ _react.default.createElement(_CSSTransitionGroup.default, {
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

},{"../Portal.mjs":147,"./PopoutBody.mjs":139,"./PopoutFooter.mjs":140,"./PopoutHeader.mjs":141,"./PopoutPane.mjs":145,"create-react-class":161,"prop-types":258,"react":undefined,"react-transition-group/CSSTransitionGroup":undefined}],147:[function(require,module,exports){
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
const _createreactclass = /*#__PURE__*/ _interop_require_default(require("create-react-class"));
const _reactdom = /*#__PURE__*/ _interop_require_default(require("react-dom"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = (0, _createreactclass.default)({
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

},{"create-react-class":161,"react":undefined,"react-dom":undefined}],148:[function(require,module,exports){
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
const _reactrouterredux = require("react-router-redux");
const _redux = require("redux");
const _reactrouter = require("react-router");
const _reduxthunk = /*#__PURE__*/ _interop_require_default(require("redux-thunk"));
const _reduxsaga = /*#__PURE__*/ _interop_require_default(require("redux-saga"));
const _main = /*#__PURE__*/ _interop_require_default(require("./screens/List/reducers/main.mjs"));
const _active = /*#__PURE__*/ _interop_require_default(require("./screens/List/reducers/active.mjs"));
const _reducer = /*#__PURE__*/ _interop_require_default(require("./screens/Item/reducer.mjs"));
const _reducer1 = /*#__PURE__*/ _interop_require_default(require("./screens/Home/reducer.mjs"));
const _index = /*#__PURE__*/ _interop_require_default(require("./sagas/index.mjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Combine the reducers to one state
const reducers = (0, _redux.combineReducers)({
    lists: _main.default,
    active: _active.default,
    item: _reducer.default,
    home: _reducer1.default,
    routing: _reactrouterredux.routerReducer
});
const sagaMiddleware = (0, _reduxsaga.default)();
// Create the store
const store = (0, _redux.createStore)(reducers, (0, _redux.compose)((0, _redux.applyMiddleware)(// Support thunked actions and react-router-redux
_reduxthunk.default, (0, _reactrouterredux.routerMiddleware)(_reactrouter.browserHistory), sagaMiddleware), // Support the Chrome DevTools extension
window.devToolsExtension ? window.devToolsExtension() : (f)=>f));
sagaMiddleware.run(_index.default);
const _default = store;

},{"./sagas/index.mjs":77,"./screens/Home/reducer.mjs":85,"./screens/Item/reducer.mjs":103,"./screens/List/reducers/active.mjs":130,"./screens/List/reducers/main.mjs":131,"react-router":undefined,"react-router-redux":undefined,"redux":undefined,"redux-saga":undefined,"redux-thunk":undefined}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
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

},{"./utils/color.mjs":152}],151:[function(require,module,exports){
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

},{"../../../lib/list/listToArray.mjs":159,"qs":undefined,"xhr":undefined}],152:[function(require,module,exports){
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

},{}],153:[function(require,module,exports){
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

},{}],154:[function(require,module,exports){
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

},{}],155:[function(require,module,exports){
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

},{"./List.mjs":151}],156:[function(require,module,exports){
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
    get checkForQueryChange () {
        return checkForQueryChange;
    },
    get createPageQueryParams () {
        return createPageQueryParams;
    },
    get createSortQueryParams () {
        return createSortQueryParams;
    },
    get normaliseValue () {
        return normaliseValue;
    },
    get parametizeFilters () {
        return parametizeFilters;
    },
    get stringifyColumns () {
        return stringifyColumns;
    },
    get updateQueryParams () {
        return updateQueryParams;
    }
});
const _isEqual = /*#__PURE__*/ _interop_require_default(require("lodash/isEqual"));
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
function checkForQueryChange(nextProps, thisProps) {
    const { query } = nextProps.location;
    const { cachedQuery } = nextProps.active;
    const parsedQuery = Object.assign({}, query, {
        page: parseInt(query.page)
    });
    if (!parsedQuery.page) delete parsedQuery.page;
    const { search: _sq } = parsedQuery, attenuatedQuery = _object_without_properties(parsedQuery, [
        "search"
    ]);
    const { search: _sc } = cachedQuery, attenuatedCache = _object_without_properties(cachedQuery, [
        "search"
    ]);
    if (nextProps.location.pathname !== thisProps.location.pathname) return true;
    if (!(0, _isEqual.default)(attenuatedQuery, attenuatedCache)) return true;
    return false;
}
function normaliseValue(value, benchmark) {
    if (value === benchmark) return void 0;
    return value;
}
function createSortQueryParams(rawInput, defaultSort) {
    return normaliseValue(rawInput, defaultSort);
}
function createPageQueryParams(page, defaultValue) {
    return normaliseValue(page, defaultValue);
}
function updateQueryParams(params, location) {
    if (!location) return;
    const newParams = Object.assign({}, location.query);
    // Stringify nested objects inside the parameters
    Object.keys(params).forEach((i)=>{
        if (params[i]) {
            newParams[i] = params[i];
            if (typeof newParams[i] === 'object') {
                newParams[i] = JSON.stringify(newParams[i]);
            }
        } else {
            delete newParams[i];
        }
    });
    return newParams;
}
function stringifyColumns(columns, defaultColumnPaths) {
    if (!columns) {
        return;
    }
    // Turns [{ path: 'someColumn' }, { path: 'someOtherColumn' }]
    // into ['someColumn', 'someOtherColumn']
    let columnString = columns.map((column)=>column.path);
    // Turns that array into 'someColumn,someOtherColumn'
    if (Array.isArray(columnString)) columnString = columnString.join(',');
    // If that is the same as the default columns, don't set the query param
    if (columnString === defaultColumnPaths) columnString = undefined;
    return columnString;
}
function parametizeFilters(filterArray) {
    if (!filterArray || filterArray.length === 0) {
        return;
    }
    return filterArray.map((filter)=>{
        return Object.assign({
            path: filter.field.path
        }, filter.value);
    });
}

},{"lodash/isEqual":243}],157:[function(require,module,exports){
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

},{"lodash":undefined}],158:[function(require,module,exports){
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

},{}],159:[function(require,module,exports){
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

},{}],160:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

// -- Inlined from fbjs --

var emptyObject = {};

if ("production" !== 'production') {
  Object.freeze(emptyObject);
}

var validateFormat = function validateFormat(format) {};

if ("production" !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function _invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var warning = function(){};

if ("production" !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

// /-- Inlined from fbjs --

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if ("production" !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if ("production" !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if ("production" !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if ("production" !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if ("production" !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if ("production" !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if ("production" !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if ("production" !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        _invariant(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if ("production" !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if ("production" !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if ("production" !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if ("production" !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if ("production" !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if ("production" !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if ("production" !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if ("production" !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
          'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

},{"object-assign":253}],161:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var React = require('react');
var factory = require('./factory');

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);

},{"./factory":160,"react":undefined}],162:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":197,"./_root":228}],163:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":203,"./_hashDelete":204,"./_hashGet":205,"./_hashHas":206,"./_hashSet":207}],164:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":212,"./_listCacheDelete":213,"./_listCacheGet":214,"./_listCacheHas":215,"./_listCacheSet":216}],165:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":197,"./_root":228}],166:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":217,"./_mapCacheDelete":218,"./_mapCacheGet":219,"./_mapCacheHas":220,"./_mapCacheSet":221}],167:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":197,"./_root":228}],168:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":197,"./_root":228}],169:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":166,"./_setCacheAdd":229,"./_setCacheHas":230}],170:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":164,"./_stackClear":232,"./_stackDelete":233,"./_stackGet":234,"./_stackHas":235,"./_stackSet":236}],171:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":228}],172:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":228}],173:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":197,"./_root":228}],174:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],175:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":187,"./_isIndex":208,"./isArguments":239,"./isArray":240,"./isBuffer":242,"./isTypedArray":249}],176:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],177:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],178:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":238}],179:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":176,"./isArray":240}],180:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":171,"./_getRawTag":199,"./_objectToString":226}],181:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":180,"./isObjectLike":247}],182:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":183,"./isObjectLike":247}],183:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":170,"./_equalArrays":191,"./_equalByTag":192,"./_equalObjects":193,"./_getTag":201,"./isArray":240,"./isBuffer":242,"./isTypedArray":249}],184:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":210,"./_toSource":237,"./isFunction":244,"./isObject":246}],185:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":180,"./isLength":245,"./isObjectLike":247}],186:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":211,"./_nativeKeys":224}],187:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],188:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],189:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],190:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":228}],191:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":169,"./_arraySome":177,"./_cacheHas":189}],192:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":171,"./_Uint8Array":172,"./_equalArrays":191,"./_mapToArray":222,"./_setToArray":231,"./eq":238}],193:[function(require,module,exports){
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_getAllKeys":195}],194:[function(require,module,exports){
(function (global){(function (){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],195:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":179,"./_getSymbols":200,"./keys":250}],196:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":209}],197:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":184,"./_getValue":202}],198:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":227}],199:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":171}],200:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":174,"./stubArray":251}],201:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":162,"./_Map":165,"./_Promise":167,"./_Set":168,"./_WeakMap":173,"./_baseGetTag":180,"./_toSource":237}],202:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],203:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":223}],204:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],205:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":223}],206:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":223}],207:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":223}],208:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],209:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],210:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":190}],211:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],212:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],213:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":178}],214:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":178}],215:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":178}],216:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":178}],217:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":163,"./_ListCache":164,"./_Map":165}],218:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":196}],219:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":196}],220:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":196}],221:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":196}],222:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],223:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":197}],224:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":227}],225:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":194}],226:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],227:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],228:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":194}],229:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],230:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],231:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],232:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":164}],233:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],234:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],235:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],236:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":164,"./_Map":165,"./_MapCache":166}],237:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],238:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],239:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":181,"./isObjectLike":247}],240:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],241:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":244,"./isLength":245}],242:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":228,"./stubFalse":252}],243:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

},{"./_baseIsEqual":182}],244:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":180,"./isObject":246}],245:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],246:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],247:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],248:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":180,"./_getPrototype":198,"./isObjectLike":247}],249:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":185,"./_baseUnary":188,"./_nodeUtil":225}],250:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":175,"./_baseKeys":186,"./isArrayLike":241}],251:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],252:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],253:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],254:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],255:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var printWarning = function() {};

if ("production" !== 'production') {
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
  var has = require('./lib/has');

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if ("production" !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if ("production" !== 'production') {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;

},{"./lib/ReactPropTypesSecret":259,"./lib/has":260}],256:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":259}],257:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactIs = require('react-is');
var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var has = require('./lib/has');
var checkPropTypes = require('./checkPropTypes');

var printWarning = function() {};

if ("production" !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if ("production" !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ("production" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if ("production" !== 'production') {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      "production" !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./checkPropTypes":255,"./lib/ReactPropTypesSecret":259,"./lib/has":260,"object-assign":253,"react-is":263}],258:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if ("production" !== 'production') {
  var ReactIs = require('react-is');

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

},{"./factoryWithThrowingShims":256,"./factoryWithTypeCheckers":257,"react-is":263}],259:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],260:[function(require,module,exports){
module.exports = Function.call.bind(Object.prototype.hasOwnProperty);

},{}],261:[function(require,module,exports){
(function (process){(function (){
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';



if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}

}).call(this)}).call(this,require('_process'))
},{"_process":254}],262:[function(require,module,exports){
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;

},{}],263:[function(require,module,exports){
(function (process){(function (){
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-is.production.min.js');
} else {
  module.exports = require('./cjs/react-is.development.js');
}

}).call(this)}).call(this,require('_process'))
},{"./cjs/react-is.development.js":261,"./cjs/react-is.production.min.js":262,"_process":254}],264:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _io = require('./internal/io');

Object.defineProperty(exports, 'take', {
  enumerable: true,
  get: function get() {
    return _io.take;
  }
});
Object.defineProperty(exports, 'takem', {
  enumerable: true,
  get: function get() {
    return _io.takem;
  }
});
Object.defineProperty(exports, 'put', {
  enumerable: true,
  get: function get() {
    return _io.put;
  }
});
Object.defineProperty(exports, 'all', {
  enumerable: true,
  get: function get() {
    return _io.all;
  }
});
Object.defineProperty(exports, 'race', {
  enumerable: true,
  get: function get() {
    return _io.race;
  }
});
Object.defineProperty(exports, 'call', {
  enumerable: true,
  get: function get() {
    return _io.call;
  }
});
Object.defineProperty(exports, 'apply', {
  enumerable: true,
  get: function get() {
    return _io.apply;
  }
});
Object.defineProperty(exports, 'cps', {
  enumerable: true,
  get: function get() {
    return _io.cps;
  }
});
Object.defineProperty(exports, 'fork', {
  enumerable: true,
  get: function get() {
    return _io.fork;
  }
});
Object.defineProperty(exports, 'spawn', {
  enumerable: true,
  get: function get() {
    return _io.spawn;
  }
});
Object.defineProperty(exports, 'join', {
  enumerable: true,
  get: function get() {
    return _io.join;
  }
});
Object.defineProperty(exports, 'cancel', {
  enumerable: true,
  get: function get() {
    return _io.cancel;
  }
});
Object.defineProperty(exports, 'select', {
  enumerable: true,
  get: function get() {
    return _io.select;
  }
});
Object.defineProperty(exports, 'actionChannel', {
  enumerable: true,
  get: function get() {
    return _io.actionChannel;
  }
});
Object.defineProperty(exports, 'cancelled', {
  enumerable: true,
  get: function get() {
    return _io.cancelled;
  }
});
Object.defineProperty(exports, 'flush', {
  enumerable: true,
  get: function get() {
    return _io.flush;
  }
});
Object.defineProperty(exports, 'getContext', {
  enumerable: true,
  get: function get() {
    return _io.getContext;
  }
});
Object.defineProperty(exports, 'setContext', {
  enumerable: true,
  get: function get() {
    return _io.setContext;
  }
});
Object.defineProperty(exports, 'takeEvery', {
  enumerable: true,
  get: function get() {
    return _io.takeEvery;
  }
});
Object.defineProperty(exports, 'takeLatest', {
  enumerable: true,
  get: function get() {
    return _io.takeLatest;
  }
});
Object.defineProperty(exports, 'throttle', {
  enumerable: true,
  get: function get() {
    return _io.throttle;
  }
});
},{"./internal/io":267}],265:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.buffers = exports.BUFFER_OVERFLOW = undefined;

var _utils = require("./utils");

var BUFFER_OVERFLOW = exports.BUFFER_OVERFLOW = "Channel's Buffer overflow!";

var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_DROP = 2;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;

var zeroBuffer = { isEmpty: _utils.kTrue, put: _utils.noop, take: _utils.noop };

function ringBuffer() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var overflowAction = arguments[1];

  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;

  var push = function push(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };

  var take = function take() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };

  var flush = function flush() {
    var items = [];
    while (length) {
      items.push(take());
    }
    return items;
  };

  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit = void 0;
        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);
          case ON_OVERFLOW_SLIDE:
            arr[pushIndex] = it;
            pushIndex = (pushIndex + 1) % limit;
            popIndex = pushIndex;
            break;
          case ON_OVERFLOW_EXPAND:
            doubledLimit = 2 * limit;

            arr = flush();

            length = arr.length;
            pushIndex = arr.length;
            popIndex = 0;

            arr.length = doubledLimit;
            limit = doubledLimit;

            push(it);
            break;
          default:
          // DROP
        }
      }
    },
    take: take,
    flush: flush
  };
}

var buffers = exports.buffers = {
  none: function none() {
    return zeroBuffer;
  },
  fixed: function fixed(limit) {
    return ringBuffer(limit, ON_OVERFLOW_THROW);
  },
  dropping: function dropping(limit) {
    return ringBuffer(limit, ON_OVERFLOW_DROP);
  },
  sliding: function sliding(limit) {
    return ringBuffer(limit, ON_OVERFLOW_SLIDE);
  },
  expanding: function expanding(initialSize) {
    return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
  }
};
},{"./utils":274}],266:[function(require,module,exports){
(function (process){(function (){
'use strict';

exports.__esModule = true;
exports.UNDEFINED_INPUT_ERROR = exports.INVALID_BUFFER = exports.isEnd = exports.END = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.emitter = emitter;
exports.channel = channel;
exports.eventChannel = eventChannel;
exports.stdChannel = stdChannel;

var _utils = require('./utils');

var _buffers = require('./buffers');

var _scheduler = require('./scheduler');

var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
var END = exports.END = { type: CHANNEL_END_TYPE };
var isEnd = exports.isEnd = function isEnd(a) {
  return a && a.type === CHANNEL_END_TYPE;
};

function emitter() {
  var subscribers = [];

  function subscribe(sub) {
    subscribers.push(sub);
    return function () {
      return (0, _utils.remove)(subscribers, sub);
    };
  }

  function emit(item) {
    var arr = subscribers.slice();
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i](item);
    }
  }

  return {
    subscribe: subscribe,
    emit: emit
  };
}

var INVALID_BUFFER = exports.INVALID_BUFFER = 'invalid buffer passed to channel factory function';
var UNDEFINED_INPUT_ERROR = exports.UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';

if (process.env.NODE_ENV !== 'production') {
  exports.UNDEFINED_INPUT_ERROR = UNDEFINED_INPUT_ERROR += '\nHints:\n    - check that your Action Creator returns a non-undefined value\n    - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n  ';
}

function channel() {
  var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _buffers.buffers.fixed();

  var closed = false;
  var takers = [];

  (0, _utils.check)(buffer, _utils.is.buffer, INVALID_BUFFER);

  function checkForbiddenStates() {
    if (closed && takers.length) {
      throw (0, _utils.internalErr)('Cannot have a closed channel with pending takers');
    }
    if (takers.length && !buffer.isEmpty()) {
      throw (0, _utils.internalErr)('Cannot have pending takers with non empty buffer');
    }
  }

  function put(input) {
    checkForbiddenStates();
    (0, _utils.check)(input, _utils.is.notUndef, UNDEFINED_INPUT_ERROR);
    if (closed) {
      return;
    }
    if (!takers.length) {
      return buffer.put(input);
    }
    for (var i = 0; i < takers.length; i++) {
      var cb = takers[i];
      if (!cb[_utils.MATCH] || cb[_utils.MATCH](input)) {
        takers.splice(i, 1);
        return cb(input);
      }
    }
  }

  function take(cb) {
    checkForbiddenStates();
    (0, _utils.check)(cb, _utils.is.func, "channel.take's callback must be a function");

    if (closed && buffer.isEmpty()) {
      cb(END);
    } else if (!buffer.isEmpty()) {
      cb(buffer.take());
    } else {
      takers.push(cb);
      cb.cancel = function () {
        return (0, _utils.remove)(takers, cb);
      };
    }
  }

  function flush(cb) {
    checkForbiddenStates(); // TODO: check if some new state should be forbidden now
    (0, _utils.check)(cb, _utils.is.func, "channel.flush' callback must be a function");
    if (closed && buffer.isEmpty()) {
      cb(END);
      return;
    }
    cb(buffer.flush());
  }

  function close() {
    checkForbiddenStates();
    if (!closed) {
      closed = true;
      if (takers.length) {
        var arr = takers;
        takers = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          arr[i](END);
        }
      }
    }
  }

  return {
    take: take,
    put: put,
    flush: flush,
    close: close,
    get __takers__() {
      return takers;
    },
    get __closed__() {
      return closed;
    }
  };
}

function eventChannel(subscribe) {
  var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _buffers.buffers.none();
  var matcher = arguments[2];

  /**
    should be if(typeof matcher !== undefined) instead?
    see PR #273 for a background discussion
  **/
  if (arguments.length > 2) {
    (0, _utils.check)(matcher, _utils.is.func, 'Invalid match function passed to eventChannel');
  }

  var chan = channel(buffer);
  var close = function close() {
    if (!chan.__closed__) {
      if (unsubscribe) {
        unsubscribe();
      }
      chan.close();
    }
  };
  var unsubscribe = subscribe(function (input) {
    if (isEnd(input)) {
      close();
      return;
    }
    if (matcher && !matcher(input)) {
      return;
    }
    chan.put(input);
  });
  if (chan.__closed__) {
    unsubscribe();
  }

  if (!_utils.is.func(unsubscribe)) {
    throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
  }

  return {
    take: chan.take,
    flush: chan.flush,
    close: close
  };
}

function stdChannel(subscribe) {
  var chan = eventChannel(function (cb) {
    return subscribe(function (input) {
      if (input[_utils.SAGA_ACTION]) {
        cb(input);
        return;
      }
      (0, _scheduler.asap)(function () {
        return cb(input);
      });
    });
  });

  return _extends({}, chan, {
    take: function take(cb, matcher) {
      if (arguments.length > 1) {
        (0, _utils.check)(matcher, _utils.is.func, "channel.take's matcher argument must be a function");
        cb[_utils.MATCH] = matcher;
      }
      chan.take(cb);
    }
  });
}
}).call(this)}).call(this,require('_process'))
},{"./buffers":265,"./scheduler":273,"./utils":274,"_process":254}],267:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.asEffect = exports.takem = undefined;
exports.take = take;
exports.put = put;
exports.all = all;
exports.race = race;
exports.call = call;
exports.apply = apply;
exports.cps = cps;
exports.fork = fork;
exports.spawn = spawn;
exports.join = join;
exports.cancel = cancel;
exports.select = select;
exports.actionChannel = actionChannel;
exports.cancelled = cancelled;
exports.flush = flush;
exports.getContext = getContext;
exports.setContext = setContext;
exports.takeEvery = takeEvery;
exports.takeLatest = takeLatest;
exports.throttle = throttle;

var _utils = require('./utils');

var _sagaHelpers = require('./sagaHelpers');

var IO = (0, _utils.sym)('IO');
var TAKE = 'TAKE';
var PUT = 'PUT';
var ALL = 'ALL';
var RACE = 'RACE';
var CALL = 'CALL';
var CPS = 'CPS';
var FORK = 'FORK';
var JOIN = 'JOIN';
var CANCEL = 'CANCEL';
var SELECT = 'SELECT';
var ACTION_CHANNEL = 'ACTION_CHANNEL';
var CANCELLED = 'CANCELLED';
var FLUSH = 'FLUSH';
var GET_CONTEXT = 'GET_CONTEXT';
var SET_CONTEXT = 'SET_CONTEXT';

var TEST_HINT = '\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)';

var effect = function effect(type, payload) {
  var _ref;

  return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
};

function take() {
  var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

  if (arguments.length) {
    (0, _utils.check)(arguments[0], _utils.is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }
  if (_utils.is.pattern(patternOrChannel)) {
    return effect(TAKE, { pattern: patternOrChannel });
  }
  if (_utils.is.channel(patternOrChannel)) {
    return effect(TAKE, { channel: patternOrChannel });
  }
  throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
}

take.maybe = function () {
  var eff = take.apply(undefined, arguments);
  eff[TAKE].maybe = true;
  return eff;
};

var takem = /*#__PURE__*/exports.takem = (0, _utils.deprecate)(take.maybe, /*#__PURE__*/(0, _utils.updateIncentive)('takem', 'take.maybe'));

function put(channel, action) {
  if (arguments.length > 1) {
    (0, _utils.check)(channel, _utils.is.notUndef, 'put(channel, action): argument channel is undefined');
    (0, _utils.check)(channel, _utils.is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
    (0, _utils.check)(action, _utils.is.notUndef, 'put(channel, action): argument action is undefined');
  } else {
    (0, _utils.check)(channel, _utils.is.notUndef, 'put(action): argument action is undefined');
    action = channel;
    channel = null;
  }
  return effect(PUT, { channel: channel, action: action });
}

put.resolve = function () {
  var eff = put.apply(undefined, arguments);
  eff[PUT].resolve = true;
  return eff;
};

put.sync = (0, _utils.deprecate)(put.resolve, (0, _utils.updateIncentive)('put.sync', 'put.resolve'));

function all(effects) {
  return effect(ALL, effects);
}

function race(effects) {
  return effect(RACE, effects);
}

function getFnCallDesc(meth, fn, args) {
  (0, _utils.check)(fn, _utils.is.notUndef, meth + ': argument fn is undefined');

  var context = null;
  if (_utils.is.array(fn)) {
    var _fn = fn;
    context = _fn[0];
    fn = _fn[1];
  } else if (fn.fn) {
    var _fn2 = fn;
    context = _fn2.context;
    fn = _fn2.fn;
  }
  if (context && _utils.is.string(fn) && _utils.is.func(context[fn])) {
    fn = context[fn];
  }
  (0, _utils.check)(fn, _utils.is.func, meth + ': argument ' + fn + ' is not a function');

  return { context: context, fn: fn, args: args };
}

function call(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return effect(CALL, getFnCallDesc('call', fn, args));
}

function apply(context, fn) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return effect(CALL, getFnCallDesc('apply', { context: context, fn: fn }, args));
}

function cps(fn) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return effect(CPS, getFnCallDesc('cps', fn, args));
}

function fork(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return effect(FORK, getFnCallDesc('fork', fn, args));
}

function spawn(fn) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  var eff = fork.apply(undefined, [fn].concat(args));
  eff[FORK].detached = true;
  return eff;
}

function join() {
  for (var _len5 = arguments.length, tasks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    tasks[_key5] = arguments[_key5];
  }

  if (tasks.length > 1) {
    return all(tasks.map(function (t) {
      return join(t);
    }));
  }
  var task = tasks[0];
  (0, _utils.check)(task, _utils.is.notUndef, 'join(task): argument task is undefined');
  (0, _utils.check)(task, _utils.is.task, 'join(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
  return effect(JOIN, task);
}

function cancel() {
  for (var _len6 = arguments.length, tasks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    tasks[_key6] = arguments[_key6];
  }

  if (tasks.length > 1) {
    return all(tasks.map(function (t) {
      return cancel(t);
    }));
  }
  var task = tasks[0];
  if (tasks.length === 1) {
    (0, _utils.check)(task, _utils.is.notUndef, 'cancel(task): argument task is undefined');
    (0, _utils.check)(task, _utils.is.task, 'cancel(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
  }
  return effect(CANCEL, task || _utils.SELF_CANCELLATION);
}

function select(selector) {
  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  if (arguments.length === 0) {
    selector = _utils.ident;
  } else {
    (0, _utils.check)(selector, _utils.is.notUndef, 'select(selector,[...]): argument selector is undefined');
    (0, _utils.check)(selector, _utils.is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
  }
  return effect(SELECT, { selector: selector, args: args });
}

/**
  channel(pattern, [buffer])    => creates an event channel for store actions
**/
function actionChannel(pattern, buffer) {
  (0, _utils.check)(pattern, _utils.is.notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
  if (arguments.length > 1) {
    (0, _utils.check)(buffer, _utils.is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
    (0, _utils.check)(buffer, _utils.is.buffer, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
  }
  return effect(ACTION_CHANNEL, { pattern: pattern, buffer: buffer });
}

function cancelled() {
  return effect(CANCELLED, {});
}

function flush(channel) {
  (0, _utils.check)(channel, _utils.is.channel, 'flush(channel): argument ' + channel + ' is not valid channel');
  return effect(FLUSH, channel);
}

function getContext(prop) {
  (0, _utils.check)(prop, _utils.is.string, 'getContext(prop): argument ' + prop + ' is not a string');
  return effect(GET_CONTEXT, prop);
}

function setContext(props) {
  (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)(null, props));
  return effect(SET_CONTEXT, props);
}

function takeEvery(patternOrChannel, worker) {
  for (var _len8 = arguments.length, args = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
    args[_key8 - 2] = arguments[_key8];
  }

  return fork.apply(undefined, [_sagaHelpers.takeEveryHelper, patternOrChannel, worker].concat(args));
}

function takeLatest(patternOrChannel, worker) {
  for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
    args[_key9 - 2] = arguments[_key9];
  }

  return fork.apply(undefined, [_sagaHelpers.takeLatestHelper, patternOrChannel, worker].concat(args));
}

function throttle(ms, pattern, worker) {
  for (var _len10 = arguments.length, args = Array(_len10 > 3 ? _len10 - 3 : 0), _key10 = 3; _key10 < _len10; _key10++) {
    args[_key10 - 3] = arguments[_key10];
  }

  return fork.apply(undefined, [_sagaHelpers.throttleHelper, ms, pattern, worker].concat(args));
}

var createAsEffectType = function createAsEffectType(type) {
  return function (effect) {
    return effect && effect[IO] && effect[type];
  };
};

var asEffect = exports.asEffect = {
  take: createAsEffectType(TAKE),
  put: createAsEffectType(PUT),
  all: createAsEffectType(ALL),
  race: createAsEffectType(RACE),
  call: createAsEffectType(CALL),
  cps: createAsEffectType(CPS),
  fork: createAsEffectType(FORK),
  join: createAsEffectType(JOIN),
  cancel: createAsEffectType(CANCEL),
  select: createAsEffectType(SELECT),
  actionChannel: createAsEffectType(ACTION_CHANNEL),
  cancelled: createAsEffectType(CANCELLED),
  flush: createAsEffectType(FLUSH),
  getContext: createAsEffectType(GET_CONTEXT),
  setContext: createAsEffectType(SET_CONTEXT)
};
},{"./sagaHelpers":269,"./utils":274}],268:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.qEnd = undefined;
exports.safeName = safeName;
exports.default = fsmIterator;

var _utils = require('../utils');

var done = { done: true, value: undefined };
var qEnd = exports.qEnd = {};

function safeName(patternOrChannel) {
  if (_utils.is.channel(patternOrChannel)) {
    return 'channel';
  } else if (Array.isArray(patternOrChannel)) {
    return String(patternOrChannel.map(function (entry) {
      return String(entry);
    }));
  } else {
    return String(patternOrChannel);
  }
}

function fsmIterator(fsm, q0) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';

  var updateState = void 0,
      qNext = q0;

  function next(arg, error) {
    if (qNext === qEnd) {
      return done;
    }

    if (error) {
      qNext = qEnd;
      throw error;
    } else {
      updateState && updateState(arg);

      var _fsm$qNext = fsm[qNext](),
          q = _fsm$qNext[0],
          output = _fsm$qNext[1],
          _updateState = _fsm$qNext[2];

      qNext = q;
      updateState = _updateState;
      return qNext === qEnd ? done : output;
    }
  }

  return (0, _utils.makeIterator)(next, function (error) {
    return next(null, error);
  }, name, true);
}
},{"../utils":274}],269:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.throttleHelper = exports.takeLatestHelper = exports.takeEveryHelper = exports.throttle = exports.takeLatest = exports.takeEvery = undefined;

var _takeEvery = require('./takeEvery');

var _takeEvery2 = _interopRequireDefault(_takeEvery);

var _takeLatest = require('./takeLatest');

var _takeLatest2 = _interopRequireDefault(_takeLatest);

var _throttle = require('./throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deprecationWarning = function deprecationWarning(helperName) {
  return 'import { ' + helperName + ' } from \'redux-saga\' has been deprecated in favor of import { ' + helperName + ' } from \'redux-saga/effects\'.\nThe latter will not work with yield*, as helper effects are wrapped automatically for you in fork effect.\nTherefore yield ' + helperName + ' will return task descriptor to your saga and execute next lines of code.';
};

var takeEvery = /*#__PURE__*/(0, _utils.deprecate)(_takeEvery2.default, /*#__PURE__*/deprecationWarning('takeEvery'));
var takeLatest = /*#__PURE__*/(0, _utils.deprecate)(_takeLatest2.default, /*#__PURE__*/deprecationWarning('takeLatest'));
var throttle = /*#__PURE__*/(0, _utils.deprecate)(_throttle2.default, /*#__PURE__*/deprecationWarning('throttle'));

exports.takeEvery = takeEvery;
exports.takeLatest = takeLatest;
exports.throttle = throttle;
exports.takeEveryHelper = _takeEvery2.default;
exports.takeLatestHelper = _takeLatest2.default;
exports.throttleHelper = _throttle2.default;
},{"../utils":274,"./takeEvery":270,"./takeLatest":271,"./throttle":272}],270:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = takeEvery;

var _fsmIterator = require('./fsmIterator');

var _fsmIterator2 = _interopRequireDefault(_fsmIterator);

var _io = require('../io');

var _channel = require('../channel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = { done: false, value: (0, _io.take)(patternOrChannel) };
  var yFork = function yFork(ac) {
    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
  };

  var action = void 0,
      setAction = function setAction(ac) {
    return action = ac;
  };

  return (0, _fsmIterator2.default)({
    q1: function q1() {
      return ['q2', yTake, setAction];
    },
    q2: function q2() {
      return action === _channel.END ? [_fsmIterator.qEnd] : ['q1', yFork(action)];
    }
  }, 'q1', 'takeEvery(' + (0, _fsmIterator.safeName)(patternOrChannel) + ', ' + worker.name + ')');
}
},{"../channel":266,"../io":267,"./fsmIterator":268}],271:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = takeLatest;

var _fsmIterator = require('./fsmIterator');

var _fsmIterator2 = _interopRequireDefault(_fsmIterator);

var _io = require('../io');

var _channel = require('../channel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function takeLatest(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = { done: false, value: (0, _io.take)(patternOrChannel) };
  var yFork = function yFork(ac) {
    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
  };
  var yCancel = function yCancel(task) {
    return { done: false, value: (0, _io.cancel)(task) };
  };

  var task = void 0,
      action = void 0;
  var setTask = function setTask(t) {
    return task = t;
  };
  var setAction = function setAction(ac) {
    return action = ac;
  };

  return (0, _fsmIterator2.default)({
    q1: function q1() {
      return ['q2', yTake, setAction];
    },
    q2: function q2() {
      return action === _channel.END ? [_fsmIterator.qEnd] : task ? ['q3', yCancel(task)] : ['q1', yFork(action), setTask];
    },
    q3: function q3() {
      return ['q1', yFork(action), setTask];
    }
  }, 'q1', 'takeLatest(' + (0, _fsmIterator.safeName)(patternOrChannel) + ', ' + worker.name + ')');
}
},{"../channel":266,"../io":267,"./fsmIterator":268}],272:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = throttle;

var _fsmIterator = require('./fsmIterator');

var _fsmIterator2 = _interopRequireDefault(_fsmIterator);

var _io = require('../io');

var _channel = require('../channel');

var _buffers = require('../buffers');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function throttle(delayLength, pattern, worker) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var action = void 0,
      channel = void 0;

  var yActionChannel = { done: false, value: (0, _io.actionChannel)(pattern, _buffers.buffers.sliding(1)) };
  var yTake = function yTake() {
    return { done: false, value: (0, _io.take)(channel) };
  };
  var yFork = function yFork(ac) {
    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
  };
  var yDelay = { done: false, value: (0, _io.call)(_utils.delay, delayLength) };

  var setAction = function setAction(ac) {
    return action = ac;
  };
  var setChannel = function setChannel(ch) {
    return channel = ch;
  };

  return (0, _fsmIterator2.default)({
    q1: function q1() {
      return ['q2', yActionChannel, setChannel];
    },
    q2: function q2() {
      return ['q3', yTake(), setAction];
    },
    q3: function q3() {
      return action === _channel.END ? [_fsmIterator.qEnd] : ['q4', yFork(action)];
    },
    q4: function q4() {
      return ['q2', yDelay];
    }
  }, 'q1', 'throttle(' + (0, _fsmIterator.safeName)(pattern) + ', ' + worker.name + ')');
}
},{"../buffers":265,"../channel":266,"../io":267,"../utils":274,"./fsmIterator":268}],273:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.asap = asap;
exports.suspend = suspend;
exports.flush = flush;
var queue = [];
/**
  Variable to hold a counting semaphore
  - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
    already suspended)
  - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
    triggers flushing the queued tasks.
**/
var semaphore = 0;

/**
  Executes a task 'atomically'. Tasks scheduled during this execution will be queued
  and flushed after this task has finished (assuming the scheduler endup in a released
  state).
**/
function exec(task) {
  try {
    suspend();
    task();
  } finally {
    release();
  }
}

/**
  Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
**/
function asap(task) {
  queue.push(task);

  if (!semaphore) {
    suspend();
    flush();
  }
}

/**
  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
  scheduler is released.
**/
function suspend() {
  semaphore++;
}

/**
  Puts the scheduler in a `released` state.
**/
function release() {
  semaphore--;
}

/**
  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
**/
function flush() {
  release();

  var task = void 0;
  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec(task);
  }
}
},{}],274:[function(require,module,exports){
(function (process){(function (){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.check = check;
exports.hasOwn = hasOwn;
exports.remove = remove;
exports.deferred = deferred;
exports.arrayOfDeffered = arrayOfDeffered;
exports.delay = delay;
exports.createMockTask = createMockTask;
exports.autoInc = autoInc;
exports.makeIterator = makeIterator;
exports.log = log;
exports.deprecate = deprecate;
var sym = exports.sym = function sym(id) {
  return '@@redux-saga/' + id;
};

var TASK = exports.TASK = sym('TASK');
var HELPER = exports.HELPER = sym('HELPER');
var MATCH = exports.MATCH = sym('MATCH');
var CANCEL = exports.CANCEL = sym('CANCEL_PROMISE');
var SAGA_ACTION = exports.SAGA_ACTION = sym('SAGA_ACTION');
var SELF_CANCELLATION = exports.SELF_CANCELLATION = sym('SELF_CANCELLATION');
var konst = exports.konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue = exports.kTrue = konst(true);
var kFalse = exports.kFalse = konst(false);
var noop = exports.noop = function noop() {};
var ident = exports.ident = function ident(v) {
  return v;
};

function check(value, predicate, error) {
  if (!predicate(value)) {
    log('error', 'uncaught at check', error);
    throw new Error(error);
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(object, property) {
  return is.notUndef(object) && hasOwnProperty.call(object, property);
}

var is = exports.is = {
  undef: function undef(v) {
    return v === null || v === undefined;
  },
  notUndef: function notUndef(v) {
    return v !== null && v !== undefined;
  },
  func: function func(f) {
    return typeof f === 'function';
  },
  number: function number(n) {
    return typeof n === 'number';
  },
  string: function string(s) {
    return typeof s === 'string';
  },
  array: Array.isArray,
  object: function object(obj) {
    return obj && !is.array(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  },
  promise: function promise(p) {
    return p && is.func(p.then);
  },
  iterator: function iterator(it) {
    return it && is.func(it.next) && is.func(it.throw);
  },
  iterable: function iterable(it) {
    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
  },
  task: function task(t) {
    return t && t[TASK];
  },
  observable: function observable(ob) {
    return ob && is.func(ob.subscribe);
  },
  buffer: function buffer(buf) {
    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
  },
  pattern: function pattern(pat) {
    return pat && (is.string(pat) || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
  },
  channel: function channel(ch) {
    return ch && is.func(ch.take) && is.func(ch.close);
  },
  helper: function helper(it) {
    return it && it[HELPER];
  },
  stringableFunc: function stringableFunc(f) {
    return is.func(f) && hasOwn(f, 'toString');
  }
};

var object = exports.object = {
  assign: function assign(target, source) {
    for (var i in source) {
      if (hasOwn(source, i)) {
        target[i] = source[i];
      }
    }
  }
};

function remove(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

var array = exports.array = {
  from: function from(obj) {
    var arr = Array(obj.length);
    for (var i in obj) {
      if (hasOwn(obj, i)) {
        arr[i] = obj[i];
      }
    }
    return arr;
  }
};

function deferred() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var def = _extends({}, props);
  var promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  def.promise = promise;
  return def;
}

function arrayOfDeffered(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(deferred());
  }
  return arr;
}

function delay(ms) {
  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var timeoutId = void 0;
  var promise = new Promise(function (resolve) {
    timeoutId = setTimeout(function () {
      return resolve(val);
    }, ms);
  });

  promise[CANCEL] = function () {
    return clearTimeout(timeoutId);
  };

  return promise;
}

function createMockTask() {
  var _ref;

  var running = true;
  var _result = void 0,
      _error = void 0;

  return _ref = {}, _ref[TASK] = true, _ref.isRunning = function isRunning() {
    return running;
  }, _ref.result = function result() {
    return _result;
  }, _ref.error = function error() {
    return _error;
  }, _ref.setRunning = function setRunning(b) {
    return running = b;
  }, _ref.setResult = function setResult(r) {
    return _result = r;
  }, _ref.setError = function setError(e) {
    return _error = e;
  }, _ref;
}

function autoInc() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return function () {
    return ++seed;
  };
}

var uid = exports.uid = autoInc();

var kThrow = function kThrow(err) {
  throw err;
};
var kReturn = function kReturn(value) {
  return { value: value, done: true };
};
function makeIterator(next) {
  var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var isHelper = arguments[3];

  var iterator = { name: name, next: next, throw: thro, return: kReturn };

  if (isHelper) {
    iterator[HELPER] = true;
  }
  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }
  return iterator;
}

/**
  Print error in a useful way whether in a browser environment
  (with expandable error stack traces), or in a node.js environment
  (text-only log output)
 **/
function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  /*eslint-disable no-console*/
  if (typeof window === 'undefined') {
    console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
  } else {
    console[level](message, error);
  }
}

function deprecate(fn, deprecationWarning) {
  return function () {
    if (process.env.NODE_ENV === 'development') log('warn', deprecationWarning);
    return fn.apply(undefined, arguments);
  };
}

var updateIncentive = exports.updateIncentive = function updateIncentive(deprecated, preferred) {
  return deprecated + ' has been deprecated in favor of ' + preferred + ', please update your code';
};

var internalErr = exports.internalErr = function internalErr(err) {
  return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
};

var createSetContextWarning = exports.createSetContextWarning = function createSetContextWarning(ctx, props) {
  return (ctx ? ctx + '.' : '') + 'setContext(props): argument ' + props + ' is not a plain object';
};

var wrapSagaDispatch = exports.wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
  return function (action) {
    return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }));
  };
};

var cloneableGenerator = exports.cloneableGenerator = function cloneableGenerator(generatorFunc) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var history = [];
    var gen = generatorFunc.apply(undefined, args);
    return {
      next: function next(arg) {
        history.push(arg);
        return gen.next(arg);
      },
      clone: function clone() {
        var clonedGen = cloneableGenerator(generatorFunc).apply(undefined, args);
        history.forEach(function (arg) {
          return clonedGen.next(arg);
        });
        return clonedGen;
      },
      return: function _return(value) {
        return gen.return(value);
      },
      throw: function _throw(exception) {
        return gen.throw(exception);
      }
    };
  };
};
}).call(this)}).call(this,require('_process'))
},{"_process":254}]},{},[74]);
