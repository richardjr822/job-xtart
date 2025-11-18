import React from 'react';
import Link from 'next/link';

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavLinksProps {
  links: NavLink[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function NavLinks({ links, orientation = 'horizontal', className = '' }: NavLinksProps) {
  const orientationStyles = orientation === 'horizontal' ? 'flex gap-6' : 'flex flex-col gap-4';

  return (
    <nav className={`${orientationStyles} ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-inherit font-medium transition-colors hover:text-blue-600"
          target={link.isExternal ? '_blank' : undefined}
          rel={link.isExternal ? 'noopener noreferrer' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
