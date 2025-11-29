"use client";

import { useState, useEffect } from "react";
import Logo from '../1-atoms/Logo';
import Button from '../1-atoms/Button';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export interface JobsHeaderProps {
  activeTab: 'post' | 'my-posts';
  onTabChange: (tab: 'post' | 'my-posts') => void;
}

export default function JobsHeader({ activeTab, onTabChange }: JobsHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return JSON.parse(savedMode);
      }
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Confirm Logout</h2>
            <p className="mb-6 text-blue-700 dark:text-blue-300">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.topBar}>
        <div className={styles.logo}>
          <Logo href="/jobs" size={30} showText={true} />
        </div>

        <div className="flex gap-8 items-center flex-1 justify-center">
          <button
            onClick={() => onTabChange('post')}
            className={`font-medium px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'post'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Post Job
          </button>
          <button
            onClick={() => onTabChange('my-posts')}
            className={`font-medium px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'my-posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            My Posts
          </button>
        </div>

        <div className={styles.actions}>
          <button
            onClick={toggleDarkMode}
            className={styles.themeToggle}
            aria-label="Toggle dark mode"
          >
            {mounted && (isDarkMode ? <SunIcon /> : <MoonIcon />)}
          </button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </Button>
        </div>
      </header>
    </>
  );
}
