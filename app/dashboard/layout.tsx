'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context';
import Logo from '@/components/1-atoms/Logo';
import styles from './dashboard.module.css';

type DashboardLayoutProps = {
  children: ReactNode;
};

const BrowseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const ActiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);

const PostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ListingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 7h10M7 12h10M7 17h6" />
  </svg>
);

const ApplicantsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

type NavLink = {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
};

const SEEKER_NAV_LINKS: NavLink[] = [
  { href: '/dashboard/seeker', label: 'Browse Jobs', icon: <BrowseIcon />, exact: true },
  { href: '/dashboard/seeker/applications', label: 'Applications', icon: <ApplicationsIcon /> },
  { href: '/dashboard/seeker/active', label: 'Active Jobs', icon: <ActiveIcon /> },
];

const POSTER_NAV_LINKS: NavLink[] = [
  { href: '/dashboard/poster', label: 'Post Job', icon: <PostIcon />, exact: true },
  { href: '/dashboard/poster/listings', label: 'My Listings', icon: <ListingsIcon /> },
  { href: '/dashboard/poster/applicants', label: 'Applicants', icon: <ApplicantsIcon /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="w-10 h-10 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  const isSeeker = user?.role === 'seeker';
  const navLinks = isSeeker ? SEEKER_NAV_LINKS : POSTER_NAV_LINKS;
  const dashboardHome = isSeeker ? '/dashboard/seeker' : '/dashboard/poster';

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Logo href={dashboardHome} size={28} showText />
        </div>

        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--primary-light)]">
            <p className="text-xs font-medium text-[var(--text-muted)]">Logged in as</p>
            <p className="text-sm font-semibold text-[var(--primary)] capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href, link.exact) ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/profile" className={styles.navLink}>
            <ProfileIcon />
            <span>Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`${styles.navLink} w-full text-[var(--danger)] hover:bg-[var(--danger-light)]`}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
