import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FilterProps, FieldMeta } from '../types.js';
import { api } from '../../api/fetch.js';

type RelMeta = Extract<FieldMeta, { fieldType: 'relationship' }>;

type SearchItem = { id: string; name?: string; [key: string]: unknown };
type SearchResponse = SearchItem[] | { results?: SearchItem[] };

function getSearchResults(response: SearchResponse | undefined): SearchItem[] {
  if (response === undefined) return [];
  return Array.isArray(response) ? response : response.results ?? [];
}

/** Filter widget for relationship fields — search by name and select an item ID as the filter value. */
export function Filter({ fieldName, value, onChange, meta }: FilterProps<string>) {
  const refList = (meta as RelMeta).refList;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isFetching } = useQuery<SearchResponse>({
    queryKey: ['rel-search', refList, searchQuery],
    queryFn: () =>
      api<SearchResponse>(`/${refList}?search=${encodeURIComponent(searchQuery)}&limit=10`),
    enabled: searchQuery.length > 0,
  });

  const showDropdown = searchQuery.length > 0;
  const results = getSearchResults(response);

  return (
    <div>
      {value && (
        <span>
          ID: {value}
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => onChange('')}
          >
            ×
          </button>
        </span>
      )}

      <input
        name={fieldName}
        type="text"
        placeholder="Search to filter…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {showDropdown && (
        <ul role="listbox">
          {isFetching && <li>Loading…</li>}
          {!isFetching && response !== undefined && results.length === 0 && (
            <li>No results</li>
          )}
          {response !== undefined &&
            results.map((item) => (
              <li key={item.id} role="option" aria-selected={value === item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    setSearchQuery('');
                  }}
                >
                  {item.name ?? item.id}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
