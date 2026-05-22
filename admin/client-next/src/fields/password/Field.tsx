import { useRef, useState } from 'react';
import type { FieldProps } from '../types.js';

export type PasswordValue = boolean | string | { password: string; confirm: string };

/** Password edit widget — shows a toggle button to reveal a new-password form with confirmation. */
export function Field({
  fieldName,
  value,
  onChange,
  isReadonly,
  errors,
}: FieldProps<PasswordValue>) {
  const initialValue = useRef(value);
  const passwordIsSet = Boolean(initialValue.current);
  const [showChangeUI, setShowChangeUI] = useState(!passwordIsSet);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function update(nextPassword: string, nextConfirm: string) {
    onChange({ password: nextPassword, confirm: nextConfirm });
  }

  if (isReadonly) {
    return (
      <div>
        <span>{passwordIsSet ? 'Password set' : '(not set)'}</span>
      </div>
    );
  }

  if (!showChangeUI) {
    return (
      <div>
        <button type="button" onClick={() => setShowChangeUI(true)}>
          {passwordIsSet ? 'Change Password' : 'Set Password'}
        </button>
        {errors.map((err, i) => (
          <span key={i} role="alert">
            {err}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div>
      <input
        name={fieldName}
        type="password"
        value={password}
        onChange={(e) => {
          const nextPassword = e.target.value;
          setPassword(nextPassword);
          update(nextPassword, confirm);
        }}
        placeholder="New password"
        autoComplete="new-password"
        required={!passwordIsSet}
      />
      <input
        name={`${fieldName}_confirm`}
        type="password"
        value={confirm}
        onChange={(e) => {
          const nextConfirm = e.target.value;
          setConfirm(nextConfirm);
          update(password, nextConfirm);
        }}
        placeholder="Confirm new password"
        autoComplete="new-password"
        required={!passwordIsSet || password.length > 0}
      />
      {passwordIsSet && (
        <button
          type="button"
          onClick={() => {
            setPassword('');
            setConfirm('');
            onChange(initialValue.current);
            setShowChangeUI(false);
          }}
        >
          Cancel
        </button>
      )}
      {password !== confirm && confirm.length > 0 && (
        <span role="alert">Passwords must match.</span>
      )}
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
