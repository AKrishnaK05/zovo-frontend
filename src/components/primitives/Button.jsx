// frontend/src/components/primitives/Button.jsx
import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 font-medium shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
