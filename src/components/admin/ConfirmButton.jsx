import { useState } from 'react';

export default function ConfirmButton({ onConfirm, children = 'Delete', label = 'Confirm?' }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className={`btn ${armed ? 'danger' : ''}`}
      onClick={() => {
        if (armed) onConfirm();
        else setArmed(true);
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? label : children}
    </button>
  );
}
