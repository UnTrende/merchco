
import React from 'react';
import Button from './Button';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h1>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>{buttonText}</Button>
      )}
    </div>
  );
};

export default PageHeader;
