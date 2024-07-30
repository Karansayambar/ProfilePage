import React from 'react';

const Input = ({ type, name, value, placeholder, onChange }) => {
  // Input Component takes five parameters
  return (
    <div className="form-group mb-1 mt-2">
      <label htmlFor={name}>{placeholder}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={name}
        aria-describedby="basic-addon1"
      />
    </div>
  );
};

export default Input;
