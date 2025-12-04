'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useData } from '@/context';
import Logo from '@/components/1-atoms/Logo';
import Avatar from '@/components/1-atoms/Avatar';
import { ConfirmModal } from '@/components/1-atoms/Modal';
import ThemeToggle from '@/components/1-atoms/ThemeToggle';
import NotificationCenter from '@/components/2-molecules/NotificationCenter';
import styles from './dashboard.module.css';

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

const ReviewsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
  { href: '/dashboard/reviews', label: 'My Reviews', icon: <ReviewsIcon /> },
];

const POSTER_NAV_LINKS: NavLink[] = [
  { href: '/dashboard/poster', label: 'Post Job', icon: <PostIcon />, exact: true },
  { href: '/dashboard/poster/listings', label: 'My Listings', icon: <ListingsIcon /> },
  { href: '/dashboard/poster/applicants', label: 'Applicants', icon: <ApplicantsIcon /> },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: <ReviewsIcon /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { getUserById } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentUser = user ? getUserById(user.id) : null;
  const isCompleteProfilePage = pathname === '/dashboard/complete-profile';

  useEffect(() => {
    if (!isLoading && currentUser && !currentUser.profileCompleted && !isCompleteProfilePage) {
      router.replace('/dashboard/complete-profile');
    }
  }, [currentUser, isLoading, isCompleteProfilePage, router]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setShowLogoutModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="w-10 h-10 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (isCompleteProfilePage) {
    return <>{children}</>;
  }

  const isSeeker = user?.role === 'seeker';
  const navLinks = isSeeker ? SEEKER_NAV_LINKS : POSTER_NAV_LINKS;
  const dashboardHome = isSeeker ? '/dashboard/seeker' : '/dashboard/poster';

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mobileHeader}>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={styles.menuButton}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        <Logo href={dashboardHome} size={24} showText />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationCenter />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className="flex items-center justify-between w-full">
            <Logo href={dashboardHome} size={28} showText />
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={styles.closeButton}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.userInfo}>
          <div className="flex items-center gap-3">
            <Avatar 
              src={currentUser?.profile?.avatar} 
              name={currentUser?.username || user?.email} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-color)] truncate">
                {currentUser?.username || 'User'}
              </p>
              <p className="text-xs text-[var(--text-muted)] capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={`${styles.navLink} ${isActive(link.href, link.exact) ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <ThemeToggle showLabel className={`${styles.navLink} w-full`} />
          <Link href="/dashboard/profile" onClick={handleNavClick} className={styles.navLink}>
            <ProfileIcon />
            <span>Profile</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`${styles.navLink} w-full text-[var(--danger)] hover:bg-[var(--danger-light)]`}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        variant="danger"
      />
    </div>
  );
}
