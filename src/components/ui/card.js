import React from 'react';
import clsx from 'clsx';

// Main Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={clsx('bg-white shadow-md rounded-lg p-6', className)}>
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ children, className }) => {
  return (
    <div className={clsx('border-b pb-4 mb-4', className)}>
      {children}
    </div>
  );
};

// CardTitle Component
export const CardTitle = ({ children, className }) => {
  return (
    <h2 className={clsx('text-xl font-semibold text-gray-700', className)}>
      {children}
    </h2>
  );
};

// CardContent Component (Optional)
export const CardContent = ({ children, className }) => {
  return (
    <div className={clsx('text-gray-600', className)}>
      {children}
    </div>
  );
};
