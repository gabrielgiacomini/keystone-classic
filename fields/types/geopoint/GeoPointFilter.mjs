/**
 * @file
 * This file defines the `GeoPointFilter` component, which is used to filter
 * `GeoPoint` fields in the KeystoneJS Admin UI.
 */
import React from 'react';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';
import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

const DISTANCE_OPTIONS = [
	{ label: 'Max distance (km)', value: 'max' },
	{ label: 'Min distance (km)', value: 'min' },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		lat: undefined,
		lon: undefined,
		distance: {
			mode: DISTANCE_OPTIONS[0].value,
			value: undefined,
		},
	};
}

/**
 * The `GeoPointFilter` component.
 * @augments React.Component
 */
function GeoPointFilter({ filter, onChange }) {
	const updateFilter = (value) => {
		onChange({ ...filter, ...value });
	};
	const distanceModeVerb = filter.distance.mode === 'max' ? 'Maximum' : 'Minimum';

	return React.createElement(
		'div',
		null,
		React.createElement(
			Grid.Row,
			{ xsmall: 'one-half', gutter: 10 },
			React.createElement(
				Grid.Col,
				null,
				React.createElement(
					FormField,
					{ label: 'Latitude' },
					React.createElement(FormInput, {
						autoFocus: true,
						onChange: (evt) => updateFilter({ lat: evt.target.value }),
						placeholder: 'Latitude',
						required: 'true',
						step: 0.01,
						type: 'number',
						value: filter.lat,
						'data-list-filter-geopoint-lat': true,
					})
				)
			),
			React.createElement(
				Grid.Col,
				null,
				React.createElement(
					FormField,
					{ label: 'Longitude' },
					React.createElement(FormInput, {
						onChange: (evt) => updateFilter({ lon: evt.target.value }),
						placeholder: 'Longitude',
						required: 'true',
						step: 0.01,
						type: 'number',
						value: filter.lon,
						'data-list-filter-geopoint-lon': true,
					})
				)
			)
		),
		React.createElement(
			FormField,
			null,
			React.createElement(SegmentedControl, {
				equalWidthSegments: true,
				onChange: (mode) => updateFilter({
					distance: {
						mode,
						value: filter.distance.value,
					},
				}),
				options: DISTANCE_OPTIONS,
				value: filter.distance.mode,
				'data-list-filter-geopoint-mode': true,
			})
		),
		React.createElement(FormInput, {
			onChange: (evt) => updateFilter({
				distance: {
					mode: filter.distance.mode,
					value: evt.target.value,
				},
			}),
			placeholder: distanceModeVerb + ' distance from point',
			type: 'number',
			value: filter.distance.value,
			'data-list-filter-geopoint-distance': true,
		})
	);
}


GeoPointFilter.defaultProps = {
	filter: getDefaultValue(),
};

GeoPointFilter.getDefaultValue = getDefaultValue;

export default GeoPointFilter;
