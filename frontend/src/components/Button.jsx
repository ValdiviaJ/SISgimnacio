import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline', 'glow'
  onClick, 
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-accentBlue hover:bg-blue-700 text-white border border-transparent shadow-md active:scale-95',
    secondary: 'bg-darkCard hover:bg-darkBorder text-gray-300 border border-darkBorder hover:text-gray-100 active:scale-95',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent active:scale-95',
    outline: 'border border-accentNeon/50 hover:border-accentNeon text-accentNeon hover:bg-accentNeon/5 active:scale-95',
    glow: 'bg-gradient-to-tr from-accentNeon to-accentBlue text-darkBg shadow-glow hover:shadow-glowHover hover:scale-[1.02] active:scale-95 font-bold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed scale-100' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
