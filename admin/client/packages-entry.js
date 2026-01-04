import glamor from 'glamor';
import async from 'async';
import blacklist from 'blacklist';
import classnames from 'classnames';
import displayName from 'display-name';
import PropTypes from 'prop-types';
import React from 'react';

// Shim for React 15 -> 16 compatibility
// elemental and other legacy packages expect React.PropTypes
if (!React.PropTypes) {
	React.PropTypes = PropTypes;
}
if (!React.createClass) {
	React.createClass = require('create-react-class');
}

import elemental from 'elemental';
import expressionMatch from 'expression-match';
import i from 'i';
import listToArray from 'list-to-array';
import lodash from 'lodash';
import marked from 'marked';
import moment from 'moment';
import numeral from 'numeral';
import qs from 'qs';
import reactAddonsCssTransitionGroup from 'react-addons-css-transition-group';
import * as reactTransitionGroup from 'react-transition-group';
import reactColor from 'react-color';
import reactDayPicker from 'react-day-picker';
import reactDndHtml5Backend from 'react-dnd-html5-backend';
import reactDnd from 'react-dnd';
import ReactDOM from 'react-dom';
import reactImages from 'react-images';
import reactRedux from 'react-redux';
import reactRouterRedux from 'react-router-redux';
import reactRouter from 'react-router';
import reactSelect from 'react-select';
import createReactClass from 'create-react-class';
import reduxSaga from 'redux-saga';
import reduxThunk from 'redux-thunk';
import redux from 'redux';
import vkey from 'vkey';
import xhr from 'xhr';

window.__keystoneModules = {
	'glamor': glamor,
	'async': async,
	'blacklist': blacklist,
	'classnames': classnames,
	'create-react-class': createReactClass,
	'display-name': displayName,
	'elemental': elemental,
	'prop-types': PropTypes,
	'expression-match': expressionMatch,
	'i': i,
	'list-to-array': listToArray,
	'lodash': lodash,
	'marked': marked,
	'moment': moment,
	'numeral': numeral,
	'qs': qs,
	'react-addons-css-transition-group': reactAddonsCssTransitionGroup,
	'react-transition-group': reactTransitionGroup,
	'react-color': reactColor,
	'react-day-picker': reactDayPicker,
	'react-dnd-html5-backend': reactDndHtml5Backend,
	'react-dnd': reactDnd,
	'react-dom': ReactDOM,
	'react-images': reactImages,
	'react-redux': reactRedux,
	'react-router-redux': reactRouterRedux,
	'react-router': reactRouter,
	'react-select': reactSelect,
	'react': React,
	'redux-saga': reduxSaga,
	'redux-thunk': reduxThunk,
	'redux': redux,
	'vkey': vkey,
	'xhr': xhr,
};

window.require = function(id) {
	if (window.__keystoneModules[id]) {
		return window.__keystoneModules[id];
	}
	throw new Error('Module not found: ' + id);
};
