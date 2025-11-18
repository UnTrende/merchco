
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
    none: 'p-0',
  };

  return (
    <div className={`bg-panel rounded-card shadow-soft ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
