import React from 'react';

const CustomButton = ({
  className,
  onClick,
  style,
  disabled = false,
  btntitle = '',
  children,
}) => {
  const buttonCss = {
    minWidth: '65px',
    height: '32px',
    ...style,
  }
  return (
    <button
      type='button'
      className={`btn ${className}`}
      onClick={onClick}
      style={buttonCss}
      disabled={disabled}
      title={btntitle}
    >
      {children}
    </button>
  );
};

export default CustomButton;
