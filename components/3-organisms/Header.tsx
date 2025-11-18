"use client";

import { useState, useEffect } from "react";
import Logo from '../1-atoms/Logo';
import NavLinks, { NavLink } from '../2-molecules/NavLinks';
import Button from '../1-atoms/Button';
import styles from './page.module.css';

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

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about-section' },
  { label: 'Features', href: '/#features-section' },
];

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.logo}>
        <Logo size={30} showText={true} />
      </div>

      <NavLinks links={navLinks} orientation="horizontal" className={styles.navLinks} />

      <div className={styles.actions}>
        <button
          onClick={toggleDarkMode}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.location.href = '/auth/login'}
          className={styles.loginButton}
        >
          Login
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => window.location.href = '/auth/signup'}
          className={styles.authButton}
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
