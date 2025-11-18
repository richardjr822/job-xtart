import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface LogoProps {
  href?: string;
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ href = '/', size = 30, showText = true, className = '' }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo.jpg" alt="JobStart Logo" width={size} height={size} priority className="rounded" />
      {showText && <span className="text-lg font-bold">Job Start</span>}
    </div>
  );

  return (
    <Link href={href} className="hover:opacity-80 transition-opacity">
      {content}
    </Link>
  );
}
