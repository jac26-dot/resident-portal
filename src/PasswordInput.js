import React, { useState } from 'react';
import './password-input.css';

const PasswordInput = React.forwardRef(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-field">
      <input {...props} ref={ref} type={show ? 'text' : 'password'} />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
});

export default PasswordInput;