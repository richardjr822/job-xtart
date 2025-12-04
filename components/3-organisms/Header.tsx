'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useTheme } from '@/context';
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

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    return user.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.logo}>
        <Logo size={30} showText />
      </div>

      <NavLinks links={PUBLIC_NAV_LINKS} orientation="horizontal" className={styles.navLinks} />

      {/* Desktop Actions */}
      <div className={styles.actions}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
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

      {/* Mobile Actions */}
      <div className={styles.mobileActions}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {isAuthenticated ? (
            <>
              <button
                className={styles.mobileMenuItem}
                onClick={() => handleNavigation(getDashboardPath())}
              >
                Dashboard
              </button>
              <button
                className={styles.mobileMenuItem}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.mobileMenuItem}
                onClick={() => handleNavigation('/auth/login')}
              >
                Login
              </button>
              <button
                className={`${styles.mobileMenuItem} ${styles.mobileMenuPrimary}`}
                onClick={() => handleNavigation('/auth/signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
