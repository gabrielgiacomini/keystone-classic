import { useEffect, useState } from 'react';
import type { FieldProps } from '../types.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_12H_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)$/i;
const TIME_24H_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function format12HourTime(hours24: number, minutes: number, seconds: number): string {
  const meridiem = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${pad2(minutes)}:${pad2(seconds)} ${meridiem}`;
}

function splitStoredValue(stored: string | null | undefined): { date: string; time: string } {
  if (stored == null || stored === '') return { date: '', time: '' };
  // The api layer normalizes datetime values to either `YYYY-MM-DDTHH:MM`
  // (legacy local) or an ISO string. Either way `new Date(...)` parses both.
  // We try matching the local form first to avoid timezone surprises when
  // the value was already local.
  const localMatch = stored.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (localMatch !== null) {
    const datePart = localMatch[1] ?? '';
    const h = Number(localMatch[2]);
    const m = Number(localMatch[3]);
    const s = Number(localMatch[4] ?? '0');
    return { date: datePart, time: format12HourTime(h, m, s) };
  }
  const parsed = new Date(stored);
  if (Number.isNaN(parsed.getTime())) return { date: stored, time: '' };
  const date = `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
  const time = format12HourTime(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds());
  return { date, time };
}

function parseTime(raw: string): { h: number; m: number; s: number } | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const m12 = trimmed.match(TIME_12H_RE);
  if (m12 !== null) {
    let h = Number(m12[1]);
    const minutes = Number(m12[2]);
    const seconds = Number(m12[3] ?? '0');
    const meridiem = (m12[4] ?? '').toLowerCase();
    if (h === 12) h = 0;
    if (meridiem === 'pm') h += 12;
    return { h, m: minutes, s: seconds };
  }
  const m24 = trimmed.match(TIME_24H_RE);
  if (m24 !== null) {
    return {
      h: Number(m24[1]),
      m: Number(m24[2]),
      s: Number(m24[3] ?? '0'),
    };
  }
  return null;
}

function combineValues(date: string, time: string): string {
  // Returns the legacy "YYYY-MM-DDTHH:MM" local form when both are valid;
  // returns an invalid date-time string when both parts are present but the
  // time is unparseable so the api layer rejects the submitted value.
  if (!DATE_RE.test(date)) return '';
  const parsed = parseTime(time);
  if (parsed === null) return time.trim() === '' ? '' : `${date}T${time}`;
  return `${date}T${pad2(parsed.h)}:${pad2(parsed.m)}`;
}

/**
 * Date-and-time edit widget for datetime fields. Renders two side-by-side
 * text inputs (date + time) and a "Now" button, matching the legacy admin's
 * `DatetimeField` shape.
 */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<string>) {
  // Local state holds the user-visible strings so partial / invalid input
  // doesn't get thrown away as soon as it's typed. We sync up to the form's
  // canonical value via `onChange` whenever both parts parse cleanly.
  const initial = splitStoredValue(value);
  const [dateValue, setDateValue] = useState(initial.date);
  const [timeValue, setTimeValue] = useState(initial.time);

  // Sync local state when the upstream value changes (e.g., form reset).
  useEffect(() => {
    const next = splitStoredValue(value);
    setDateValue(next.date);
    setTimeValue(next.time);
  }, [value]);

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: 4,
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
  };

  const nowBtnStyle: React.CSSProperties = {
    flex: '0 0 auto',
    padding: '0 12px',
    background: 'var(--ks-bg-muted, #eee)',
    color: 'var(--ks-text, #333)',
    border: '1px solid var(--ks-border, #ccc)',
    borderRadius: 4,
    cursor: 'pointer',
    font: 'inherit',
    lineHeight: 1,
    minWidth: 50,
  };

  function emit(nextDate: string, nextTime: string) {
    const combined = combineValues(nextDate, nextTime);
    onChange(combined);
  }

  function handleDateChange(raw: string) {
    setDateValue(raw);
    emit(raw, timeValue);
  }

  function handleTimeChange(raw: string) {
    setTimeValue(raw);
    emit(dateValue, raw);
  }

  function handleNow() {
    const now = new Date();
    const nextDate = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const nextTime = format12HourTime(now.getHours(), now.getMinutes(), now.getSeconds());
    setDateValue(nextDate);
    setTimeValue(nextTime);
    emit(nextDate, nextTime);
  }

  return (
    <div>
      <div style={wrapperStyle}>
        <input
          id={fieldName}
          name={`${fieldName}_date`}
          type="text"
          placeholder="YYYY-MM-DD"
          value={dateValue}
          onChange={(e) => handleDateChange(e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
          style={inputStyle}
          data-field-datetime-date
        />
        <input
          name={`${fieldName}_time`}
          type="text"
          placeholder="HH:MM:SS am/pm"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
          style={inputStyle}
          data-field-datetime-time
          autoComplete="off"
        />
        {!isReadonly && (
          <button
            type="button"
            onClick={handleNow}
            style={nowBtnStyle}
            data-field-datetime-now
          >
            Now
          </button>
        )}
      </div>
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
