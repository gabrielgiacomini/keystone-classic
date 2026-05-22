/**
 * @file Hand-authored TypeScript declaration for fields/types/location/LocationFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Location Filter Value component. */
/** Value shape for the LocationFilter component. */
export interface LocationFilterValue {
  inverted: boolean;
  street: string | undefined;
  city: string | undefined;
  state: string | undefined;
  code: string | undefined;
  country: string | undefined;
}

/** Location Filter Props component. */
/** Props for the LocationFilter component. */
export interface LocationFilterProps {
  /** The current filter value. */
  filter: LocationFilterValue;
  /** Callback invoked when the filter value changes. */
  onChange: (value: LocationFilterValue) => void;
}

/** The LocationFilter component. */
declare const LocationFilter: React.ComponentClass<LocationFilterProps>;
export default LocationFilter;
