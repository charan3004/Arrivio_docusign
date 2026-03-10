import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-forestGreen text-white hover:bg-forestGreen/90 focus:ring-forestGreen',
    secondary: 'bg-warmSand text-earthBrown hover:bg-warmSand/80 focus:ring-warmSand',
    outline: 'border-2 border-forestGreen text-forestGreen hover:bg-forestGreen hover:text-white focus:ring-forestGreen',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
