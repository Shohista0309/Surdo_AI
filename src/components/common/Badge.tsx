import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'verified' | 'demo' | 'forest' | 'sage' | 'brown' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'md',
  icon,
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-semibold px-2.5 py-1';

  let variantClasses = '';
  switch (variant) {
    case 'verified':
      variantClasses = 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm';
      break;
    case 'demo':
      variantClasses = 'bg-amber-100 text-amber-900 border border-amber-300';
      break;
    case 'forest':
      variantClasses = 'bg-surdo-forest text-surdo-cream';
      break;
    case 'sage':
      variantClasses = 'bg-surdo-sage/30 text-surdo-forest border border-surdo-sage/60';
      break;
    case 'brown':
      variantClasses = 'bg-surdo-beige text-surdo-cocoa border border-surdo-brown/30';
      break;
    case 'outline':
      variantClasses = 'border border-surdo-forest/20 text-surdo-forest bg-white/60';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
