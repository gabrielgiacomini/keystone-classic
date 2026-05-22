/**
 * @file Hand-authored TypeScript declaration for fields/types/geopoint/GeoPointFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Geo Point Filter Value component. */
/** Value shape for the GeoPointFilter component. */
export interface GeoPointFilterValue {
  lat: number | undefined;
  lon: number | undefined;
  distance: {
    mode: 'max' | 'min';
    value: number | undefined;
  };
}

/** Geo Point Filter Props component. */
/** Props for the GeoPointFilter component. */
export interface GeoPointFilterProps {
  /** The current filter value. */
  filter: GeoPointFilterValue;
  /** Callback invoked when the filter value changes. */
  onChange: (value: GeoPointFilterValue) => void;
}

/** The GeoPointFilter component. */
declare const GeoPointFilter: React.ComponentClass<GeoPointFilterProps>;
export default GeoPointFilter;
