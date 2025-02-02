import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Badge({ children, ...props }: BadgeProps) {
  return (
    <span
      className="inline-block bg-indigo-500 text-white rounded px-2 py-1 text-xs"
      {...props}
    >
      {children}
    </span>
  );
}