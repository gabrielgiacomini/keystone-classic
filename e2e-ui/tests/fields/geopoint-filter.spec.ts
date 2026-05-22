/**
 * Geopoint filter spec — admin-next (fields suite).
 *
 * Verifies that the Geopoint filter UI:
 *   1. Renders a filter control for the Venue.coordinates field.
 *   2. The server API accepts { lat, lon, distance: { mode, value } } and returns
 *      geospatially filtered results (proximity $near query).
 *
 * Seeding: inserts three Venue documents directly into MongoDB.  The Keystone
 * field-complete server creates the 2dsphere index on Venue.coordinates at
 * startup, so documents inserted after boot are queryable via $near.
 *
 *   - SF  (lat:37.7749,  lng:-122.4194) — San Francisco
 *   - LA  (lat:34.0522,  lng:-118.2437) — Los Angeles (~559 km from SF)
 *   - TYO (lat:35.6762,  lng:139.6503)  — Tokyo (~8271 km from SF)
 *
 * Distance assertions (max mode, km):
 *   - 100 km around SF → only SF
 *   - 700 km around SF → SF + LA
 *   - 20000 km around SF → all three
 */

import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

// List key in the field-complete schema.
const LIST_KEY = 'Venue';
const API_BASE = '/keystone-api';

// Tag to distinguish our seeded docs from the permanent fixture docs.
const GEO_SPEC_TAG = 'geopoint-filter-spec';

// Geopoint venues: MongoDB stores GeoPoint as [lng, lat] (longitude-first).
const GEO_VENUES = [
  { name: 'GeoSpec SF Venue',    coordinates: [-122.4194, 37.7749] },
  { name: 'GeoSpec LA Venue',    coordinates: [-118.2437, 34.0522] },
  { name: 'GeoSpec Tokyo Venue', coordinates: [139.6503,  35.6762] },
] as const;

async function seedGeoVenues(): Promise<void> {
  await withMongo(async (db) => {
    // Clean up any stale docs from a previous aborted run.
    await db.collection('Venue').deleteMany({ _geoSpecTag: GEO_SPEC_TAG });
    await db.collection('Venue').insertMany(
      GEO_VENUES.map((v) => ({ ...v, coordinates: [...v.coordinates], _geoSpecTag: GEO_SPEC_TAG })),
    );
  });
}

async function cleanupGeoVenues(): Promise<void> {
  await withMongo(async (db) => {
    await db.collection('Venue').deleteMany({ _geoSpecTag: GEO_SPEC_TAG });
  });
}

interface ListResponse {
  results?: Array<{ id?: string; _id?: string; name?: string }>;
}

async function fetchVenueNamesByGeoFilter(
  request: import('@playwright/test').APIRequestContext,
  lat: number,
  lon: number,
  distanceKm: number,
  mode: 'max' | 'min' = 'max',
): Promise<string[]> {
  const filter = {
    coordinates: {
      lat,
      lon,
      distance: { mode, value: distanceKm },
    },
  };
  const qs = new URLSearchParams({
    fields: 'name,coordinates',
    limit: '100',
    filters: JSON.stringify(filter),
  });
  const res = await request.get(`${API_BASE}/${LIST_KEY}?${qs.toString()}`);
  if (res.status() !== 200) return [];
  const body = (await res.json()) as ListResponse;
  return (body.results ?? []).map((item) => String(item.name ?? ''));
}

test.describe('geopoint filter', () => {
  // -----------------------------------------------------------------------
  // 1. UI renders a filter control for the Coordinates field.
  // -----------------------------------------------------------------------
  test('admin-next renders a filter control for the geopoint field', async ({ signedInPage }) => {
    await signedInPage.goto(`/keystone-next/${LIST_KEY}`);

    // Open the Filter dropdown.
    const filterButton = signedInPage
      .locator('[data-list-filters-add] > button')
      .first();
    await expect(filterButton, 'Filter button should be visible').toBeVisible();
    await filterButton.click();

    // Pick the Coordinates field.
    await signedInPage
      .locator('[data-list-filters-add] ul button')
      .filter({ has: signedInPage.locator('span:text-is("Coordinates")') })
      .first()
      .click();

    // The filter control should now be visible.
    const filterControl = signedInPage.locator(
      '[data-field-filter][data-field-name="coordinates"][data-field-type="geopoint"]',
    );
    await expect(filterControl, 'Geopoint filter control should render').toBeVisible();

    // Should contain latitude and longitude number inputs.
    await expect(
      filterControl.locator('input[type="number"]').first(),
      'Latitude input should be present',
    ).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // 2–4. API filter tests with seeded geo venues.
  // -----------------------------------------------------------------------
  test.describe('with seeded geo venues', () => {
    test.beforeEach(async () => {
      await seedGeoVenues();
    });

    test.afterEach(async () => {
      await cleanupGeoVenues();
    });

    // -----------------------------------------------------------------------
    // 2. API filter — 100 km around SF returns only the SF venue.
    // -----------------------------------------------------------------------
    test('100 km radius around SF returns only the SF venue', async ({ signedInPage }) => {
      const names = await fetchVenueNamesByGeoFilter(
        signedInPage.request,
        37.7749,   // lat (SF)
        -122.4194, // lon (SF)
        100,
      );
      const ours = names.filter((n) => n.startsWith('GeoSpec '));
      expect(ours, 'Only SF should appear within 100 km of SF').toEqual(['GeoSpec SF Venue']);
    });

    // -----------------------------------------------------------------------
    // 3. API filter — 700 km around SF returns SF + LA (559 km apart).
    // -----------------------------------------------------------------------
    test('700 km radius around SF returns SF and LA venues but not Tokyo', async ({ signedInPage }) => {
      const names = await fetchVenueNamesByGeoFilter(
        signedInPage.request,
        37.7749,
        -122.4194,
        700,
      );
      const ours = names.filter((n) => n.startsWith('GeoSpec '));
      expect(ours, 'SF should appear within 700 km of SF').toContain('GeoSpec SF Venue');
      expect(ours, 'LA should appear within 700 km of SF').toContain('GeoSpec LA Venue');
      expect(ours, 'Tokyo should NOT appear within 700 km of SF').not.toContain('GeoSpec Tokyo Venue');
    });

    // -----------------------------------------------------------------------
    // 4. API filter — 20000 km radius returns all three venues.
    // -----------------------------------------------------------------------
    test('20000 km radius around SF returns all three seeded venues', async ({ signedInPage }) => {
      const names = await fetchVenueNamesByGeoFilter(
        signedInPage.request,
        37.7749,
        -122.4194,
        20000,
      );
      const ours = names.filter((n) => n.startsWith('GeoSpec '));
      expect(ours, 'SF should appear').toContain('GeoSpec SF Venue');
      expect(ours, 'LA should appear').toContain('GeoSpec LA Venue');
      expect(ours, 'Tokyo should appear').toContain('GeoSpec Tokyo Venue');
    });
  });
});
