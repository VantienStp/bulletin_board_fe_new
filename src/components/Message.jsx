// src/components/Message.jsx
"use client";

import React from 'react';

/**
 * @param {string} variant 
 * @param {React.ReactNode} children
 */
const Message = ({ variant = 'info', children }) => {
  let baseClasses = 'p-3 rounded-lg text-sm ';
  let specificClasses = '';

  switch (variant) {
    case 'danger':
      specificClasses = 'bg-red-100 border border-red-400 text-red-700';
      break;
    case 'success':
      specificClasses = 'bg-green-100 border border-green-400 text-green-700';
      break;
    case 'warning':
      specificClasses = 'bg-yellow-100 border border-yellow-400 text-yellow-700';
      break;
    case 'info':
    default:
      specificClasses = 'bg-blue-100 border border-blue-400 text-blue-700';
      break;
  }

  return (
    <div className={`${baseClasses} ${specificClasses} mb-4`} role="alert">
      {children}
    </div>
  );
};

export default Message;