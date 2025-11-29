'use client';

import Link from 'next/link';
import styles from './page.module.css';
import Header from '../components/3-organisms/Header';

const ProfileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const JobIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const sectionStyle = {
  padding: '4rem 2rem',
  backgroundColor: 'var(--nav-bg)',
  borderBottom: '1px solid var(--border-color)'
};

const headingStyle = {
  fontSize: '2.5rem',
  textAlign: 'center' as const,
  marginBottom: '2rem',
  color: 'var(--text-color)'
};

const paragraphStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  color: 'var(--text-color)',
  opacity: 0.8,
  marginBottom: '2rem',
  textAlign: 'center' as const
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginTop: '2rem'
};

const benefitCardStyle = {
  padding: '2rem',
  backgroundColor: 'var(--nav-bg)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)'
};

const benefitHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem'
};

const benefitTitleStyle = {
  fontSize: '1.25rem',
  color: 'var(--text-color)',
  margin: 0
};

const benefitTextStyle = {
  color: 'var(--text-color)',
  opacity: 0.7,
  lineHeight: '1.6',
  margin: 0
};

const featureCardStyle = {
  padding: '2rem',
  backgroundColor: 'var(--page-bg)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const featureIconContainerStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0749AA'
};

const linkStyle = {
  color: '#0749AA',
  textDecoration: 'none',
  transition: 'opacity 0.2s',
  cursor: 'pointer'
};

export default function LandingPage() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const handleLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = '0.7';
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <section className={styles.mainContent}>
          <h1>Welcome to Job Start</h1>
          <p className={styles.subheadline}>
            Job Start connects you with quick, short-term jobs in your neighborhood.
            No resumes, no long applications. Just real work, right now. <br />
            <strong>Find Flexible Work in Your Community. Today.</strong>
          </p>
          <Link href="/auth/signup" className={styles.ctaButton}>Get Started</Link>
        </section>

        <section id="about-section" style={sectionStyle}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={headingStyle}>About Job Start</h2>
            <p style={paragraphStyle}>
              Job Start is a revolutionary platform designed to bridge the gap between job seekers and employers in your local community. 
              We believe work should be flexible, accessible, and rewarding for everyone.
            </p>
            
            <div style={gridStyle}>
              <div style={benefitCardStyle}>
                <div style={benefitHeaderStyle}>
                  <div style={{ color: '#0749AA', flexShrink: 0 }}>
                    <CheckIcon />
                  </div>
                  <h3 style={benefitTitleStyle}>No Barriers</h3>
                </div>
                <p style={benefitTextStyle}>
                  Start earning immediately without lengthy qualification processes.
                </p>
              </div>

              <div style={benefitCardStyle}>
                <div style={benefitHeaderStyle}>
                  <div style={{ color: '#0749AA', flexShrink: 0 }}>
                    <CheckIcon />
                  </div>
                  <h3 style={benefitTitleStyle}>Fair Rates</h3>
                </div>
                <p style={benefitTextStyle}>
                  Competitive pay rates set by employers in your community.
                </p>
              </div>

              <div style={benefitCardStyle}>
                <div style={benefitHeaderStyle}>
                  <div style={{ color: '#0749AA', flexShrink: 0 }}>
                    <CheckIcon />
                  </div>
                  <h3 style={benefitTitleStyle}>Support</h3>
                </div>
                <p style={benefitTextStyle}>
                  24/7 support to help you succeed on the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features-section" style={sectionStyle}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ ...headingStyle, marginBottom: '3rem' }}>Why Choose Job Start?</h2>
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div
                style={featureCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={featureIconContainerStyle}>
                    <JobIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>Quick & Easy</h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Find and apply for jobs in minutes. No lengthy application process, just connect with opportunities nearby.
                </p>
              </div>

              <div
                style={featureCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={featureIconContainerStyle}>
                    <ProfileIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>Flexible Work</h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Work on your schedule. Choose jobs that fit your lifestyle and earn extra income on your terms.
                </p>
              </div>

              <div
                style={featureCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={featureIconContainerStyle}>
                    <CommunityIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>Local Community</h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Connect with employers and workers in your neighborhood. Build your local network while earning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer style={{
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--nav-bg)',
          color: 'var(--text-color)'
        }}>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
            {new Date().getFullYear()} Job Start. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
              Terms of Service
            </Link>
            <Link href="/contact" style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
              Contact Us
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}