import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Alert({ children, className = '', variant = 'default', ...props }) {
  const baseStyles = 'relative w-full rounded-lg border p-4';
  const variantStyles = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <div
      className={`mt-2 text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}