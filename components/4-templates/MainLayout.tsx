import React, { ReactNode } from 'react';
import Header from '../3-organisms/Header';

export interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({ children, showHeader = true, showFooter = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && (
        <footer className="w-full py-8 px-4 text-center border-t border-gray-200 bg-white">
          <p className="text-gray-600">© {new Date().getFullYear()} Job Start. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact Us
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
