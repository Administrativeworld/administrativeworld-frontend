import React from 'react';

const LoaderSpinner = ({ className = "h-16 w-16" }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${className}`}></div>
    </div>
  );
};

export default LoaderSpinner;