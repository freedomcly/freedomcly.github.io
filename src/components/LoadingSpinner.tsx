import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    small: { width: '16px', height: '16px', borderWidth: '2px' },
    medium: { width: '24px', height: '24px', borderWidth: '2px' },
    large: { width: '32px', height: '32px', borderWidth: '3px' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="loading-spinner"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          borderWidth: currentSize.borderWidth
        }}
      />

    </div>
  );
}