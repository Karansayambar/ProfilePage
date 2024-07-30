import React from 'react';

const ButtonComponent = ({ text, onClick, disabled }) => {
  return (
    <button
      className="btn btn-dark mt-3"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
