import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = false 
}) => {
  const hoverClass = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  
  return (
    <div
      className={`card ${hoverClass} transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};





