import React from 'react';

const Card = ({ children, title, subtitle, className = '', hoverGlow = false }) => {
  return (
    <div 
      className={`bg-darkCard border border-darkBorder rounded-2xl p-6 transition-all duration-300 ${
        hoverGlow ? 'hover:shadow-glow hover:border-accentNeon/40' : ''
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-bold text-gray-100">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
