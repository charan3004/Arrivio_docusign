import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  error,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-earthBrown mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-lg border-2 
          ${error ? 'border-red-500' : 'border-warmSand'} 
          bg-white text-charcoal 
          focus:outline-none focus:ring-2 focus:ring-forestGreen focus:border-forestGreen
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
