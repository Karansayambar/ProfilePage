

import React from 'react';

const Input = ({ type, name, value, placeholder, onChange, className }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`form-control mb-2 ${className}`}
      required
    />
  );
};

export default Input;
