import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FieldProps, FieldMeta } from '../types.js';
import { api } from '../../api/fetch.js';

type RelMeta = Extract<FieldMeta, { fieldType: 'relationship' }>;

type RelationshipItemValue = { id: string; label?: string };
type RelationshipValue = RelationshipItemValue | RelationshipItemValue[] | null;

type SearchItem = { id: string; name?: string; [key: string]: unknown };
type SearchResponse = SearchItem[] | { results?: SearchItem[] };

function getSearchResults(response: SearchResponse | undefined): SearchItem[] {
  if (response === undefined) return [];
  return Array.isArray(response) ? response : response.results ?? [];
}

function getItemLabel(item: RelationshipItemValue): string {
  return item.label !== undefined && item.label !== '' ? item.label : item.id;
}

/** Edit widget for relationship fields — search, select, and clear a related item. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
  meta,
}: FieldProps<RelationshipValue>) {
  const relMeta = meta as RelMeta;
  const refList = relMeta.refList;
  const isMany = relMeta.many === true;
  const [searchQuery, setSearchQuery] = useState('');
  const [singleOpen, setSingleOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: response, isFetching } = useQuery<SearchResponse>({
    queryKey: ['rel-search', refList, searchQuery],
    queryFn: () =>
      api<SearchResponse>(`/${refList}?search=${encodeURIComponent(searchQuery)}&limit=10`),
    enabled: searchQuery.length > 0,
  });

  const selectedItems = isMany
    ? Array.isArray(value) ? value : value === null ? [] : [value]
    : value === null || Array.isArray(value) ? [] : [value];
  const singleSelected = isMany ? null : (selectedItems[0] ?? null);
  const results = getSearchResults(response).filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id),
  );

  // Close the single-select popout on outside-click + Escape.
  useEffect(() => {
    if (!singleOpen) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current === null) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setSingleOpen(false);
        setSearchQuery('');
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSingleOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [singleOpen]);

  useEffect(() => {
    if (singleOpen) searchInputRef.current?.focus();
  }, [singleOpen]);

  function addItem(item: RelationshipItemValue) {
    if (isMany) {
      const next = selectedItems.some((selected) => selected.id === item.id)
        ? selectedItems
        : [...selectedItems, item];
      onChange(next);
    } else {
      onChange(item);
      setSingleOpen(false);
    }
    setSearchQuery('');
  }

  function removeItem(id: string) {
    if (isMany) {
      onChange(selectedItems.filter((item) => item.id !== id));
    } else {
      onChange(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Shared styles
  // ---------------------------------------------------------------------------

  const containerStyle: React.CSSProperties = { position: 'relative', width: '100%' };
  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 2px)',
    left: 0,
    right: 0,
    zIndex: 10,
    listStyle: 'none',
    margin: 0,
    padding: 4,
    background: 'var(--ks-bg, #fff)',
    border: '1px solid var(--ks-border, #ccc)',
    borderRadius: 4,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    maxHeight: 240,
    overflowY: 'auto',
  };
  const dropdownItemBtnStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '6px 8px',
    background: 'none',
    border: 0,
    cursor: 'pointer',
    font: 'inherit',
  };

  // ---------------------------------------------------------------------------
  // Single-select branch
  // ---------------------------------------------------------------------------

  if (!isMany) {
    const singleSelectStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 4px 0 8px',
      minHeight: 32,
      border: '1px solid var(--ks-border, #ccc)',
      borderRadius: 4,
      background: 'var(--ks-bg, #fff)',
      cursor: isReadonly ? 'default' : 'text',
      width: '100%',
      boxSizing: 'border-box',
    };
    const valueLabelStyle: React.CSSProperties = {
      flex: '1 1 auto',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
    const placeholderStyle: React.CSSProperties = {
      ...valueLabelStyle,
      color: 'var(--ks-text-muted, #999)',
    };
    const iconBtnStyle: React.CSSProperties = {
      flex: '0 0 auto',
      background: 'none',
      border: 0,
      color: 'var(--ks-text-light, #999)',
      cursor: 'pointer',
      font: 'inherit',
      padding: '4px 6px',
      lineHeight: 1,
    };
    const triggerSearchStyle: React.CSSProperties = {
      width: '100%',
      boxSizing: 'border-box',
      padding: '6px 8px',
      border: '1px solid var(--ks-border, #ccc)',
      borderRadius: 4,
    };

    return (
      <div style={containerStyle} ref={wrapRef}>
        {singleOpen ? (
          <input
            ref={searchInputRef}
            id={fieldName}
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isReadonly}
            style={triggerSearchStyle}
            data-field-relationship-single-search
          />
        ) : (
          <div
            style={singleSelectStyle}
            onClick={() => {
              if (!isReadonly) setSingleOpen(true);
            }}
            data-field-relationship-single
            data-has-value={singleSelected !== null ? 'true' : 'false'}
          >
            {singleSelected !== null ? (
              <span style={valueLabelStyle} data-field-relationship-single-value>
                {getItemLabel(singleSelected)}
              </span>
            ) : (
              <span style={placeholderStyle}>Search…</span>
            )}
            {singleSelected !== null && !isReadonly && (
              <button
                type="button"
                aria-label={`Remove ${getItemLabel(singleSelected)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(singleSelected.id);
                }}
                style={iconBtnStyle}
                data-field-relationship-single-clear
              >
                {'×'}
              </button>
            )}
            {!isReadonly && (
              <button
                type="button"
                aria-label="Open"
                onClick={(e) => {
                  e.stopPropagation();
                  setSingleOpen(true);
                }}
                style={iconBtnStyle}
                data-field-relationship-single-toggle
              >
                {'▾'}
              </button>
            )}
          </div>
        )}

        {singleOpen && searchQuery.length > 0 && (
          <ul role="listbox" style={dropdownStyle}>
            {isFetching && <li style={{ padding: '6px 8px' }}>Loading…</li>}
            {!isFetching && response !== undefined && results.length === 0 && (
              <li style={{ padding: '6px 8px' }}>No results</li>
            )}
            {response !== undefined &&
              results.map((item) => (
                <li key={item.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => addItem({ id: item.id, label: item.name })}
                    style={dropdownItemBtnStyle}
                  >
                    {item.name ?? item.id}
                  </button>
                </li>
              ))}
          </ul>
        )}

        {isRequired && singleSelected === null && errors.length === 0 && (
          <span role="alert">This field is required</span>
        )}
        {errors.map((err, i) => (
          <span key={i} role="alert">
            {err}
          </span>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Multi-select branch (many === true) — chips + always-visible search input.
  // ---------------------------------------------------------------------------

  const chipsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    margin: 0,
    padding: 0,
    listStyle: 'none',
    marginBottom: selectedItems.length > 0 ? 4 : 0,
  };
  const chipStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 4px 2px 8px',
    background: 'var(--ks-bg-muted, #eee)',
    border: '1px solid var(--ks-border, #ccc)',
    borderRadius: 4,
    font: 'inherit',
  };
  const chipBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 0,
    color: 'var(--ks-text-light, #999)',
    cursor: 'pointer',
    font: 'inherit',
    padding: '0 4px',
    lineHeight: 1,
  };
  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '6px 8px',
    border: '1px solid var(--ks-border, #ccc)',
    borderRadius: 4,
  };
  const showDropdown = searchQuery.length > 0;

  return (
    <div style={containerStyle}>
      {selectedItems.length > 0 && (
        <ul style={chipsContainerStyle} data-field-relationship-chips>
          {selectedItems.map((item) => (
            <li key={item.id} style={chipStyle} data-field-relationship-chip>
              <span>{getItemLabel(item)}</span>
              {!isReadonly && (
                <button
                  type="button"
                  aria-label={`Remove ${getItemLabel(item)}`}
                  onClick={() => removeItem(item.id)}
                  style={chipBtnStyle}
                  data-field-relationship-chip-remove
                >
                  {'×'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        id={fieldName}
        type="text"
        placeholder="Search…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isReadonly}
        required={isRequired && selectedItems.length === 0}
        style={searchInputStyle}
        data-field-relationship-search
      />

      {showDropdown && (
        <ul role="listbox" style={dropdownStyle}>
          {isFetching && <li style={{ padding: '6px 8px' }}>Loading…</li>}
          {!isFetching && response !== undefined && results.length === 0 && (
            <li style={{ padding: '6px 8px' }}>No results</li>
          )}
          {response !== undefined &&
            results.map((item) => (
              <li key={item.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => addItem({ id: item.id, label: item.name })}
                  style={dropdownItemBtnStyle}
                >
                  {item.name ?? item.id}
                </button>
              </li>
            ))}
        </ul>
      )}

      {isRequired && selectedItems.length === 0 && errors.length === 0 && (
        <span role="alert">This field is required</span>
      )}
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
