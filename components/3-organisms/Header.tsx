'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import Logo from '../1-atoms/Logo';
import NavLinks, { NavLink } from '../2-molecules/NavLinks';
import Button from '../1-atoms/Button';
import styles from './page.module.css';

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about-section' },
  { label: 'Features', href: '/#features-section' },
];

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode, mounted]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleLogout = async () => {
    await logout();
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    return user.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.logo}>
        <Logo size={30} showText />
      </div>

      <NavLinks links={PUBLIC_NAV_LINKS} orientation="horizontal" className={styles.navLinks} />

      <div className={styles.actions}>
        <button
          onClick={toggleDarkMode}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {mounted && (isDarkMode ? <SunIcon /> : <MoonIcon />)}
        </button>

        {isAuthenticated ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(getDashboardPath())}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
